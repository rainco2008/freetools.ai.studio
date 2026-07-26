import { DEVELOPMENT_TOOL_CATALOG } from "./components/development-tools/catalog";
import { IMAGE_TOOL_CATALOG } from "./components/image-tools/catalog";

export type Locale = "zh" | "en";
export type ToolFamily = "developer" | "image";

export interface FreeToolEntry {
  id: string;
  name: string;
  family: ToolFamily;
  group: string;
  description: string;
  keywords: string[];
  aliases: string[];
  href: string;
}

export const DEVELOPER_GROUPS = [
  "Crypto & Security",
  "Converters",
  "Web & Network",
  "Text & Strings",
  "Formatters",
  "Math & Dev Tools",
  "Cheatsheets & Memos",
] as const;

export const IMAGE_GROUPS = [
  {
    id: "capture",
    label: { zh: "截图与采集", en: "Capture" },
    description: {
      zh: "截图、网页与屏幕内容采集",
      en: "Screenshot and screen-content capture tools",
    },
    tools: ["screenshot"],
  },
  {
    id: "edit",
    label: { zh: "编辑与美化", en: "Edit & Beautify" },
    description: {
      zh: "编辑、圆角、美化、去背景与背景模糊",
      en: "Editing, rounding, beautifying, and background tools",
    },
    tools: ["editor", "beautifier", "rounded", "remover", "blur-bg"],
  },
  {
    id: "optimize",
    label: { zh: "压缩与转换", en: "Optimize & Convert" },
    description: {
      zh: "压缩图片并转换常用文件格式",
      en: "Compress images and convert common file formats",
    },
    tools: ["compressor", "convert"],
  },
  {
    id: "compose",
    label: { zh: "查看与合成", en: "View & Compose" },
    description: {
      zh: "图片查看、长图拼接与视频转换",
      en: "Image viewing, long-image composition, and video conversion",
    },
    tools: ["viewer", "long-image", "video"],
  },
] as const;

const developerTools: FreeToolEntry[] = DEVELOPMENT_TOOL_CATALOG.map((tool) => {
  const id = tool.slug.replace(/^it-tools-/, "");
  const groupAliases: Record<string, string[]> = {
    "Crypto & Security": ["加密", "安全", "哈希", "密码"],
    Converters: ["转换", "编码", "解码"],
    "Web & Network": ["网络", "网址", "二维码", "浏览器"],
    "Text & Strings": ["文本", "字符串", "字数"],
    Formatters: ["格式化", "美化", "校验"],
    "Math & Dev Tools": ["计算", "数学", "定时", "权限"],
    "Cheatsheets & Memos": ["速查", "备忘", "正则", "快捷键"],
  };
  return {
    id,
    name: tool.name.replace(/^IT Tools - /, ""),
    family: "developer",
    group: tool.subCategory,
    description: tool.description,
    keywords: tool.features,
    aliases: groupAliases[tool.subCategory] || [],
    href: `#/developer?tool=${encodeURIComponent(id)}`,
  };
});

const imageTools: FreeToolEntry[] = IMAGE_TOOL_CATALOG.map((tool) => {
  const id = tool.slug.replace(/^image-tools-/, "");
  const group = IMAGE_GROUPS.find((item) => (item.tools as readonly string[]).includes(id));
  const aliases: Record<string, string[]> = {
    screenshot: ["截图", "截屏"],
    editor: ["图片编辑", "编辑图片"],
    beautifier: ["截图美化", "图片美化"],
    rounded: ["圆角图片", "圆角"],
    remover: ["背景移除", "去背景", "抠图"],
    "blur-bg": ["背景模糊", "虚化背景"],
    compressor: ["图片压缩", "压缩图片"],
    convert: ["格式转换", "图片转换"],
    viewer: ["图片查看", "查看器"],
    "long-image": ["长图拼接", "拼长图"],
    video: ["视频转换", "转换视频"],
  };
  return {
    id,
    name: tool.name.replace(/^Image - /, ""),
    family: "image",
    group: group?.id || "compose",
    description: tool.description,
    keywords: tool.features,
    aliases: aliases[id] || [],
    href: `#/image?tool=${encodeURIComponent(id)}`,
  };
});

export const FREE_TOOLS: FreeToolEntry[] = [...developerTools, ...imageTools];

export const TOOL_COUNTS = {
  total: FREE_TOOLS.length,
  developer: developerTools.length,
  image: imageTools.length,
  developerGroups: DEVELOPER_GROUPS.length,
  imageGroups: IMAGE_GROUPS.length,
};

const popularIds = [
  "json-formatter",
  "base64-string",
  "uuid-generator",
  "url-encoder",
  "qr-code",
  "regex-memo",
  "compressor",
  "convert",
  "remover",
  "long-image",
];

export const POPULAR_TOOLS = popularIds
  .map((id) => FREE_TOOLS.find((tool) => tool.id === id))
  .filter((tool): tool is FreeToolEntry => Boolean(tool));

export function matchesToolQuery(tool: FreeToolEntry, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [
    tool.name,
    tool.family,
    tool.group,
    tool.description,
    ...tool.keywords,
    ...tool.aliases,
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalized);
}
