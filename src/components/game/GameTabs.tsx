"use client";

import { cn } from "@/lib/utils";
import type { GameTab } from "@/types/game";
import {
  Heart,
  Wallet,
  GraduationCap,
  Home,
  Trophy,
  Activity,
  Users,
  PartyPopper,
} from "lucide-react";

const TABS: { id: GameTab; label: string; icon: typeof Heart }[] = [
  { id: "hayat", label: "Hayat", icon: Heart },
  { id: "aile", label: "Aile", icon: Users },
  { id: "finans", label: "Finans", icon: Wallet },
  { id: "saglik", label: "Sağlık", icon: Activity },
  { id: "egitim", label: "Eğitim", icon: GraduationCap },
  { id: "mulk", label: "Mülk", icon: Home },
  { id: "sosyal", label: "Sosyal", icon: PartyPopper },
  { id: "basarim", label: "Başarım", icon: Trophy },
];

interface GameTabsProps {
  active: GameTab;
  onChange: (tab: GameTab) => void;
}

export function GameTabs({ active, onChange }: GameTabsProps) {
  return (
    <>
      {/* Masaüstü: Apple tarzı yüzen cam kapsül */}
      <nav
        className="hidden md:flex sticky top-[4.5rem] z-40 justify-center pointer-events-none"
        aria-label="Ana menü"
      >
        <div
          className="pointer-events-auto inline-flex items-center gap-0.5 rounded-full
            border border-white/20 dark:border-white/10
            bg-white/70 dark:bg-[#1c1c1e]/75
            backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)]
            p-1.5"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-200",
                  isActive
                    ? "bg-content text-surface shadow-sm"
                    : "text-content-secondary hover:text-content hover:bg-black/5 dark:hover:bg-white/10"
                )}
              >
                <Icon size={15} strokeWidth={isActive ? 2.25 : 1.75} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobil: iOS tarzı alt tab bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-50
          border-t border-border-subtle/80
          bg-surface/85 backdrop-blur-2xl
          pb-[env(safe-area-inset-bottom)]"
        aria-label="Ana menü"
      >
        <div className="grid grid-cols-4 gap-0 px-1 pt-1.5 pb-1">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors",
                  isActive ? "text-accent" : "text-content-muted"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                <span className="text-[10px] font-medium leading-none">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
