"use client";

import { Avatar } from "@/components/ui/avatar";
import { Medal, Star, Sparkles } from "lucide-react";
import Link from "next/link";

interface RunnerUpPedestalProps {
  profile: {
    username: string;
    full_name?: string | null;
    altered_avatar_url?: string | null;
    avatar_url?: string | null;
    fetched_url?: string | null;
    total_score?: number | null;
  };
  position: 2 | 3;
}

const config = {
  2: {
    color: "#C0C0C0",
    height: "h-32 sm:h-36",
    avatarSize: "w-18 h-18 sm:w-20 sm:h-20",
    Icon: Medal,
  },
  3: {
    color: "#CD7F32",
    height: "h-24 sm:h-28",
    avatarSize: "w-16 h-16 sm:w-18 sm:h-18",
    Icon: Star,
  },
};

export function RunnerUpPedestal({ profile, position }: RunnerUpPedestalProps) {
  const { color, height, Icon } = config[position];

  return (
    <Link 
      href={"/profile/" + profile.username} 
      className="flex flex-col items-center group relative"
    >
      {/* Subtle glow background */}
      <div 
        className="absolute -inset-8 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 60%, ${color}30 0%, transparent 70%)`,
          filter: 'blur(15px)',
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute -inset-6 overflow-visible pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <Sparkles 
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${20 + (i * 15) % 60}%`,
              top: `${15 + (i * 12) % 40}%`,
              width: `${10 + (i % 2) * 2}px`,
              height: `${10 + (i % 2) * 2}px`,
              color: color,
              animationDelay: `${i * 0.3}s`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Avatar with ring */}
      <div className="relative mb-3 z-10">
        {/* Spinning ring */}
        <div 
          className="absolute -inset-2 rounded-full animate-[spin_6s_linear_infinite] opacity-50 group-hover:opacity-100 transition-opacity"
          style={{
            background: `conic-gradient(from 0deg, ${color}60, ${color}90, ${color}60)`,
            filter: 'blur(4px)',
          }}
        />
        <Avatar
          src={profile.altered_avatar_url || profile.avatar_url || profile.fetched_url}
          fallback={profile.full_name || profile.username}
          size="lg"
          className={`relative ring-3 z-10 ${position === 2 ? 'w-18 h-18 sm:w-20 sm:h-20' : 'w-16 h-16 sm:w-18 sm:h-18'}`}
          style={{ '--tw-ring-color': color } as React.CSSProperties}
        />
      </div>

      {/* Name */}
      <span className="font-semibold text-[#FAFAFA] text-sm sm:text-base mb-1 truncate max-w-full z-10">
        {profile.full_name || profile.username}
      </span>
      <span className="text-xs text-[#737373] mb-3 z-10">@{profile.username}</span>
      
      {/* Pedestal */}
      <div className="w-28 sm:w-36 z-10">
        <div 
          className={`${height} rounded-t-2xl flex flex-col items-center justify-center relative overflow-hidden transition-shadow`}
          style={{
            background: 'linear-gradient(to bottom, rgba(60, 60, 60, 0.9) 0%, rgba(40, 40, 40, 0.95) 30%, rgba(26, 26, 26, 1) 100%)',
            border: `1px solid ${color}40`,
            borderBottom: 'none',
            boxShadow: `0 0 25px ${color}20, inset 0 1px 0 rgba(255, 255, 255, 0.05)`,
          }}
        >
          {/* Top shine */}
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 100% 40% at 50% 0%, ${color}15 0%, transparent 60%)`,
            }}
          />
          
          <Icon 
            className="w-6 h-6 sm:w-7 sm:h-7 mb-1" 
            style={{ color, filter: `drop-shadow(0 0 10px ${color}80)` }}
          />
          <span 
            className="text-3xl sm:text-4xl font-black"
            style={{ color, textShadow: `0 0 15px ${color}60` }}
          >
            {position}
          </span>
          <span className="text-xs text-[#737373] font-mono mt-1">
            {profile.total_score ?? 0} pts
          </span>
        </div>
      </div>
    </Link>
  );
}
