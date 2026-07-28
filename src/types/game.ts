export type AgeGroup =
  | "bebek"
  | "cocuk"
  | "ilkokul"
  | "ergen"
  | "genc"
  | "yetiskin"
  | "orta_yas"
  | "yasli"
  | "ileri_yas";

export type Gender = "erkek" | "kadin";

export type EducationLevel =
  | "kres"
  | "anaokulu"
  | "ilkokul"
  | "ortaokul"
  | "lise"
  | "universite"
  | "yuksek_lisans"
  | "doktora"
  | "yok";

export type RelationshipType =
  | "anne"
  | "baba"
  | "kardes"
  | "es"
  | "cocuk"
  | "arkadas"
  | "sevgili"
  | "akraba"
  | "is_arkadasi"
  | "diger";

export type LifeStatus = "yasiyor" | "oldu";

export type GameTab =
  | "hayat"
  | "aile"
  | "finans"
  | "saglik"
  | "egitim"
  | "mulk"
  | "sosyal"
  | "yasam"
  | "basarim";

export interface PersonalityTraits {
  mutluluk: number;
  saglik: number;
  zeka: number;
  sabir: number;
  comertlik: number;
  sosyallik: number;
  guven: number;
  sevgi: number;
  empati: number;
}

export interface Character {
  id: string;
  userId: string;
  lifeId: string;
  isim: string;
  soyisim: string;
  yas: number;
  dogumYili: number;
  cinsiyet: Gender;
  meslek: string | null;
  gelir: number;
  ozellikler: PersonalityTraits;
  saglik: number;
  mutluluk: number;
  stres: number;
  uyku: number;
  beslenme: number;
  kilo: number;
  psikoloji: number;
  egitim: EducationLevel;
  durum: LifeStatus;
  anneId: string | null;
  babaId: string | null;
  esId: string | null;
  sehir: string;
  ulke: string;
  isPlayer?: boolean;
  aileRolu?: "anne" | "baba" | "kardes" | "es" | "cocuk" | "dede" | "anneanne" | "babaanne" | "diger";
  sacRengi?: string;
  gozRengi?: string;
  tenRengi?: string;
  zorluk?: string;
  boyPotansiyeli?: number;
  genetikOzet?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Relationship {
  id: string;
  lifeId: string;
  characterId: string;
  targetId: string;
  tip: RelationshipType;
  puan: number;
  romantik: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Life {
  id: string;
  userId: string;
  aktif: boolean;
  baslangicYili: number;
  mevcutYil: number;
  para: number;
  bankaBakiyesi: number;
  krediBorcu: number;
  evId: string | null;
  aracId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GameEvent {
  id: string;
  baslik: string;
  aciklama: string;
  kategori: EventCategory;
  yasGrubu: AgeGroup[];
  secenekler: EventChoice[];
  oncelik: number;
  minYas?: number;
  maxYas?: number;
}

export type EventCategory =
  | "aile"
  | "egitim"
  | "kariyer"
  | "saglik"
  | "sosyal"
  | "finans"
  | "romantik"
  | "rastgele"
  | "yasam";

export interface EventChoice {
  id: string;
  metin: string;
  sonuc: string;
  etkiler?: EventEffect[];
}

export interface EventEffect {
  tip: "mutluluk" | "saglik" | "para" | "stres" | "iliski" | "ozellik";
  deger: number;
  ozellik?: keyof PersonalityTraits;
  hedefId?: string;
}

export interface Property {
  id: string;
  lifeId: string;
  tip: "ev" | "arac";
  ad: string;
  deger: number;
  kira: number;
  satinAlindi: boolean;
  aracTipi?: string;
  detaylar: Record<string, unknown>;
}

export interface Company {
  id: string;
  lifeId: string;
  ad: string;
  sektor: string;
  deger: number;
  gelir: number;
  calisanSayisi: number;
  kurulusYili: number;
}

export interface Investment {
  id: string;
  lifeId: string;
  tip: "hisse" | "etf" | "altin" | "kripto";
  sembol: string;
  miktar: number;
  alisFiyati: number;
  mevcutFiyat: number;
}

export interface Loan {
  id: string;
  lifeId: string;
  tutar: number;
  kalanBorc: number;
  faizOrani: number;
  aylikOdeme: number;
  baslangicYili: number;
  bitisYili: number;
  aktif: boolean;
}

export interface Achievement {
  id: string;
  kod: string;
  ad: string;
  aciklama: string;
  ikon: string;
  kazanildi?: boolean;
  kazanildiYil?: number;
}

export interface EventLog {
  id: string;
  lifeId: string;
  yil: number;
  yas: number;
  baslik: string;
  aciklama: string;
  kategori: EventCategory;
  createdAt: string;
}

export interface GameNotification {
  id: string;
  mesaj: string;
  tip: "bilgi" | "basarim" | "uyari" | "yasam";
}

export interface JournalEntry {
  id: string;
  yil: number;
  yas: number;
  baslik: string;
  metin: string;
  kategori: string;
}

export interface SavedGameState {
  life: Life;
  player: Character;
  family: Character[];
  relationships: Relationship[];
  eventHistory: EventLog[];
  properties: Property[];
  investments: Investment[];
  companies: Company[];
  loans: Loan[];
  achievements: Achievement[];
  decorations?: string[];
  journal?: JournalEntry[];
  neighborhood?: import("@/lib/systems/neighborhood").NeighborhoodState;
  school?: import("@/lib/systems/school").SchoolState | null;
  crime?: import("@/lib/systems/crime").CrimeState;
  politics?: import("@/lib/systems/politics").PoliticsState;
  religion?: import("@/lib/systems/religion").ReligionState;
  hobbies?: import("@/lib/systems/hobbies").Hobby[];
  genetics?: import("@/lib/systems/genetics").GeneticsProfile | null;
  actionCooldowns?: import("@/lib/systems/relationships").ActionCooldown[];
  lifetimeScore?: number;
  aileDurumu?: string;
  lifePromptHistory?: string[];
}
