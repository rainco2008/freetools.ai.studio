import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { User, auth, signInWithGoogle, signInWithGoogleOneTapToken, signOutUser, firebaseConfig } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            prompt_parent_id?: string;
          }) => void;
          prompt: (notification?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          revoke: (hint: string, done: () => void) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  authError: string | null;
  loginWithGoogle: () => Promise<User | void>;
  logout: () => Promise<void>;
  promptOneTap: () => void;
  clearAuthError: () => void;
  oneTapSupported: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signingIn: false,
  authError: null,
  loginWithGoogle: async () => {},
  logout: async () => {},
  promptOneTap: () => {},
  clearAuthError: () => {},
  oneTapSupported: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [gsiLoaded, setGsiLoaded] = useState(false);

  const clearAuthError = () => setAuthError(null);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Dynamically load Google Identity Services (GIS) library for One Tap
  useEffect(() => {
    if (window.google?.accounts?.id) {
      setGsiLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGsiLoaded(true);
    };
    script.onerror = () => {
      console.warn("Failed to load Google Identity Services script");
    };
    document.head.appendChild(script);
  }, []);

  // Callback handler for Google One Tap token
  const handleOneTapResponse = useCallback(async (response: { credential: string }) => {
    if (!response.credential) return;
    try {
      await signInWithGoogleOneTapToken(response.credential);
    } catch (err) {
      console.error("Failed Google One Tap sign-in:", err);
    }
  }, []);

  // Trigger One Tap Prompt
  const promptOneTap = useCallback(() => {
    const clientId = firebaseConfig.oAuthClientId;
    if (!clientId || !window.google?.accounts?.id || user) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleOneTapResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log("One Tap not displayed reason:", notification.getNotDisplayedReason());
        } else if (notification.isSkippedMoment()) {
          console.log("One Tap skipped reason:", notification.getSkippedReason());
        } else if (notification.isDismissedMoment()) {
          console.log("One Tap dismissed reason:", notification.getDismissedReason());
        }
      });
    } catch (e) {
      console.error("Error initializing Google One Tap:", e);
    }
  }, [user, handleOneTapResponse]);

  // Auto-prompt One Tap when GIS library loads and user is NOT logged in
  useEffect(() => {
    if (!loading && !user && gsiLoaded) {
      // Short delay to allow smooth page mount
      const timer = setTimeout(() => {
        promptOneTap();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loading, user, gsiLoaded, promptOneTap]);

  const loginWithGoogle = async () => {
    setSigningIn(true);
    setAuthError(null);

    // Timeout safety in case browser iframe storage partitioning silently blocks popup callback
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error("POPUP_TIMEOUT"));
      }, 15000);
    });

    try {
      const loggedUser = await Promise.race([
        signInWithGoogle(),
        timeoutPromise
      ]);
      setSigningIn(false);
      return loggedUser;
    } catch (error: any) {
      setSigningIn(false);
      console.error("Google sign in error:", error);
      
      const errorCode = error?.code || "";
      const errorMessage = error?.message || "";
      let friendlyMessage = "Google 登录失败，请重试。";

      if (errorMessage === "POPUP_TIMEOUT") {
        friendlyMessage = "登录弹窗未响应或被浏览器跨域 iframe 限制拦截。请点击右上角【在新标签页打开应用】进行登录。";
      } else if (errorCode === "auth/popup-blocked") {
        friendlyMessage = "登录弹窗被浏览器拦截。请允许此页面的弹出窗口，或在独立新标签页中打开应用。";
      } else if (errorCode === "auth/popup-closed-by-user") {
        friendlyMessage = "登录窗口已关闭。";
      } else if (errorCode === "auth/unauthorized-domain") {
        friendlyMessage = "当前域名未在 Firebase Auth 授权域名列表中。请在 Firebase 控制台中将当前域名添加为 Authorized Domain。";
      } else if (errorCode === "auth/operation-not-allowed") {
        friendlyMessage = "Firebase 控制台中未启用 Google 身份验证登录提供商。请在 Firebase 控制台开启 Google 登录。";
      } else if (errorMessage) {
        friendlyMessage = `登录出错: ${errorMessage}`;
      }

      setAuthError(friendlyMessage);
    }
  };

  const logout = async () => {
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
      await signOutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signingIn,
        authError,
        loginWithGoogle,
        logout,
        promptOneTap,
        clearAuthError,
        oneTapSupported: gsiLoaded && !!firebaseConfig.oAuthClientId,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
