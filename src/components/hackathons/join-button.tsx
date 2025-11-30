"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  isParticipant,
  isOrganizer,
  isLoggedIn,
  hasEnded,
}: JoinHackathonButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleJoin() {
    if (!isLoggedIn) return;
    
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase.from("hackathon_participants").insert({
        hackathon_id: hackathonId,
        user_id: user.id,
        role: "participant",
      });

      router.refresh();
    } catch (error) {
      console.error("Error joining hackathon:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLeave() {
    setIsLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await supabase
        .from("hackathon_participants")
        .delete()
        .eq("hackathon_id", hackathonId)
        .eq("user_id", user.id);

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
      isLoading={isLoading}
    >
      <UserPlus className="w-4 h-4 mr-2" />
      Join Hackathon
    </Button>
  );
}




