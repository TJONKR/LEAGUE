"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HonorBadge } from "./honor-badge";
import { HONOR_METADATA } from "@/lib/honors";
import type { HonorType, PeerHonor, Project } from "@/types/database";
import { Award, TrendingUp } from "lucide-react";

interface ProfileHonorsProps {
  honors: (PeerHonor & { project: { title: string; slug: string } })[];
}

export function ProfileHonors({ honors }: ProfileHonorsProps) {
  if (!honors || honors.length === 0) return null;

  // Aggregate honors by type
  const honorCounts = (Object.keys(HONOR_METADATA) as HonorType[]).reduce(
    (acc, type) => {
      acc[type] = honors.filter((h) => h.honor_type === type).length;
      return acc;
    },
    {} as Record<HonorType, number>
  );

  // Sort by count descending
  const sortedHonors = (Object.entries(honorCounts) as [HonorType, number][])
    .filter(([, count]) => count > 0)
    .sort(([, a], [, b]) => b - a);

  const totalPoints = honors.reduce((sum, h) => sum + h.points, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Award className="w-4 h-4 text-[#E53935]" />
          Honors Received
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Honor badges */}
        <div className="flex flex-wrap gap-2">
          {sortedHonors.map(([type, count]) => (
            <HonorBadge
              key={type}
              type={type}
              count={count}
              size="md"
              showLabel
            />
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-[#262626]">
          <span className="text-sm text-[#737373]">Total honors</span>
          <span className="font-medium text-[#FAFAFA]">{honors.length}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#737373] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Points earned
          </span>
          <span className="font-medium text-[#22C55E]">+{totalPoints}</span>
        </div>
      </CardContent>
    </Card>
  );
}

