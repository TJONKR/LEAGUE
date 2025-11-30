"use client";

import { useState, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import Link from "next/link";

interface VoteButtonProps {
  projectId: string;
  voteCount: number;
  hasVoted: boolean;
  isLoggedIn: boolean;
  size?: "sm" | "md" | "lg";
}

export function VoteButton({
  projectId,
  voteCount,
  hasVoted,
  isLoggedIn,
  size = "sm",
}: VoteButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [optimisticVote, setOptimisticVote] = useOptimistic(
    { hasVoted, voteCount },
    (state, newVote: boolean) => ({
      hasVoted: newVote,
      voteCount: newVote ? state.voteCount + 1 : state.voteCount - 1,
    })
  );
  const router = useRouter();
  const supabase = createClient();
  const { profile } = useAuth();

  async function handleVote() {
    if (!isLoggedIn || !profile) return;
    
    setIsPending(true);
    setOptimisticVote(!optimisticVote.hasVoted);

    try {
      if (optimisticVote.hasVoted) {
        await supabase
          .from("project_votes")
          .delete()
          .eq("project_id", projectId)
          .eq("user_id", profile.id); // Use profile.id for FK reference
      } else {
        await supabase.from("project_votes").insert({
          project_id: projectId,
          user_id: profile.id, // Use profile.id for FK reference
        });
      }

      router.refresh();
    } catch (error) {
      console.error("Error voting:", error);
      setOptimisticVote(optimisticVote.hasVoted);
    } finally {
      setIsPending(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <Link href={`/login?redirect=/projects/${projectId}`}>
        <Button
          variant="outline"
          size={size}
          className={cn(
            "gap-2",
            size === "lg" && "px-6"
          )}
        >
          <Heart className={cn("w-4 h-4", size === "lg" && "w-5 h-5")} />
          <span>{voteCount}</span>
        </Button>
      </Link>
    );
  }

  return (
    <Button
      variant={optimisticVote.hasVoted ? "default" : "outline"}
      size={size}
      onClick={handleVote}
      disabled={isPending || !profile}
      className={cn(
        "gap-2 transition-all",
        size === "lg" && "px-6",
        optimisticVote.hasVoted && "bg-[#E53935] hover:bg-[#EF5350]"
      )}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-all",
          size === "lg" && "w-5 h-5",
          optimisticVote.hasVoted && "fill-current"
        )}
      />
      <span>{optimisticVote.voteCount}</span>
    </Button>
  );
}

