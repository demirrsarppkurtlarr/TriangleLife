"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FullscreenToggle } from "@/components/ui/FullscreenToggle";
import { TriangleLogo } from "@/components/ui/TriangleLogo";
import { useOptionalAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { LogOut, User } from "lucide-react";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
}

export function AppShell({ children, title, showHeader = true }: AppShellProps) {
  const auth = useOptionalAuth();

  return (
    <div className="min-h-screen bg-surface">
      {showHeader && (
        <header className="sticky top-0 z-50 border-b border-border-subtle/40 bg-surface/70 backdrop-blur-2xl">
          <div className="mx-auto flex h-[52px] max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5 min-w-0">
              <TriangleLogo size={28} withWordmark={!title} />
              {title && (
                <span className="font-display text-[15px] font-semibold text-content truncate">
                  {title}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-1.5">
              {auth?.user ? (
                <div className="flex items-center gap-1.5 mr-1">
                  <User size={15} className="text-content-muted" />
                  <span className="text-xs text-content-secondary hidden sm:inline max-w-[140px] truncate">
                    {auth.user.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => auth.signOut()} className="!px-2">
                    <LogOut size={14} />
                  </Button>
                </div>
              ) : (
                <Link href="/giris" className="mr-1">
                  <Button variant="ghost" size="sm" className="rounded-full text-xs">
                    Giriş
                  </Button>
                </Link>
              )}
              <FullscreenToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-[1920px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  );
}
