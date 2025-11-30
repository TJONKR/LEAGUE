import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HackathonCard } from "@/components/hackathons/hackathon-card";
import { ProjectCard } from "@/components/projects/project-card";
import { ProfileHonors } from "@/components/honors";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils";
import {
  Trophy,
  Calendar,
  Folder,
  Github,
  Globe,
  Linkedin,
  Twitter,
  Award,
  Star,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { Profile, PeerHonor } from "@/types/database";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, bio")
    .eq("username", username)
    .single() as { data: { full_name: string | null; username: string; bio: string | null } | null };

  if (!profile) return { title: "Profile Not Found" };

  return {
    title: profile.full_name || profile.username,
    description: profile.bio || `View ${profile.username}'s profile`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single() as { data: Profile | null };

  if (!profile) notFound();

  // Get hackathons participated in
  const { data: participations } = await supabase
    .from("hackathon_participants")
    .select(`
      *,
      hackathon:hackathons(
        *,
        organizer:profiles!organizer_id(*),
        participants:hackathon_participants(
          *,
          profile:profiles(*)
        )
      )
    `)
    .eq("user_id", profile.id)
    .order("joined_at", { ascending: false });

  // Get projects
  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      creator:profiles!creator_id(*),
      hackathon:hackathons(*)
    `)
    .eq("creator_id", profile.id)
    .order("created_at", { ascending: false });

  // Get achievements
  const { data: achievements } = await supabase
    .from("achievements")
    .select(`
      *,
      hackathon:hackathons(title, slug)
    `)
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  // Get peer honors received
  const { data: honorsReceived } = await supabase
    .from("peer_honors")
    .select(`
      *,
      project:projects(title, slug)
    `)
    .eq("receiver_id", profile.id)
    .order("created_at", { ascending: false }) as { 
      data: (PeerHonor & { project: { title: string; slug: string } })[] | null 
    };

  // Calculate stats
  const hackathonsHosted = participations?.filter(
    (p) => p.role === "organizer"
  ).length || 0;
  const hackathonsAttended = participations?.filter(
    (p) => p.role === "participant"
  ).length || 0;
  const projectsCount = projects?.length || 0;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  // Compare with profile.auth_id, not profile.id (which is a separate UUID)
  const isOwnProfile = user?.id === profile.auth_id;

  // Get user ranking
  const { data: rankings } = await supabase
    .from("profiles")
    .select("id")
    .order("total_score", { ascending: false });
  
  const rank = rankings?.findIndex((p) => p.id === profile.id) ?? -1;

  return (
    <AppShell>
      <Container className="py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar - Profile Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    src={profile.altered_avatar_url || profile.avatar_url || profile.fetched_url}
                    fallback={profile.full_name || profile.username}
                    size="xl"
                    className="mb-4 w-24 h-24"
                  />
                  <h1 className="text-xl font-bold text-foreground">
                    {profile.full_name || profile.username}
                  </h1>
                  <p className="text-foreground-muted">@{profile.username}</p>

                  {profile.bio && (
                    <p className="text-sm text-foreground-muted mt-3">
                      {profile.bio}
                    </p>
                  )}

                  {profile.created_at && (
                    <p className="text-xs text-foreground-subtle mt-3">
                      Member since {formatDate(profile.created_at)}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center gap-3 mt-4">
                    {profile.github_username && (
                      <a
                        href={`https://github.com/${profile.github_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-muted hover:text-foreground transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {profile.twitter_username && (
                      <a
                        href={`https://twitter.com/${profile.twitter_username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-muted hover:text-foreground transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {profile.linkedin_url && (
                      <a
                        href={profile.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-muted hover:text-foreground transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {profile.website && (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground-muted hover:text-foreground transition-colors"
                      >
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>

                  {isOwnProfile && (
                    <Link href="/settings" className="w-full mt-4">
                      <Button variant="outline" className="w-full">
                        Edit Profile
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {hackathonsHosted}
                    </p>
                    <p className="text-xs text-foreground-muted">Hosted</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {hackathonsAttended}
                    </p>
                    <p className="text-xs text-foreground-muted">Attended</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {projectsCount}
                    </p>
                    <p className="text-xs text-foreground-muted">Projects</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">
                      {profile.total_score}
                    </p>
                    <p className="text-xs text-foreground-muted">Points</p>
                  </div>
                </div>

                {rank >= 0 && rank < 100 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Link
                      href="/leaderboard"
                      className="flex items-center justify-center gap-2 text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-primary" />
                      <span>
                        Rank #{rank + 1} on the leaderboard
                      </span>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Peer Honors */}
            {honorsReceived && honorsReceived.length > 0 && (
              <ProfileHonors honors={honorsReceived} />
            )}

            {/* Achievements */}
            {achievements && achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {achievements.slice(0, 5).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {achievement.type === "first_place" && (
                          <Star className="w-4 h-4 text-yellow-500" />
                        )}
                        {achievement.type === "second_place" && (
                          <Star className="w-4 h-4 text-gray-400" />
                        )}
                        {achievement.type === "third_place" && (
                          <Star className="w-4 h-4 text-amber-700" />
                        )}
                        {achievement.type === "participation" && (
                          <Calendar className="w-4 h-4 text-foreground-muted" />
                        )}
                        {achievement.type === "submission" && (
                          <Folder className="w-4 h-4 text-foreground-muted" />
                        )}
                        <span className="text-foreground-muted truncate">
                          {achievement.hackathon?.title || "General"}
                        </span>
                      </div>
                      <Badge variant="primary" size="sm">
                        +{achievement.points}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Projects */}
            <section>
              <h2 className="text-xl font-semibold text-[#FAFAFA] mb-8 flex items-center gap-2">
                <Folder className="w-5 h-5" />
                Projects ({projectsCount})
              </h2>
              {projects && projects.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <EmptyState
                      icon={Folder}
                      title="No projects yet"
                      description={
                        isOwnProfile
                          ? "Submit your first project to showcase your work!"
                          : "This builder hasn't submitted any projects yet."
                      }
                      action={
                        isOwnProfile && (
                          <Link href="/projects/new">
                            <Button variant="outline" size="sm">
                              Submit Project
                            </Button>
                          </Link>
                        )
                      }
                    />
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Hackathons */}
            <section>
              <h2 className="text-xl font-semibold text-[#FAFAFA] mb-8 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Hackathons ({participations?.length || 0})
              </h2>
              {participations && participations.length > 0 ? (
                <div className="grid gap-4">
                  {participations.map((p) => (
                    <HackathonCard key={p.id} hackathon={p.hackathon} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8">
                    <EmptyState
                      icon={Calendar}
                      title="No hackathons yet"
                      description={
                        isOwnProfile
                          ? "Join your first hackathon to start building!"
                          : "This builder hasn't participated in any hackathons yet."
                      }
                      action={
                        isOwnProfile && (
                          <Link href="/hackathons">
                            <Button variant="outline" size="sm">
                              Browse Hackathons
                            </Button>
                          </Link>
                        )
                      }
                    />
                  </CardContent>
                </Card>
              )}
            </section>
          </div>
        </div>
      </Container>
    </AppShell>
  );
}

