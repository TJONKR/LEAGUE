import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Clock, Users } from "lucide-react";
import type { BountyWithPoster, BountyStatus } from "@/types/database";

interface BountyCardProps {
  bounty: BountyWithPoster;
  submissionCount?: number;
}

function getStatusBadge(status: BountyStatus) {
  switch (status) {
    case "open":
      return { variant: "success" as const, label: "Open" };
    case "in_review":
      return { variant: "warning" as const, label: "In Review" };
    case "awarded":
      return { variant: "primary" as const, label: "Awarded" };
    case "completed":
      return { variant: "default" as const, label: "Completed" };
    case "cancelled":
      return { variant: "outline" as const, label: "Cancelled" };
    default:
      return { variant: "default" as const, label: status };
  }
}

function getTimeRemaining(deadline: string): string {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate.getTime() - now.getTime();

  if (diff < 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h left`;
  
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes}m left`;
}

export function BountyCard({ bounty, submissionCount = 0 }: BountyCardProps) {
  const statusBadge = getStatusBadge(bounty.status);
  const timeRemaining = getTimeRemaining(bounty.deadline);
  const isEnded = timeRemaining === "Ended";

  return (
    <Link href={`/bounties/${bounty.slug}`}>
      <Card hover className="h-full overflow-hidden group">
        {/* Cover Image Header */}
        <div className="h-28 relative bg-gradient-to-br from-[#262626] to-[#1C1C1C]">
          {bounty.cover_image ? (
            <Image
              src={bounty.cover_image}
              alt={bounty.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#F59E0B]/20 to-[#EF4444]/10" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
          
          {/* Status Badge */}
          <Badge variant={statusBadge.variant} size="sm" className="absolute top-3 right-3">
            {statusBadge.label}
          </Badge>

          {/* Reward Badge */}
          <div className="absolute bottom-3 left-3 bg-[#0A0A0A]/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
            <span className="text-[#F59E0B] font-bold text-lg">€{bounty.reward_amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-[#FAFAFA] text-lg mb-2 line-clamp-1 group-hover:text-[#F59E0B] transition-colors">
            {bounty.title}
          </h3>
          
          {bounty.description && (
            <p className="text-sm text-[#737373] mb-4 line-clamp-2">
              {bounty.description}
            </p>
          )}

          {/* Tags */}
          {bounty.tags && bounty.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {bounty.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-[#262626] text-[#A1A1A1] rounded-full"
                >
                  {tag}
                </span>
              ))}
              {bounty.tags.length > 3 && (
                <span className="px-2 py-0.5 text-xs text-[#737373]">
                  +{bounty.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1F1F1F]">
            <div className="flex items-center gap-2">
              <Avatar
                src={bounty.poster.altered_avatar_url || bounty.poster.avatar_url || bounty.poster.fetched_url}
                fallback={bounty.poster.full_name || bounty.poster.username || "U"}
                size="xs"
              />
              <span className="text-xs text-[#737373] truncate max-w-[100px]">
                {bounty.poster.full_name || bounty.poster.username}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#737373]">
              {submissionCount > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{submissionCount}</span>
                </div>
              )}
              <div className={`flex items-center gap-1 ${isEnded ? "text-[#EF4444]" : ""}`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{timeRemaining}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

