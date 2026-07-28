export type FamilyWealth = "dar" | "orta" | "varlikli";
export type CharacterDifficulty = "kolay" | "normal" | "zor";
export type PersonalityFocus = "zeka" | "sosyallik" | "guven" | "empati" | "saglik" | "dengeli";
export type HairColor = "siyah" | "kahve" | "sari" | "kizil" | "kumral";
export type EyeColor = "kahve" | "ela" | "yesil" | "mavi" | "gri";
export type SkinTone = "acik" | "bugday" | "orta" | "esmer";

export interface CharacterCreationOptions {
  cinsiyet: "erkek" | "kadin";
  isim: string;
  soyisim: string;
  sehir: string;
  kardesSayisi: number;
  aileDurumu: FamilyWealth;
  zorluk: CharacterDifficulty;
  kisilikOdagi: PersonalityFocus;
  sacRengi: HairColor;
  gozRengi: EyeColor;
  tenRengi: SkinTone;
  dogumYili: number;
}

export const WEALTH_LABELS: Record<FamilyWealth, string> = {
  dar: "Dar Gelir",
  orta: "Orta Sınıf",
  varlikli: "Varlıklı",
};

export const WEALTH_STARTING_MONEY: Record<FamilyWealth, number> = {
  dar: 40000,
  orta: 180000,
  varlikli: 750000,
};

export const DIFFICULTY_LABELS: Record<CharacterDifficulty, string> = {
  kolay: "Kolay",
  normal: "Normal",
  zor: "Zor",
};

export const FOCUS_LABELS: Record<PersonalityFocus, string> = {
  dengeli: "Dengeli",
  zeka: "Zeki",
  sosyallik: "Sosyal",
  guven: "Özgüvenli",
  empati: "Empatik",
  saglik: "Sağlıklı",
};

export const HAIR_LABELS: Record<HairColor, string> = {
  siyah: "Siyah",
  kahve: "Kahverengi",
  sari: "Sarı",
  kizil: "Kızıl",
  kumral: "Kumral",
};

export const EYE_LABELS: Record<EyeColor, string> = {
  kahve: "Kahverengi",
  ela: "Ela",
  yesil: "Yeşil",
  mavi: "Mavi",
  gri: "Gri",
};

export const SKIN_LABELS: Record<SkinTone, string> = {
  acik: "Açık",
  bugday: "Buğday",
  orta: "Orta",
  esmer: "Esmer",
};
