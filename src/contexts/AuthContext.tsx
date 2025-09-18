import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co',
  process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'
);

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin' | 'campaigner' | 'donor';
  streakCount: number;
  badges: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user for demo
    const mockUser = {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      role: 'user' as const,
      streakCount: 7,
      badges: ['First Donation', 'Week Streak', 'Helper'],
    };
    setUser(mockUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login with admin support
    let mockUser;
    
    if (email === 'admin@fundrise.com' && password === 'admin123') {
      mockUser = {
        id: 'admin-1',
        email: 'admin@fundrise.com',
        name: 'Admin User',
        role: 'admin' as const,
        streakCount: 30,
        badges: ['Admin', 'Super User', 'Platform Guardian', 'Analytics Master'],
      };
    } else {
      mockUser = {
        id: '1',
        email,
        name: email === 'demo@fundrise.com' ? 'Demo User' : 'User',
        role: 'user' as const,
        streakCount: 7,
        badges: ['First Donation', 'Week Streak', 'Helper'],
      };
    }
    
    setUser(mockUser);
  };

  const register = async (email: string, password: string, name: string) => {
    // Mock register
    const mockUser = {
      id: '1',
      email,
      name,
      role: 'user' as const,
      streakCount: 0,
      badges: [],
    };
    setUser(mockUser);
  };

  const logout = async () => {
    setUser(null);
  };

  const loginWithGoogle = async () => {
    // Mock Google login
    const mockUser = {
      id: '1',
      email: 'demo@gmail.com',
      name: 'Demo User',
      role: 'user' as const,
      streakCount: 7,
      badges: ['First Donation', 'Week Streak', 'Helper'],
    };
    setUser(mockUser);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}