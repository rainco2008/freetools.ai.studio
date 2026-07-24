import { useState, useEffect, FormEvent } from "react";
import { 
  Sparkles, AlertCircle, Copy, Check, ChevronRight, FileText, ArrowLeft, 
  Search, ShieldAlert, Terminal, HelpCircle, ArrowRight, CornerDownRight,
  Compass
} from "lucide-react";
import { STUDIO_APPS } from "../data";
import LoadingOverlay from "./LoadingOverlay";
import ReportRenderer from "./ReportRenderer";
import HistorySidebar from "./HistorySidebar";
import { SavedReport, ResearchReport, GroundingSource } from "../types";
import DevelopmentToolsWorkbench from "./DevelopmentToolsWorkbench";

// Types for individual sandbox apps
interface StudioAppSandboxProps {
  appId: string;
  // Hooks/states passed from App.tsx to run the Research Brief (previously FactLens)
  researchBriefProps: {
    sidebarOpen: boolean;
    setSidebarOpen: (o: boolean) => void;
    history: SavedReport[];
    selectedReportId: string | null;
    setSelectedReportId: (id: string | null) => void;
    query: string;
    setQuery: (q: string) => void;
    reportType: "brief" | "competitive" | "factcheck";
    setReportType: (t: "brief" | "competitive" | "factcheck") => void;
    languageStyle: "objective" | "simple" | "academic";
    setLanguageStyle: (s: "objective" | "simple" | "academic") => void;
    customFormat: string;
    setCustomFormat: (f: string) => void;
    isLoading: boolean;
    error: string | null;
    handleGenerate: (e?: any) => Promise<void>;
    handleApplyPreset: (preset: any) => void;
    handleSelectReport: (id: string) => void;
    handleDeleteReport: (id: string) => void;
  };
}

export default function StudioAppSandbox({ appId, researchBriefProps }: StudioAppSandboxProps) {
  const appMeta = STUDIO_APPS.find((app) => app.id === appId);

  // General local state for new Studio Apps (Copywriter, SEO, Code, Doc, Trans)
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // For code block selector tab
  const [activeCodeTabIndex, setActiveCodeTabIndex] = useState(0);

  // Reset local inputs and results on appId change
  useEffect(() => {
    setInputs({});
    setResult(null);
    setError(null);
    setIsGenerating(false);
    setActiveCodeTabIndex(0);
  }, [appId]);

  // Handle Copy to Clipboard
  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Submit handler for individual new Studio Apps
  const handleLocalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId,
          inputs
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate results. Please check your inputs.");
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred while processing the request on the server.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Set individual input value
  const setInputValue = (field: string, val: string) => {
    setInputs((prev) => ({ ...prev, [field]: val }));
  };

  if (!appMeta) {
    return (
      <div className="mx-auto max-w-xl py-20 px-4 text-center space-y-4 bg-[#FCFAF7]">
        <AlertCircle className="h-10 w-10 text-[#E64833] mx-auto" />
        <h4 className="text-lg font-serif font-bold text-[#1A1A1A]">Sandbox Engine Mismatch</h4>
        <p className="text-xs text-[#8C8984] font-serif">This Studio app engine is not ready or has not been assigned a valid identifier.</p>
        <a href="#/" className="inline-block px-4 py-2 border border-[#1A1A1A] bg-black text-white text-[9px] uppercase font-bold tracking-widest">
          Back to Catalog Dashboard
        </a>
      </div>
    );
  }

  if (appId === "development-tools") {
    return <DevelopmentToolsWorkbench />;
  }

  // --- RENDERING ROUTE A: ORIGINAL SEARCH GROUNDING RESEARCH BRIEF (FactLens) ---
  if (appId === "research-brief") {
    const activeSavedReport = researchBriefProps.history.find(
      (item) => item.id === researchBriefProps.selectedReportId
    );

    const PRESETS = [
      {
        query: "What are the latest experimental breakthroughs and controversies in room-temperature superconductivity in 2026?",
        type: "brief",
        style: "academic",
        label: "Superconductor Tech",
      },
      {
        query: "Technical solutions and market competitiveness comparison of the latest foldable smartphones in 2026.",
        type: "competitive",
        style: "objective",
        label: "Foldable Devices",
      },
      {
        query: "Does long-term intake of coffee or sugar-free functional drinks cause osteoporosis or bone decalcification?",
        type: "factcheck",
        style: "simple",
        label: "Caffeine & Osteoporosis",
      },
      {
        query: "Global timeline and production capacity plans of major manufacturers for commercial solid-state batteries.",
        type: "brief",
        style: "objective",
        label: "Solid-State Battery",
      }
    ];

    return (
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-[#FCFAF7] font-sans">
        {/* Unified loading overlay */}
        <LoadingOverlay isLoading={researchBriefProps.isLoading} query={researchBriefProps.query} />

        {/* History sidebar component on the left */}
        <HistorySidebar
          history={researchBriefProps.history}
          selectedId={researchBriefProps.selectedReportId}
          onSelect={researchBriefProps.handleSelectReport}
          onDelete={researchBriefProps.handleDeleteReport}
          isOpen={researchBriefProps.sidebarOpen}
          setIsOpen={researchBriefProps.setSidebarOpen}
        />

        {/* Workspace core layout */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Internal sub-header with history controls */}
          <div className="no-print bg-[#F5F2EC] px-6 py-2 border-b border-[#D1CEC7] flex items-center justify-between">
            <button
              onClick={() => researchBriefProps.setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A]"
            >
              <FileText className="h-4 w-4 text-[#E64833]" />
              <span>History Archive</span>
            </button>
            <span className="hidden lg:inline text-[9px] font-mono text-[#8C8984] uppercase tracking-widest flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E64833]" /> Live Web Grounding Search Active
            </span>

            {researchBriefProps.selectedReportId && (
              <button
                onClick={() => researchBriefProps.setSelectedReportId(null)}
                className="px-3 py-1 border border-[#1A1A1A] bg-white text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
              >
                + New Inquiry
              </button>
            )}
          </div>

          <main className="flex-1 overflow-y-auto bg-[#FCFAF7] p-4 md:p-8">
            {researchBriefProps.error && (
              <div className="mx-auto max-w-4xl mb-6 border border-[#E64833] bg-[#FCFAF7] p-5 text-[#1A1A1A]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#E64833] mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#E64833]">API EXCEPTION / RUNTIME ERROR</h4>
                    <p className="text-xs text-[#1A1A1A] leading-relaxed font-serif italic">{researchBriefProps.error}</p>
                  </div>
                </div>
              </div>
            )}

            {activeSavedReport ? (
              <div className="mx-auto max-w-5xl animate-fade-in pb-10">
                <ReportRenderer
                  report={activeSavedReport.report}
                  groundingSources={activeSavedReport.groundingSources}
                  query={activeSavedReport.query}
                />
              </div>
            ) : (
              <div className="mx-auto max-w-3xl space-y-10 py-4 sm:py-8">
                {/* Header title */}
                <div className="text-left space-y-4 border-b border-[#D1CEC7] pb-6">
                  <div className="inline-block px-2.5 py-0.5 bg-[#E64833] text-white text-[9px] font-mono font-bold uppercase tracking-widest">
                    COGNITIVE EVIDENCE ENGINE
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#1A1A1A] leading-[1.1]">
                    Turn Search Results Into Evidence-Based Conclusions
                  </h2>
                  <p className="text-xs sm:text-sm text-[#5C5955] leading-relaxed font-serif">
                    Enter any in-depth research topic you wish to investigate. Our engine will use Google Search to retrieve live web data in real-time, synthesize multiple sources, eliminate conflicting SEO noise, and deliver a structured report featuring citation verification, source credibility indexes, facts vs. opinion analysis, and a timeline.
                  </p>
                </div>

                {/* Form parameters */}
                <form onSubmit={researchBriefProps.handleGenerate} className="border border-[#D1CEC7] bg-[#F5F2EC] p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8C8984] block font-mono">
                      01. ENTER YOUR RESEARCH TOPIC / INPUT QUERY
                    </label>
                    <div className="relative flex">
                      <input
                        type="text"
                        required
                        value={researchBriefProps.query}
                        onChange={(e) => researchBriefProps.setQuery(e.target.value)}
                        placeholder="e.g. Substantive impact and trends of generative AI on the global labor market in 2026..."
                        className="w-full border border-[#1A1A1A] bg-white p-4 pr-14 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
                      />
                      <button
                        type="submit"
                        className="absolute right-0 top-0 h-full w-12 border border-l-0 border-[#1A1A1A] flex items-center justify-center bg-black text-white hover:bg-black/90 transition-all"
                        title="Submit Search"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Format Type */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#8C8984] block font-mono">
                        02. REPORT FORMAT & MATRIX / REPORT TYPE
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "brief", label: "Research Brief", icon: FileText },
                          { id: "competitive", label: "Competitor Comparison", icon: Compass },
                          { id: "factcheck", label: "Fact Audit", icon: ShieldAlert }
                        ].map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => researchBriefProps.setReportType(type.id as any)}
                              className={`flex flex-col items-center justify-center border p-3 text-center transition-all ${
                                researchBriefProps.reportType === type.id
                                  ? "border-[#1A1A1A] bg-[#1A1A1A] text-white font-bold"
                                  : "border-[#D1CEC7] bg-white hover:border-[#1A1A1A] text-[#5C5955]"
                              }`}
                            >
                              <Icon className="h-4 w-4 mb-1" />
                              <span className="text-[9px] font-bold tracking-wider">{type.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tone Style */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#8C8984] block font-mono">
                        03. LINGUISTIC NARRATIVE STYLE / TONE STYLE
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "objective", title: "Strict Objective", code: "OBJECTIVE" },
                          { id: "simple", title: "Simple Plain", code: "SIMPLE" },
                          { id: "academic", title: "Academic Formal", code: "ACADEMIC" }
                        ].map((style) => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => researchBriefProps.setLanguageStyle(style.id as any)}
                            className={`border p-2 text-center transition-all ${
                              researchBriefProps.languageStyle === style.id
                                ? "border-[#1A1A1A] bg-[#1A1A1A] text-white font-bold"
                                : "border-[#D1CEC7] bg-white hover:border-[#1A1A1A] text-[#5C5955]"
                            }`}
                          >
                            <span className="block text-[10px] font-bold">{style.title}</span>
                            <span className="text-[8px] font-mono opacity-80 block mt-0.5">{style.code}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8C8984] block font-mono">
                      04. CUSTOM STRUCTURAL PREFERENCES (OPTIONAL) / CUSTOM REQUIREMENT
                    </label>
                    <textarea
                      rows={2}
                      value={researchBriefProps.customFormat}
                      onChange={(e) => researchBriefProps.setCustomFormat(e.target.value)}
                      placeholder="e.g. Emphasize commercialization progress, split layout, add technical glossaries, or focus heavily on cost structures..."
                      className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white hover:bg-black text-[10px] uppercase font-bold tracking-widest py-4 border border-[#1A1A1A] transition-all cursor-pointer"
                  >
                    <Search className="h-4 w-4" />
                    <span>LAUNCH DEEP SYNTHESIS ENGINE</span>
                  </button>
                </form>

                {/* Preset Dossiers */}
                <div className="space-y-4 pt-4 border-t border-[#D1CEC7]">
                  <div className="flex items-center gap-2 text-[#8C8984]">
                    <HelpCircle className="h-4 w-4 stroke-[1.5]" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">
                      SEED QUERY TEMPLATES / PRESET DOSSIERS
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => researchBriefProps.handleApplyPreset(preset)}
                        className="flex flex-col items-start border border-[#D1CEC7] bg-white p-4 text-left hover:border-[#1A1A1A] hover:bg-[#F2EFE9] transition-all group"
                      >
                        <span className="border border-[#D1CEC7] px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase text-[#8C8984] group-hover:border-[#1A1A1A] group-hover:text-[#1A1A1A] transition-colors mb-2 bg-[#FCFAF7]">
                          {preset.label}
                        </span>
                        <p className="text-xs text-[#1A1A1A] font-serif font-bold line-clamp-2 leading-relaxed">
                          {preset.query}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  // --- RENDERING ROUTE B: FIVE NEW SPECIALIZED PLAYGROUND SANDBOXES ---
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 bg-[#FCFAF7]">
      {/* 1. Header with Breadcrumbs */}
      <div className="border-b border-[#D1CEC7] pb-6 space-y-3">
        <div className="flex items-center gap-2">
          <a href="#/" className="text-xs text-[#8C8984] hover:text-[#1A1A1A] font-mono uppercase tracking-widest">
            Studio Hub
          </a>
          <span className="text-[#8C8984] font-mono text-[10px]">/</span>
          <span className="text-xs text-[#1A1A1A] font-mono font-bold uppercase tracking-widest">
            {appMeta.name}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#1A1A1A]">
              {appMeta.name}
            </h2>
            <p className="text-[10px] text-[#8C8984] font-mono uppercase tracking-widest flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E64833]" /> {appMeta.tagline}
            </p>
          </div>
          
          <span className="border border-[#D1CEC7] bg-[#F5F2EC] px-3 py-1 text-[8px] font-mono font-bold uppercase tracking-widest text-[#5C5955]">
            Unlimited Client Session
          </span>
        </div>
      </div>

      {/* 2. Interactive Split Screen */}
      <div className="grid lg:grid-cols-12 gap-8 mt-8 items-start">
        
        {/* Left Side: Inputs parameters */}
        <div className="lg:col-span-5 border border-[#1A1A1A] bg-[#F5F2EC] p-6 space-y-6">
          <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-widest block border-b border-[#D1CEC7] pb-2">
            Workspace Configuration
          </span>

          <form onSubmit={handleLocalSubmit} className="space-y-5">
            {/* App specific inputs */}
            {appId === "ai-copywriter" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Brand Name / Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scribe AI"
                    value={inputs.brandName || ""}
                    onChange={(e) => setInputValue("brandName", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Product Selling Points / Product Features
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Detail your primary product features, solving what core customer pain points..."
                    value={inputs.description || ""}
                    onChange={(e) => setInputValue("description", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A] resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Target Audience / Target Audience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Freelancers, small e-commerce merchants, solo developers"
                    value={inputs.targetAudience || ""}
                    onChange={(e) => setInputValue("targetAudience", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Ad Format / Marketing Channel
                  </label>
                  <select
                    value={inputs.copyFormat || "Social Media & Ad Copy Package"}
                    onChange={(e) => setInputValue("copyFormat", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] rounded-none"
                  >
                    <option value="Google Ads SEM Search Copy">Google Ads SEM Search Copy</option>
                    <option value="Facebook Feed Golden Hooks">Facebook Feed Golden Hooks</option>
                    <option value="SaaS Activation Email Sequence">SaaS Activation Email Sequence</option>
                    <option value="Instagram / Pinterest Short Captions">Instagram / Pinterest Short Captions</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Tone & Constraints (Optional) / Constraints
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Use helpful emojis, highlight cost-effectiveness, keep under 300 words..."
                    value={inputs.constraints || ""}
                    onChange={(e) => setInputValue("constraints", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </>
            )}

            {appId === "semantic-seo" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Seed Keywords / Seed Keywords
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. no-code development, smart wearables, organic coffee benefits"
                    value={inputs.seedKeywords || ""}
                    onChange={(e) => setInputValue("seedKeywords", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Competitors (Optional) / Competitors
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. v0.dev, semrush.com (for competitor comparison audits)"
                    value={inputs.competitors || ""}
                    onChange={(e) => setInputValue("competitors", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Search Intent Target / Search Intent Filter
                  </label>
                  <select
                    value={inputs.targetIntent || "Holistic Intent Gap Discovery"}
                    onChange={(e) => setInputValue("targetIntent", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] rounded-none"
                  >
                    <option value="Holistic Intent Gap Discovery">Holistic Intent Gap Discovery</option>
                    <option value="Informational Voids (High-volume user queries)">Informational Voids (High-volume user queries)</option>
                    <option value="Commercial Competitor Gap (Buying decision criteria)">Commercial Competitor Gap (Buying decision criteria)</option>
                    <option value="Long-tail Traffic Optimization (Long-tail keywords bundle)">Long-tail Traffic Optimization (Long-tail keywords bundle)</option>
                  </select>
                </div>
              </>
            )}

            {appId === "code-architect" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Component Function Description / Requirement
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe in detail the code, component, or script you want to generate (e.g. A collapsible Tailwind React Accordion FAQ component with sleek animations and elegant borders)..."
                    value={inputs.requirement || ""}
                    onChange={(e) => setInputValue("requirement", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A] resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Target Tech Stack / Tech Stack
                  </label>
                  <select
                    value={inputs.techStack || "Tailwind CSS & HTML"}
                    onChange={(e) => setInputValue("techStack", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] rounded-none"
                  >
                    <option value="Tailwind CSS & HTML Component">Tailwind CSS & HTML Component</option>
                    <option value="React TypeScript & Tailwind Component">React TypeScript & Tailwind Component</option>
                    <option value="Python Automation Shell Script">Python Automation Shell Script</option>
                    <option value="Bash Linux DevOps Script">Bash Linux DevOps Script</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Design System Style (Optional) / Aesthetic Style
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vercel minimal, Cyber terminal design, Cozy editorial..."
                    value={inputs.stylePreference || ""}
                    onChange={(e) => setInputValue("stylePreference", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </>
            )}

            {appId === "document-engine" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Upload / Paste Document Text / Paste Document Text
                  </label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Paste financial statements, contract clauses, raw CSV rows, or key paragraphs of research papers here..."
                    value={inputs.documentText || ""}
                    onChange={(e) => setInputValue("documentText", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A] resize-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Core Focus Keypoints / Specific focus (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Find clauses unfair to party B, summarize all financial loss figures..."
                    value={inputs.focusQuestions || ""}
                    onChange={(e) => setInputValue("focusQuestions", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </>
            )}

            {appId === "translation-matrix" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Source Text / Source Text
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Paste the source text you want to translate with high fidelity and stylistic polish..."
                    value={inputs.text || ""}
                    onChange={(e) => setInputValue("text", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A] resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Target Language / Target Language
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Idiomatic American English, Professional Academic Chinese, Industry-level German"
                    value={inputs.targetLanguage || ""}
                    onChange={(e) => setInputValue("targetLanguage", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-[#5C5955] uppercase tracking-wider block">
                    Tone & Style Anchor / Tone & Style Anchor
                  </label>
                  <select
                    value={inputs.toneStyle || "Objective & Commercial"}
                    onChange={(e) => setInputValue("toneStyle", e.target.value)}
                    className="w-full border border-[#D1CEC7] bg-white p-3 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] rounded-none"
                  >
                    <option value="Tech Minimalist (Product launches)">Tech Minimalist (Product launches)</option>
                    <option value="Academic Formal (Peer review matched)">Academic Formal (Peer review matched)</option>
                    <option value="Financial Rigorous (Data-driven logic)">Financial Rigorous (Data-driven logic)</option>
                    <option value="Humorous Social Media (Attention grabbing hooks)">Humorous Social Media (Attention grabbing hooks)</option>
                  </select>
                </div>
              </>
            )}

            {/* Error indicators */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-[#E64833] text-[#E64833] text-xs font-serif italic">
                {error}
              </div>
            )}

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] text-white hover:bg-black text-[9px] uppercase font-mono font-bold tracking-widest py-3.5 border border-[#1A1A1A] transition-all disabled:bg-[#D1CEC7] disabled:border-[#D1CEC7] disabled:text-[#8C8984] cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <span className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>SYNTHESIZING MATRIX DATA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-[#E64833]" />
                  <span>COMPILE & RUN ALTERNATIVE</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Interactive Sandbox Output Dashboard */}
        <div className="lg:col-span-7 border border-[#D1CEC7] bg-white min-h-[500px] flex flex-col justify-between">
          
          {/* Header Panel */}
          <div className="bg-[#F5F2EC]/60 px-5 py-3 border-b border-[#D1CEC7] flex items-center justify-between text-[10px] font-mono text-[#8C8984]">
            <span className="uppercase tracking-wider">02. Sandbox Terminal Output</span>
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <span className={`h-1.5 w-1.5 rounded-full ${result ? "bg-emerald-600" : isGenerating ? "bg-amber-500 animate-pulse" : "bg-zinc-300"}`} />
              {result ? "COMPILE SUCCESS" : isGenerating ? "GENERATING" : "IDLE / STANDBY"}
            </span>
          </div>

          {/* Core Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            {isGenerating && (
              <div className="h-full flex flex-col items-center justify-center py-20 space-y-4 text-center">
                <div className="relative h-12 w-12 flex items-center justify-center border border-[#E64833] bg-black text-[#E64833]">
                  <span className="h-5 w-5 border-2 border-[#E64833] border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="space-y-1.5">
                  <h5 className="text-sm font-serif font-bold text-[#1A1A1A]">Scheduling Google Gemini Engine...</h5>
                  <p className="text-[10px] text-[#8C8984] font-mono uppercase tracking-widest">
                    Enterprise API Handshake & Model Inference
                  </p>
                </div>
              </div>
            )}

            {!result && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center py-24 text-center space-y-3 font-serif text-xs text-[#8C8984]">
                <HelpCircle className="h-8 w-8 text-[#D1CEC7] stroke-[1.2] mx-auto" />
                <div className="space-y-1">
                  <p className="font-bold text-[#1A1A1A]">Awaiting Workspace Data</p>
                  <p className="max-w-xs mx-auto leading-relaxed text-[11px] text-[#5C5955]">
                    Configure sandbox parameters on the left pane and launch "COMPILE & RUN ALTERNATIVE" to trigger model inference.
                  </p>
                </div>
              </div>
            )}

            {result && !isGenerating && (
              <div className="space-y-6 font-serif animate-fade-in text-xs sm:text-sm text-[#1A1A1A]">
                
                {/* --- DISPLAY 1: COPYWRITER RESULT --- */}
                {appId === "ai-copywriter" && (
                  <div className="space-y-6">
                    {/* Headers / Hooks block */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Headlines */}
                      <div className="border border-[#D1CEC7] bg-[#FCFAF7] p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-[#D1CEC7] pb-1.5">
                          <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
                            ðŸŽ¯ Catchy Headlines
                          </span>
                          <button 
                            onClick={() => handleCopyToClipboard(result.headlines?.join("\n") || "", "headlines")}
                            className="text-[9px] font-mono text-[#8C8984] hover:text-[#1A1A1A] flex items-center gap-1 uppercase"
                          >
                            {copiedText === "headlines" ? "Copied" : <><Copy className="h-3 w-3" /> Copy</>}
                          </button>
                        </div>
                        <ul className="space-y-2 text-xs">
                          {result.headlines?.map((hl: string, i: number) => (
                            <li key={i} className="flex gap-2 items-start text-[#1A1A1A]">
                              <span className="font-mono text-[10px] text-[#8C8984]">[{i+1}]</span>
                              <span className="font-bold">{hl}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Hooks */}
                      <div className="border border-[#D1CEC7] bg-[#FCFAF7] p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-[#D1CEC7] pb-1.5">
                          <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
                            âš¡ Golden Hooks
                          </span>
                          <button 
                            onClick={() => handleCopyToClipboard(result.hooks?.join("\n") || "", "hooks")}
                            className="text-[9px] font-mono text-[#8C8984] hover:text-[#1A1A1A] flex items-center gap-1 uppercase"
                          >
                            {copiedText === "hooks" ? "Copied" : <><Copy className="h-3 w-3" /> Copy</>}
                          </button>
                        </div>
                        <ul className="space-y-2 text-xs">
                          {result.hooks?.map((hook: string, i: number) => (
                            <li key={i} className="flex gap-2 items-start text-[#1A1A1A]">
                              <span className="font-mono text-[10px] text-[#8C8984]">[{i+1}]</span>
                              <span className="italic font-medium">{hook}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Framework Details */}
                    <div className="bg-[#F5F2EC] px-4 py-2 border border-[#D1CEC7] text-[10px] font-mono uppercase tracking-wider flex justify-between">
                      <span>Structured Logic Framework:</span>
                      <strong className="text-[#E64833]">{result.frameworkUsed || "AIDA (Attention, Interest, Desire, Action)"}</strong>
                    </div>

                    {/* Sections copy content */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-[#D1CEC7] pb-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
                          ðŸ“ Full Copy Core Sections
                        </span>
                        <button 
                          onClick={() => {
                            const fullText = result.sections?.map((s: any) => `## ${s.title}\n${s.content}`).join("\n\n");
                            handleCopyToClipboard(fullText || "", "sections");
                          }}
                          className="text-[9px] font-mono text-[#8C8984] hover:text-[#1A1A1A] flex items-center gap-1 uppercase"
                        >
                          {copiedText === "sections" ? "Copied" : <><Copy className="h-3 w-3" /> Copy All</>}
                        </button>
                      </div>
                      
                      <div className="space-y-4 font-serif text-xs sm:text-sm">
                        {result.sections?.map((sec: any, idx: number) => (
                          <div key={idx} className="space-y-1.5">
                            <h5 className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 bg-[#E64833]" /> {sec.title}
                            </h5>
                            <p className="text-[#5C5955] leading-relaxed pl-3 border-l border-[#D1CEC7]">
                              {sec.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Strategy Advice */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block border-b border-[#D1CEC7] pb-1.5">
                        ðŸ“ˆ Strategic Advice
                      </span>
                      <ul className="space-y-2 text-xs">
                        {result.strategicAdvice?.map((adv: string, i: number) => (
                          <li key={i} className="flex gap-2 items-start text-[#5C5955]">
                            <span className="text-[#E64833] font-bold">âœ“</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}

                {/* --- DISPLAY 2: SEO RESULT --- */}
                {appId === "semantic-seo" && (
                  <div className="space-y-6">
                    {/* Core Assessment */}
                    <div className="border border-[#1A1A1A] p-4 bg-[#F5F2EC]/40 space-y-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E64833] block">
                        Core Competency Assessment
                      </span>
                      <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed font-serif">
                        {result.coreAssessment}
                      </p>
                    </div>

                    {/* Competitor Voids list */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block border-b border-[#D1CEC7] pb-1.5">
                        ðŸ•µï¸ Content Voids sur Competitors
                      </span>
                      <div className="space-y-3 text-xs">
                        {result.competitorVoids?.map((voidItem: any, idx: number) => (
                          <div key={idx} className="border border-[#D1CEC7] p-3 flex flex-col sm:flex-row justify-between gap-3 items-start">
                            <div className="space-y-1">
                              <strong className="text-[#1A1A1A] font-serif block">{voidItem.topic}</strong>
                              <p className="text-[#5C5955] font-serif">{voidItem.gapDescription}</p>
                            </div>
                            <span className={`px-2 py-0.5 font-mono font-bold text-[8px] uppercase tracking-wider shrink-0 border ${
                              voidItem.priority === "High" ? "border-[#E64833] text-[#E64833]" : voidItem.priority === "Medium" ? "border-amber-700 text-amber-700" : "border-[#8C8984] text-[#8C8984]"
                            }`}>
                              {voidItem.priority} Priority
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Keyword Opportunities */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block border-b border-[#D1CEC7] pb-1.5">
                        ðŸ“ˆ Keyword Opportunities
                      </span>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {result.keywordOpportunities?.map((kw: any, idx: number) => (
                          <div key={idx} className="border border-[#D1CEC7] bg-[#FCFAF7] p-3 space-y-2">
                            <div className="flex justify-between items-start">
                              <strong className="text-sm text-[#1A1A1A] font-serif block">{kw.keyword}</strong>
                              <span className="border border-[#D1CEC7] px-1.5 py-0.5 text-[8px] font-mono text-[#8C8984] uppercase">
                                {kw.searchIntent}
                              </span>
                            </div>
                            <p className="text-xs text-[#5C5955] leading-relaxed font-serif">{kw.recommendedFocus}</p>
                            
                            {/* Simple Difficulty Gauge */}
                            <div className="space-y-1 pt-1.5">
                              <div className="flex justify-between text-[8px] font-mono text-[#8C8984]">
                                <span>SEO Difficulty (KD)</span>
                                <span className="font-bold text-[#1A1A1A]">{kw.difficulty}/100</span>
                              </div>
                              <div className="w-full h-1 bg-[#D1CEC7] relative overflow-hidden">
                                <div 
                                  className={`h-full absolute left-0 top-0 ${kw.difficulty > 60 ? "bg-rose-600" : kw.difficulty > 35 ? "bg-amber-500" : "bg-emerald-600"}`}
                                  style={{ width: `${kw.difficulty}%` }}
                                  />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Plan */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block border-b border-[#D1CEC7] pb-1.5">
                        ðŸ—ºï¸ Actionable Content Plan
                      </span>
                      <ul className="space-y-2.5 text-xs text-[#5C5955]">
                        {result.contentStrategyPlan?.map((plan: string, i: number) => (
                          <li key={i} className="flex gap-2.5 items-start">
                            <span className="h-5 w-5 rounded-none border border-[#1A1A1A] bg-black text-white font-mono text-[9px] flex items-center justify-center shrink-0">
                              0{i+1}
                            </span>
                            <span className="pt-0.5">{plan}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )}

                {/* --- DISPLAY 3: CODE ARCHITECT RESULT --- */}
                {appId === "code-architect" && (
                  <div className="space-y-6">
                    {/* Architecture Overview */}
                    <div className="text-xs text-[#5C5955] font-serif border-l-2 border-[#1A1A1A] pl-3 py-1">
                      {result.architectureOverview}
                    </div>

                    {/* Code Blocks in Tabbed Sandbox */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-[#D1CEC7] pb-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
                          ðŸ’» Sandbox File Tree
                        </span>
                        {result.codeBlocks?.[activeCodeTabIndex] && (
                          <button 
                            onClick={() => handleCopyToClipboard(result.codeBlocks[activeCodeTabIndex].code || "", "code")}
                            className="text-[9px] font-mono text-[#8C8984] hover:text-[#1A1A1A] flex items-center gap-1 uppercase"
                          >
                            {copiedText === "code" ? "Copied" : <><Copy className="h-3 w-3" /> Copy Code</>}
                          </button>
                        )}
                      </div>

                      {/* File Tabs */}
                      <div className="flex border border-[#D1CEC7] overflow-x-auto divide-x divide-[#D1CEC7] bg-[#FCFAF7] text-[10px] font-mono">
                        {result.codeBlocks?.map((block: any, i: number) => (
                          <button
                            key={i}
                            onClick={() => setActiveCodeTabIndex(i)}
                            className={`px-4 py-2 transition-all ${
                              activeCodeTabIndex === i 
                                ? "bg-[#1A1A1A] text-white font-bold" 
                                : "text-[#5C5955] hover:bg-[#F5F2EC]"
                            }`}
                          >
                            ðŸ“„ {block.filename}
                          </button>
                        ))}
                      </div>

                      {/* Code terminal */}
                      {result.codeBlocks?.[activeCodeTabIndex] && (
                        <div className="border border-[#1A1A1A] bg-neutral-900 text-neutral-100 p-4 font-mono text-xs rounded-none overflow-x-auto space-y-3 max-h-[400px]">
                          <div className="flex justify-between text-[9px] text-[#8C8984] uppercase border-b border-neutral-800 pb-2">
                            <span>FILE: {result.codeBlocks[activeCodeTabIndex].filename}</span>
                            <span>{result.codeBlocks[activeCodeTabIndex].language}</span>
                          </div>
                          <pre className="text-[11px] leading-relaxed select-all whitespace-pre">
                            {result.codeBlocks[activeCodeTabIndex].code}
                          </pre>
                        </div>
                      )}
                    </div>

                    {/* Guide and best practices */}
                    <div className="grid sm:grid-cols-2 gap-5 pt-2">
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A] block border-b border-[#D1CEC7] pb-1">
                          ðŸ› ï¸ Integration Steps
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#5C5955]">
                          {result.implementationGuide?.map((g: string, i: number) => (
                            <li key={i} className="flex gap-1.5 items-start">
                              <span className="font-mono text-[10px] text-[#8C8984] font-bold">[{i+1}]</span>
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2.5">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A1A1A] block border-b border-[#D1CEC7] pb-1">
                          ðŸ’¡ Best Practices
                        </span>
                        <ul className="space-y-1.5 text-xs text-[#5C5955]">
                          {result.bestPractices?.map((bp: string, i: number) => (
                            <li key={i} className="flex gap-1.5 items-start">
                              <span className="text-[#E64833] font-bold">âœ“</span>
                              <span>{bp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                )}

                {/* --- DISPLAY 4: DOCUMENT ENGINE RESULT --- */}
                {appId === "document-engine" && (
                  <div className="space-y-6">
                    {/* Abstract */}
                    <div className="border border-[#D1CEC7] p-4 bg-[#F5F2EC]/40 space-y-1">
                      <span className="text-[9px] font-mono font-bold uppercase text-[#8C8984]">Document Abstract</span>
                      <p className="text-xs sm:text-sm text-[#1A1A1A] font-serif leading-relaxed italic">
                        {result.documentAbstract}
                      </p>
                    </div>

                    {/* findings audit table */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block border-b border-[#D1CEC7] pb-1.5">
                        âš ï¸ Critical Auditor Findings
                      </span>
                      <div className="space-y-3">
                        {result.findings?.map((find: any, idx: number) => (
                          <div key={idx} className="border border-[#D1CEC7] p-4 space-y-2 text-xs">
                            <div className="flex justify-between items-start gap-4">
                              <span className={`px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-widest border ${
                                find.level === "Critical" 
                                  ? "border-[#E64833] bg-[#E64833]/10 text-[#E64833]" 
                                  : find.level === "Warning" 
                                  ? "border-amber-700 bg-amber-500/10 text-amber-700" 
                                  : "border-[#8C8984] bg-neutral-100 text-[#8C8984]"
                              }`}>
                                {find.level}
                              </span>
                              <strong className="text-sm font-serif text-[#1A1A1A] flex-1">{find.point}</strong>
                            </div>
                            <div className="space-y-1 pl-4 border-l border-[#D1CEC7] text-[#5C5955] font-serif">
                              <p><strong>Evidence Clue:</strong> <span className="italic">&ldquo;{find.evidence}&rdquo;</span></p>
                              <p><strong>Auditor Analysis:</strong> {find.rationale}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics Key KPIs */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block border-b border-[#D1CEC7] pb-1.5">
                        ðŸ“Š Structured Metrics Extracted
                      </span>
                      <div className="grid gap-3 sm:grid-cols-3">
                        {result.structuredMetrics?.map((metric: any, idx: number) => (
                          <div key={idx} className="border border-[#D1CEC7] bg-[#FCFAF7] p-3 text-center space-y-1">
                            <span className="text-[9px] font-mono text-[#8C8984] uppercase tracking-wider block">{metric.label}</span>
                            <strong className="text-lg font-serif text-[#E64833] block">{metric.value}</strong>
                            <span className="text-[10px] text-[#5C5955] font-serif block leading-tight">{metric.context}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Overall Risk & Remediation */}
                    <div className="border border-[#1A1A1A] bg-[#F5F2EC] p-4 space-y-3 text-xs">
                      <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block border-b border-[#D1CEC7] pb-1">
                        ðŸ”’ Comprehensive Risk Assessment & Roadmap
                      </span>
                      <div className="space-y-3 font-serif">
                        <p className="text-[#1A1A1A] leading-relaxed italic">{result.riskAssessment}</p>
                        
                        <div className="space-y-2">
                          <span className="text-[9px] font-mono font-bold text-[#8C8984] uppercase block">Remediation action plan:</span>
                          <ul className="space-y-1 pl-1">
                            {result.actionItems?.map((act: string, idx: number) => (
                              <li key={idx} className="flex gap-2 items-start text-[#5C5955]">
                                <span className="font-mono font-bold text-[#E64833]">[{idx+1}]</span>
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* --- DISPLAY 5: TRANSLATION MATRIX RESULT --- */}
                {appId === "translation-matrix" && (
                  <div className="space-y-6">
                    {/* Source Analysis details */}
                    <div className="flex flex-wrap gap-4 text-xs font-mono justify-between bg-[#F5F2EC] p-3.5 border border-[#D1CEC7]">
                      <div className="space-y-1">
                        <span className="text-[#8C8984] text-[8px] uppercase tracking-wider block">Detected Source Language</span>
                        <strong className="text-[#1A1A1A] uppercase">{result.sourceAnalyzed?.detectedLocale || "ZH-CN"}</strong>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[#8C8984] text-[8px] uppercase tracking-wider block">Tone Markers</span>
                        <div className="flex gap-1">
                          {result.sourceAnalyzed?.stylisticMarkers?.map((tag: string, i: number) => (
                            <span key={i} className="border border-[#D1CEC7] bg-white text-[#5C5955] px-1 py-0.5 text-[8px] uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Master translation block */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-[#D1CEC7] pb-1.5">
                        <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider">
                          ðŸ† Perfect Localized Translation
                        </span>
                        <button 
                          onClick={() => handleCopyToClipboard(result.translatedText || "", "translation")}
                          className="text-[9px] font-mono text-[#8C8984] hover:text-[#1A1A1A] flex items-center gap-1 uppercase"
                        >
                          {copiedText === "translation" ? "Copied" : <><Copy className="h-3 w-3" /> Copy Translation</>}
                        </button>
                      </div>
                      
                      <div className="border border-[#1A1A1A] bg-[#FCFAF7] p-5 text-sm sm:text-base text-[#1A1A1A] leading-relaxed font-serif select-all">
                        {result.translatedText}
                      </div>
                    </div>

                    {/* Cultural notes */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block border-b border-[#D1CEC7] pb-1.5">
                        ðŸ“– Localized Terminology & Idiom Conversions
                      </span>
                      <div className="space-y-2 text-xs">
                        {result.culturalLocalizationNotes?.map((note: any, idx: number) => (
                          <div key={idx} className="flex gap-2 items-start font-serif">
                            <span className="h-4 px-1 border border-[#D1CEC7] bg-[#F5F2EC] font-mono text-[9px] font-bold text-[#1A1A1A] shrink-0">
                              {note.term}
                            </span>
                            <span className="text-[#5C5955]">{note.explanation}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alternative tone variations */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block border-b border-[#D1CEC7] pb-1.5">
                        âš–ï¸ Alternative Tone Variations
                      </span>
                      <div className="space-y-3 text-xs">
                        {result.alternativeToneVariations?.map((variant: any, idx: number) => (
                          <div key={idx} className="border border-[#D1CEC7] bg-[#FCFAF7] p-3 space-y-1.5">
                            <div className="flex justify-between items-center text-[9px] font-mono text-[#8C8984] uppercase tracking-wider border-b border-neutral-100 pb-1">
                              <span>TONE: {variant.tone}</span>
                              <button 
                                onClick={() => handleCopyToClipboard(variant.text || "", `alt-${idx}`)}
                                className="hover:text-[#1A1A1A] flex items-center gap-1 text-[8px]"
                              >
                                {copiedText === `alt-${idx}` ? "Copied" : "Copy"}
                              </button>
                            </div>
                            <p className="text-[#1A1A1A] font-serif leading-relaxed italic">{variant.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )}
          </div>

          {/* Footer Panel with safety declarations */}
          <div className="bg-[#F5F2EC]/60 px-5 py-3 border-t border-[#D1CEC7] flex flex-col sm:flex-row justify-between items-center gap-2 text-[9px] font-mono text-[#8C8984] uppercase tracking-wider">
            <span>Enterprise Gateway SSL Encryption Active</span>
            <span>Zero Training Retention Applied</span>
          </div>

        </div>

      </div>

    </div>
  );
}
