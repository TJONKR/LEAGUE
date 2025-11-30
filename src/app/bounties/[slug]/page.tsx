import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/components/layout/app-shell";
import { SubmitButton } from "@/components/bounties/submit-button";
import { SubmissionList } from "@/components/bounties/submission-list";
import { isValidUrl } from "@/lib/utils/url";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Calendar, ArrowLeft, Edit, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import type { BountyStatus } from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: bounty } = await supabase
    .from("bounties")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!bounty) {
    return { title: "Bounty Not Found" };
  }

  return {
    title: `${bounty.title} | Bounties`,
    description: bounty.description || `€${bounty.title} bounty`,
  };
}

function getStatusBadge(status: BountyStatus) {
  switch (status) {
    case "open":
      return { variant: "success" as const, label: "Open" };
    case "in_review":
      return { variant: "warning" as const, label: "In Review" };
    case "awarded":
      return { variant: "primary" as const, label: "Awarded" };
    case "completed":
      return { variant: "default" as const, label: "Completed" };
    case "cancelled":
      return { variant: "outline" as const, label: "Cancelled" };
    default:
      return { variant: "default" as const, label: status };
  }
}

function formatDeadline(deadline: string) {
  const date = new Date(deadline);
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff < 0) {
    return { text: "Ended", isEnded: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 7) {
    return {
      text: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      isEnded: false,
    };
  }

  if (days > 0) {
    return { text: `${days}d ${hours}h remaining`, isEnded: false };
  }

  if (hours > 0) {
    return { text: `${hours}h remaining`, isEnded: false };
  }

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { text: `${minutes}m remaining`, isEnded: false };
}

export default async function BountyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  // Get user's profile if logged in
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("auth_id", user.id)
      .single();
    profile = data;
  }

  // Get bounty with poster info
  const { data: bounty, error } = await supabase
    .from("bounties")
    .select(`
      *,
      poster:profiles!bounties_poster_id_fkey(*)
    `)
    .eq("slug", slug)
    .single();

  if (error || !bounty) {
    notFound();
  }

  // Get submissions with project and submitter info
  const { data: submissions } = await supabase
    .from("bounty_submissions")
    .select(`
      *,
      project:projects(*),
      submitter:profiles!bounty_submissions_submitted_by_fkey(*)
    `)
    .eq("bounty_id", bounty.id)
    .order("submitted_at", { ascending: false });

  // Check if current user has already submitted
  const userSubmission = profile
    ? submissions?.find((s) => s.submitted_by === profile.id)
    : null;

  const isPoster = profile?.id === bounty.poster_id;
  const statusBadge = getStatusBadge(bounty.status);
  const deadlineInfo = formatDeadline(bounty.deadline);

  return (
    <AppShell>
      <section className="py-12">
        <Container size="lg">
          {/* Back Link */}
          <Link
            href="/bounties"
            className="inline-flex items-center gap-2 text-[#737373] hover:text-[#FAFAFA] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bounties
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <Card className="overflow-hidden">
                {/* Cover Image */}
                <div className="h-48 relative bg-gradient-to-br from-[#262626] to-[#1C1C1C]">
                  {isValidUrl(bounty.cover_image) ? (
                    <Image
                      src={bounty.cover_image}
                      alt={bounty.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/10" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
                  
                  {/* Status Badge */}
                  <Badge
                    variant={statusBadge.variant}
                    className="absolute top-4 right-4"
                  >
                    {statusBadge.label}
                  </Badge>
                </div>

                <div className="p-6">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#FAFAFA] mb-6">
                    {bounty.title}
                  </h1>

                  {/* Tags */}
                  {bounty.tags && bounty.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {bounty.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  {bounty.description && (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <p className="text-[#A1A1A1] whitespace-pre-wrap">
                        {bounty.description}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Submissions */}
              <SubmissionList
                bounty={bounty}
                submissions={submissions || []}
                isPoster={isPoster}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Reward Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-[#737373] mb-1">Bounty Reward</p>
                    <p className="text-4xl font-bold text-[#F59E0B]">
                      €{bounty.reward_amount.toLocaleString()}
                    </p>
                  </div>

                  <SubmitButton
                    bounty={bounty}
                    existingSubmission={userSubmission}
                  />

                  <div className="mt-6 pt-6 border-t border-[#262626] space-y-4">
                    {/* Deadline */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#737373]">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Deadline</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          deadlineInfo.isEnded ? "text-[#EF4444]" : "text-[#FAFAFA]"
                        }`}
                      >
                        {deadlineInfo.text}
                      </span>
                    </div>

                    {/* Created */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#737373]">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Posted</span>
                      </div>
                      <span className="text-sm text-[#FAFAFA]">
                        {new Date(bounty.created_at!).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Submissions Count */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#737373]">Submissions</span>
                      <span className="text-sm text-[#FAFAFA]">
                        {submissions?.length || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Poster Card */}
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-[#737373] mb-4">Posted by</p>
                  <Link
                    href={`/profile/${bounty.poster.username}`}
                    className="flex items-center gap-3 group"
                  >
                    <Avatar
                      src={bounty.poster.altered_avatar_url || bounty.poster.avatar_url || bounty.poster.fetched_url}
                      fallback={bounty.poster.full_name || bounty.poster.username || "U"}
                      size="lg"
                    />
                    <div>
                      <p className="font-medium text-[#FAFAFA] group-hover:text-[#F59E0B] transition-colors">
                        {bounty.poster.full_name || bounty.poster.username}
                      </p>
                      {bounty.poster.full_name && (
                        <p className="text-sm text-[#737373]">
                          @{bounty.poster.username}
                        </p>
                      )}
                    </div>
                  </Link>
                </CardContent>
              </Card>

              {/* Poster Actions */}
              {isPoster && (
                <Card>
                  <CardContent className="p-6 space-y-3">
                    <p className="text-sm text-[#737373] mb-2">Manage Bounty</p>
                    <Link href={`/bounties/${bounty.slug}/edit`}>
                      <Button variant="outline" className="w-full rounded-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Bounty
                      </Button>
                    </Link>
                    {bounty.status === "open" && (
                      <Button
                        variant="ghost"
                        className="w-full rounded-full text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Cancel Bounty
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </section>
    </AppShell>
  );
}

