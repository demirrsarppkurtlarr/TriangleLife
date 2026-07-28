"use client";

import { Card } from "@/components/ui/Card";
import { useGameStore } from "@/store/game-store";
import { Trophy } from "lucide-react";

export function AchievementsPanel() {
  const { achievements } = useGameStore();

  const earned = achievements.filter((a) => a.kazanildi);
  const locked = achievements.filter((a) => !a.kazanildi);

  return (
    <div className="space-y-4">
      <Card variant="glass" padding="md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-accent" />
            <h3 className="font-display text-lg font-semibold text-content">Başarımlar</h3>
          </div>
          <span className="text-sm text-content-muted">
            {earned.length}/{achievements.length}
          </span>
        </div>

        {earned.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-success uppercase tracking-wide">Kazanılan</p>
            {earned.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-button bg-success/10 px-4 py-3">
                <Trophy size={18} className="text-success shrink-0" />
                <div>
                  <p className="font-medium text-content">{a.ad}</p>
                  <p className="text-xs text-content-secondary">{a.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {locked.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-content-muted uppercase tracking-wide">Kilitli</p>
            {locked.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-button bg-surface-overlay/40 px-4 py-3 opacity-60">
                <Trophy size={18} className="text-content-muted shrink-0" />
                <div>
                  <p className="font-medium text-content">{a.ad}</p>
                  <p className="text-xs text-content-secondary">{a.aciklama}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
