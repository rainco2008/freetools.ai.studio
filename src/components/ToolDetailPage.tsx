import { useMemo } from "react";
import { ArrowLeft, ExternalLink, ShieldCheck, Check, AlertCircle, Sparkles, Star } from "lucide-react";
import { Tool, TOOLS_DATABASE, STUDIO_APPS } from "../data";

interface ToolDetailPageProps {
  slug: string;
}

export default function ToolDetailPage({ slug }: ToolDetailPageProps) {
  const tool = useMemo(() => {
    return TOOLS_DATABASE.find((t) => t.slug === slug);
  }, [slug]);

  const studioAppAlternative = useMemo(() => {
    if (!tool || !tool.studioAlternativeId) return null;
    return STUDIO_APPS.find((app) => app.id === tool.studioAlternativeId);
  }, [tool]);

  if (!tool) {
    return (
      <div className="mx-auto max-w-3xl py-20 px-4 text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-[#E64833] mx-auto" />
        <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">Audit Record Not Found</h3>
        <p className="text-xs text-[#8C8984] font-serif">The AI software analysis page you are trying to visit does not exist or has been removed from our database.</p>
        <a
          href="#/"
          className="inline-block px-4 py-2 border border-[#1A1A1A] bg-black text-white text-[9px] uppercase font-bold tracking-widest hover:bg-black/85 transition-colors"
        >
          BACK TO CATALOG
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8 py-10 space-y-10 bg-[#FCFAF7]">
      {/* Back button */}
      <div>
        <a 
          href="#/" 
          className="inline-flex items-center gap-1.5 text-xs text-[#5C5955] hover:text-[#1A1A1A] font-mono uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Directory
        </a>
      </div>

      {/* Hero Overview Header Card */}
      <div className="border border-[#1A1A1A] bg-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-[#D1CEC7] px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest text-[#8C8984] bg-[#FCFAF7]">
              {tool.category} / {tool.subCategory}
            </span>
            {tool.verified && (
              <span className="bg-[#E64833] text-white px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider">
                COMMUNITY VERIFIED
              </span>
            )}
          </div>
          
          <h2 className="text-2xl md:text-3xl font-serif font-black text-[#1A1A1A]">
            {tool.name} <span className="text-xs font-mono font-normal text-[#8C8984]">Audit v1.4.2</span>
          </h2>

          <p className="text-[11px] text-[#5C5955] font-serif italic max-w-xl">
            &ldquo;{tool.description}&rdquo;
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
          <a
            href={tool.officialUrl}
            target="_blank"
            rel="noopener noreferrer referrerPolicy"
            className="flex-1 sm:flex-none text-center px-4 py-2.5 border border-[#1A1A1A] bg-black text-white text-[9px] uppercase font-bold tracking-widest hover:bg-[#1A1A1A]/85 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Visit Official Site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button className="flex-1 sm:flex-none text-center px-4 py-2.5 border border-[#D1CEC7] bg-white text-[9px] uppercase font-bold tracking-widest hover:border-[#1A1A1A] transition-all">
            Bookmark Audit
          </button>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Audit Reviews & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Detailed Overview */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-[#1A1A1A] border-b border-[#D1CEC7] pb-2">
              01. PRODUCT OVERVIEW & DEEP REVIEW
            </h3>
            <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed font-serif">
              {tool.overview}
            </p>
          </div>

          {/* Pros & Cons Block */}
          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            {/* Pros */}
            <div className="space-y-3 bg-[#FCFAF7] border border-[#D1CEC7] p-5">
              <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block border-b border-[#D1CEC7] pb-1">
                âœ” ADVANTAGES / GENERAL PROS
              </span>
              <ul className="space-y-2.5 text-xs text-[#5C5955] font-serif">
                {tool.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#E64833] font-bold shrink-0">âœ“</span>
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="space-y-3 bg-[#FCFAF7] border border-[#D1CEC7] p-5">
              <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-wider block border-b border-[#D1CEC7] pb-1">
                âœ˜ DISADVANTAGES / MAJOR CONS
              </span>
              <ul className="space-y-2.5 text-xs text-[#5C5955] font-serif">
                {tool.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#8C8984] font-bold shrink-0">âš </span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Technical Specs & Features */}
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-[#1A1A1A] border-b border-[#D1CEC7] pb-2">
              02. FUNCTIONAL MATRIX / FEATURES LIST
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-serif">
              {tool.features.map((feat, i) => (
                <div key={i} className="border border-[#D1CEC7] bg-[#F5F2EC]/30 py-3 px-2">
                  <span className="font-bold text-[#1A1A1A]">{feat}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right 1 Column: Strategic Context & Studio Callout */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Metadata Specifications */}
          <div className="border border-[#D1CEC7] bg-[#F5F2EC] p-5 space-y-4">
            <span className="text-[10px] font-mono font-bold text-[#1A1A1A] uppercase tracking-widest block border-b border-[#D1CEC7] pb-1.5">
              SPECIFICATIONS
            </span>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8C8984] font-serif">Pricing Model:</span>
                <span className="font-mono font-bold text-[#1A1A1A] uppercase">{tool.priceRange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8984] font-serif">Original Cost:</span>
                <span className="font-serif text-[#1A1A1A] font-bold text-right max-w-[150px]">{tool.priceInfo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8984] font-serif">Trust Score:</span>
                <span className={`font-mono font-bold uppercase ${tool.trustScore === "High" ? "text-emerald-700" : tool.trustScore === "Medium" ? "text-amber-700" : "text-rose-700"}`}>
                  {tool.trustScore}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C8984] font-serif">Industry Benchmark:</span>
                <span className="font-mono font-bold text-[#1A1A1A]">{tool.industryAnchor}</span>
              </div>
            </div>
          </div>

          {/* STUDIO ALTERNATIVE CALLOUT BOX */}
          {studioAppAlternative && (
            <div className="border-2 border-[#1A1A1A] bg-white p-5 space-y-4 relative overflow-hidden">
              <div className="absolute right-0 top-0 bg-[#E64833] text-white text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5">
                FREE APP AVAILABLE
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#E64833]" />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#E64833]">
                    THE STUDIO ALTERNATIVE
                  </span>
                </div>
                
                <h4 className="text-base font-serif font-black text-[#1A1A1A]">
                  Bypass the Paywall.
                </h4>
                
                <p className="text-xs text-[#5C5955] leading-relaxed font-serif">
                  Skip binding your credit card or dealing with expensive recurring plans. We have configured the Google Gemini intelligence engine to cover this exact feature set, giving you a high-fidelity, high-density Studio native alternative for free.
                </p>
              </div>

              <div className="bg-[#F5F2EC] p-3 border border-[#D1CEC7] text-[11px] font-serif italic text-[#8C8984]">
                &ldquo;{studioAppAlternative.tagline}&rdquo;
              </div>

              <a
                href={`#/studio/${studioAppAlternative.id}?tool=${encodeURIComponent(tool.slug)}`}
                className="block text-center w-full py-3 bg-[#1A1A1A] text-white hover:bg-[#E64833] transition-colors text-[9px] font-mono font-bold uppercase tracking-widest"
              >
                Launch Gemini App Instantly
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
