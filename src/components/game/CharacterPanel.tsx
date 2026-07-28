"use client";

import { Card } from "@/components/ui/Card";
import { StatBar } from "@/components/ui/StatBar";
import type { Character } from "@/types/game";
import { AGE_GROUP_LABELS, getAgeGroup } from "@/lib/constants";
import { formatMoney } from "@/lib/generators";
import { HAIR_LABELS, EYE_LABELS, SKIN_LABELS } from "@/types/creation";
import { AvatarFace } from "@/components/game/AvatarFace";
import { getCityProfile } from "@/lib/systems/city-depth";

interface CharacterPanelProps {
  character: Character;
  money?: number;
  score?: number;
}

export function CharacterPanel({ character, money, score }: CharacterPanelProps) {
  const ageGroup = getAgeGroup(character.yas);
  const city = getCityProfile(character.sehir);

  return (
    <Card variant="glass" padding="md">
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <AvatarFace
            sacRengi={character.sacRengi}
            gozRengi={character.gozRengi}
            tenRengi={character.tenRengi}
            cinsiyet={character.cinsiyet}
            yas={character.yas}
            size={72}
          />
          <div>
            <h3 className="font-display text-xl font-bold text-content">
              {character.isim} {character.soyisim}
            </h3>
            <p className="text-sm text-content-secondary">
              {character.yas} yaş · {AGE_GROUP_LABELS[ageGroup]} · {character.sehir}
            </p>
            <p className="text-xs text-content-muted mt-0.5">
              {character.ehliyet ? "Ehliyet var" : "Ehliyetsiz"}
              {character.universiteBolumu ? ` · ${character.universiteBolumu}` : ""}
              {typeof character.un === "number" ? ` · Ün ${character.un}` : ""}
            </p>
            <p className="text-xs text-content-muted mt-0.5">{city.bolge} · {city.aciklama.slice(0, 60)}…</p>
            {(character.sacRengi || character.gozRengi || character.tenRengi) && (
              <p className="text-xs text-content-muted mt-0.5">
                {character.sacRengi && HAIR_LABELS[character.sacRengi as keyof typeof HAIR_LABELS]}
                {character.gozRengi && ` · ${EYE_LABELS[character.gozRengi as keyof typeof EYE_LABELS]} göz`}
                {character.tenRengi && ` · ${SKIN_LABELS[character.tenRengi as keyof typeof SKIN_LABELS]}`}
              </p>
            )}
            {character.genetikOzet && (
              <p className="text-xs text-content-muted">Genetik: {character.genetikOzet}</p>
            )}
          </div>
        </div>

        {money !== undefined && (
          <div className="rounded-button bg-surface-overlay/50 px-4 py-3">
            <p className="text-xs text-content-muted">
              {character.yas < 16 ? "Harçlık / nakit" : "Nakit"}
            </p>
            <p className="font-display text-lg font-bold text-content">
              {formatMoney(money)}
            </p>
            {character.yas < 18 && (
              <p className="text-xs text-content-muted mt-1">
                Yatırım ve büyük finans işlemleri 18 yaşından sonra.
              </p>
            )}
            {score !== undefined && (
              <p className="text-xs text-accent mt-1">Yaşam skoru: {score}</p>
            )}
          </div>
        )}

        <div className="space-y-3">
          <StatBar label="Mutluluk" value={character.mutluluk} color="success" />
          <StatBar label="Sağlık" value={character.saglik} color="accent" />
          <StatBar label="Stres" value={character.stres} color="warning" />
          <StatBar label="Uyku" value={character.uyku} color="accent" />
          <StatBar label="Beslenme" value={character.beslenme} color="success" />
        </div>
      </div>
    </Card>
  );
}
