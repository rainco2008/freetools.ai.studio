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
      return res.status(400).json({ error: "查询问题不能为空且必须为字符串" });
    }

    const ai = getGeminiClient();

    // Custom system instructions based on parameters
    let styleDescription = "";
    switch (languageStyle) {
      case "simple":
        styleDescription = "通通易懂、生动形象，适合大众阅读。用浅显的语言解释专业名词，保持客观。";
        break;
      case "academic":
        styleDescription = "专业学术、严谨客观。使用标准的学术或行业术语，结构严密，论证扎实。";
        break;
      case "objective":
      default:
        styleDescription = "客观严谨、不偏不倚。字斟句酌，严格根据搜索证据进行陈述，避免主观抒情。";
        break;
    }

    let typeInstructions = "";
    switch (reportType) {
      case "competitive":
        typeInstructions = "编写一份‘竞品报告’。重点对比不同实体、公司、产品或技术路线的优劣势、市场表现、技术特点，梳理竞争格局和主要分歧点。";
        break;
      case "factcheck":
        typeInstructions = "编写一份‘事实核查报告’。重点核实该传言、新闻或论断的真实性。明确指出哪些部分是确凿事实，哪些是谣言或误导，哪些属于无法证实的推测。";
        break;
      case "brief":
      default:
        typeInstructions = "编写一份‘研究简报’。重点快速梳理该领域的核心概念、最新进展、关键结论、时间线和主流观点。";
        break;
    }

    const customInstructions = customFormat ? `用户自定义格式与风格要求: ${customFormat}\n` : "";

    const systemInstruction = `你是一个资深的智能搜索研究员与事实核查专家。你的任务是根据 Google 搜索返回的最新、最可靠的数据，为用户撰写一份内容扎实、数据详尽、可深度核查的研究报告。

你的写作风格必须遵循：${styleDescription}
报告类型定位：${typeInstructions}
${customInstructions}

请针对用户的查询，进行深度搜索，并将搜索结果整理并提炼为符合以下结构的 JSON 格式。
【特别要求：你必须在返回的 JSON 中，将所有的结论和事实关联到 Google 搜索返回的 Grounding Chunks 索引（0-based 索引，即 0, 1, 2...）。在 citations 数组中列出这些引用的索引。】

你输出的 JSON 结构必须严格符合以下 TypeScript 接口：
interface ResearchResponse {
  title: string; // 报告标题，例如“关于 xxx 的事实核查与竞品研究报告”
  isTimeSensitive: boolean; // 针对该问题，信息是否具有较强的时效性、可能会随时间迅速发生变化？
  timeSensitiveReason: string; // 若具有时效性，请用一句话解释原因（例如：“由于该技术处于初创阶段，最新版本和竞争态势可能已发生变化”）；若不具时效性，留空。
  summary: string; // 200字左右的执行摘要
  conclusions: Array<{
    id: string; // e.g., "conclusion-1"
    text: string; // 结论的详细阐述。必须附带 citation 索引，说明此结论源于哪些网页。
    citations: number[]; // 引用 Google 搜索返回网页的 0-based 索引，例如 [0, 2]
  }>;
  sources: Array<{
    chunkIndex: number; // 对应的 Google 搜索 grounding 网页 0-based 索引
    title: string; // 网页标题
    url: string; // 网页链接
    publishDate: string; // 网页发布日期或最近更新时间（例如 "2026-05-12"），如果无法确定，请写“近期”或具体估算年份
    credibilityScore: "High" | "Medium" | "Low"; // 该来源的可信度评级：高、中、低
    credibilityRationale: string; // 评级理由（例如：“官方技术文档，权威度极高”、“知名行业媒体，具有较高参考价值”、“个人博客，观点偏主观，需多方交叉验证”）
    snippet: string; // 该来源中最核心的引用片段或关键论点摘要
  }>;
  factOpinionAnalysis: Array<{
    statement: string; // 提取的关键论点/陈述
    type: "Fact" | "Opinion" | "Speculation"; // 区分：Fact(确凿事实，有数据或官方认证)、Opinion(主观观点，来自某专家、媒体或个人)、Speculation(合理推测，属于未来展望或尚未证实的猜测)
    rationale: string; // 归类为该类型的详细理由，结合搜索数据进行分析
    citations: number[]; // 引用的网页索引
  }>;
  timeline: Array<{
    date: string; // 时间节点名称（如 "2023年","2026年3月", "近期"）
    event: string; // 事件标题
    description: string; // 事件的详细描述或对该时间点进展的梳理
    citations: number[]; // 引用的网页索引
  }>;
  conflictAnalysis: Array<{
    topic: string; // 冲突/分歧的主题（如“关于定价的争议”、“关于技术路线 A 与 B 的分歧”）
    description: string; // 简要描述各方的核心分歧点是什么
    contradictoryViews: Array<{
      sourceName: string; // 提出该观点的来源名称或索引（例如：“来源 [0] 认为” 或 “主流媒体指出”）
      view: string; // 具体的观点陈述
      citations: number[]; // 引用的网页索引
    }>;
  }>;
}

注意：
1. 必须返回纯 JSON，不能包裹在 \`\`\`json ... \`\`\` 标记中。
2. 确保 JSON 完全合规，双引号及逗号不要缺失，不要出现解析错误。
3. 务必完全利用搜索接地的数据，切忌凭空虚构链接或结论。如果搜索结果没有提到冲突，可以提供一个空的 conflictAnalysis 数组；如果没有明确的时间线，可以写空 timeline 数组，但应尽量根据搜索数据中提到的时间点进行整理。
4. 确保 isTimeSensitive 逻辑正确。如涉及最新科技产品、新闻动态、实时股市等，标记为 true 并给出友好的变动提示。`;

    const userPrompt = `请对以下问题进行全面深入的搜索与研报撰写：
"${query}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        temperature: 0.2, // Low temperature for higher accuracy and factual consistency
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("模型未返回任何文本内容。");
    }

    // Parse the JSON
    let parsedData;
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch (parseErr) {
      console.error("JSON Parsing failed. Response was:", responseText);
      return res.status(500).json({
        error: "生成报告的格式解析失败",
        details: responseText,
      });
    }

    // Extract real search grounding metadata from Gemini response
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Map grounding chunks into client-friendly list
    const realSearchSources = groundingChunks.map((chunk, index) => ({
      index: index,
      title: chunk.web?.title || "未知网页",
      url: chunk.web?.uri || "",
    }));

    // Respond with both the structured JSON report and the raw grounding links to ensure perfect synchronization
    res.json({
      report: parsedData,
      groundingSources: realSearchSources,
    });

  } catch (error: any) {
    console.error("Research API Error:", error);
    res.status(500).json({
      error: error.message || "进行智能搜索并生成报告时发生未知错误",
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
      useSearch = true; // Set to true to search competitor messaging / references
      systemInstruction = `你是一个顶级 AIDA/PAS 营销文案写作专家。针对用户提供的品牌、产品及受众，生成结构化且转化率极高、契合多语境要求的文案。
你必须严格输出符合以下结构的纯 JSON 格式数据：
{
  "headlines": string[], // 3-4 个极其抓人眼球的标题（包含点击欲望和好奇心公式）
  "hooks": string[], // 3-4 个黄金前三秒视频引子或强力文章开头
  "sections": Array<{ "title": string, "content": string }>, // AIDA/PAS 等框架下的各章节分段文案，包含丰富的排版与修辞
  "frameworkUsed": string, // 此次使用的营销学核心推演框架名称（例如 "AIDA (Attention, Interest, Desire, Action)"）
  "strategicAdvice": string[] // 针对该广告或方案投放的 3 条极具洞察的增长策略与渠道优化建议
}`;
      prompt = `品牌名称/产品名称: ${inputs.brandName || "未指定"}
核心服务或产品功能描述: ${inputs.description}
目标受众特征: ${inputs.targetAudience || "通用大众市场"}
期望产出风格/渠道格式: ${inputs.copyFormat || "全案社媒及广告投放方案"}
自定义偏好或特殊约束: ${inputs.constraints || "无"}`;

    } else if (appId === "semantic-seo") {
      useSearch = true; // SEO gap analysis absolutely needs search grounding to pull competitor metrics
      systemInstruction = `你是一个资深的搜索引擎优化（SEO）和语义分析师。你需要实时检索 Google 搜索，并深入诊断用户提供的种子词以及竞争对手的布局，发掘出具有高投资回报率的内容空白（Content Voids）和容易排名的长尾词组。
你必须严格输出符合以下结构的纯 JSON 格式数据：
{
  "coreAssessment": string, // 150字左右的行业竞争度与语义饱和度的精准核心评估
  "competitorVoids": Array<{ "topic": string, "priority": "High" | "Medium" | "Low", "gapDescription": string }>, // 竞争对手缺失的内容板块与话题
  "keywordOpportunities": Array<{ "keyword": string, "searchIntent": string, "difficulty": number, "recommendedFocus": string }>, // 推荐的关键词机遇，difficulty 范围 0-100（越低越易获得排名）
  "contentStrategyPlan": string[] // 针对此词汇或竞争格局的 3 步走 SEO 内容突围实操指南
}`;
      prompt = `研究主题/种子词: ${inputs.seedKeywords}
竞争对手信息/网址: ${inputs.competitors || "无特定，全网检索相关赛道对手"}
目标搜索意图: ${inputs.targetIntent || "全面分析"}`;

    } else if (appId === "code-architect") {
      systemInstruction = `你是一个资深的主前端与全栈开发专家。你的任务是根据用户的需求，生成高质量、完美适配生产环境、带有极度详尽中文注释的代码组件或脚本。
你必须严格输出符合以下结构的纯 JSON 格式数据：
{
  "architectureOverview": string, // 该组件/脚本的物理结构和架构设计的精炼解析
  "codeBlocks": Array<{ "language": string, "filename": string, "code": string, "explanation": string }>, // 生成的代码文件块列表
  "implementationGuide": string[], // 部署、测试与集成该代码的分步实操指南
  "bestPractices": string[] // 2-3 条针对该技术的安全性、运行性能优化、长期可维护性方面的最佳实践
}`;
      prompt = `开发需求描述: ${inputs.requirement}
目标技术栈 (如 Tailwind React, Python CLI, Bash Script): ${inputs.techStack || "Tailwind CSS & HTML"}
界面风格/编写偏好 (如 Vercel Minimalist, Tech Terminal): ${inputs.stylePreference || "Modern minimalist"}`;

    } else if (appId === "document-engine") {
      systemInstruction = `你是一个世界级的商业咨询师和合同、审计合规专家。你需要深入分析用户输入的内容或文档文本，分析其中的论据、事实、矛盾、潜在风险和核心要点。
你必须严格输出符合以下结构的纯 JSON 格式数据：
{
  "documentAbstract": string, // 150字左右的文档核心主旨、背景与意图摘要
  "findings": Array<{ "point": string, "level": "Critical" | "Warning" | "Info", "evidence": string, "rationale": string }>, // 关键发现、潜在漏洞、财务矛盾、合同霸王条款等
  "structuredMetrics": Array<{ "label": string, "value": string, "context": string }>, // 从材料中精准提取的重要指标、条款时限、核心数值与对比
  "riskAssessment": string, // 材料关联的综合风险评级与文字描述
  "actionItems": string[] // 针对评估结果，用户应该采取的 3 步实质应对行动
}`;
      prompt = `需要剖析的文档内容或数据表格:
${inputs.documentText}

核心审计重点与关注问题: ${inputs.focusQuestions || "全方位商业合规与漏洞审计"}`;

    } else if (appId === "translation-matrix") {
      systemInstruction = `你是一个精通信达雅、在跨文化语言重塑方面极具声誉的本土化与技术翻译专家。你需要重塑用户输入的文本，使其完全对齐特定行业或地域文化的表达习惯。
你必须严格输出符合以下结构的纯 JSON 格式数据：
{
  "sourceAnalyzed": {
    "detectedLocale": string, // 检测到的源文本语言、行文语气及地域风格特征
    "stylisticMarkers": string[] // 源文本中提炼的隐喻、专业行话、或特定语气标签
  },
  "translatedText": string, // 极富张力、精准优雅的翻译或本土化成果
  "culturalLocalizationNotes": Array<{ "term": string, "explanation": string }>, // 专业词汇的遴选考究、习语重构或俚语替换的深度备忘
  "alternativeToneVariations": Array<{ "tone": string, "text": string }> // 提供另外 2 个其他温度的语气译本（例如：若原译文为专业学术，则提供“通俗趣味”和“商业简报”的另外两个选项）
}`;
      prompt = `需要重塑的原文本:
${inputs.text}

目标翻译语种: ${inputs.targetLanguage}
期望对齐的行业语境与调性 (如 科技极简、金融严谨、社媒玩梗): ${inputs.toneStyle || "客观看待/标准商业"}`;
    } else {
      return res.status(400).json({ error: "Unsupported appId" });
    }

    const config: any = {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.2, // low temperature for precise adherence to the requested JSON format
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
      throw new Error("模型未返回任何文本内容。");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch (parseErr) {
      console.error("Studio JSON Parsing failed. Response was:", responseText);
      return res.status(500).json({
        error: "生成报告的格式解析失败",
        details: responseText,
      });
    }

    res.json(parsedData);

  } catch (error: any) {
    console.error("Studio API Error:", error);
    res.status(500).json({
      error: error.message || "进行智能生成时发生未知错误",
    });
  }
});

// API endpoint for Superworkers Standardized Workflow
app.post("/api/superworker", async (req, res) => {
  try {
    const { task, domain, inputs } = req.body;
    if (!task) {
      return res.status(400).json({ error: "任务(task)不能为空" });
    }

    const ai = getGeminiClient();

    const systemInstruction = `你是一个符合 Superworkers Skill Protocol 的超级数字员工。
你的核心工作流包含四个阶段：Discovery（发现与检索）、Processing（数据处理与分析）、Synthesis（合成与产出）、Auditing（审计与验证）。
针对用户的任务目标（Task）和所在领域（Domain），你必须执行这四个步骤，并严格输出纯 JSON 格式的数据。你可以利用 Google Search Grounding 获取最新事实。

你必须严格遵守以下 JSON 结构输出（输出必须是纯 JSON，不要包含在 \`\`\`json\`\`\` 代码块中）：
{
  "discovery": {
    "searchQueries": string[], // 为了完成任务进行的检索思路或关键词
    "keyFindings": string[], // 检索或发现的核心事实/要素
    "groundingLinks": string[] // 依据的来源信息
  },
  "processing": {
    "dataTransformations": string[], // 你对数据进行了哪些结构化、提纯或格式转换
    "logicApplied": string // 应用了什么业务逻辑或框架规则
  },
  "synthesis": {
    "finalOutput": any, // 【核心交付物】根据任务需要自动适应，可以是对象、数组或字符串，包含最终可执行的代码、文案或分析结果
    "confidenceScore": number // 0-100 的信心指数
  },
  "auditing": {
    "potentialBiases": string[], // 结果中可能存在的偏差
    "limitations": string[], // 产出物的局限性
    "verificationSteps": string[] // 建议用户在实际应用前进行的下一步验证
  }
}`;

    const userPrompt = `Domain (业务领域): ${domain || 'General'}\nTask (任务目标): ${task}\nAdditional Inputs (附加输入): ${JSON.stringify(inputs || {})}\n\n请执行 Superworkers 工作流。`;

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
      throw new Error("模型未返回任何文本内容。");
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText.trim());
    } catch (parseErr) {
      console.error("Superworker JSON Parsing failed. Response was:", responseText);
      return res.status(500).json({
        error: "Superworker 返回的数据格式解析失败",
        details: responseText,
      });
    }

    res.json(parsedData);

  } catch (error: any) {
    console.error("Superworker API Error:", error);
    res.status(500).json({
      error: error.message || "执行 Superworker 工作流时发生未知错误",
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
