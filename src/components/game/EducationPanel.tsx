"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/game-store";
import { EDUCATION_LABELS } from "@/lib/constants";
import { getAvailableProfessions } from "@/lib/systems/career";
import { UNIVERSITE_BOLUMLERI } from "@/lib/systems/life-extras";
import { GraduationCap, Briefcase } from "lucide-react";
import type { EducationLevel } from "@/types/game";

const EDUCATION_ORDER: EducationLevel[] = [
  "anaokulu",
  "ilkokul",
  "ortaokul",
  "lise",
  "universite",
  "yuksek_lisans",
  "doktora",
];

export function EducationPanel() {
  const { player, lifeExtras, study, findJob, chooseUniversityMajor, advanceCareer } = useGameStore();

  if (!player) return null;

  const trackJobs = lifeExtras.kariyerYolu
    ? [...(UNIVERSITE_BOLUMLERI.find((b) => b.id === lifeExtras.kariyerYolu)?.kariyer ?? [])]
    : [];
  const availableJobs = getAvailableProfessions(
    player.egitim,
    player.yas,
    lifeExtras.universiteBolumu,
    trackJobs
  );
  const currentEduIndex = EDUCATION_ORDER.indexOf(player.egitim);

  return (
    <div className="space-y-4">
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Eğitim</h3>
        </div>
        <p className="text-sm text-content-secondary mb-3">
          Mevcut: <span className="font-medium text-content">{EDUCATION_LABELS[player.egitim]}</span>
          {lifeExtras.universiteBolumu && (
            <span className="text-accent"> · {lifeExtras.universiteBolumu}</span>
          )}
        </p>
        {player.yas >= 3 && player.yas <= 30 && (
          <div className="flex flex-wrap gap-2">
            {EDUCATION_ORDER.slice(currentEduIndex + 1).map((seviye) => (
              <Button key={seviye} variant="secondary" size="sm" onClick={() => study(seviye)}>
                {EDUCATION_LABELS[seviye]}
              </Button>
            ))}
          </div>
        )}
      </Card>

      {player.yas >= 17 && (
        <Card variant="glass" padding="md">
          <h3 className="font-display text-base font-semibold text-content mb-2">Üniversite Bölümü</h3>
          <p className="text-xs text-content-muted mb-3">
            Bölüm seçimi kariyer yolunu açar (tıp, hukuk, sanat…).
          </p>
          <div className="flex flex-wrap gap-2">
            {UNIVERSITE_BOLUMLERI.map((b) => (
              <Button
                key={b.id}
                variant={lifeExtras.kariyerYolu === b.id ? "primary" : "secondary"}
                size="sm"
                onClick={() => chooseUniversityMajor(b.id)}
              >
                {b.ad}
              </Button>
            ))}
          </div>
          {lifeExtras.kariyerYolu && (
            <Button variant="secondary" size="sm" className="mt-3" onClick={advanceCareer}>
              Kariyerde ilerle
            </Button>
          )}
        </Card>
      )}

      {player.yas >= 15 && (
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={20} className="text-accent" />
            <h3 className="font-display text-lg font-semibold text-content">Kariyer</h3>
          </div>
          {player.meslek && (
            <p className="text-sm text-content-secondary mb-3">
              Mevcut meslek: <span className="font-medium text-content">{player.meslek}</span>
              {player.gelir > 0 && ` · ${player.gelir.toLocaleString("tr-TR")} TL/ay`}
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {availableJobs.slice(0, 15).map((meslek) => (
              <Button
                key={meslek}
                variant="secondary"
                size="sm"
                onClick={() => findJob(meslek)}
                className="text-xs"
              >
                {meslek}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
