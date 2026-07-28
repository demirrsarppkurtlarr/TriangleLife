import type { Character, Relationship } from "@/types/game";

export function canFlirt(yas: number): boolean {
  return yas >= 14;
}

export function canDate(yas: number): boolean {
  return yas >= 16;
}

export function canMarry(yas: number): boolean {
  return yas >= 18;
}

export function canHaveChild(yas: number, cinsiyet: string): boolean {
  if (yas < 18) return false;
  if (cinsiyet === "kadin" && yas > 50) return false;
  if (cinsiyet === "erkek" && yas > 70) return false;
  return true;
}

export function applyRelationshipAction(
  relationship: Relationship,
  action: string
): { puan: number; mesaj: string } {
  const changes: Record<string, { delta: number; mesaj: string }> = {
    sohbet: { delta: 3, mesaj: "Güzel bir sohbet ettin." },
    mesaj: { delta: 2, mesaj: "Mesaj gönderdin." },
    ara: { delta: 4, mesaj: "Telefon görüşmesi yaptın." },
    hediye: { delta: 8, mesaj: "Hediye verdin!" },
    vakit: { delta: 10, mesaj: "Birlikte güzel vakit geçirdin." },
    tatil: { delta: 15, mesaj: "Harika bir tatil yaptın!" },
    ozur: { delta: 12, mesaj: "Özür diledin, ilişki düzeldi." },
    kavga: { delta: -15, mesaj: "Kavga ettin, ilişki zarar gördü." },
    bitir: { delta: -100, mesaj: "İlişkiyi bitirdin." },
    flort: { delta: 10, mesaj: "Flört etmeye başladın." },
    sevgili: { delta: 15, mesaj: "Sevgili oldun!" },
    nisan: { delta: 20, mesaj: "Nişanlandın!" },
    evlilik: { delta: 25, mesaj: "Evlendin!" },
    bosanma: { delta: -50, mesaj: "Boşandın." },
  };

  const change = changes[action];
  if (!change) return { puan: relationship.puan, mesaj: "Bir şey oldu." };

  const newPuan = Math.max(0, Math.min(100, relationship.puan + change.delta));
  return { puan: newPuan, mesaj: change.mesaj };
}

export function getRelationshipLevel(puan: number): string {
  if (puan >= 90) return "Mükemmel";
  if (puan >= 70) return "İyi";
  if (puan >= 50) return "Normal";
  if (puan >= 30) return "Zayıf";
  if (puan >= 10) return "Kötü";
  return "Düşman";
}

export function shouldNpcForgive(
  empati: number,
  olayCiddiyeti: number
): boolean {
  const forgivenessChance = empati / 100 - olayCiddiyeti / 100;
  return Math.random() < forgivenessChance;
}

export function shouldNpcRemember(
  sevgi: number,
  olayCiddiyeti: number
): boolean {
  const memoryChance = (100 - sevgi) / 100 + olayCiddiyeti / 100;
  return Math.random() < memoryChance;
}

export function simulateNpcLife(npc: Character, yil: number): Partial<Character> {
  const updates: Partial<Character> = {};

  if (npc.yas >= 18 && Math.random() < 0.05) {
    const meslekler = ["Öğretmen", "Mühendis", "Doktor", "Garson", "Şoför"];
    updates.meslek = meslekler[Math.floor(Math.random() * meslekler.length)];
  }

  if (npc.yas >= 65) {
    updates.meslek = "Emekli";
    updates.gelir = Math.max(npc.gelir * 0.6, 8000);
  }

  if (npc.yas > 75 && Math.random() < 0.02) {
    updates.durum = "oldu";
  }

  void yil;
  return updates;
}
