import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoteButton } from "@/components/projects/vote-button";
import { formatDate } from "@/lib/utils";
import { Github, ExternalLink, Calendar, Users, ArrowLeft, Folder } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { ProjectWithDetails } from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("title, description")
    .eq("slug", slug)
    .single() as { data: { title: string; description: string | null } | null };

  if (!project) return { title: "Project Not Found" };

  return {
    title: project.title,
    description: project.description || `Check out ${project.title}`,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select(`
      *,
      creator:profiles!creator_id(*),
      hackathon:hackathons(*),
      members:project_members(
        *,
        profile:profiles(*)
      )
    `)
    .eq("slug", slug)
    .single() as { data: ProjectWithDetails | null };

  if (!project) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasVoted = false;
  if (user) {
    const { data: vote } = await supabase
      .from("project_votes")
      .select("id")
      .eq("project_id", project.id)
      .eq("user_id", user.id)
      .single();
    hasVoted = !!vote;
  }

  const teamMembers = [
    { profile: project.creator, role: "Creator" },
    ...(project.members || []).map((m) => ({
      profile: m.profile,
      role: m.role || "Member",
    })),
  ];

  return (
    <AppShell>
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 lg:h-80 bg-[#111111]">
        {project.cover_image ? (
          <Image
            src={project.cover_image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#E53935]/20 via-[#111111] to-[#0A0A0A] flex items-center justify-center">
            <Folder className="w-20 h-20 text-[#E53935]/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent" />
      </div>

      <Container className="relative -mt-20 pb-12">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[#737373] hover:text-[#FAFAFA] transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#FAFAFA] mb-4">
              {project.title}
            </h1>
            {project.hackathon && (
              <Link href={`/hackathons/${project.hackathon.slug}`}>
                <Badge variant="primary" className="hover:bg-[#E53935]/20">
                  Built at {project.hackathon.title}
                </Badge>
              </Link>
            )}
          </div>
          <VoteButton
            projectId={project.id}
            voteCount={project.vote_count ?? 0}
            hasVoted={hasVoted}
            isLoggedIn={!!user}
            size="lg"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#A1A1A1] whitespace-pre-wrap">
                  {project.description || "No description provided."}
                </p>
              </CardContent>
            </Card>

            {/* Links */}
            {(project.github_url || project.demo_url) && (
              <Card>
                <CardHeader>
                  <CardTitle>Links</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="gap-2">
                        <Github className="w-4 h-4" />
                        View Source
                      </Button>
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </Button>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team ({teamMembers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teamMembers.map((member, i) => (
                  <Link
                    key={i}
                    href={`/profile/${member.profile.username}`}
                    className="flex items-center gap-3 group"
                  >
                    <Avatar
                      src={member.profile.altered_avatar_url || member.profile.avatar_url || member.profile.fetched_url}
                      fallback={member.profile.full_name || member.profile.username}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#FAFAFA] group-hover:text-[#E53935] transition-colors truncate">
                        {member.profile.full_name || member.profile.username}
                      </p>
                      <p className="text-xs text-[#737373]">{member.role}</p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {project.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#737373]">Created</span>
                    <span className="text-[#FAFAFA]">
                      {formatDate(project.created_at)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[#737373]">Votes</span>
                  <span className="text-[#FAFAFA]">{project.vote_count}</span>
                </div>
              </CardContent>
            </Card>

            {/* Hackathon */}
            {project.hackathon && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Hackathon</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/hackathons/${project.hackathon.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#1C1C1C] flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#737373]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#FAFAFA] group-hover:text-[#E53935] transition-colors truncate">
                        {project.hackathon.title}
                      </p>
                      <p className="text-xs text-[#737373]">
                        {formatDate(project.hackathon.start_date)}
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </AppShell>
  );
}
