"use client";

import { useGameStore } from "@/store/game-store";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Notifications() {
  const { notifications, dismissNotification } = useGameStore();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={cn(
            "flex items-start gap-3 rounded-card px-4 py-3 shadow-xl backdrop-blur-glass border animate-slide-up",
            n.tip === "basarim" && "bg-success/10 border-success/20",
            n.tip === "uyari" && "bg-warning/10 border-warning/20",
            n.tip === "bilgi" && "bg-surface-overlay/80 border-border-subtle"
          )}
        >
          <p className="text-sm text-content flex-1">{n.mesaj}</p>
          <button
            onClick={() => dismissNotification(n.id)}
            className="text-content-muted hover:text-content shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
