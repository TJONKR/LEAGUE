"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const sizes = {
  xs: { class: "w-6 h-6 text-[10px]", px: 24 },
  sm: { class: "w-8 h-8 text-xs", px: 32 },
  md: { class: "w-10 h-10 text-sm", px: 40 },
  lg: { class: "w-14 h-14 text-base", px: 56 },
  xl: { class: "w-20 h-20 text-xl", px: 80 },
};

function Avatar({ className, src, fallback, size = "md", ...props }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = fallback?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const showFallback = !src || imageError;

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full bg-[#262626] text-[#A1A1A1] font-medium overflow-hidden",
        sizes[size].class,
        className
      )}
      {...props}
    >
      {!showFallback ? (
        <Image
          src={src}
          alt={fallback || "Avatar"}
          width={sizes[size].px}
          height={sizes[size].px}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span>{initials || "?"}</span>
      )}
    </div>
  );
}

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  avatars?: Array<{ src: string | null; fallback: string }>;
  max?: number;
  limit?: number;
  size?: "xs" | "sm" | "md" | "lg";
}

function AvatarGroup({ className, avatars = [], max = 4, limit, size = "sm", ...props }: AvatarGroupProps) {
  const effectiveLimit = limit ?? max;
  const visible = avatars.slice(0, effectiveLimit);
  const remaining = avatars.length - effectiveLimit;

  return (
    <div className={cn("flex items-center -space-x-2", className)} {...props}>
      {visible.map((avatar, i) => (
        <Avatar 
          key={i} 
          src={avatar.src} 
          fallback={avatar.fallback} 
          size={size}
          className="ring-2 ring-[#0A0A0A]"
        />
      ))}
      {remaining > 0 && (
        <div className={cn(
          "flex items-center justify-center rounded-full bg-[#262626] text-[#A1A1A1] font-medium ring-2 ring-[#0A0A0A]",
          sizes[size].class
        )}>
          +{remaining}
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup };
