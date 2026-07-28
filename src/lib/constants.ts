import type { AgeGroup } from "@/types/game";

export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  bebek: "Bebek",
  cocuk: "Çocuk",
  ilkokul: "İlkokul",
  ergen: "Ergen",
  genc: "Genç",
  yetiskin: "Yetişkin",
  orta_yas: "Orta Yaş",
  yasli: "Yaşlı",
  ileri_yas: "İleri Yaş",
};

export const AGE_GROUP_RANGES: Record<AgeGroup, { min: number; max: number }> = {
  bebek: { min: 0, max: 2 },
  cocuk: { min: 3, max: 5 },
  ilkokul: { min: 6, max: 12 },
  ergen: { min: 13, max: 17 },
  genc: { min: 18, max: 25 },
  yetiskin: { min: 26, max: 40 },
  orta_yas: { min: 41, max: 60 },
  yasli: { min: 61, max: 80 },
  ileri_yas: { min: 81, max: 120 },
};

export function getAgeGroup(yas: number): AgeGroup {
  if (yas <= 2) return "bebek";
  if (yas <= 5) return "cocuk";
  if (yas <= 12) return "ilkokul";
  if (yas <= 17) return "ergen";
  if (yas <= 25) return "genc";
  if (yas <= 40) return "yetiskin";
  if (yas <= 60) return "orta_yas";
  if (yas <= 80) return "yasli";
  return "ileri_yas";
}

export const TURKISH_NAMES = {
  erkek: [
    "Ahmet", "Mehmet", "Ali", "Mustafa", "Emre", "Burak", "Can", "Deniz",
    "Eren", "Kerem", "Oğuz", "Yusuf", "Arda", "Barış", "Cem", "Faruk",
    "Hakan", "İbrahim", "Kaan", "Levent", "Murat", "Onur", "Serkan", "Tolga",
  ],
  kadin: [
    "Ayşe", "Fatma", "Zeynep", "Elif", "Merve", "Selin", "Büşra", "Derya",
    "Ece", "Gül", "Hande", "İrem", "Kader", "Lale", "Naz", "Pınar",
    "Seda", "Tuğba", "Yasemin", "Zara", "Aslı", "Cansu", "Defne", "Esra",
  ],
};

export const TURKISH_SURNAMES = [
  "Yılmaz", "Kaya", "Demir", "Çelik", "Şahin", "Yıldız", "Yıldırım", "Öztürk",
  "Aydın", "Özdemir", "Arslan", "Doğan", "Kılıç", "Aslan", "Çetin", "Kara",
  "Koç", "Kurt", "Özkan", "Şimşek", "Polat", "Erdoğan", "Güneş", "Aksoy",
  "Sarı", "Tekin", "Bulut", "Acar", "Korkmaz", "Turan",
];

export const CITIES = [
  "İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana", "Konya",
  "Gaziantep", "Mersin", "Eskişehir", "Trabzon", "Samsun", "Kayseri",
];

export const PROFESSIONS = [
  "Öğretmen", "Doktor", "Mühendis", "Avukat", "Hemşire", "Polis", "Aşçı",
  "Garson", "Muhasebeci", "Satış Temsilcisi", "Yazılımcı", "Tasarımcı",
  "Mimar", "Eczacı", "Veteriner", "Pilot", "Gazeteci", "Fotografçı",
  "Müzisyen", "Oyuncu", "İşletmeci", "Bankacı", "Sigortacı", "Emlakçı",
  "Kuaför", "Berber", "Terzi", "Şoför", "Kurye", "Güvenlik Görevlisi",
  "Temizlik Görevlisi", "Bahçıvan", "Marangoz", "Elektrikçi", "Tesisatçı",
  "Çiftçi", "Balıkçı", "Madenci", "İnşaat İşçisi", "Öğrenci", "Emekli",
  "Ev Hanımı", "Serbest Meslek", "Girişimci", "CEO", "Yönetici",
];

export const EDUCATION_LABELS: Record<string, string> = {
  kres: "Kreş",
  anaokulu: "Anaokulu",
  ilkokul: "İlkokul",
  ortaokul: "Ortaokul",
  lise: "Lise",
  universite: "Üniversite",
  yuksek_lisans: "Yüksek Lisans",
  doktora: "Doktora",
  yok: "Eğitim Yok",
};

export const VEHICLE_TYPES = [
  { tip: "bisiklet", ad: "Bisiklet", minFiyat: 500, maxFiyat: 5000 },
  { tip: "motosiklet", ad: "Motosiklet", minFiyat: 15000, maxFiyat: 80000 },
  { tip: "otomobil", ad: "Otomobil", minFiyat: 200000, maxFiyat: 1500000 },
  { tip: "suv", ad: "SUV", minFiyat: 500000, maxFiyat: 3000000 },
  { tip: "spor", ad: "Spor Otomobil", minFiyat: 800000, maxFiyat: 5000000 },
  { tip: "elektrikli", ad: "Elektrikli Araç", minFiyat: 600000, maxFiyat: 4000000 },
  { tip: "yat", ad: "Yat", minFiyat: 5000000, maxFiyat: 50000000 },
  { tip: "helikopter", ad: "Helikopter", minFiyat: 20000000, maxFiyat: 100000000 },
  { tip: "jet", ad: "Özel Jet", minFiyat: 50000000, maxFiyat: 500000000 },
];

export const RELATIONSHIP_ACTIONS = [
  { id: "sohbet", label: "Sohbet Et", minPuan: 0 },
  { id: "mesaj", label: "Mesaj Gönder", minPuan: 10 },
  { id: "ara", label: "Ara", minPuan: 20 },
  { id: "hediye", label: "Hediye Al", minPuan: 15 },
  { id: "vakit", label: "Birlikte Vakit Geçir", minPuan: 25 },
  { id: "tatil", label: "Tatile Çık", minPuan: 50 },
  { id: "ozur", label: "Özür Dile", minPuan: 0 },
  { id: "kavga", label: "Kavga Et", minPuan: 0 },
  { id: "bitir", label: "İlişkiyi Bitir", minPuan: 0 },
];

export const ROMANTIC_ACTIONS = [
  { id: "flort", label: "Flört Et", minYas: 14 },
  { id: "sevgili", label: "Sevgili Ol", minYas: 16 },
  { id: "nisan", label: "Nişanlan", minYas: 18 },
  { id: "evlilik", label: "Evlen", minYas: 18 },
  { id: "bosanma", label: "Boşan", minYas: 18 },
  { id: "cocuk", label: "Çocuk Sahibi Ol", minYas: 18 },
];
