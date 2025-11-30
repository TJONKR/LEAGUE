"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Send, Check, Plus } from "lucide-react";
import type { Project, Bounty } from "@/types/database";

interface SubmitButtonProps {
  bounty: Bounty;
  existingSubmission?: {
    id: string;
    project_id: string;
    is_winner: boolean | null;
  } | null;
}

export function SubmitButton({ bounty, existingSubmission }: SubmitButtonProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const canSubmit = bounty.status === "open" && user && profile && !existingSubmission;
  const isDeadlinePassed = new Date(bounty.deadline) < new Date();

  useEffect(() => {
    if (showModal && profile) {
      fetchUserProjects();
    }
  }, [showModal, profile]);

  async function fetchUserProjects() {
    if (!profile) return;

    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("creator_id", profile.id) // Use profile.id for FK reference
      .order("created_at", { ascending: false });

    if (data) {
      setUserProjects(data);
    }
  }

  async function handleSubmit() {
    if (!profile || !selectedProjectId) return;

    setIsLoading(true);

    const { error } = await supabase.from("bounty_submissions").insert({
      bounty_id: bounty.id,
      project_id: selectedProjectId,
      submitted_by: profile.id, // Use profile.id for FK reference
    });

    if (error) {
      console.error("Error submitting to bounty:", error);
      setIsLoading(false);
      return;
    }

    // Also update the project to link it to the bounty
    await supabase
      .from("projects")
      .update({ bounty_id: bounty.id })
      .eq("id", selectedProjectId);

    setIsLoading(false);
    setShowModal(false);
    router.refresh();
  }

  async function handleWithdraw() {
    if (!existingSubmission) return;

    setIsLoading(true);

    const { error } = await supabase
      .from("bounty_submissions")
      .delete()
      .eq("id", existingSubmission.id);

    if (error) {
      console.error("Error withdrawing submission:", error);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.refresh();
  }

  // Not logged in - redirect to login with current page as redirect target
  if (!user) {
    const handleLoginRedirect = () => {
      // Get current pathname using window.location (since this is a client component)
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "/";
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    };
    
    return (
      <Button
        onClick={handleLoginRedirect}
        className="w-full rounded-full"
      >
        Sign in to Submit
      </Button>
    );
  }

  // Already submitted
  if (existingSubmission) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-[#22C55E]">
          <Check className="w-5 h-5" />
          <span className="font-medium">
            {existingSubmission.is_winner ? "Winner!" : "Submitted"}
          </span>
        </div>
        {!existingSubmission.is_winner && bounty.status === "open" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWithdraw}
            isLoading={isLoading}
            className="text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
          >
            Withdraw Submission
          </Button>
        )}
      </div>
    );
  }

  // Deadline passed
  if (isDeadlinePassed) {
    return (
      <Button disabled className="w-full rounded-full">
        Deadline Passed
      </Button>
    );
  }

  // Bounty not open
  if (bounty.status !== "open") {
    return (
      <Button disabled className="w-full rounded-full">
        Submissions Closed
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="w-full rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-black"
        disabled={!profile}
      >
        <Send className="w-4 h-4 mr-2" />
        Submit Project
      </Button>

      {/* Project Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <Card className="relative z-10 w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
            <CardHeader className="border-b border-[#262626]">
              <CardTitle>Submit to Bounty</CardTitle>
            </CardHeader>
            <CardContent className="p-4 overflow-y-auto max-h-[50vh]">
              {userProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#737373] mb-4">
                    You don't have any projects yet.
                  </p>
                  <Button
                    onClick={() => router.push(`/projects/new?bounty=${bounty.id}`)}
                    variant="outline"
                    className="rounded-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-[#737373] mb-4">
                    Select a project to submit:
                  </p>
                  {userProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        selectedProjectId === project.id
                          ? "border-[#F59E0B] bg-[#F59E0B]/10"
                          : "border-[#262626] hover:border-[#363636] hover:bg-[#1C1C1C]"
                      }`}
                    >
                      <h4 className="font-medium text-[#FAFAFA]">{project.title}</h4>
                      {project.description && (
                        <p className="text-xs text-[#737373] mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                    </button>
                  ))}
                  
                  <div className="pt-4 border-t border-[#262626] mt-4">
                    <button
                      onClick={() => router.push(`/projects/new?bounty=${bounty.id}`)}
                      className="w-full p-3 rounded-lg border border-dashed border-[#363636] text-[#737373] hover:text-[#FAFAFA] hover:border-[#F59E0B] transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create New Project
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
            
            {userProjects.length > 0 && (
              <div className="p-4 border-t border-[#262626] flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedProjectId}
                  isLoading={isLoading}
                  className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-black"
                >
                  Submit
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
