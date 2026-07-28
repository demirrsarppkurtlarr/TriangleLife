import type { Character, Gender, Relationship, Life } from "@/types/game";
import { TURKISH_NAMES } from "@/lib/constants";
import { generatePersonality } from "@/lib/generators";
import { inheritGenetics } from "@/lib/systems/genetics";

function createId(): string {
  return crypto.randomUUID();
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createSpouse(
  player: Character,
  life: Life
): Character {
  const spouseGender: Gender = player.cinsiyet === "erkek" ? "kadin" : "erkek";
  const yas = player.yas + randomInt(-3, 3);

  return {
    id: createId(),
    userId: player.userId,
    lifeId: life.id,
    isim: randomItem(TURKISH_NAMES[spouseGender]),
    soyisim: player.soyisim,
    yas: Math.max(18, yas),
    dogumYili: life.mevcutYil - Math.max(18, yas),
    cinsiyet: spouseGender,
    meslek: randomItem(["Öğretmen", "Mühendis", "Hemşire", "Avukat", "Tasarımcı"]),
    gelir: randomInt(10000, 30000),
    ozellikler: generatePersonality(),
    saglik: randomInt(60, 90),
    mutluluk: randomInt(60, 90),
    stres: randomInt(10, 40),
    uyku: randomInt(60, 80),
    beslenme: randomInt(60, 80),
    kilo: randomInt(50, 80),
    psikoloji: randomInt(50, 80),
    egitim: "universite",
    durum: "yasiyor",
    anneId: null,
    babaId: null,
    esId: player.id,
    sehir: player.sehir,
    ulke: player.ulke,
    isPlayer: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createChild(
  player: Character,
  spouse: Character | null,
  life: Life
): Character {
  const cinsiyet: Gender = Math.random() > 0.5 ? "erkek" : "kadin";
  const soyisim = spouse?.soyisim ?? player.soyisim;
  const anne = player.cinsiyet === "kadin" ? player : spouse;
  const baba = player.cinsiyet === "erkek" ? player : spouse;
  const { genetics, ozellikler } = inheritGenetics(anne, baba, cinsiyet);

  return {
    id: createId(),
    userId: player.userId,
    lifeId: life.id,
    isim: randomItem(TURKISH_NAMES[cinsiyet]),
    soyisim,
    yas: 0,
    dogumYili: life.mevcutYil,
    cinsiyet,
    meslek: null,
    gelir: 0,
    ozellikler,
    saglik: Math.max(60, Math.min(95, ozellikler.saglik + randomInt(-5, 10))),
    mutluluk: ozellikler.mutluluk,
    stres: 5,
    uyku: 80,
    beslenme: 80,
    kilo: 3,
    psikoloji: 80,
    egitim: "yok",
    durum: "yasiyor",
    anneId: anne?.id ?? null,
    babaId: baba?.id ?? null,
    esId: null,
    sehir: player.sehir,
    ulke: player.ulke,
    isPlayer: false,
    sacRengi: genetics.sacRengi,
    gozRengi: genetics.gozRengi,
    tenRengi: genetics.tenRengi,
    boyPotansiyeli: genetics.boyPotansiyeli,
    genetikOzet: `Anne %${genetics.ebeveynKatkisi.anne} / Baba %${genetics.ebeveynKatkisi.baba}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createSpouseRelationship(
  player: Character,
  spouse: Character,
  life: Life
): Relationship {
  return {
    id: createId(),
    lifeId: life.id,
    characterId: player.id,
    targetId: spouse.id,
    tip: "es",
    puan: 80,
    romantik: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createChildRelationship(
  player: Character,
  child: Character,
  life: Life
): Relationship {
  return {
    id: createId(),
    lifeId: life.id,
    characterId: player.id,
    targetId: child.id,
    tip: "cocuk",
    puan: 90,
    romantik: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
