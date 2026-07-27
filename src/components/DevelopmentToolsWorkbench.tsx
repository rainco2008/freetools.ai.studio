import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Code2, Search, ShieldCheck } from "lucide-react";
import { Locale } from "../freeToolsCatalog";
import { CATEGORIES, TOOLS } from "./development-tools/tools";

interface DevelopmentToolsWorkbenchProps {
  locale: Locale;
  requestedToolId?: string | null;
}

const copy = {
  zh: {
    eyebrow: "开发工具",
    title: "开发工具工作台",
    intro: "34 个浏览器端工具，覆盖编码转换、格式化、安全、网络、文本与常用计算。",
    local: "本地优先运行",
    search: "搜索工具",
    searchPlaceholder: "hash、json、uuid…",
    group: "功能分组",
    allGroups: "全部分组",
    chooseTool: "选择工具",
    reset: "重置",
    noMatch: "没有找到匹配工具。",
    back: "返回首页",
  },
  en: {
    eyebrow: "Developer tools",
    title: "Developer Tools Workbench",
    intro: "34 browser-based utilities for encoding, formatting, security, networking, text, and everyday calculations.",
    local: "Local-first execution",
    search: "Search tools",
    searchPlaceholder: "hash, json, uuid…",
    group: "Tool group",
    allGroups: "All groups",
    chooseTool: "Choose a tool",
    reset: "Reset",
    noMatch: "No matching tools.",
    back: "Back home",
  },
};

export default function DevelopmentToolsWorkbench({
  locale,
  requestedToolId,
}: DevelopmentToolsWorkbenchProps) {
  const t = copy[locale];
  const resolveTool = (id?: string | null) =>
    TOOLS.some((tool) => tool.id === id) ? id! : TOOLS[0]?.id || "";

  const [selectedToolId, setSelectedToolId] = useState(() => resolveTool(requestedToolId));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setSelectedToolId(resolveTool(requestedToolId));
  }, [requestedToolId]);

  const categoryName = (categoryId: string) =>
    CATEGORIES.find((category) => category.id === categoryId)?.name || categoryId;

  const categoryCounts = useMemo(
    () =>
      Object.fromEntries(
        CATEGORIES.map((category) => [
          category.id,
          TOOLS.filter((tool) => tool.category === category.id).length,
        ]),
      ),
    [],
  );

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const categoryAliases: Record<string, string[]> = {
      crypto: ["加密", "安全", "哈希", "密码"],
      converter: ["转换", "编码", "解码"],
      web: ["网络", "网址", "二维码", "浏览器"],
      text: ["文本", "字符串", "字数"],
      formatter: ["格式化", "美化", "校验"],
      math: ["计算", "数学", "定时", "权限"],
      memo: ["速查", "备忘", "正则", "快捷键"],
    };
    return TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
      const haystack = [
        tool.title,
        tool.description,
        ...tool.keywords,
        ...(categoryAliases[tool.category] || []),
      ]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [searchQuery, selectedCategory]);

  const selectedTool = TOOLS.find((tool) => tool.id === selectedToolId) || TOOLS[0];
  const ActiveTool = selectedTool?.component;

  const selectTool = (toolId: string) => {
    setSelectedToolId(toolId);
    const targetUrl = `/developer?tool=${encodeURIComponent(toolId)}`;
    window.history.pushState({}, "", targetUrl);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <section className="bg-[#FCFAF7] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <a href="/" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#6F6B65] hover:text-[#E64833]">
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </a>

        <div className="flex flex-col gap-5 border-b border-[#D8D3CA] pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E64833]">
              <Code2 className="h-4 w-4" />
              {t.eyebrow}
            </div>
            <h1 className="text-3xl font-black tracking-[-0.03em] text-[#1A1A1A] sm:text-4xl">
              {t.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6F6B65] sm:text-base">{t.intro}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#EAF6EF] px-3 py-1.5 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            {TOOLS.length} · {t.local}
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden self-start rounded-lg border border-[#D8D3CA] bg-[#F5F2EC] p-4 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7rem)] lg:overflow-hidden">
            <label className="mb-2 block text-xs font-bold text-[#5C5955]">{t.search}</label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C8984]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="h-10 w-full rounded-md border border-[#D8D3CA] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <label className="mb-2 block text-xs font-bold text-[#5C5955]">{t.group}</label>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="mb-4 h-10 w-full rounded-md border border-[#D8D3CA] bg-white px-3 text-sm outline-none"
            >
              <option value="all">{t.allGroups}</option>
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({categoryCounts[category.id]})
                </option>
              ))}
            </select>

            <div className="max-h-[calc(100dvh-19rem)] space-y-1 overflow-y-auto pr-1">
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => selectTool(tool.id)}
                  className={`w-full rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                    selectedTool?.id === tool.id
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                      : "border-transparent text-[#5C5955] hover:border-[#D8D3CA] hover:bg-white"
                  }`}
                >
                  <span className="block font-semibold">{tool.title}</span>
                  <span className={`mt-0.5 block text-xs ${selectedTool?.id === tool.id ? "text-white/60" : "text-[#8C8984]"}`}>
                    {categoryName(tool.category)}
                  </span>
                </button>
              ))}
              {!filteredTools.length && <p className="px-2 py-4 text-sm text-[#8C8984]">{t.noMatch}</p>}
            </div>
          </aside>

          <div className="space-y-4 lg:hidden">
            <div className="grid gap-3 rounded-lg border border-[#D8D3CA] bg-[#F5F2EC] p-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[#5C5955]">{t.group}</span>
                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-11 w-full rounded-md border border-[#D8D3CA] bg-white px-3 text-sm"
                >
                  <option value="all">{t.allGroups}</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-[#5C5955]">{t.chooseTool}</span>
                <select
                  value={selectedTool?.id}
                  onChange={(event) => selectTool(event.target.value)}
                  className="h-11 w-full rounded-md border border-[#D8D3CA] bg-white px-3 text-sm"
                >
                  {filteredTools.map((tool) => (
                    <option key={tool.id} value={tool.id}>{tool.title}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <main className="min-w-0 rounded-lg border border-[#D8D3CA] bg-white p-4 sm:p-6 lg:p-8">
            {ActiveTool ? (
              <>
                <div className="mb-6 flex flex-col gap-3 border-b border-[#E6E1D8] pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#E64833]">
                      {categoryName(selectedTool.category)}
                    </div>
                    <h2 className="text-2xl font-black text-[#1A1A1A]">{selectedTool.title}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6F6B65]">{selectedTool.description}</p>
                  </div>
                  <button
                    onClick={() => selectTool(TOOLS[0].id)}
                    className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#8C8984] hover:text-[#1A1A1A]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    {t.reset}
                  </button>
                </div>
                <ActiveTool />
              </>
            ) : (
              <p className="text-sm text-[#5C5955]">{t.noMatch}</p>
            )}
          </main>
        </div>
      </div>
    </section>
  );
}
