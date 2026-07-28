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
} from "lucide-react";

const TABS: { id: GameTab; label: string; icon: typeof Heart }[] = [
  { id: "hayat", label: "Hayat", icon: Heart },
  { id: "aile", label: "Aile", icon: Users },
  { id: "finans", label: "Finans", icon: Wallet },
  { id: "saglik", label: "Sağlık", icon: Activity },
  { id: "egitim", label: "Eğitim", icon: GraduationCap },
  { id: "mulk", label: "Mülk", icon: Home },
  { id: "basarim", label: "Başarım", icon: Trophy },
];

interface GameTabsProps {
  active: GameTab;
  onChange: (tab: GameTab) => void;
}

export function GameTabs({ active, onChange }: GameTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin">
      {TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-button text-sm font-medium whitespace-nowrap transition-all",
            active === id
              ? "bg-accent text-white shadow-lg shadow-accent/20"
              : "bg-surface-overlay/50 text-content-secondary hover:text-content hover:bg-surface-overlay"
          )}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </div>
  );
}
