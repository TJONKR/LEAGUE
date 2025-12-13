import Link from "next/link";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="py-8 mt-auto border-t border-[#243B5C]/50">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <span className="text-[#FFCC00] font-black text-base tracking-tight">MEGAS</span>
            <span>© 2025</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <Link href="/hackathons" className="text-sm text-[#64748B] hover:text-[#FFCC00] transition-colors">
              Hackathons
            </Link>
            <Link href="/leaderboard" className="text-sm text-[#64748B] hover:text-[#FFCC00] transition-colors">
              Leaderboard
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
