import { Menu, Compass } from "lucide-react";

interface NavigationProps {
  onOpenSidebar?: () => void;
  showSidebarButton?: boolean;
}

export function Header({ onOpenSidebar, showSidebarButton = false }: NavigationProps) {
  return (
    <header className="no-print flex h-16 shrink-0 items-center justify-between border-b border-[#D1CEC7] bg-[#F5F2EC] px-4 md:px-8">
      <div className="flex items-center gap-3">
        {showSidebarButton && onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="flex h-9 w-9 items-center justify-center border border-[#D1CEC7] bg-white text-[#8C8984] hover:text-[#1A1A1A] hover:bg-[#EAE6DF] lg:hidden transition-colors"
            title="Open History Library"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <a href="/" className="flex flex-col group">
          <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#8C8984] mb-0.5 leading-none transition-colors group-hover:text-[#1A1A1A]">
            CURATED CATALOG & STUDIO
          </span>
          <h1 className="text-xl font-serif italic font-black leading-none text-[#1A1A1A]">
            freetools<span className="text-[#E64833] font-sans not-italic font-bold">.ai.studio</span>
          </h1>
        </a>
      </div>

      <nav className="hidden md:flex items-center gap-6 text-[11px] font-mono uppercase tracking-widest text-[#5C5955]">
        <a href="/#/discover" className="hover:text-[#1A1A1A] transition-colors">Discover Categories</a>
        <a href="/#/about" className="hover:text-[#1A1A1A] transition-colors">Our Manifesto</a>
        <span className="h-3 w-px bg-[#D1CEC7]" />
        <a 
          href="/#/studio/research-brief"
          className="px-3.5 py-1.5 border border-[#1A1A1A] bg-black text-white hover:bg-white hover:text-[#1A1A1A] transition-all text-[9px] font-bold tracking-[0.15em]"
        >
          LAUNCH STUDIO
        </a>
        <a
          href="https://aistudio.google.com/apps"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 border border-[#D1CEC7] bg-white px-2 py-1.5 text-[9px] font-bold tracking-[0.12em] text-[#5C5955] transition-all hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
          title="Open Google AI Studio to import and publish this project"
          aria-label="Deploy with Google AI Studio"
        >
          <img src="/branding/google-ai-studio-deploy-badge.png" alt="Google Cloud deployment" className="h-5 w-16 object-contain" />
          <span>DEPLOY</span>
        </a>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="no-print border-t border-[#D1CEC7] bg-[#F5F2EC] py-12 px-4 md:px-8 text-xs text-[#5C5955]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-3">
          <a href="/" className="text-lg font-serif italic font-black text-[#1A1A1A] leading-none">
            freetools<span className="text-[#E64833] font-sans not-italic font-bold">.ai.studio</span>
          </a>
          <p className="text-xs text-[#8C8984] font-serif max-w-sm">
            A real-time database tracking global AI application ecosystems and monetization frameworks, powered by Google Gemini custom alternatives.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-wider text-[#8C8984]">
          <a href="/" className="hover:text-[#1A1A1A] transition-colors">Catalog Hub</a>
          <a href="/#/discover" className="hover:text-[#1A1A1A] transition-colors">Discover</a>
          <a href="/#/about" className="hover:text-[#1A1A1A] transition-colors">About Mission</a>
          <a href="/#/terms" className="hover:text-[#1A1A1A] transition-colors">Terms of Use</a>
          <a href="/#/privacy" className="hover:text-[#1A1A1A] transition-colors">Privacy Policy</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#D1CEC7]/55 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-[#8C8984] font-mono uppercase tracking-widest">
        <span>© 2026 FREETOOLS.AI.STUDIO. ALL RIGHTS RESERVED.</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 bg-[#E64833]" /> POWERED BY GEMINI-3.5-FLASH
        </span>
      </div>
    </footer>
  );
}
