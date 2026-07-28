"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore, VEHICLE_TYPES } from "@/store/game-store";
import { formatMoney } from "@/lib/generators";
import { DECORATION_CATALOG, DECORATION_CATEGORY_LABELS } from "@/lib/systems/decoration";
import { Home, Car, Paintbrush } from "lucide-react";

const HOMES = [
  { ad: "Stüdyo Daire", deger: 800000, kira: 8000 },
  { ad: "2+1 Daire", deger: 1500000, kira: 12000 },
  { ad: "3+1 Daire", deger: 2500000, kira: 18000 },
  { ad: "Villa", deger: 8000000, kira: 40000 },
  { ad: "Malikane", deger: 25000000, kira: 100000 },
];

export function PropertyPanel() {
  const { properties, decorations, buyProperty, buyDecoration } = useGameStore();

  return (
    <div className="space-y-4">
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Home size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Evler</h3>
        </div>
        <div className="space-y-2">
          {HOMES.map((home) => (
            <div key={home.ad} className="flex items-center justify-between rounded-button bg-surface-overlay/40 px-4 py-3">
              <div>
                <p className="font-medium text-content">{home.ad}</p>
                <p className="text-xs text-content-muted">{formatMoney(home.deger)}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  buyProperty({
                    tip: "ev",
                    ad: home.ad,
                    deger: home.deger,
                    kira: home.kira,
                    satinAlindi: true,
                    detaylar: {},
                  })
                }
              >
                Satın Al
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Car size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Araçlar</h3>
        </div>
        <div className="space-y-2">
          {VEHICLE_TYPES.map((v) => {
            const fiyat = Math.round((v.minFiyat + v.maxFiyat) / 2);
            return (
              <div key={v.tip} className="flex items-center justify-between rounded-button bg-surface-overlay/40 px-4 py-3">
                <div>
                  <p className="font-medium text-content">{v.ad}</p>
                  <p className="text-xs text-content-muted">{formatMoney(fiyat)}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    buyProperty({
                      tip: "arac",
                      ad: v.ad,
                      deger: fiyat,
                      kira: 0,
                      satinAlindi: true,
                      aracTipi: v.tip,
                      detaylar: {},
                    })
                  }
                >
                  Satın Al
                </Button>
              </div>
            );
          })}
        </div>
      </Card>

      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Paintbrush size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Ev Dekorasyonu</h3>
        </div>
        {(Object.keys(DECORATION_CATEGORY_LABELS) as Array<keyof typeof DECORATION_CATEGORY_LABELS>).map(
          (kategori) => {
            const items = DECORATION_CATALOG.filter((d) => d.kategori === kategori);
            return (
              <div key={kategori} className="mb-4 last:mb-0">
                <p className="text-xs font-medium text-content-muted uppercase tracking-wide mb-2">
                  {DECORATION_CATEGORY_LABELS[kategori]}
                </p>
                <div className="space-y-2">
                  {items.map((item) => {
                    const owned = decorations.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-button bg-surface-overlay/40 px-4 py-3"
                      >
                        <div>
                          <p className="font-medium text-content">{item.ad}</p>
                          <p className="text-xs text-content-muted">
                            {formatMoney(item.fiyat)} · +{item.mutluluk} mutluluk
                          </p>
                        </div>
                        <Button
                          variant={owned ? "ghost" : "secondary"}
                          size="sm"
                          disabled={owned}
                          onClick={() => buyDecoration(item.id)}
                        >
                          {owned ? "Sahip" : "Satın Al"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}
      </Card>

      {properties.length > 0 && (
        <Card variant="glass" padding="md">
          <h3 className="font-display text-lg font-semibold text-content mb-3">Sahip Olunanlar</h3>
          <div className="space-y-2">
            {properties.map((p) => (
              <div key={p.id} className="rounded-button bg-surface-overlay/40 px-4 py-2 text-sm">
                <span className="text-content">{p.ad}</span>
                <span className="text-content-muted ml-2">· {formatMoney(p.deger)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
