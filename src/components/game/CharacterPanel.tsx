"use client";

import { Card } from "@/components/ui/Card";
import { StatBar } from "@/components/ui/StatBar";
import type { Character } from "@/types/game";
import { AGE_GROUP_LABELS, getAgeGroup } from "@/lib/constants";
import { formatMoney } from "@/lib/generators";
import { User } from "lucide-react";

interface CharacterPanelProps {
  character: Character;
  money?: number;
}

export function CharacterPanel({ character, money }: CharacterPanelProps) {
  const ageGroup = getAgeGroup(character.yas);

  return (
    <Card variant="glass" padding="md">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <User size={28} />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-content">
              {character.isim} {character.soyisim}
            </h3>
            <p className="text-sm text-content-secondary">
              {character.yas} yaş · {AGE_GROUP_LABELS[ageGroup]} · {character.sehir}
            </p>
          </div>
        </div>

        {money !== undefined && (
          <div className="rounded-button bg-surface-overlay/50 px-4 py-3">
            <p className="text-xs text-content-muted">Nakit</p>
            <p className="font-display text-lg font-bold text-content">
              {formatMoney(money)}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <StatBar label="Mutluluk" value={character.mutluluk} color="success" />
          <StatBar label="Sağlık" value={character.saglik} color="accent" />
          <StatBar label="Stres" value={character.stres} color="warning" />
          <StatBar label="Uyku" value={character.uyku} color="accent" />
          <StatBar label="Beslenme" value={character.beslenme} color="success" />
        </div>
      </div>
    </Card>
  );
}
