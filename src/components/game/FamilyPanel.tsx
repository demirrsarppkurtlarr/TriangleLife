"use client";

import { Card } from "@/components/ui/Card";
import type { Character, Relationship } from "@/types/game";
import { AvatarFace } from "@/components/game/AvatarFace";
import { Users } from "lucide-react";

interface FamilyPanelProps {
  family: Character[];
  relationships: Relationship[];
}

const ROLE_LABELS: Record<string, string> = {
  anne: "Anne",
  baba: "Baba",
  kardes: "Kardeş",
  es: "Eş",
  cocuk: "Çocuk",
  dede: "Dede",
  anneanne: "Anneanne",
  babaanne: "Babaanne",
  diger: "Akraba",
};

export function FamilyPanel({ family, relationships }: FamilyPanelProps) {
  const living = family.filter((m) => m.durum === "yasiyor");
  const dead = family.filter((m) => m.durum === "oldu");

  return (
    <Card variant="glass" padding="md">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Aile</h3>
          <span className="text-xs text-content-muted ml-auto">{living.length} kişi</span>
        </div>

        {family.length === 0 ? (
          <p className="text-sm text-content-muted">
            Aile üyeleri yüklenemedi. Yeni bir hayat başlatmayı dene.
          </p>
        ) : (
          <div className="space-y-3">
            {[...living, ...dead].map((member) => {
              const rel = relationships.find((r) => r.targetId === member.id);
              const roleKey = member.aileRolu ?? rel?.tip ?? "diger";
              const roleLabel = ROLE_LABELS[roleKey] ?? roleKey;

              return (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 rounded-button bg-surface-overlay/40 px-3 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AvatarFace
                      sacRengi={member.sacRengi}
                      gozRengi={member.gozRengi}
                      tenRengi={member.tenRengi}
                      cinsiyet={member.cinsiyet}
                      yas={member.yas}
                      size={44}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-content truncate">
                        {member.isim} {member.soyisim}
                      </p>
                      <p className="text-xs text-content-muted">
                        {roleLabel} · {member.yas} yaş
                        {member.meslek ? ` · ${member.meslek}` : ""}
                        {member.sehir ? ` · ${member.sehir}` : ""}
                        {member.durum === "oldu" ? " · Vefat" : ""}
                      </p>
                    </div>
                  </div>
                  {rel && member.durum === "yasiyor" && (
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-accent">{rel.puan}%</p>
                      <p className="text-xs text-content-muted">İlişki</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
