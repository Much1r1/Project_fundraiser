import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, User } from '../lib/supabase';
import { Session, AuthError } from '@supabase/supabase-js';

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Admin emails from environment variable
const getAdminEmails = (): string[] => {
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS || 'admin@fundrise.com';
  return adminEmails.split(',').map((email: string) => email.trim().toLowerCase());
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user.id, session.user.email);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user.id, session.user.email);
      } else {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string, email: string | undefined) => {
    try {
      setLoading(true);
      
      // First check if user profile exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is "not found" error, which is expected for new users
        throw fetchError;
      }

      let userData = existingUser;

      // If user doesn't exist, create profile
      if (!existingUser && email) {
        console.log('Creating user profile for:', email);
        
        const adminEmails = getAdminEmails();
        const userRole = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';
        
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            email,
            full_name: email.split('@')[0], // Default name from email
            role: userRole,
            verification_status: 'pending',
            wallet_balance: 0,
            is_active: true,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          throw insertError;
        }

        userData = newUser;
      }

      if (userData) {
        setUser(userData);
        
        // Check if user is admin
        const adminEmails = getAdminEmails();
        const userIsAdmin = adminEmails.includes(userData.email.toLowerCase()) || userData.role === 'admin';
        setIsAdmin(userIsAdmin);
        
        // Update role in database if needed
        if (userIsAdmin && userData.role !== 'admin') {
          await supabase
            .from('users')
            .update({ role: 'admin' })
            .eq('id', userId);
        }
      }
    } catch (error) {
      console.error('Error fetching/creating user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Registration failed - no user returned');
      }

      // Create user profile immediately
      const adminEmails = getAdminEmails();
      const userRole = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';
      
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          full_name: name,
          role: userRole,
          verification_status: 'pending',
          wallet_balance: 0,
          is_active: true,
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Don't throw here as the auth user was created successfully
      }

      // If email confirmation is disabled, the user should be automatically signed in
      // If not, we need to sign them in manually
      if (!data.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.error('Auto sign-in after registration failed:', signInError);
          // Don't throw here as registration was successful
        }
      }

    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('Login failed - no user returned');
      }

      // The auth state change listener will handle fetching the profile
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const value = {
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
}