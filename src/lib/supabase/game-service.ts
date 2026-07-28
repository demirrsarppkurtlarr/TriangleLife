import { createClient } from "@/lib/supabase/client";
import type { SavedGameState } from "@/types/game";
import {
  mapLifeFromDb,
  mapLifeToDb,
  mapCharacterFromDb,
  mapCharacterToDb,
  mapRelationshipFromDb,
  mapRelationshipToDb,
  mapEventLogFromDb,
  mapPropertyFromDb,
  mapInvestmentFromDb,
  mapCompanyFromDb,
  mapLoanFromDb,
  mapAchievementFromDb,
} from "@/lib/supabase/mappers";
import type {
  DbAchievement,
  DbUserAchievement,
} from "@/lib/supabase/types";

export async function saveGameState(state: SavedGameState): Promise<{ error: string | null }> {
  const supabase = createClient();
  if (!supabase) return { error: null };

  const { life, player, family, relationships, eventHistory, properties, investments, companies, loans } = state;
  const allCharacters = [player, ...family];

  const { error: lifeError } = await supabase
    .from("lives")
    .upsert(mapLifeToDb(life));

  if (lifeError) return { error: lifeError.message };

  const { error: charError } = await supabase
    .from("characters")
    .upsert(allCharacters.map(mapCharacterToDb));

  if (charError) return { error: charError.message };

  if (relationships.length > 0) {
    const { error: relError } = await supabase
      .from("relationships")
      .upsert(relationships.map(mapRelationshipToDb));
    if (relError) return { error: relError.message };
  }

  if (eventHistory.length > 0) {
    const { error: logError } = await supabase.from("event_logs").upsert(
      eventHistory.map((e) => ({
        id: e.id,
        life_id: e.lifeId,
        yil: e.yil,
        yas: e.yas,
        baslik: e.baslik,
        aciklama: e.aciklama,
        kategori: e.kategori,
      }))
    );
    if (logError) return { error: logError.message };
  }

  if (properties.length > 0) {
    const { error } = await supabase.from("properties").upsert(
      properties.map((p) => ({
        id: p.id,
        life_id: p.lifeId,
        tip: p.tip,
        ad: p.ad,
        deger: p.deger,
        kira: p.kira,
        satin_alindi: p.satinAlindi,
        arac_tipi: p.aracTipi ?? null,
        detaylar: p.detaylar,
      }))
    );
    if (error) return { error: error.message };
  }

  if (investments.length > 0) {
    const { error } = await supabase.from("investments").upsert(
      investments.map((i) => ({
        id: i.id,
        life_id: i.lifeId,
        tip: i.tip,
        sembol: i.sembol,
        miktar: i.miktar,
        alis_fiyati: i.alisFiyati,
        mevcut_fiyat: i.mevcutFiyat,
      }))
    );
    if (error) return { error: error.message };
  }

  if (companies.length > 0) {
    const { error } = await supabase.from("companies").upsert(
      companies.map((c) => ({
        id: c.id,
        life_id: c.lifeId,
        ad: c.ad,
        sektor: c.sektor,
        deger: c.deger,
        gelir: c.gelir,
        calisan_sayisi: c.calisanSayisi,
        kurulus_yili: c.kurulusYili,
      }))
    );
    if (error) return { error: error.message };
  }

  if (loans.length > 0) {
    const { error } = await supabase.from("loans").upsert(
      loans.map((l) => ({
        id: l.id,
        life_id: l.lifeId,
        tutar: l.tutar,
        kalan_borc: l.kalanBorc,
        faiz_orani: l.faizOrani,
        aylik_odeme: l.aylikOdeme,
        baslangic_yili: l.baslangicYili,
        bitis_yili: l.bitisYili,
        aktif: l.aktif,
      }))
    );
    if (error) return { error: error.message };
  }

  return { error: null };
}

export async function loadActiveLife(userId: string): Promise<SavedGameState | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data: lifeRow, error: lifeError } = await supabase
    .from("lives")
    .select("*")
    .eq("user_id", userId)
    .eq("aktif", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lifeError || !lifeRow) return null;

  const life = mapLifeFromDb(lifeRow);

  const { data: charRows } = await supabase
    .from("characters")
    .select("*")
    .eq("life_id", life.id);

  if (!charRows || charRows.length === 0) return null;

  const characters = charRows.map(mapCharacterFromDb);
  const player = characters.find((c) => c.isPlayer);
  if (!player) return null;

  const family = characters.filter((c) => !c.isPlayer);

  const { data: relRows } = await supabase
    .from("relationships")
    .select("*")
    .eq("life_id", life.id);

  const { data: logRows } = await supabase
    .from("event_logs")
    .select("*")
    .eq("life_id", life.id)
    .order("created_at", { ascending: false });

  const { data: propRows } = await supabase
    .from("properties")
    .select("*")
    .eq("life_id", life.id);

  const { data: invRows } = await supabase
    .from("investments")
    .select("*")
    .eq("life_id", life.id);

  const { data: compRows } = await supabase
    .from("companies")
    .select("*")
    .eq("life_id", life.id);

  const { data: loanRows } = await supabase
    .from("loans")
    .select("*")
    .eq("life_id", life.id);

  const achievements = await loadAchievements(userId, life.id);

  return {
    life,
    player,
    family,
    relationships: (relRows ?? []).map(mapRelationshipFromDb),
    eventHistory: (logRows ?? []).map(mapEventLogFromDb),
    properties: (propRows ?? []).map(mapPropertyFromDb),
    investments: (invRows ?? []).map(mapInvestmentFromDb),
    companies: (compRows ?? []).map(mapCompanyFromDb),
    loans: (loanRows ?? []).map(mapLoanFromDb),
    achievements,
  };
}

export async function loadAchievements(userId: string, lifeId: string) {
  const supabase = createClient();
  if (!supabase) return [];

  const { data: allAchievements } = await supabase.from("achievements").select("*");
  const { data: earned } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", userId)
    .eq("life_id", lifeId);

  const earnedMap = new Map(
    (earned ?? []).map((e: DbUserAchievement) => [e.achievement_id, e])
  );

  return (allAchievements ?? []).map((a: DbAchievement) =>
    mapAchievementFromDb(a, earnedMap.get(a.id))
  );
}

export async function unlockAchievement(
  userId: string,
  lifeId: string,
  achievementId: string,
  yil: number
): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;

  await supabase.from("user_achievements").upsert(
    {
      user_id: userId,
      life_id: lifeId,
      achievement_id: achievementId,
      kazanildi_yil: yil,
    },
    { onConflict: "user_id,achievement_id,life_id" }
  );
}

export async function deactivateLife(lifeId: string): Promise<void> {
  const supabase = createClient();
  if (!supabase) return;

  await supabase.from("lives").update({ aktif: false }).eq("id", lifeId);
}
