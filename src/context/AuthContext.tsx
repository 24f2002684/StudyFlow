import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  signInWithPopup,
  signInWithRedirect,
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
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_MOCK_USER_KEY = 'mudichu_mock_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync / create user profile document in Firestore
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
      console.warn('Could not sync user profile to Firestore:', err);
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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
        };
        setUser(profile);
        await syncUserToFirestore(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
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
      return;
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
        await syncUserToFirestore(result.user);
      }
    } catch (err: unknown) {
      const authErr = err as { code?: string; message?: string };
      // Popup blocked -> Fallback to redirect flow
      if (authErr?.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          console.error('Redirect sign-in error:', redirectErr);
          setError('Could not open Google sign-in. Please allow popups for this site.');
        }
      } else if (
        authErr?.code === 'auth/popup-closed-by-user' ||
        authErr?.code === 'auth/cancelled-popup-request'
      ) {
        // Silently reset, user voluntarily closed the window
        return;
      } else if (authErr?.code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(authErr?.message || 'Failed to sign in with Google. Please try again.');
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
