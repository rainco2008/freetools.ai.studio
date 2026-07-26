import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { firebaseConfig } from "../lib/firebase";
import { LogOut, User as UserIcon, Cloud, Sparkles, ChevronDown, CheckCircle2, Shield, Loader2, AlertTriangle, ExternalLink, X } from "lucide-react";

export function UserMenu() {
  const { 
    user, 
    loading, 
    signingIn, 
    authError, 
    clearAuthError, 
    loginWithGoogle, 
    logout, 
    promptOneTap, 
    oneTapSupported 
  } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="h-8 w-24 bg-[#EAE6DF] animate-pulse rounded border border-[#D1CEC7]" />
    );
  }

  if (!user) {
    return (
      <div className="relative flex items-center gap-2">
        {/* Error notification banner / popup */}
        {authError && (
          <div className="fixed top-16 right-4 max-w-md bg-white border-2 border-[#E64833] p-4 shadow-xl z-50 font-mono text-xs text-[#1A1A1A] space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-[#E64833] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Sign-In Restricted</span>
              </div>
              <button 
                onClick={clearAuthError} 
                className="text-[#8C8984] hover:text-[#1A1A1A] p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs leading-relaxed text-[#5C5955]">
              {authError}
            </p>

            {/* Current Domain Helper */}
            <div className="bg-[#F5F2EC] p-2.5 border border-[#D1CEC7] space-y-1.5">
              <div className="text-xs text-[#8C8984] uppercase tracking-wider font-bold">Domain to Authorize:</div>
              <div className="flex items-center justify-between gap-2 font-bold text-[#1A1A1A] select-all break-all">
                <span className="text-xs">{window.location.hostname}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.hostname);
                    alert(`Domain copied: ${window.location.hostname}\nPlease paste it in Firebase Console -> Authentication -> Settings -> Authorized Domains`);
                  }}
                  className="px-2.5 py-1 bg-[#1A1A1A] text-white text-xs hover:bg-black uppercase tracking-wider shrink-0 cursor-pointer"
                >
                  Copy Domain
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[#EAE6DF]">
              <a
                href={`https://console.firebase.google.com/u/0/project/${firebaseConfig.projectId}/authentication/settings`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#1A1A1A] text-white hover:bg-black transition-colors text-xs uppercase font-bold tracking-wider"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Firebase Console
              </a>
              <button
                onClick={() => {
                  clearAuthError();
                  loginWithGoogle();
                }}
                className="px-3 py-2 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#F5F2EC] text-xs uppercase font-bold tracking-wider cursor-pointer"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => loginWithGoogle()}
          disabled={signingIn}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 border border-[#1A1A1A] bg-white text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all text-[11px] sm:text-xs font-mono uppercase tracking-wider font-bold shadow-xs cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {signingIn ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#E64833]" />
          ) : (
            /* Google Color G Icon */
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          {signingIn ? "Signing In..." : "Sign In"}
        </button>

        {oneTapSupported && (
          <button
            onClick={() => promptOneTap()}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-[#8C8984] hover:text-[#1A1A1A] transition-colors uppercase tracking-wider cursor-pointer"
            title="Google One Tap quick sign-in enabled"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E64833]" />
            One Tap
          </button>
        )}
      </div>
    );
  }

  const displayName = user.displayName || user.email?.split("@")[0] || "User";
  const photoURL = user.photoURL;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 border border-[#D1CEC7] bg-white hover:bg-[#F5F2EC] transition-colors cursor-pointer"
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt={displayName}
            className="w-6 h-6 rounded-full object-cover border border-[#D1CEC7]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-[11px] font-mono font-medium text-[#1A1A1A] max-w-[100px] truncate hidden sm:inline">
          {displayName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#8C8984] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-[#1A1A1A] shadow-lg z-50 p-3 space-y-3 font-mono text-xs">
          {/* User Info Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-[#EAE6DF]">
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border border-[#D1CEC7]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-sm font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="overflow-hidden">
              <div className="font-bold text-[#1A1A1A] truncate">{displayName}</div>
              <div className="text-[10px] text-[#8C8984] truncate">{user.email}</div>
            </div>
          </div>

          {/* Sync Status Badge */}
          <div className="flex items-center justify-between text-[10px] bg-[#F5F2EC] px-2.5 py-1.5 border border-[#D1CEC7] text-[#5C5955]">
            <span className="flex items-center gap-1.5 font-bold text-[#1A1A1A]">
              <Cloud className="w-3.5 h-3.5 text-[#2E7D32]" />
              Cloud Sync Active
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#8C8984]">Firestore</span>
          </div>

          {/* Account Details */}
          <div className="space-y-1.5 text-[10px] text-[#5C5955]">
            <div className="flex justify-between py-1 border-b border-[#F5F2EC]">
              <span className="text-[#8C8984]">Auth Provider</span>
              <span className="font-bold text-[#1A1A1A] flex items-center gap-1">
                <Shield className="w-3 h-3 text-[#4285F4]" /> Google Auth
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#8C8984]">One Tap Status</span>
              <span className="font-bold text-[#2E7D32] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" /> Supported
              </span>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={() => {
              setDropdownOpen(false);
              logout();
            }}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2 border border-[#E64833] text-[#E64833] hover:bg-[#E64833] hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
