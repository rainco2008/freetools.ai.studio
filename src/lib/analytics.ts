export type AnalyticsConsent = "analytics" | "essential";

const CONSENT_STORAGE_KEY = "freetools_consent_v1";
const measurementId = (import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined)?.trim();

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: unknown[]) => void;
  }
}

let initialized = false;
let tagConfigured = false;

function ensureGoogleTagQueue() {
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
}

function updateConsent(choice: AnalyticsConsent) {
  ensureGoogleTagQueue();
  window.gtag?.("consent", "update", {
    analytics_storage: choice === "analytics" ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function loadGoogleTag() {
  if (!measurementId || tagConfigured) return;
  tagConfigured = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.id = "google-analytics";
  document.head.appendChild(script);

  window.gtag?.("js", new Date());
  window.gtag?.("config", measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

function clearAnalyticsCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (!name?.startsWith("_ga")) return;
    document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}; SameSite=Lax`;
  });
}

export function getAnalyticsConsent(): AnalyticsConsent | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === "analytics" || stored === "essential" ? stored : null;
  } catch {
    return null;
  }
}

export function analyticsIsConfigured() {
  return Boolean(measurementId);
}

export function initializeAnalytics() {
  if (initialized || !measurementId) return;
  initialized = true;
  ensureGoogleTagQueue();
  window.gtag?.("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });
  window.gtag?.("set", "ads_data_redaction", true);

  const stored = getAnalyticsConsent();
  if (stored) updateConsent(stored);
  if (stored === "analytics") loadGoogleTag();
}

export function setAnalyticsConsent(choice: AnalyticsConsent) {
  initializeAnalytics();
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Consent still applies for the current page when storage is unavailable.
  }
  updateConsent(choice);
  if (choice === "analytics") {
    loadGoogleTag();
    trackPageView();
  } else {
    clearAnalyticsCookies();
  }
}

export function trackPageView(path = `${window.location.pathname}${window.location.hash}`) {
  initializeAnalytics();
  if (!measurementId || getAnalyticsConsent() !== "analytics") return;
  loadGoogleTag();
  window.gtag?.("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path,
  });
}

export function openConsentSettings() {
  window.dispatchEvent(new Event("freetools:open-consent"));
}
