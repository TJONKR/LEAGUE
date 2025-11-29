import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppShell } from "@/components/layout/app-shell";
import { BountyCard } from "@/components/bounties/bounty-card";
import { BountyFilters } from "@/components/bounties/bounty-filters";
import Link from "next/link";
import type { Metadata } from "next";
import type { BountyWithPoster } from "@/types/database";

export const metadata: Metadata = {
  title: "Bounties",
  description: "Discover bounties and earn rewards for solving real problems.",
};

interface SearchParams {
  status?: string;
  tag?: string;
  sort?: string;
}

export default async function BountiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  // Build query
  let query = supabase
    .from("bounties")
    .select(`
      *,
      poster:profiles!bounties_poster_id_fkey(*)
    `);

  // Filter by status
  const statusFilter = params.status || "open";
  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  // Filter by tag
  if (params.tag) {
    query = query.contains("tags", [params.tag]);
  }

  // Sort
  const sortBy = params.sort || "newest";
  switch (sortBy) {
    case "reward":
      query = query.order("reward_amount", { ascending: false });
      break;
    case "deadline":
      query = query.order("deadline", { ascending: true });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data: bounties } = await query;

  // Get submission counts for each bounty
  const bountyIds = bounties?.map((b) => b.id) || [];
  const { data: submissionCounts } = await supabase
    .from("bounty_submissions")
    .select("bounty_id")
    .in("bounty_id", bountyIds.length > 0 ? bountyIds : ["none"]);

  const countMap = new Map<string, number>();
  submissionCounts?.forEach((s) => {
    countMap.set(s.bounty_id, (countMap.get(s.bounty_id) || 0) + 1);
  });

  // Calculate stats
  const { data: stats } = await supabase
    .from("bounties")
    .select("reward_amount, status")
    .eq("status", "open");
  
  const totalRewards = stats?.reduce((acc, b) => acc + b.reward_amount, 0) || 0;
  const openCount = stats?.length || 0;

  return (
    <AppShell>
      <section className="py-12">
        <Container>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-[#FAFAFA]">Bounties</h1>
              <p className="text-[#737373] mt-2">
                Solve real problems and earn rewards
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-6 text-sm">
                <div>
                  <span className="text-[#737373]">Open Bounties: </span>
                  <span className="text-[#FAFAFA] font-semibold">{openCount}</span>
                </div>
                <div>
                  <span className="text-[#737373]">Total Rewards: </span>
                  <span className="text-[#F59E0B] font-semibold">
                    €{totalRewards.toLocaleString()}
                  </span>
                </div>
              </div>
              <Link href="/bounties/new">
                <Button className="rounded-full">Post Bounty</Button>
              </Link>
            </div>
          </div>

          {/* Client-side Filters */}
          <BountyFilters
            currentStatus={statusFilter}
            currentTag={params.tag}
            currentSort={sortBy}
          />

          {/* Bounties Grid */}
          {bounties && bounties.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bounties.map((bounty) => (
                <BountyCard
                  key={bounty.id}
                  bounty={bounty as BountyWithPoster}
                  submissionCount={countMap.get(bounty.id) || 0}
                />
              ))}
            </div>
          ) : (
            <Card className="p-16 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <p className="text-[#FAFAFA] font-medium mb-2">No bounties found</p>
              <p className="text-sm text-[#737373] mb-6">
                {statusFilter === "open"
                  ? "Be the first to post a bounty!"
                  : "No bounties match your filters."}
              </p>
              <Link href="/bounties/new">
                <Button variant="outline" className="rounded-full">
                  Post Bounty
                </Button>
              </Link>
            </Card>
          )}
        </Container>
      </section>
    </AppShell>
  );
}
