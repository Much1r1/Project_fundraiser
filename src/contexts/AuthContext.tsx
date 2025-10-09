import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// helper
const getAdminEmails = (): string[] => {
  const env = import.meta.env.VITE_ADMIN_EMAILS || "admin@fundrise.com";
  return env.split(",").map((e: string) => e.trim().toLowerCase());
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔹 Fetch or create user profile
  const fetchUserProfile = async (userId: string, email?: string) => {
    try {
      const { data: existingUser, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      let profile = existingUser;
      if (!existingUser && email) {
        const adminEmails = getAdminEmails();
        const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "user";

        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            id: userId,
            email,
            full_name: email.split("@")[0],
            role,
            verification_status: "pending",
            wallet_balance: 0,
            is_active: true,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        profile = newUser;
      }

      if (profile) {
        setUser(profile);
        const adminEmails = getAdminEmails();
        const isAdminUser = adminEmails.includes(profile.email.toLowerCase()) || profile.role === "admin";
        setIsAdmin(isAdminUser);

        // Keep DB in sync
        if (isAdminUser && profile.role !== "admin") {
          await supabase.from("users").update({ role: "admin" }).eq("id", userId);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching/creating user profile:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initialize session & listen for changes
  useEffect(() => {
    const initAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("Session error:", error);
      setSession(data.session ?? null);

      if (data.session?.user) {
        await fetchUserProfile(data.session.user.id, data.session.user.email);
      } else setLoading(false);
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🌀 Auth state changed:", event, session?.user?.email);
      setSession(session ?? null);

      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email);
        await fetchUserProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔹 Register user
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) throw error;

      if (data.user) {
        const adminEmails = getAdminEmails();
        const role = adminEmails.includes(email.toLowerCase()) ? "admin" : "user";
        await supabase.from("users").upsert({
          id: data.user.id,
          email,
          full_name: name,
          role,
          verification_status: "verified",
          wallet_balance: 0,
          is_active: true,
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Login user
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      if (data.session?.user) await fetchUserProfile(data.session.user.id, data.session.user.email);
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google login
  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google login error:", err);
      throw err;
    }
  };

  // 🔹 Logout
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAdmin,
    login,
    register,
    logout,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
