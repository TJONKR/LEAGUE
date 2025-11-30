"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, AuthChangeEvent } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  needsOnboarding: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  needsOnboarding: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  
  // Use singleton client - memoized to prevent recreation
  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(async (authUser: User) => {
    try {
      const { data: existingProfile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("auth_id", authUser.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows found, which is expected for new users
        console.error("Error fetching profile:", error);
      }

      if (existingProfile) {
        setProfile(existingProfile);
        setNeedsOnboarding(false);
      } else {
        setProfile(null);
        setNeedsOnboarding(true);
      }
    } catch (err) {
      console.error("Error in fetchProfile:", err);
      setProfile(null);
      setNeedsOnboarding(true);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        // Use getUser() instead of getSession() - it validates with the server
        // This is more secure and ensures the token is valid
        const { data: { user: authUser }, error } = await supabase.auth.getUser();
        
        if (error) {
          // AuthSessionMissingError is expected when not logged in
          if (error.name !== "AuthSessionMissingError") {
            console.error("Error getting user:", error);
          }
        }

        if (!mounted) return;

        if (authUser) {
          setUser(authUser);
          await fetchProfile(authUser);
        } else {
          setUser(null);
          setProfile(null);
          setNeedsOnboarding(false);
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      if (!mounted) return;

      // Handle sign out
      if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setNeedsOnboarding(false);
        setIsLoading(false);
        return;
      }

      // Handle sign in or session update
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user);
        }
      }
      
      // Handle initial session load
      if (event === "INITIAL_SESSION" && session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      }
    });

    // Set up periodic session refresh (every 4 minutes)
    // This helps keep the session alive before the token expires
    const refreshInterval = setInterval(async () => {
      if (!mounted) return;
      const { data: { user: refreshedUser } } = await supabase.auth.getUser();
      if (refreshedUser && mounted) {
        setUser(refreshedUser);
      }
    }, 4 * 60 * 1000); // 4 minutes

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [fetchProfile, supabase.auth]);

  async function refreshProfile() {
    if (!user) return;
    setIsLoading(true);
    await fetchProfile(user);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setNeedsOnboarding(false);
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, needsOnboarding, signOut, refreshProfile }}>
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
