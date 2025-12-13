import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/components/layout/app-shell";
import { isValidUrl } from "@/lib/utils/url";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hackathons",
  description: "Discover and join hackathons.",
};

export default async function HackathonsPage() {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data: upcoming } = await supabase
    .from("hackathons")
    .select(`
      *,
      hackathon_participants(user_id, profiles(avatar_url, full_name))
    `)
    .gte("end_date", now)
    .order("start_date", { ascending: true });

  const { data: past } = await supabase
    .from("hackathons")
    .select(`
      *,
      hackathon_participants(user_id, profiles(avatar_url, full_name))
    `)
    .lt("end_date", now)
    .order("start_date", { ascending: false })
    .limit(6);

  return (
    <AppShell>
      <section className="py-12">
        <Container>
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-[#F5F7FA]">Hackathons</h1>
              <p className="text-[#64748B] mt-2">Discover events and start building</p>
            </div>
            <Link href="/hackathons/new">
              <Button className="rounded-full">Create Hackathon</Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-[#003399]/20 text-[#FFCC00] border border-[#003399]/50">
              Upcoming
            </button>
            <button className="px-4 py-2 rounded-full text-sm font-medium text-[#64748B] hover:text-[#F5F7FA] hover:bg-[#132440] transition-all">
              Past
            </button>
          </div>

          {/* Upcoming Grid */}
          {upcoming && upcoming.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((hackathon) => {
                const participants = hackathon.hackathon_participants || [];
                const avatars = participants.slice(0, 4).map((p: any) => ({
                  src: p.profiles?.avatar_url,
                  fallback: p.profiles?.full_name || "U",
                }));

                const startDate = new Date(hackathon.start_date);
                const endDate = new Date(hackathon.end_date);
                const isOngoing = new Date() >= startDate && new Date() <= endDate;

                return (
                  <Link key={hackathon.id} href={"/hackathons/" + hackathon.slug}>
                    <Card hover className="h-full overflow-hidden">
                      {/* Cover Image Header */}
                      <div className="h-32 relative bg-gradient-to-br from-[#243B5C] to-[#132440]">
                        {isValidUrl(hackathon.cover_image) ? (
                          <Image
                            src={hackathon.cover_image}
                            alt={hackathon.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#003399]/30 to-[#FFCC00]/10" />
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#132440] via-transparent to-transparent" />
                        
                        {isOngoing && (
                          <Badge variant="success" size="sm" className="absolute top-3 right-3">
                            Live
                          </Badge>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-[#F5F7FA] text-lg mb-2">{hackathon.title}</h3>
                        <div className="space-y-2 text-sm text-[#64748B] mb-4">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>
                              {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                              {hackathon.end_date !== hackathon.start_date && (
                                <> - {endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{hackathon.is_online ? "🌐" : "📍"}</span>
                            <span>{hackathon.is_online ? "Online" : hackathon.location}</span>
                          </div>
                        </div>
                        {participants.length > 0 && (
                          <div className="flex items-center gap-2 pt-4 border-t border-[#243B5C]">
                            <AvatarGroup avatars={avatars} size="xs" max={4} />
                            <span className="text-xs text-[#64748B]">{participants.length} joined</span>
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
              <div className="text-5xl mb-4">🎯</div>
              <p className="text-[#F5F7FA] font-medium mb-2">No upcoming hackathons</p>
              <p className="text-sm text-[#64748B] mb-6">Be the first to create one!</p>
              <Link href="/hackathons/new">
                <Button variant="outline" className="rounded-full">Create Hackathon</Button>
              </Link>
            </Card>
          )}

          {/* Past Events */}
          {past && past.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-semibold text-[#F5F7FA] mb-6">Past Events</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {past.map((hackathon) => {
                  const participants = hackathon.hackathon_participants || [];

                  return (
                    <Link key={hackathon.id} href={"/hackathons/" + hackathon.slug}>
                      <Card hover className="h-full overflow-hidden opacity-60 hover:opacity-100 transition-opacity">
                        {/* Cover Image Header for Past */}
                        <div className="h-24 relative bg-gradient-to-br from-[#243B5C] to-[#132440]">
                          {isValidUrl(hackathon.cover_image) ? (
                            <Image
                              src={hackathon.cover_image}
                              alt={hackathon.title}
                              fill
                              className="object-cover grayscale"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#003399]/15 to-[#FFCC00]/5" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#132440] via-transparent to-transparent" />
                        </div>
                        <div className="p-5">
                          <h3 className="font-semibold text-[#F5F7FA] mb-2">{hackathon.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-[#64748B]">
                            <span>📅</span>
                            <span>
                              {new Date(hackathon.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                            <span>•</span>
                            <span>{participants.length} participants</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </Container>
      </section>
    </AppShell>
  );
}
