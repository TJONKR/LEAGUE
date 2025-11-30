import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AvatarGroup } from "@/components/ui/avatar";
import { AppShell } from "@/components/layout/app-shell";
import { ChampionThrone, RunnerUpPedestal } from "@/components/leaderboard";
import { isValidUrl } from "@/lib/utils/url";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: topBuilders }, { data: hackathons }] = await Promise.all([
    supabase.from("profiles").select("*").order("total_score", { ascending: false }).limit(3),
    supabase
      .from("hackathons")
      .select(`
        id, title, slug, start_date, end_date, location, is_online, cover_image,
        hackathon_participants(user_id, profiles(avatar_url, full_name))
      `)
      .gte("end_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(3),
  ]);

  const topThree = topBuilders || [];

  return (
    <AppShell>
      {/* Hero Section */}
      <section className="py-16 lg:py-24 overflow-hidden">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left - Text */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FAFAFA] leading-tight">
                Where builders{" "}
                <span className="bg-gradient-to-r from-[#E53935] to-[#FF7043] bg-clip-text text-transparent">
                  rise to the top.
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-[#A1A1A1] leading-relaxed max-w-lg">
                Join hackathons, ship projects, compete with the best. 
                Track your progress and climb the leaderboard.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/hackathons">
                  <Button size="lg" className="text-base px-8 rounded-full">
                    Browse Hackathons
                  </Button>
                </Link>
                <Link href="/leaderboard">
                  <Button variant="outline" size="lg" className="text-base px-8 rounded-full">
                    View Leaderboard
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right - Podium Preview */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Background cosmic glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E53935]/10 via-transparent to-[#FF7043]/10 blur-3xl" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl" />
                
                <div className="relative flex items-end justify-center gap-6 pt-16 pb-4">
                  {/* 2nd Place */}
                  <div className="flex-shrink-0">
                    {topThree[1] ? (
                      <RunnerUpPedestal profile={topThree[1]} position={2} />
                    ) : <div className="w-36" />}
                  </div>

                  {/* 1st Place - The Champion */}
                  <div className="flex-shrink-0 -mt-12">
                    {topThree[0] && (
                      <ChampionThrone champion={topThree[0]} />
                    )}
                  </div>

                  {/* 3rd Place */}
                  <div className="flex-shrink-0">
                    {topThree[2] ? (
                      <RunnerUpPedestal profile={topThree[2]} position={3} />
                    ) : <div className="w-36" />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Upcoming Hackathons */}
      {hackathons && hackathons.length > 0 && (
        <section className="py-12 border-t border-[#1A1A1A]">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#FAFAFA]">Upcoming Events</h2>
                <p className="text-[#737373] mt-2">Join a hackathon and start building</p>
              </div>
              <Link href="/hackathons">
                <Button variant="ghost" size="sm">View all →</Button>
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {hackathons.map((hackathon) => {
                const participants = hackathon.hackathon_participants || [];
                const avatars = participants.slice(0, 4).map((p: any) => ({
                  src: p.profiles?.avatar_url,
                  fallback: p.profiles?.full_name || "U",
                }));

                return (
                  <Link key={hackathon.id} href={"/hackathons/" + hackathon.slug}>
                    <Card hover className="h-full overflow-hidden group">
                      {/* Cover Image */}
                      <div className="h-32 relative bg-gradient-to-br from-[#262626] to-[#1C1C1C]">
                        {isValidUrl(hackathon.cover_image) ? (
                          <Image
                            src={hackathon.cover_image}
                            alt={hackathon.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#E53935]/20 to-[#FF7043]/10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/20 to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-[#FAFAFA] mb-2 group-hover:text-[#E53935] transition-colors">{hackathon.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-[#737373] mb-4">
                          <span>📅</span>
                          <span>
                            {new Date(hackathon.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          <span>•</span>
                          <span>{hackathon.is_online ? "🌐 Online" : "📍 " + hackathon.location}</span>
                        </div>
                        {participants.length > 0 ? (
                          <div className="flex items-center gap-2 pt-4 border-t border-[#262626]">
                            <AvatarGroup avatars={avatars} size="xs" max={4} />
                            <span className="text-xs text-[#737373]">{participants.length} joined</span>
                          </div>
                        ) : (
                          <div className="pt-4 border-t border-[#262626]">
                            <span className="text-xs text-[#737373]">Be the first to join!</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* Stats */}
      <section className="py-16 border-t border-[#1A1A1A]">
        <Container>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-[#FAFAFA]">50+</div>
              <div className="text-sm text-[#737373] mt-2">Hackathons</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-[#FAFAFA]">500+</div>
              <div className="text-sm text-[#737373] mt-2">Builders</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-[#FAFAFA]">1000+</div>
              <div className="text-sm text-[#737373] mt-2">Projects</div>
            </div>
          </div>
        </Container>
      </section>
    </AppShell>
  );
}
