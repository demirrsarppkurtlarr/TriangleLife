import type { Achievement, Character, Life, Property, Investment, Company } from "@/types/game";

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: "a1", kod: "ilk_adim", ad: "İlk Adım", aciklama: "İlk yılını tamamladın.", ikon: "baby" },
  { id: "a2", kod: "okuryazar", ad: "Okuryazar", aciklama: "İlkokulu bitirdin.", ikon: "book" },
  { id: "a3", kod: "mezun", ad: "Mezun", aciklama: "Üniversiteyi bitirdin.", ikon: "graduation" },
  { id: "a4", kod: "ilk_is", ad: "İlk İş", aciklama: "İlk işini buldun.", ikon: "briefcase" },
  { id: "a5", kod: "zengin", ad: "Zengin", aciklama: "1 milyon TL biriktirdin.", ikon: "money" },
  { id: "a6", kod: "ev_sahibi", ad: "Ev Sahibi", aciklama: "Kendi evini satın aldın.", ikon: "home" },
  { id: "a7", kod: "evli", ad: "Evli", aciklama: "Evlendin.", ikon: "heart" },
  { id: "a8", kod: "ebeveyn", ad: "Ebeveyn", aciklama: "İlk çocuğun doğdu.", ikon: "family" },
  { id: "a9", kod: "ceo", ad: "CEO", aciklama: "Kendi şirketinin CEO'su oldun.", ikon: "building" },
  { id: "a10", kod: "yatirimci", ad: "Yatırımcı", aciklama: "İlk yatırımını yaptın.", ikon: "chart" },
  { id: "a11", kod: "saglikli", ad: "Sağlıklı Yaşam", aciklama: "Sağlık puanın 90'a ulaştı.", ikon: "health" },
  { id: "a12", kod: "mutlu", ad: "Mutlu Hayat", aciklama: "Mutluluk puanın 90'a ulaştı.", ikon: "smile" },
  { id: "a13", kod: "uzun_yasam", ad: "Uzun Yaşam", aciklama: "80 yaşına ulaştın.", ikon: "clock" },
  { id: "a14", kod: "bilge", ad: "Bilge", aciklama: "Zeka puanın 90'a ulaştı.", ikon: "brain" },
  { id: "a15", kod: "sosyal", ad: "Sosyal Kelebek", aciklama: "Sosyallik puanın 90'a ulaştı.", ikon: "users" },
];

interface CheckContext {
  player: Character;
  life: Life;
  properties: Property[];
  investments: Investment[];
  companies: Company[];
  hasSpouse: boolean;
  hasChild: boolean;
  yearsPlayed: number;
}

export function checkAchievements(
  achievements: Achievement[],
  ctx: CheckContext
): Achievement[] {
  const { player, life, properties, investments, companies, hasSpouse, hasChild, yearsPlayed } = ctx;
  const totalWealth = life.para + life.bankaBakiyesi - life.krediBorcu;
  const hasHome = properties.some((p) => p.tip === "ev" && p.satinAlindi);

  const checks: Record<string, boolean> = {
    ilk_adim: yearsPlayed >= 1,
    okuryazar: player.egitim === "ortaokul" || player.egitim === "lise" || player.egitim === "universite" || player.egitim === "yuksek_lisans" || player.egitim === "doktora",
    mezun: player.egitim === "universite" || player.egitim === "yuksek_lisans" || player.egitim === "doktora",
    ilk_is: !!player.meslek && player.meslek !== "Öğrenci",
    zengin: totalWealth >= 1_000_000,
    ev_sahibi: hasHome,
    evli: hasSpouse,
    ebeveyn: hasChild,
    ceo: companies.length > 0,
    yatirimci: investments.length > 0,
    saglikli: player.saglik >= 90,
    mutlu: player.mutluluk >= 90,
    uzun_yasam: player.yas >= 80,
    bilge: player.ozellikler.zeka >= 90,
    sosyal: player.ozellikler.sosyallik >= 90,
  };

  return achievements.map((a) => {
    if (a.kazanildi) return a;
    if (checks[a.kod]) {
      return { ...a, kazanildi: true, kazanildiYil: life.mevcutYil };
    }
    return a;
  });
}

export function getNewlyUnlocked(
  before: Achievement[],
  after: Achievement[]
): Achievement[] {
  return after.filter(
    (a) => a.kazanildi && !before.find((b) => b.id === a.id && b.kazanildi)
  );
}
