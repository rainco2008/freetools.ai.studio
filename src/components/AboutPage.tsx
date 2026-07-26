import { ShieldCheck, Compass, Sparkles, Star } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 md:px-8 py-16 space-y-16 bg-[#FCFAF7]">
      {/* 1. Header Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="inline-block px-2 py-0.5 border border-[#1A1A1A] text-[9px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
          OPERATIONAL MANIFESTO
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#1A1A1A]">
          Our Core Thesis
        </h2>
        <div className="h-px w-16 bg-[#E64833] mx-auto pt-0.5" />
      </div>

      {/* 2. Core Body Text with Editorial Column Layout */}
      <div className="grid md:grid-cols-2 gap-10 font-serif text-base sm:text-lg text-[#1A1A1A] leading-relaxed">
        <div className="space-y-6">
          <p className="font-bold italic text-xl leading-relaxed text-[#E64833]">
            The rapid democratization of artificial intelligence has led to a fragmented, paywall-heavy software market. freetools.ai.studio was established to solve two core friction points: discovery and accessibility.
          </p>
          <p>
            Today, the AI software landscape exhibits an absurd polarization: foundational model developers are continually open-sourcing or offering highly affordable API access; however, consumer SaaS applications continue to wrap standard copywriting, basic SEO, and general development tasks behind steep monthly paywalls.
          </p>
          <p>
            Independent creators, small business owners, and solo developers face a silent inflation of tools and subscription traps, adding up to hundreds of dollars a month for services like Jasper, Semrush, or basic writing copilots.
          </p>
        </div>

        <div className="space-y-6 md:pt-1">
          <p>
            We serve as an architectural ledger monitoring the global AI economy while building native, unrestricted execution spaces powered by next-generation models like Google Gemini.
          </p>
          <p>
            We firmly believe that basic semantic analysis, copywriting pipelines, code generation, and language localization should remain free, unhindered technical infrastructure accessible to everyone across the globe.
          </p>
          <p>
            This led us to design our dual-purpose registry and alternative sandbox. It acts as an unbiased catalog auditing commercial marketing hype while functioning as a zero-cost workspace for Google Grounded search research and deep context document processing.
          </p>
          <p className="font-sans text-sm font-bold uppercase tracking-wider text-[#8C8984]">
            — freetools.ai.studio core research group
          </p>
        </div>
      </div>

      {/* 3. The 3 Pillars Blocks */}
      <div className="border-y border-[#D1CEC7] py-10 grid sm:grid-cols-3 gap-8">
        <div className="space-y-2.5">
          <Compass className="h-5 w-5 text-[#E64833] stroke-[1.5]" />
          <h4 className="text-base font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
            01. Auditing Ledger
          </h4>
          <p className="text-sm text-[#5C5955] leading-relaxed font-serif">
            We systematically compile and dissect commercial SaaS pricing structures and hidden pitfalls, providing marketing-free technical audits.
          </p>
        </div>

        <div className="space-y-2.5">
          <Sparkles className="h-5 w-5 text-[#E64833] stroke-[1.5]" />
          <h4 className="text-base font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
            02. Native Alternatives
          </h4>
          <p className="text-sm text-[#5C5955] leading-relaxed font-serif">
            Unrestricted, credit-free workspaces built directly on Google Gemini to process critical workflows without requiring a subscription.
          </p>
        </div>

        <div className="space-y-2.5">
          <ShieldCheck className="h-5 w-5 text-[#E64833] stroke-[1.5]" />
          <h4 className="text-base font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
            03. Enterprise Privacy
          </h4>
          <p className="text-sm text-[#5C5955] leading-relaxed font-serif">
            All user queries, files, and generated templates are treated with enterprise confidentiality and completely deleted upon session termination.
          </p>
        </div>
      </div>
    </div>
  );
}
