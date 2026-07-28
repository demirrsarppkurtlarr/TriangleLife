import type { PersonalityTraits, Gender } from "@/types/game";
import {
  TURKISH_NAMES,
  TURKISH_SURNAMES,
  PROFESSIONS,
} from "@/lib/constants";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

export function generatePersonality(): PersonalityTraits {
  return {
    mutluluk: randomInt(30, 80),
    saglik: randomInt(40, 90),
    zeka: randomInt(30, 90),
    sabir: randomInt(20, 80),
    comertlik: randomInt(20, 80),
    sosyallik: randomInt(20, 90),
    guven: randomInt(30, 80),
    sevgi: randomInt(30, 80),
    empati: randomInt(20, 80),
  };
}

export function generateName(cinsiyet: Gender): { isim: string; soyisim: string } {
  const isim = randomItem(TURKISH_NAMES[cinsiyet]);
  const soyisim = randomItem(TURKISH_SURNAMES);
  return { isim, soyisim };
}

export function generateAgeForRole(role: "anne" | "baba" | "kardes"): number {
  switch (role) {
    case "anne":
      return randomInt(22, 40);
    case "baba":
      return randomInt(24, 42);
    case "kardes":
      return randomInt(0, 15);
    default:
      return randomInt(20, 40);
  }
}

export function generateIncome(meslek: string): number {
  const highIncome = ["Doktor", "CEO", "Pilot", "Avukat", "Mühendis", "Yazılımcı"];
  const midIncome = ["Öğretmen", "Hemşire", "Polis", "Mimar", "Eczacı", "Bankacı"];
  const lowIncome = ["Garson", "Temizlik Görevlisi", "Çiftçi", "Kurye"];

  if (highIncome.includes(meslek)) return randomInt(25000, 80000);
  if (midIncome.includes(meslek)) return randomInt(12000, 30000);
  if (lowIncome.includes(meslek)) return randomInt(5000, 12000);
  if (meslek === "Emekli") return randomInt(8000, 15000);
  if (meslek === "Ev Hanımı" || meslek === "Öğrenci") return 0;
  return randomInt(8000, 25000);
}

export interface GeneratedFamilyMember {
  isim: string;
  soyisim: string;
  yas: number;
  cinsiyet: Gender;
  meslek: string;
  gelir: number;
  ozellikler: PersonalityTraits;
  rol: "anne" | "baba" | "kardes" | "dede" | "anneanne" | "babaanne";
}

export function generateFamily(options?: {
  soyisim?: string;
  kardesSayisi?: number;
}): GeneratedFamilyMember[] {
  const soyisim = options?.soyisim ?? randomItem(TURKISH_SURNAMES);
  const anneYas = generateAgeForRole("anne");
  const babaYas = generateAgeForRole("baba");

  const anne: GeneratedFamilyMember = {
    isim: randomItem(TURKISH_NAMES.kadin),
    soyisim,
    yas: anneYas,
    cinsiyet: "kadin",
    meslek: randomItem(PROFESSIONS.filter((p) => !["Öğrenci", "CEO", "Pilot"].includes(p)).slice(0, 40)),
    gelir: 0,
    ozellikler: generatePersonality(),
    rol: "anne",
  };
  anne.gelir = generateIncome(anne.meslek);

  const baba: GeneratedFamilyMember = {
    isim: randomItem(TURKISH_NAMES.erkek),
    soyisim,
    yas: babaYas,
    cinsiyet: "erkek",
    meslek: randomItem(PROFESSIONS.filter((p) => !["Öğrenci", "Ev Hanımı"].includes(p)).slice(0, 40)),
    gelir: 0,
    ozellikler: generatePersonality(),
    rol: "baba",
  };
  baba.gelir = generateIncome(baba.meslek);

  const members: GeneratedFamilyMember[] = [anne, baba];

  // Büyükler (BitLife: grandparents)
  if (Math.random() < 0.85) {
    members.push({
      isim: randomItem(TURKISH_NAMES.erkek),
      soyisim,
      yas: babaYas + randomInt(22, 32),
      cinsiyet: "erkek",
      meslek: "Emekli",
      gelir: generateIncome("Emekli"),
      ozellikler: generatePersonality(),
      rol: "dede",
    });
  }
  if (Math.random() < 0.85) {
    members.push({
      isim: randomItem(TURKISH_NAMES.kadin),
      soyisim,
      yas: anneYas + randomInt(20, 30),
      cinsiyet: "kadin",
      meslek: Math.random() < 0.5 ? "Emekli" : "Ev Hanımı",
      gelir: generateIncome("Emekli"),
      ozellikler: generatePersonality(),
      rol: Math.random() < 0.5 ? "anneanne" : "babaanne",
    });
  }

  const kardesSayisi = options?.kardesSayisi ?? randomInt(0, 3);
  const usedNames = new Set(members.map((m) => m.isim));
  for (let i = 0; i < kardesSayisi; i++) {
    const cinsiyet: Gender = Math.random() > 0.5 ? "erkek" : "kadin";
    let isim = randomItem(TURKISH_NAMES[cinsiyet]);
    let guard = 0;
    while (usedNames.has(isim) && guard < 20) {
      isim = randomItem(TURKISH_NAMES[cinsiyet]);
      guard++;
    }
    usedNames.add(isim);
    const kardesYas = randomInt(1, Math.min(14, Math.max(1, anneYas - 18)));
    members.push({
      isim,
      soyisim,
      yas: kardesYas,
      cinsiyet,
      meslek: kardesYas < 6 ? null as unknown as string : "Öğrenci",
      gelir: 0,
      ozellikler: generatePersonality(),
      rol: "kardes",
    });
  }

  // Fix meslek null - use empty student
  return members.map((m) => ({
    ...m,
    meslek: m.meslek || (m.yas < 18 ? "Öğrenci" : "İşsiz"),
  }));
}

export function buildPersonalityFromFocus(
  focus: string
): PersonalityTraits {
  const base = generatePersonality();
  if (focus === "dengeli") return base;

  const map: Record<string, keyof PersonalityTraits> = {
    zeka: "zeka",
    sosyallik: "sosyallik",
    guven: "guven",
    empati: "empati",
    saglik: "saglik",
  };

  const key = map[focus];
  if (key) {
    return { ...base, [key]: clamp(base[key] + 20) };
  }
  return base;
}

export function generatePlayer(cinsiyet: Gender, baslangicYili: number): {
  isim: string;
  soyisim: string;
  yas: number;
  cinsiyet: Gender;
  ozellikler: PersonalityTraits;
} {
  const family = generateFamily();
  const soyisim = family[0].soyisim;

  return {
    isim: randomItem(TURKISH_NAMES[cinsiyet]),
    soyisim,
    yas: 0,
    cinsiyet,
    ozellikler: generatePersonality(),
  };
}

export function applyTraitChange(
  traits: PersonalityTraits,
  key: keyof PersonalityTraits,
  delta: number
): PersonalityTraits {
  return { ...traits, [key]: clamp(traits[key] + delta) };
}

export function calculateHealthImpact(
  saglik: number,
  stres: number,
  uyku: number,
  beslenme: number
): number {
  const base = saglik;
  const stresPenalty = stres > 70 ? (stres - 70) * 0.3 : 0;
  const uykuBonus = uyku > 60 ? (uyku - 60) * 0.1 : 0;
  const beslenmeBonus = beslenme > 60 ? (beslenme - 60) * 0.1 : 0;
  return clamp(base - stresPenalty + uykuBonus + beslenmeBonus);
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatAge(yas: number): string {
  if (yas === 0) return "0 yaş";
  return `${yas} yaş`;
}
