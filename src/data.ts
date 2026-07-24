import { DEVELOPMENT_TOOL_CATALOG } from "./components/development-tools/catalog";
export interface Tool {
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  industryAnchor: string;
  description: string;
  overview: string;
  pros: string[];
  cons: string[];
  priceRange: "Free" | "Freemium" | "Paid" | "Open Source";
  priceInfo: string;
  officialUrl: string;
  studioAlternativeId: string | null;
  trustScore: "High" | "Medium" | "Low";
  verified: boolean;
  features: string[];
}

export const CATEGORIES = [
  "Cognitive Writing",
  "Semantic SEO",
  "Development",
  "Data & Intel",
  "Language"
];

export const STUDIO_APPS = [
  {
    id: "research-brief",
    name: "AI Search Research Brief",
    category: "Cognitive Writing",
    tagline: "Google Grounded Multi-Source Verifiable Research Engine",
    description: "Automatically retrieves real-time Google search data. Filters out cross-noise and delivers in-depth analysis complete with source publication dates, trust scoring, fact-opinion separation, and chronological timelines.",
    iconName: "Search",
  },
  {
    id: "ai-copywriter",
    name: "AI Copywriting Workshop",
    category: "Cognitive Writing",
    tagline: "Advanced Strategic Marketing Copywriting Sandbox",
    description: "Utilizes structured AIDA frameworks and multi-path few-shot prompt trees to instantly yield high-converting ad copy, trending headlines, and long-form structural blueprints without restrictive limits.",
    iconName: "FileText",
  },
  {
    id: "semantic-seo",
    name: "Semantic Gap Analyzer",
    category: "Semantic SEO",
    tagline: "Semantic Search Intent & Gap Diagnostic Terminal",
    description: "Input target search queries or analyze competitor pages. The engine maps intent gaps, listing high-ROI keyword gaps and low-difficulty long-tail options ready for deployment.",
    iconName: "Compass",
  },
  {
    id: "code-architect",
    name: "Component & Shell Architect",
    category: "Development",
    tagline: "Zero-Barrier Component, Shell & Automation Terminal",
    description: "Transforms plain English descriptions into beautifully annotated, highly responsive Tailwind markup, React structures, ready-to-run Python processes, or standard Linux automation commands.",
    iconName: "Briefcase",
  },
  {
    id: "document-engine",
    name: "Deep Context Document Engine",
    category: "Data & Intel",
    tagline: "Million-Token Enterprise Context Audit Sandbox",
    description: "Powered by massive context capabilities to audit complex corporate financial reports, legal agreements, or voluminous CSV documents. Surface hidden patterns and export verifiable tables.",
    iconName: "ShieldAlert",
  },
  {
    id: "translation-matrix",
    name: "Contextual Translation Matrix",
    category: "Language",
    tagline: "Context-Aware Cultural Stylist & Translator",
    description: "Shuns literal word-for-word translation. Recognizes professional, technical, or creative sectors to realign voices across 40+ global languages with local nuance.",
    iconName: "ExternalLink",
  },
  {
    id: "development-tools",
    name: "IT Tools Development Workbench",
    category: "Development",
    tagline: "34 local-first developer utilities in one workspace",
    description: "A React-native workbench containing the complete IT Tools collection, migrated for the newfreetools Google AI Studio project.",
    iconName: "Terminal",
  }
];

export const TOOLS_DATABASE: Tool[] = [
  ...DEVELOPMENT_TOOL_CATALOG,
  // Cognitive Writing Tools
  {
    slug: "copy-ai",
    name: "Copy.ai",
    category: "Cognitive Writing",
    subCategory: "Marketing Copywriting",
    industryAnchor: "Copy.ai",
    description: "Generate production-grade copy and automated marketing workflows utilizing custom brand voices and targeted copywriting frameworks.",
    overview: "Copy.ai is a collaborative platform designed for enterprise marketing teams. It leverages highly templated AI processes to write ad copy, emails, and social media posts, supporting shared knowledge bases and tone presets. While workflows dramatically cut down production times, the steep subscription fees and credit limits can be restrictive for small businesses.",
    pros: [
      "Offers dozens of highly specialized marketing copy templates and multi-step workflows",
      "Supports shared brand voices and specific industry terminology profiles",
      "Integrates with major marketing platforms (HubSpot, etc.) for automated publishing"
    ],
    cons: [
      "Extremely limited free tier limits, with expensive paid subscriptions",
      "Occasionally exhibits logical hallucinations over long deep-dive documents"
    ],
    priceRange: "Freemium",
    priceInfo: "Free tier $0/mo (limited credits) | Pro tier from $49/mo",
    officialUrl: "https://www.copy.ai",
    studioAlternativeId: "ai-copywriter",
    trustScore: "High",
    verified: true,
    features: ["Marketing Templates", "Team Collaboration", "Brand Voice Alignment", "API Integrations"]
  },
  {
    slug: "jasper-ai",
    name: "Jasper.ai",
    category: "Cognitive Writing",
    subCategory: "Enterprise Marketing",
    industryAnchor: "Jasper",
    description: "A full-stack AI content marketing platform focused on enterprise-level branding and multi-channel content distribution.",
    overview: "Jasper is a pioneer in commercial AI copywriting. It offers deep brand voice training, parsing long corporate style guides to inject consistent messaging across all generated assets. Since shifting heavily toward enterprise clients, it has replaced its free options with premium subscription models.",
    pros: [
      "Industry-leading brand voice analysis and replication capabilities",
      "Excellent coherence when generating long-form blog articles",
      "Integrates with SurferSEO for real-time readability and optimization checks"
    ],
    cons: [
      "Requires a credit card even for a trial run",
      "Steep learning curve for non-technical users to build custom 'Recipes'"
    ],
    priceRange: "Paid",
    priceInfo: "Starts at $39/mo (billed annually)",
    officialUrl: "https://www.jasper.ai",
    studioAlternativeId: "ai-copywriter",
    trustScore: "High",
    verified: true,
    features: ["Long-form Document Mode", "Brand Memory Vault", "SEO Auditing Integration", "AI Graphic Co-pilot"]
  },
  {
    slug: "sudowrite",
    name: "Sudowrite",
    category: "Cognitive Writing",
    subCategory: "Fiction & Creative",
    industryAnchor: "Sudowrite",
    description: "A creative writing space tailored for novelists and fiction authors, supporting outline drafting, character arcs, and prose refinement.",
    overview: "Sudowrite is an artistic AI co-writing tool. Unlike typical marketing assistants, it is fine-tuned for rich sensory details, plot conflict progression, and foreshadowing, helping fiction writers break through writer's block.",
    pros: [
      "Unique sensory description expansion algorithms",
      "Powerful interactive canvas for structural brainstorming",
      "Allows multi-branch scenario simulation for specific chapters"
    ],
    cons: [
      "Optimized primarily for English literary structures; less effective in non-English contexts",
      "Virtually unusable for business or formal academic writing tasks"
    ],
    priceRange: "Paid",
    priceInfo: "Starts at $19/mo (limit of 30,000 words/mo)",
    officialUrl: "https://www.sudowrite.com",
    studioAlternativeId: "ai-copywriter",
    trustScore: "High",
    verified: false,
    features: ["Fiction Canvas", "Sensory Describers", "Outline Reshaping", "Branch Generation"]
  },

  // Semantic SEO Tools
  {
    slug: "semrush",
    name: "Semrush",
    category: "Semantic SEO",
    subCategory: "Competitive Intel",
    industryAnchor: "Semrush",
    description: "A leading all-in-one digital marketing suite featuring comprehensive search engine ranking analytics and backlink audits.",
    overview: "Semrush is a gold standard for competitor analysis and web traffic auditing. By indexing billions of keywords and domain metrics, it outlines your competitors' search strategies. However, its complex interface and high pricing are overkill for amateur bloggers or small businesses.",
    pros: [
      "Extremely vast, real-time search engine traffic and keyword database",
      "Incomparable backlink tracking and competitor paid ad copy monitoring",
      "Detailed site health audits (Site Audit) to clear technical SEO issues"
    ],
    cons: [
      "Extremely expensive for independent creators and sole proprietors",
      "Console can overwhelm new users with massive dashboards and complex charts"
    ],
    priceRange: "Paid",
    priceInfo: "Starts at $129.95/mo",
    officialUrl: "https://www.semrush.com",
    studioAlternativeId: "semantic-seo",
    trustScore: "High",
    verified: true,
    features: ["Keyword Research", "Backlink Monitoring", "Competitor Analytics", "SEO Content Assistant"]
  },
  {
    slug: "ahrefs",
    name: "Ahrefs",
    category: "Semantic SEO",
    subCategory: "Backlink Checker",
    industryAnchor: "Ahrefs",
    description: "An industry-standard SEO and backlink checker powered by a high-frequency web crawler.",
    overview: "Ahrefs operates one of the most active web crawlers outside of search engines, detecting complex redirects and diagnosing search ranking penalties. Although it offers basic free Webmaster tools, the core semantic Content Gap and keyword intelligence remain locked behind premium tiers.",
    pros: [
      "Widely considered the most accurate and deep backlink graph indexer",
      "The Content Gap utility highlights exact topics competitors rank for that you lack",
      "Provides an intuitive Keyword Difficulty (KD) estimation score"
    ],
    cons: [
      "Recent pricing adjustments to token-based models make heavy site crawls expensive",
      "High API pricing limits easy third-party custom integrations"
    ],
    priceRange: "Paid",
    priceInfo: "Lite tier from $99/mo (strict limits)",
    officialUrl: "https://www.ahrefs.com",
    studioAlternativeId: "semantic-seo",
    trustScore: "High",
    verified: true,
    features: ["Backlink Analysis", "Content Gap Audit", "Technical Crawls", "Rank Tracker"]
  },
  {
    slug: "surfer-seo",
    name: "Surfer SEO",
    category: "Semantic SEO",
    subCategory: "Content Optimization",
    industryAnchor: "SurferSEO",
    description: "Data-driven SEO content editor that guides creators in optimizing semantic word layouts in real time.",
    overview: "Surfer SEO focuses on structuring articles to match exact search engine preferences. It analyzes keyword density, length, image ratios, and headers to score content, guiding copywriters through Google's NLP criteria.",
    pros: [
      "Reverse-engineers top-10 ranking websites for extremely accurate target parameters",
      "Deep integration with WordPress and Google Docs for seamless writing",
      "Generates structured optimization lists, cutting manual editing overhead"
    ],
    cons: [
      "Strictly adhering to NLP optimization checklists can lead to sterile, repetitive prose",
      "No permanent free tier is provided for basic experimentation"
    ],
    priceRange: "Paid",
    priceInfo: "Essential plan starts at $89/mo",
    officialUrl: "https://www.surferseo.com",
    studioAlternativeId: "semantic-seo",
    trustScore: "High",
    verified: false,
    features: ["Real-time NLP Scoring", "Outline Generator", "Keyword Clustering", "Editor Integration"]
  },

  // Development Tools
  {
    slug: "v0-dev",
    name: "v0.dev",
    category: "Development",
    subCategory: "UI Generation",
    industryAnchor: "v0.dev",
    description: "Generative UI system by Vercel that delivers production-grade, beautifully styled Tailwind React components from short text prompts.",
    overview: "v0.dev is a powerful generative assistant for frontend UI design. It understands modern component architectures (like shadcn/ui and Radix) and outputs fully responsive, styled code. While it features a generous free tier, high-density project refactoring will require premium credits.",
    pros: [
      "Visual interface for selecting, editing, and previewing code blocks interactively",
      "Highly aesthetic components out-of-the-box adopting Vercel's design guidelines",
      "One-click deployment and sharing options integrated with Vercel hosting"
    ],
    cons: [
      "Focuses entirely on frontend templates; cannot generate database or backend logic",
      "Framework support is currently focused mainly on React ecosystem"
    ],
    priceRange: "Freemium",
    priceInfo: "Free tier with limits | Premium subscription at $20/mo",
    officialUrl: "https://v0.dev",
    studioAlternativeId: "code-architect",
    trustScore: "High",
    verified: true,
    features: ["React/Tailwind Output", "Interactive Block Editor", "Visual Screenshot Inputs", "Vercel Hosting Ready"]
  },
  {
    slug: "bolt-new",
    name: "Bolt.new",
    category: "Development",
    subCategory: "Full-Stack Sandboxes",
    industryAnchor: "Bolt.new",
    description: "In-browser full-stack sandbox utilizing WebContainer technology to run Node.js processes, install npm modules, and preview updates in real time.",
    overview: "Bolt.new breaks past the boundaries of static code generation by hosting virtual environments directly inside standard browsers. The developer agent can build servers, handle packages, and repair environment variables interactively. This represents a paradigm shift for prototyping, albeit at high API and resource consumption costs.",
    pros: [
      "True full-stack execution capabilities including backend services and routing",
      "Automatic module resolution and environment-specific runtime error debugging",
      "Seamless code syncing to GitHub and one-click Netlify deployments"
    ],
    cons: [
      "Highly memory and CPU intensive on the local client machine",
      "Free tier usage is consumed rapidly during typical troubleshooting sessions"
    ],
    priceRange: "Freemium",
    priceInfo: "Free tier with basic quotas | Memberships from $20/mo",
    officialUrl: "https://bolt.new",
    studioAlternativeId: "code-architect",
    trustScore: "High",
    verified: true,
    features: ["Full-Stack VMs", "Instant Hot Preview", "Automated Bug Diagnostics", "GitHub Push Sync"]
  },

  // Data & Intel Tools
  {
    slug: "chatpdf",
    name: "ChatPDF",
    category: "Data & Intel",
    subCategory: "PDF Analysis",
    industryAnchor: "ChatPDF",
    description: "A streamlined PDF interaction engine that quickly digests research papers, legal agreements, and corporate financials.",
    overview: "ChatPDF simplifies document analysis into direct conversations. After extracting texts from PDFs, it builds a localized search index using RAG so users can retrieve complex math formulas or fine print as easily as sending a chat message. Perfect for busy students or financial auditors.",
    pros: [
      "Excellent cross-language parsing, support, and automatic translation",
      "Provides exact page citations for every detail mentioned in responses",
      "Incredibly clean, distraction-free user interface with zero learning curve"
    ],
    cons: [
      "Free tier restricts file sizes (up to 120 pages) and daily counts (up to 3 uploads)",
      "Struggles with non-text elements like low-resolution scanned pages or handwriting"
    ],
    priceRange: "Freemium",
    priceInfo: "Free tier with limits | Pro plan from $15/mo",
    officialUrl: "https://www.chatpdf.com",
    studioAlternativeId: "document-engine",
    trustScore: "Medium",
    verified: true,
    features: ["Multi-Language Parsing", "Citations & References", "Interactive Search", "Cloud Chat Archives"]
  },
  {
    slug: "consensus",
    name: "Consensus",
    category: "Data & Intel",
    subCategory: "Academic Research",
    industryAnchor: "Consensus",
    description: "An academic research assistant connected to over 200 million peer-reviewed papers to compile scientific consensus on queries.",
    overview: "Consensus solves the problem of hallucinated references. When users query a medical, social science, or engineering topic, Consensus searches validated peer-reviewed journals to compile consensus metrics, lending rigorous backing to the results.",
    pros: [
      "Rejects hallucinations, with answers closely linked to PubMed or Semantic Scholar entries",
      "The 'Consensus Meter' quantifies the ratio of scientific support for a given hypothesis",
      "One-click citations export supporting standard formats (APA, MLA, etc.)"
    ],
    cons: [
      "Tailored purely to academic literature; not helpful for general pop-culture or business news",
      "Advanced reasoning outputs are heavily capped under the free tier"
    ],
    priceRange: "Freemium",
    priceInfo: "Free basic search | Premium features from $9.99/mo (billed annually)",
    officialUrl: "https://consensus.app",
    studioAlternativeId: "document-engine",
    trustScore: "High",
    verified: true,
    features: ["Academic Peer-Review Search", "Consensus Meter Metrics", "Format-Friendly Citations", "Scholarly Fact Filtering"]
  },

  // Language Tools
  {
    slug: "deepl",
    name: "DeepL",
    category: "Language",
    subCategory: "Translation",
    industryAnchor: "DeepL",
    description: "A machine translation engine widely acclaimed for its superior context accuracy and industry-specific terminology handling.",
    overview: "DeepL is a highly respected translator used extensively in international business and scholarly editing. Built on deep neural networks, it senses linguistic context to avoid the rigid literal errors common in traditional tools. However, the free tier restricts document size and has lower character quotas.",
    pros: [
      "Leading accuracy for academic and corporate translations, avoiding sterile direct translations",
      "One-click whole-document translation (Word, PowerPoint, PDF) while keeping original formats",
      "Allows custom glossaries for strict brand term mapping"
    ],
    cons: [
      "Free tier character cap is heavily restricted",
      "Most advanced document features require a paid subscription"
    ],
    priceRange: "Freemium",
    priceInfo: "Basic translate free | Advanced tiers from $8.74/mo (billed annually)",
    officialUrl: "https://www.deepl.com",
    studioAlternativeId: "translation-matrix",
    trustScore: "High",
    verified: true,
    features: ["Contextual Neural Net", "Whole Document Imports", "Custom Glossary Locking", "Browser Extension"]
  }
];
