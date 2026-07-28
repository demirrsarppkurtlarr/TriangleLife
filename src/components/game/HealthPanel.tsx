"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatBar } from "@/components/ui/StatBar";
import { useGameStore } from "@/store/game-store";
import { assessHealth, calculateIdealWeight, getWeightStatus } from "@/lib/systems/health";
import { Activity } from "lucide-react";

export function HealthPanel() {
  const {
    player,
    diseases,
    healthAction,
    treatDiseaseAction,
    therapyAction,
    plasticSurgeryAction,
    joinGym,
    gymWorkout,
    lifeExtras,
  } = useGameStore();

  if (!player) return null;

  const status = assessHealth(player);
  const idealWeight = calculateIdealWeight(player.yas, player.cinsiyet);
  const weightStatus = getWeightStatus(player.kilo, idealWeight);
  const weightLabels = { normal: "Normal", zayif: "Zayıf", fazla: "Fazla Kilolu" };

  return (
    <div className="space-y-4">
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Sağlık Durumu</h3>
        </div>

        <div className="mb-4 rounded-button bg-surface-overlay/40 p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-content-secondary">Genel Sağlık</span>
            <span
              className={`font-bold ${
                status.risk === "yuksek"
                  ? "text-danger"
                  : status.risk === "orta"
                    ? "text-warning"
                    : "text-success"
              }`}
            >
              {status.genel}/100
            </span>
          </div>
          {status.uyari && <p className="text-xs text-warning mt-2">{status.uyari}</p>}
        </div>

        <div className="space-y-3 mb-4">
          <StatBar label="Sağlık" value={player.saglik} color="success" />
          <StatBar label="Stres" value={player.stres} color="warning" />
          <StatBar label="Uyku" value={player.uyku} color="accent" />
          <StatBar label="Beslenme" value={player.beslenme} color="success" />
          <StatBar label="Psikoloji" value={player.psikoloji} color="accent" />
        </div>

        <div className="text-sm text-content-secondary mb-4">
          Kilo: {player.kilo} kg · İdeal: {idealWeight.toFixed(0)} kg · {weightLabels[weightStatus]}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" size="sm" onClick={() => healthAction("doktor")}>
            Doktora Git
          </Button>
          <Button variant="secondary" size="sm" onClick={() => healthAction("dinlenme")}>
            Dinlen
          </Button>
          <Button variant="secondary" size="sm" onClick={() => healthAction("spor")}>
            Spor Yap
          </Button>
          <Button variant="secondary" size="sm" onClick={() => healthAction("beslenme")}>
            Sağlıklı Beslen
          </Button>
          <Button variant="secondary" size="sm" onClick={therapyAction}>
            Terapi (2000₺)
          </Button>
          <Button variant="secondary" size="sm" onClick={plasticSurgeryAction}>
            Estetik (25k₺)
          </Button>
          {!lifeExtras.gymUyelik ? (
            <Button variant="secondary" size="sm" onClick={joinGym}>
              Spor Salonu Üye
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={gymWorkout}>
              Antrenman
            </Button>
          )}
        </div>
      </Card>

      {diseases.length > 0 && (
        <Card variant="glass" padding="md">
          <h3 className="font-display text-base font-semibold text-content mb-3">Hastalıklar</h3>
          <div className="space-y-2">
            {diseases.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between rounded-button bg-surface-overlay/40 px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium text-content">{d.ad}</p>
                  <p className="text-xs text-content-muted">
                    {d.siddet} · {d.kalanYil}y kaldı
                  </p>
                </div>
                <Button variant="secondary" size="sm" onClick={() => treatDiseaseAction(d.id)}>
                  Tedavi et
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
