export interface Hobby {
  id: string;
  ad: string;
  seviye: number;
  minYas: number;
  maliyet: number;
  mutluluk: number;
  zeka?: number;
  saglik?: number;
  sosyallik?: number;
}

export const HOBBY_CATALOG: Omit<Hobby, "seviye">[] = [
  { id: "futbol", ad: "Futbol", minYas: 6, maliyet: 100, mutluluk: 4, saglik: 3, sosyallik: 3 },
  { id: "yuzme", ad: "Yüzme", minYas: 5, maliyet: 150, mutluluk: 4, saglik: 4 },
  { id: "gitar", ad: "Gitar", minYas: 8, maliyet: 200, mutluluk: 5, zeka: 2 },
  { id: "resim", ad: "Resim", minYas: 6, maliyet: 80, mutluluk: 4, zeka: 2 },
  { id: "okuma", ad: "Okuma", minYas: 7, maliyet: 50, mutluluk: 3, zeka: 4 },
  { id: "satranc", ad: "Satranç", minYas: 8, maliyet: 40, mutluluk: 3, zeka: 5 },
  { id: "kosu", ad: "Koşu", minYas: 12, maliyet: 60, mutluluk: 4, saglik: 5 },
  { id: "fotograf", ad: "Fotoğrafçılık", minYas: 14, maliyet: 300, mutluluk: 4, zeka: 2 },
  { id: "yemek", ad: "Yemek yapmak", minYas: 12, maliyet: 120, mutluluk: 5, sosyallik: 2 },
  { id: "bahce", ad: "Bahçecilik", minYas: 10, maliyet: 90, mutluluk: 4, saglik: 2 },
  { id: "yazilim", ad: "Yazılım / kod", minYas: 13, maliyet: 0, mutluluk: 3, zeka: 5 },
  { id: "dans", ad: "Dans", minYas: 8, maliyet: 200, mutluluk: 5, saglik: 3, sosyallik: 4 },
];

export function getAvailableHobbies(yas: number, owned: Hobby[]): Omit<Hobby, "seviye">[] {
  const ownedIds = new Set(owned.map((h) => h.id));
  return HOBBY_CATALOG.filter((h) => yas >= h.minYas && !ownedIds.has(h.id));
}

export function startHobby(catalogId: string, yas: number): Hobby | null {
  const base = HOBBY_CATALOG.find((h) => h.id === catalogId);
  if (!base || yas < base.minYas) return null;
  return { ...base, seviye: 1 };
}

export function practiceHobby(hobby: Hobby): Hobby {
  return { ...hobby, seviye: Math.min(100, hobby.seviye + 3 + Math.floor(Math.random() * 3)) };
}

export function hobbyTier(seviye: number): string {
  if (seviye < 20) return "Acemi";
  if (seviye < 45) return "Orta";
  if (seviye < 70) return "İleri";
  if (seviye < 90) return "Uzman";
  return "Usta";
}
