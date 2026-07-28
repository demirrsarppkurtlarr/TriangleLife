export interface DecorationItem {
  id: string;
  ad: string;
  kategori: "mobilya" | "dekor" | "teknoloji" | "sanat";
  fiyat: number;
  mutluluk: number;
  aciklama: string;
}

export const DECORATION_CATALOG: DecorationItem[] = [
  { id: "koltuk", ad: "Modern Koltuk Takımı", kategori: "mobilya", fiyat: 25000, mutluluk: 8, aciklama: "Salonuna şık bir koltuk ekledin." },
  { id: "masa", ad: "Yemek Masası", kategori: "mobilya", fiyat: 12000, mutluluk: 5, aciklama: "Aile yemekleri için ideal." },
  { id: "yatak", ad: "Ortopedik Yatak", kategori: "mobilya", fiyat: 18000, mutluluk: 7, aciklama: "Uyku kaliten arttı." },
  { id: "dolap", ad: "Giyinme Dolabı", kategori: "mobilya", fiyat: 9000, mutluluk: 4, aciklama: "Düzenli bir oda." },
  { id: "lamba", ad: "Tasarım Lambası", kategori: "dekor", fiyat: 2500, mutluluk: 3, aciklama: "Sıcak bir aydınlatma." },
  { id: "hali", ad: "El Dokuma Halı", kategori: "dekor", fiyat: 8000, mutluluk: 5, aciklama: "Evin daha sıcak hissettiriyor." },
  { id: "perde", ad: "Kadife Perde", kategori: "dekor", fiyat: 3500, mutluluk: 3, aciklama: "Pencereler yenilendi." },
  { id: "bitki", ad: "İç Mekan Bitkileri", kategori: "dekor", fiyat: 1500, mutluluk: 4, aciklama: "Doğa evine geldi." },
  { id: "tv", ad: "4K Televizyon", kategori: "teknoloji", fiyat: 22000, mutluluk: 8, aciklama: "Sinema keyfi evde." },
  { id: "ses", ad: "Ses Sistemi", kategori: "teknoloji", fiyat: 15000, mutluluk: 6, aciklama: "Müzik dolu akşamlar." },
  { id: "pc", ad: "Oyun Bilgisayarı", kategori: "teknoloji", fiyat: 40000, mutluluk: 9, aciklama: "Eğlence merkezi kuruldu." },
  { id: "akilli", ad: "Akıllı Ev Paketi", kategori: "teknoloji", fiyat: 18000, mutluluk: 7, aciklama: "Evin akıllandı." },
  { id: "tablo", ad: "Yağlı Boya Tablo", kategori: "sanat", fiyat: 6000, mutluluk: 5, aciklama: "Duvarlar sanatla doldu." },
  { id: "heykel", ad: "Dekoratif Heykel", kategori: "sanat", fiyat: 4500, mutluluk: 4, aciklama: "Zarif bir dokunuş." },
  { id: "kitaplik", ad: "Ahşap Kitaplık", kategori: "mobilya", fiyat: 7000, mutluluk: 5, aciklama: "Kitapların yerini buldu." },
  { id: "ayna", ad: "Büyük Ayna", kategori: "dekor", fiyat: 3200, mutluluk: 3, aciklama: "Mekan daha ferah." },
];

export const DECORATION_CATEGORY_LABELS: Record<DecorationItem["kategori"], string> = {
  mobilya: "Mobilya",
  dekor: "Dekor",
  teknoloji: "Teknoloji",
  sanat: "Sanat",
};
