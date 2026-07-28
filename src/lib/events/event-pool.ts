import type { AgeGroup, GameEvent } from "@/types/game";
import { generateProceduralEvents } from "@/lib/events/events-generated";
import { realisticBaseEvents } from "@/lib/events/events-realistic";

const events: GameEvent[] = [
  ...realisticBaseEvents,
  ...generateProceduralEvents(600),
];

export function getEventsForAgeGroup(ageGroup: AgeGroup, yas?: number): GameEvent[] {
  return events.filter((e) => {
    if (!e.yasGrubu.includes(ageGroup)) return false;
    if (yas !== undefined) {
      if (e.minYas !== undefined && yas < e.minYas) return false;
      if (e.maxYas !== undefined && yas > e.maxYas) return false;
    }
    return true;
  });
}

export function getRandomEvent(ageGroup: AgeGroup, yas?: number): GameEvent | null {
  const available = getEventsForAgeGroup(ageGroup, yas);
  if (available.length === 0) return null;

  const totalWeight = available.reduce((sum, e) => sum + e.oncelik, 0);
  let random = Math.random() * totalWeight;

  for (const event of available) {
    random -= event.oncelik;
    if (random <= 0) return event;
  }

  return available[0];
}

export function getAllEvents(): GameEvent[] {
  return events;
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
