"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { GameEvent } from "@/types/game";
import { EVENT_CATEGORY_LABELS } from "@/lib/events/event-pool";
import { motion } from "framer-motion";

interface EventCardProps {
  event: GameEvent;
  onSelectChoice: (choiceId: string) => void;
}

export function EventCard({ event, onSelectChoice }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card variant="elevated" padding="lg" className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-accent-muted text-accent">
              {EVENT_CATEGORY_LABELS[event.kategori]}
            </span>
            <h2 className="font-display text-2xl font-bold text-content">
              {event.baslik}
            </h2>
            <p className="text-content-secondary leading-relaxed">
              {event.aciklama}
            </p>
          </div>

          <div className="space-y-3">
            {event.secenekler.map((choice, index) => (
              <motion.div
                key={choice.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => onSelectChoice(choice.id)}
                  className="text-left justify-start"
                >
                  {choice.metin}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
