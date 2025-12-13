import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/avatar";
import { AppShell } from "@/components/layout/app-shell";
import { isValidUrl } from "@/lib/utils/url";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Crosshair, Github } from "lucide-react";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: topBuilders }, { data: hackathons }, { data: bounties }] = await Promise.all([
    supabase.from("profiles").select("*").order("total_score", { ascending: false }).limit(9),
    supabase
      .from("hackathons")
      .select(`
        id, title, slug, start_date, end_date, location, is_online, cover_image,
        hackathon_participants(user_id, profiles(avatar_url, full_name))
      `)
      .gte("end_date", new Date().toISOString())
      .order("start_date", { ascending: true })
      .limit(6),
    supabase
      .from("bounties")
      .select("id, title, slug, reward_amount, reward_currency, status")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const topNine = topBuilders || [];
  const allHackathons = hackathons || [];
  const openBounties = bounties || [];
  const now = new Date();

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Hero Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            MEGAS
          </h1>
          <p className="text-[#999] text-lg">
            Europe's builder arena. Compete, ship, and rise to the top.
          </p>
        </div>

        {/* Leaderboard Section - 9 Cards Grid */}
        {topNine.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Leaderboard</h2>
                <p className="text-[#666] text-sm">Top builders</p>
              </div>
              <Link 
                href="/leaderboard" 
                className="px-4 py-2 rounded-lg border border-[#333] text-sm text-[#999] hover:text-white hover:border-[#666] transition-colors flex items-center gap-2"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* 9 Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {topNine.map((builder, index) => {
                const colors = [
                  { ring: "ring-[#FFCC00]/50", text: "text-[#FFCC00]", bg: "bg-[#FFCC00]" },
                  { ring: "ring-[#C0C0C0]/50", text: "text-[#C0C0C0]", bg: "bg-[#C0C0C0]" },
                  { ring: "ring-[#CD7F32]/50", text: "text-[#CD7F32]", bg: "bg-[#CD7F32]" },
                ];
                const color = index < 3 ? colors[index] : { ring: "ring-[#333]", text: "text-[#999]", bg: "bg-[#333]" };

                return (
                  <Link
                    key={builder.username}
                    href={"/profile/" + builder.username}
                    className="p-4 rounded-2xl border border-[#2A2A2A] bg-[#141414] hover:border-[#3A3A3A] hover:bg-[#1A1A1A] transition-all group"
                  >
                    {/* Header with avatar and rank */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative flex-shrink-0">
                        <Avatar
                          src={builder.altered_avatar_url || builder.avatar_url || builder.fetched_url}
                          fallback={builder.full_name || builder.username}
                          size="lg"
                          className={`ring-2 ${color.ring}`}
                        />
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full ${color.bg} flex items-center justify-center text-xs font-bold ${index < 3 ? "text-black" : "text-white"}`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate group-hover:text-[#FFCC00] transition-colors">
                          {builder.full_name || builder.username}
                        </p>
                        <p className="text-sm text-[#666] truncate">@{builder.username}</p>
                        <p className={`text-sm font-semibold ${color.text} mt-1`}>
                          {builder.total_score?.toLocaleString() || 0} pts
                        </p>
                      </div>
                    </div>

                    {/* Bio */}
                    {builder.bio && (
                      <p className="text-sm text-[#999] line-clamp-2 mb-3">
                        {builder.bio}
                      </p>
                    )}

                    {/* Footer with GitHub */}
                    {builder.github_username && (
                      <div className="flex items-center gap-2 text-sm text-[#666]">
                        <Github className="w-3.5 h-3.5" />
                        <span>{builder.github_username}</span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 3: Discover Hackathons */}
        <section>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Discover hackathons
            </h1>
            <p className="text-[#999]">
              Find hackathons and compete for bounties across Europe.
            </p>
          </div>

          {/* Popular Hackathons - Two Column Grid like Luma */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Popular hackathons</h2>
                <p className="text-[#666] text-sm">Europe</p>
              </div>
              <Link 
                href="/hackathons" 
                className="px-4 py-2 rounded-lg border border-[#333] text-sm text-[#999] hover:text-white hover:border-[#666] transition-colors flex items-center gap-2"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
              {allHackathons.map((hackathon) => {
                const startDate = new Date(hackathon.start_date);
                const endDate = new Date(hackathon.end_date);
                const isLive = now >= startDate && now <= endDate;

                return (
                  <Link 
                    key={hackathon.id} 
                    href={"/hackathons/" + hackathon.slug}
                    className="flex gap-4 group"
                  >
                    {/* Square Thumbnail */}
                    <div className="w-[100px] h-[100px] flex-shrink-0 rounded-xl overflow-hidden bg-[#1A1A1A] relative">
                      {isValidUrl(hackathon.cover_image) ? (
                        <Image
                          src={hackathon.cover_image}
                          alt={hackathon.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#333] to-[#1A1A1A]" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 py-1">
                      <h3 className="font-semibold text-white group-hover:text-[#FFCC00] transition-colors line-clamp-2 leading-snug">
                        {hackathon.title}
                      </h3>
                      
                      <p className="text-sm text-[#999] mt-2 flex items-center gap-2">
                        {isLive && (
                          <span className="flex items-center gap-1.5 text-[#10B981]">
                            <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                            LIVE
                          </span>
                        )}
                        <span>
                          {startDate.toLocaleDateString("en-US", { 
                            weekday: "short", 
                            day: "numeric", 
                            month: "short" 
                          })}, {startDate.toLocaleTimeString("en-US", { 
                            hour: "numeric", 
                            minute: "2-digit" 
                          })}
                        </span>
                      </p>
                      
                      <p className="text-sm text-[#666] mt-1">
                        {hackathon.is_online ? "Online" : hackathon.location}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {allHackathons.length === 0 && (
              <p className="text-[#666] py-8 text-center">No upcoming hackathons</p>
            )}
          </div>

          {/* Bounties Section */}
          {openBounties.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Open bounties</h2>
                  <p className="text-[#666] text-sm">Earn rewards</p>
                </div>
                <Link 
                  href="/bounties" 
                  className="px-4 py-2 rounded-lg border border-[#333] text-sm text-[#999] hover:text-white hover:border-[#666] transition-colors flex items-center gap-2"
                >
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {openBounties.map((bounty) => (
                  <Link
                    key={bounty.id}
                    href={"/bounties/" + bounty.slug}
                    className="flex items-center gap-4 p-4 rounded-xl bg-[#1A1A1A]/30 hover:bg-[#1A1A1A] transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                      <Crosshair className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white group-hover:text-[#10B981] transition-colors truncate">
                        {bounty.title}
                      </p>
                      <p className="text-sm text-[#10B981] font-semibold mt-0.5">
                        {bounty.reward_currency === "EUR" ? "€" : "$"}{bounty.reward_amount}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
    </AppShell>
  );
}
