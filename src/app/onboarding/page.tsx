"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/components/providers/auth-provider";
import { Search, Loader2, User, ArrowRight, Check, Sparkles } from "lucide-react";
import type { Profile } from "@/types/database";

type OnboardingStep = "name" | "search" | "confirm";

export default function OnboardingPage() {
  const { user, profile, isLoading: isAuthLoading, needsOnboarding, refreshProfile } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<OnboardingStep>("name");
  const [fullName, setFullName] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Single effect to handle all redirect logic after auth loads
  useEffect(() => {
    if (isAuthLoading) return; // Wait for auth to finish

    // Not logged in → go to login
    if (!user) {
      router.replace("/login");
      return;
    }

    // Has profile already → go home
    if (profile) {
      router.replace("/");
      return;
    }

    // User is logged in but needs onboarding → show the form
    setIsReady(true);
  }, [isAuthLoading, user, profile, router]);

  // Pre-fill name from OAuth if available (only when ready)
  useEffect(() => {
    if (!isReady || !user) return;
    
    if (user.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    } else if (user.user_metadata?.name) {
      setFullName(user.user_metadata.name);
    }
  }, [isReady, user]);

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSearching(true);
    setError(null);

    // Search for profiles with similar names (unclaimed only - auth_id is null)
    const { data, error: searchError } = await supabase
      .from("profiles")
      .select("*")
      .is("auth_id", null)
      .ilike("full_name", `%${fullName.trim()}%`)
      .limit(10);

    if (searchError) {
      setError("Failed to search profiles");
      setIsSearching(false);
      return;
    }

    setSearchResults(data || []);
    setIsSearching(false);
    setStep("search");
  }

  async function handleClaimProfile(profileToClaim: Profile) {
    if (!user) return;
    setSelectedProfile(profileToClaim);
    setStep("confirm");
  }

  async function confirmClaim() {
    if (!user || !selectedProfile) return;

    setIsClaiming(true);
    setError(null);

    // Claim the profile by setting auth_id
    const { error: claimError } = await supabase
      .from("profiles")
      .update({ 
        auth_id: user.id,
        fetched_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || selectedProfile.fetched_url,
      })
      .eq("id", selectedProfile.id);

    if (claimError) {
      setError(claimError.message || "Failed to claim profile");
      setIsClaiming(false);
      return;
    }

    // Refresh profile and redirect
    await refreshProfile();
    router.replace("/settings");
  }

  async function createNewProfile() {
    if (!user) return;

    setIsClaiming(true);
    setError(null);

    const username = fullName.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "") + "_" + Date.now().toString(36).slice(-4);

    const { error: createError } = await supabase
      .from("profiles")
      .insert({
        id: crypto.randomUUID(),
        auth_id: user.id,
        username: username || `user_${user.id.slice(0, 8)}`,
        full_name: fullName.trim(),
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        fetched_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      });

    if (createError) {
      // If username conflict, try with a more unique one
      const { error: retryError } = await supabase
        .from("profiles")
        .insert({
          id: crypto.randomUUID(),
          auth_id: user.id,
          username: "user_" + user.id.slice(0, 8),
          full_name: fullName.trim(),
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          fetched_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        });

      if (retryError) {
        setError(retryError.message || "Failed to create profile");
        setIsClaiming(false);
        return;
      }
    }

    await refreshProfile();
    router.replace("/settings");
  }

  // Show loading while auth is loading OR while we're determining what to do
  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E53935] mx-auto mb-4" />
          <p className="text-[#737373] text-sm">Setting things up...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#E53935]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#E53935]/3 rounded-full blur-3xl" />
      </div>

      <Container size="sm" className="relative flex-1 flex flex-col justify-center py-12">
        {/* Logo / Brand */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E53935]/10 border border-[#E53935]/20 mb-6">
            <Sparkles className="w-8 h-8 text-[#E53935]" />
          </div>
          <h1 className="text-3xl font-bold text-[#FAFAFA] mb-2">Welcome to LEAGUE</h1>
          <p className="text-[#A1A1A1]">Let's set up your profile</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {["name", "search", "confirm"].map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === s
                  ? "w-8 bg-[#E53935]"
                  : i < ["name", "search", "confirm"].indexOf(step)
                  ? "w-4 bg-[#E53935]/50"
                  : "w-4 bg-[#262626]"
              }`}
            />
          ))}
        </div>

        {/* Step: Name */}
        {step === "name" && (
          <Card className="border-[#262626] bg-[#161616]/80 backdrop-blur">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <User className="w-10 h-10 text-[#E53935] mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-[#FAFAFA] mb-1">What's your name?</h2>
                <p className="text-sm text-[#737373]">We'll check if you already have a profile</p>
              </div>

              <form onSubmit={handleNameSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  autoFocus
                />

                {error && (
                  <p className="text-sm text-[#E53935]">{error}</p>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={!fullName.trim() || isSearching}
                  isLoading={isSearching}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step: Search results */}
        {step === "search" && (
          <Card className="border-[#262626] bg-[#161616]/80 backdrop-blur">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <Search className="w-10 h-10 text-[#E53935] mx-auto mb-3" />
                <h2 className="text-xl font-semibold text-[#FAFAFA] mb-1">
                  {searchResults.length > 0 ? "Is this you?" : "No matches found"}
                </h2>
                <p className="text-sm text-[#737373]">
                  {searchResults.length > 0
                    ? "Select your profile to claim it, or create a new one"
                    : "We couldn't find a profile matching your name"}
                </p>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleClaimProfile(p)}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#262626] bg-[#0A0A0A]/50 hover:bg-[#1C1C1C] hover:border-[#E53935]/30 transition-all group text-left"
                    >
                      <Avatar
                        src={p.altered_avatar_url || p.avatar_url || p.fetched_url}
                        fallback={p.full_name || p.username}
                        size="lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#FAFAFA] truncate">{p.full_name}</p>
                        <p className="text-sm text-[#737373] truncate">@{p.username}</p>
                        {p.total_score && p.total_score > 0 && (
                          <p className="text-xs text-[#E53935] mt-1">{p.total_score} points</p>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-[#E53935]" />
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button onClick={createNewProfile} variant="outline" className="w-full" isLoading={isClaiming}>
                  {searchResults.length > 0 ? "None of these — Create new profile" : "Create new profile"}
                </Button>
                <button
                  onClick={() => setStep("name")}
                  className="text-sm text-[#737373] hover:text-[#A1A1A1] transition-colors"
                  disabled={isClaiming}
                >
                  ← Go back
                </button>
              </div>

              {error && (
                <p className="text-sm text-[#E53935] text-center mt-4">{error}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step: Confirm claim */}
        {step === "confirm" && selectedProfile && (
          <Card className="border-[#262626] bg-[#161616]/80 backdrop-blur">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <Avatar
                    src={selectedProfile.altered_avatar_url || selectedProfile.avatar_url || selectedProfile.fetched_url}
                    fallback={selectedProfile.full_name || selectedProfile.username}
                    size="xl"
                    className="w-24 h-24"
                  />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#E53935] flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-[#FAFAFA] mb-1">Claim this profile?</h2>
                <p className="text-[#A1A1A1] font-medium">{selectedProfile.full_name}</p>
                <p className="text-sm text-[#737373]">@{selectedProfile.username}</p>
              </div>

              {selectedProfile.total_score && selectedProfile.total_score > 0 && (
                <div className="bg-[#E53935]/10 border border-[#E53935]/20 rounded-lg p-4 mb-6 text-center">
                  <p className="text-sm text-[#A1A1A1]">This profile has</p>
                  <p className="text-2xl font-bold text-[#E53935]">{selectedProfile.total_score} points</p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button onClick={confirmClaim} className="w-full" isLoading={isClaiming}>
                  Yes, this is me
                </Button>
                <Button 
                  onClick={() => { setSelectedProfile(null); setStep("search"); }} 
                  variant="outline" 
                  className="w-full"
                  disabled={isClaiming}
                >
                  No, go back
                </Button>
              </div>

              {error && (
                <p className="text-sm text-[#E53935] text-center mt-4">{error}</p>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </div>
  );
}
