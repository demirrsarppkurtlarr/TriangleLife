"use client";

import { Card } from "@/components/ui/Card";
import type { StoryState } from "@/lib/systems/story-continuity";
import { Link2 } from "lucide-react";

interface StoryThreadsPanelProps {
  storyState: StoryState;
}

export function StoryThreadsPanel({ storyState }: StoryThreadsPanelProps) {
  const flags = storyState.flags;
  const threads = storyState.threads.filter((t) => t.aktif).slice(0, 6);
  const pendingSoon = storyState.pending.slice(0, 4);

  if (flags.length === 0 && threads.length === 0 && pendingSoon.length === 0) {
    return null;
  }

  return (
    <Card variant="glass" padding="md">
      <div className="flex items-center gap-2 mb-3">
        <Link2 size={18} className="text-accent" />
        <h3 className="font-display text-base font-semibold text-content">Devam Eden Hikâyeler</h3>
      </div>
      <p className="text-xs text-content-muted mb-3">
        Seçimlerin bitmiyor — yan etkiler sonraki yıllarda geri döner.
      </p>

      {flags.length > 0 && (
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wide text-content-muted mb-1.5">
            Aktif etkiler
          </p>
          <div className="flex flex-wrap gap-1.5">
            {flags.map((f) => (
              <span
                key={f.id}
                className="inline-flex items-center rounded-full bg-accent/10 text-accent text-xs px-2.5 py-1"
              >
                {f.label} · {f.kalanYil}y
              </span>
            ))}
          </div>
        </div>
      )}

      {threads.length > 0 && (
        <div className="space-y-2 mb-2">
          {threads.map((t) => (
            <div key={t.id} className="rounded-button bg-surface-overlay/40 px-3 py-2">
              <p className="text-sm font-medium text-content">{t.baslik}</p>
              <p className="text-xs text-content-muted">{t.ozet}</p>
            </div>
          ))}
        </div>
      )}

      {pendingSoon.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border-subtle/50">
          <p className="text-[11px] font-medium uppercase tracking-wide text-content-muted mb-1.5">
            Ufukta
          </p>
          {pendingSoon.map((p) => (
            <p key={p.id} className="text-xs text-content-secondary">
              {p.tetikYil}: {p.baslik}
            </p>
          ))}
        </div>
      )}
    </Card>
  );
}
