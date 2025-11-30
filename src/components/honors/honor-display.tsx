"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HonorBadgeList } from "./honor-badge";
import { HonorTeammateModal } from "./honor-teammate-modal";
import { HONOR_METADATA } from "@/lib/honors";
import type { HonorType, Profile, PeerHonor } from "@/types/database";
import { Award } from "lucide-react";

interface HonorDisplayProps {
  projectId: string;
  honors: (PeerHonor & { receiver: Profile })[];
  teammates: { profile: Profile; role: string }[];
  currentUserId: string | null;
  isTeamMember: boolean;
  canHonor: boolean; // Within honor window and hasn't already honored
}

export function HonorDisplay({
  projectId,
  honors,
  teammates,
  currentUserId,
  isTeamMember,
  canHonor,
}: HonorDisplayProps) {
  const [showModal, setShowModal] = useState(false);

  // Aggregate honors by type
  const honorCounts = (Object.keys(HONOR_METADATA) as HonorType[]).map((type) => ({
    type,
    count: honors.filter((h) => h.honor_type === type).length,
  }));

  const totalHonors = honors.length;
  const hasAlreadyHonored = currentUserId 
    ? honors.some((h) => h.giver_id === currentUserId)
    : false;

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-[#E53935]" />
              Team Honors {totalHonors > 0 && `(${totalHonors})`}
            </CardTitle>
            {isTeamMember && currentUserId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowModal(true)}
                disabled={hasAlreadyHonored}
                className="text-xs"
              >
                {hasAlreadyHonored ? "Honored ✓" : "Honor Teammate"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {totalHonors > 0 ? (
            <HonorBadgeList honors={honorCounts} size="md" />
          ) : (
            <p className="text-sm text-[#737373]">
              {isTeamMember
                ? "No honors yet. Be the first to recognize a teammate!"
                : "No honors given for this project yet."}
            </p>
          )}
        </CardContent>
      </Card>

      {showModal && currentUserId && (
        <HonorTeammateModal
          projectId={projectId}
          teammates={teammates}
          currentUserId={currentUserId}
          hasAlreadyHonored={hasAlreadyHonored}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

