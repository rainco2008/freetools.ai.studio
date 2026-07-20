export function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-16 space-y-12 bg-[#FCFAF7]">
      <div className="space-y-4 text-center">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C8984]">
          LEGAL FRAMEWORK
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#1A1A1A]">
          Terms of Use
        </h2>
        <p className="text-xs text-[#8C8984] font-mono uppercase tracking-widest">
          Last Updated: July 18, 2026
        </p>
        <div className="h-px w-12 bg-[#E64833] mx-auto pt-0.5" />
      </div>

      <div className="prose prose-sm font-serif text-sm text-[#1A1A1A] space-y-8 leading-relaxed">
        
        <section className="space-y-3">
          <h4 className="text-sm font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
            1. Acceptance of Terms
          </h4>
          <p>
            By accessing and utilizing the web properties, directory services, and embedded API client tools hosted at freetools.ai.studio (&ldquo;the Platform&rdquo;), you agree to be bound legally by these Terms of Use. If you do not agree, cease all operational use of the Platform immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
            2. Scope of Service & Directory Disclaimers
          </h4>
          <p>
            The Platform functions as a centralized information repository tracking third-party software products. We maintain no affiliate liability, operational control, or performance guarantees over external software items catalogued in the directory. Users engage with third-party sites at their own individual discretion.
          </p>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
            3. Fair Use Policies for Built-In Studio Tools
          </h4>
          <p>
            The free AI utilities provided within the Studio domain are offered to the public without subscription fees. However, automated scraping, API abuse, bulk vector embedding querying, or adversarial prompt-injection scripts designed to crash or exploit our systems are strictly prohibited. We reserve the right to limit access via IP metrics or API rate-limiting layers to preserve system stability.
          </p>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
            4. Limitation of Liability
          </h4>
          <p>
            All structural components, platform software, and Gemini-derived analytical outputs are provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo; basis. The Platform assumes zero liability for direct or indirect losses, business interruptions, data inaccuracies, or development failures stemming from your use of these tools.
          </p>
        </section>

      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-16 space-y-12 bg-[#FCFAF7]">
      <div className="space-y-4 text-center">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C8984]">
          DATA CONSTITUTION
        </span>
        <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-[#1A1A1A]">
          Privacy Policy
        </h2>
        <p className="text-xs text-[#8C8984] font-mono uppercase tracking-widest">
          Last Updated: July 18, 2026
        </p>
        <div className="h-px w-12 bg-[#E64833] mx-auto pt-0.5" />
      </div>

      <div className="prose prose-sm font-serif text-sm text-[#1A1A1A] space-y-8 leading-relaxed">
        
        <section className="space-y-3">
          <h4 className="text-sm font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
            1. Data Collection Architecture
          </h4>
          <p>
            The Platform minimizes user tracking protocols to maintain an agile, private navigation environment. We collect:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5C5955]">
            <li><strong>Technical Metadata:</strong> Anonymized IP addresses, browser agents, and core navigation events to optimize platform query performance.</li>
            <li><strong>Studio Inputs:</strong> Text blocks, source code fragments, or documents explicitly uploaded by users into the Gemini-powered alternative tools.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
            2. Data Processing & The Gemini Gateway
          </h4>
          <p>
            User inputs submitted directly through the Studio workspace are securely routed to the Google Gemini API processing infrastructure for real-time inference generation.
          </p>
          <p className="border-l-2 border-[#E64833] pl-4 italic text-xs text-[#5C5955]">
            <strong>No Training Retention:</strong> We explicitly deploy enterprise-grade API connections ensuring your proprietary prompt text, target code documents, or private analytical files are <strong>never</strong> utilized for foundational model retraining or stored on our localized servers beyond the active user session.
          </p>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
            3. Cookie Management & Local Storage
          </h4>
          <p>
            We utilize minimal browser local storage strictly to save your UI states (e.g., preserving your bookmarks history indices or layout custom settings). We do not implement persistent cross-site tracking pixels or target advertising cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h4 className="text-sm font-sans font-bold uppercase tracking-wider text-[#1A1A1A]">
            4. Global Compliance & User Rights
          </h4>
          <p>
            The Platform complies strictly with standard cross-border data protection principles. Users retain complete autonomy to delete their browser-side cached bookmarks or purge individual active session states instantly from their local client interface.
          </p>
        </section>

      </div>
    </div>
  );
}
