import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { AppShell } from "@/components/layout/app-shell";
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
      <section className="py-20 lg:py-32 overflow-hidden">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#FAFAFA] leading-[1.1] mb-6">
                Where builders{" "}
                <span className="bg-gradient-to-r from-[#E53935] to-[#FF7043] bg-clip-text text-transparent">
                  rise to the top.
                </span>
              </h1>
              <p className="text-xl text-[#A1A1A1] mb-8 max-w-lg">
                Join hackathons, ship projects, compete with the best. 
                Track your progress and climb the leaderboard.
              </p>
              <div className="flex flex-wrap gap-4">
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
                <div className="absolute inset-0 bg-gradient-to-br from-[#E53935]/20 via-transparent to-[#FF7043]/10 blur-3xl" />
                
                <div className="relative flex items-end justify-center gap-3 pt-16">
                  {topThree[1] && (
                    <div className="flex flex-col items-center">
                      <Avatar
                        src={topThree[1].avatar_url}
                        fallback={topThree[1].full_name || topThree[1].username}
                        size="lg"
                        className="mb-3 ring-2 ring-[#C0C0C0]"
                      />
                      <div className="w-24 h-28 bg-gradient-to-b from-[#3A3A3A] to-[#2A2A2A] rounded-t-lg flex flex-col items-center justify-center border border-[#4A4A4A]">
                        <span className="text-2xl font-bold text-[#C0C0C0]">2</span>
                        <span className="text-xs text-[#737373] mt-1 truncate w-20 text-center">
                          {topThree[1].username}
                        </span>
                      </div>
                    </div>
                  )}

                  {topThree[0] && (
                    <div className="flex flex-col items-center -mt-8">
                      <div className="text-3xl mb-2">🏆</div>
                      <Avatar
                        src={topThree[0].avatar_url}
                        fallback={topThree[0].full_name || topThree[0].username}
                        size="xl"
                        className="mb-3 ring-4 ring-[#FFD700]"
                      />
                      <div className="w-28 h-36 bg-gradient-to-b from-[#4A4A4A] to-[#2A2A2A] rounded-t-lg flex flex-col items-center justify-center border border-[#5A5A5A]">
                        <span className="text-3xl font-bold text-[#FFD700]">1</span>
                        <span className="text-sm text-[#A1A1A1] mt-1 truncate w-24 text-center">
                          {topThree[0].username}
                        </span>
                        <span className="text-xs text-[#E53935] font-mono mt-1">
                          {topThree[0].total_score ?? 0} pts
                        </span>
                      </div>
                    </div>
                  )}

                  {topThree[2] && (
                    <div className="flex flex-col items-center">
                      <Avatar
                        src={topThree[2].avatar_url}
                        fallback={topThree[2].full_name || topThree[2].username}
                        size="lg"
                        className="mb-3 ring-2 ring-[#CD7F32]"
                      />
                      <div className="w-24 h-20 bg-gradient-to-b from-[#3A3A3A] to-[#2A2A2A] rounded-t-lg flex flex-col items-center justify-center border border-[#4A4A4A]">
                        <span className="text-xl font-bold text-[#CD7F32]">3</span>
                        <span className="text-xs text-[#737373] mt-1 truncate w-20 text-center">
                          {topThree[2].username}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Upcoming Hackathons */}
      {hackathons && hackathons.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-[#FAFAFA]">Upcoming Events</h2>
                <p className="text-[#737373] mt-1">Join a hackathon and start building</p>
              </div>
              <Link href="/hackathons">
                <Button variant="ghost" size="sm">View all →</Button>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {hackathons.map((hackathon) => {
                const participants = hackathon.hackathon_participants || [];
                const avatars = participants.slice(0, 4).map((p: any) => ({
                  src: p.profiles?.avatar_url,
                  fallback: p.profiles?.full_name || "U",
                }));

                return (
                  <Link key={hackathon.id} href={"/hackathons/" + hackathon.slug}>
                    <Card hover className="h-full overflow-hidden">
                      {/* Cover Image */}
                      <div className="h-28 relative bg-gradient-to-br from-[#262626] to-[#1C1C1C]">
                        {hackathon.cover_image ? (
                          <Image
                            src={hackathon.cover_image}
                            alt={hackathon.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#E53935]/20 to-[#FF7043]/10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-[#FAFAFA] mb-2">{hackathon.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-[#737373] mb-3">
                          <span>📅</span>
                          <span>
                            {new Date(hackathon.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          <span>•</span>
                          <span>{hackathon.is_online ? "🌐 Online" : "📍 " + hackathon.location}</span>
                        </div>
                        {participants.length > 0 && (
                          <div className="flex items-center gap-2 pt-3 border-t border-[#262626]">
                            <AvatarGroup avatars={avatars} size="xs" max={4} />
                            <span className="text-xs text-[#737373]">{participants.length} joined</span>
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
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#FAFAFA]">50+</div>
              <div className="text-sm text-[#737373] mt-1">Hackathons</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#FAFAFA]">500+</div>
              <div className="text-sm text-[#737373] mt-1">Builders</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#FAFAFA]">1000+</div>
              <div className="text-sm text-[#737373] mt-1">Projects</div>
            </div>
          </div>
        </Container>
      </section>
    </AppShell>
  );
}
