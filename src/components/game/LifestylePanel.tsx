"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/game-store";
import { getCityProfile } from "@/lib/systems/city-depth";
import { CRIME_OPTIONS } from "@/lib/systems/crime";
import { POLITICAL_LABELS, type PoliticalLean } from "@/lib/systems/politics";
import { INANC_OPTIONS, PRACTICE_LABELS, type ReligionPractice } from "@/lib/systems/religion";
import { getAvailableHobbies, hobbyTier } from "@/lib/systems/hobbies";
import { schoolRankLabel } from "@/lib/systems/school";
import { geneticsSummary } from "@/lib/systems/genetics";
import { MapPin, BookOpen, Scale, Landmark, BookMarked, Puzzle, Dna, Building2 } from "lucide-react";

export function LifestylePanel() {
  const {
    player,
    neighborhood,
    school,
    crime,
    politics,
    religion,
    hobbies,
    genetics,
    helpNeighbor,
    schoolStudy,
    attemptCrimeAction,
    setPoliticalLean,
    castVote,
    joinPoliticalParty,
    setReligionBelief,
    setReligionPractice,
    worshipAction,
    startHobbyAction,
    practiceHobbyAction,
  } = useGameStore();

  if (!player) return null;

  const city = getCityProfile(player.sehir);
  const availableHobbies = getAvailableHobbies(player.yas, hobbies);

  return (
    <div className="space-y-4">
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Şehir: {city.ad}</h3>
        </div>
        <p className="text-sm text-content-secondary mb-3">{city.aciklama}</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <div className="rounded-button bg-surface-overlay/40 p-2">Yaşam maliyeti · {city.yasamMaliyeti}</div>
          <div className="rounded-button bg-surface-overlay/40 p-2">İş fırsatı · {city.isFirsatı}</div>
          <div className="rounded-button bg-surface-overlay/40 p-2">Eğitim · {city.egitim}</div>
          <div className="rounded-button bg-surface-overlay/40 p-2">Güvenlik · {city.guvenlik}</div>
          <div className="rounded-button bg-surface-overlay/40 p-2">Kültür · {city.kultur}</div>
          <div className="rounded-button bg-surface-overlay/40 p-2">Bölge · {city.bolge}</div>
        </div>
      </Card>

      {neighborhood && (
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={20} className="text-accent" />
            <h3 className="font-display text-lg font-semibold text-content">Mahalle</h3>
          </div>
          <p className="text-sm text-content-secondary mb-1">{neighborhood.mahalle}</p>
          <p className="text-xs text-content-muted mb-3">
            İtibar {neighborhood.itibar} · Güvenlik {neighborhood.guvenlik}
            {neighborhood.sonOlay ? ` · ${neighborhood.sonOlay}` : ""}
          </p>
          <div className="space-y-2">
            {neighborhood.komşular.map((k) => (
              <div key={k.id} className="flex items-center justify-between rounded-button bg-surface-overlay/40 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-content">{k.isim}</p>
                  <p className="text-xs text-content-muted">{k.meslek} · ilişki {k.iliski}</p>
                </div>
                {player.yas >= 6 && (
                  <Button variant="secondary" size="sm" onClick={() => helpNeighbor(k.id)}>
                    Yardım et
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {school && player.yas >= 6 && player.yas <= 18 && (
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={20} className="text-accent" />
            <h3 className="font-display text-lg font-semibold text-content">Okul</h3>
          </div>
          <p className="text-sm text-content mb-1">{school.okulAdi}</p>
          <p className="text-xs text-content-muted mb-3">{schoolRankLabel(school)}</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => schoolStudy(true)}>Ders çalış</Button>
            <Button variant="ghost" size="sm" onClick={() => schoolStudy(false)}>Ertele</Button>
          </div>
        </Card>
      )}

      {genetics && (
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-2 mb-3">
            <Dna size={20} className="text-accent" />
            <h3 className="font-display text-lg font-semibold text-content">DNA / Genetik</h3>
          </div>
          <p className="text-sm text-content-secondary">{geneticsSummary(genetics)}</p>
          <p className="text-xs text-content-muted mt-2">
            Ebeveyn katkısı · Anne %{genetics.ebeveynKatkisi.anne} · Baba %{genetics.ebeveynKatkisi.baba}
          </p>
        </Card>
      )}

      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Puzzle size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Hobiler</h3>
        </div>
        {player.yas < 5 ? (
          <p className="text-sm text-content-muted">Hobiler için biraz büyümen gerekiyor.</p>
        ) : (
          <>
            <div className="space-y-2 mb-3">
              {hobbies.map((h) => (
                <div key={h.id} className="flex items-center justify-between rounded-button bg-surface-overlay/40 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-content">{h.ad}</p>
                    <p className="text-xs text-content-muted">{hobbyTier(h.seviye)} · seviye {h.seviye}</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => practiceHobbyAction(h.id)}>
                    Pratik yap
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {availableHobbies.slice(0, 6).map((h) => (
                <Button key={h.id} variant="ghost" size="sm" onClick={() => startHobbyAction(h.id)}>
                  + {h.ad}
                </Button>
              ))}
            </div>
          </>
        )}
      </Card>

      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Landmark size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Siyaset</h3>
        </div>
        <p className="text-sm text-content-secondary mb-2">
          Eğilim: {POLITICAL_LABELS[politics.egilim]} · İlgi {politics.ilgi}
          {politics.partiUyeligi ? " · Parti üyesi" : ""}
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {(Object.keys(POLITICAL_LABELS) as PoliticalLean[]).map((k) => (
            <Button key={k} variant="secondary" size="sm" onClick={() => setPoliticalLean(k)}>
              {POLITICAL_LABELS[k]}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={castVote}>Oy kullan</Button>
          <Button variant="ghost" size="sm" onClick={joinPoliticalParty}>Partiye katıl</Button>
        </div>
      </Card>

      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <BookMarked size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">İnanç</h3>
        </div>
        <p className="text-sm text-content-secondary mb-2">
          {religion.inanc} · {PRACTICE_LABELS[religion.pratik]} · Bağlılık {religion.baglilik}
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {INANC_OPTIONS.map((i) => (
            <Button key={i} variant="ghost" size="sm" onClick={() => setReligionBelief(i)}>
              {i}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {(Object.keys(PRACTICE_LABELS) as ReligionPractice[]).map((p) => (
            <Button key={p} variant="secondary" size="sm" onClick={() => setReligionPractice(p)}>
              {PRACTICE_LABELS[p]}
            </Button>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={worshipAction}>İbadet / tefekkür</Button>
      </Card>

      {player.yas >= 14 && (
        <Card variant="glass" padding="md">
          <div className="flex items-center gap-2 mb-3">
            <Scale size={20} className="text-accent" />
            <h3 className="font-display text-lg font-semibold text-content">Hukuk & Risk</h3>
          </div>
          <p className="text-xs text-content-muted mb-3">
            Sabıka {crime.sabika}
            {crime.tutuklu ? " · Tutuklu" : ""}
          </p>
          <p className="text-xs text-danger mb-2">Suç gerçekçi sonuçlar doğurur; puan kasma aracı değildir.</p>
          <div className="space-y-2">
            {CRIME_OPTIONS.filter((c) => player.yas >= c.minYas).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-button bg-surface-overlay/40 px-3 py-2">
                <div>
                  <p className="text-sm text-content">{c.ad}</p>
                  <p className="text-xs text-content-muted">Risk yüksek · Ceza {c.ceza.toLocaleString("tr-TR")} TL</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => attemptCrimeAction(c.id)}>
                  Dene
                </Button>
              </div>
            ))}
          </div>
          {crime.kayitlar.length > 0 && (
            <div className="mt-3 space-y-1">
              {crime.kayitlar.slice(0, 5).map((k) => (
                <p key={k.id} className="text-xs text-content-muted">
                  {k.yil}: {k.tip}
                </p>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
