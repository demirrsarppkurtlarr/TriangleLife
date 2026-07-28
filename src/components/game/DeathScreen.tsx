"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/game-store";
import { Skull } from "lucide-react";

export function DeathScreen() {
  const { player, family, resetGame, continueAsChild } = useGameStore();

  if (!player) return null;

  const children = family.filter(
    (c) => c.durum === "yasiyor" && c.yas >= 0
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Card variant="elevated" padding="lg" className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
          <Skull size={32} className="text-danger" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-content">Vefat</h2>
          <p className="text-content-secondary mt-2">
            {player.isim} {player.soyisim}, {player.yas} yaşında hayata veda etti.
          </p>
        </div>

        {children.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-content-secondary">Bir çocuğunla devam edebilirsin:</p>
            {children.map((child) => (
              <Button
                key={child.id}
                variant="secondary"
                fullWidth
                onClick={() => continueAsChild(child.id)}
              >
                {child.isim} {child.soyisim} ({child.yas} yaş)
              </Button>
            ))}
          </div>
        )}

        <Button variant="ghost" onClick={resetGame} fullWidth>
          Ana Menüye Dön
        </Button>
      </Card>
    </div>
  );
}
