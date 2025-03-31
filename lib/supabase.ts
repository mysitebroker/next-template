import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in a .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type MembershipLevel = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  is_invite_only: boolean;
};

export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string;
  membership_level: string;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  membership_level: string;
  status: 'active' | 'canceled' | 'past_due';
  current_period_end: string;
  created_at: string;
  updated_at: string;
};

export type Payment = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed';
  payment_method: string;
  created_at: string;
};
