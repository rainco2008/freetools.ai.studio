import { useState, useEffect, FormEvent } from "react";
import { TopHeader, CollapsibleSidebar } from "./components/SidebarNavigation";
import { Footer } from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import DiscoverPage from "./components/DiscoverPage";
import ToolDetailPage from "./components/ToolDetailPage";
import AboutPage from "./components/AboutPage";
import { TermsPage, PrivacyPage } from "./components/LegalPages";
import StudioAppSandbox from "./components/StudioAppSandbox";
import Breadcrumbs from "./components/Breadcrumbs";
import { SavedReport, ResearchReport, GroundingSource } from "./types";
import ShotEasyStudio from "./components/ShotEasyStudio";

export default function App() {
  // Simple Hash Routing System
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#/");

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#/");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // --- Core State for original Research Brief / FactLens ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState<SavedReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [reportType, setReportType] = useState<"brief" | "competitive" | "factcheck">("brief");
  const [languageStyle, setLanguageStyle] = useState<"objective" | "simple" | "academic">("objective");
  const [customFormat, setCustomFormat] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [loadingQuery, setLoadingQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Initialize and load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("research_history");
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
        if (parsed.length > 0) {
          setSelectedReportId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to load history from localStorage", e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: SavedReport[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem("research_history", JSON.stringify(newHistory));
    } catch (e) {
      console.error("Failed to save history to localStorage", e);
    }
  };

  // Generate Grounded Research Brief report
  const handleGenerate = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setLoadingQuery(query);
    setError(null);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          reportType,
          languageStyle,
          customFormat: customFormat.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred while generating the research report. Please try again.");
      }

      const { report, groundingSources } = data as {
        report: ResearchReport;
        groundingSources: GroundingSource[];
      };

      const newReport: SavedReport = {
        id: `report-${Date.now()}`,
        query: query.trim(),
        reportType,
        languageStyle,
        createdAt: new Date().toISOString(),
        report,
        groundingSources,
      };

      const updatedHistory = [newReport, ...history];
      saveHistory(updatedHistory);
      setSelectedReportId(newReport.id);

      // Clean inputs
      setQuery("");
      setCustomFormat("");

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to connect to the server. Please check your network connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply preset selection
  const handleApplyPreset = (preset: { query: string; type: string; style: string }) => {
    setQuery(preset.query);
    setReportType(preset.type as any);
    setLanguageStyle(preset.style as any);
  };

  const handleSelectReport = (id: string) => {
    setSelectedReportId(id);
  };

  const handleDeleteReport = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    
    if (selectedReportId === id) {
      setSelectedReportId(updated.length > 0 ? updated[0].id : null);
    }
  };

  // --- Router Helpers ---
  const getToolSlug = () => {
    if (currentHash.startsWith("#/tools/")) {
      return currentHash.replace("#/tools/", "");
    }
    return null;
  };

  const getStudioAppId = () => {
    const pathname = window.location.pathname.replace(/\/$/, "");
    if (pathname === "/bouquetgenerator") {
      return "bouquet-generator";
    }
    if (currentHash.startsWith("#/studio/")) {
      const parts = currentHash.replace("#/studio/", "").split("?");
      return parts[0];
    }
    return null;
  };

  // Auto scroll to top on routing
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentHash]);

  // Pack the research brief properties to pass down
  const researchBriefProps = {
    sidebarOpen,
    setSidebarOpen,
    history,
    selectedReportId,
    setSelectedReportId,
    query,
    setQuery,
    reportType,
    setReportType,
    languageStyle,
    setLanguageStyle,
    customFormat,
    setCustomFormat,
    isLoading,
    error,
    handleGenerate,
    handleApplyPreset,
    handleSelectReport,
    handleDeleteReport
  };

  // Category state for Breadcrumbs & Landing Page
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Compute active view & route parameters for Breadcrumbs
  const toolSlug = getToolSlug();
  const studioAppId = getStudioAppId();

  let activeView: "landing" | "discover" | "tool-detail" | "studio" | "about" | "terms" | "privacy" = "landing";
  if (toolSlug) {
    activeView = "tool-detail";
  } else if (studioAppId) {
    activeView = "studio";
  } else if (currentHash === "#/discover") {
    activeView = "discover";
  } else if (currentHash === "#/about") {
    activeView = "about";
  } else if (currentHash === "#/terms") {
    activeView = "terms";
  } else if (currentHash === "#/privacy") {
    activeView = "privacy";
  }

  // --- Main Route Component Rendering ---
  const renderMainContent = () => {
    if (currentHash === "#/shot-easy") {
      return <ShotEasyStudio />;
    }
    if (toolSlug) {
      return <ToolDetailPage slug={toolSlug} />;
    }

    if (studioAppId) {
      return <StudioAppSandbox appId={studioAppId} researchBriefProps={researchBriefProps} />;
    }

    if (currentHash === "#/discover") {
      return <DiscoverPage />;
    }

    if (currentHash === "#/about") {
      return <AboutPage />;
    }

    if (currentHash === "#/terms") {
      return <TermsPage />;
    }

    if (currentHash === "#/privacy") {
      return <PrivacyPage />;
    }

    // Default route: LandingPage & Directory Hub
    return (
      <LandingPage
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedSubCategory(null);
        }}
        onSelectSubCategory={(sub) => setSelectedSubCategory(sub)}
      />
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFAF7] text-[#1A1A1A]">
      <TopHeader 
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
      />

      {/* Main App Workspace with Left Collapsible Sidebar */}
      <div className="flex flex-1 min-h-0 relative">
        <CollapsibleSidebar
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
        />

        {/* Content Panel */}
        <main className="flex-1 min-w-0 flex flex-col overflow-x-hidden">
          {/* Mounted Breadcrumb Navigation Bar below Header */}
          <div className="mx-auto max-w-7xl w-full px-4 md:px-8 pt-4 pb-0">
            <Breadcrumbs
              activeView={activeView}
              activeSlug={toolSlug}
              activeStudioAppId={studioAppId}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              onResetCategory={() => {
                setSelectedCategory(null);
                setSelectedSubCategory(null);
              }}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              onSelectSubCategory={(sub) => setSelectedSubCategory(sub)}
            />
          </div>

          <div className="flex-1">
            {renderMainContent()}
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
