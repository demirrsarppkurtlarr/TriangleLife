import type {
  Character,
  Life,
  Relationship,
  EventLog,
  Property,
  Investment,
  Company,
  Loan,
  Achievement,
  EducationLevel,
  PersonalityTraits,
} from "@/types/game";
import type {
  DbCharacter,
  DbLife,
  DbRelationship,
  DbEventLog,
  DbProperty,
  DbInvestment,
  DbCompany,
  DbLoan,
  DbAchievement,
  DbUserAchievement,
} from "@/lib/supabase/types";

export function mapLifeFromDb(row: DbLife): Life {
  return {
    id: row.id,
    userId: row.user_id,
    aktif: row.aktif,
    baslangicYili: row.baslangic_yili,
    mevcutYil: row.mevcut_yil,
    para: Number(row.para),
    bankaBakiyesi: Number(row.banka_bakiyesi),
    krediBorcu: Number(row.kredi_borcu),
    evId: row.ev_id,
    aracId: row.arac_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapLifeToDb(life: Life): Omit<DbLife, "created_at" | "updated_at"> {
  return {
    id: life.id,
    user_id: life.userId,
    aktif: life.aktif,
    baslangic_yili: life.baslangicYili,
    mevcut_yil: life.mevcutYil,
    para: life.para,
    banka_bakiyesi: life.bankaBakiyesi,
    kredi_borcu: life.krediBorcu,
    ev_id: life.evId,
    arac_id: life.aracId,
  };
}

function mapTraits(row: DbCharacter): PersonalityTraits {
  return {
    mutluluk: row.mutluluk,
    saglik: row.saglik,
    zeka: row.zeka,
    sabir: row.sabir,
    comertlik: row.comertlik,
    sosyallik: row.sosyallik,
    guven: row.guven,
    sevgi: row.sevgi,
    empati: row.empati,
  };
}

export function mapCharacterFromDb(row: DbCharacter): Character {
  return {
    id: row.id,
    userId: row.user_id,
    lifeId: row.life_id,
    isim: row.isim,
    soyisim: row.soyisim,
    yas: row.yas,
    dogumYili: row.dogum_yili,
    cinsiyet: row.cinsiyet,
    meslek: row.meslek,
    gelir: Number(row.gelir),
    ozellikler: mapTraits(row),
    saglik: row.saglik,
    mutluluk: row.mutluluk,
    stres: row.stres,
    uyku: row.uyku,
    beslenme: row.beslenme,
    kilo: Number(row.kilo),
    psikoloji: row.psikoloji,
    egitim: row.egitim as EducationLevel,
    durum: row.durum,
    anneId: row.anne_id,
    babaId: row.baba_id,
    esId: row.es_id,
    sehir: row.sehir,
    ulke: row.ulke,
    isPlayer: row.is_player,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCharacterToDb(char: Character): Omit<DbCharacter, "created_at" | "updated_at"> {
  return {
    id: char.id,
    user_id: char.userId,
    life_id: char.lifeId,
    isim: char.isim,
    soyisim: char.soyisim,
    yas: char.yas,
    dogum_yili: char.dogumYili,
    cinsiyet: char.cinsiyet,
    meslek: char.meslek,
    gelir: char.gelir,
    is_player: char.isPlayer ?? false,
    mutluluk: char.ozellikler.mutluluk,
    saglik: char.saglik,
    zeka: char.ozellikler.zeka,
    sabir: char.ozellikler.sabir,
    comertlik: char.ozellikler.comertlik,
    sosyallik: char.ozellikler.sosyallik,
    guven: char.ozellikler.guven,
    sevgi: char.ozellikler.sevgi,
    empati: char.ozellikler.empati,
    stres: char.stres,
    uyku: char.uyku,
    beslenme: char.beslenme,
    kilo: char.kilo,
    psikoloji: char.psikoloji,
    egitim: char.egitim,
    durum: char.durum,
    anne_id: char.anneId,
    baba_id: char.babaId,
    es_id: char.esId,
    sehir: char.sehir,
    ulke: char.ulke,
  };
}

export function mapRelationshipFromDb(row: DbRelationship): Relationship {
  return {
    id: row.id,
    lifeId: row.life_id,
    characterId: row.character_id,
    targetId: row.target_id,
    tip: row.tip as Relationship["tip"],
    puan: row.puan,
    romantik: row.romantik,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapRelationshipToDb(rel: Relationship): Omit<DbRelationship, "created_at" | "updated_at"> {
  return {
    id: rel.id,
    life_id: rel.lifeId,
    character_id: rel.characterId,
    target_id: rel.targetId,
    tip: rel.tip,
    puan: rel.puan,
    romantik: rel.romantik,
  };
}

export function mapEventLogFromDb(row: DbEventLog): EventLog {
  return {
    id: row.id,
    lifeId: row.life_id,
    yil: row.yil,
    yas: row.yas,
    baslik: row.baslik,
    aciklama: row.aciklama,
    kategori: row.kategori as EventLog["kategori"],
    createdAt: row.created_at,
  };
}

export function mapPropertyFromDb(row: DbProperty): Property {
  return {
    id: row.id,
    lifeId: row.life_id,
    tip: row.tip,
    ad: row.ad,
    deger: Number(row.deger),
    kira: Number(row.kira),
    satinAlindi: row.satin_alindi,
    aracTipi: row.arac_tipi ?? undefined,
    detaylar: row.detaylar ?? {},
  };
}

export function mapInvestmentFromDb(row: DbInvestment): Investment {
  return {
    id: row.id,
    lifeId: row.life_id,
    tip: row.tip,
    sembol: row.sembol,
    miktar: Number(row.miktar),
    alisFiyati: Number(row.alis_fiyati),
    mevcutFiyat: Number(row.mevcut_fiyat),
  };
}

export function mapCompanyFromDb(row: DbCompany): Company {
  return {
    id: row.id,
    lifeId: row.life_id,
    ad: row.ad,
    sektor: row.sektor,
    deger: Number(row.deger),
    gelir: Number(row.gelir),
    calisanSayisi: row.calisan_sayisi,
    kurulusYili: row.kurulus_yili,
  };
}

export function mapLoanFromDb(row: DbLoan): Loan {
  return {
    id: row.id,
    lifeId: row.life_id,
    tutar: Number(row.tutar),
    kalanBorc: Number(row.kalan_borc),
    faizOrani: Number(row.faiz_orani),
    aylikOdeme: Number(row.aylik_odeme),
    baslangicYili: row.baslangic_yili,
    bitisYili: row.bitis_yili,
    aktif: row.aktif,
  };
}

export function mapAchievementFromDb(
  row: DbAchievement,
  earned?: DbUserAchievement
): Achievement {
  return {
    id: row.id,
    kod: row.kod,
    ad: row.ad,
    aciklama: row.aciklama,
    ikon: row.ikon ?? "star",
    kazanildi: !!earned,
    kazanildiYil: earned?.kazanildi_yil ?? undefined,
  };
}
