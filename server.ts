import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON bodies
app.use(express.json());

// Initialize Gemini client lazily to avoid startup crashes if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Generate a bouquet image without exposing GEMINI_API_KEY to the browser.
app.post("/api/bouquet/image", async (req, res) => {
  try {
    const flowers = Array.isArray(req.body?.flowers)
      ? req.body.flowers.filter((flower: unknown): flower is string => typeof flower === "string").slice(0, 12)
      : [];

    if (!flowers.length) {
      return res.status(400).json({ error: "Please select at least one flower." });
    }

    const ai = getGeminiClient();
    const prompt = `Create a refined Victorian tussie-mussie bouquet arranged as a botanical still-life on a warm ivory background. Use these flowers exactly as the symbolic bouquet: ${flowers.join(", ")}. Show an elegant hand-tied bouquet with natural stems, detailed petals, soft editorial lighting, subtle vintage paper texture, and no text, labels, hands, or extra objects.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: prompt,
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((part: any) => part.inlineData?.data);
    if (!imagePart?.inlineData?.data) {
      return res.status(502).json({ error: "Gemini did not return a bouquet image." });
    }

    const mimeType = imagePart.inlineData.mimeType || "image/png";
    res.json({ imageUrl: `data:${mimeType};base64,${imagePart.inlineData.data}` });
  } catch (error: any) {
    console.error("Bouquet image API error:", error);
    res.status(500).json({ error: error.message || "Bouquet image generation failed." });
  }
});

// API endpoint for research generation
app.post("/api/research", async (req, res) => {
  try {
    const { query, reportType, languageStyle, customFormat } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Query string is required" });
    }

    const ai = getGeminiClient();

    // Custom system instructions based on parameters
    let styleDescription = "";
    switch (languageStyle) {
      case "simple":
        styleDescription = "Clear, accessible, and engaging for a general audience. Explain technical terms simply while remaining objective.";
        break;
      case "academic":
        styleDescription = "Rigorous, scholarly, and technical. Use standard industry or academic terminology with tight structure and solid evidence.";
        break;
      case "objective":
      default:
        styleDescription = "Objective, analytical, and strictly grounded in factual search evidence without subjective bias.";
        break;
    }

    let typeInstructions = "";
    switch (reportType) {
      case "competitive":
        typeInstructions = "Produce a Competitive Research Report. Compare different entities, companies, products, or technical approaches on pros/cons, market performance, technical features, competitive landscape, and key points of divergence.";
        break;
      case "factcheck":
        typeInstructions = "Produce a Fact Verification Report. Verify the veracity of key claims or news items. Clearly distinguish established facts from false claims, misleading narratives, or unverified speculations.";
        break;
      case "brief":
      default:
        typeInstructions = "Produce an Executive Research Brief. Outline core concepts, latest developments, key findings, chronological timeline, and consensus viewpoints.";
        break;
    }

    const customInstructions = customFormat ? `User Custom Style/Format Requirements: ${customFormat}\n` : "";

    const systemInstruction = `You are a senior research analyst and fact-verification expert. Your task is to conduct Google searches and synthesize a comprehensive, data-rich research report based on verified search data.

Writing Style: ${styleDescription}
Report Orientation: ${typeInstructions}
${customInstructions}

Perform deep searches on the user query, and output a structured JSON report.
CRITICAL: You MUST map every conclusion, fact, and claim directly to the 0-based index of the Google Search Grounding Chunks (e.g. 0, 1, 2...) in the citations arrays.

Your output JSON must strictly match the following TypeScript interface:
interface ResearchResponse {
  title: string; // Report title
  isTimeSensitive: boolean; // Whether the subject is rapidly evolving or time-sensitive
  timeSensitiveReason: string; // Brief explanation if time-sensitive, empty string if not
  summary: string; // Executive summary (approx 200 words)
  conclusions: Array<{
    id: string; // e.g., "conclusion-1"
    text: string; // Detailed conclusion text with citations
    citations: number[]; // 0-based indices referencing search grounding sources
  }>;
  sources: Array<{
    chunkIndex: number; // 0-based grounding index
    title: string; // Web page title
    url: string; // Source URL
    publishDate: string; // Publication date or recent estimate (e.g. "2026-05-12" or "Recent")
    credibilityScore: "High" | "Medium" | "Low"; // Credibility rating
    credibilityRationale: string; // Rationale for credibility rating
    snippet: string; // Key quote or excerpt from the source
  }>;
  factOpinionAnalysis: Array<{
    statement: string; // Key statement or claim analyzed
    type: "Fact" | "Opinion" | "Speculation"; // Classification
    rationale: string; // Rationale for classification
    citations: number[]; // Citation indices
  }>;
  timeline: Array<{
    date: string; // Date or period (e.g., "2024", "March 2026", "Recent")
    event: string; // Event title
    description: string; // Event description
    citations: number[]; // Citation indices
  }>;
  conflictAnalysis: Array<{
    topic: string; // Divergent/controversial topic
    description: string; // Summary of core disagreement
    contradictoryViews: Array<{
      sourceName: string; // Source or entity name holding this view
      view: string; // View statement
      citations: number[]; // Citation indices
    }>;
  }>;
}

Rules:
1. Output MUST be pure JSON only without markdown code blocks.
2. Ensure JSON is strictly valid.
3. Fully leverage search grounding data; do not invent citations or links.
4. Ensure all response text is in English.`;

    const userPrompt = `Conduct in-depth search and write a research report on:
"${query}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Model returned empty response.");
    }

    // Parse the JSON
    let parsedData;
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch (parseErr) {
      console.error("JSON Parsing failed. Response was:", responseText);
      return res.status(500).json({
        error: "Failed to parse research report format",
        details: responseText,
      });
    }

    // Extract real search grounding metadata from Gemini response
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Map grounding chunks into client-friendly list
    const realSearchSources = groundingChunks.map((chunk, index) => ({
      index: index,
      title: chunk.web?.title || "Web Source",
      url: chunk.web?.uri || "",
    }));

    // Respond with both the structured JSON report and the raw grounding links
    res.json({
      report: parsedData,
      groundingSources: realSearchSources,
    });

  } catch (error: any) {
    console.error("Research API Error:", error);
    res.status(500).json({
      error: error.message || "An unknown error occurred during research generation",
    });
  }
});

// API endpoint for individual free studio apps (Alternatives)
app.post("/api/studio", async (req, res) => {
  try {
    const { appId, inputs } = req.body;
    if (!appId || !inputs) {
      return res.status(400).json({ error: "appId and inputs are required" });
    }

    const ai = getGeminiClient();
    let prompt = "";
    let systemInstruction = "";
    let useSearch = false;

    if (appId === "ai-copywriter") {
      useSearch = true;
      systemInstruction = `You are a top-tier AIDA/PAS marketing copywriting expert. Generate structured, high-converting copy in English based on the user's inputs.
Output strictly pure JSON matching:
{
  "headlines": string[], // 3-4 high-converting headlines
  "hooks": string[], // 3-4 video hooks or opening sentences
  "sections": Array<{ "title": string, "content": string }>, // Formatted copy sections under AIDA/PAS framework
  "frameworkUsed": string, // Framework used e.g., "AIDA (Attention, Interest, Desire, Action)"
  "strategicAdvice": string[] // 3 actionable growth or channel optimization suggestions
}`;
      prompt = `Brand/Product Name: ${inputs.brandName || "Unspecified"}
Core Feature/Service Description: ${inputs.description}
Target Audience: ${inputs.targetAudience || "General Market"}
Desired Format/Channel: ${inputs.copyFormat || "Social Media & Ad Campaign Strategy"}
Special Constraints/Preferences: ${inputs.constraints || "None"}`;

    } else if (appId === "semantic-seo") {
      useSearch = true;
      systemInstruction = `You are a senior SEO & Semantic Analyst. Search Google real-time data to analyze seed keywords and competitor positioning, uncovering high-ROI content voids and long-tail keyword opportunities.
Output strictly pure JSON matching:
{
  "coreAssessment": string, // ~150-word assessment of competitive landscape and semantic density
  "competitorVoids": Array<{ "topic": string, "priority": "High" | "Medium" | "Low", "gapDescription": string }>,
  "keywordOpportunities": Array<{ "keyword": string, "searchIntent": string, "difficulty": number, "recommendedFocus": string }>,
  "contentStrategyPlan": string[] // 3-step SEO content execution roadmap
}`;
      prompt = `Seed Keywords/Topic: ${inputs.seedKeywords}
Competitor Websites/Info: ${inputs.competitors || "None specified; search relevant industry competitors"}
Target Search Intent: ${inputs.targetIntent || "Full Market Analysis"}`;

    } else if (appId === "code-architect") {
      systemInstruction = `You are a senior Principal Frontend and Full-Stack Engineer. Your task is to generate high-quality, production-ready code components or scripts with clean English comments.
Output strictly pure JSON matching:
{
  "architectureOverview": string, // Physical structure and architecture explanation
  "codeBlocks": Array<{ "language": string, "filename": string, "code": string, "explanation": string }>,
  "implementationGuide": string[], // Step-by-step integration and deployment guide
  "bestPractices": string[] // 2-3 security, performance, and maintainability best practices
}`;
      prompt = `Requirements: ${inputs.requirement}
Target Tech Stack: ${inputs.techStack || "Tailwind CSS & React"}
UI Style Preference: ${inputs.stylePreference || "Modern Minimalist"}`;

    } else if (appId === "document-engine") {
      systemInstruction = `You are a world-class business consultant and audit compliance expert. Analyze the input document or text for key facts, contradictions, risks, and actionable insights.
Output strictly pure JSON matching:
{
  "documentAbstract": string, // Executive abstract of document (~150 words)
  "findings": Array<{ "point": string, "level": "Critical" | "Warning" | "Info", "evidence": string, "rationale": string }>,
  "structuredMetrics": Array<{ "label": string, "value": string, "context": string }>,
  "riskAssessment": string, // Overall risk rating and summary
  "actionItems": string[] // 3 recommended action steps
}`;
      prompt = `Document Content / Data:
${inputs.documentText}

Audit Focus / Key Questions: ${inputs.focusQuestions || "Comprehensive business compliance & risk audit"}`;

    } else if (appId === "translation-matrix") {
      systemInstruction = `You are a world-class technical translation and localization specialist. Translate and adapt input text into fluent, culturally aligned text in the target language.
Output strictly pure JSON matching:
{
  "sourceAnalyzed": {
    "detectedLocale": string, // Detected source language and tone
    "stylisticMarkers": string[] // Jargon, tone, or style tags
  },
  "translatedText": string, // High-quality localized translation
  "culturalLocalizationNotes": Array<{ "term": string, "explanation": string }>,
  "alternativeToneVariations": Array<{ "tone": string, "text": string }> // 2 alternative tone variations
}`;
      prompt = `Source Text to Localize:
${inputs.text}

Target Language: ${inputs.targetLanguage}
Target Tone/Context: ${inputs.toneStyle || "Standard Business / Professional"}`;
    } else {
      return res.status(400).json({ error: "Unsupported appId" });
    }

    const config: any = {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.2,
    };

    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: config,
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Model returned empty response.");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch (parseErr) {
      console.error("Studio JSON Parsing failed. Response was:", responseText);
      return res.status(500).json({
        error: "Failed to parse generated studio output",
        details: responseText,
      });
    }

    res.json(parsedData);

  } catch (error: any) {
    console.error("Studio API Error:", error);
    res.status(500).json({
      error: error.message || "An unknown error occurred during generation",
    });
  }
});

// API endpoint for Superworkers Standardized Workflow
app.post("/api/superworker", async (req, res) => {
  try {
    const { task, domain, inputs } = req.body;
    if (!task) {
      return res.status(400).json({ error: "Task is required" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are a Superworker AI agent adhering to the Superworkers Skill Protocol.
Your workflow comprises four stages: Discovery, Processing, Synthesis, and Auditing.
Execute these four steps for the specified Task and Domain, utilizing Google Search Grounding for real-time facts where helpful. Output all text in English.

You MUST strictly output pure JSON matching this structure (without markdown code blocks):
{
  "discovery": {
    "searchQueries": string[], // Search queries/angles used
    "keyFindings": string[], // Core facts discovered
    "groundingLinks": string[] // Grounding source URLs
  },
  "processing": {
    "dataTransformations": string[], // Structured data transformations applied
    "logicApplied": string // Business logic or framework applied
  },
  "synthesis": {
    "finalOutput": any, // Primary deliverable (object, array, or string) containing code, copy, or analysis
    "confidenceScore": number // 0-100 confidence rating
  },
  "auditing": {
    "potentialBiases": string[], // Potential biases
    "limitations": string[], // Operational limitations
    "verificationSteps": string[] // Recommended verification steps for the user
  }
}`;

    const userPrompt = `Domain: ${domain || 'General'}\nTask: ${task}\nAdditional Inputs: ${JSON.stringify(inputs || {})}\n\nExecute the Superworker workflow in English.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Model returned empty response.");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch (parseErr) {
      console.error("Superworker JSON Parsing failed. Response was:", responseText);
      return res.status(500).json({
        error: "Failed to parse Superworker response format",
        details: responseText,
      });
    }

    res.json(parsedData);

  } catch (error: any) {
    console.error("Superworker API Error:", error);
    res.status(500).json({
      error: error.message || "An unknown error occurred executing Superworker workflow",
    });
  }
});

// Serve frontend assets and start listening
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    // Vite integration in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Static serving in production
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files with custom Cache-Control headers
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        // Vite's hashed assets can be cached safely forever
        if (filePath.match(/\.(js|css|woff2?|png|jpe?g|gif|svg|ico)$/)) {
          res.set("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          // All other static assets must validate
          res.set("Cache-Control", "no-cache, no-store, must-revalidate");
        }
      }
    }));

    app.get("*", (req, res) => {
      res.set("Cache-Control", "no-cache, no-store, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Bind to port 3000 and 0.0.0.0 as required by the reverse proxy
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
});
