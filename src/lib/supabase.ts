import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get current user ID
export const getCurrentUserId = () => {
  return supabase.auth.getUser().then(({ data: { user } }) => user?.id);
};

// Database types
export interface Campaign {
  id: string;
  user_id: string;
  title: string;
  description: string;
  story: string;
  goal_amount: number;
  current_amount: number;
  category: string;
  location: string;
  image_url: string;
  video_url?: string;
  campaign_status: 'draft' | 'active' | 'paused' | 'completed' | 'rejected';
  verification_status: 'pending' | 'verified' | 'rejected' | 'unverified';
  end_date: string;
  created_at: string;
  updated_at: string;
  users: {
    full_name: string;
    avatar_url?: string;
    verification_status: string;
  };
}

export interface Donation {
  id: string;
  donor_id?: string;
  campaign_id: string;
  amount: number;
  payment_method: 'mpesa' | 'paypal' | 'card';
  payment_reference: string;
  is_anonymous: boolean;
  donor_message?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | 'chargeback' | 'successful';
  created_at: string;
  users?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  bio?: string;
  avatar_url?: string;
  role: 'user' | 'admin' | 'campaigner' | 'donor';
  wallet_balance: number;
  verification_status: 'pending' | 'verified' | 'rejected' | 'unverified';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}