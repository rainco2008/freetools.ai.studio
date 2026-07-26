import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  auth,
  firebaseConfig,
  signInWithGoogle,
  signInWithGoogleOneTapToken,
  signOutUser,
  User,
} from "../lib/firebase";

interface CredentialResponse {
  credential?: string;
}

interface GoogleIdentityApi {
  initialize: (config: {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: "signin" | "signup" | "use";
    itp_support?: boolean;
  }) => void;
  prompt: () => void;
  disableAutoSelect: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleIdentityApi;
      };
    };
  }
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  authError: string | null;
  oneTapSupported: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function friendlyAuthError(error: unknown) {
  const authError = error as { code?: string; message?: string };
  switch (authError.code) {
    case "auth/popup-blocked":
      return "The sign-in popup was blocked by your browser.";
    case "auth/popup-closed-by-user":
      return "The sign-in popup was closed before sign-in completed.";
    case "auth/unauthorized-domain":
      return `Google sign-in is not authorized for ${window.location.hostname}.`;
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled for this Firebase project.";
    default:
      return authError.message || "Google sign-in failed. Please try again.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const initializedRef = useRef(false);
  const promptedRef = useRef(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      }),
    [],
  );

  useEffect(() => {
    if (window.self !== window.top || !firebaseConfig.oAuthClientId) return;
    if (window.google?.accounts?.id) {
      setGsiLoaded(true);
      return;
    }

    const scriptId = "google-identity-services";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    const handleLoad = () => setGsiLoaded(true);
    const handleError = () => setAuthError("Google Identity Services could not be loaded.");

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    return () => {
      script?.removeEventListener("load", handleLoad);
      script?.removeEventListener("error", handleError);
    };
  }, []);

  const handleCredential = useCallback(async (response: CredentialResponse) => {
    if (!response.credential) return;
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInWithGoogleOneTapToken(response.credential);
    } catch (error) {
      setAuthError(friendlyAuthError(error));
    } finally {
      setSigningIn(false);
    }
  }, []);

  useEffect(() => {
    const identity = window.google?.accounts?.id;
    if (!gsiLoaded || !identity || !firebaseConfig.oAuthClientId || initializedRef.current) return;

    identity.initialize({
      client_id: firebaseConfig.oAuthClientId,
      callback: handleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: "signin",
      itp_support: true,
    });
    initializedRef.current = true;
  }, [gsiLoaded, handleCredential]);

  useEffect(() => {
    if (
      loading ||
      user ||
      !initializedRef.current ||
      promptedRef.current ||
      !window.google?.accounts?.id
    ) {
      return;
    }

    promptedRef.current = true;
    const timer = window.setTimeout(() => window.google?.accounts?.id?.prompt(), 900);
    return () => window.clearTimeout(timer);
  }, [loading, user, gsiLoaded]);

  const loginWithGoogle = async () => {
    setSigningIn(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      setAuthError(friendlyAuthError(error));
    } finally {
      setSigningIn(false);
    }
  };

  const logout = async () => {
    setAuthError(null);
    window.google?.accounts?.id?.disableAutoSelect();
    await signOutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signingIn,
        authError,
        oneTapSupported: gsiLoaded && Boolean(firebaseConfig.oAuthClientId),
        loginWithGoogle,
        logout,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
