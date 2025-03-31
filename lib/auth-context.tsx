"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, Profile } from './supabase';
import { useRouter } from 'next/navigation';
import {
  DEV_EMAIL,
  DEV_PASSWORD,
  mockDevUser,
  mockDevProfile,
  isDevUser,
  storeDevAuthState,
  clearDevAuthState,
  getDevAuthState,
  syncDevAuthStateToCookies
} from './dev-auth';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Sync dev auth state to cookies on mount
    if (getDevAuthState()) {
      syncDevAuthStateToCookies();
    }

    // Check for dev auth state first
    if (getDevAuthState()) {
      setUser(mockDevUser);
      setProfile(mockDevProfile);
      setSession({ user: mockDevUser } as Session);
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Skip if dev auth is active
        if (getDevAuthState()) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data as Profile);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    // Don't allow signing up with dev email
    if (isDevUser(email)) {
      return { error: { message: "Cannot create account with this email" } };
    }
    
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    setIsLoading(false);
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Check for dev credentials
    if (email === DEV_EMAIL && password === DEV_PASSWORD) {
      // Set up dev user session
      setUser(mockDevUser);
      setProfile(mockDevProfile);
      setSession({ user: mockDevUser } as Session);
      storeDevAuthState();
      setIsLoading(false);
      return { error: null };
    }
    
    // Original signIn code for non-dev users
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setIsLoading(false);
    return { error };
  };

  const signOut = async () => {
    // Check if it's the dev user
    if (getDevAuthState()) {
      clearDevAuthState();
      setUser(null);
      setProfile(null);
      setSession(null);
      router.push('/');
      return;
    }
    
    // Original signOut code
    await supabase.auth.signOut();
    router.push('/');
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
