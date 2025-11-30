"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Trophy, Calendar, Search, Bell, Plus, Crosshair, User, Settings, LogOut } from "lucide-react";

export function Header() {
  const { user, profile, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setShowDropdown(false);
    router.push("/");
    router.refresh();
  }

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
            <div className="w-[100px] h-[100px] flex items-center justify-center group-hover:opacity-80 transition-opacity">
              <img src='logo.png' alt="Logo" className="w-full h-full" />
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

                {/* Avatar with dropdown */}
                <div className="relative ml-1" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="focus:outline-none"
                  >
                    <Avatar
                      src={profile?.altered_avatar_url || profile?.avatar_url || profile?.fetched_url}
                      fallback={profile?.full_name || profile?.username || "U"}
                      size="sm"
                      className="ring-2 ring-transparent hover:ring-[#262626] transition-all cursor-pointer"
                    />
                  </button>

                  {/* Dropdown menu */}
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#141414] border border-[#262626] rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-[#262626]">
                        <p className="text-sm font-medium text-[#FAFAFA] truncate">
                          {profile?.full_name || profile?.username || "User"}
                        </p>
                        <p className="text-xs text-[#737373] truncate">
                          @{profile?.username || "username"}
                        </p>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          href={profile?.username ? `/profile/${profile.username}` : "/settings"}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#A1A1A1] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#A1A1A1] hover:text-[#FAFAFA] hover:bg-[#1A1A1A] transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </div>

                      <div className="border-t border-[#262626] py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#E53935] hover:bg-[#1A1A1A] transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
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