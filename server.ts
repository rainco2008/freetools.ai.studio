import express from "express";
import path from "path";

const app = express();
const PORT = Number(process.env.PORT || 3000);

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
