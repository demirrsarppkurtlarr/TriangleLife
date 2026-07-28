"use client";

import { Card } from "@/components/ui/Card";
import type { Character, Relationship } from "@/types/game";
import { Users } from "lucide-react";

interface FamilyPanelProps {
  family: Character[];
  relationships: Relationship[];
}

const ROLE_LABELS: Record<string, string> = {
  anne: "Anne",
  baba: "Baba",
  kardes: "Kardeş",
};

export function FamilyPanel({ family, relationships }: FamilyPanelProps) {
  return (
    <Card variant="glass" padding="md">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Aile</h3>
        </div>

        <div className="space-y-3">
          {family.map((member) => {
            const rel = relationships.find((r) => r.targetId === member.id);
            const roleLabel = rel ? ROLE_LABELS[rel.tip] ?? rel.tip : "";

            return (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-button bg-surface-overlay/40 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-content">
                    {member.isim} {member.soyisim}
                  </p>
                  <p className="text-xs text-content-muted">
                    {roleLabel} · {member.yas} yaş · {member.meslek}
                  </p>
                </div>
                {rel && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-accent">{rel.puan}%</p>
                    <p className="text-xs text-content-muted">İlişki</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
