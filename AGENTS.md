# AGENTS.md — Superworkers & Project Directives

## 1. Project Identity & Architecture
`freetools.ai.studio` is an open-access AI tools directory and full-stack interactive execution studio powered by Gemini models and web sandboxes.

## 2. Superworkers Skill Protocol (超级数字员工技能规范)
All future development, agentic task design, and tool integrations MUST follow the **Superworkers Skill Paradigm**:

### Core Principles of Superworkers:
- **Autonomous Task Deconstruction**: Each Superworker agent breaks high-level complex user goals into verifiable sub-steps (Discovery -> Processing -> Synthesis -> Auditing).
- **Structured JSON Output Schema**: All AI Superworker responses must yield strictly validated JSON matching domain-specific interfaces (e.g., source citations, reasoning steps, code blocks, or actionable assets).
- **Zero-hallucination Grounding**: Superworkers use grounded real-time data sources (e.g., Google Search Grounding, peer-reviewed indices, or verified API endpoints).
- **Interactive Sandbox Execution**: Every Superworker provides an immediate, zero-barrier UI sandbox for users to input parameters and preview real-time results without local setup.
- **Fail-Safe & Graceful Fallbacks**: Include automated error boundaries, fallback models, and clear diagnostic explanations for any missing inputs or API throttles.

## 3. Code Quality & Formatting
- All code, variable names, interfaces, comments, and file structures MUST be in **English**.
- User-facing UI strings support bilingual presentation (English / Simplified Chinese).
- Maintain Tailwind utility classes and modular React components.
