import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Wrench } from "lucide-react";
import { TOOLS } from "./development-tools/tools";

function getRequestedToolId() {
  const query = window.location.hash.split("?")[1] || "";
  const requested = new URLSearchParams(query).get("tool") || "";
  const normalized = requested.replace(/^it-tools-/, "");
  return TOOLS.some((tool) => tool.id === normalized) ? normalized : TOOLS[0]?.id || "";
}

export default function DevelopmentToolsWorkbench() {
  const [selectedToolId, setSelectedToolId] = useState(getRequestedToolId);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const handleHashChange = () => setSelectedToolId(getRequestedToolId());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory;
      const haystack = [tool.title, tool.description, ...tool.keywords].join(" ").toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [searchQuery, selectedCategory]);

  const selectedTool = TOOLS.find((tool) => tool.id === selectedToolId) || TOOLS[0];
  const ActiveTool = selectedTool?.component;

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#FCFAF7] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 border-b border-[#D1CEC7] pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#E64833]">
              <Wrench className="h-3.5 w-3.5" /> Development
            </div>
            <h1 className="text-3xl font-serif font-black text-[#1A1A1A] md:text-5xl">Developer Tools Workbench</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5C5955]">
              34 browser-based utilities migrated from IT Tools and rewritten into the newfreetools React workspace.
            </p>
          </div>
          <div className="text-right text-[10px] font-mono uppercase tracking-widest text-[#8C8984]">
            {TOOLS.length} tools / local-first execution
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border border-[#D1CEC7] bg-[#F5F2EC] p-4">
            <label className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-widest text-[#5C5955]">Search tools</label>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#8C8984]" />
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="hash, json, uuid..." className="w-full border border-[#D1CEC7] bg-white py-2 pl-9 pr-3 text-xs outline-none focus:border-[#1A1A1A]" />
            </div>
            <label className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-widest text-[#5C5955]">Category</label>
            <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="mb-4 w-full border border-[#D1CEC7] bg-white px-3 py-2 text-xs outline-none">
              <option value="all">All tool groups</option>
              {[...new Set(TOOLS.map((tool) => tool.category))].map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <div className="max-h-[55vh] space-y-1 overflow-y-auto pr-1">
              {filteredTools.map((tool) => (
                <button key={tool.id} onClick={() => setSelectedToolId(tool.id)} className={`w-full border px-3 py-2 text-left text-xs transition-colors ${selectedTool?.id === tool.id ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-transparent text-[#5C5955] hover:border-[#D1CEC7] hover:bg-white"}`}>
                  <span className="block font-bold">{tool.title}</span>
                  <span className={`mt-0.5 block text-[10px] ${selectedTool?.id === tool.id ? "text-white/70" : "text-[#8C8984]"}`}>{tool.category}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className="min-w-0 border border-[#D1CEC7] bg-white p-5 md:p-8">
            {ActiveTool ? (
              <>
                <div className="mb-6 flex flex-col gap-3 border-b border-[#D1CEC7] pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="mb-1 text-[10px] font-mono font-bold uppercase tracking-widest text-[#E64833]">{selectedTool.category}</div>
                    <h2 className="text-2xl font-serif font-black text-[#1A1A1A]">{selectedTool.title}</h2>
                    <p className="mt-1 text-xs leading-relaxed text-[#5C5955]">{selectedTool.description}</p>
                  </div>
                  <button onClick={() => setSelectedToolId(getRequestedToolId())} className="inline-flex shrink-0 items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C8984] hover:text-[#1A1A1A]"><ArrowLeft className="h-3 w-3" /> Reset</button>
                </div>
                <ActiveTool />
              </>
            ) : <p className="text-sm text-[#5C5955]">No matching tool.</p>}
          </main>
        </div>
      </div>
    </section>
  );
}