export interface CityProfile {
  ad: string;
  bolge: string;
  yasamMaliyeti: number;
  isFirsatı: number;
  egitim: number;
  guvenlik: number;
  kultur: number;
  aciklama: string;
}

export const CITY_PROFILES: Record<string, CityProfile> = {
  İstanbul: {
    ad: "İstanbul",
    bolge: "Marmara",
    yasamMaliyeti: 92,
    isFirsatı: 95,
    egitim: 88,
    guvenlik: 55,
    kultur: 96,
    aciklama: "Türkiye'nin ekonomik ve kültürel merkezi. Fırsat bol, tempo yüksek, kira pahalı.",
  },
  Ankara: {
    ad: "Ankara",
    bolge: "İç Anadolu",
    yasamMaliyeti: 70,
    isFirsatı: 78,
    egitim: 90,
    guvenlik: 72,
    kultur: 75,
    aciklama: "Başkent. Kamu işleri ve üniversite hayatı güçlü; İstanbul'a göre daha düzenli.",
  },
  İzmir: {
    ad: "İzmir",
    bolge: "Ege",
    yasamMaliyeti: 75,
    isFirsatı: 80,
    egitim: 82,
    guvenlik: 68,
    kultur: 88,
    aciklama: "Ege'nin açık havası ve sosyal yaşamı. Turizm ve ticaret dengeli.",
  },
  Bursa: {
    ad: "Bursa",
    bolge: "Marmara",
    yasamMaliyeti: 68,
    isFirsatı: 74,
    egitim: 76,
    guvenlik: 70,
    kultur: 70,
    aciklama: "Sanayi ve yeşil alan dengesi. Otomotiv ve tekstil istihdamı.",
  },
  Antalya: {
    ad: "Antalya",
    bolge: "Akdeniz",
    yasamMaliyeti: 72,
    isFirsatı: 70,
    egitim: 72,
    guvenlik: 65,
    kultur: 80,
    aciklama: "Turizm başkenti. Mevsimsel iş, deniz ve açık hava yaşamı.",
  },
  Adana: {
    ad: "Adana",
    bolge: "Akdeniz",
    yasamMaliyeti: 60,
    isFirsatı: 65,
    egitim: 70,
    guvenlik: 58,
    kultur: 72,
    aciklama: "Sıcak iklim, güçlü yerel kültür. Tarım ve ticaret öne çıkar.",
  },
  Konya: {
    ad: "Konya",
    bolge: "İç Anadolu",
    yasamMaliyeti: 55,
    isFirsatı: 62,
    egitim: 74,
    guvenlik: 78,
    kultur: 68,
    aciklama: "Muhafazakâr sosyal doku, tarım ve sanayi. Yaşam maliyeti düşük.",
  },
  Gaziantep: {
    ad: "Gaziantep",
    bolge: "Güneydoğu",
    yasamMaliyeti: 58,
    isFirsatı: 70,
    egitim: 68,
    guvenlik: 60,
    kultur: 85,
    aciklama: "Gastronomi ve sanayi şehri. Girişimcilik kültürü güçlü.",
  },
  Mersin: {
    ad: "Mersin",
    bolge: "Akdeniz",
    yasamMaliyeti: 62,
    isFirsatı: 66,
    egitim: 70,
    guvenlik: 62,
    kultur: 74,
    aciklama: "Liman kenti. Deniz ticareti ve Akdeniz yaşamı.",
  },
  Eskişehir: {
    ad: "Eskişehir",
    bolge: "İç Anadolu",
    yasamMaliyeti: 58,
    isFirsatı: 68,
    egitim: 92,
    guvenlik: 80,
    kultur: 86,
    aciklama: "Öğrenci şehri. Üniversite yaşamı, bisiklet ve kültür.",
  },
  Trabzon: {
    ad: "Trabzon",
    bolge: "Karadeniz",
    yasamMaliyeti: 60,
    isFirsatı: 60,
    egitim: 72,
    guvenlik: 70,
    kultur: 78,
    aciklama: "Karadeniz'in güçlü aidiyet duygusu. Futbol ve yerel bağlar.",
  },
  Samsun: {
    ad: "Samsun",
    bolge: "Karadeniz",
    yasamMaliyeti: 58,
    isFirsatı: 63,
    egitim: 74,
    guvenlik: 72,
    kultur: 70,
    aciklama: "Karadeniz'in ticaret kapısı. Dengeli tempo.",
  },
  Kayseri: {
    ad: "Kayseri",
    bolge: "İç Anadolu",
    yasamMaliyeti: 55,
    isFirsatı: 72,
    egitim: 76,
    guvenlik: 75,
    kultur: 68,
    aciklama: "Girişimci ve sanayi odaklı. Tutumlu yaşam kültürü.",
  },
};

export function getCityProfile(sehir: string): CityProfile {
  return (
    CITY_PROFILES[sehir] ?? {
      ad: sehir,
      bolge: "Türkiye",
      yasamMaliyeti: 65,
      isFirsatı: 65,
      egitim: 70,
      guvenlik: 65,
      kultur: 70,
      aciklama: `${sehir}'de ortalama bir Anadolu/şehir yaşamı.`,
    }
  );
}

/** Şehir yaşam maliyeti çarpanı (harcama/kira etkisi) */
export function cityCostMultiplier(sehir: string): number {
  const p = getCityProfile(sehir);
  return 0.7 + p.yasamMaliyeti / 200;
}
