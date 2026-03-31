"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";

export type UserRole = "admin" | "member" | null;

interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  avatar_url?: string | null;
}

interface AuthState {
  user: Profile | null;
  profile: Profile | null;
  role: UserRole;
  loading: boolean;
  isAdmin: boolean;
  isMember: boolean;
  isLoggedIn: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, setAuth, logout } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      // In the new backend, the profile data is usually returned directly in the JWT payload/user object
      // But we can fetch it explicitly from a /profiles/:id endpoint if needed.
      // For now, we sync it directly from the Zustand user state which comes from standard login/refresh
      const { data } = await apiClient.get(`/profiles/${userId}`);
      if (data) {
        setProfile(data as Profile);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
  }, []);

  // Run once on mount to restore session via HTTP-Only cookie refresh token
  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated) {
        if (user) await fetchProfile(user.id);
        setLoading(false);
        return;
      }

      try {
        const { data } = await apiClient.post("/auth/refresh");
        setAuth(data.accessToken, data.user);
        setProfile(data.user);
      } catch (error) {
        logout();
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [isAuthenticated, user, fetchProfile, setAuth, logout]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await apiClient.post("/auth/sign-in", { email, password });
      setAuth(data.accessToken, data.user);
      setProfile(data.user);
      return {};
    } catch (error: any) {
      if (error.response?.status === 401) {
        return { error: "Email hoặc mật khẩu không đúng" };
      }
      return { error: error.response?.data?.message || "Đã xảy ra lỗi đăng nhập" };
    }
  }, [setAuth]);

  const signUp = useCallback(
    async (email: string, password: string, firstName: string, lastName: string) => {
      try {
        await apiClient.post("/auth/sign-up", {
          email,
          password,
          firstName,
          lastName,
        });
        return {};
      } catch (error: any) {
        if (error.response?.status === 409) {
          return { error: "Email đã được đăng ký. Hãy đăng nhập." };
        }
        return { error: error.response?.data?.message || "Lỗi đăng ký" };
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      await apiClient.post("/auth/sign-out");
    } catch (error) {
      console.error("Sign-out error", error);
    } finally {
      logout();
      setProfile(null);
    }
  }, [logout]);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const role = profile?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        user: user as Profile | null,
        profile,
        role,
        loading,
        isAdmin: role === "admin",
        isMember: role === "member" || role === "admin",
        isLoggedIn: isAuthenticated,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
