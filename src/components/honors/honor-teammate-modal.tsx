"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { HONOR_METADATA } from "@/lib/honors";
import type { HonorType, Profile } from "@/types/database";
import { cn } from "@/lib/utils";
import { X, Award, Check, Loader2 } from "lucide-react";

interface HonorTeammateModalProps {
  projectId: string;
  teammates: { profile: Profile; role: string }[];
  currentUserId: string;
  hasAlreadyHonored: boolean;
  onClose: () => void;
}

export function HonorTeammateModal({
  projectId,
  teammates,
  currentUserId,
  hasAlreadyHonored,
  onClose,
}: HonorTeammateModalProps) {
  const [selectedTeammate, setSelectedTeammate] = useState<string | null>(null);
  const [selectedHonor, setSelectedHonor] = useState<HonorType | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Filter out the current user from teammates
  const eligibleTeammates = teammates.filter((t) => t.profile.id !== currentUserId);

  async function handleSubmit() {
    if (!selectedTeammate || !selectedHonor) return;

    setIsPending(true);
    try {
      const { error } = await supabase.from("peer_honors").insert({
        giver_id: currentUserId,
        receiver_id: selectedTeammate,
        project_id: projectId,
        honor_type: selectedHonor,
        points: 5,
      });

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        router.refresh();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error giving honor:", error);
    } finally {
      setIsPending(false);
    }
  }

  if (hasAlreadyHonored) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <Card className="relative z-10 w-full max-w-md p-6 bg-[#111111] border-[#262626]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#737373] hover:text-[#FAFAFA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#22C55E]/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-[#22C55E]" />
            </div>
            <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">
              Already Honored
            </h3>
            <p className="text-[#737373]">
              You&apos;ve already given an honor for this project.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <Card className="relative z-10 w-full max-w-md p-6 bg-[#111111] border-[#262626]">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#22C55E]/20 flex items-center justify-center animate-pulse">
              <Award className="w-8 h-8 text-[#22C55E]" />
            </div>
            <h3 className="text-lg font-semibold text-[#FAFAFA] mb-2">
              Honor Sent! 🎉
            </h3>
            <p className="text-[#737373]">
              Your teammate has received +5 points
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-lg p-6 bg-[#111111] border-[#262626] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#737373] hover:text-[#FAFAFA] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#E53935]/20 flex items-center justify-center">
            <Award className="w-6 h-6 text-[#E53935]" />
          </div>
          <h2 className="text-xl font-bold text-[#FAFAFA]">Honor a Teammate</h2>
          <p className="text-sm text-[#737373] mt-1">
            Recognize someone who made this project special
          </p>
        </div>

        {eligibleTeammates.length === 0 ? (
          <div className="text-center py-6 text-[#737373]">
            No teammates to honor on this project.
          </div>
        ) : (
          <>
            {/* Step 1: Select Teammate */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#A1A1A1] mb-3">
                1. Select teammate
              </h3>
              <div className="space-y-2">
                {eligibleTeammates.map((teammate) => (
                  <button
                    key={teammate.profile.id}
                    onClick={() => setSelectedTeammate(teammate.profile.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg border transition-all",
                      selectedTeammate === teammate.profile.id
                        ? "border-[#E53935] bg-[#E53935]/10"
                        : "border-[#262626] hover:border-[#404040] bg-[#0A0A0A]"
                    )}
                  >
                    <Avatar
                      src={teammate.profile.altered_avatar_url || teammate.profile.avatar_url || teammate.profile.fetched_url}
                      fallback={teammate.profile.full_name || teammate.profile.username}
                      size="md"
                    />
                    <div className="flex-1 text-left">
                      <p className="font-medium text-[#FAFAFA]">
                        {teammate.profile.full_name || teammate.profile.username}
                      </p>
                      <p className="text-xs text-[#737373]">{teammate.role}</p>
                    </div>
                    {selectedTeammate === teammate.profile.id && (
                      <Check className="w-5 h-5 text-[#E53935]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Honor Type */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#A1A1A1] mb-3">
                2. Choose honor
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(HONOR_METADATA) as HonorType[]).map((type) => {
                  const honor = HONOR_METADATA[type];
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedHonor(type)}
                      disabled={!selectedTeammate}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                        !selectedTeammate && "opacity-50 cursor-not-allowed",
                        selectedHonor === type
                          ? "border-[#E53935] bg-[#E53935]/10"
                          : "border-[#262626] hover:border-[#404040] bg-[#0A0A0A]"
                      )}
                    >
                      <span className="text-2xl">{honor.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#FAFAFA] text-sm">
                          {honor.label}
                        </p>
                        <p className="text-xs text-[#737373] truncate">
                          {honor.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedTeammate || !selectedHonor || isPending}
              className="w-full"
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2" />
                  Give Honor (+5 points)
                </>
              )}
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}

