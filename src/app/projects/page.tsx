import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/layout/app-shell";
import { HonorBadgeList } from "@/components/honors";
import { Heart, Award } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { HonorType } from "@/types/database";

export const metadata: Metadata = {
  title: "Projects",
  description: "Discover projects built at hackathons.",
};

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      hackathon:hackathons(title, slug),
      project_members(
        user_id,
        role,
        profile:profiles(id, username, full_name, avatar_url, altered_avatar_url, fetched_url)
      ),
      peer_honors(honor_type)
    `)
    .order("vote_count", { ascending: false })
    .limit(20);

  return (
    <AppShell>
      <section className="py-12">
        <Container>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-[#FAFAFA]">Projects</h1>
              <p className="text-[#737373] mt-2">Discover what builders are creating</p>
            </div>
            <Link href="/projects/new">
              <Button className="rounded-full">Submit Project</Button>
            </Link>
          </div>

          {projects && projects.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => {
                const members = project.project_members || [];
                const honors = project.peer_honors || [];
                
                // Aggregate honors by type
                const honorCounts = honors.reduce((acc: Record<string, number>, h: { honor_type: string }) => {
                  acc[h.honor_type] = (acc[h.honor_type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>);
                
                const honorBadges = Object.entries(honorCounts).map(([type, count]) => ({
                  type: type as HonorType,
                  count: count as number,
                }));
                
                return (
                  <Link key={project.id} href={`/projects/${project.slug}`}>
                    <Card hover className="h-full">
                      <div className="h-32 bg-gradient-to-br from-[#E53935]/20 to-[#FF7043]/10 rounded-t-xl relative">
                        {/* Vote count badge */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                          <Heart className="w-3.5 h-3.5 text-[#E53935]" />
                          <span className="text-sm font-medium text-white">{project.vote_count ?? 0}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-[#FAFAFA] text-lg mb-2">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-[#A1A1A1] mb-3 line-clamp-2">{project.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {project.hackathon && (
                            <Badge variant="outline" size="sm">
                              {project.hackathon.title}
                            </Badge>
                          )}
                        </div>

                        {/* Honor badges */}
                        {honorBadges.length > 0 && (
                          <div className="mb-3">
                            <HonorBadgeList honors={honorBadges} size="sm" />
                          </div>
                        )}

                        {members.length > 0 && (
                          <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
                            <div className="flex items-center gap-2">
                              <div className="flex -space-x-2">
                                {members.slice(0, 3).map((member: any) => (
                                  <Avatar
                                    key={member.user_id}
                                    src={member.profile?.altered_avatar_url || member.profile?.avatar_url || member.profile?.fetched_url}
                                    fallback={member.profile?.full_name || member.profile?.username}
                                    size="xs"
                                    className="ring-2 ring-[#161616]"
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-[#737373]">
                                {members.length} member{members.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            {honors.length > 0 && (
                              <div className="flex items-center gap-1 text-xs text-[#737373]">
                                <Award className="w-3 h-3" />
                                <span>{honors.length}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card className="p-16 text-center">
              <div className="text-5xl mb-4">🚀</div>
              <p className="text-[#FAFAFA] font-medium mb-2">No projects yet</p>
              <p className="text-sm text-[#737373] mb-6">Be the first to submit a project!</p>
              <Link href="/projects/new">
                <Button variant="outline" className="rounded-full">Submit Project</Button>
              </Link>
            </Card>
          )}
        </Container>
      </section>
    </AppShell>
  );
}
