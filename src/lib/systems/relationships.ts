import type { Character, Relationship } from "@/types/game";

export interface ActionCooldown {
  targetId: string;
  action: string;
  lastYil: number;
  yillikSayac: number;
}

/** Yıllık kullanım limitleri — puan kasma engeli */
export const ACTION_LIMITS: Record<
  string,
  { maxPerYear: number; cooldownYears: number; minYas: number; maxDelta: number; mesaj: string }
> = {
  sohbet: { maxPerYear: 3, cooldownYears: 0, minYas: 2, maxDelta: 2, mesaj: "Kısa bir sohbet ettiniz." },
  mesaj: { maxPerYear: 4, cooldownYears: 0, minYas: 10, maxDelta: 1, mesaj: "Mesajlaştınız." },
  ara: { maxPerYear: 2, cooldownYears: 0, minYas: 12, maxDelta: 2, mesaj: "Telefonla konuştunuz." },
  hediye: { maxPerYear: 1, cooldownYears: 0, minYas: 6, maxDelta: 4, mesaj: "Küçük bir hediye verdin." },
  vakit: { maxPerYear: 2, cooldownYears: 0, minYas: 3, maxDelta: 3, mesaj: "Birlikte vakit geçirdiniz." },
  tatil: { maxPerYear: 1, cooldownYears: 1, minYas: 16, maxDelta: 5, mesaj: "Birlikte kısa bir tatil yaptınız." },
  ozur: { maxPerYear: 1, cooldownYears: 0, minYas: 6, maxDelta: 4, mesaj: "Samimi bir özür diledin." },
  kavga: { maxPerYear: 1, cooldownYears: 0, minYas: 8, maxDelta: -6, mesaj: "Sert bir tartışma yaşandı." },
  bitir: { maxPerYear: 1, cooldownYears: 0, minYas: 14, maxDelta: -40, mesaj: "İlişkiyi sonlandırdın." },
  flort: { maxPerYear: 2, cooldownYears: 0, minYas: 15, maxDelta: 3, mesaj: "Nazikçe flört ettin." },
  sevgili: { maxPerYear: 1, cooldownYears: 0, minYas: 16, maxDelta: 8, mesaj: "Resmen çıkmaya başladınız." },
  nisan: { maxPerYear: 1, cooldownYears: 0, minYas: 18, maxDelta: 10, mesaj: "Nişanlandınız." },
  evlilik: { maxPerYear: 1, cooldownYears: 0, minYas: 18, maxDelta: 12, mesaj: "Evlendiniz." },
  bosanma: { maxPerYear: 1, cooldownYears: 0, minYas: 18, maxDelta: -25, mesaj: "Boşandınız." },
  cocuk: { maxPerYear: 1, cooldownYears: 1, minYas: 18, maxDelta: 5, mesaj: "Çocuk sahibi oldunuz." },
};

export function canFlirt(yas: number): boolean {
  return yas >= 15;
}

export function canDate(yas: number): boolean {
  return yas >= 16;
}

export function canMarry(yas: number): boolean {
  return yas >= 18;
}

export function canHaveChild(yas: number, cinsiyet: string): boolean {
  if (yas < 18) return false;
  if (cinsiyet === "kadin" && yas > 48) return false;
  if (cinsiyet === "erkek" && yas > 65) return false;
  return true;
}

export function checkActionAllowed(
  playerYas: number,
  targetId: string,
  action: string,
  currentYil: number,
  cooldowns: ActionCooldown[]
): { ok: boolean; reason?: string } {
  const limit = ACTION_LIMITS[action];
  if (!limit) return { ok: false, reason: "Geçersiz eylem." };
  if (playerYas < limit.minYas) {
    return { ok: false, reason: `Bu eylem için en az ${limit.minYas} yaşında olmalısın.` };
  }

  const record = cooldowns.find((c) => c.targetId === targetId && c.action === action);
  if (record) {
    if (currentYil - record.lastYil < limit.cooldownYears) {
      return { ok: false, reason: "Bu eylemi tekrar denemek için biraz daha beklemelisin." };
    }
    if (record.lastYil === currentYil && record.yillikSayac >= limit.maxPerYear) {
      return {
        ok: false,
        reason: `Bu yıl bu kişiyle "${action}" limitine ulaştın (${limit.maxPerYear}/${limit.maxPerYear}).`,
      };
    }
  }

  return { ok: true };
}

export function applyRelationshipAction(
  relationship: Relationship,
  action: string,
  playerYas: number
): { puan: number; mesaj: string; delta: number } {
  const limit = ACTION_LIMITS[action];
  if (!limit) return { puan: relationship.puan, mesaj: "Bir şey olmadı.", delta: 0 };
  if (playerYas < limit.minYas) {
    return { puan: relationship.puan, mesaj: `Bu eylem için çok gençsin.`, delta: 0 };
  }

  // Azalan getiri: ilişki zaten yüksekse puan artışı düşer
  let delta = limit.maxDelta;
  if (delta > 0 && relationship.puan >= 80) delta = Math.max(1, Math.floor(delta * 0.4));
  else if (delta > 0 && relationship.puan >= 60) delta = Math.max(1, Math.floor(delta * 0.7));

  const newPuan = Math.max(0, Math.min(100, relationship.puan + delta));
  return { puan: newPuan, mesaj: limit.mesaj, delta: newPuan - relationship.puan };
}

export function updateCooldowns(
  cooldowns: ActionCooldown[],
  targetId: string,
  action: string,
  currentYil: number
): ActionCooldown[] {
  const existing = cooldowns.find((c) => c.targetId === targetId && c.action === action);
  if (!existing) {
    return [...cooldowns, { targetId, action, lastYil: currentYil, yillikSayac: 1 }];
  }
  if (existing.lastYil === currentYil) {
    return cooldowns.map((c) =>
      c === existing ? { ...c, yillikSayac: c.yillikSayac + 1, lastYil: currentYil } : c
    );
  }
  return cooldowns.map((c) =>
    c === existing ? { ...c, lastYil: currentYil, yillikSayac: 1 } : c
  );
}

export function getRelationshipLevel(puan: number): string {
  if (puan >= 90) return "Çok yakın";
  if (puan >= 70) return "İyi";
  if (puan >= 50) return "Normal";
  if (puan >= 30) return "Soğuk";
  if (puan >= 10) return "Gergin";
  return "Kopuk";
}

export function simulateNpcLife(npc: Character, yil: number): Partial<Character> {
  const updates: Partial<Character> = {};
  if (npc.yas >= 18 && npc.yas < 65 && Math.random() < 0.03) {
    const meslekler = ["Öğretmen", "Mühendis", "Hemşire", "Garson", "Şoför", "Muhasebeci"];
    updates.meslek = meslekler[Math.floor(Math.random() * meslekler.length)];
  }
  if (npc.yas >= 65) {
    updates.meslek = "Emekli";
    updates.gelir = Math.max(npc.gelir * 0.55, 7500);
  }
  if (npc.yas > 78 && Math.random() < 0.02) updates.durum = "oldu";
  void yil;
  return updates;
}
