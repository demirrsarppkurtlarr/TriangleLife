"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/game-store";
import { SOCIAL_CATEGORY_LABELS } from "@/lib/systems/social";
import { SOCIAL_ACTIVITIES } from "@/lib/systems/social";
import { formatMoney } from "@/lib/generators";
import { PartyPopper } from "lucide-react";

export function SocialPanel() {
  const { player, socialActivity } = useGameStore();

  if (!player) return null;

  const categories = Object.keys(SOCIAL_CATEGORY_LABELS) as Array<
    keyof typeof SOCIAL_CATEGORY_LABELS
  >;

  return (
    <div className="space-y-4">
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <PartyPopper size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Sosyal Yaşam</h3>
        </div>
        <p className="text-sm text-content-secondary mb-4">
          Kulüplere katıl, konserlere git, festivallere katıl ve sosyal hayatını zenginleştir.
        </p>
      </Card>

      {categories.map((kategori) => {
        const items = SOCIAL_ACTIVITIES.filter(
          (a) => a.kategori === kategori && player.yas >= a.minYas
        );
        if (items.length === 0) return null;

        return (
          <Card key={kategori} variant="glass" padding="md">
            <h4 className="font-display font-semibold text-content mb-3">
              {SOCIAL_CATEGORY_LABELS[kategori]}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.map((activity) => (
                <Button
                  key={activity.id}
                  variant="secondary"
                  size="sm"
                  onClick={() => socialActivity(activity.id)}
                  className="justify-between text-left"
                >
                  <span>{activity.ad}</span>
                  <span className="text-xs text-content-muted">
                    {formatMoney(activity.maliyet)}
                  </span>
                </Button>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
