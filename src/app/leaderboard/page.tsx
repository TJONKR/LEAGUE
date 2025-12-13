import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AppShell } from "@/components/layout/app-shell";
import { ChampionThrone, RunnerUpPedestal } from "@/components/leaderboard";
import Link from "next/link";
import { Flame, TrendingUp, Zap, Trophy } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Top builders ranked by participation and achievements.",
};

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("total_score", { ascending: false })
    .limit(100);

  const topThree = profiles?.slice(0, 3) || [];
  const rest = profiles?.slice(3) || [];

  return (
    <AppShell>
      {/* Fixed Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-[url('/flag.png')] bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundAttachment: 'fixed' }}
        />
      </div>

      {/* Content with relative positioning */}
      <div className="relative z-10">
        {/* Hero Header */}
        <section className="relative pt-8 pb-4 overflow-hidden">
          {/* Background Effects - EU Blue */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#003399]/10 via-transparent to-transparent" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#003399]/15 rounded-full blur-3xl" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FFCC00]/10 rounded-full blur-3xl" />
          
          <Container>
            <div className="relative text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFCC00]/10 border border-[#FFCC00]/20 rounded-full text-[#FFCC00] text-sm font-medium mb-6">
                <Flame className="w-4 h-4" />
                <span>Season 1 Active</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#F5F7FA] mb-4">
                Global Leaderboard
              </h1>
              <p className="text-lg text-[#64748B] text-center">
                The top builders competing for glory
              </p>
            </div>
          </Container>
        </section>

        {/* Podium Section - The Throne */}
        {topThree.length > 0 && (
          <section className="relative pb-16 pt-8 overflow-visible">
            {/* Background cosmic effects - EU themed */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#FFCC00]/10 via-[#003399]/10 to-transparent blur-3xl" />
              <div className="absolute bottom-0 left-1/4 w-96 h-64 bg-[#003399]/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-96 h-64 bg-[#FFCC00]/15 rounded-full blur-3xl" />
            </div>
            
            <Container className="overflow-visible">
              <div className="relative flex items-end justify-center gap-4 sm:gap-8 pt-16 overflow-visible">
                {/* 2nd Place */}
                <div className="flex-shrink-0">
                  {topThree[1] ? (
                    <RunnerUpPedestal profile={topThree[1]} position={2} />
                  ) : <div className="w-36 h-48" />}
                </div>

                {/* 1st Place - The Ascended Champion */}
                <div className="flex-shrink-0 -mt-16">
                  {topThree[0] && (
                    <ChampionThrone champion={topThree[0]} />
                  )}
                </div>

                {/* 3rd Place */}
                <div className="flex-shrink-0">
                  {topThree[2] ? (
                    <RunnerUpPedestal profile={topThree[2]} position={3} />
                  ) : <div className="w-36 h-40" />}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Rankings Table */}
        <section className="py-8">
          <Container>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#132440] rounded-lg border border-[#243B5C]">
                  <TrendingUp className="w-5 h-5 text-[#FFCC00]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#F5F7FA]">Rankings</h2>
                  <p className="text-sm text-[#64748B]">{profiles?.length || 0} builders competing</p>
                </div>
              </div>
            </div>

            <Card className="overflow-hidden border-[#243B5C]">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 text-xs uppercase tracking-wider text-[#64748B] font-semibold bg-[#0F1D32] border-b border-[#243B5C]">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-7 sm:col-span-6">Builder</div>
                <div className="col-span-2 text-center hidden sm:block">Hackathons</div>
                <div className="col-span-4 sm:col-span-3 text-right">Points</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-[#1C3350]">
                {topThree.map((profile, index) => (
                  <Link
                    key={profile.id}
                    href={"/profile/" + profile.username}
                    className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center hover:bg-[#132440] transition-all group"
                  >
                    <div className="col-span-1 flex justify-center">
                      <div className={"w-8 h-8 rounded-lg flex items-center justify-center text-lg " + 
                        (index === 0 ? "bg-[#FFCC00]/20" : index === 1 ? "bg-[#C0C0C0]/20" : "bg-[#CD7F32]/20")
                      }>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </div>
                    </div>
                    <div className="col-span-7 sm:col-span-6 flex items-center gap-3 min-w-0">
                      <Avatar 
                        src={profile.altered_avatar_url || profile.avatar_url || profile.fetched_url} 
                        fallback={profile.full_name || profile.username} 
                        size="md"
                        className="ring-2 ring-[#243B5C] group-hover:ring-[#FFCC00]/50 transition-all flex-shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-[#F5F7FA] truncate group-hover:text-[#FFCC00] transition-colors">
                          {profile.full_name || profile.username}
                        </div>
                        <div className="text-sm text-[#64748B] truncate">@{profile.username}</div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center hidden sm:block">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#132440] rounded text-sm text-[#94A3B8]">
                        <Zap className="w-3 h-3" />
                        {0}
                      </span>
                    </div>
                    <div className="col-span-4 sm:col-span-3 text-right">
                      <span className={"font-mono font-bold text-lg " + 
                        (index === 0 ? "text-[#FFCC00]" : index === 1 ? "text-[#C0C0C0]" : "text-[#CD7F32]")
                      }>
                        {profile.total_score?.toLocaleString() ?? 0}
                      </span>
                      <span className="text-[#64748B] text-sm ml-1">pts</span>
                    </div>
                  </Link>
                ))}

                {rest.map((profile, index) => (
                  <Link
                    key={profile.id}
                    href={"/profile/" + profile.username}
                    className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center hover:bg-[#132440] transition-all group"
                  >
                    <div className="col-span-1 flex justify-center">
                      <span className="w-8 h-8 rounded-lg bg-[#132440] flex items-center justify-center text-sm font-bold text-[#64748B]">
                        {index + 4}
                      </span>
                    </div>
                    <div className="col-span-7 sm:col-span-6 flex items-center gap-3 min-w-0">
                      <Avatar 
                        src={profile.altered_avatar_url || profile.avatar_url || profile.fetched_url} 
                        fallback={profile.full_name || profile.username} 
                        size="md"
                        className="ring-2 ring-[#243B5C] group-hover:ring-[#FFCC00]/50 transition-all flex-shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-[#F5F7FA] truncate group-hover:text-[#FFCC00] transition-colors">
                          {profile.full_name || profile.username}
                        </div>
                        <div className="text-sm text-[#64748B] truncate">@{profile.username}</div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center hidden sm:block">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#132440] rounded text-sm text-[#64748B]">
                        <Zap className="w-3 h-3" />
                        {0}
                      </span>
                    </div>
                    <div className="col-span-4 sm:col-span-3 text-right">
                      <span className="font-mono font-semibold text-[#94A3B8]">
                        {profile.total_score?.toLocaleString() ?? 0}
                      </span>
                      <span className="text-[#64748B] text-sm ml-1">pts</span>
                    </div>
                  </Link>
                ))}
              </div>

              {(!profiles || profiles.length === 0) && (
                <div className="py-20 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#132440] rounded-full flex items-center justify-center">
                    <Trophy className="w-8 h-8 text-[#64748B]" />
                  </div>
                  <p className="text-[#F5F7FA] font-semibold mb-2">No builders yet</p>
                  <p className="text-sm text-[#64748B]">Join hackathons to climb the leaderboard!</p>
                </div>
              )}
            </Card>
          </Container>
        </section>
      </div>
    </AppShell>
  );
}