import type { Character, Relationship } from "@/types/game";
import { CITIES } from "@/lib/constants";

export type NpcMemoryEmotion = "mutlu" | "kirgin" | "kin" | "minnet" | "notr";

export interface NpcMemory {
  id: string;
  npcId: string;
  olay: string;
  duygu: NpcMemoryEmotion;
  puanEtkisi: number;
  yil: number;
  unutulma: number;
}

export function createMemory(
  npcId: string,
  olay: string,
  duygu: NpcMemoryEmotion,
  puanEtkisi: number,
  yil: number
): NpcMemory {
  return {
    id: crypto.randomUUID(),
    npcId,
    olay,
    duygu,
    puanEtkisi,
    yil,
    unutulma: duygu === "kin" ? 20 : duygu === "kirgin" ? 10 : 5,
  };
}

export function decayMemories(memories: NpcMemory[]): NpcMemory[] {
  return memories
    .map((m) => ({ ...m, unutulma: m.unutulma - 1 }))
    .filter((m) => m.unutulma > 0);
}

export function shouldNpcForgive(npc: Character, memory: NpcMemory): boolean {
  const chance = npc.ozellikler.empati / 100 - Math.abs(memory.puanEtkisi) / 100;
  return Math.random() < Math.max(0.05, chance);
}

export function shouldNpcHoldGrudge(npc: Character, severity: number): boolean {
  const chance = (100 - npc.ozellikler.empati) / 120 + severity / 100;
  return Math.random() < chance;
}

export function applyMemoryToRelationship(
  relationship: Relationship,
  memories: NpcMemory[]
): Relationship {
  const npcMemories = memories.filter((m) => m.npcId === relationship.targetId);
  const delta = npcMemories.reduce((sum, m) => sum + Math.round(m.puanEtkisi * 0.2), 0);
  return {
    ...relationship,
    puan: Math.max(0, Math.min(100, relationship.puan + delta)),
  };
}

export function simulateNpcYear(
  npc: Character,
  yil: number,
  memories: NpcMemory[]
): { character: Character; memories: NpcMemory[]; moved: boolean; message?: string } {
  let updated: Character = {
    ...npc,
    yas: npc.yas + 1,
    updatedAt: new Date().toISOString(),
  };
  let newMemories = decayMemories(memories);
  let moved = false;
  let message: string | undefined;

  // İş değişikliği
  if (updated.yas >= 18 && updated.yas < 65 && Math.random() < 0.04) {
    const meslekler = ["Öğretmen", "Mühendis", "Garson", "Satış Temsilcisi", "Yazılımcı", "Şoför"];
    updated = {
      ...updated,
      meslek: meslekler[Math.floor(Math.random() * meslekler.length)],
      gelir: 8000 + Math.floor(Math.random() * 25000),
    };
    message = `${updated.isim} iş değiştirdi: ${updated.meslek}`;
  }

  // Emeklilik
  if (updated.yas >= 65 && updated.meslek !== "Emekli") {
    updated = { ...updated, meslek: "Emekli", gelir: Math.max(8000, Math.round(updated.gelir * 0.55)) };
    message = `${updated.isim} emekli oldu.`;
  }

  // Taşınma
  if (updated.yas >= 18 && Math.random() < 0.03) {
    const newCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    if (newCity !== updated.sehir) {
      updated = { ...updated, sehir: newCity };
      moved = true;
      message = `${updated.isim} ${newCity} şehrine taşındı.`;
      newMemories = [
        ...newMemories,
        createMemory(updated.id, `${newCity}'e taşındı`, "notr", 0, yil),
      ];
    }
  }

  // Evlilik (NPC bağımsız)
  if (!updated.esId && updated.yas >= 22 && updated.yas <= 45 && Math.random() < 0.02) {
    message = `${updated.isim} evlendi.`;
    newMemories = [
      ...newMemories,
      createMemory(updated.id, "Evlendi", "mutlu", 10, yil),
    ];
  }

  // Ölüm riski
  if (updated.yas > 78 && Math.random() < 0.025) {
    updated = { ...updated, durum: "oldu", saglik: 0 };
    message = `${updated.isim} vefat etti.`;
  } else if (updated.yas > 90 && Math.random() < 0.12) {
    updated = { ...updated, durum: "oldu", saglik: 0 };
    message = `${updated.isim} vefat etti.`;
  }

  // Kin / affetme
  newMemories = newMemories.flatMap((m) => {
    if (m.npcId !== updated.id) return [m];
    if (m.duygu === "kin" && shouldNpcForgive(updated, m)) {
      return [{ ...m, duygu: "notr" as const, puanEtkisi: Math.round(m.puanEtkisi / 2), unutulma: 3 }];
    }
    return [m];
  });

  void yil;
  return { character: updated, memories: newMemories, moved, message };
}

export function recordPlayerActionMemory(
  npcId: string,
  action: string,
  delta: number,
  yil: number,
  npc: Character
): NpcMemory | null {
  if (delta === 0) return null;

  let duygu: NpcMemoryEmotion = "notr";
  if (delta >= 8) duygu = "minnet";
  else if (delta > 0) duygu = "mutlu";
  else if (delta <= -12 && shouldNpcHoldGrudge(npc, Math.abs(delta))) duygu = "kin";
  else if (delta < 0) duygu = "kirgin";

  return createMemory(npcId, action, duygu, delta, yil);
}
