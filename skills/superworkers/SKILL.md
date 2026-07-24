---
name: superworkers
description: Guidelines and architectural design patterns for building and orchestrating Superworkers (超级数字员工) — autonomous, multi-step AI agents that execute complex vertical tasks with structured reasoning, grounding, and interactive web sandboxes.
---

# Superworkers Skill Framework (超级数字员工技能指南)

When building, modifying, or extending features in `freetools.ai.studio`, follow the **Superworkers** paradigm. Superworkers are domain-expert AI digital workers designed to perform end-to-end multi-step tasks rather than simple text completions.

## 1. What is a Superworker? (数字员工核心特性)

A **Superworker** combines:
1. **Expert Domain Persona**: Specialized instructions for vertical roles (e.g., Code Architect, Market Researcher, Legal Auditor, Semantic SEO Engineer).
2. **Autonomous Multi-Step Execution**: Internal reasoning broken into plan, execution, cross-verification, and output formatting.
3. **Structured JSON Output**: Every worker returns structured JSON with schema-enforced fields (e.g. key findings, steps, code snippets, citation sources, visual previews).
4. **Live Execution Sandbox**: An interactive UI container where users configure inputs, trigger real-time AI processing, and copy/export/interact with results.

## 2. Superworker Architecture & Workflow

```
[ User Input / Goal ]
       │
       ▼
[ Superworker Router ]
       │
       ├── 1. Intent Deconstruction & Variable Extraction
       ├── 2. Grounding Search / Context Retrieval
       ├── 3. Gemini Structured Reasoning & Generation
       └── 4. Schema Validation & Fail-Safe Fallbacks
       │
       ▼
[ Interactive Studio Sandbox UI ] ─── (Real-time Live Preview & One-click Export)
```

## 3. Implementation Standards

### A. Server-Side Execution (`server.ts`)
- Use Google GenAI (`@google/genai`) with Gemini models (e.g. `gemini-2.5-flash` or `gemini-2.5-pro`).
- Always pass strict `systemInstruction` enforcing `JSON` response structure.
- Enable `tools: [{ googleSearch: {} }]` for workers requiring live web grounding.
- Provide defensive fallback defaults if model output omits expected JSON keys.

### B. UI Sandbox Component (`src/components/StudioAppSandbox.tsx`)
- Display worker title, domain badge, and tagline.
- Render input forms tailored to worker parameters (selects, textareas, toggles).
- Show live progress state during AI execution.
- Render rich structured output panels (tabs, code blocks, copy buttons, live SVG/HTML previews).

### C. Category & Data Taxonomy (`src/data.ts`)
- Every Superworker must be registered under `STUDIO_APPS` and linked to relevant industry categories in `CATEGORIES_TAXONOMY`.

## 4. Example Superworker Categories

- **DevWorker (代码与架构重构员工)**: Converts goals into production-grade React/Tailwind/Node markup and automation scripts.
- **VisionWorker (图像与提示词视觉员工)**: Architect Midjourney/Flux prompt matrices and output live SVG vector code.
- **IntelWorker (深度研报与搜索员工)**: Performs Google-grounded multi-source research with verifiable citations and timelines.
- **SEOWorker (语义 SEO 与流量员工)**: Audits competitor keywords, content gap analysis, and NLP ranking opportunities.
- **CopyWorker (营销文案与品牌员工)**: Generates high-converting ad copy using AIDA and PAS frameworks.

## 5. Verification Checklist

- [ ] Does the agent return valid, parseable JSON?
- [ ] Are API keys handled securely server-side?
- [ ] Is the UI sandbox fully responsive and equipped with copy/download controls?
- [ ] Are errors handled gracefully with user-friendly messages?
