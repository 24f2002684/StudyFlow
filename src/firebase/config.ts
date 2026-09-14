import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import type { Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_API_KEY'
);

// Masked diagnostic log to verify production environment variables
if (typeof window !== 'undefined') {
  const maskedKey = firebaseConfig.apiKey
    ? `${firebaseConfig.apiKey.slice(0, 6)}...${firebaseConfig.apiKey.slice(-4)}`
    : 'MISSING/UNDEFINED';

  console.log('[MUDICHU] Firebase Env Diagnostic:', {
    apiKey: maskedKey,
    authDomain: firebaseConfig.authDomain || 'MISSING/UNDEFINED',
    projectId: firebaseConfig.projectId || 'MISSING/UNDEFINED',
    storageBucket: firebaseConfig.storageBucket || 'MISSING/UNDEFINED',
    messagingSenderId: firebaseConfig.messagingSenderId || 'MISSING/UNDEFINED',
    hasAppId: Boolean(firebaseConfig.appId),
    isConfigured: isFirebaseConfigured,
    hostname: window.location.hostname,
  });
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    
    // Explicitly set persistence to browserLocalPersistence
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Could not set auth persistence to browserLocalPersistence:', err);
    });
  } catch (err) {
    console.warn('Firebase initialization notice: Falling back to local mode.', err);
    db = null;
    auth = null;
  }
}

export { db, auth, googleProvider };
