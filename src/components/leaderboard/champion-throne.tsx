"use client";

import { Avatar } from "@/components/ui/avatar";
import { Crown, Trophy, Sparkles, Flame } from "lucide-react";
import Link from "next/link";

interface ChampionThroneProps {
  champion: {
    username: string;
    full_name?: string | null;
    altered_avatar_url?: string | null;
    avatar_url?: string | null;
    fetched_url?: string | null;
    total_score?: number | null;
  };
}

export function ChampionThrone({ champion }: ChampionThroneProps) {
  return (
    <Link 
      href={"/profile/" + champion.username} 
      className="flex flex-col items-center group relative"
    >
      {/* Background Effects Container */}
      <div className="absolute -inset-16 pointer-events-none">
        {/* Light Rays - Rotating */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="w-80 h-80 rounded-full animate-[spin_30s_linear_infinite]"
            style={{
              background: `conic-gradient(
                from 0deg,
                transparent 0deg,
                rgba(255, 215, 0, 0.15) 15deg,
                transparent 30deg,
                transparent 45deg,
                rgba(255, 215, 0, 0.1) 60deg,
                transparent 75deg,
                transparent 90deg,
                rgba(255, 215, 0, 0.15) 105deg,
                transparent 120deg,
                transparent 135deg,
                rgba(255, 215, 0, 0.1) 150deg,
                transparent 165deg,
                transparent 180deg,
                rgba(255, 215, 0, 0.15) 195deg,
                transparent 210deg,
                transparent 225deg,
                rgba(255, 215, 0, 0.1) 240deg,
                transparent 255deg,
                transparent 270deg,
                rgba(255, 215, 0, 0.15) 285deg,
                transparent 300deg,
                transparent 315deg,
                rgba(255, 215, 0, 0.1) 330deg,
                transparent 345deg,
                transparent 360deg
              )`,
              filter: 'blur(2px)',
            }}
          />
        </div>
        
        {/* Floating Stars */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <Sparkles 
              key={i}
              className="absolute text-[#FFD700] animate-pulse"
              style={{
                left: `${15 + (i * 8) % 70}%`,
                top: `${10 + (i * 11) % 45}%`,
                width: `${12 + (i % 3) * 4}px`,
                height: `${12 + (i % 3) * 4}px`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1.5 + (i % 3) * 0.5}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>

        {/* Fire Embers Rising */}
        <div className="absolute bottom-[10%] left-0 right-0 h-[90%] overflow-visible">
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="absolute bottom-0 rounded-full animate-bounce"
              style={{
                left: `${30 + (i * 3) % 40}%`,
                width: `${4 + (i % 3) * 2}px`,
                height: `${4 + (i % 3) * 2}px`,
                background: `radial-gradient(circle, #FF6B35 0%, #E53935 60%, transparent 100%)`,
                boxShadow: `0 0 ${6 + (i % 3) * 2}px ${2 + (i % 2)}px rgba(255, 107, 53, 0.8)`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${1 + (i % 4) * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Fire Glow Base */}
        <div 
          className="absolute bottom-[5%] left-[10%] right-[10%] h-[45%] animate-pulse"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 100%, rgba(229, 57, 53, 0.5) 0%, rgba(255, 107, 53, 0.35) 30%, rgba(255, 152, 0, 0.15) 60%, transparent 100%)`,
            filter: 'blur(20px)',
          }}
        />
      </div>

      {/* Crown with Glow and Flames */}
      <div className="relative mb-1 z-10">
        {/* Crown Glow */}
        <div 
          className="absolute -inset-4 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.5) 0%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
        
        {/* Flame Icons Above Crown */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-2">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" style={{ animationDelay: '0s' }} />
          <Flame className="w-5 h-5 text-yellow-500 animate-pulse" style={{ animationDelay: '0.15s' }} />
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" style={{ animationDelay: '0.1s' }} />
        </div>
        
        <Crown 
          className="w-12 h-12 sm:w-14 sm:h-14 text-[#FFD700] drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] animate-bounce"
          style={{ animationDuration: '3s' }}
        />
      </div>
      
      {/* Avatar with Divine Rings */}
      <div className="relative mb-3 z-10">
        {/* Outer Divine Pulse Ring */}
        <div 
          className="absolute -inset-5 rounded-full border-2 border-[#FFD700]/40 animate-ping"
          style={{ animationDuration: '2s' }}
        />
        
        {/* Spinning Fire Ring */}
        <div 
          className="absolute -inset-3 rounded-full animate-[spin_4s_linear_infinite]"
          style={{
            background: `conic-gradient(from 0deg, rgba(229, 57, 53, 0.7), rgba(255, 107, 53, 0.7), rgba(255, 215, 0, 0.7), rgba(255, 107, 53, 0.7), rgba(229, 57, 53, 0.7))`,
            filter: 'blur(6px)',
          }}
        />
        
        {/* Golden Aura */}
        <div 
          className="absolute -inset-2 rounded-full animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.5) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
        
        <Avatar
          src={champion.altered_avatar_url || champion.avatar_url || champion.fetched_url}
          fallback={champion.full_name || champion.username}
          size="xl"
          className="relative ring-4 ring-[#FFD700] w-24 h-24 sm:w-28 sm:h-28 z-10"
        />
      </div>

      {/* Name */}
      <span className="font-bold text-[#FAFAFA] text-lg sm:text-xl mb-1 truncate max-w-full z-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
        {champion.full_name || champion.username}
      </span>
      <span className="text-sm text-[#A1A1A1] mb-4 z-10">@{champion.username}</span>
      
      {/* Throne Podium */}
      <div className="w-36 sm:w-44 z-10 relative">
        {/* Fire Rising Behind Podium */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-32 pointer-events-none">
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'radial-gradient(ellipse 100% 80% at 50% 100%, rgba(229, 57, 53, 0.6) 0%, rgba(255, 107, 53, 0.4) 30%, rgba(255, 152, 0, 0.2) 60%, transparent 100%)',
              filter: 'blur(15px)',
            }}
          />
        </div>
        
        <div 
          className="h-[180px] rounded-t-2xl flex flex-col items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, rgba(80, 80, 80, 0.95) 0%, rgba(50, 50, 50, 0.98) 30%, rgba(30, 30, 30, 1) 100%)',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            borderBottom: 'none',
            boxShadow: '0 0 60px rgba(255, 215, 0, 0.3), 0 0 100px rgba(229, 57, 53, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* Inner Top Glow */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 120% 60% at 50% 0%, rgba(255, 215, 0, 0.25) 0%, transparent 60%)',
            }}
          />
          
          {/* Fire Reflection at Bottom - More Intense */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[80%] animate-pulse"
            style={{
              background: 'linear-gradient(to top, rgba(229, 57, 53, 0.35) 0%, rgba(255, 107, 53, 0.2) 40%, transparent 100%)',
              animationDuration: '1.5s',
            }}
          />
          
          {/* Ember dots inside podium */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{
                  background: i % 2 === 0 ? '#FF6B35' : '#FFD700',
                  boxShadow: `0 0 8px 2px ${i % 2 === 0 ? 'rgba(255, 107, 53, 0.8)' : 'rgba(255, 215, 0, 0.8)'}`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1s',
                }}
              />
            ))}
          </div>
          
          <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-[#FFD700] mb-2 drop-shadow-[0_0_25px_rgba(255,215,0,0.9)] animate-pulse relative z-10" />
          <span className="text-5xl sm:text-6xl font-black text-[#FFD700] drop-shadow-[0_0_25px_rgba(255,215,0,0.6)] relative z-10">1</span>
          <span className="text-sm sm:text-base text-[#FF6B35] font-mono font-bold mt-2 drop-shadow-[0_0_15px_rgba(255,107,53,0.6)] relative z-10">
            {champion.total_score ?? 0} pts
          </span>
        </div>
      </div>
    </Link>
  );
}
