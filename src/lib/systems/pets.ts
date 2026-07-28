export interface Pet {
  id: string;
  isim: string;
  tur: "kedi" | "kopek" | "kus" | "balik" | "hamster";
  yas: number;
  saglik: number;
  mutluluk: number;
  bakimYil: number;
}

export const PET_TYPES: Array<{ tur: Pet["tur"]; ad: string; maliyet: number; maxYas: number }> = [
  { tur: "kedi", ad: "Kedi", maliyet: 1500, maxYas: 18 },
  { tur: "kopek", ad: "Köpek", maliyet: 2500, maxYas: 14 },
  { tur: "kus", ad: "Kuş", maliyet: 400, maxYas: 12 },
  { tur: "balik", ad: "Balık", maliyet: 150, maxYas: 8 },
  { tur: "hamster", ad: "Hamster", maliyet: 200, maxYas: 4 },
];

const PET_NAMES = ["Pamuk", "Boncuk", "Lokum", "Mırmır", "Zeytin", "Bulut", "Minnoş", "Karabaş", "Tekir", "Şans"];

export function adoptPet(tur: Pet["tur"], yil: number): Pet {
  const isim = PET_NAMES[Math.floor(Math.random() * PET_NAMES.length)];
  return {
    id: `pet-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    isim,
    tur,
    yas: 0,
    saglik: 80 + Math.floor(Math.random() * 20),
    mutluluk: 70 + Math.floor(Math.random() * 25),
    bakimYil: yil,
  };
}

export function carePet(pet: Pet, yil: number): Pet {
  return {
    ...pet,
    saglik: Math.min(100, pet.saglik + 8),
    mutluluk: Math.min(100, pet.mutluluk + 12),
    bakimYil: yil,
  };
}

export function tickPets(
  pets: Pet[],
  yil: number
): { pets: Pet[]; mesajlar: string[]; mutlulukDelta: number } {
  const mesajlar: string[] = [];
  let mutlulukDelta = 0;
  const next: Pet[] = [];

  for (const pet of pets) {
    const tip = PET_TYPES.find((t) => t.tur === pet.tur);
    const maxYas = tip?.maxYas ?? 12;
    const neglected = yil - pet.bakimYil > 1;
    let saglik = pet.saglik - (neglected ? 18 : 4) - Math.floor(Math.random() * 4);
    let mutluluk = pet.mutluluk - (neglected ? 15 : 3);
    const yas = pet.yas + 1;

    if (yas >= maxYas || saglik <= 0) {
      mesajlar.push(`${pet.isim} (${tip?.ad ?? pet.tur}) hayatını kaybetti.`);
      mutlulukDelta -= 8;
      continue;
    }

    if (neglected) {
      mesajlar.push(`${pet.isim} bakımsız kaldı.`);
    } else {
      mutlulukDelta += 2;
    }

    next.push({
      ...pet,
      yas,
      saglik: Math.max(1, Math.min(100, saglik)),
      mutluluk: Math.max(1, Math.min(100, mutluluk)),
    });
  }

  return { pets: next, mesajlar, mutlulukDelta };
}
