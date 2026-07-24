import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithCredential, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from "firebase/firestore";
import firebaseConfigData from "../../firebase-applet-config.json";

export const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
  oAuthClientId: (firebaseConfigData as any).oAuthClientId,
};

// Initialize Firebase App lazily or singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Initialize Firestore with custom database ID if provided
const cfgAny = firebaseConfigData as Record<string, any>;
const databaseId = cfgAny.firestoreDatabaseId && cfgAny.firestoreDatabaseId !== "(default)"
  ? cfgAny.firestoreDatabaseId
  : undefined;

export const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

/**
 * Sign in using Google One Tap ID Token
 */
export async function signInWithGoogleOneTapToken(idToken: string) {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const result = await signInWithCredential(auth, credential);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google One Tap credential:", error);
    throw error;
  }
}

/**
 * Sign out user
 */
export async function signOutUser() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

export type { User };
