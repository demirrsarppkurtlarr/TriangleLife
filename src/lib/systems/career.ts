import type { Character } from "@/types/game";
import { getAgeGroup } from "@/lib/constants";

export function canWork(character: Character): boolean {
  return character.yas >= 16 && character.durum === "yasiyor";
}

export function canStudy(character: Character): boolean {
  const ageGroup = getAgeGroup(character.yas);
  return ["ilkokul", "ergen", "genc"].includes(ageGroup);
}

export function getEducationForAge(yas: number): string | null {
  if (yas >= 3 && yas <= 5) return "anaokulu";
  if (yas >= 6 && yas <= 12) return "ilkokul";
  if (yas >= 13 && yas <= 17) return "lise";
  if (yas >= 18 && yas <= 22) return "universite";
  return null;
}

export function calculateSalary(
  meslek: string,
  zeka: number,
  deneyim: number
): number {
  const baseSalaries: Record<string, number> = {
    "Öğretmen": 15000,
    "Doktor": 45000,
    "Mühendis": 35000,
    "Avukat": 40000,
    "Yazılımcı": 40000,
    "Garson": 8000,
    "CEO": 100000,
    "Öğrenci": 0,
    "Emekli": 12000,
  };

  const base = baseSalaries[meslek] ?? 12000;
  const zekaBonus = (zeka - 50) * 100;
  const deneyimBonus = deneyim * 500;

  return Math.max(0, base + zekaBonus + deneyimBonus);
}

export function getAvailableProfessions(
  egitim: string,
  yas: number
): string[] {
  if (yas < 16) return ["Öğrenci"];
  if (yas >= 65) return ["Emekli"];

  const professions = [
    "Öğretmen", "Doktor", "Mühendis", "Avukat", "Hemşire",
    "Polis", "Aşçı", "Garson", "Muhasebeci", "Yazılımcı",
    "Tasarımcı", "Mimar", "Eczacı", "Gazeteci", "Müzisyen",
    "İşletmeci", "Bankacı", "Kuaför", "Şoför", "Güvenlik Görevlisi",
  ];

  if (egitim === "universite" || egitim === "yuksek_lisans" || egitim === "doktora") {
    professions.push("CEO", "Girişimci", "Pilot", "Veteriner");
  }

  return professions;
}

export function canRetire(yas: number): boolean {
  return yas >= 60;
}

export function getRetirementBenefit(gelir: number, yas: number): number {
  if (yas < 60) return 0;
  const years = yas - 60;
  return gelir * 0.6 + years * 500;
}
