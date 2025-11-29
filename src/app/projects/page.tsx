import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";
import type { Metadata } from "next";

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
        profile:profiles(id, username, full_name, avatar_url)
      )
    `)
    .order("created_at", { ascending: false })
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
                
                return (
                  <Link key={project.id} href={`/projects/${project.slug}`}>
                    <Card hover className="h-full">
                      <div className="h-32 bg-gradient-to-br from-[#E53935]/20 to-[#FF7043]/10 rounded-t-xl" />
                      <div className="p-5">
                        <h3 className="font-semibold text-[#FAFAFA] text-lg mb-2">{project.title}</h3>
                        {project.description && (
                          <p className="text-sm text-[#A1A1A1] mb-3 line-clamp-2">{project.description}</p>
                        )}
                        
                        {project.hackathon && (
                          <Badge variant="outline" size="sm" className="mb-3">
                            {project.hackathon.title}
                          </Badge>
                        )}

                        {members.length > 0 && (
                          <div className="flex items-center gap-2 pt-3 border-t border-[#262626]">
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
