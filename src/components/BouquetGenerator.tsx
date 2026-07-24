import { useEffect, useMemo, useState } from "react";
import { Download, Flower2, Loader2, Search, Sparkles, X } from "lucide-react";

interface Flower {
  id: number;
  name: string;
  meaning: string;
  color: string;
  image?: string;
}

export default function BouquetGenerator() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [selected, setSelected] = useState<Flower[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"name" | "meaning">("name");
  const [meaningQuery, setMeaningQuery] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/flowers.json")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load flower data");
        return response.json();
      })
      .then(setFlowers)
      .catch((err) => setError(err.message));
  }, []);

  const filteredFlowers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return flowers
      .filter((flower) => {
        if (!normalized) return true;
        return (filter === "name" ? flower.name : flower.meaning).toLowerCase().includes(normalized);
      })
      .slice(0, 36);
  }, [flowers, query, filter]);

  const combinedMeaning = selected.map((flower) => flower.meaning).join("; ");

  const toggleFlower = (flower: Flower) => {
    setSelected((current) => {
      const exists = current.some((item) => item.id === flower.id);
      return exists ? current.filter((item) => item.id !== flower.id) : [...current, flower];
    });
    setImageUrl(null);
  };

  const chooseByMeaning = () => {
    const normalized = meaningQuery.trim().toLowerCase();
    if (!normalized) return;
    const matches = flowers.filter((flower) => flower.meaning.toLowerCase().includes(normalized)).slice(0, 8);
    setSelected(matches);
    setImageUrl(null);
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
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to generate bouquet image");
      setImageUrl(data.imageUrl);
    } catch (err: any) {
      setError(err.message || "Image generation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 bg-[#FCFAF7]">
      <div className="border-b border-[#D1CEC7] pb-6">
        <a href="/" className="text-[10px] font-mono uppercase tracking-widest text-[#8C8984] hover:text-[#1A1A1A]">Studio Hub /</a>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 bg-[#E64833] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-white"><Flower2 className="h-3 w-3" /> Creative Studio</div>
            <h1 className="font-serif text-3xl font-black text-[#1A1A1A] sm:text-5xl">Bouquet Generator</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5C5955]">Compose a Victorian tussie-mussie bouquet from the language of flowers, then turn its meaning into an AI-generated image.</p>
          </div>
          <span className="border border-[#D1CEC7] bg-[#F5F2EC] px-3 py-2 text-[9px] font-mono font-bold uppercase tracking-widest text-[#5C5955]">Server-side Gemini</span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5">
          <div className="border border-[#D1CEC7] bg-[#F5F2EC] p-5">
            <label className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C8984]">Find flowers</label>
            <div className="flex gap-2">
              <div className="relative flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-[#8C8984]" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={filter === "name" ? "Search by flower name" : "Search by meaning"} className="w-full border border-[#D1CEC7] bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-[#1A1A1A]" /></div>
              <select value={filter} onChange={(e) => setFilter(e.target.value as "name" | "meaning")} className="border border-[#D1CEC7] bg-white px-3 text-xs font-mono uppercase"><option value="name">Name</option><option value="meaning">Meaning</option></select>
            </div>
            <div className="mt-4 flex gap-2"><input value={meaningQuery} onChange={(e) => setMeaningQuery(e.target.value)} placeholder="Choose by meaning, e.g. love" className="min-w-0 flex-1 border border-[#D1CEC7] bg-white px-3 py-2 text-sm outline-none focus:border-[#1A1A1A]" /><button onClick={chooseByMeaning} className="border border-[#1A1A1A] bg-[#1A1A1A] px-4 text-[9px] font-bold uppercase tracking-widest text-white hover:bg-black">Select meaning</button></div>
          </div>

          {error && <div className="border border-[#E64833] bg-[#FFF7F4] p-4 text-sm text-[#A6291A]">{error}</div>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {filteredFlowers.map((flower) => {
              const isSelected = selected.some((item) => item.id === flower.id);
              return <button key={flower.id} onClick={() => toggleFlower(flower)} className={`group border p-4 text-left transition-all ${isSelected ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#D1CEC7] bg-white hover:border-[#1A1A1A]"}`}><span className="mb-3 block h-8 w-8 rounded-full border border-black/10" style={{ backgroundColor: flower.color }} /><span className="block text-sm font-bold">{flower.name}</span><span className={`mt-1 block text-xs leading-relaxed ${isSelected ? "text-white/70" : "text-[#8C8984]"}`}>{flower.meaning}</span></button>;
            })}
          </div>
        </section>

        <section className="border border-[#D1CEC7] bg-[#F5F2EC] p-5 lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center justify-between border-b border-[#D1CEC7] pb-4"><div><p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C8984]">Your bouquet</p><h2 className="mt-1 font-serif text-2xl font-bold">{selected.length ? `${selected.length} flowers` : "Start composing"}</h2></div>{selected.length > 0 && <button onClick={() => { setSelected([]); setImageUrl(null); }} className="text-[9px] font-mono uppercase tracking-widest text-[#8C8984] hover:text-[#E64833]">Clear all</button>}</div>
          {imageUrl ? <div className="mt-5 overflow-hidden border border-[#D1CEC7] bg-white"><img src={imageUrl} alt="AI generated flower bouquet" className="w-full" /><button onClick={() => { const link = document.createElement("a"); link.href = imageUrl; link.download = "bouquet-generator.png"; link.click(); }} className="flex w-full items-center justify-center gap-2 border-t border-[#D1CEC7] py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-[#F5F2EC]"><Download className="h-4 w-4" /> Download bouquet</button></div> : <div className="mt-5 flex min-h-48 items-center justify-center border border-dashed border-[#B8B3AB] bg-white p-6 text-center text-sm italic text-[#8C8984]">{selected.length ? "Your generated bouquet will appear here." : "Select flowers to give your bouquet a message."}</div>}
          <div className="mt-5 space-y-3"><p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C8984]">Flower language</p>{selected.length ? <div className="flex flex-wrap gap-2">{selected.map((flower) => <span key={flower.id} className="inline-flex items-center gap-1 border border-[#D1CEC7] bg-white px-2 py-1 text-xs">{flower.name}<button onClick={() => toggleFlower(flower)} aria-label={`Remove ${flower.name}`}><X className="h-3 w-3 text-[#8C8984]" /></button></span>)}</div> : <p className="text-sm text-[#5C5955]">No flowers selected yet.</p>}</div>
          {selected.length > 0 && <div className="mt-4 border-l-2 border-[#E64833] bg-white p-4 text-sm leading-relaxed text-[#5C5955]"><span className="font-bold text-[#1A1A1A]">Combined meaning: </span>{combinedMeaning}</div>}
          <button disabled={!selected.length || isLoading} onClick={generateImage} className="mt-5 flex w-full items-center justify-center gap-2 bg-[#1A1A1A] py-4 text-[10px] font-bold uppercase tracking-widest text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40">{isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Generating image</> : <><Sparkles className="h-4 w-4" /> Generate bouquet image</>}</button>
        </section>
      </div>
    </div>
  );
}
