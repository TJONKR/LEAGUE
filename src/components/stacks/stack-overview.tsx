"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LanguageBar } from "./language-bar";
import { TopRepos } from "./top-repos";
import { Code2, Star, GitFork, FolderGit2 } from "lucide-react";
import type { StackWithDetails, GitHubRepo, LanguageStats } from "@/types/database";

interface StackOverviewProps {
  stack: StackWithDetails | null;
  className?: string;
}

export function StackOverview({ stack, className = "" }: StackOverviewProps) {
  if (!stack) {
    return (
      <Card className={className}>
        <CardContent className="py-12 text-center">
          <Code2 className="w-12 h-12 mx-auto text-[#404040] mb-4" />
          <p className="text-[#737373]">No stack data available</p>
          <p className="text-sm text-[#525252] mt-1">
            Connect GitHub to show your tech stack
          </p>
        </CardContent>
      </Card>
    );
  }

  // Parse JSON fields
  const topRepos = (stack.top_repos as unknown as GitHubRepo[]) || [];
  const languages = (stack.languages as unknown as LanguageStats) || {};

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="flex flex-col items-center">
            <FolderGit2 className="w-5 h-5 text-[#737373] mb-2" />
            <span className="text-2xl font-bold text-[#FAFAFA]">
              {stack.total_repos}
            </span>
            <span className="text-xs text-[#737373]">Repos</span>
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex flex-col items-center">
            <Star className="w-5 h-5 text-[#F59E0B] mb-2" />
            <span className="text-2xl font-bold text-[#FAFAFA]">
              {formatNumber(stack.total_stars)}
            </span>
            <span className="text-xs text-[#737373]">Stars</span>
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex flex-col items-center">
            <GitFork className="w-5 h-5 text-[#737373] mb-2" />
            <span className="text-2xl font-bold text-[#FAFAFA]">
              {formatNumber(stack.total_forks)}
            </span>
            <span className="text-xs text-[#737373]">Forks</span>
          </div>
        </Card>
      </div>

      {/* Tech Stack */}
      {Object.keys(languages).length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#737373]" />
              Tech Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LanguageBar languages={languages} />
          </CardContent>
        </Card>
      )}

      {/* Top Repos */}
      {topRepos.length > 0 && <TopRepos repos={topRepos} />}
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}



