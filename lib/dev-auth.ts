import { User } from '@supabase/supabase-js';
import { Profile } from './supabase';

// Dev user credentials
export const DEV_EMAIL = 'dev@tennispro.com';
export const DEV_PASSWORD = 'TennisPro2025!';

// Mock user object that mimics Supabase User structure
export const mockDevUser: User = {
  id: 'dev-user-id-123456789',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: DEV_EMAIL,
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

// Mock profile that mimics the Profile type from supabase.ts
export const mockDevProfile: Profile = {
  id: 'dev-profile-id-123456789',
  user_id: mockDevUser.id,
  full_name: 'Developer Account',
  avatar_url: '',
  membership_level: 'Premium',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Local storage key for dev auth state
export const DEV_AUTH_STORAGE_KEY = 'tennis_pro_dev_auth';

// Helper functions
export const isDevUser = (email: string) => email === DEV_EMAIL;

// Sync localStorage with cookies for middleware
export const syncDevAuthStateToCookies = () => {
  if (typeof window !== 'undefined') {
    const isDevAuth = getDevAuthState();
    if (isDevAuth) {
      document.cookie = `${DEV_AUTH_STORAGE_KEY}=true; path=/`;
    } else {
      document.cookie = `${DEV_AUTH_STORAGE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
};

export const storeDevAuthState = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEV_AUTH_STORAGE_KEY, 'true');
    syncDevAuthStateToCookies();
  }
};

export const clearDevAuthState = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEV_AUTH_STORAGE_KEY);
    syncDevAuthStateToCookies();
  }
};

export const getDevAuthState = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(DEV_AUTH_STORAGE_KEY) === 'true';
  }
  return false;
};
