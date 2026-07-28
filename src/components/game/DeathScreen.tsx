"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/game-store";
import { Skull } from "lucide-react";
import { formatMoney } from "@/lib/generators";

export function DeathScreen() {
  const { player, family, relationships, life, lifetimeScore, resetGame, continueAsChild } = useGameStore();

  if (!player) return null;

  const children = family.filter(
    (c) =>
      c.durum === "yasiyor" &&
      relationships.some((r) => r.targetId === c.id && r.tip === "cocuk")
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
          {player.olumNedeni && (
            <p className="text-sm text-warning mt-2">Ölüm nedeni: {player.olumNedeni}</p>
          )}
          <p className="text-sm text-accent mt-2">Yaşam skoru: {lifetimeScore}</p>
          {life && (
            <p className="text-xs text-content-muted mt-1">
              Miras havuzu (yaklaşık): {formatMoney(life.para + life.bankaBakiyesi)}
            </p>
          )}
        </div>

        {children.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-content-secondary">
              Çocuğunla devam et — servetin bir kısmı miras olarak geçer:
            </p>
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
