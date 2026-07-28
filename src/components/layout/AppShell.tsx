import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
}

export function AppShell({ children, title, showHeader = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface">
      {showHeader && (
        <header className="sticky top-0 z-50 border-b border-border-subtle/50 bg-surface/80 backdrop-blur-glass">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white font-display font-bold text-sm">
                TL
              </div>
              <div>
                <h1 className="font-display text-lg font-semibold text-content">
                  {title ?? "TriangleLife"}
                </h1>
                {title && (
                  <p className="text-xs text-content-muted">Yaşam Simülasyonu</p>
                )}
              </div>
            </div>
            <ThemeToggle />
          </div>
        </header>
      )}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {children}
      </main>
    </div>
  );
}
