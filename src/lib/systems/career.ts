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
  deneyim: number,
  un = 0
): number {
  const baseSalaries: Record<string, number> = {
    "Öğretmen": 15000,
    "Doktor": 45000,
    "Uzman Doktor": 65000,
    "Başhekim": 90000,
    "Asistan Doktor": 28000,
    "Stajyer Doktor": 16000,
    "Mühendis": 35000,
    "Junior Mühendis": 22000,
    "Kıdemli Mühendis": 48000,
    "Teknik Direktör": 75000,
    "Avukat": 40000,
    "Stajyer Avukat": 18000,
    "Kıdemli Avukat": 55000,
    "Ortak Avukat": 80000,
    "Yazılımcı": 40000,
    "Junior Yazılımcı": 25000,
    "Kıdemli Yazılımcı": 55000,
    "CTO": 95000,
    "Garson": 8000,
    "CEO": 100000,
    "Figüran": 8000,
    "Oyuncu": 25000,
    "Ünlü Oyuncu": 70000,
    "Süperstar": 150000,
    "Amatör Sporcu": 5000,
    "Profesyonel Sporcu": 40000,
    "Milli Sporcu": 80000,
    "Efsane Sporcu": 120000,
    "Öğrenci": 0,
    "Emekli": 12000,
    "Asker": 9000,
  };

  const base = baseSalaries[meslek] ?? 12000;
  const zekaBonus = (zeka - 50) * 100;
  const deneyimBonus = deneyim * 500;
  const fameBonus = un * 200;

  return Math.max(0, base + zekaBonus + deneyimBonus + fameBonus);
}

export function getAvailableProfessions(
  egitim: string,
  yas: number,
  bolum?: string | null,
  trackJobs?: string[]
): string[] {
  if (yas < 16) return ["Öğrenci"];
  if (yas >= 65) return ["Emekli"];

  const professions = [
    "Öğretmen", "Hemşire", "Polis", "Aşçı", "Garson", "Muhasebeci",
    "Tasarımcı", "Gazeteci", "Müzisyen", "Bankacı", "Kuaför", "Şoför",
    "Güvenlik Görevlisi",
  ];

  if (egitim === "universite" || egitim === "yuksek_lisans" || egitim === "doktora") {
    professions.push("Mühendis", "Avukat", "Yazılımcı", "Doktor", "Mimar", "Eczacı", "CEO", "Girişimci");
  }

  if (bolum === "Tıp") professions.unshift("Stajyer Doktor", "Asistan Doktor", "Uzman Doktor");
  if (bolum === "Hukuk") professions.unshift("Stajyer Avukat", "Avukat", "Kıdemli Avukat");
  if (bolum === "Mühendislik") professions.unshift("Junior Mühendis", "Mühendis", "Kıdemli Mühendis");
  if (bolum === "Bilgisayar") professions.unshift("Junior Yazılımcı", "Yazılımcı", "Kıdemli Yazılımcı");
  if (bolum === "Güzel Sanatlar") professions.unshift("Figüran", "Oyuncu", "Ünlü Oyuncu");
  if (bolum === "Spor Bilimleri") professions.unshift("Amatör Sporcu", "Profesyonel Sporcu");

  if (trackJobs?.length) {
    for (const j of trackJobs) {
      if (!professions.includes(j)) professions.unshift(j);
    }
  }

  return [...new Set(professions)];
}

export function canRetire(yas: number): boolean {
  return yas >= 60;
}

export function getRetirementBenefit(gelir: number, yas: number): number {
  if (yas < 60) return 0;
  const years = yas - 60;
  return gelir * 0.6 + years * 500;
}
