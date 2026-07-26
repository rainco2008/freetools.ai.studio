export const IMAGE_TOOLS_DEFINITIONS = [
  ["screenshot", "Screenshot", "Screenshot tool.", ["screenshot", "capture"]],
  ["editor", "Editor", "Image editor.", ["editor", "image"]],
  ["beautifier", "Beautifier", "Code beautifier and screenshot.", ["beautifier", "code"]],
  ["rounded", "Rounded", "Rounded corners.", ["rounded", "corners"]],
  ["remover", "Remover", "Background remover.", ["remover", "background"]],
  ["blur-bg", "Blur BG", "Blur background.", ["blur", "background"]],
  ["compressor", "Compressor", "Image compressor.", ["compressor", "optimize"]],
  ["convert", "Convert", "Image converter.", ["convert", "format"]],
  ["viewer", "Viewer", "Image viewer.", ["viewer", "inspect"]],
  ["long-image", "Long Image", "Long image composer.", ["long", "stitch"]],
  ["video", "Video", "Video converter.", ["video", "convert"]]
];

export const IMAGE_TOOL_CATALOG = IMAGE_TOOLS_DEFINITIONS.map(([id, name, description, features]) => ({
  slug: `image-tools-${id}`,
  name: `Image - ${name}`,
  category: "Image" as const,
  subCategory: id as string,
  industryAnchor: "Image Tools",
  description: typeof description === 'string' ? description : '',
  overview: `${description} This tool was migrated from shot-easy-website into the newfreetools Image workbench.`,
  pros: ["Runs locally in the browser", "Integrated with the newfreetools Image category", "Open-source implementation"],
  cons: ["Advanced workflows may be limited compared with dedicated desktop tools", "Large inputs still depend on browser memory"],
  priceRange: "Open Source" as const,
  priceInfo: "100% Free",
  officialUrl: "https://shot.easy.website/",
  studioAlternativeId: "image-tools",
  trustScore: "High" as const,
  verified: true,
  features: Array.isArray(features) ? features : [],
}));
