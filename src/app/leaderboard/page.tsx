import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { AppShell } from "@/components/layout/app-shell";
import Link from "next/link";
import { Crown, Flame, TrendingUp, Zap, Trophy, Medal, Star } from "lucide-react";
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
      {/* Hero Header */}
      <section className="relative pt-8 pb-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E53935]/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E53935]/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FF7043]/10 rounded-full blur-3xl" />
        
        <Container>
          <div className="relative text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E53935]/10 border border-[#E53935]/20 rounded-full text-[#E53935] text-sm font-medium mb-6">
              <Flame className="w-4 h-4" />
              <span>Season 1 Active</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#FAFAFA] mb-3">
              Global Leaderboard
            </h1>
            <p className="text-lg text-[#737373] max-w-md mx-auto">
              The top builders competing for glory
            </p>
          </div>
        </Container>
      </section>

      {/* Podium Section */}
      {topThree.length > 0 && (
        <section className="relative pb-8">
          <Container>
            <div className="relative">
              {/* Glow effect behind podium */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FFD700]/5 via-transparent to-transparent" />
              
              <div className="relative flex items-end justify-center gap-3 sm:gap-6 pt-8">
                {/* 2nd Place */}
                <div className="flex-1 max-w-[140px] sm:max-w-[180px]">
                  {topThree[1] ? (
                    <Link href={"/profile/" + topThree[1].username} className="block group">
                      <div className="flex flex-col items-center">
                        {/* Avatar with ring */}
                        <div className="relative mb-3">
                          <div className="absolute -inset-1 bg-gradient-to-b from-[#C0C0C0] to-[#808080] rounded-full opacity-50 group-hover:opacity-100 transition-opacity blur-sm" />
                          <Avatar
                            src={topThree[1].altered_avatar_url || topThree[1].avatar_url || topThree[1].fetched_url}
                            fallback={topThree[1].full_name || topThree[1].username}
                            size="xl"
                            className="relative ring-3 ring-[#C0C0C0] w-16 h-16 sm:w-20 sm:h-20"
                          />
                        </div>
                        <span className="font-semibold text-[#FAFAFA] text-sm sm:text-base mb-1 truncate max-w-full">
                          {topThree[1].full_name || topThree[1].username}
                        </span>
                        <span className="text-xs text-[#737373] mb-3">@{topThree[1].username}</span>
                        
                        {/* Podium */}
                        <div className="w-full">
                          <div className="h-24 sm:h-32 bg-gradient-to-b from-[#404040] via-[#2A2A2A] to-[#1A1A1A] rounded-t-2xl flex flex-col items-center justify-center border-t border-x border-[#505050] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#C0C0C0]/10 to-transparent" />
                            <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-[#C0C0C0] mb-1" />
                            <span className="text-3xl sm:text-4xl font-black text-[#C0C0C0]">2</span>
                            <span className="text-xs text-[#737373] font-mono mt-1">{topThree[1].total_score ?? 0} pts</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : <div className="h-32" />}
                </div>

                {/* 1st Place */}
                <div className="flex-1 max-w-[160px] sm:max-w-[200px] -mt-8">
                  {topThree[0] && (
                    <Link href={"/profile/" + topThree[0].username} className="block group">
                      <div className="flex flex-col items-center">
                        {/* Crown */}
                        <div className="mb-2 relative">
                          <Crown className="w-10 h-10 sm:w-12 sm:h-12 text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                        </div>
                        
                        {/* Avatar with golden ring */}
                        <div className="relative mb-3">
                          <div className="absolute -inset-2 bg-gradient-to-b from-[#FFD700] to-[#FFA500] rounded-full opacity-40 group-hover:opacity-70 transition-opacity blur-md animate-pulse" />
                          <Avatar
                            src={topThree[0].altered_avatar_url || topThree[0].avatar_url || topThree[0].fetched_url}
                            fallback={topThree[0].full_name || topThree[0].username}
                            size="xl"
                            className="relative ring-4 ring-[#FFD700] w-20 h-20 sm:w-24 sm:h-24"
                          />
                        </div>
                        <span className="font-bold text-[#FAFAFA] text-base sm:text-lg mb-1 truncate max-w-full">
                          {topThree[0].full_name || topThree[0].username}
                        </span>
                        <span className="text-xs text-[#737373] mb-3">@{topThree[0].username}</span>
                        
                        {/* Podium */}
                        <div className="w-full">
                          <div className="h-36 sm:h-44 bg-gradient-to-b from-[#4A4A4A] via-[#333333] to-[#1A1A1A] rounded-t-2xl flex flex-col items-center justify-center border-t border-x border-[#5A5A5A] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/15 to-transparent" />
                            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-[#FFD700] mb-1" />
                            <span className="text-4xl sm:text-5xl font-black text-[#FFD700]">1</span>
                            <span className="text-sm text-[#E53935] font-mono font-bold mt-1">{topThree[0].total_score ?? 0} pts</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>

                {/* 3rd Place */}
                <div className="flex-1 max-w-[140px] sm:max-w-[180px]">
                  {topThree[2] ? (
                    <Link href={"/profile/" + topThree[2].username} className="block group">
                      <div className="flex flex-col items-center">
                        {/* Avatar with ring */}
                        <div className="relative mb-3">
                          <div className="absolute -inset-1 bg-gradient-to-b from-[#CD7F32] to-[#8B4513] rounded-full opacity-50 group-hover:opacity-100 transition-opacity blur-sm" />
                          <Avatar
                            src={topThree[2].altered_avatar_url || topThree[2].avatar_url || topThree[2].fetched_url}
                            fallback={topThree[2].full_name || topThree[2].username}
                            size="lg"
                            className="relative ring-3 ring-[#CD7F32] w-14 h-14 sm:w-16 sm:h-16"
                          />
                        </div>
                        <span className="font-semibold text-[#FAFAFA] text-sm sm:text-base mb-1 truncate max-w-full">
                          {topThree[2].full_name || topThree[2].username}
                        </span>
                        <span className="text-xs text-[#737373] mb-3">@{topThree[2].username}</span>
                        
                        {/* Podium */}
                        <div className="w-full">
                          <div className="h-20 sm:h-24 bg-gradient-to-b from-[#3A3A3A] via-[#282828] to-[#1A1A1A] rounded-t-2xl flex flex-col items-center justify-center border-t border-x border-[#4A4A4A] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#CD7F32]/10 to-transparent" />
                            <Star className="w-5 h-5 sm:w-6 sm:h-6 text-[#CD7F32] mb-1" />
                            <span className="text-2xl sm:text-3xl font-black text-[#CD7F32]">3</span>
                            <span className="text-xs text-[#737373] font-mono mt-1">{topThree[2].total_score ?? 0} pts</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : <div className="h-24" />}
                </div>
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
              <div className="p-2 bg-[#1A1A1A] rounded-lg">
                <TrendingUp className="w-5 h-5 text-[#E53935]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#FAFAFA]">Rankings</h2>
                <p className="text-sm text-[#737373]">{profiles?.length || 0} builders competing</p>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-[#262626]">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 text-xs uppercase tracking-wider text-[#737373] font-semibold bg-[#0D0D0D] border-b border-[#262626]">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-7 sm:col-span-6">Builder</div>
              <div className="col-span-2 text-center hidden sm:block">Hackathons</div>
              <div className="col-span-4 sm:col-span-3 text-right">Points</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-[#1A1A1A]">
              {topThree.map((profile, index) => (
                <Link
                  key={profile.id}
                  href={"/profile/" + profile.username}
                  className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center hover:bg-[#1A1A1A]/50 transition-all group"
                >
                  <div className="col-span-1 flex justify-center">
                    <div className={"w-8 h-8 rounded-lg flex items-center justify-center text-lg " + 
                      (index === 0 ? "bg-[#FFD700]/20" : index === 1 ? "bg-[#C0C0C0]/20" : "bg-[#CD7F32]/20")
                    }>
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                    </div>
                  </div>
                  <div className="col-span-7 sm:col-span-6 flex items-center gap-3 min-w-0">
                    <Avatar 
                      src={profile.altered_avatar_url || profile.avatar_url || profile.fetched_url} 
                      fallback={profile.full_name || profile.username} 
                      size="md"
                      className="ring-2 ring-[#262626] group-hover:ring-[#E53935]/50 transition-all flex-shrink-0" 
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-[#FAFAFA] truncate group-hover:text-[#E53935] transition-colors">
                        {profile.full_name || profile.username}
                      </div>
                      <div className="text-sm text-[#737373] truncate">@{profile.username}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center hidden sm:block">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1A1A1A] rounded text-sm text-[#A1A1A1]">
                      <Zap className="w-3 h-3" />
                      {0}
                    </span>
                  </div>
                  <div className="col-span-4 sm:col-span-3 text-right">
                    <span className={"font-mono font-bold text-lg " + 
                      (index === 0 ? "text-[#FFD700]" : index === 1 ? "text-[#C0C0C0]" : "text-[#CD7F32]")
                    }>
                      {profile.total_score?.toLocaleString() ?? 0}
                    </span>
                    <span className="text-[#737373] text-sm ml-1">pts</span>
                  </div>
                </Link>
              ))}

              {rest.map((profile, index) => (
                <Link
                  key={profile.id}
                  href={"/profile/" + profile.username}
                  className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-4 items-center hover:bg-[#1A1A1A]/50 transition-all group"
                >
                  <div className="col-span-1 flex justify-center">
                    <span className="w-8 h-8 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-sm font-bold text-[#737373]">
                      {index + 4}
                    </span>
                  </div>
                  <div className="col-span-7 sm:col-span-6 flex items-center gap-3 min-w-0">
                    <Avatar 
                      src={profile.altered_avatar_url || profile.avatar_url || profile.fetched_url} 
                      fallback={profile.full_name || profile.username} 
                      size="md"
                      className="ring-2 ring-[#262626] group-hover:ring-[#E53935]/50 transition-all flex-shrink-0" 
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-[#FAFAFA] truncate group-hover:text-[#E53935] transition-colors">
                        {profile.full_name || profile.username}
                      </div>
                      <div className="text-sm text-[#737373] truncate">@{profile.username}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center hidden sm:block">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#1A1A1A] rounded text-sm text-[#737373]">
                      <Zap className="w-3 h-3" />
                      {0}
                    </span>
                  </div>
                  <div className="col-span-4 sm:col-span-3 text-right">
                    <span className="font-mono font-semibold text-[#A1A1A1]">
                      {profile.total_score?.toLocaleString() ?? 0}
                    </span>
                    <span className="text-[#737373] text-sm ml-1">pts</span>
                  </div>
                </Link>
              ))}
            </div>

            {(!profiles || profiles.length === 0) && (
              <div className="py-20 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#1A1A1A] rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-[#737373]" />
                </div>
                <p className="text-[#FAFAFA] font-semibold mb-2">No builders yet</p>
                <p className="text-sm text-[#737373]">Join hackathons to climb the leaderboard!</p>
              </div>
            )}
          </Card>
        </Container>
      </section>
    </AppShell>
  );
}
