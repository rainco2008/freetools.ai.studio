import { useEffect, useState } from "react";
import { Cookie, ShieldCheck, X } from "lucide-react";
import {
  analyticsIsConfigured,
  getAnalyticsConsent,
  initializeAnalytics,
  setAnalyticsConsent,
} from "../lib/analytics";
import { Locale } from "../freeToolsCatalog";

const copy = {
  zh: {
    title: "你的隐私选择",
    body: "我们使用必要的本地存储来保存语言、登录和隐私选择。只有在你同意后，才会启用 Google Analytics 4；广告存储和广告个性化始终关闭。",
    accept: "允许匿名分析",
    essential: "仅必要功能",
    close: "关闭",
    privacy: "查看隐私政策",
  },
  en: {
    title: "Your privacy choices",
    body: "We use essential local storage for language, sign-in, and privacy preferences. Google Analytics 4 is enabled only after you agree; advertising storage and personalization stay disabled.",
    accept: "Allow analytics",
    essential: "Essential only",
    close: "Close",
    privacy: "Read the privacy policy",
  },
};

export default function ConsentBanner({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    initializeAnalytics();
    if (analyticsIsConfigured() && !getAnalyticsConsent()) setOpen(true);
    const showSettings = () => setOpen(true);
    window.addEventListener("freetools:open-consent", showSettings);
    return () => window.removeEventListener("freetools:open-consent", showSettings);
  }, []);

  if (!open || !analyticsIsConfigured()) return null;

  const choose = (choice: "analytics" | "essential") => {
    setAnalyticsConsent(choice);
    setOpen(false);
  };

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-[80] px-3 pb-3 sm:px-5 sm:pb-5">
      <section
        aria-label={t.title}
        className="relative mx-auto flex max-w-5xl flex-col gap-4 rounded-xl border border-[#1A1A1A] bg-white p-4 shadow-2xl sm:p-5 lg:flex-row lg:items-center"
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#FFF1ED] text-[#E64833]">
            <Cookie className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-sm font-black text-[#1A1A1A]">{t.title}</h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-[#6F6B65]">{t.body}</p>
            <a href="#/privacy" className="mt-1.5 inline-flex text-xs font-semibold text-[#E64833] hover:underline">
              {t.privacy}
            </a>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row lg:shrink-0">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="h-10 rounded-md border border-[#D8D3CA] bg-white px-4 text-xs font-bold text-[#1A1A1A] hover:border-[#1A1A1A]"
          >
            {t.essential}
          </button>
          <button
            type="button"
            onClick={() => choose("analytics")}
            className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#1A1A1A] px-4 text-xs font-bold text-white hover:bg-black"
          >
            <ShieldCheck className="h-4 w-4" />
            {t.accept}
          </button>
        </div>
        {getAnalyticsConsent() && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 text-[#8C8984] lg:static"
            aria-label={t.close}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </section>
    </div>
  );
}
