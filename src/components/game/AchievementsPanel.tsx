"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useGameStore } from "@/store/game-store";
import { loadLeaderboard, type LeaderboardEntry } from "@/lib/systems/score";
import { Trophy, Medal } from "lucide-react";

export function AchievementsPanel() {
  const { achievements, lifetimeScore, player } = useGameStore();
  const [board, setBoard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setBoard(loadLeaderboard());
  }, [lifetimeScore]);

  const earned = achievements.filter((a) => a.kazanildi);
  const locked = achievements.filter((a) => !a.kazanildi);

  return (
    <div className="space-y-4">
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-2">
          <Medal size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Skor Tablosu</h3>
        </div>
        <p className="text-sm text-content-secondary mb-3">
          Güncel yaşam skoru: <span className="font-semibold text-accent">{lifetimeScore}</span>
          {player ? ` · ${player.sehir}` : ""}
        </p>
        {board.length === 0 ? (
          <p className="text-xs text-content-muted">Henüz skor yok. Bir hayat tamamlanınca burada görünür.</p>
        ) : (
          <div className="space-y-2">
            {board.slice(0, 10).map((e, i) => (
              <div key={e.id} className="flex items-center justify-between rounded-button bg-surface-overlay/40 px-3 py-2 text-sm">
                <span className="text-content-muted w-6">{i + 1}.</span>
                <span className="flex-1 text-content">
                  {e.isim} {e.soyisim}
                  <span className="text-content-muted text-xs ml-2">
                    {e.sehir} · {e.yas} yaş
                  </span>
                </span>
                <span className="font-semibold text-accent">{e.skor}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

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
