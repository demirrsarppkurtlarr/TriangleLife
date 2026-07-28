"use client";

import { Card } from "@/components/ui/Card";
import type { EventLog, JournalEntry } from "@/types/game";
import { BookMarked } from "lucide-react";

interface LifeJournalProps {
  journal: JournalEntry[];
  events: EventLog[];
}

export function LifeJournal({ journal, events }: LifeJournalProps) {
  const merged = [
    ...journal.map((j) => ({
      id: j.id,
      yil: j.yil,
      yas: j.yas,
      baslik: j.baslik,
      metin: j.metin,
      kategori: j.kategori,
    })),
    ...events.map((e) => ({
      id: e.id,
      yil: e.yil,
      yas: e.yas,
      baslik: e.baslik,
      metin: e.aciklama,
      kategori: e.kategori,
    })),
  ]
    .sort((a, b) => b.yil - a.yil || b.yas - a.yas)
    .slice(0, 40);

  return (
    <Card variant="glass" padding="md">
      <div className="flex items-center gap-2 mb-4">
        <BookMarked size={20} className="text-accent" />
        <h3 className="font-display text-lg font-semibold text-content">Yaşam Günlüğü</h3>
      </div>
      {merged.length === 0 ? (
        <p className="text-sm text-content-muted">Henüz günlük kaydı yok. Yıllar ilerledikçe hikâyen burada birikecek.</p>
      ) : (
        <div className="relative space-y-0 pl-4 border-l border-border-subtle/60">
          {merged.map((item) => (
            <div key={item.id} className="relative pb-4 last:pb-0">
              <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
              <p className="text-xs text-content-muted">
                {item.yil} · {item.yas} yaş · {item.kategori}
              </p>
              <p className="text-sm font-medium text-content">{item.baslik}</p>
              <p className="text-sm text-content-secondary">{item.metin}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
