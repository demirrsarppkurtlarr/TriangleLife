"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/game-store";
import { RELATIONSHIP_ACTIONS, ROMANTIC_ACTIONS } from "@/lib/constants";
import { getRelationshipLevel } from "@/lib/systems/relationships";
import { Users, Heart } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  anne: "Anne", baba: "Baba", kardes: "Kardeş", es: "Eş",
  cocuk: "Çocuk", arkadas: "Arkadaş", sevgili: "Sevgili",
};

export function RelationshipPanel() {
  const { family, relationships, player, relationshipAction } = useGameStore();

  if (!player) return null;

  const allPeople = [
    ...family.map((f) => ({ char: f, rel: relationships.find((r) => r.targetId === f.id) })),
  ].filter((p) => p.rel);

  return (
    <div className="space-y-4">
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">İlişkiler</h3>
        </div>

        {allPeople.length === 0 ? (
          <p className="text-sm text-content-muted">Henüz ilişkin yok.</p>
        ) : (
          <div className="space-y-4">
            {allPeople.map(({ char, rel }) => {
              if (!rel) return null;
              return (
                <div key={char.id} className="rounded-button bg-surface-overlay/40 p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-content">{char.isim} {char.soyisim}</p>
                      <p className="text-xs text-content-muted">
                        {ROLE_LABELS[rel.tip] ?? rel.tip} · {char.yas} yaş
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-accent">{rel.puan}%</p>
                      <p className="text-xs text-content-muted">{getRelationshipLevel(rel.puan)}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {RELATIONSHIP_ACTIONS.filter((a) => rel.puan >= a.minPuan || a.minPuan === 0).map((action) => (
                      <Button
                        key={action.id}
                        variant="secondary"
                        size="sm"
                        onClick={() => relationshipAction(char.id, action.id)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {player.yas >= 14 && (
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-2 mb-4">
            <Heart size={20} className="text-accent" />
            <h3 className="font-display text-lg font-semibold text-content">Romantik</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {ROMANTIC_ACTIONS.filter((a) => player.yas >= a.minYas).map((action) => (
              <Button
                key={action.id}
                variant="secondary"
                size="sm"
                onClick={() => {
                  const target = family.find((f) => f.yas >= player.yas - 5 && f.yas <= player.yas + 5);
                  if (target) relationshipAction(target.id, action.id);
                }}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
