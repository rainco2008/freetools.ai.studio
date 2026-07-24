import { useState, useMemo } from "react";
import { Search, Compass, ShieldCheck, ArrowRight, Sparkles, Filter, Check, Star } from "lucide-react";
import { Tool, TOOLS_DATABASE, CATEGORIES, STUDIO_APPS } from "../data";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [onlyWithAlternative, setOnlyWithAlternative] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Filter logic
  const filteredTools = useMemo(() => {
    return TOOLS_DATABASE.filter((tool) => {
      // Search matching (name, category, description, anchors)
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.industryAnchor.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || tool.category === selectedCategory;
      const matchesPrice = !selectedPriceRange || tool.priceRange === selectedPriceRange;
      const matchesAlternative = !onlyWithAlternative || tool.studioAlternativeId !== null;
      const matchesVerified = !onlyVerified || tool.verified;

      return matchesSearch && matchesCategory && matchesPrice && matchesAlternative && matchesVerified;
    });
  }, [searchQuery, selectedCategory, selectedPriceRange, onlyWithAlternative, onlyVerified]);

  const handleApplyQuickPill = (pill: string) => {
    if (pill === "100% Free Only") {
      setSelectedPriceRange("Free");
      setSelectedCategory(null);
      setOnlyWithAlternative(false);
    } else if (pill === "Text & SEO") {
      setSelectedCategory("Cognitive Writing");
      setSelectedPriceRange(null);
    } else if (pill === "Image Generation" || pill === "Coding Assistants") {
      setSelectedCategory("Development");
      setSelectedPriceRange(null);
    } else if (pill === "Trending Today") {
      setSearchQuery("v0");
      setSelectedCategory(null);
      setSelectedPriceRange(null);
    } else {
      setSearchQuery("");
      setSelectedCategory(null);
      setSelectedPriceRange(null);
      setOnlyWithAlternative(false);
      setOnlyVerified(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedPriceRange(null);
    setOnlyWithAlternative(false);
    setOnlyVerified(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-10 space-y-12 bg-[#FCFAF7]">
      
      {/* 1. Hero Section */}
      <div className="text-left space-y-4 border-b border-[#D1CEC7] pb-10">
        <div className="inline-block px-2.5 py-0.5 bg-[#E64833] text-white text-[9px] font-mono font-bold uppercase tracking-widest">
          COGNITIVE ALTERNATIVE MATRIX
        </div>
        <h2 className="text-4xl sm:text-6xl font-serif font-black tracking-tight text-[#1A1A1A] leading-[1.05]">
          Discover the AI Landscape.<br />
          Access the Alternatives.
        </h2>
        <p className="text-xs sm:text-sm text-[#5C5955] leading-relaxed font-serif max-w-2xl">
          freetools.ai.studio is an open software registry designed to monitor the global AI tool ecosystem, its associated commercial models, and pricing paywalls. 
          Discover leading enterprise solutions, analyze pricing, and instantly launch custom direct-to-model replacements powered entirely by Google Gemini for free.
        </p>

        {/* Action Search Bar */}
        <div className="max-w-2xl pt-4">
          <div className="relative flex">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8C8984]">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search applications, categories, or specific workflows (e.g. 'copywriting', 'SEO analysis', 'code generation')..."
              className="w-full border border-[#1A1A1A] bg-white p-4 pl-12 pr-6 text-xs text-[#1A1A1A] placeholder-[#8C8984] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A]"
            />
          </div>
          
          {/* Quick Filter Pills */}
          <div className="flex flex-wrap gap-2 mt-3.5 text-[9px] font-mono uppercase tracking-wider">
            <span className="text-[#8C8984] py-1">Quick Filters:</span>
            {["Trending Today", "Text & SEO", "Coding Assistants", "100% Free Only", "Reset"].map((pill) => (
              <button
                key={pill}
                onClick={() => handleApplyQuickPill(pill)}
                className="px-2 py-0.5 border border-[#D1CEC7] bg-white text-[#5C5955] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Flagship Studio Apps Spotlight (Quick Launch Area) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 bg-[#E64833]" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
            01. NATIVE FREE GEMINI STUDIO APPS / UNLEASHED ENGINE WORKSHOP
          </h3>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STUDIO_APPS.map((app) => (
            <a
              key={app.id}
              href={app.id === "bouquet-generator" ? "/bouquetgenerator" : `#/studio/${app.id}`}
              className="flex flex-col justify-between border border-[#1A1A1A] bg-[#F5F2EC] p-5 hover:bg-[#EAE6DF] transition-all group hover:-translate-y-0.5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="border border-[#1A1A1A] bg-black text-white px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider">
                    {app.category}
                  </span>
                  <Sparkles className="h-3.5 w-3.5 text-[#E64833]" />
                </div>
                <h4 className="text-sm font-serif font-bold text-[#1A1A1A] group-hover:text-[#E64833] transition-colors">
                  {app.name}
                </h4>
                <p className="text-[10px] text-[#8C8984] font-mono uppercase tracking-wider">
                  {app.tagline}
                </p>
                <p className="text-xs text-[#5C5955] leading-relaxed line-clamp-3">
                  {app.description}
                </p>
              </div>
              <div className="pt-4 border-t border-[#D1CEC7] mt-4 flex items-center justify-between text-[9px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
                <span>Launch Free Engine</span>
                <ArrowRight className="h-3 w-3 text-[#1A1A1A] group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 3. Main Directory Segment with Split Grid */}
      <div className="grid lg:grid-cols-4 gap-8 pt-6 border-t border-[#D1CEC7]">
        
        {/* Left Filters Sidebar */}
        <div className="space-y-8 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
              CATALOG FILTERS
            </span>
            {(selectedCategory || selectedPriceRange || onlyWithAlternative || onlyVerified) && (
              <button 
                onClick={handleResetFilters}
                className="text-[9px] font-mono text-[#E64833] uppercase hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories Filter list */}
          <div className="space-y-3 border-t border-[#D1CEC7] pt-4">
            <span className="text-[9px] font-mono font-bold text-[#8C8984] uppercase tracking-widest block">
              BY TECHNOLOGY FIELD / CATEGORY
            </span>
            <div className="space-y-1.5 text-xs text-[#5C5955]">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left py-1 font-serif flex items-center justify-between ${!selectedCategory ? "text-[#1A1A1A] font-bold" : "hover:text-[#1A1A1A]"}`}
              >
                <span>All Software Verticals</span>
                {!selectedCategory && <span className="h-1.5 w-1.5 bg-[#E64833]" />}
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left py-1 font-serif flex items-center justify-between ${selectedCategory === cat ? "text-[#1A1A1A] font-bold" : "hover:text-[#1A1A1A]"}`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <span className="h-1.5 w-1.5 bg-[#E64833]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Tier Filter */}
          <div className="space-y-3 border-t border-[#D1CEC7] pt-4">
            <span className="text-[9px] font-mono font-bold text-[#8C8984] uppercase tracking-widest block">
              ORIGINAL PRICING / COGNITIVE COST
            </span>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-bold uppercase tracking-wide">
              {["Free", "Freemium", "Paid"].map((price) => (
                <button
                  key={price}
                  onClick={() => setSelectedPriceRange(selectedPriceRange === price ? null : price)}
                  className={`px-3 py-1.5 text-center border transition-all ${
                    selectedPriceRange === price 
                      ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" 
                      : "border-[#D1CEC7] bg-white hover:border-[#1A1A1A] text-[#5C5955]"
                  }`}
                >
                  {price}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles (Studio App, Verified Status) */}
          <div className="space-y-3 border-t border-[#D1CEC7] pt-4">
            <span className="text-[9px] font-mono font-bold text-[#8C8984] uppercase tracking-widest block">
              SPECIAL MATRICES / ADVANCED FILTER
            </span>
            <div className="space-y-3">
              <label className="flex items-center gap-2.5 text-xs text-[#5C5955] cursor-pointer group">
                <input
                  type="checkbox"
                  checked={onlyWithAlternative}
                  onChange={(e) => setOnlyWithAlternative(e.target.checked)}
                  className="rounded-none border-[#D1CEC7] text-[#1A1A1A] focus:ring-0 h-4 w-4"
                />
                <span className="font-serif group-hover:text-[#1A1A1A] flex items-center gap-1.5">
                  With free Gemini Alternative
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#E64833]" />
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#5C5955] cursor-pointer group">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded-none border-[#D1CEC7] text-[#1A1A1A] focus:ring-0 h-4 w-4"
                />
                <span className="font-serif group-hover:text-[#1A1A1A]">
                  Vetted by Expert Community
                </span>
              </label>
            </div>
          </div>

          <div className="bg-[#F5F2EC] p-4 border border-[#D1CEC7] text-xs text-[#5C5955] space-y-2">
            <span className="font-serif font-bold text-[#1A1A1A] block">Open Studio Initiative</span>
            <p className="font-serif text-[11px] leading-relaxed text-[#8C8984]">
              We systematically reverse-engineer repetitive, high-cost enterprise AI interfaces and configure custom-crafted Gemini endpoints for public use. By removing credit ceilings, we protect your creative workflow from arbitrary subscriptions.
            </p>
          </div>
        </div>

        {/* Right Directory Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Indicators */}
          <div className="flex items-center justify-between pb-3 border-b border-[#D1CEC7]">
            <span className="text-xs font-serif text-[#5C5955] italic">
              Currently Displaying: <strong className="font-sans font-bold text-[#1A1A1A]">{filteredTools.length}</strong> AI application audits
            </span>
            <span className="text-[10px] font-mono text-[#8C8984] uppercase tracking-wider">
              TOTAL INDEXED: 14,204 TOOLS
            </span>
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTools.map((tool) => (
                <div 
                  key={tool.slug}
                  className="border border-[#D1CEC7] bg-white p-5 flex flex-col justify-between hover:border-[#1A1A1A] transition-all space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#8C8984] uppercase tracking-wider">
                        {tool.subCategory}
                      </span>
                      <div className="flex gap-1.5">
                        <span className="px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider border border-[#D1CEC7] text-[#5C5955]">
                          {tool.priceRange}
                        </span>
                        {tool.verified && (
                          <span className="px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider bg-[#E64833] text-white">
                            VERIFIED
                          </span>
                        )}
                      </div>
                    </div>
                    <h4 className="text-base font-serif font-bold text-[#1A1A1A]">
                      <a href={`#/tools/${tool.slug}`} className="hover:text-[#E64833] transition-colors">
                        {tool.name}
                      </a>
                    </h4>
                    <p className="text-[11px] text-[#8C8984] font-mono">
                      Industry Anchor: <span className="text-[#1A1A1A] font-bold">{tool.industryAnchor}</span>
                    </p>
                    <p className="text-xs text-[#5C5955] leading-relaxed line-clamp-3 font-serif">
                      {tool.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#F5F2EC] flex flex-col sm:flex-row gap-2.5">
                    <a
                      href={`#/tools/${tool.slug}`}
                      className="flex-1 text-center py-2 border border-[#1A1A1A] bg-white text-[9px] uppercase font-mono font-bold tracking-widest text-[#1A1A1A] hover:bg-[#F2EFE9] transition-colors"
                    >
                      View Review Audit
                    </a>
                    {tool.studioAlternativeId && (
                      <a
                        href={`#/studio/${tool.studioAlternativeId}?tool=${encodeURIComponent(tool.slug)}`}
                        className="flex-1 text-center py-2 border border-[#E64833] bg-[#E64833] text-white text-[9px] uppercase font-mono font-bold tracking-widest hover:bg-[#C93B28] transition-colors"
                      >
                        Try Free Gemini Alt
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 border border-dashed border-[#D1CEC7] bg-[#F5F2EC]/40">
              <Compass className="h-8 w-8 text-[#8C8984] mx-auto animate-pulse" />
              <div className="space-y-1">
                <h4 className="text-sm font-serif font-bold text-[#1A1A1A]">No Matching AI Software Found</h4>
                <p className="text-xs text-[#8C8984] font-serif">
                  Try adjusting your search terms, modifying price range filters, or exploring other category verticals.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-4 py-1.5 border border-[#1A1A1A] bg-black text-white text-[9px] uppercase font-bold tracking-widest hover:bg-black/80 transition-colors"
              >
                RESET FILTERS / SHOW ALL
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
