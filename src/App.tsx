import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import SiteHeader from "./components/SiteHeader";
import FreeToolsHome from "./components/FreeToolsHome";
import { Footer } from "./components/Navigation";
import { Locale } from "./freeToolsCatalog";

const DevelopmentToolsWorkbench = lazy(() => import("./components/DevelopmentToolsWorkbench"));
const ImageToolsWorkbench = lazy(() => import("./components/ImageToolsWorkbench"));
const LegalPages = lazy(() => import("./components/LegalPages"));

type AppRoute = "home" | "developer" | "image" | "terms" | "privacy";

interface RouteState {
  route: AppRoute;
  query: URLSearchParams;
}

function parseRoute(hash: string): RouteState {
  const normalized = hash.replace(/^#/, "") || "/";
  const [path, queryString = ""] = normalized.split("?");
  const query = new URLSearchParams(queryString);

  if (
    path === "/developer" ||
    path === "/studio/development-tools" ||
    path.startsWith("/tools/it-tools-")
  ) {
    if (path.startsWith("/tools/it-tools-") && !query.has("tool")) {
      query.set("tool", path.replace("/tools/it-tools-", ""));
    }
    return { route: "developer", query };
  }

  if (
    path === "/image" ||
    path === "/studio/image-tools" ||
    path === "/shot-easy" ||
    path.startsWith("/tools/image-tools-")
  ) {
    if (path.startsWith("/tools/image-tools-") && !query.has("tool")) {
      query.set("tool", path.replace("/tools/image-tools-", ""));
    }
    return { route: "image", query };
  }

  if (path === "/terms") return { route: "terms", query };
  if (path === "/privacy") return { route: "privacy", query };
  return { route: "home", query };
}

function LoadingPage() {
  return (
    <div className="mx-auto grid min-h-[50vh] max-w-7xl place-items-center px-4 text-sm text-[#6F6B65]">
      Loading tools…
    </div>
  );
}

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#/");
  const [locale, setLocale] = useState<Locale>(() => {
    const saved = localStorage.getItem("freetools_locale");
    if (saved === "zh" || saved === "en") return saved;
    return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  });

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash || "#/");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("freetools_locale", locale);
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [currentHash]);

  const routeState = useMemo(() => parseRoute(currentHash), [currentHash]);

  const content = (() => {
    switch (routeState.route) {
      case "developer":
        return (
          <Suspense fallback={<LoadingPage />}>
            <DevelopmentToolsWorkbench locale={locale} requestedToolId={routeState.query.get("tool")} />
          </Suspense>
        );
      case "image":
        return (
          <Suspense fallback={<LoadingPage />}>
            <ImageToolsWorkbench locale={locale} requestedToolId={routeState.query.get("tool")} />
          </Suspense>
        );
      case "terms":
        return (
          <Suspense fallback={<LoadingPage />}>
            <LegalPages page="terms" locale={locale} />
          </Suspense>
        );
      case "privacy":
        return (
          <Suspense fallback={<LoadingPage />}>
            <LegalPages page="privacy" locale={locale} />
          </Suspense>
        );
      default:
        return <FreeToolsHome locale={locale} initialQuery={routeState.query.get("q") || ""} />;
    }
  })();

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFAF7] text-[#1A1A1A]">
      <SiteHeader locale={locale} onLocaleChange={setLocale} route={routeState.route} />
      <main className="min-w-0 flex-1">{content}</main>
      <Footer locale={locale} />
    </div>
  );
}
