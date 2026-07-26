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
            use_fedcm_for_prompt?: boolean;
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
    // Skip loading GIS if we are inside an iframe to prevent FedCM NotAllowedError
    if (window.self !== window.top) {
      return;
    }

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
        use_fedcm_for_prompt: false,
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
      let friendlyMessage = "Google sign-in failed. Please try again.";

      if (errorMessage === "POPUP_TIMEOUT") {
        friendlyMessage = "Sign-in popup did not respond or was blocked by browser iframe constraints. Click 'Open app in new tab' in top-right to sign in.";
      } else if (errorCode === "auth/popup-blocked") {
        friendlyMessage = "Sign-in popup was blocked by browser. Please allow popups or open the app in a new tab.";
      } else if (errorCode === "auth/popup-closed-by-user") {
        friendlyMessage = "Sign-in popup was closed.";
      } else if (errorCode === "auth/unauthorized-domain") {
        friendlyMessage = "Current domain is not authorized in Firebase Auth. Please add this domain to Authorized Domains in Firebase Console.";
      } else if (errorCode === "auth/operation-not-allowed") {
        friendlyMessage = "Google Sign-In is not enabled in Firebase Console. Please enable Google Sign-In in Firebase Console.";
      } else if (errorMessage) {
        friendlyMessage = `Sign-in error: ${errorMessage}`;
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
