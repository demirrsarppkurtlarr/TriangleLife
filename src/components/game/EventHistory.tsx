"use client";

import { Card } from "@/components/ui/Card";
import type { EventLog } from "@/types/game";
import { EVENT_CATEGORY_LABELS } from "@/lib/events/event-pool";
import { History } from "lucide-react";

interface EventHistoryProps {
  events: EventLog[];
}

export function EventHistory({ events }: EventHistoryProps) {
  if (events.length === 0) {
    return (
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <History size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Geçmiş</h3>
        </div>
        <p className="text-sm text-content-muted">Henüz bir olay yaşanmadı.</p>
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="md">
      <div className="flex items-center gap-2 mb-4">
        <History size={20} className="text-accent" />
        <h3 className="font-display text-lg font-semibold text-content">Geçmiş</h3>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto">
        {events.slice(0, 10).map((event) => (
          <div
            key={event.id}
            className="rounded-button bg-surface-overlay/40 px-4 py-3 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-accent">
                {EVENT_CATEGORY_LABELS[event.kategori]}
              </span>
              <span className="text-xs text-content-muted">
                {event.yas} yaş · {event.yil}
              </span>
            </div>
            <p className="font-medium text-sm text-content">{event.baslik}</p>
            <p className="text-xs text-content-secondary">{event.aciklama}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
