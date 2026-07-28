import type { Character, Gender, Relationship } from "@/types/game";
import { TURKISH_NAMES, TURKISH_SURNAMES } from "@/lib/constants";

export interface DatingCandidate {
  id: string;
  isim: string;
  soyisim: string;
  yas: number;
  cinsiyet: Gender;
  meslek: string;
  puan: number;
}

export interface PregnancyState {
  partnerId: string;
  partnerIsim: string;
  kalanYil: number;
}

const JOBS = ["Öğretmen", "Mühendis", "Satış Temsilcisi", "Hemşire", "Yazılımcı", "Garson", "Avukat", "Tasarımcı"];

export function generateDatingCandidates(player: Character, count = 4): DatingCandidate[] {
  const opposite: Gender = player.cinsiyet === "erkek" ? "kadin" : "erkek";
  const names = TURKISH_NAMES[opposite];
  const list: DatingCandidate[] = [];
  for (let i = 0; i < count; i++) {
    const yas = Math.max(16, player.yas - 5 + Math.floor(Math.random() * 11));
    list.push({
      id: `date-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      isim: names[Math.floor(Math.random() * names.length)],
      soyisim: TURKISH_SURNAMES[Math.floor(Math.random() * TURKISH_SURNAMES.length)],
      yas,
      cinsiyet: opposite,
      meslek: JOBS[Math.floor(Math.random() * JOBS.length)],
      puan: 35 + Math.floor(Math.random() * 40),
    });
  }
  return list;
}

export function canGetPregnant(playerYas: number, hasPartner: boolean, alreadyPregnant: boolean): boolean {
  if (alreadyPregnant || !hasPartner) return false;
  return playerYas >= 18 && playerYas <= 45;
}

export function startPregnancy(partnerId: string, partnerIsim: string): PregnancyState {
  return { partnerId, partnerIsim, kalanYil: 1 };
}

export function tickPregnancy(p: PregnancyState | null): {
  pregnancy: PregnancyState | null;
  dogum: boolean;
} {
  if (!p) return { pregnancy: null, dogum: false };
  const kalan = p.kalanYil - 1;
  if (kalan <= 0) return { pregnancy: null, dogum: true };
  return { pregnancy: { ...p, kalanYil: kalan }, dogum: false };
}

/** Aldatma: partner puan düşüşü + yakalanma riski */
export function attemptCheat(
  relationships: Relationship[],
  partnerRelId: string
): { relationships: Relationship[]; yakalandi: boolean; mesaj: string } {
  const yakalandi = Math.random() < 0.4;
  const updated = relationships.map((r) => {
    if (r.id !== partnerRelId && r.targetId !== partnerRelId) return r;
    if (r.tip !== "es" && r.tip !== "sevgili") return r;
    return { ...r, puan: Math.max(0, r.puan - (yakalandi ? 45 : 10)) };
  });
  return {
    relationships: updated,
    yakalandi,
    mesaj: yakalandi
      ? "Aldatman ortaya çıktı! İlişki ağır hasar aldı."
      : "Gizli kaldı… ama vicdanın rahat değil.",
  };
}
