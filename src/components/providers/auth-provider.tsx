"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchOrCreateProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchOrCreateProfile(session.user);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchOrCreateProfile(authUser: User) {
    // Try to fetch existing profile
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (existingProfile) {
      setProfile(existingProfile);
      setIsLoading(false);
      return;
    }

    // Profile doesn't exist, create one
    const userMeta = authUser.user_metadata || {};
    const email = authUser.email || "";
    const defaultUsername = userMeta.name || userMeta.full_name || email.split("@")[0] || `user_${authUser.id.slice(0, 8)}`;
    
    const { data: newProfile, error } = await supabase
      .from("profiles")
      .insert({
        id: authUser.id,
        username: defaultUsername,
        full_name: userMeta.full_name || userMeta.name || null,
        avatar_url: userMeta.avatar_url || userMeta.picture || null,
        fetched_url: userMeta.avatar_url || userMeta.picture || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create profile:", error);
      // If creation fails (e.g., username conflict), try with a unique username
      const { data: retryProfile } = await supabase
        .from("profiles")
        .insert({
          id: authUser.id,
          username: `user_${authUser.id.slice(0, 8)}`,
          full_name: userMeta.full_name || userMeta.name || null,
          avatar_url: userMeta.avatar_url || userMeta.picture || null,
          fetched_url: userMeta.avatar_url || userMeta.picture || null,
        })
        .select()
        .single();
      
      setProfile(retryProfile);
    } else {
      setProfile(newProfile);
    }
    
    setIsLoading(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


