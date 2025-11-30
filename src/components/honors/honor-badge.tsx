"use client";

import { cn } from "@/lib/utils";
import { HONOR_METADATA } from "@/lib/honors";
import type { HonorType } from "@/types/database";

interface HonorBadgeProps {
  type: HonorType;
  count?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function HonorBadge({
  type,
  count,
  size = "md",
  showLabel = false,
  className,
}: HonorBadgeProps) {
  const honor = HONOR_METADATA[type];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-all",
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-3 py-1 text-sm": size === "md",
          "px-4 py-1.5 text-base": size === "lg",
        },
        className
      )}
      style={{
        backgroundColor: `${honor.color}15`,
        color: honor.color,
      }}
      title={honor.description}
    >
      <span className={cn({
        "text-sm": size === "sm",
        "text-base": size === "md",
        "text-lg": size === "lg",
      })}>
        {honor.emoji}
      </span>
      {showLabel && <span>{honor.label}</span>}
      {count !== undefined && count > 0 && (
        <span className="font-bold">×{count}</span>
      )}
    </div>
  );
}

interface HonorBadgeListProps {
  honors: { type: HonorType; count: number }[];
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function HonorBadgeList({ honors, size = "md", className }: HonorBadgeListProps) {
  const filteredHonors = honors.filter((h) => h.count > 0);
  
  if (filteredHonors.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filteredHonors.map((honor) => (
        <HonorBadge
          key={honor.type}
          type={honor.type}
          count={honor.count}
          size={size}
        />
      ))}
    </div>
  );
}

