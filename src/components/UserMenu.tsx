import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ChevronDown, Loader2, LogOut, UserRound, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Locale } from "../freeToolsCatalog";

const copy = {
  zh: {
    signIn: "Google 登录",
    signingIn: "登录中",
    signOut: "退出登录",
    signedIn: "已通过 Google 登录",
    oneTap: "支持 Google One Tap",
    error: "登录失败",
    close: "关闭提示",
  },
  en: {
    signIn: "Sign in",
    signingIn: "Signing in",
    signOut: "Sign out",
    signedIn: "Signed in with Google",
    oneTap: "Google One Tap enabled",
    error: "Sign-in failed",
    close: "Close message",
  },
};

export default function UserMenu({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const {
    user,
    loading,
    signingIn,
    authError,
    oneTapSupported,
    loginWithGoogle,
    logout,
    clearAuthError,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  if (loading) {
    return <div className="h-10 w-10 animate-pulse rounded-md bg-[#E9E5DE]" aria-hidden="true" />;
  }

  if (!user) {
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => void loginWithGoogle()}
          disabled={signingIn}
          className="flex h-10 items-center gap-2 rounded-md border border-[#D8D3CA] bg-white px-3 text-xs font-bold text-[#1A1A1A] transition hover:border-[#1A1A1A] disabled:cursor-wait disabled:opacity-60"
        >
          {signingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleMark />}
          <span className="hidden xl:inline">{signingIn ? t.signingIn : t.signIn}</span>
        </button>
        {authError && (
          <div
            role="alert"
            className="fixed right-4 top-20 z-[70] w-[min(92vw,380px)] rounded-lg border border-[#E64833] bg-white p-4 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#E64833]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[#1A1A1A]">{t.error}</p>
                <p className="mt-1 break-words text-xs leading-5 text-[#6F6B65]">{authError}</p>
              </div>
              <button type="button" onClick={clearAuthError} aria-label={t.close}>
                <X className="h-4 w-4 text-[#8C8984]" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  const displayName = user.displayName || user.email?.split("@")[0] || "User";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-2 rounded-md border border-[#D8D3CA] bg-white px-2 text-xs font-bold text-[#1A1A1A] hover:border-[#1A1A1A]"
        aria-expanded={open}
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            className="h-7 w-7 rounded-full object-cover"
          />
        ) : (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#1A1A1A] text-white">
            <UserRound className="h-3.5 w-3.5" />
          </span>
        )}
        <span className="hidden max-w-24 truncate xl:block">{displayName}</span>
        <ChevronDown className={`hidden h-3.5 w-3.5 text-[#8C8984] xl:block ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-[70] w-64 rounded-lg border border-[#1A1A1A] bg-white p-4 shadow-xl">
          <p className="truncate text-sm font-bold text-[#1A1A1A]">{displayName}</p>
          <p className="mt-0.5 truncate text-xs text-[#8C8984]">{user.email}</p>
          <div className="mt-4 rounded-md bg-[#F5F2EC] p-3 text-xs leading-5 text-[#5C5955]">
            <div>{t.signedIn}</div>
            {oneTapSupported && <div>{t.oneTap}</div>}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              void logout();
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-[#E64833] px-3 py-2 text-xs font-bold text-[#E64833] hover:bg-[#FFF1ED]"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t.signOut}
          </button>
        </div>
      )}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2.1-2 3.3-4.8 3.3-8.2Z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1a6.5 6.5 0 0 1-6.2-4.5H2.2V17A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.2a11 11 0 0 0 0 10l3.6-2.9Z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.5 4.2 1.6l3.2-3.1A10.7 10.7 0 0 0 12 1a11 11 0 0 0-9.8 6l3.6 2.9A6.5 6.5 0 0 1 12 5.4Z" />
    </svg>
  );
}
