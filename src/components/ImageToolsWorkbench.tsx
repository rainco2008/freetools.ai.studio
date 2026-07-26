import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Image as ImageIcon,
  Search,
  ShieldCheck,
} from "lucide-react";
import { IMAGE_GROUPS, Locale } from "../freeToolsCatalog";
import { IMAGE_TOOLS_DEFINITIONS } from "./image-tools/catalog";

import Beautifier from "@components/Beautifier.jsx";
import Rounded from "@components/Rounded.jsx";
import Remover from "@components/Remover.jsx";
import CompressorInit from "@components/CompressorInit.jsx";
import ConvertTool from "@components/ConvertTool.jsx";
import ViewerTool from "@components/ViewerTool.jsx";
import LongImageComposer from "@components/LongImageComposer.jsx";
import VideoConvert from "@components/VideoConvert.jsx";
import { getLang } from "@i18n/index.js";

interface ImageToolsWorkbenchProps {
  locale: Locale;
  requestedToolId?: string | null;
}

const zhToolNames: Record<string, string> = {
  screenshot: "截图",
  editor: "图片编辑",
  beautifier: "截图美化",
  rounded: "圆角图片",
  remover: "背景移除",
  "blur-bg": "背景模糊",
  compressor: "图片压缩",
  convert: "格式转换",
  viewer: "图片查看",
  "long-image": "长图拼接",
  video: "视频转换",
  "bouquet-generator": "AI 花束生成器",
};

const copy = {
  zh: {
    eyebrow: "图片与媒体",
    title: "图片工具工作台",
    intro: "截图、美化、编辑、背景处理、压缩、格式转换与媒体工具，打开即可使用。",
    local: "11 个本地工具 · 1 个云端生成工具",
    search: "搜索图片工具",
    chooseTool: "选择工具",
    allGroups: "全部分组",
    back: "返回首页",
    noMatch: "没有找到匹配工具。",
  },
  en: {
    eyebrow: "Image & media",
    title: "Image Tools Workbench",
    intro: "Screenshot, beautify, edit, background, compression, conversion, and media tools ready in your browser.",
    local: "11 local tools · 1 cloud generator",
    search: "Search image tools",
    chooseTool: "Choose a tool",
    allGroups: "All groups",
    back: "Back home",
    noMatch: "No matching tools.",
  },
};

export default function ImageToolsWorkbench({
  locale,
  requestedToolId,
}: ImageToolsWorkbenchProps) {
  const t = copy[locale];
  const resolveTool = (id?: string | null) =>
    IMAGE_TOOLS_DEFINITIONS.some(([toolId]) => toolId === id)
      ? id!
      : (IMAGE_TOOLS_DEFINITIONS[0][0] as string);

  const [selectedToolId, setSelectedToolId] = useState(() => resolveTool(requestedToolId));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const lang = useMemo(() => getLang(locale === "zh" ? "zh-CN" : "en"), [locale]);

  useEffect(() => {
    setSelectedToolId(resolveTool(requestedToolId));
  }, [requestedToolId]);

  const groupForTool = (toolId: string) =>
    IMAGE_GROUPS.find((group) => (group.tools as readonly string[]).includes(toolId));

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return IMAGE_TOOLS_DEFINITIONS.filter(([id, name, description, keywords]) => {
      const group = groupForTool(id as string);
      const matchesGroup = selectedGroup === "all" || group?.id === selectedGroup;
      const haystack = [
        name,
        description,
        zhToolNames[id as string] || "",
        ...(keywords as string[]),
      ]
        .join(" ")
        .toLowerCase();
      return matchesGroup && (!query || haystack.includes(query));
    });
  }, [searchQuery, selectedGroup]);

  const selectedTool =
    IMAGE_TOOLS_DEFINITIONS.find(([id]) => id === selectedToolId) ||
    IMAGE_TOOLS_DEFINITIONS[0];
  const currentToolId = selectedTool[0] as string;
  const currentToolName = locale === "zh" ? zhToolNames[currentToolId] : (selectedTool[1] as string);
  const currentToolDesc = selectedTool[2] as string;

  const selectTool = (toolId: string) => {
    if (toolId === "bouquet-generator") {
      window.location.hash = "#/bouquet-generator";
      return;
    }
    setSelectedToolId(toolId);
    window.location.hash = `#/image?tool=${encodeURIComponent(toolId)}`;
  };

  const renderToolComponent = () => {
    switch (currentToolId) {
      case "screenshot":
      case "editor":
      case "beautifier":
        return <Beautifier />;
      case "rounded":
        return <Rounded />;
      case "remover":
        return <Remover variant="remove" />;
      case "blur-bg":
        return <Remover variant="blur" />;
      case "compressor":
        return <CompressorInit />;
      case "convert":
        return <ConvertTool copy={lang?.convert || {}} />;
      case "viewer":
        return <ViewerTool copy={lang?.viewer || {}} />;
      case "long-image":
        return <LongImageComposer />;
      case "video":
        return <VideoConvert copy={lang?.videoConvert || {}} />;
      default:
        return <Beautifier />;
    }
  };

  return (
    <section className="bg-[#FCFAF7] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <a href="#/" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#6F6B65] hover:text-[#E64833]">
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </a>

        <div className="flex flex-col gap-5 border-b border-[#D8D3CA] pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E64833]">
              <ImageIcon className="h-4 w-4" />
              {t.eyebrow}
            </div>
            <h1 className="text-3xl font-black tracking-[-0.03em] text-[#1A1A1A] sm:text-4xl">{t.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6F6B65] sm:text-base">{t.intro}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#EAF6EF] px-3 py-1.5 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-4 w-4" />
            {IMAGE_TOOLS_DEFINITIONS.length} · {t.local}
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden self-start rounded-lg border border-[#D8D3CA] bg-[#F5F2EC] p-4 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7rem)] lg:overflow-hidden">
            <label className="mb-2 block text-xs font-bold text-[#5C5955]">{t.search}</label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C8984]" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-10 w-full rounded-md border border-[#D8D3CA] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#1A1A1A]"
                placeholder={t.search}
              />
            </div>

            <div className="space-y-4 overflow-y-auto pr-1 lg:max-h-[calc(100dvh-15rem)]">
              {IMAGE_GROUPS.map((group) => {
                const groupTools = filteredTools.filter(([id]) =>
                  (group.tools as readonly string[]).includes(id as string),
                );
                if (!groupTools.length) return null;
                return (
                  <div key={group.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedGroup(selectedGroup === group.id ? "all" : group.id)}
                      className="mb-1.5 flex w-full items-center justify-between text-left text-xs font-bold text-[#5C5955]"
                    >
                      <span>{group.label[locale]}</span>
                      <span className="text-[#8C8984]">{groupTools.length}</span>
                    </button>
                    <div className="space-y-1">
                      {groupTools.map(([id, name]) => {
                        const toolId = id as string;
                        const active = toolId === currentToolId;
                        return (
                          <button
                            key={toolId}
                            onClick={() => selectTool(toolId)}
                            className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${
                              active
                                ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                                : "border-transparent text-[#5C5955] hover:border-[#D8D3CA] hover:bg-white"
                            }`}
                          >
                            {locale === "zh" ? zhToolNames[toolId] : (name as string)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="grid gap-3 rounded-lg border border-[#D8D3CA] bg-[#F5F2EC] p-4 sm:grid-cols-2 lg:hidden">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#5C5955]">{t.allGroups}</span>
              <select
                value={selectedGroup}
                onChange={(event) => setSelectedGroup(event.target.value)}
                className="h-11 w-full rounded-md border border-[#D8D3CA] bg-white px-3 text-sm"
              >
                <option value="all">{t.allGroups}</option>
                {IMAGE_GROUPS.map((group) => (
                  <option key={group.id} value={group.id}>{group.label[locale]}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-[#5C5955]">{t.chooseTool}</span>
              <select
                value={currentToolId}
                onChange={(event) => selectTool(event.target.value)}
                className="h-11 w-full rounded-md border border-[#D8D3CA] bg-white px-3 text-sm"
              >
                {filteredTools.map(([id, name]) => (
                  <option key={id as string} value={id as string}>
                    {locale === "zh" ? zhToolNames[id as string] : (name as string)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <main className="min-w-0 rounded-lg border border-[#D8D3CA] bg-white p-3 sm:p-5 lg:p-6">
            <div className="mb-5 border-b border-[#E6E1D8] pb-5">
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[#E64833]">
                {groupForTool(currentToolId)?.label[locale]}
              </div>
              <h2 className="mt-1 text-2xl font-black text-[#1A1A1A]">{currentToolName}</h2>
              <p className="mt-2 text-sm leading-6 text-[#6F6B65]">{currentToolDesc}</p>
            </div>
            <div className="min-h-[520px]">{renderToolComponent()}</div>
          </main>
        </div>
      </div>
    </section>
  );
}
