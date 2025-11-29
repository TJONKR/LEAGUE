"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, ExternalLink, Github, Globe, Check } from "lucide-react";
import type { Bounty, BountySubmission, Project, Profile } from "@/types/database";

interface SubmissionWithDetails extends BountySubmission {
  project: Project;
  submitter: Profile;
}

interface SubmissionListProps {
  bounty: Bounty;
  submissions: SubmissionWithDetails[];
  isPoster: boolean;
}

export function SubmissionList({ bounty, submissions, isPoster }: SubmissionListProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const canSelectWinner = isPoster && (bounty.status === "open" || bounty.status === "in_review");
  const winner = submissions.find((s) => s.is_winner);

  async function handleSelectWinner(submissionId: string) {
    if (!canSelectWinner) return;

    setIsLoading(submissionId);

    // First, reset all submissions to not winner
    await supabase
      .from("bounty_submissions")
      .update({ is_winner: false })
      .eq("bounty_id", bounty.id);

    // Set the selected submission as winner
    await supabase
      .from("bounty_submissions")
      .update({ is_winner: true })
      .eq("id", submissionId);

    // Update bounty status to awarded
    await supabase
      .from("bounties")
      .update({ status: "awarded" })
      .eq("id", bounty.id);

    setIsLoading(null);
    router.refresh();
  }

  async function handleMarkComplete() {
    if (!isPoster || bounty.status !== "awarded") return;

    setIsLoading("complete");

    await supabase
      .from("bounties")
      .update({ status: "completed" })
      .eq("id", bounty.id);

    setIsLoading(null);
    router.refresh();
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-[#737373]">No submissions yet</p>
          <p className="text-sm text-[#525252] mt-1">
            Be the first to submit a project!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#FAFAFA]">
          Submissions ({submissions.length})
        </h2>
        {isPoster && bounty.status === "awarded" && winner && (
          <Button
            onClick={handleMarkComplete}
            isLoading={isLoading === "complete"}
            size="sm"
            className="rounded-full"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark as Complete
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {submissions.map((submission) => (
          <Card
            key={submission.id}
            className={`overflow-hidden ${
              submission.is_winner
                ? "ring-2 ring-[#F59E0B] bg-[#F59E0B]/5"
                : ""
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      href={`/projects/${submission.project.slug}`}
                      className="font-semibold text-[#FAFAFA] hover:text-[#F59E0B] transition-colors truncate"
                    >
                      {submission.project.title}
                    </Link>
                    {submission.is_winner && (
                      <Badge variant="warning" size="sm" className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Winner
                      </Badge>
                    )}
                  </div>

                  {submission.project.description && (
                    <p className="text-sm text-[#737373] mb-3 line-clamp-2">
                      {submission.project.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4">
                    <Link
                      href={`/profile/${submission.submitter.username}`}
                      className="flex items-center gap-2 text-sm text-[#737373] hover:text-[#FAFAFA] transition-colors"
                    >
                      <Avatar
                        src={submission.submitter.altered_avatar_url || submission.submitter.avatar_url || submission.submitter.fetched_url}
                        fallback={submission.submitter.full_name || submission.submitter.username || "U"}
                        size="xs"
                      />
                      <span>{submission.submitter.full_name || submission.submitter.username}</span>
                    </Link>

                    <span className="text-xs text-[#525252]">
                      {new Date(submission.submitted_at!).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    {submission.project.github_url && (
                      <a
                        href={submission.project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#737373] hover:text-[#FAFAFA] hover:bg-[#262626] rounded-lg transition-all"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {submission.project.demo_url && (
                      <a
                        href={submission.project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[#737373] hover:text-[#FAFAFA] hover:bg-[#262626] rounded-lg transition-all"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                    <Link
                      href={`/projects/${submission.project.slug}`}
                      className="p-2 text-[#737373] hover:text-[#FAFAFA] hover:bg-[#262626] rounded-lg transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>

                  {canSelectWinner && !submission.is_winner && (
                    <Button
                      onClick={() => handleSelectWinner(submission.id)}
                      isLoading={isLoading === submission.id}
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                    >
                      <Trophy className="w-3.5 h-3.5 mr-1.5" />
                      Select Winner
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

