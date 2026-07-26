import { useState, useEffect, useMemo } from "react";
import { Search, Image as ImageIcon, ExternalLink, Sparkles, ShieldCheck } from "lucide-react";
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

function getRequestedToolId() {
  const query = window.location.hash.split("?")[1] || "";
  const requested = new URLSearchParams(query).get("tool") || "";
  const normalized = requested.replace(/^image-tools-/, "");
  return IMAGE_TOOLS_DEFINITIONS.some(([id]) => id === normalized) ? normalized : IMAGE_TOOLS_DEFINITIONS[0][0];
}

const TOOL_PATH_MAP: Record<string, string> = {
  "screenshot": "/take-a-screenshot/",
  "editor": "/screenshot-beautifier/",
  "beautifier": "/screenshot-beautifier/",
  "rounded": "/photo-to-rounded/",
  "remover": "/background-remover/",
  "blur-bg": "/blur-background-online/",
  "compressor": "/image-compressor/",
  "convert": "/convert/",
  "viewer": "/viewer/",
  "long-image": "/long-image/",
  "video": "/video-convert/"
};

export default function ImageToolsWorkbench() {
  const [selectedToolId, setSelectedToolId] = useState(getRequestedToolId);
  const [searchQuery, setSearchQuery] = useState("");
  const lang = useMemo(() => getLang("zh-CN"), []);

  useEffect(() => {
    const handleHashChange = () => setSelectedToolId(getRequestedToolId());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSelectTool = (id: string) => {
    setSelectedToolId(id);
    const hash = window.location.hash.split("?")[0] || "#/tools/image-tools";
    window.location.hash = `${hash}?tool=image-tools-${id}`;
  };

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return IMAGE_TOOLS_DEFINITIONS.filter(([id, name, desc, keywords]) => {
      const haystack = [name, desc, ...(keywords as string[])].join(" ").toLowerCase();
      return !query || haystack.includes(query);
    });
  }, [searchQuery]);

  const selectedTool = IMAGE_TOOLS_DEFINITIONS.find(([id]) => id === selectedToolId) || IMAGE_TOOLS_DEFINITIONS[0];
  const currentToolId = selectedTool[0] as string;
  const currentToolName = selectedTool[1] as string;
  const currentToolDesc = selectedTool[2] as string;

  const externalUrl = `https://shot.easy.website${TOOL_PATH_MAP[currentToolId] || "/"}`;

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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Navigation Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Title & Badge */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-slate-900 leading-tight">
                    Shot Easy 图像处理工作台
                  </h1>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                    Ported from shot-easy-website
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  基于 open-source shot-easy-website 原生代码移植，完全离线本地处理
                </p>
              </div>
            </div>

            {/* Tool Selection Header Controls */}
            <div className="flex items-center gap-3">
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索图像工具..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <a
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-xs"
              >
                <span>官方源站</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Tools Tab Pills */}
          <div className="flex items-center space-x-2 mt-3 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-2">
            {filteredTools.map(([id, name]) => {
              const toolId = id as string;
              const toolName = name as string;
              const active = toolId === currentToolId;
              return (
                <button
                  key={toolId}
                  onClick={() => handleSelectTool(toolId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {toolName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tool Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{currentToolName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{currentToolDesc}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>基于 Canvas & WASM 本地处理，隐私不上传服务器</span>
          </div>
        </div>

        {/* Ported Component Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-6 min-h-[600px]">
          {renderToolComponent()}
        </div>
      </main>
    </div>
  );
}
