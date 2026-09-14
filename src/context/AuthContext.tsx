import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured } from '../firebase/config';

export interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<UserProfile | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_MOCK_USER_KEY = 'mudichu_mock_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync / create user profile document in Firestore (non-blocking background task)
  const syncUserToFirestore = async (firebaseUser: User) => {
    if (!db) return;
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          name: firebaseUser.displayName || 'Student',
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        });
      } else {
        await setDoc(
          userRef,
          {
            name: firebaseUser.displayName || 'Student',
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.warn('[MUDICHU] Firestore profile sync note (non-critical):', err);
    }
  };

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Check local mock user if Firebase is not yet configured
      const savedMock = localStorage.getItem(LOCAL_STORAGE_MOCK_USER_KEY);
      if (savedMock) {
        try {
          setUser(JSON.parse(savedMock));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
      return;
    }

    // 1. Check for redirect flow result (e.g. mobile or popup-blocked browsers)
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          const profile: UserProfile = {
            uid: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
          };
          setUser(profile);
          syncUserToFirestore(result.user).catch((err) => {
            console.warn('Background sync failed after redirect:', err);
          });
        }
      })
      .catch((err) => {
        console.error('[MUDICHU] Redirect auth result error:', err);
        if (err?.code === 'auth/unauthorized-domain') {
          setError(
            `Firebase Authorized Domain Error: '${window.location.hostname}' is not authorized in Firebase Console > Authentication > Settings > Authorized domains.`
          );
        } else {
          setError(err?.message || 'Error processing Google redirect sign-in.');
        }
      });

    // 2. Listen to active auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(profile);
        setLoading(false);
        // Sync profile non-blockingly so navigation is instant
        syncUserToFirestore(firebaseUser).catch((err) => {
          console.warn('Background Firestore profile sync failed:', err);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<UserProfile | null> => {
    setError(null);

    // If Firebase is not configured in .env, provide an instant demo login
    if (!isFirebaseConfigured || !auth) {
      const mockProfile: UserProfile = {
        uid: 'demo-student-uid',
        name: 'Suhail Akthar',
        email: 'suhail@college.edu',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      };
      setUser(mockProfile);
      localStorage.setItem(LOCAL_STORAGE_MOCK_USER_KEY, JSON.stringify(mockProfile));
      return mockProfile;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const profile: UserProfile = {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        };
        setUser(profile);
        // Non-blocking firestore sync so navigation to /app is immediate
        syncUserToFirestore(result.user).catch((err) => {
          console.warn('Firestore profile sync error (non-blocking):', err);
        });
        return profile;
      }
      return null;
    } catch (err: unknown) {
      const authErr = err as { code?: string; message?: string };
      console.error('[MUDICHU] Firebase signInWithPopup error code:', authErr?.code, authErr?.message);

      // Popup blocked or not supported -> Fallback to redirect flow
      if (
        authErr?.code === 'auth/popup-blocked' ||
        authErr?.code === 'auth/cancelled-popup-request' ||
        authErr?.code === 'auth/operation-not-supported-in-this-environment'
      ) {
        try {
          console.info('[MUDICHU] Falling back to signInWithRedirect...');
          await signInWithRedirect(auth, googleProvider);
          return null;
        } catch (redirectErr) {
          console.error('[MUDICHU] Redirect sign-in error:', redirectErr);
          setError('Could not open Google sign-in. Please allow popups or cookies for this site.');
          return null;
        }
      } else if (authErr?.code === 'auth/popup-closed-by-user') {
        // Silently reset, user voluntarily closed the window
        return null;
      } else if (authErr?.code === 'auth/unauthorized-domain') {
        const domainMsg = `Domain not authorized: '${window.location.hostname}' must be added in Firebase Console > Authentication > Settings > Authorized domains.`;
        console.error(domainMsg);
        setError(domainMsg);
        return null;
      } else if (authErr?.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
        return null;
      } else {
        setError(authErr?.message || 'Failed to sign in with Google. Please try again.');
        return null;
      }
    }
  };

  const logout = async () => {
    setError(null);
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Logout error:', err);
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_MOCK_USER_KEY);
    setUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
