import { useState, useEffect, FormEvent } from "react";
import { Header, Footer } from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import DiscoverPage from "./components/DiscoverPage";
import ToolDetailPage from "./components/ToolDetailPage";
import AboutPage from "./components/AboutPage";
import { TermsPage, PrivacyPage } from "./components/LegalPages";
import StudioAppSandbox from "./components/StudioAppSandbox";
import { SavedReport, ResearchReport, GroundingSource } from "./types";

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

  // --- Main Route Component Rendering ---
  const renderMainContent = () => {
    const toolSlug = getToolSlug();
    if (toolSlug) {
      return <ToolDetailPage slug={toolSlug} />;
    }

    const studioAppId = getStudioAppId();
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
    return <LandingPage />;
  };

  // Decide if we should show the sidebar button inside the main header
  const isResearchBriefActive = getStudioAppId() === "research-brief";

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFAF7] text-[#1A1A1A]">
      <Header 
        onOpenSidebar={() => setSidebarOpen(true)} 
        showSidebarButton={isResearchBriefActive} 
      />

      {/* Main Container */}
      <div className="flex-1">
        {renderMainContent()}
      </div>

      <Footer />
    </div>
  );
}
