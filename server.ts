import express from "express";
import path from "path";
import { loadEnvFile } from "node:process";
import { GoogleGenAI } from "@google/genai";

try {
  loadEnvFile();
} catch (error) {
  const code = (error as NodeJS.ErrnoException).code;
  if (code !== "ENOENT") throw error;
}

const app = express();
const PORT = Number(process.env.PORT || 3000);
const BOUQUET_RATE_LIMIT = 5;
const BOUQUET_RATE_WINDOW_MS = 60 * 60 * 1000;
const bouquetRequests = new Map<string, { count: number; resetAt: number }>();

app.use(express.json({ limit: "32kb" }));

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  geminiClient ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return geminiClient;
}

function bouquetRateLimit(request: express.Request, response: express.Response) {
  const now = Date.now();
  const key = request.ip || request.socket.remoteAddress || "unknown";
  const current = bouquetRequests.get(key);
  const bucket =
    !current || current.resetAt <= now
      ? { count: 0, resetAt: now + BOUQUET_RATE_WINDOW_MS }
      : current;

  if (bucket.count >= BOUQUET_RATE_LIMIT) {
    response.set("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
    response.status(429).json({
      error: "Image generation limit reached. Please try again later.",
    });
    return false;
  }

  bucket.count += 1;
  bouquetRequests.set(key, bucket);
  return true;
}

app.post("/api/bouquet/image", async (request, response) => {
  if (!bouquetRateLimit(request, response)) return;

  const flowers = Array.isArray(request.body?.flowers)
    ? request.body.flowers
        .filter(
          (flower: unknown): flower is string =>
            typeof flower === "string" &&
            /^[\p{L}\p{M} .'-]{1,60}$/u.test(flower.trim()),
        )
        .map((flower: string) => flower.trim())
        .slice(0, 12)
    : [];

  if (!flowers.length) {
    response.status(400).json({ error: "Please select at least one valid flower." });
    return;
  }

  try {
    const prompt = [
      "Create a refined Victorian tussie-mussie bouquet as a botanical still life.",
      `Include these flowers: ${flowers.join(", ")}.`,
      "Arrange them as an elegant hand-tied bouquet with natural stems, detailed petals,",
      "soft editorial lighting, a warm ivory background, and subtle vintage paper texture.",
      "Do not include text, labels, hands, people, vases, or unrelated objects.",
    ].join(" ");
    const result = await getGeminiClient().models.generateContent({
      model: process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image",
      contents: prompt,
      config: {
        responseModalities: ["IMAGE"],
      },
    });
    const imagePart = result.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData?.data,
    );

    if (!imagePart?.inlineData?.data) {
      response.status(502).json({ error: "The image service did not return an image." });
      return;
    }

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    response.json({
      imageUrl: `data:${mimeType};base64,${imagePart.inlineData.data}`,
    });
  } catch (error) {
    console.error("Bouquet image generation failed:", error);
    const configurationMissing =
      error instanceof Error && error.message.includes("GEMINI_API_KEY");
    response.status(configurationMissing ? 503 : 502).json({
      error: configurationMissing
        ? "Bouquet generation is not configured yet."
        : "Bouquet generation is temporarily unavailable. Please try again.",
    });
  }
});

async function bootstrap() {
  const isProduction =
    process.env.NODE_ENV === "production" || process.argv.includes("--production");

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(
      express.static(distPath, {
        setHeaders: (response, filePath) => {
          if (filePath.match(/\.(js|css|woff2?|png|jpe?g|gif|svg|ico|wasm)$/)) {
            response.set("Cache-Control", "public, max-age=31536000, immutable");
          } else {
            response.set("Cache-Control", "no-cache");
          }
        },
      }),
    );

    app.get("*", (_request, response) => {
      response.set("Cache-Control", "no-cache");
      response.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Free Tools server running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
