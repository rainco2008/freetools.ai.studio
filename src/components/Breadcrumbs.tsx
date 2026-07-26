import React from "react";
import { 
  Home, 
  ChevronRight, 
  Sparkles, 
  Compass, 
  Wand2, 
  Code2, 
  Image as ImageIcon, 
  FileText, 
  Info, 
  ShieldCheck, 
  FileCheck2,
  Box
} from "lucide-react";
import { CATEGORIES_TAXONOMY, STUDIO_APPS, TOOLS_DATABASE } from "../data";

export interface BreadcrumbsProps {
  activeView: "landing" | "discover" | "tool-detail" | "studio" | "about" | "terms" | "privacy";
  activeSlug?: string | null;
  activeStudioAppId?: string | null;
  selectedCategory?: string | null;
  selectedSubCategory?: string | null;
  onResetCategory?: () => void;
  onSelectCategory?: (category: string | null) => void;
  onSelectSubCategory?: (subcategory: string | null) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  activeView,
  activeSlug,
  activeStudioAppId,
  selectedCategory,
  selectedSubCategory,
  onResetCategory,
  onSelectCategory,
  onSelectSubCategory
}) => {
  // Find taxonomy details if category or subcategory selected
  const currentCategoryObj = selectedCategory 
    ? CATEGORIES_TAXONOMY.find(c => c.id === selectedCategory) 
    : null;

  const currentSubCategoryObj = (currentCategoryObj && selectedSubCategory)
    ? currentCategoryObj.subCategories.find(s => s.id === selectedSubCategory)
    : null;

  // Find tool detail if activeView === "tool-detail"
  const currentToolObj = (activeView === "tool-detail" && activeSlug)
    ? TOOLS_DATABASE.find(t => t.slug === activeSlug)
    : null;

  // Find studio app if activeView === "studio"
  const currentStudioAppObj = (activeView === "studio" && activeStudioAppId)
    ? STUDIO_APPS.find(s => s.id === activeStudioAppId)
    : null;

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onResetCategory) onResetCategory();
    window.location.hash = "";
  };

  const handleCategoryClick = (catId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectCategory) onSelectCategory(catId);
    if (onSelectSubCategory) onSelectSubCategory(null);
    window.location.hash = "";
  };

  const handleSubCategoryClick = (subId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (onSelectSubCategory) onSelectSubCategory(subId);
    window.location.hash = "";
  };

  return (
    <nav 
      aria-label="Breadcrumb navigation"
      className="flex items-center flex-wrap gap-1.5 text-xs font-medium text-[#7A7771] mb-5 bg-[#FAF7F2] px-3.5 py-2 rounded-lg border border-[#E6E2D8] shadow-xs select-none transition-all duration-200"
    >
      {/* Root / Home */}
      <a
        href="#/"
        onClick={handleHomeClick}
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[#5C5954] hover:text-[#E64833] hover:bg-[#EAE6DF] transition-colors font-medium"
        title="Go to Home"
      >
        <Home className="w-3.5 h-3.5 text-[#8C8984]" />
        <span>Home</span>
      </a>

      {/* Landing View with Category Filter */}
      {activeView === "landing" && (
        <>
          {currentCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#B8B4AC] shrink-0" />
              {currentSubCategoryObj ? (
                <button
                  type="button"
                  onClick={(e) => handleCategoryClick(currentCategoryObj.id, e)}
                  className="px-2 py-1 rounded-md text-[#5C5954] hover:text-[#E64833] hover:bg-[#EAE6DF] transition-colors cursor-pointer"
                >
                  {currentCategoryObj.name}
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EAE6DF] text-[#1A1A1A] font-semibold border border-[#DCD8D0]">
                  <Box className="w-3 h-3 text-[#E64833]" />
                  {currentCategoryObj.name}
                </span>
              )}
            </>
          )}

          {currentSubCategoryObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#B8B4AC] shrink-0" />
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EAE6DF] text-[#1A1A1A] font-semibold border border-[#DCD8D0]">
                {currentSubCategoryObj.name}
              </span>
            </>
          )}
        </>
      )}

      {/* Discover Page */}
      {activeView === "discover" && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8B4AC] shrink-0" />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAE6DF] text-[#1A1A1A] font-semibold border border-[#DCD8D0]">
            <Compass className="w-3.5 h-3.5 text-[#E64833]" />
            Discover & Inspiration
          </span>
        </>
      )}

      {/* Tool Detail Page */}
      {activeView === "tool-detail" && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8B4AC] shrink-0" />
          <a
            href="#/"
            onClick={handleHomeClick}
            className="px-2 py-1 rounded-md text-[#5C5954] hover:text-[#E64833] hover:bg-[#EAE6DF] transition-colors"
          >
            Tools Directory
          </a>
          {currentToolObj && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#B8B4AC] shrink-0" />
              <span className="px-2 py-1 text-[#8C8984]">
                {currentToolObj.category}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-[#B8B4AC] shrink-0" />
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EAE6DF] text-[#1A1A1A] font-semibold border border-[#DCD8D0] truncate max-w-[200px] sm:max-w-none">
                <Wand2 className="w-3.5 h-3.5 text-[#E64833]" />
                {currentToolObj.name}
              </span>
            </>
          )}
        </>
      )}

      {/* Studio Sandbox App */}
      {activeView === "studio" && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8B4AC] shrink-0" />
          <a
            href="#/"
            onClick={handleHomeClick}
            className="px-2 py-1 rounded-md text-[#5C5954] hover:text-[#E64833] hover:bg-[#EAE6DF] transition-colors"
          >
            Superworker Sandboxes
          </a>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8B4AC] shrink-0" />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAE6DF] text-[#1A1A1A] font-semibold border border-[#DCD8D0]">
            <Sparkles className="w-3.5 h-3.5 text-[#E64833]" />
            {currentStudioAppObj ? currentStudioAppObj.name : activeStudioAppId}
          </span>
        </>
      )}

      {/* About Page */}
      {activeView === "about" && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8B4AC] shrink-0" />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAE6DF] text-[#1A1A1A] font-semibold border border-[#DCD8D0]">
            <Info className="w-3.5 h-3.5 text-[#E64833]" />
            About Studio
          </span>
        </>
      )}

      {/* Terms Page */}
      {activeView === "terms" && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8B4AC] shrink-0" />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAE6DF] text-[#1A1A1A] font-semibold border border-[#DCD8D0]">
            <FileCheck2 className="w-3.5 h-3.5 text-[#E64833]" />
            Terms of Service
          </span>
        </>
      )}

      {/* Privacy Page */}
      {activeView === "privacy" && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-[#B8B4AC] shrink-0" />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EAE6DF] text-[#1A1A1A] font-semibold border border-[#DCD8D0]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E64833]" />
            Privacy Policy
          </span>
        </>
      )}
    </nav>
  );
};

export default Breadcrumbs;
