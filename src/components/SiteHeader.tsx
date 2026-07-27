import { FormEvent, useEffect, useState } from "react";
import {
  Code2,
  Home,
  Image as ImageIcon,
  Languages,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Locale, TOOL_COUNTS } from "../freeToolsCatalog";
import UserMenu from "./UserMenu";

interface SiteHeaderProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
  route: "home" | "developer" | "image" | "bouquet" | "terms" | "privacy";
}

const copy = {
  zh: {
    home: "首页",
    developer: "开发工具",
    image: "图片工具",
    search: "搜索免费工具",
    menu: "打开导航菜单",
    close: "关闭导航菜单",
  },
  en: {
    home: "Home",
    developer: "Developer Tools",
    image: "Image Tools",
    search: "Search free tools",
    menu: "Open navigation menu",
    close: "Close navigation menu",
  },
};

export default function SiteHeader({
  locale,
  onLocaleChange,
  route,
}: SiteHeaderProps) {
  const t = copy[locale];
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [route]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const normalized = query.trim();
    const targetUrl = normalized ? `/?q=${encodeURIComponent(normalized)}` : "/";
    window.history.pushState({}, "", targetUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
    setSearchOpen(false);
    setMenuOpen(false);
  };

  const navItems = [
    { id: "home", href: "/", label: t.home, icon: Home },
    {
      id: "developer",
      href: "/developer",
      label: t.developer,
      count: TOOL_COUNTS.developer,
      icon: Code2,
    },
    {
      id: "image",
      href: "/image",
      label: t.image,
      count: TOOL_COUNTS.image,
      icon: ImageIcon,
    },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-[#D8D3CA] bg-[#FCFAF7]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex min-w-0 shrink-0 items-center gap-2.5" aria-label="freetools.ai.studio">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#1A1A1A] font-serif text-sm font-black text-white">
            F
          </span>
          <span className="truncate font-serif text-lg font-black italic text-[#1A1A1A] sm:text-xl">
            freetools
            <span className="font-sans font-bold not-italic text-[#E64833]">.ai.studio</span>
          </span>
        </a>

        <nav className="ml-5 hidden h-full items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              route === item.id || (item.id === "image" && route === "bouquet");
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex h-10 items-center gap-2 rounded-md px-3 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-[#1A1A1A] text-white"
                    : "text-[#5C5955] hover:bg-[#F0ECE5] hover:text-[#1A1A1A]"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-white" : "text-[#E64833]"}`} />
                <span>{item.label}</span>
                {"count" in item && (
                  <span className={`text-xs ${active ? "text-white/70" : "text-[#8C8984]"}`}>
                    {item.count}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          <form onSubmit={submitSearch} className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C8984]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              aria-label={t.search}
              className="h-10 w-52 rounded-md border border-[#D8D3CA] bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#1A1A1A] xl:w-64"
            />
          </form>
          <button
            type="button"
            onClick={() => onLocaleChange(locale === "zh" ? "en" : "zh")}
            className="flex h-10 items-center gap-1.5 rounded-md border border-[#D8D3CA] bg-white px-3 text-xs font-bold text-[#5C5955] hover:border-[#1A1A1A] hover:text-[#1A1A1A]"
            aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}
          >
            <Languages className="h-4 w-4 text-[#E64833]" />
            {locale === "zh" ? "EN" : "中文"}
          </button>
          <UserMenu locale={locale} />
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <UserMenu locale={locale} />
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-md border border-[#D8D3CA] bg-white text-[#1A1A1A]"
            aria-label={t.search}
            aria-expanded={searchOpen}
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center rounded-md bg-[#1A1A1A] text-white"
            aria-label={menuOpen ? t.close : t.menu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <form onSubmit={submitSearch} className="border-t border-[#E6E1D8] p-3 lg:hidden">
          <div className="relative mx-auto max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C8984]" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              aria-label={t.search}
              className="h-11 w-full rounded-md border border-[#1A1A1A] bg-white pl-9 pr-3 text-sm outline-none"
            />
          </div>
        </form>
      )}

      {menuOpen && (
        <div className="border-t border-[#E6E1D8] bg-[#FCFAF7] p-4 shadow-xl lg:hidden">
          <nav className="mx-auto grid max-w-xl gap-2" aria-label="Mobile navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                route === item.id || (item.id === "image" && route === "bouquet");
              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-12 items-center justify-between rounded-md border px-4 py-3 text-sm font-semibold ${
                    active
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                      : "border-[#D8D3CA] bg-white text-[#1A1A1A]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${active ? "text-white" : "text-[#E64833]"}`} />
                    {item.label}
                  </span>
                  {"count" in item && <span className="text-xs opacity-70">{item.count}</span>}
                </a>
              );
            })}
            <button
              type="button"
              onClick={() => onLocaleChange(locale === "zh" ? "en" : "zh")}
              className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#D8D3CA] bg-white text-sm font-semibold text-[#5C5955]"
            >
              <Languages className="h-4 w-4 text-[#E64833]" />
              {locale === "zh" ? "English" : "简体中文"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
