import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Braces,
  Check,
  Code2,
  FileImage,
  Image as ImageIcon,
  Search,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";
import {
  DEVELOPER_GROUPS,
  FREE_TOOLS,
  IMAGE_GROUPS,
  Locale,
  matchesToolQuery,
  POPULAR_TOOLS,
  TOOL_COUNTS,
} from "../freeToolsCatalog";

interface FreeToolsHomeProps {
  locale: Locale;
  initialQuery?: string;
}

const copy = {
  zh: {
    badge: "免费使用 · 登录可选 · 浏览器优先",
    title: "常用工具，打开就能用。",
    intro:
      "开发、编码、格式转换、图片编辑与媒体处理工具集中在一个清晰、快速、注重隐私的工作区。",
    searchPlaceholder: "搜索 JSON、Base64、UUID、图片压缩、背景移除…",
    searchButton: "搜索工具",
    privacy: "大多数工具在本地浏览器处理",
    noAccount: "无需账户或付费订阅",
    developer: "开发工具",
    developerIntro: "面向开发者的编码、格式化、安全、网络和计算工具。",
    image: "图片工具",
    imageIntro: "截图、美化、编辑、压缩、转换和视频处理工具。",
    openCategory: "浏览全部",
    popular: "常用工具",
    results: "搜索结果",
    resultCount: "个匹配工具",
    noResults: "没有找到匹配工具，请尝试更短或更通用的关键词。",
    openTool: "打开工具",
    local: "本地工具",
    cloud: "云端 AI",
    allTools: "免费工具",
    groups: "功能分组",
  },
  en: {
    badge: "FREE TO USE · SIGN-IN OPTIONAL · BROWSER-FIRST",
    title: "Useful tools, ready when you are.",
    intro:
      "Developer, encoding, conversion, image, and media utilities in one clear, fast, privacy-minded workspace.",
    searchPlaceholder: "Search JSON, Base64, UUID, image compression, background removal…",
    searchButton: "Search tools",
    privacy: "Most tools process locally in your browser",
    noAccount: "No account or paid subscription required",
    developer: "Developer Tools",
    developerIntro: "Encoding, formatting, security, network, and calculation tools for developers.",
    image: "Image Tools",
    imageIntro: "Screenshot, beautify, edit, compress, convert, and video utilities.",
    openCategory: "Browse all",
    popular: "Popular tools",
    results: "Search results",
    resultCount: "matching tools",
    noResults: "No matching tools found. Try a shorter or more general keyword.",
    openTool: "Open tool",
    local: "Local tool",
    cloud: "Cloud AI",
    allTools: "Free tools",
    groups: "tool groups",
  },
};

function toolIcon(family: "developer" | "image") {
  return family === "developer" ? Code2 : ImageIcon;
}

export default function FreeToolsHome({ locale, initialQuery = "" }: FreeToolsHomeProps) {
  const t = copy[locale];
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  const normalizedQuery = initialQuery.trim();
  const visibleTools = useMemo(
    () =>
      normalizedQuery
        ? FREE_TOOLS.filter((tool) => matchesToolQuery(tool, normalizedQuery))
        : POPULAR_TOOLS,
    [normalizedQuery],
  );

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const normalized = query.trim();
    window.location.hash = normalized ? `#/?q=${encodeURIComponent(normalized)}` : "#/";
  };

  return (
    <div className="bg-[#FCFAF7]">
      <section className="border-b border-[#D8D3CA]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center lg:px-8 lg:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F2B7AA] bg-[#FFF1ED] px-3 py-1.5 text-xs font-bold text-[#C83D2C]">
              <Sparkles className="h-3.5 w-3.5" />
              {t.badge}
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-[-0.04em] text-[#1A1A1A] sm:text-5xl lg:text-6xl">
              {t.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#5C5955] sm:text-lg">
              {t.intro}
            </p>

            <form onSubmit={submitSearch} className="mt-8 flex max-w-2xl flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8C8984]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.searchPlaceholder}
                  aria-label={t.searchPlaceholder}
                  className="h-14 w-full rounded-md border border-[#1A1A1A] bg-white pl-12 pr-4 text-sm outline-none ring-[#E64833]/20 transition focus:ring-4"
                />
              </div>
              <button className="h-14 rounded-md bg-[#E64833] px-6 text-sm font-bold text-white transition hover:bg-[#C83D2C]">
                {t.searchButton}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#5C5955]">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                {t.privacy}
              </span>
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-700" />
                {t.noAccount}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { value: TOOL_COUNTS.total, label: t.allTools, icon: Zap },
              { value: TOOL_COUNTS.developer, label: t.developer, icon: Braces },
              { value: TOOL_COUNTS.image, label: t.image, icon: FileImage },
              {
                value: TOOL_COUNTS.developerGroups + TOOL_COUNTS.imageGroups,
                label: t.groups,
                icon: WandSparkles,
              },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`rounded-lg border p-5 ${
                    index === 0
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                      : "border-[#D8D3CA] bg-white text-[#1A1A1A]"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${index === 0 ? "text-[#FF7A65]" : "text-[#E64833]"}`} />
                  <div className="mt-5 text-3xl font-black">{stat.value}</div>
                  <div className={`mt-1 text-sm ${index === 0 ? "text-white/70" : "text-[#6F6B65]"}`}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          <a
            href="#/developer"
            className="group flex min-h-72 flex-col justify-between rounded-lg border border-[#D8D3CA] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#1A1A1A] hover:shadow-lg sm:p-8"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-[#FFF1ED] text-[#E64833]">
                  <Code2 className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-[#F0ECE5] px-3 py-1 text-xs font-bold text-[#5C5955]">
                  {TOOL_COUNTS.developer}
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-black text-[#1A1A1A]">{t.developer}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#6F6B65]">{t.developerIntro}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {DEVELOPER_GROUPS.map((group) => (
                  <span key={group} className="rounded-md border border-[#E4E0D8] bg-[#FAF8F4] px-2.5 py-1 text-xs text-[#5C5955]">
                    {group}
                  </span>
                ))}
              </div>
            </div>
            <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#E64833]">
              {t.openCategory}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>

          <a
            href="#/image"
            className="group flex min-h-72 flex-col justify-between rounded-lg border border-[#D8D3CA] bg-white p-6 transition hover:-translate-y-0.5 hover:border-[#1A1A1A] hover:shadow-lg sm:p-8"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-[#FFF1ED] text-[#E64833]">
                  <ImageIcon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-[#F0ECE5] px-3 py-1 text-xs font-bold text-[#5C5955]">
                  {TOOL_COUNTS.image}
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-black text-[#1A1A1A]">{t.image}</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#6F6B65]">{t.imageIntro}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {IMAGE_GROUPS.map((group) => (
                  <span key={group.id} className="rounded-md border border-[#E4E0D8] bg-[#FAF8F4] px-3 py-2">
                    <span className="block text-xs font-bold text-[#1A1A1A]">{group.label[locale]}</span>
                    <span className="mt-0.5 block text-xs text-[#8C8984]">{group.description[locale]}</span>
                  </span>
                ))}
              </div>
            </div>
            <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#E64833]">
              {t.openCategory}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </a>
        </div>
      </section>

      <section className="border-t border-[#D8D3CA] bg-[#F5F2EC]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#E64833]">
                {normalizedQuery ? t.results : t.popular}
              </div>
              <h2 className="mt-2 text-2xl font-black text-[#1A1A1A] sm:text-3xl">
                {normalizedQuery ? `“${normalizedQuery}”` : t.popular}
              </h2>
            </div>
            {normalizedQuery && (
              <div className="text-sm text-[#6F6B65]">
                {visibleTools.length} {t.resultCount}
              </div>
            )}
          </div>

          {visibleTools.length ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleTools.map((tool) => {
                const Icon = toolIcon(tool.family);
                return (
                  <a
                    key={`${tool.family}-${tool.id}`}
                    href={tool.href}
                    className="group flex min-h-48 flex-col rounded-lg border border-[#D8D3CA] bg-white p-5 transition hover:border-[#1A1A1A] hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-md bg-[#FFF1ED] text-[#E64833]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-medium text-[#8C8984]">
                        {tool.runtime === "cloud"
                          ? t.cloud
                          : tool.family === "developer"
                            ? t.developer
                            : t.image}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-[#1A1A1A]">{tool.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#6F6B65]">{tool.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-[#E64833]">
                      {t.openTool}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-[#BDB7AD] bg-white px-5 py-14 text-center text-sm text-[#6F6B65]">
              {t.noResults}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
