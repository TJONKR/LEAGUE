"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Search, Bell, Plus, User, Settings, LogOut, FolderKanban, Calendar } from "lucide-react";

export function Header() {
  const { user, profile, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (addDropdownRef.current && !addDropdownRef.current.contains(event.target as Node)) {
        setShowAddDropdown(false);
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
    { href: "/hackathons", label: "Hackathons" },
    { href: "/bounties", label: "Bounties" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0A1628]/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center group flex-shrink-0 mr-8">
            <Image 
              src="/logo.png" 
              alt="MEGAS" 
              width={100} 
              height={32} 
              className="h-6 w-auto group-hover:opacity-80 transition-opacity"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${isActive ? "text-[#F5F7FA]" : "text-[#64748B] hover:text-[#F5F7FA]"}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-[#132440] animate-pulse" />
            ) : user ? (
              <>
                <div className="relative" ref={addDropdownRef}>
                  <button 
                    className="text-sm font-medium text-[#64748B] hover:text-[#F5F7FA] transition-colors"
                    onClick={() => setShowAddDropdown(!showAddDropdown)}
                  >
                    Create
                  </button>
                  {showAddDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="py-1">
                        <Link href="/projects/new" onClick={() => setShowAddDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#999] hover:text-white hover:bg-[#252525] transition-colors">
                          <FolderKanban className="w-4 h-4" />
                          New Project
                        </Link>
                        <Link href="/hackathons/new" onClick={() => setShowAddDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#999] hover:text-white hover:bg-[#252525] transition-colors">
                          <Calendar className="w-4 h-4" />
                          New Hackathon
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                <button className="p-2 text-[#64748B] hover:text-[#F5F7FA] transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-2 text-[#64748B] hover:text-[#F5F7FA] transition-colors relative">
                  <Bell className="w-4 h-4" />
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setShowDropdown(!showDropdown)} className="focus:outline-none">
                    <Avatar
                      src={profile?.altered_avatar_url || profile?.avatar_url || profile?.fetched_url}
                      fallback={profile?.full_name || profile?.username || "U"}
                      size="sm"
                      className="ring-2 ring-transparent hover:ring-white/20 transition-all cursor-pointer"
                    />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-[#333]">
                        <p className="text-sm font-medium text-white truncate">{profile?.full_name || profile?.username || "User"}</p>
                        <p className="text-xs text-[#666] truncate">@{profile?.username || "username"}</p>
                      </div>
                      <div className="py-1">
                        <Link href={profile?.username ? `/profile/${profile.username}` : "/settings"} onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#999] hover:text-white hover:bg-[#252525] transition-colors">
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link href="/settings" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#999] hover:text-white hover:bg-[#252525] transition-colors">
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-[#333] py-1">
                        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[#EF4444] hover:bg-[#252525] transition-colors">
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button className="p-2 text-[#64748B] hover:text-[#F5F7FA] transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <Link href="/login">
                  <Button size="sm" variant="outline" className="rounded-lg px-4 border-[#333] text-[#F5F7FA] hover:bg-[#1A1A1A]">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
