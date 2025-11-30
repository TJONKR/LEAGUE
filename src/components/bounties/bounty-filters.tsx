"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface BountyFiltersProps {
  currentStatus: string;
  currentTag?: string;
  currentSort: string;
}

const POPULAR_TAGS = ["AI", "Web3", "Mobile", "API", "Data", "Automation", "Design", "DevOps"];

export function BountyFilters({ currentStatus, currentTag, currentSort }: BountyFiltersProps) {
  const router = useRouter();

  function handleSortChange(sort: string) {
    const params = new URLSearchParams();
    params.set("status", currentStatus);
    if (currentTag) params.set("tag", currentTag);
    params.set("sort", sort);
    router.push(`/bounties?${params.toString()}`);
  }

  return (
    <>
      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Status Tabs */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: "open", label: "Open" },
            { value: "in_review", label: "In Review" },
            { value: "awarded", label: "Awarded" },
            { value: "all", label: "All" },
          ].map((tab) => (
            <Link
              key={tab.value}
              href={`/bounties?status=${tab.value}${currentTag ? `&tag=${currentTag}` : ""}${currentSort !== "newest" ? `&sort=${currentSort}` : ""}`}
            >
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentStatus === tab.value
                    ? "bg-[#1A1A1A] text-[#FAFAFA]"
                    : "text-[#737373] hover:text-[#FAFAFA] hover:bg-[#1A1A1A]/50"
                }`}
              >
                {tab.label}
              </button>
            </Link>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-sm text-[#737373]">Sort:</span>
          <select
            value={currentSort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-3 py-2 bg-[#1A1A1A] border border-[#262626] rounded-lg text-sm text-[#FAFAFA] focus:outline-none focus:border-[#F59E0B]"
          >
            <option value="newest">Newest</option>
            <option value="reward">Highest Reward</option>
            <option value="deadline">Deadline</option>
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-8">
        {currentTag && (
          <Link href={`/bounties?status=${currentStatus}${currentSort !== "newest" ? `&sort=${currentSort}` : ""}`}>
            <Badge variant="primary" className="cursor-pointer">
              {currentTag} ×
            </Badge>
          </Link>
        )}
        {!currentTag && (
          <>
            {POPULAR_TAGS.map((tag) => (
              <Link
                key={tag}
                href={`/bounties?status=${currentStatus}&tag=${tag}${currentSort !== "newest" ? `&sort=${currentSort}` : ""}`}
              >
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-[#262626] transition-colors"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </>
        )}
      </div>
    </>
  );
}




