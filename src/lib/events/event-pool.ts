import type { AgeGroup, GameEvent } from "@/types/game";
import { generateAgeExclusiveEvents } from "@/lib/events/events-by-age";
import { weightBoostForFlags, type StoryFlag } from "@/lib/systems/story-continuity";

/** Tüm olaylar yaş bandına özel — başka yaşta asla çıkmaz */
const events: GameEvent[] = generateAgeExclusiveEvents();

export function getEventsForAge(yas: number): GameEvent[] {
  return events.filter((e) => {
    const min = e.minYas ?? 0;
    const max = e.maxYas ?? 120;
    return yas >= min && yas <= max;
  });
}

export function getEventsForAgeGroup(ageGroup: AgeGroup, yas?: number): GameEvent[] {
  if (yas !== undefined) return getEventsForAge(yas);
  return events.filter((e) => e.yasGrubu.includes(ageGroup));
}

/** Son çıkan olayları tekrar etme + hikâye bayraklarına göre ağırlık */
export function getRandomEvent(
  ageGroup: AgeGroup,
  yas?: number,
  recentIds: string[] = [],
  flags: StoryFlag[] = []
): GameEvent | null {
  const age = yas ?? ageGroupFallbackAge(ageGroup);
  let available = getEventsForAge(age);

  if (recentIds.length > 0) {
    const fresh = available.filter((e) => !recentIds.includes(e.id) && !recentIds.includes(e.baslik));
    if (fresh.length > 0) available = fresh;
  }

  if (available.length === 0) {
    const fallback = events.filter((e) => e.yasGrubu.includes(ageGroup));
    if (fallback.length === 0) return null;
    return pickWeighted(fallback, flags);
  }
  return pickWeighted(available, flags);
}

function pickWeighted(available: GameEvent[], flags: StoryFlag[] = []): GameEvent {
  const weights = available.map((e) => Math.max(1, e.oncelik * weightBoostForFlags(e, flags)));
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  for (let i = 0; i < available.length; i++) {
    random -= weights[i];
    if (random <= 0) return available[i];
  }
  return available[0];
}

function ageGroupFallbackAge(ageGroup: AgeGroup): number {
  const map: Record<AgeGroup, number> = {
    bebek: 1,
    cocuk: 4,
    ilkokul: 9,
    ergen: 15,
    genc: 21,
    yetiskin: 32,
    orta_yas: 50,
    yasli: 68,
    ileri_yas: 85,
  };
  return map[ageGroup];
}

export function getAllEvents(): GameEvent[] {
  return events;
}

export function countEventsForAge(yas: number): number {
  return getEventsForAge(yas).length;
}

export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  aile: "Aile",
  egitim: "Eğitim",
  kariyer: "Kariyer",
  saglik: "Sağlık",
  sosyal: "Sosyal",
  finans: "Finans",
  romantik: "Romantik",
  rastgele: "Gündelik",
  yasam: "Yaşam",
};
