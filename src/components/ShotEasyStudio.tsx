import { useEffect, useRef, useState } from "react";
import { Download, FileImage, Film, FolderOpen, Image as ImageIcon, MonitorUp, RotateCcw, Upload, WandSparkles, X } from "lucide-react";

type ToolId = "screenshot" | "editor" | "beautifier" | "rounded" | "remover" | "blur" | "compressor" | "convert" | "viewer" | "long-image" | "video";
type Asset = { file?: File; url: string; name: string; width?: number; height?: number };

const tools: { id: ToolId; label: string; description: string }[] = [
  { id: "screenshot", label: "Screenshot", description: "捕获屏幕或上传截图" },
  { id: "editor", label: "Editor", description: "裁剪、旋转和调整图片" },
  { id: "beautifier", label: "Beautifier", description: "为截图添加背景和设备框" },
  { id: "rounded", label: "Rounded", description: "制作圆角图片" },
  { id: "remover", label: "Remover", description: "移除简单纯色背景" },
  { id: "blur", label: "Blur BG", description: "模糊图片背景" },
  { id: "compressor", label: "Compressor", description: "压缩图片文件大小" },
  { id: "convert", label: "Convert", description: "转换 PNG、JPEG、WebP" },
  { id: "viewer", label: "Viewer", description: "预览图片、PDF、文本和视频" },
  { id: "long-image", label: "Long Image", description: "纵向合成长图" },
  { id: "video", label: "Video", description: "预览视频并导出首帧" },
];

function readAsset(file: File): Promise<Asset> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    if (!file.type.startsWith("image/")) return resolve({ file, url, name: file.name });
    const image = new Image();
    image.onload = () => resolve({ file, url, name: file.name, width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = reject;
    image.src = url;
  });
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function renderImage(asset: Asset, options: { radius?: number; brightness?: number; blur?: number; background?: string; padding?: number; rotate?: number } = {}) {
  const image = new Image();
  image.src = asset.url;
  await image.decode();
  const padding = options.padding ?? 0;
  const angle = options.rotate ?? 0;
  const rotated = angle % 180 !== 0;
  const width = image.naturalWidth + padding * 2;
  const height = image.naturalHeight + padding * 2;
  const canvas = document.createElement("canvas");
  canvas.width = rotated ? height : width;
  canvas.height = rotated ? width : height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = options.background ?? "transparent";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angle * Math.PI / 180);
  if (options.blur) ctx.filter = `blur(${options.blur}px)`;
  if (options.brightness) ctx.filter += ` brightness(${options.brightness}%)`;
  const radius = options.radius ?? 0;
  if (radius) {
    ctx.beginPath();
    ctx.roundRect(-width / 2, -height / 2, width, height, radius);
    ctx.clip();
  }
  ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
  ctx.restore();
  return canvas;
}

function UploadPanel({ accept = "image/*", multiple = false, onFiles }: { accept?: string; multiple?: boolean; onFiles: (files: FileList) => void }) {
  const input = useRef<HTMLInputElement>(null);
  return <div onClick={() => input.current?.click()} className="cursor-pointer rounded-2xl border-2 border-dashed border-[#D1CEC7] bg-white p-12 text-center transition hover:border-[#E64833]">
    <Upload className="mx-auto mb-3 text-[#E64833]" />
    <p className="font-semibold">点击上传或拖入文件</p>
    <p className="mt-1 text-xs text-[#8C8984]">文件在浏览器本地处理，不会自动上传</p>
    <input ref={input} hidden type="file" accept={accept} multiple={multiple} onChange={(e) => e.target.files && onFiles(e.target.files)} />
  </div>;
}

export default function ShotEasyStudio() {
  const [active, setActive] = useState<ToolId>("screenshot");
  const [asset, setAsset] = useState<Asset | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.75);
  const [radius, setRadius] = useState(32);
  const [padding, setPadding] = useState(48);
  const [brightness, setBrightness] = useState(100);
  const [blur, setBlur] = useState(10);
  const [background, setBackground] = useState("#f2eee7");
  const [rotate, setRotate] = useState(0);
  const [viewerText, setViewerText] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => () => { if (asset?.url) URL.revokeObjectURL(asset.url); }, [asset]);
  const selected = tools.find((tool) => tool.id === active)!;

  const selectFiles = async (files: FileList) => {
    const next = await Promise.all(Array.from(files).map(readAsset));
    if (active === "long-image") setAssets(next);
    else setAsset(next[0] ?? null);
    setResult(null);
    if (next[0]?.file?.type.startsWith("text/")) setViewerText(await next[0].file.text());
  };

  const capture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();
      await new Promise((resolve) => setTimeout(resolve, 300));
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      canvas.getContext("2d")!.drawImage(video, 0, 0);
      stream.getTracks().forEach((track) => track.stop());
      setResult(canvas.toDataURL("image/png"));
    } catch { /* user cancelled the native picker */ }
  };

  const process = async () => {
    if (!asset && active !== "long-image") return;
    if (active === "long-image") {
      if (!assets.length) return;
      const images = await Promise.all(assets.map(async (item) => { const image = new Image(); image.src = item.url; await image.decode(); return image; }));
      const width = Math.max(...images.map((image) => image.naturalWidth));
      const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = images.reduce((sum, image) => sum + image.naturalHeight, 0);
      const ctx = canvas.getContext("2d")!; let y = 0; images.forEach((image) => { ctx.drawImage(image, 0, y); y += image.naturalHeight; });
      setResult(canvas.toDataURL("image/png")); return;
    }
    if (active === "remover") {
      const canvas = await renderImage(asset!); const ctx = canvas.getContext("2d")!; const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height); const bg = [pixels.data[0], pixels.data[1], pixels.data[2]];
      for (let i = 0; i < pixels.data.length; i += 4) if (Math.abs(pixels.data[i] - bg[0]) + Math.abs(pixels.data[i + 1] - bg[1]) + Math.abs(pixels.data[i + 2] - bg[2]) < 75) pixels.data[i + 3] = 0;
      ctx.putImageData(pixels, 0, 0); setResult(canvas.toDataURL("image/png")); return;
    }
    const options = active === "rounded" ? { radius } : active === "blur" ? { blur } : active === "beautifier" ? { padding, background, radius } : { brightness, rotate, radius: active === "editor" ? radius : 0 };
    const canvas = await renderImage(asset!, options);
    const type = active === "convert" ? "image/webp" : "image/png";
    setResult(canvas.toDataURL(type, quality));
  };

  const download = () => { if (!result) return; fetch(result).then((response) => response.blob()).then((blob) => downloadBlob(blob, `shoteasy-${active}.${active === "convert" ? "webp" : "png"}`)); };

  return <section className="mx-auto max-w-7xl px-4 py-8 md:px-8">
    <div className="mb-8 flex items-end justify-between gap-4"><div><a href="#/" className="text-xs font-mono uppercase tracking-widest text-[#8C8984]">← 返回工具目录</a><h1 className="mt-3 text-3xl font-serif font-black">ShotEasy Studio</h1><p className="mt-2 text-sm text-[#5C5955]">React + Vite 浏览器端图片、截图、视频和文件工具集</p></div><span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700 md:block">Local-first processing</span></div>
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="grid grid-cols-2 gap-2 self-start lg:grid-cols-1">{tools.map((tool) => <button key={tool.id} onClick={() => { setActive(tool.id); setResult(null); }} className={`rounded-xl border px-3 py-3 text-left transition ${active === tool.id ? "border-[#E64833] bg-[#FFF4F0]" : "border-[#E5E0D8] bg-white hover:border-[#1A1A1A]"}`}><span className="block text-sm font-semibold">{tool.label}</span><span className="mt-1 block text-[11px] text-[#8C8984]">{tool.description}</span></button>)}</aside>
      <main className="min-h-[540px] rounded-2xl border border-[#E5E0D8] bg-[#F5F2EC]/60 p-4 md:p-8"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold">{selected.label}</h2><p className="text-sm text-[#8C8984]">{selected.description}</p></div>{(asset || result) && <button onClick={() => { setAsset(null); setResult(null); }} className="text-xs text-[#8C8984] hover:text-[#E64833]"><X className="inline h-4 w-4" /> 清除</button>}</div>
        {active === "screenshot" && <div className="mb-5 flex flex-wrap gap-3"><button onClick={capture} className="flex items-center gap-2 rounded-xl bg-[#1A1A1A] px-4 py-3 text-sm font-semibold text-white"><MonitorUp className="h-4 w-4" /> 捕获屏幕</button><span className="self-center text-xs text-[#8C8984]">或上传已有截图</span></div>}
        {!asset && !result && <UploadPanel accept={active === "viewer" ? "*/*" : active === "video" ? "video/*" : "image/*"} multiple={active === "long-image"} onFiles={selectFiles} />}
        {asset && <div className="rounded-xl bg-white p-3"><div className="mb-3 flex items-center gap-2 text-xs text-[#5C5955]"><FileImage className="h-4 w-4" /> {asset.name} {asset.width && `· ${asset.width} × ${asset.height}`}</div>{active === "viewer" && asset.file?.type.startsWith("text/") ? <pre className="max-h-[380px] overflow-auto whitespace-pre-wrap rounded-lg bg-[#1A1A1A] p-4 text-xs text-white">{viewerText}</pre> : asset.file?.type === "application/pdf" ? <iframe title="PDF viewer" src={asset.url} className="h-[480px] w-full rounded-lg" /> : asset.file?.type.startsWith("video/") ? <video ref={videoRef} controls src={asset.url} className="mx-auto max-h-[420px] max-w-full" /> : <img src={asset.url} alt="待处理文件" className="mx-auto max-h-[420px] max-w-full object-contain" />}</div>}
        {active === "long-image" && assets.length > 0 && <p className="mt-3 text-xs text-[#5C5955]">已选择 {assets.length} 张图片，将按选择顺序纵向拼接。</p>}
        {active !== "screenshot" && active !== "viewer" && active !== "video" && <div className="mt-5 grid gap-4 rounded-xl bg-white p-4 sm:grid-cols-2">{(active === "beautifier" || active === "rounded") && <label className="text-xs">圆角：{radius}px<input type="range" min="0" max="120" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-full" /></label>}{active === "beautifier" && <label className="text-xs">留白：{padding}px<input type="range" min="0" max="240" value={padding} onChange={(e) => setPadding(Number(e.target.value))} className="w-full" /></label>}{active === "beautifier" && <label className="text-xs">背景色<input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="ml-3 h-7 w-12" /></label>}{active === "blur" && <label className="text-xs">模糊强度：{blur}px<input type="range" min="1" max="30" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full" /></label>}{active === "compressor" && <label className="text-xs">压缩质量：{Math.round(quality * 100)}%<input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full" /></label>}{active === "editor" && <label className="text-xs">亮度：{brightness}%<input type="range" min="50" max="160" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full" /></label>}{active === "editor" && <button onClick={() => setRotate((value) => value + 90)} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-xs"><RotateCcw className="h-4 w-4" />旋转 90°</button>}</div>}
        {active === "video" && asset && <button onClick={() => { const video = videoRef.current; if (!video) return; const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight; canvas.getContext("2d")!.drawImage(video, 0, 0); setResult(canvas.toDataURL("image/png")); }} className="mt-4 rounded-xl bg-[#1A1A1A] px-4 py-3 text-sm text-white">导出当前视频帧</button>}
        {active !== "screenshot" && active !== "viewer" && active !== "video" && <button disabled={!asset && !assets.length} onClick={process} className="mt-5 rounded-xl bg-[#E64833] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><WandSparkles className="mr-2 inline h-4 w-4" />处理文件</button>}
        {result && <div className="mt-6 rounded-xl bg-white p-4"><div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold">处理结果</span><button onClick={download} className="flex items-center gap-2 rounded-lg bg-[#1A1A1A] px-3 py-2 text-xs text-white"><Download className="h-4 w-4" /> 下载</button></div><img src={result} alt="处理结果" className="mx-auto max-h-[460px] max-w-full object-contain" /></div>}
      </main>
    </div>
  </section>;
}
