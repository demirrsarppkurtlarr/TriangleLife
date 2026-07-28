/** BitLife tarzı ek yaşam durumları: ehliyet, askerlik, ün, bölüm, şehir taşıma, terapi, estetik */

export interface MilitaryState {
  durum: "aktif" | "tamamlandi" | "muaf";
  kalanYil: number;
  baslangicYil: number;
}

export interface LifeExtras {
  ehliyet: boolean;
  universiteBolumu: string | null;
  un: number;
  askerlik: MilitaryState | null;
  gymUyelik: boolean;
  sonTerapiYil: number | null;
  sonEstetikYil: number | null;
  kariyerYolu: string | null;
  kariyerSeviye: number;
}

export function createEmptyLifeExtras(): LifeExtras {
  return {
    ehliyet: false,
    universiteBolumu: null,
    un: 0,
    askerlik: null,
    gymUyelik: false,
    sonTerapiYil: null,
    sonEstetikYil: null,
    kariyerYolu: null,
    kariyerSeviye: 0,
  };
}

export const UNIVERSITE_BOLUMLERI = [
  { id: "tip", ad: "Tıp", kariyer: ["Stajyer Doktor", "Asistan Doktor", "Uzman Doktor", "Başhekim"] },
  { id: "hukuk", ad: "Hukuk", kariyer: ["Stajyer Avukat", "Avukat", "Kıdemli Avukat", "Ortak Avukat"] },
  { id: "muhendislik", ad: "Mühendislik", kariyer: ["Junior Mühendis", "Mühendis", "Kıdemli Mühendis", "Teknik Direktör"] },
  { id: "isletme", ad: "İşletme", kariyer: ["Stajyer", "Uzman", "Yönetici", "CEO"] },
  { id: "guzel_sanatlar", ad: "Güzel Sanatlar", kariyer: ["Figüran", "Oyuncu", "Ünlü Oyuncu", "Süperstar"] },
  { id: "spor", ad: "Spor Bilimleri", kariyer: ["Amatör Sporcu", "Profesyonel Sporcu", "Milli Sporcu", "Efsane Sporcu"] },
  { id: "egitim", ad: "Eğitim", kariyer: ["Öğretmen Yardımcısı", "Öğretmen", "Müdür Yardımcısı", "Okul Müdürü"] },
  { id: "bilisim", ad: "Bilgisayar", kariyer: ["Junior Yazılımcı", "Yazılımcı", "Kıdemli Yazılımcı", "CTO"] },
] as const;

export const ASKERLIK_SURE = 1; // yıl

export function canStartMilitary(yas: number, cinsiyet: string, extras: LifeExtras): boolean {
  if (cinsiyet !== "erkek") return false;
  if (yas < 20 || yas > 41) return false;
  if (extras.askerlik?.durum === "aktif" || extras.askerlik?.durum === "tamamlandi") return false;
  return true;
}

export function startMilitary(extras: LifeExtras, yil: number): LifeExtras {
  return {
    ...extras,
    askerlik: { durum: "aktif", kalanYil: ASKERLIK_SURE, baslangicYil: yil },
  };
}

export function tickMilitary(extras: LifeExtras): {
  extras: LifeExtras;
  tamamlandi: boolean;
  mesaj?: string;
} {
  if (!extras.askerlik || extras.askerlik.durum !== "aktif") {
    return { extras, tamamlandi: false };
  }
  const kalan = extras.askerlik.kalanYil - 1;
  if (kalan <= 0) {
    return {
      extras: {
        ...extras,
        askerlik: { ...extras.askerlik, durum: "tamamlandi", kalanYil: 0 },
        un: Math.min(100, extras.un + 2),
      },
      tamamlandi: true,
      mesaj: "Askerlik hizmetin tamamlandı.",
    };
  }
  return {
    extras: {
      ...extras,
      askerlik: { ...extras.askerlik, kalanYil: kalan },
    },
    tamamlandi: false,
    mesaj: `Askerlik devam ediyor (${kalan} yıl kaldı).`,
  };
}

export function advanceCareerTrack(extras: LifeExtras): {
  extras: LifeExtras;
  yeniMeslek: string | null;
  mesaj?: string;
} {
  if (!extras.kariyerYolu) return { extras, yeniMeslek: null };
  const bolum = UNIVERSITE_BOLUMLERI.find((b) => b.id === extras.kariyerYolu);
  if (!bolum) return { extras, yeniMeslek: null };
  const next = Math.min(bolum.kariyer.length - 1, extras.kariyerSeviye + 1);
  if (next === extras.kariyerSeviye) return { extras, yeniMeslek: null };
  return {
    extras: { ...extras, kariyerSeviye: next },
    yeniMeslek: bolum.kariyer[next],
    mesaj: `Kariyer ilerlemesi: ${bolum.kariyer[next]}`,
  };
}

export function setUniversityMajor(extras: LifeExtras, bolumId: string): LifeExtras {
  const bolum = UNIVERSITE_BOLUMLERI.find((b) => b.id === bolumId);
  if (!bolum) return extras;
  return {
    ...extras,
    universiteBolumu: bolum.ad,
    kariyerYolu: bolum.id,
    kariyerSeviye: 0,
  };
}

export function fameLabel(un: number): string {
  if (un >= 80) return "Süperstar";
  if (un >= 55) return "Ünlü";
  if (un >= 30) return "Tanınmış";
  if (un >= 10) return "Bilinir";
  return "Sıradan";
}

export const SAC_RENKLERI = ["Siyah", "Kahverengi", "Kumral", "Sarı", "Kızıl", "Gri", "Beyaz"];
export const GOZ_RENKLERI = ["Kahverengi", "Ela", "Yeşil", "Mavi", "Gri"];
export const TEN_RENKLERI = ["Açık", "Buğday", "Esmer", "Koyu"];
