import type { Character } from "@/types/game";

export interface HealthStatus {
  genel: number;
  risk: "dusuk" | "orta" | "yuksek";
  uyari: string | null;
}

export function assessHealth(character: Character): HealthStatus {
  const factors = [
  character.saglik,
    character.uyku,
    character.beslenme,
    100 - character.stres,
    character.psikoloji,
  ];

  const genel = Math.round(
    factors.reduce((sum, v) => sum + v, 0) / factors.length
  );

  let risk: HealthStatus["risk"] = "dusuk";
  let uyari: string | null = null;

  if (genel < 30) {
    risk = "yuksek";
    uyari = "Sağlık durumun kritik! Doktora gitmelisin.";
  } else if (genel < 50) {
    risk = "orta";
    uyari = "Sağlığını ihmal ediyorsun. Dikkat et.";
  }

  if (character.stres > 80) {
    uyari = "Stres seviyen çok yüksek. Dinlenmeye ihtiyacın var.";
    risk = risk === "dusuk" ? "orta" : risk;
  }

  if (character.uyku < 30) {
    uyari = "Uyku düzensizliği sağlığını etkiliyor.";
  }

  return { genel, risk, uyari };
}

export function applyHealthDecay(character: Character): Partial<Character> {
  const decay = {
    stres: Math.min(100, character.stres + Math.floor(Math.random() * 3)),
    uyku: Math.max(0, character.uyku - Math.floor(Math.random() * 2)),
    beslenme: Math.max(0, character.beslenme - Math.floor(Math.random() * 2)),
  };

  const saglikDecay = character.stres > 70 ? 2 : character.stres > 50 ? 1 : 0;

  return {
    ...decay,
    saglik: Math.max(0, character.saglik - saglikDecay),
  };
}

export function applyHealing(
  character: Character,
  tip: "doktor" | "dinlenme" | "spor" | "beslenme"
): Partial<Character> {
  switch (tip) {
    case "doktor":
      return {
        saglik: Math.min(100, character.saglik + 20),
        stres: Math.max(0, character.stres - 5),
      };
    case "dinlenme":
      return {
        uyku: Math.min(100, character.uyku + 15),
        stres: Math.max(0, character.stres - 10),
        mutluluk: Math.min(100, character.mutluluk + 5),
      };
    case "spor":
      return {
        saglik: Math.min(100, character.saglik + 10),
        stres: Math.max(0, character.stres - 8),
        mutluluk: Math.min(100, character.mutluluk + 5),
      };
    case "beslenme":
      return {
        beslenme: Math.min(100, character.beslenme + 15),
        saglik: Math.min(100, character.saglik + 5),
      };
    default:
      return {};
  }
}

export function calculateIdealWeight(yas: number, cinsiyet: string): number {
  if (yas < 2) return 3 + yas * 4;
  if (yas < 12) return 20 + yas * 2;
  if (cinsiyet === "erkek") return 60 + (yas - 12) * 1.5;
  return 55 + (yas - 12) * 1.2;
}

export function getWeightStatus(
  kilo: number,
  ideal: number
): "normal" | "zayif" | "fazla" {
  const ratio = kilo / ideal;
  if (ratio < 0.85) return "zayif";
  if (ratio > 1.15) return "fazla";
  return "normal";
}
