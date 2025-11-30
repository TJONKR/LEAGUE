"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Check, LogIn, UserPlus, Crown } from "lucide-react";
import Link from "next/link";

interface JoinHackathonButtonProps {
  hackathonId: string;
  isParticipant: boolean;
  isOrganizer: boolean;
  isLoggedIn: boolean;
  hasEnded: boolean;
}

export function JoinHackathonButton({
  hackathonId,
  isParticipant: serverIsParticipant,
  isOrganizer,
  isLoggedIn,
  hasEnded,
}: JoinHackathonButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clientIsParticipant, setClientIsParticipant] = useState<boolean | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const { profile, isLoading: authLoading } = useAuth();
  
  // Check participant status on client-side as fallback
  const isParticipant = clientIsParticipant ?? serverIsParticipant;
  
  // Client-side participant check
  useEffect(() => {
    if (profile) {
      supabase
        .from("hackathon_participants")
        .select("id")
        .eq("hackathon_id", hackathonId)
        .eq("user_id", profile.id)
        .single()
        .then(({ data }) => {
          setClientIsParticipant(!!data);
        });
    }
  }, [profile, hackathonId, supabase]);

  async function handleJoin() {
    if (!isLoggedIn || !profile) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.from("hackathon_participants").insert({
        hackathon_id: hackathonId,
        user_id: profile.id,
        role: "participant",
      });

      if (error) {
        // If already joined (unique constraint), just refresh to show correct state
        if (error.code === '23505') {
          setClientIsParticipant(true);
        } else {
          console.error("Error joining hackathon:", error);
          return;
        }
      } else {
        setClientIsParticipant(true);
      }

      router.refresh();
    } catch (error) {
      console.error("Error joining hackathon:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLeave() {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("hackathon_participants")
        .delete()
        .eq("hackathon_id", hackathonId)
        .eq("user_id", profile.id);

      if (!error) {
        setClientIsParticipant(false);
      }

      router.refresh();
    } catch (error) {
      console.error("Error leaving hackathon:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <Link href={`/login?redirect=/hackathons/${hackathonId}`} className="block">
        <Button className="w-full" size="lg">
          <LogIn className="w-4 h-4 mr-2" />
          Sign in to Join
        </Button>
      </Link>
    );
  }

  if (isOrganizer) {
    return (
      <Button variant="secondary" className="w-full" size="lg" disabled>
        <Crown className="w-4 h-4 mr-2" />
        You&apos;re Organizing
      </Button>
    );
  }

  if (hasEnded) {
    return (
      <Button variant="secondary" className="w-full" size="lg" disabled>
        Event Ended
      </Button>
    );
  }

  if (isParticipant) {
    return (
      <div className="space-y-2">
        <Button variant="secondary" className="w-full" size="lg" disabled>
          <Check className="w-4 h-4 mr-2" />
          You&apos;re Going
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          size="sm"
          onClick={handleLeave}
          isLoading={isLoading}
        >
          Leave Event
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleJoin}
      isLoading={isLoading || authLoading}
      disabled={!profile && !authLoading}
    >
      <UserPlus className="w-4 h-4 mr-2" />
      Join Hackathon
    </Button>
  );
}

