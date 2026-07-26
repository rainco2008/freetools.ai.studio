import React, { useState } from "react";
import { 
  Code2, Image as ImageIcon, PenTool, Search, Database, Globe, Cpu,
  ChevronDown, ChevronRight, ChevronLeft, PanelLeftClose, PanelLeftOpen, 
  Sparkles, Menu, X, Compass, ExternalLink, ArrowRight, ArrowLeft, LayoutGrid, Layers,
  Terminal, Server, Wand2, Palette, FileText, Briefcase, Feather,
  Camera, Edit3, Circle, Eraser, Droplet, Minimize, RefreshCcw, Eye, Maximize2, Video, ShieldCheck
} from "lucide-react";
import { CATEGORIES_TAXONOMY, STUDIO_APPS, TOOLS_DATABASE, CategoryDef } from "../data";
import { UserMenu } from "./UserMenu";

interface NavigationProps {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  selectedSubCategory: string | null;
  setSelectedSubCategory: (subCat: string | null) => void;
  onOpenMobileMenu?: () => void;
}

// Icon helper mapping
const getCategoryIcon = (iconName: string, className = "h-4 w-4") => {
  switch (iconName) {
    case "Cpu": return <Cpu className={className} />;
    case "Code2": return <Code2 className={className} />;
    case "Image": return <ImageIcon className={className} />;
    case "PenTool": return <PenTool className={className} />;
    case "Search": return <Search className={className} />;
    case "Database": return <Database className={className} />;
    case "Globe": return <Globe className={className} />;
    case "Terminal": return <Terminal className={className} />;
    case "Server": return <Server className={className} />;
    case "Sparkles": return <Sparkles className={className} />;
    case "Wand2": return <Wand2 className={className} />;
    case "Palette": return <Palette className={className} />;
    case "Layers": return <Layers className={className} />;
    case "FileText": return <FileText className={className} />;
    case "Briefcase": return <Briefcase className={className} />;
    case "Feather": return <Feather className={className} />;
    case "Camera": return <Camera className={className} />;
    case "Edit3": return <Edit3 className={className} />;
    case "Circle": return <Circle className={className} />;
    case "Eraser": return <Eraser className={className} />;
    case "Droplet": return <Droplet className={className} />;
    case "Minimize": return <Minimize className={className} />;
    case "RefreshCcw": return <RefreshCcw className={className} />;
    case "Eye": return <Eye className={className} />;
    case "Maximize2": return <Maximize2 className={className} />;
    case "Video": return <Video className={className} />;
    case "ShieldCheck": return <ShieldCheck className={className} />;
    case "LayoutGrid": return <LayoutGrid className={className} />;
    case "Compass": return <Compass className={className} />;
    default: return <Layers className={className} />;
  }
};

export function TopHeader({ 
  isSidebarCollapsed, 
  setIsSidebarCollapsed, 
  selectedCategory, 
  setSelectedCategory,
  setSelectedSubCategory 
}: NavigationProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    setSelectedSubCategory(null);
    if (window.location.hash !== "#/" && !window.location.hash.startsWith("#/?")) {
      window.location.hash = "#/";
    }
  };

  return (
    <header className="no-print sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-[#D1CEC7] bg-[#F5F2EC] px-3 md:px-6 shadow-sm">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <a href="#/" className="flex items-center gap-2 group">
          <div className="h-6 w-6 border border-[#1A1A1A] bg-black text-white flex items-center justify-center font-serif font-black text-xs">
            F
          </div>
          <h1 className="text-lg font-serif italic font-black leading-none text-[#1A1A1A]">
            freetools<span className="text-[#E64833] font-sans not-italic font-bold">.ai.studio</span>
          </h1>
        </a>
      </div>

      {/* Middle: Top Main Category Toolbars */}
      <nav className="hidden md:flex items-center gap-1 overflow-x-auto max-w-[55vw] xl:max-w-none bg-[#EAE6DF]/60 p-1 border border-[#D1CEC7] no-scrollbar">
        {CATEGORIES_TAXONOMY.map((cat) => {
          const isSelected = selectedCategory === cat.name;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.name)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isSelected
                  ? "bg-[#1A1A1A] text-white shadow-xs"
                  : "text-[#5C5955] hover:text-[#1A1A1A] hover:bg-white/60"
              }`}
            >
              {getCategoryIcon(cat.iconName, `h-3.5 w-3.5 shrink-0 ${isSelected ? "text-white" : "text-[#E64833]"}`)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: Actions & User Auth */}
      <div className="flex items-center gap-3">
        <span className="hidden md:block h-4 w-px bg-[#D1CEC7]" />
        
        {/* User Auth & Menu */}
        <UserMenu />
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileNavOpen && (
        <div className="sm:hidden absolute top-14 left-0 w-full bg-[#F5F2EC] border-b border-[#D1CEC7] p-4 space-y-3 z-50 shadow-lg">
          <div className="text-[10px] font-mono font-bold uppercase text-[#8C8984] tracking-widest border-b border-[#D1CEC7] pb-1">
            Category Taxonomy
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {CATEGORIES_TAXONOMY.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  handleSelectCategory(cat.name);
                  setMobileNavOpen(false);
                }}
                className="p-2 border border-[#D1CEC7] bg-white text-left flex items-center gap-2 font-serif font-bold text-[#1A1A1A]"
              >
                {getCategoryIcon(cat.iconName, "h-3.5 w-3.5 text-[#E64833]")}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function CollapsibleSidebar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory
}: NavigationProps) {
  // Identify active category definition based on selectedCategory state
  const activeCategoryDef = selectedCategory
    ? CATEGORIES_TAXONOMY.find(
        (cat) =>
          cat.name === selectedCategory ||
          cat.name.toLowerCase().includes(selectedCategory.toLowerCase().split(" ")[0])
      )
    : null;

  const getSubcategoryTargetRoute = (subId: string, categoryName: string) => {
    // Image category subcategories
    const imageSubcategoryIds = [
      "screenshot", "editor", "beautifier", "rounded", "remover",
      "blur-bg", "compressor", "convert", "viewer", "long-image", "video"
    ];
    if (categoryName === "Image" || imageSubcategoryIds.includes(subId)) {
      return `#/studio/image-tools?tool=image-tools-${subId}`;
    }

    // Development subcategories
    if (subId === "ui-components" || subId === "dev-tools") {
      return "#/studio/development-tools";
    }
    if (subId === "code-architect") {
      return "#/studio/code-architect";
    }

    // Cognitive Writing & SEO & Language & Data
    if (subId === "research-briefs" || subId === "serp-analysis" || subId === "market-intelligence" || subId === "academic-research" || subId === "fact-verification") {
      return "#/studio/research-brief";
    }
    if (subId === "copywriting" || subId === "longform-drafts" || subId === "grammar-style") {
      return "#/studio/ai-copywriter";
    }
    if (subId === "keyword-gaps" || subId === "content-audit") {
      return "#/studio/semantic-seo";
    }
    if (subId === "translation" || subId === "localization") {
      return "#/studio/translator";
    }

    return "#/";
  };

  const handleSelectCategory = (catName: string) => {
    setSelectedCategory(catName);
    setSelectedSubCategory(null);
    if (window.location.hash !== "#/" && !window.location.hash.startsWith("#/?")) {
      window.location.hash = "#/";
    }
  };

  const handleSelectSubCategory = (subName: string, subId?: string, catName?: string) => {
    const activeCat = catName || (activeCategoryDef ? activeCategoryDef.name : selectedCategory);
    if (catName && catName !== selectedCategory) {
      setSelectedCategory(catName);
    }

    if (selectedSubCategory === subName && window.location.hash.includes(subId || "")) {
      setSelectedSubCategory(null);
      window.location.hash = "#/";
    } else {
      setSelectedSubCategory(subName);
      const targetHash = subId ? getSubcategoryTargetRoute(subId, activeCat || "") : "#/";
      window.location.hash = targetHash;
    }
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    if (window.location.hash !== "#/" && !window.location.hash.startsWith("#/?")) {
      window.location.hash = "#/";
    }
  };

  return (
    <aside
      className={`no-print shrink-0 border-r border-[#D1CEC7] bg-[#F5F2EC] flex flex-col justify-between transition-all duration-300 ease-in-out select-none ${
        isSidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Top Header of Sidebar */}
      <div className="p-3 border-b border-[#D1CEC7] flex items-center justify-between bg-[#EAE6DF]/50">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2 truncate">
            {activeCategoryDef ? (
              <div className="flex items-center gap-2 truncate">
                {getCategoryIcon(activeCategoryDef.iconName, "h-4 w-4 text-[#E64833] shrink-0")}
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1A1A1A] truncate">
                  {activeCategoryDef.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-[#E64833] shrink-0" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#1A1A1A]">
                  CATEGORIES INDEX
                </span>
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setIsSidebarCollapsed((prev) => !prev)}
          className={`flex h-7 w-7 items-center justify-center border border-[#D1CEC7] bg-white text-[#1A1A1A] hover:bg-[#EAE6DF] transition-colors cursor-pointer shrink-0 ${
            isSidebarCollapsed ? "mx-auto" : ""
          }`}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-[#1A1A1A]" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-[#8C8984]" />
          )}
        </button>
      </div>

      {/* Main Sidebar Content Area */}
      <div className="flex-1 overflow-y-auto py-3 space-y-3 px-2">
        {activeCategoryDef ? (
          /* ===================================================
             SPECIFIC CATEGORY SELECTED: Show ONLY sub-categories!
             =================================================== */
          <>
            {isSidebarCollapsed ? (
              /* Collapsed view for selected category */
              <div className="space-y-2">
                {/* Back to all verticals icon button */}
                <button
                  onClick={handleClearCategory}
                  className="w-full h-9 flex items-center justify-center border border-[#D1CEC7] bg-white text-[#5C5955] hover:text-[#E64833] hover:border-[#E64833] transition-all cursor-pointer"
                  title="View All Verticals"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <div className="h-px bg-[#D1CEC7] my-1" />

                {/* Sub-categories icons */}
                {activeCategoryDef.subCategories.map((sub) => {
                  const isSubActive = selectedSubCategory === sub.name;
                  return (
                    <div key={sub.id} className="relative group">
                      <button
                        onClick={() => handleSelectSubCategory(sub.name, sub.id, activeCategoryDef.name)}
                        className={`w-full h-9 flex items-center justify-center border transition-all cursor-pointer ${
                          isSubActive
                            ? "border-[#1A1A1A] bg-[#1A1A1A] text-white shadow-xs"
                            : "border-transparent text-[#5C5955] hover:border-[#D1CEC7] hover:bg-white hover:text-[#1A1A1A]"
                        }`}
                        title={sub.name}
                      >
                        {getCategoryIcon(sub.iconName, `h-3.5 w-3.5 ${isSubActive ? "text-white" : "text-[#1A1A1A]"}`)}
                      </button>

                      {/* Tooltip on hover */}
                      <div className="hidden group-hover:block absolute left-14 top-0 z-50 w-48 bg-white border border-[#1A1A1A] p-2 shadow-xl">
                        <span className="text-xs font-serif font-bold text-[#1A1A1A] block">{sub.name}</span>
                        <span className="text-[9px] font-mono text-[#8C8984]">Click to open page</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Expanded view for selected category */
              <div className="space-y-3">
                {/* Subcategories Header */}
                <div className="pt-2 border-t border-[#D1CEC7]">
                  <div className="flex items-center justify-between text-xs font-mono font-bold uppercase tracking-widest text-[#8C8984] mb-2 px-1">
                    <span>Sub-Categories ({activeCategoryDef.subCategories.length})</span>
                  </div>

                  {/* Subcategories List */}
                  <div className="space-y-1">
                    {activeCategoryDef.subCategories.map((sub) => {
                      const isSubActive = selectedSubCategory === sub.name;
                      const subToolsCount = TOOLS_DATABASE.filter(
                        (t) => t.subCategory === sub.name || t.subCategory?.includes(sub.name)
                      ).length;

                      return (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSubCategory(sub.name, sub.id, activeCategoryDef.name)}
                          className={`w-full text-left px-2.5 py-2 border text-xs font-serif flex items-center justify-between transition-all cursor-pointer ${
                            isSubActive
                              ? "border-[#E64833] bg-white text-[#E64833] font-bold shadow-xs"
                              : "border-transparent text-[#1A1A1A] hover:border-[#D1CEC7] hover:bg-white/80"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-1">
                            {getCategoryIcon(sub.iconName, `h-3.5 w-3.5 shrink-0 ${isSubActive ? "text-[#E64833]" : "text-[#8C8984]"}`)}
                            <span className="truncate">{sub.name}</span>
                          </div>
                          {subToolsCount > 0 && (
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 border shrink-0 ${
                              isSubActive ? "bg-[#E64833] text-white border-transparent" : "bg-[#EAE6DF] text-[#5C5955] border-[#D1CEC7]"
                            }`}>
                              {subToolsCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Studio Apps in this Category */}
                {(() => {
                  const matchingStudioApps = STUDIO_APPS.filter(
                    (app) => app.category === activeCategoryDef.name || app.category.includes(activeCategoryDef.name.split(" ")[0])
                  );
                  if (matchingStudioApps.length === 0) return null;

                  return (
                    <div className="pt-2 border-t border-[#D1CEC7] space-y-1">
                      <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#E64833] mb-1 px-1 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Interactive Studio</span>
                      </div>
                      {matchingStudioApps.map((app) => (
                        <a
                          key={app.id}
                          href={`#/studio/${app.id}`}
                          className="flex items-center justify-between text-xs font-mono font-bold text-[#E64833] bg-[#E64833]/5 hover:bg-[#E64833]/15 p-2.5 border border-[#E64833]/30 transition-colors"
                        >
                          <span className="truncate">{app.name}</span>
                          <span className="text-[10px] bg-[#E64833] text-white px-1.5 py-0.5 uppercase shrink-0">FREE</span>
                        </a>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </>
        ) : (
          /* ===================================================
             NO CATEGORY SELECTED ("All Verticals"): Show all top categories!
             =================================================== */
          <>
            {isSidebarCollapsed ? (
              <div className="space-y-1">
                {CATEGORIES_TAXONOMY.map((cat) => (
                  <div key={cat.id} className="relative group">
                    <button
                      onClick={() => handleSelectCategory(cat.name)}
                      className="w-full h-10 flex items-center justify-center border border-transparent text-[#5C5955] hover:border-[#D1CEC7] hover:bg-white hover:text-[#1A1A1A] transition-all cursor-pointer"
                      title={cat.name}
                    >
                      {getCategoryIcon(cat.iconName, "h-4 w-4 text-[#1A1A1A]")}
                    </button>
                    <div className="hidden group-hover:block absolute left-14 top-0 z-50 w-48 bg-white border border-[#1A1A1A] p-2 shadow-xl">
                      <span className="text-xs font-serif font-bold text-[#1A1A1A] block">{cat.name}</span>
                      <span className="text-xs font-mono text-[#8C8984]">{cat.subCategories.length} sub-categories</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#8C8984] px-1">
                  SELECT A VERTICAL CATEGORY
                </div>

                <div className="space-y-1.5">
                  {CATEGORIES_TAXONOMY.map((cat) => {
                    const totalTools = TOOLS_DATABASE.filter(
                      (t) => t.category === cat.name || t.category.includes(cat.name.split(" ")[0])
                    ).length;

                    return (
                      <div
                        key={cat.id}
                        className="w-full text-left p-3 border border-[#D1CEC7] bg-white hover:border-[#1A1A1A] transition-all group"
                      >
                        <button
                          onClick={() => handleSelectCategory(cat.name)}
                          className="w-full text-left flex items-center justify-between mb-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(cat.iconName, "h-4 w-4 text-[#E64833]")}
                            <span className="text-xs font-serif font-bold text-[#1A1A1A] group-hover:text-[#E64833] transition-colors">
                              {cat.name}
                            </span>
                          </div>
                          <span className="text-xs font-mono px-1.5 py-0.5 bg-[#EAE6DF] text-[#5C5955] border border-[#D1CEC7]">
                            {totalTools}
                          </span>
                        </button>
                        
                        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-[#EAE6DF]">
                          {cat.subCategories.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectSubCategory(sub.name, sub.id, cat.name);
                              }}
                              className="text-[10px] font-mono px-1.5 py-0.5 bg-[#FCFAF7] hover:bg-[#E64833] hover:text-white border border-[#D1CEC7] transition-colors cursor-pointer"
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#D1CEC7] bg-[#EAE6DF]/40 text-xs font-mono text-[#8C8984]">
        {!isSidebarCollapsed ? (
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[#1A1A1A] font-bold">
              <span>{activeCategoryDef ? `Filter: ${activeCategoryDef.name}` : "Index"}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            </div>
            <p className="text-xs leading-tight text-[#8C8984]">
              {selectedSubCategory
                ? `Active Sub: ${selectedSubCategory}`
                : "Select sub-categories above to narrow down directory."}
            </p>
          </div>
        ) : (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="w-full flex items-center justify-center p-1 text-[#8C8984] hover:text-[#1A1A1A]"
            title="Expand Sidebar"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}
      </div>
    </aside>
  );
}
