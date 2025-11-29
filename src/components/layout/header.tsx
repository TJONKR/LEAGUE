"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, Calendar, Search, Bell, Plus, Crosshair } from "lucide-react";

export function Header() {
  const { user, profile, isLoading } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { href: "/hackathons", label: "Hackathons", icon: Calendar },
    { href: "/bounties", label: "Bounties", icon: Crosshair },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-xl">
      <Container size="xl">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center group">
            <div className="w-8 h-8 bg-[#E53935] rounded-lg flex items-center justify-center group-hover:bg-[#EF5350] transition-colors">
              <span className="text-white font-bold text-sm">L</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${isActive 
                      ? "bg-[#1A1A1A] text-[#FAFAFA]" 
                      : "text-[#737373] hover:text-[#FAFAFA] hover:bg-[#1A1A1A]/50"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button className="p-2 text-[#737373] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] rounded-full transition-all">
              <Search className="w-4 h-4" />
            </button>

            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-[#1A1A1A] animate-pulse" />
            ) : user ? (
              <>
                <Link href="/hackathons/new">
                  <Button size="sm" className="hidden sm:flex items-center gap-1.5 rounded-full px-4">
                    <Plus className="w-4 h-4" />
                    <span>Create</span>
                  </Button>
                </Link>

                <button className="p-2 text-[#737373] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] rounded-full transition-all relative">
                  <Bell className="w-4 h-4" />
                </button>

                <Link href={`/profile/${profile?.username || ""}`} className="ml-1">
                  <Avatar
                    src={profile?.altered_avatar_url || profile?.avatar_url || profile?.fetched_url}
                    fallback={profile?.full_name || profile?.username || "U"}
                    size="sm"
                    className="ring-2 ring-transparent hover:ring-[#262626] transition-all"
                  />
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="rounded-full px-5">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
