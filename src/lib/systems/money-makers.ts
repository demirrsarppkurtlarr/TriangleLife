/** Para kazanma yöntemleri + kumar — yaşa göre gerçekçi */

export interface MoneyGig {
  id: string;
  ad: string;
  aciklama: string;
  minYas: number;
  maxYas?: number;
  maliyet: number;
  /** Ortalama kazanç aralığı (yıllık bir aksiyon) */
  minKazanc: number;
  maxKazanc: number;
  stres: number;
  saglik?: number;
  kategori: "ek_is" | "freelance" | "yan_gelir" | "satis" | "pasif";
  /** Yılda kaç kez */
  maxPerYear: number;
}

export interface GambleGame {
  id: string;
  ad: string;
  aciklama: string;
  minYas: number;
  minBahis: number;
  maxBahis: number;
  /** Kazanma olasılığı 0-1 (house edge dahil) */
  winChance: number;
  /** Kazanınca bahis * çarpan */
  winMultiplier: number;
  kategori: "piyango" | "iddaa" | "kumarhane" | "kazi" | "diger";
}

export const MONEY_GIGS: MoneyGig[] = [
  // Genç / part-time
  {
    id: "market-kasa",
    ad: "Market kasa / reyona yardım",
    aciklama: "Hafta sonu market işi. Yorucu ama güvenli.",
    minYas: 15,
    maxYas: 22,
    maliyet: 0,
    minKazanc: 800,
    maxKazanc: 2200,
    stres: 4,
    kategori: "ek_is",
    maxPerYear: 2,
  },
  {
    id: "kurye",
    ad: "Yemek / paket kuryelik",
    aciklama: "Motosiklet veya bisikletle teslimat.",
    minYas: 16,
    maliyet: 0,
    minKazanc: 1500,
    maxKazanc: 4500,
    stres: 6,
    saglik: -2,
    kategori: "ek_is",
    maxPerYear: 2,
  },
  {
    id: "garson",
    ad: "Garsonluk / kafe",
    aciklama: "Akşam ve hafta sonu vardiya.",
    minYas: 16,
    maliyet: 0,
    minKazanc: 1200,
    maxKazanc: 3500,
    stres: 5,
    kategori: "ek_is",
    maxPerYear: 2,
  },
  {
    id: "ozel-ders",
    ad: "Özel ders ver",
    aciklama: "Matematik / İngilizce dersi. Zekân etkili.",
    minYas: 17,
    maliyet: 0,
    minKazanc: 2000,
    maxKazanc: 8000,
    stres: 3,
    kategori: "freelance",
    maxPerYear: 3,
  },
  {
    id: "bebek-bakimi",
    ad: "Bebek / çocuk bakımı",
    aciklama: "Komşu veya akraba için bakıcılık.",
    minYas: 15,
    maxYas: 30,
    maliyet: 0,
    minKazanc: 600,
    maxKazanc: 2500,
    stres: 3,
    kategori: "ek_is",
    maxPerYear: 2,
  },
  // Yetişkin freelance / yan gelir
  {
    id: "freelance-yazi",
    ad: "Freelance yazı / çeviri",
    aciklama: "Uzaktan proje. Düzenli değil ama kazançlı olabilir.",
    minYas: 18,
    maliyet: 0,
    minKazanc: 2500,
    maxKazanc: 12000,
    stres: 4,
    kategori: "freelance",
    maxPerYear: 3,
  },
  {
    id: "freelance-yazilim",
    ad: "Freelance yazılım / site",
    aciklama: "Küçük bir web veya otomasyon işi.",
    minYas: 18,
    maliyet: 0,
    minKazanc: 5000,
    maxKazanc: 35000,
    stres: 7,
    kategori: "freelance",
    maxPerYear: 2,
  },
  {
    id: "icerik-uretici",
    ad: "İçerik üreticiliği",
    aciklama: "Video / sosyal medya. Şans + sosyallik.",
    minYas: 16,
    maliyet: 500,
    minKazanc: 0,
    maxKazanc: 25000,
    stres: 5,
    kategori: "yan_gelir",
    maxPerYear: 2,
  },
  {
    id: "taksi-surus",
    ad: "Taksi / yolcu taşıma",
    aciklama: "Ehliyet şart. Gece vardiyası yorucu.",
    minYas: 21,
    maliyet: 1000,
    minKazanc: 4000,
    maxKazanc: 15000,
    stres: 6,
    saglik: -3,
    kategori: "ek_is",
    maxPerYear: 2,
  },
  {
    id: "mesai",
    ad: "Fazla mesai",
    aciklama: "Mevcut işinde ekstra saat. Maaşın varsa.",
    minYas: 18,
    maliyet: 0,
    minKazanc: 3000,
    maxKazanc: 18000,
    stres: 8,
    saglik: -2,
    kategori: "ek_is",
    maxPerYear: 2,
  },
  {
    id: "danismanlik",
    ad: "Danışmanlık / mentorluk",
    aciklama: "Deneyimini sat. Orta yaşta daha kârlı.",
    minYas: 30,
    maliyet: 0,
    minKazanc: 8000,
    maxKazanc: 40000,
    stres: 4,
    kategori: "freelance",
    maxPerYear: 2,
  },
  {
    id: "kira-odasi",
    ad: "Oda / ev kiraya ver",
    aciklama: "Ev sahibisinse ek gelir. (Ev gerekli)",
    minYas: 21,
    maliyet: 0,
    minKazanc: 12000,
    maxKazanc: 60000,
    stres: 3,
    kategori: "pasif",
    maxPerYear: 1,
  },
  {
    id: "ikinci-el",
    ad: "İkinci el satış",
    aciklama: "Dolaptaki eşyaları sat. Küçük ama hızlı nakit.",
    minYas: 14,
    maliyet: 0,
    minKazanc: 200,
    maxKazanc: 3500,
    stres: 1,
    kategori: "satis",
    maxPerYear: 2,
  },
  {
    id: "bit-pazar",
    ad: "Bit pazarı standı",
    aciklama: "Hafta sonu stand kur. Emek yoğun.",
    minYas: 16,
    maliyet: 300,
    minKazanc: 500,
    maxKazanc: 5000,
    stres: 4,
    kategori: "satis",
    maxPerYear: 2,
  },
  {
    id: "araba-yika",
    ad: "Araç yıkama / detay",
    aciklama: "Mahallede araç temizliği.",
    minYas: 15,
    maliyet: 200,
    minKazanc: 800,
    maxKazanc: 4000,
    stres: 3,
    kategori: "ek_is",
    maxPerYear: 2,
  },
  {
    id: "fotografcilik",
    ad: "Düğün / etkinlik fotoğrafı",
    aciklama: "Hafta sonu çekim. Ekipman varsayımı.",
    minYas: 18,
    maliyet: 500,
    minKazanc: 3000,
    maxKazanc: 20000,
    stres: 4,
    kategori: "freelance",
    maxPerYear: 2,
  },
  {
    id: "guvenlik",
    ad: "Gece güvenlik",
    aciklama: "Site / depo nöbeti. Uyku bozulur.",
    minYas: 20,
    maliyet: 0,
    minKazanc: 4000,
    maxKazanc: 12000,
    stres: 5,
    saglik: -4,
    kategori: "ek_is",
    maxPerYear: 2,
  },
  {
    id: "banka-faiz",
    ad: "Vadeli mevduat getirisi",
    aciklama: "Bankadaki paranın yıllık faiz payı (manuel çekim).",
    minYas: 18,
    maliyet: 0,
    minKazanc: 0,
    maxKazanc: 0,
    stres: 0,
    kategori: "pasif",
    maxPerYear: 1,
  },
  {
    id: "bagis-topla",
    ad: "Yardım kampanyası organize et",
    aciklama: "Para kazanmazsın; itibar / mutluluk. (Sembolik)",
    minYas: 16,
    maliyet: 200,
    minKazanc: 0,
    maxKazanc: 0,
    stres: -2,
    kategori: "yan_gelir",
    maxPerYear: 1,
  },
];

export const GAMBLE_GAMES: GambleGame[] = [
  {
    id: "milli-piyango",
    ad: "Milli Piyango",
    aciklama: "Klasik bilet. Kazanma şansı düşük, büyük ikramiye hayali.",
    minYas: 18,
    minBahis: 50,
    maxBahis: 500,
    winChance: 0.08,
    winMultiplier: 8,
    kategori: "piyango",
  },
  {
    id: "sayisal-loto",
    ad: "Sayısal Loto",
    aciklama: "6 doğru zor. Küçük ikramiyeler daha sık.",
    minYas: 18,
    minBahis: 100,
    maxBahis: 1000,
    winChance: 0.12,
    winMultiplier: 5,
    kategori: "piyango",
  },
  {
    id: "kazi-kazan",
    ad: "Kazı Kazan",
    aciklama: "Anında sonuç. House edge yüksek.",
    minYas: 18,
    minBahis: 20,
    maxBahis: 200,
    winChance: 0.35,
    winMultiplier: 2.2,
    kategori: "kazi",
  },
  {
    id: "iddaa",
    ad: "Spor bahisi (İddaa)",
    aciklama: "Maç sonucu. Bilgi biraz yardım eder ama şans baskın.",
    minYas: 18,
    minBahis: 50,
    maxBahis: 5000,
    winChance: 0.42,
    winMultiplier: 2.1,
    kategori: "iddaa",
  },
  {
    id: "at-yarisi",
    ad: "At yarışı",
    aciklama: "Hipodrom. Riskli ve stresli.",
    minYas: 18,
    minBahis: 100,
    maxBahis: 10000,
    winChance: 0.28,
    winMultiplier: 3.5,
    kategori: "diger",
  },
  {
    id: "rulet",
    ad: "Rulet (kırmızı/siyah)",
    aciklama: "Basit bahis. Uzun vadede kumarhane kazanır.",
    minYas: 21,
    minBahis: 100,
    maxBahis: 20000,
    winChance: 0.47,
    winMultiplier: 2,
    kategori: "kumarhane",
  },
  {
    id: "blackjack",
    ad: "Blackjack",
    aciklama: "Biraz strateji; yine de masa avantajlı.",
    minYas: 21,
    minBahis: 200,
    maxBahis: 15000,
    winChance: 0.44,
    winMultiplier: 2,
    kategori: "kumarhane",
  },
  {
    id: "poker",
    ad: "Poker turnuvası giriş",
    aciklama: "Buy-in. Çoğu el elenir; nadiren büyük ödül.",
    minYas: 21,
    minBahis: 500,
    maxBahis: 25000,
    winChance: 0.18,
    winMultiplier: 6,
    kategori: "kumarhane",
  },
  {
    id: "yazi-tura",
    ad: "Yazı tura (arkadaş arası)",
    aciklama: "Küçük bahis. Sosyal ama bağımlılık riski.",
    minYas: 16,
    minBahis: 20,
    maxBahis: 500,
    winChance: 0.48,
    winMultiplier: 2,
    kategori: "diger",
  },
  {
    id: "slot",
    ad: "Slot / çark",
    aciklama: "Eğlence gibi görünür; dönüş oranı düşük.",
    minYas: 21,
    minBahis: 50,
    maxBahis: 5000,
    winChance: 0.25,
    winMultiplier: 3,
    kategori: "kumarhane",
  },
];

export function getGigsForAge(yas: number): MoneyGig[] {
  return MONEY_GIGS.filter((g) => yas >= g.minYas && (g.maxYas === undefined || yas <= g.maxYas));
}

export function getGamblesForAge(yas: number): GambleGame[] {
  return GAMBLE_GAMES.filter((g) => yas >= g.minYas);
}

export function rollGigEarnings(
  gig: MoneyGig,
  zeka: number,
  sosyallik: number,
  hasHome: boolean,
  banka: number,
  gelir: number
): { kazanc: number; mesaj: string } {
  if (gig.id === "bagis-topla") {
    return { kazanc: -gig.maliyet, mesaj: "Kampanya düzenledin. Para kazanmadın ama iç huzurun arttı." };
  }
  if (gig.id === "banka-faiz") {
    const faiz = Math.floor(banka * (0.08 + Math.random() * 0.07));
    return {
      kazanc: faiz,
      mesaj: faiz > 0 ? `Vadeli getiriden ${faiz.toLocaleString("tr-TR")} TL aldın.` : "Bankada yeterli bakiye yok.",
    };
  }
  if (gig.id === "kira-odasi" && !hasHome) {
    return { kazanc: 0, mesaj: "Kiraya vermek için evin olmalı." };
  }
  if (gig.id === "mesai" && gelir <= 0) {
    return { kazanc: 0, mesaj: "Mesai için önce bir işin olmalı." };
  }

  let min = gig.minKazanc;
  let max = gig.maxKazanc;
  // Skill boost
  if (gig.id === "ozel-ders" || gig.id === "freelance-yazilim" || gig.id === "danismanlik") {
    const boost = 1 + (zeka - 50) / 100;
    min = Math.floor(min * boost);
    max = Math.floor(max * boost);
  }
  if (gig.id === "icerik-uretici" || gig.id === "fotografcilik") {
    const boost = 1 + (sosyallik - 50) / 120;
    max = Math.floor(max * boost);
  }
  if (gig.id === "mesai") {
    min = Math.max(min, Math.floor(gelir * 0.15));
    max = Math.max(max, Math.floor(gelir * 0.8));
  }

  const kazanc = min + Math.floor(Math.random() * Math.max(1, max - min + 1));
  return {
    kazanc: kazanc - gig.maliyet,
    mesaj: `${gig.ad}: net ${kazanc - gig.maliyet >= 0 ? "+" : ""}${(kazanc - gig.maliyet).toLocaleString("tr-TR")} TL`,
  };
}

export function resolveGamble(
  game: GambleGame,
  bahis: number,
  zeka: number
): { kazandi: boolean; net: number; mesaj: string } {
  const bet = Math.max(game.minBahis, Math.min(game.maxBahis, bahis));
  let chance = game.winChance;
  if (game.id === "iddaa" || game.id === "blackjack") {
    chance += (zeka - 50) / 500; // küçük avantaj
  }
  chance = Math.max(0.05, Math.min(0.55, chance));

  const kazandi = Math.random() < chance;
  if (kazandi) {
    const odul = Math.floor(bet * game.winMultiplier);
    const net = odul - bet;
    return {
      kazandi: true,
      net,
      mesaj: `${game.ad}: Kazandın! +${odul.toLocaleString("tr-TR")} TL (net +${net.toLocaleString("tr-TR")})`,
    };
  }
  return {
    kazandi: false,
    net: -bet,
    mesaj: `${game.ad}: Kaybettin. -${bet.toLocaleString("tr-TR")} TL`,
  };
}

export const GIG_CATEGORY_LABELS: Record<MoneyGig["kategori"], string> = {
  ek_is: "Ek iş",
  freelance: "Freelance",
  yan_gelir: "Yan gelir",
  satis: "Satış",
  pasif: "Pasif",
};

export const GAMBLE_CATEGORY_LABELS: Record<GambleGame["kategori"], string> = {
  piyango: "Piyango",
  iddaa: "Bahis",
  kumarhane: "Kumarhane",
  kazi: "Anında oyun",
  diger: "Diğer",
};
