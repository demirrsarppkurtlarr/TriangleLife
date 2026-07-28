"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { FullscreenToggle } from "@/components/ui/FullscreenToggle";
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
        <header className="sticky top-0 z-50 border-b border-border-subtle/50 bg-surface/80 backdrop-blur-glass">
          <div className="mx-auto flex h-16 max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 2xl:px-12">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white font-display font-bold text-sm">
                TL
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold text-content 2xl:text-xl">
                  {title ?? "TriangleLife"}
                </h1>
                {title && (
                  <p className="text-xs text-content-muted">Yaşam Simülasyonu</p>
                )}
              </div>
            </Link>
            <div className="flex items-center gap-2">
              {auth?.user ? (
                <div className="flex items-center gap-2 mr-1">
                  <User size={16} className="text-content-muted" />
                  <span className="text-sm text-content-secondary hidden sm:inline max-w-[160px] truncate">
                    {auth.user.email}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => auth.signOut()} className="gap-1">
                    <LogOut size={14} />
                  </Button>
                </div>
              ) : (
                <Link href="/giris" className="mr-1">
                  <Button variant="ghost" size="sm">Giriş</Button>
                </Link>
              )}
              <FullscreenToggle />
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 2xl:px-12 2xl:py-10">
        {children}
      </main>
    </div>
  );
}
