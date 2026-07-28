export interface DbLife {
  id: string;
  user_id: string;
  aktif: boolean;
  baslangic_yili: number;
  mevcut_yil: number;
  para: number;
  banka_bakiyesi: number;
  kredi_borcu: number;
  ev_id: string | null;
  arac_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbCharacter {
  id: string;
  user_id: string;
  life_id: string;
  isim: string;
  soyisim: string;
  yas: number;
  dogum_yili: number;
  cinsiyet: "erkek" | "kadin";
  meslek: string | null;
  gelir: number;
  is_player: boolean;
  mutluluk: number;
  saglik: number;
  zeka: number;
  sabir: number;
  comertlik: number;
  sosyallik: number;
  guven: number;
  sevgi: number;
  empati: number;
  stres: number;
  uyku: number;
  beslenme: number;
  kilo: number;
  psikoloji: number;
  egitim: string;
  durum: "yasiyor" | "oldu";
  anne_id: string | null;
  baba_id: string | null;
  es_id: string | null;
  sehir: string;
  ulke: string;
  created_at: string;
  updated_at: string;
}

export interface DbRelationship {
  id: string;
  life_id: string;
  character_id: string;
  target_id: string;
  tip: string;
  puan: number;
  romantik: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbEventLog {
  id: string;
  life_id: string;
  yil: number;
  yas: number;
  baslik: string;
  aciklama: string;
  kategori: string;
  created_at: string;
}

export interface DbProperty {
  id: string;
  life_id: string;
  tip: "ev" | "arac";
  ad: string;
  deger: number;
  kira: number;
  satin_alindi: boolean;
  arac_tipi: string | null;
  detaylar: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DbInvestment {
  id: string;
  life_id: string;
  tip: "hisse" | "etf" | "altin" | "kripto";
  sembol: string;
  miktar: number;
  alis_fiyati: number;
  mevcut_fiyat: number;
  created_at: string;
  updated_at: string;
}

export interface DbCompany {
  id: string;
  life_id: string;
  ad: string;
  sektor: string;
  deger: number;
  gelir: number;
  calisan_sayisi: number;
  kurulus_yili: number;
  created_at: string;
  updated_at: string;
}

export interface DbLoan {
  id: string;
  life_id: string;
  tutar: number;
  kalan_borc: number;
  faiz_orani: number;
  aylik_odeme: number;
  baslangic_yili: number;
  bitis_yili: number;
  aktif: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbAchievement {
  id: string;
  kod: string;
  ad: string;
  aciklama: string;
  ikon: string | null;
}

export interface DbUserAchievement {
  id: string;
  user_id: string;
  life_id: string;
  achievement_id: string;
  kazanildi_yil: number | null;
}
