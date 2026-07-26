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
  ["video", "Video", "Video converter.", ["video", "convert"]],
  [
    "bouquet-generator",
    "AI Bouquet Generator",
    "Compose flowers by symbolic meaning and generate a Victorian bouquet image.",
    ["bouquet", "flowers", "flower language", "creative", "AI image"],
  ],
];

export const IMAGE_TOOL_CATALOG = IMAGE_TOOLS_DEFINITIONS.map(([id, name, description, features]) => ({
  slug: `image-tools-${id}`,
  name: `Image - ${name}`,
  category: "Image" as const,
  subCategory: id as string,
  industryAnchor: "Image Tools",
  description: typeof description === 'string' ? description : '',
  overview: id === "bouquet-generator"
    ? `${description} Adapted from cloudinary-devs/ai-bouquet-generator.`
    : `${description} This tool was migrated from shot-easy-website into the newfreetools Image workbench.`,
  pros: id === "bouquet-generator"
    ? ["Free to use", "Integrated with the freetools Image category", "Open-source implementation"]
    : ["Runs locally in the browser", "Integrated with the freetools Image category", "Open-source implementation"],
  cons: ["Advanced workflows may be limited compared with dedicated desktop tools", "Large inputs still depend on browser memory"],
  priceRange: "Open Source" as const,
  priceInfo: "100% Free",
  officialUrl: id === "bouquet-generator"
    ? "https://github.com/cloudinary-devs/ai-bouquet-generator"
    : "https://shot.easy.website/",
  studioAlternativeId: "image-tools",
  trustScore: "High" as const,
  verified: true,
  features: Array.isArray(features) ? features : [],
}));
