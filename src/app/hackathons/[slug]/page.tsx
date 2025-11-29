import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { AppShell } from "@/components/layout/app-shell";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatDateTime } from "@/lib/utils";
import { Calendar, MapPin, Globe, Users, ExternalLink, Folder } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { JoinHackathonButton } from "@/components/hackathons/join-button";
import { ProjectCard } from "@/components/projects/project-card";
import type { Metadata } from "next";
import type { HackathonWithDetails, Project, Profile } from "@/types/database";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: hackathon } = await supabase
    .from("hackathons")
    .select("title, description")
    .eq("slug", slug)
    .single() as { data: { title: string; description: string | null } | null };

  if (!hackathon) return { title: "Hackathon Not Found" };

  return {
    title: hackathon.title,
    description: hackathon.description || `Join ${hackathon.title} hackathon`,
  };
}

export default async function HackathonPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: hackathon } = await supabase
    .from("hackathons")
    .select(`
      *,
      organizer:profiles!organizer_id(*),
      participants:hackathon_participants(
        *,
        profile:profiles(*)
      )
    `)
    .eq("slug", slug)
    .single() as { data: HackathonWithDetails | null };

  if (!hackathon) notFound();

  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      creator:profiles!creator_id(*)
    `)
    .eq("hackathon_id", hackathon.id)
    .order("vote_count", { ascending: false }) as { data: (Project & { creator: Profile })[] | null };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isParticipant = hackathon.participants?.some(
    (p) => p.user_id === user?.id
  );
  const isOrganizer = hackathon.organizer_id === user?.id;
  const isUpcoming = new Date(hackathon.start_date) > new Date();
  const isOngoing =
    new Date(hackathon.start_date) <= new Date() &&
    new Date(hackathon.end_date) >= new Date();

  return (
    <AppShell>
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 lg:h-80 bg-background-elevated">
        {hackathon.cover_image ? (
          <Image
            src={hackathon.cover_image}
            alt={hackathon.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-background-elevated to-background-elevated" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      <Container className="relative -mt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-2 mb-2">
            {isUpcoming && <Badge variant="primary">Upcoming</Badge>}
            {isOngoing && <Badge variant="success">Live Now</Badge>}
            {!isUpcoming && !isOngoing && <Badge variant="default">Ended</Badge>}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {hackathon.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hackathon.is_online ? (
                <>
                  <Globe className="w-4 h-4" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>{hackathon.location || "Location TBA"}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{hackathon.participants?.length || 0} participants</span>
            </div>
          </div>
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
                <p className="text-foreground-muted whitespace-pre-wrap">
                  {hackathon.description || "No description provided."}
                </p>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  Projects ({projects?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projects && projects.length > 0 ? (
                  <div className="grid gap-4">
                    {projects.map((project) => (
                      <ProjectCard key={project.id} project={project} compact />
                    ))}
                  </div>
                ) : (
                  <p className="text-foreground-muted text-center py-8">
                    No projects submitted yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Join/Actions */}
            <Card>
              <CardContent className="pt-6">
                <JoinHackathonButton
                  hackathonId={hackathon.id}
                  isParticipant={isParticipant}
                  isOrganizer={isOrganizer}
                  isLoggedIn={!!user}
                  hasEnded={!isUpcoming && !isOngoing}
                />
                {hackathon.registration_deadline && (
                  <p className="text-xs text-foreground-muted text-center mt-3">
                    Registration closes {formatDateTime(hackathon.registration_deadline)}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Organizer */}
            {hackathon.organizer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Organizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    href={`/profile/${hackathon.organizer.username}`}
                    className="flex items-center gap-3 group"
                  >
                    <Avatar
                      src={hackathon.organizer.altered_avatar_url || hackathon.organizer.avatar_url || hackathon.organizer.fetched_url}
                      fallback={hackathon.organizer.full_name || hackathon.organizer.username}
                      size="lg"
                    />
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {hackathon.organizer.full_name || hackathon.organizer.username}
                      </p>
                      <p className="text-sm text-foreground-muted">
                        @{hackathon.organizer.username}
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Participants */}
            {hackathon.participants && hackathon.participants.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Participants ({hackathon.participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {hackathon.participants.slice(0, 20).map((participant) => 
                      participant.profile ? (
                        <Link
                          key={participant.id}
                          href={`/profile/${participant.profile.username}`}
                          title={participant.profile.full_name || participant.profile.username}
                        >
                          <Avatar
                            src={participant.profile.altered_avatar_url || participant.profile.avatar_url || participant.profile.fetched_url}
                            fallback={participant.profile.full_name || participant.profile.username}
                            size="md"
                            className="hover:ring-2 hover:ring-primary transition-all"
                          />
                        </Link>
                      ) : null
                    )}
                    {hackathon.participants.length > 20 && (
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm text-foreground-muted">
                        +{hackathon.participants.length - 20}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </AppShell>
  );
}

