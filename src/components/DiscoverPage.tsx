import { CATEGORIES, STUDIO_APPS, TOOLS_DATABASE } from "../data";
import { Sparkles, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

export default function DiscoverPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 space-y-12 bg-[#FCFAF7]">
      
      {/* 1. Header Area */}
      <div className="text-left space-y-3 border-b border-[#D1CEC7] pb-8">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C8984]">
          TAXONOMY & TAX RATE EXPLORER
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-[#1A1A1A]">
          Explore Categories
        </h2>
        <p className="text-xs sm:text-sm text-[#5C5955] leading-relaxed font-serif max-w-xl">
          Conduct unbiased auditing across diverse technical categories and locate their native, free Google Gemini workspaces with zero friction.
        </p>
      </div>

      {/* 2. Categories Grid list */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => {
          const matchingTools = TOOLS_DATABASE.filter(t => t.category === category);
          const studioApps = STUDIO_APPS.filter(app => app.category === category);

          return (
            <div 
              key={category}
              className="border border-[#D1CEC7] bg-[#F5F2EC]/40 p-6 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span className="border border-[#1A1A1A] bg-black text-white px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider inline-block">
                  SECTOR INDEX
                </span>
                
                <h3 className="text-lg font-serif font-black text-[#1A1A1A]">{category}</h3>
                
                <p className="text-xs text-[#8C8984] font-mono uppercase tracking-wider">
                  Indexed Records: {matchingTools.length} Standard | {studioApps.length} Gemini Alts
                </p>
              </div>

              {/* Sub-Items or studio alternatives list */}
              {studioApps.length > 0 && (
                <div className="border-t border-[#D1CEC7] pt-4 space-y-2">
                  <span className="text-[9px] font-mono font-bold uppercase text-[#8C8984] tracking-widest block">
                    Available Studio Engines:
                  </span>
                  <div className="space-y-1.5">
                    {studioApps.map(app => (
                      <a 
                        key={app.id}
                        href={`#/studio/${app.id}`}
                        className="flex items-center justify-between text-xs font-serif font-bold text-[#1A1A1A] hover:text-[#E64833] group transition-colors"
                      >
                        <span>{app.name}</span>
                        <ArrowRight className="h-3 w-3 text-[#1A1A1A] group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <a 
                href={`#/?category=${encodeURIComponent(category)}`}
                className="block text-center py-2 border border-[#1A1A1A] bg-white text-[9px] uppercase font-mono font-bold tracking-widest hover:bg-black hover:text-white transition-all"
                onClick={() => {
                  // Fallback for simple hash trigger
                  window.location.hash = `#/`;
                }}
              >
                Explore Directory Sector
              </a>
            </div>
          );
        })}
      </div>

      {/* 3. Deep Dossier Presets */}
      <div className="space-y-4 pt-4 border-t border-[#D1CEC7]">
        <div className="flex items-center gap-2 text-[#8C8984]">
          <HelpCircle className="h-4 w-4 stroke-[1.5]" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
            SPECIAL DOSSIERS / SEED QUERIES
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 text-xs font-serif">
          {[
            { label: "Superconductor Breakthroughs", q: "What are the latest experimental breakthroughs and debates regarding room-temperature superconductivity in 2026?" },
            { label: "Solid-State Battery Progress", q: "What is the commercialization timeline and gigafactory production capacity roadmap for solid-state batteries globally?" },
            { label: "Foldable Smartphone Panel Tech", q: "Compare the display panel technology, hinge mechanisms, and competitive advantages of 2026 foldable smartphones." },
            { label: "Caffeine & Bone Health", q: "Does long-term intake of high caffeine or sugar-free functional drinks cause calcium depletion or osteoporosis according to peer-reviewed studies?" }
          ].map((item, idx) => (
            <a 
              key={idx}
              href={`#/studio/research-brief?preset=${encodeURIComponent(item.q)}`}
              className="border border-[#D1CEC7] bg-white p-4 hover:border-[#1A1A1A] transition-colors hover:bg-[#F2EFE9] flex flex-col justify-between h-28"
            >
              <span className="text-[9px] font-mono text-[#8C8984] uppercase tracking-wider block mb-2">{item.label}</span>
              <span className="font-bold text-[#1A1A1A] line-clamp-2 leading-relaxed">{item.q}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
