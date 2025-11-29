"use client";

import { Header } from "./header";
import { Footer } from "./footer";

interface AppShellProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function AppShell({ children, hideFooter }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}


