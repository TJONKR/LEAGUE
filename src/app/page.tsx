import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";
import Image from "next/image";
import { Crown, Trophy, Medal, Star } from "lucide-react";

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
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#FAFAFA] leading-[1.1] mb-6">
                Where builders{" "}
                <span className="bg-gradient-to-r from-[#E53935] to-[#FF7043] bg-clip-text text-transparent">
                  rise to the top.
                </span>
              </h1>
              <p className="text-lg text-[#A1A1A1] mb-8 max-w-lg">
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
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#E53935]/10 via-transparent to-[#FF7043]/10 blur-3xl" />
                
                <div className="relative flex items-end justify-center gap-4 pt-12">
                  {/* 2nd Place */}
                  {topThree[1] ? (
                    <Link href={"/profile/" + topThree[1].username} className="flex flex-col items-center group">
                      <div className="relative mb-2">
                        <div className="absolute -inset-1 bg-[#C0C0C0]/30 rounded-full blur-sm group-hover:bg-[#C0C0C0]/50 transition" />
                        <Avatar
                          src={topThree[1].avatar_url}
                          fallback={topThree[1].full_name || topThree[1].username}
                          size="lg"
                          className="relative ring-2 ring-[#C0C0C0]"
                        />
                      </div>
                      <div className="w-28 mt-2">
                        <div className="h-28 bg-gradient-to-b from-[#3A3A3A] to-[#252525] rounded-t-xl flex flex-col items-center justify-center border-t border-x border-[#4A4A4A]">
                          <Medal className="w-5 h-5 text-[#C0C0C0] mb-1" />
                          <span className="text-2xl font-black text-[#C0C0C0]">2</span>
                          <span className="text-xs text-[#737373] mt-1 truncate w-20 text-center">
                            {topThree[1].username}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : <div className="w-28" />}

                  {/* 1st Place */}
                  {topThree[0] && (
                    <Link href={"/profile/" + topThree[0].username} className="flex flex-col items-center group -mt-8">
                      <Crown className="w-8 h-8 text-[#FFD700] mb-1 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
                      <div className="relative mb-2">
                        <div className="absolute -inset-2 bg-[#FFD700]/30 rounded-full blur-md group-hover:bg-[#FFD700]/50 transition animate-pulse" />
                        <Avatar
                          src={topThree[0].avatar_url}
                          fallback={topThree[0].full_name || topThree[0].username}
                          size="xl"
                          className="relative ring-3 ring-[#FFD700] w-20 h-20"
                        />
                      </div>
                      <div className="w-32 mt-2">
                        <div className="h-36 bg-gradient-to-b from-[#4A4A4A] to-[#2A2A2A] rounded-t-xl flex flex-col items-center justify-center border-t border-x border-[#5A5A5A] relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent" />
                          <Trophy className="w-6 h-6 text-[#FFD700] mb-1" />
                          <span className="text-3xl font-black text-[#FFD700]">1</span>
                          <span className="text-xs text-[#A1A1A1] mt-1 truncate w-24 text-center">
                            {topThree[0].username}
                          </span>
                          <span className="text-xs text-[#E53935] font-mono mt-1">
                            {topThree[0].total_score ?? 0} pts
                          </span>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* 3rd Place */}
                  {topThree[2] ? (
                    <Link href={"/profile/" + topThree[2].username} className="flex flex-col items-center group">
                      <div className="relative mb-2">
                        <div className="absolute -inset-1 bg-[#CD7F32]/30 rounded-full blur-sm group-hover:bg-[#CD7F32]/50 transition" />
                        <Avatar
                          src={topThree[2].avatar_url}
                          fallback={topThree[2].full_name || topThree[2].username}
                          size="lg"
                          className="relative ring-2 ring-[#CD7F32]"
                        />
                      </div>
                      <div className="w-28 mt-2">
                        <div className="h-20 bg-gradient-to-b from-[#3A3A3A] to-[#252525] rounded-t-xl flex flex-col items-center justify-center border-t border-x border-[#4A4A4A]">
                          <Star className="w-4 h-4 text-[#CD7F32] mb-1" />
                          <span className="text-xl font-black text-[#CD7F32]">3</span>
                          <span className="text-xs text-[#737373] mt-1 truncate w-20 text-center">
                            {topThree[2].username}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ) : <div className="w-28" />}
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
                <p className="text-[#737373] mt-1">Join a hackathon and start building</p>
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
                        {hackathon.cover_image ? (
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
