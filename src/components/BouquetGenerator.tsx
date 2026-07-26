import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Cloud,
  Download,
  Flower2,
  Loader2,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { Locale } from "../freeToolsCatalog";

interface Flower {
  id: number;
  name: string;
  meaning: string;
  color: string;
  image?: string;
}

const copy = {
  zh: {
    back: "返回图片工具",
    eyebrow: "图片工具 · 创意生成",
    title: "AI 花束生成器",
    intro: "从维多利亚花语中挑选鲜花，组合专属寓意，并生成一幅优雅的花束图片。",
    cloud: "Gemini 云端生成",
    find: "查找鲜花",
    searchName: "按花名搜索",
    searchMeaning: "按花语搜索",
    name: "花名",
    meaning: "花语",
    chooseMeaning: "按寓意快速选择，例如 love",
    selectMeaning: "选择寓意",
    loadingFlowers: "正在载入花卉资料…",
    noFlowers: "没有找到匹配的鲜花。",
    selected: "你的花束",
    start: "开始组合",
    flowerCount: "种鲜花",
    clear: "清空",
    previewEmpty: "选择鲜花后，AI 生成的花束会显示在这里。",
    previewReady: "花束图片将在这里生成。",
    language: "组合花语",
    none: "尚未选择鲜花。",
    generate: "生成花束图片",
    generating: "正在生成",
    download: "下载花束",
    remove: "移除",
    max: "一次最多可以选择 12 种鲜花。",
    source: "灵感及原始实现",
    processing: "所选花名将发送到 Gemini API 生成图片。",
  },
  en: {
    back: "Back to image tools",
    eyebrow: "Image tools · Creative generation",
    title: "AI Bouquet Generator",
    intro: "Choose flowers from the Victorian language of flowers, compose a personal meaning, and generate an elegant bouquet image.",
    cloud: "Cloud generation with Gemini",
    find: "Find flowers",
    searchName: "Search by flower name",
    searchMeaning: "Search by symbolic meaning",
    name: "Name",
    meaning: "Meaning",
    chooseMeaning: "Choose by meaning, for example love",
    selectMeaning: "Select meaning",
    loadingFlowers: "Loading the flower collection…",
    noFlowers: "No matching flowers found.",
    selected: "Your bouquet",
    start: "Start composing",
    flowerCount: "flowers",
    clear: "Clear all",
    previewEmpty: "Select flowers to give your bouquet a message.",
    previewReady: "Your generated bouquet will appear here.",
    language: "Combined flower language",
    none: "No flowers selected yet.",
    generate: "Generate bouquet image",
    generating: "Generating image",
    download: "Download bouquet",
    remove: "Remove",
    max: "You can select up to 12 flowers at a time.",
    source: "Inspired by and adapted from",
    processing: "Selected flower names are sent to the Gemini API to generate the image.",
  },
};

export default function BouquetGenerator({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [selected, setSelected] = useState<Flower[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"name" | "meaning">("name");
  const [meaningQuery, setMeaningQuery] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFlowers, setIsLoadingFlowers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/flowers.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load flower data.");
        return response.json() as Promise<Flower[]>;
      })
      .then(setFlowers)
      .catch((loadError: Error) => {
        if (loadError.name !== "AbortError") setError(loadError.message);
      })
      .finally(() => setIsLoadingFlowers(false));
    return () => controller.abort();
  }, []);

  const filteredFlowers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return flowers
      .filter((flower) => {
        if (!normalized) return true;
        const value = filter === "name" ? flower.name : flower.meaning;
        return value.toLowerCase().includes(normalized);
      })
      .slice(0, 48);
  }, [filter, flowers, query]);

  const combinedMeaning = selected.map((flower) => flower.meaning).join("; ");

  const toggleFlower = (flower: Flower) => {
    setError(null);
    setSelected((current) => {
      const exists = current.some((item) => item.id === flower.id);
      if (exists) return current.filter((item) => item.id !== flower.id);
      if (current.length >= 12) {
        setError(t.max);
        return current;
      }
      return [...current, flower];
    });
    setImageUrl(null);
  };

  const chooseByMeaning = () => {
    const normalized = meaningQuery.trim().toLowerCase();
    if (!normalized) return;
    const matches = flowers
      .filter((flower) => flower.meaning.toLowerCase().includes(normalized))
      .slice(0, 12);
    setSelected(matches);
    setImageUrl(null);
    setError(matches.length ? null : t.noFlowers);
  };

  const generateImage = async () => {
    if (!selected.length) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/bouquet/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flowers: selected.map((flower) => flower.name) }),
      });
      const data = (await response.json()) as { imageUrl?: string; error?: string };
      if (!response.ok || !data.imageUrl) {
        throw new Error(data.error || "Unable to generate bouquet image.");
      }
      setImageUrl(data.imageUrl);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : "Bouquet image generation failed.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "freetools-ai-bouquet.png";
    link.click();
  };

  return (
    <div className="bg-[#FCFAF7] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-7xl">
        <a
          href="#/image"
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#6F6B65] hover:text-[#E64833]"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </a>

        <div className="flex flex-col gap-5 border-b border-[#D8D3CA] pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#E64833]">
              <Flower2 className="h-4 w-4" />
              {t.eyebrow}
            </div>
            <h1 className="text-3xl font-black tracking-[-0.03em] text-[#1A1A1A] sm:text-5xl">
              {t.title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6F6B65] sm:text-base">
              {t.intro}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full bg-[#FFF1ED] px-3 py-1.5 text-xs font-bold text-[#A93627] md:self-auto">
            <Cloud className="h-4 w-4" />
            {t.cloud}
          </div>
        </div>

        <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <section>
            <div className="rounded-lg border border-[#D8D3CA] bg-[#F5F2EC] p-4 sm:p-5">
              <label className="mb-2 block text-xs font-bold text-[#5C5955]">{t.find}</label>
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_130px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8C8984]" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={filter === "name" ? t.searchName : t.searchMeaning}
                    className="h-11 w-full rounded-md border border-[#D8D3CA] bg-white pl-9 pr-3 text-sm outline-none focus:border-[#1A1A1A]"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value as "name" | "meaning")}
                  className="h-11 rounded-md border border-[#D8D3CA] bg-white px-3 text-sm"
                >
                  <option value="name">{t.name}</option>
                  <option value="meaning">{t.meaning}</option>
                </select>
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={meaningQuery}
                  onChange={(event) => setMeaningQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") chooseByMeaning();
                  }}
                  placeholder={t.chooseMeaning}
                  className="h-11 min-w-0 flex-1 rounded-md border border-[#D8D3CA] bg-white px-3 text-sm outline-none focus:border-[#1A1A1A]"
                />
                <button
                  type="button"
                  onClick={chooseByMeaning}
                  className="h-11 rounded-md bg-[#1A1A1A] px-4 text-xs font-bold text-white hover:bg-black"
                >
                  {t.selectMeaning}
                </button>
              </div>
            </div>

            {error && (
              <div role="alert" className="mt-4 rounded-lg border border-[#E64833] bg-[#FFF1ED] p-4 text-sm text-[#9A3022]">
                {error}
              </div>
            )}

            {isLoadingFlowers ? (
              <div className="mt-4 grid min-h-48 place-items-center rounded-lg border border-dashed border-[#BDB7AD] bg-white text-sm text-[#6F6B65]">
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t.loadingFlowers}
                </span>
              </div>
            ) : filteredFlowers.length ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {filteredFlowers.map((flower) => {
                  const isSelected = selected.some((item) => item.id === flower.id);
                  return (
                    <button
                      key={flower.id}
                      type="button"
                      onClick={() => toggleFlower(flower)}
                      aria-pressed={isSelected}
                      className={`min-h-36 rounded-lg border p-4 text-left transition ${
                        isSelected
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                          : "border-[#D8D3CA] bg-white text-[#1A1A1A] hover:border-[#1A1A1A] hover:shadow-sm"
                      }`}
                    >
                      <span
                        className="mb-4 block h-9 w-9 rounded-full border border-black/10 shadow-inner"
                        style={{ backgroundColor: flower.color }}
                      />
                      <span className="block text-sm font-bold">{flower.name}</span>
                      <span className={`mt-1 block text-xs leading-5 ${isSelected ? "text-white/70" : "text-[#8C8984]"}`}>
                        {flower.meaning}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-dashed border-[#BDB7AD] bg-white px-5 py-14 text-center text-sm text-[#6F6B65]">
                {t.noFlowers}
              </div>
            )}
          </section>

          <aside className="self-start rounded-lg border border-[#D8D3CA] bg-[#F5F2EC] p-5 lg:sticky lg:top-24">
            <div className="flex items-start justify-between gap-4 border-b border-[#D8D3CA] pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#E64833]">{t.selected}</p>
                <h2 className="mt-1 text-2xl font-black text-[#1A1A1A]">
                  {selected.length ? `${selected.length} ${t.flowerCount}` : t.start}
                </h2>
              </div>
              {selected.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSelected([]);
                    setImageUrl(null);
                    setError(null);
                  }}
                  className="text-xs font-bold text-[#6F6B65] hover:text-[#E64833]"
                >
                  {t.clear}
                </button>
              )}
            </div>

            {imageUrl ? (
              <div className="mt-5 overflow-hidden rounded-lg border border-[#D8D3CA] bg-white">
                <img src={imageUrl} alt={t.title} className="aspect-square w-full object-cover" />
                <button
                  type="button"
                  onClick={downloadImage}
                  className="flex w-full items-center justify-center gap-2 border-t border-[#D8D3CA] py-3 text-xs font-bold text-[#1A1A1A] hover:bg-[#F5F2EC]"
                >
                  <Download className="h-4 w-4" />
                  {t.download}
                </button>
              </div>
            ) : (
              <div className="mt-5 grid min-h-64 place-items-center rounded-lg border border-dashed border-[#BDB7AD] bg-white p-6 text-center text-sm leading-6 text-[#8C8984]">
                {selected.length ? t.previewReady : t.previewEmpty}
              </div>
            )}

            <div className="mt-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#5C5955]">{t.language}</p>
              {selected.length ? (
                <>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selected.map((flower) => (
                      <span
                        key={flower.id}
                        className="inline-flex items-center gap-1 rounded-md border border-[#D8D3CA] bg-white px-2 py-1 text-xs"
                      >
                        {flower.name}
                        <button
                          type="button"
                          onClick={() => toggleFlower(flower)}
                          aria-label={`${t.remove} ${flower.name}`}
                        >
                          <X className="h-3 w-3 text-[#8C8984]" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 rounded-md border-l-2 border-[#E64833] bg-white p-3 text-sm leading-6 text-[#5C5955]">
                    {combinedMeaning}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-[#6F6B65]">{t.none}</p>
              )}
            </div>

            <button
              type="button"
              disabled={!selected.length || isLoading}
              onClick={() => void generateImage()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-[#E64833] px-4 py-3.5 text-sm font-bold text-white hover:bg-[#C83D2C] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isLoading ? t.generating : t.generate}
            </button>

            <p className="mt-3 text-xs leading-5 text-[#8C8984]">{t.processing}</p>
            <p className="mt-4 border-t border-[#D8D3CA] pt-4 text-xs leading-5 text-[#8C8984]">
              {t.source}{" "}
              <a
                href="https://github.com/cloudinary-devs/ai-bouquet-generator"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#E64833] hover:underline"
              >
                cloudinary-devs/ai-bouquet-generator
              </a>
              .
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
