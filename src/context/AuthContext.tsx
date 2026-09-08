import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth, googleAuthProvider } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      },
      (err) => {
        console.error("Auth state change error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getIdToken = async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken();
    } catch (err) {
      console.error("Error fetching ID token:", err);
      return null;
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err: any) {
      console.error("Sign in error:", err);
      let userFriendlyMessage = "Googleログインに失敗しました。";
      if (err.code === "auth/unauthorized-domain") {
        const currentDomain = window.location.hostname;
        userFriendlyMessage = `このドメイン（${currentDomain}）がFirebaseの「承認済みドメイン」に追加されていません。Firebase Console の「Authentication」→「Settings」→「Authorized domains」に「${currentDomain}」を追加してください。`;
      } else if (err.code === "auth/popup-closed-by-user") {
        userFriendlyMessage = "ログインポップアップが閉じられました。";
      } else if (err.code === "auth/popup-blocked") {
        userFriendlyMessage = "ブラウザによってポップアップがブロックされました。ポップアップを許可して再度お試しください。";
      } else if (err.message) {
        userFriendlyMessage = `ログインエラー: ${err.message}`;
      }
      setError(userFriendlyMessage);
      throw err;
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err: any) {
      console.error("Sign out error:", err);
      setError(err.message || "ログアウトに失敗しました");
    }
  };

  const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = await getIdToken();
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return fetch(url, {
      ...options,
      headers,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        signOut,
        getIdToken,
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
