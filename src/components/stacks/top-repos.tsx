"use client";

import { Card } from "@/components/ui/card";
import { Star, GitFork, ExternalLink } from "lucide-react";
import type { GitHubRepo } from "@/types/database";

interface TopReposProps {
  repos: GitHubRepo[];
  className?: string;
}

export function TopRepos({ repos, className = "" }: TopReposProps) {
  if (!repos || repos.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-medium text-[#737373] uppercase tracking-wider">
        Top Repositories
      </h3>
      <div className="grid gap-3">
        {repos.map((repo) => (
          <a
            key={repo.full_name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <Card className="p-4 hover:border-[#404040] transition-all duration-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[#FAFAFA] truncate group-hover:text-[#F59E0B] transition-colors">
                      {repo.name}
                    </h4>
                    <ExternalLink className="w-3.5 h-3.5 text-[#525252] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                  {repo.description && (
                    <p className="text-sm text-[#737373] mt-1 line-clamp-2">
                      {repo.description}
                    </p>
                  )}
                  
                  {/* Languages in this repo */}
                  {repo.languages && Object.keys(repo.languages).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {Object.entries(repo.languages)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 4)
                        .map(([lang, pct]) => (
                          <span
                            key={lang}
                            className="px-2 py-0.5 text-xs bg-[#262626] text-[#A1A1A1] rounded-full"
                          >
                            {lang} {pct.toFixed(0)}%
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 text-xs text-[#737373] flex-shrink-0">
                  {repo.stars > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" />
                      <span>{formatNumber(repo.stars)}</span>
                    </div>
                  )}
                  {repo.forks > 0 && (
                    <div className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" />
                      <span>{formatNumber(repo.forks)}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}



