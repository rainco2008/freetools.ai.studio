import { Code2, Image as ImageIcon } from "lucide-react";
import { Locale, TOOL_COUNTS } from "../freeToolsCatalog";
import { openConsentSettings } from "../lib/analytics";

export function Footer({ locale = "zh" }: { locale?: Locale }) {
  const zh = locale === "zh";
  return (
    <footer className="no-print border-t border-[#D8D3CA] bg-[#1A1A1A] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <a href="#/" className="font-serif text-xl font-black italic">
            freetools
            <span className="font-sans font-bold not-italic text-[#FF715B]">.ai.studio</span>
          </a>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/60">
            {zh
              ? "无需注册、无需订阅的浏览器工具箱。开发与图片处理工具优先在本地运行。"
              : "A no-sign-up, no-subscription browser toolbox. Developer and image utilities run locally whenever possible."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/70">
            <a href="#/developer" className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-2 hover:border-white/40">
              <Code2 className="h-3.5 w-3.5 text-[#FF715B]" />
              {zh ? "开发工具" : "Developer Tools"} · {TOOL_COUNTS.developer}
            </a>
            <a href="#/image" className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-2 hover:border-white/40">
              <ImageIcon className="h-3.5 w-3.5 text-[#FF715B]" />
              {zh ? "图片工具" : "Image Tools"} · {TOOL_COUNTS.image}
            </a>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60" aria-label="Footer navigation">
          <a href="#/" className="hover:text-white">{zh ? "首页" : "Home"}</a>
          <a href="#/terms" className="hover:text-white">{zh ? "使用条款" : "Terms"}</a>
          <a href="#/privacy" className="hover:text-white">{zh ? "隐私政策" : "Privacy"}</a>
          <button type="button" onClick={openConsentSettings} className="hover:text-white">
            {zh ? "Cookie 设置" : "Cookie settings"}
          </button>
        </nav>
      </div>
      <div className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-white/40">
        © 2026 freetools.ai.studio · GPLv3
      </div>
    </footer>
  );
}
