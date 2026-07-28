import { create } from "zustand";
import type {
  Character,
  Life,
  Relationship,
  GameEvent,
  EventLog,
  Gender,
  GameTab,
  Property,
  Investment,
  Company,
  Loan,
  Achievement,
  GameNotification,
  EducationLevel,
} from "@/types/game";
import { getAgeGroup, VEHICLE_TYPES } from "@/lib/constants";
import { generateFamily, generatePlayer } from "@/lib/generators";
import { getRandomEvent } from "@/lib/events/event-pool";
import { CITIES } from "@/lib/constants";
import { applyHealthDecay, applyHealing } from "@/lib/systems/health";
import { calculateLoanPayment, simulateMarketPrice, INVESTMENT_SYMBOLS } from "@/lib/systems/finance";
import { applyRelationshipAction, simulateNpcLife } from "@/lib/systems/relationships";
import { getEducationForAge, calculateSalary } from "@/lib/systems/career";
import { DEFAULT_ACHIEVEMENTS, checkAchievements, getNewlyUnlocked } from "@/lib/systems/achievements";
import { saveGameState, loadActiveLife, unlockAchievement } from "@/lib/supabase/game-service";

interface GameState {
  life: Life | null;
  player: Character | null;
  family: Character[];
  relationships: Relationship[];
  currentEvent: GameEvent | null;
  eventHistory: EventLog[];
  properties: Property[];
  investments: Investment[];
  companies: Company[];
  loans: Loan[];
  achievements: Achievement[];
  notifications: GameNotification[];
  activeTab: GameTab;
  isLoading: boolean;
  isSaving: boolean;
  isDead: boolean;
  userId: string | null;
  error: string | null;

  setUserId: (id: string | null) => void;
  loadGame: (userId: string) => Promise<boolean>;
  startNewLife: (cinsiyet: Gender, userId?: string) => void;
  advanceYear: () => void;
  selectChoice: (choiceId: string) => void;
  setActiveTab: (tab: GameTab) => void;
  relationshipAction: (targetId: string, action: string) => void;
  buyProperty: (property: Omit<Property, "id" | "lifeId">) => void;
  buyInvestment: (tip: Investment["tip"], sembol: string, miktar: number, fiyat: number) => void;
  takeLoan: (tutar: number, vadeYil: number) => void;
  startCompany: (ad: string, sektor: string) => void;
  healthAction: (tip: "doktor" | "dinlenme" | "spor" | "beslenme") => void;
  study: (seviye: EducationLevel) => void;
  findJob: (meslek: string) => void;
  continueAsChild: (childId: string) => void;
  dismissNotification: (id: string) => void;
  resetGame: () => void;
  persist: () => Promise<void>;
}

function createId(): string {
  return crypto.randomUUID();
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

function createLife(userId: string, baslangicYili: number): Life {
  return {
    id: createId(),
    userId,
    aktif: true,
    baslangicYili,
    mevcutYil: baslangicYili,
    para: 0,
    bankaBakiyesi: 0,
    krediBorcu: 0,
    evId: null,
    aracId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createCharacterFromFamily(
  member: ReturnType<typeof generateFamily>[0],
  lifeId: string,
  userId: string,
  baslangicYili: number
): Character {
  return {
    id: createId(),
    userId,
    lifeId,
    isim: member.isim,
    soyisim: member.soyisim,
    yas: member.yas,
    dogumYili: baslangicYili - member.yas,
    cinsiyet: member.cinsiyet,
    meslek: member.meslek,
    gelir: member.gelir,
    ozellikler: member.ozellikler,
    saglik: member.ozellikler.saglik,
    mutluluk: member.ozellikler.mutluluk,
    stres: 20,
    uyku: 70,
    beslenme: 70,
    kilo: 50 + Math.floor(Math.random() * 30),
    psikoloji: 60,
    egitim: member.yas < 6 ? "anaokulu" : member.yas < 12 ? "ilkokul" : member.yas < 18 ? "lise" : "universite",
    durum: "yasiyor",
    anneId: null,
    babaId: null,
    esId: null,
    sehir: CITIES[Math.floor(Math.random() * CITIES.length)],
    ulke: "Türkiye",
    isPlayer: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function addNotification(
  notifications: GameNotification[],
  mesaj: string,
  tip: GameNotification["tip"] = "bilgi"
): GameNotification[] {
  return [{ id: createId(), mesaj, tip }, ...notifications].slice(0, 5);
}

function checkPlayerDeath(player: Character): boolean {
  if (player.saglik <= 0) return true;
  if (player.yas > 95 && Math.random() < 0.3) return true;
  if (player.yas > 85 && Math.random() < 0.1) return true;
  if (player.yas > 75 && player.saglik < 20 && Math.random() < 0.15) return true;
  return false;
}

export const useGameStore = create<GameState>((set, get) => ({
  life: null,
  player: null,
  family: [],
  relationships: [],
  currentEvent: null,
  eventHistory: [],
  properties: [],
  investments: [],
  companies: [],
  loans: [],
  achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
  notifications: [],
  activeTab: "hayat",
  isLoading: false,
  isSaving: false,
  isDead: false,
  userId: null,
  error: null,

  setUserId: (id) => set({ userId: id }),

  loadGame: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const saved = await loadActiveLife(userId);
      if (!saved) {
        set({ isLoading: false });
        return false;
      }
      const ageGroup = getAgeGroup(saved.player.yas);
      set({
        ...saved,
        currentEvent: getRandomEvent(ageGroup),
        notifications: [],
        activeTab: "hayat",
        isDead: saved.player.durum === "oldu",
        isLoading: false,
        userId,
      });
      return true;
    } catch {
      set({ isLoading: false, error: "Oyun yüklenemedi." });
      return false;
    }
  },

  startNewLife: (cinsiyet, userId) => {
    const baslangicYili = 2026;
    const uid = userId ?? get().userId ?? "local-user";
    const life = createLife(uid, baslangicYili);
    const familyMembers = generateFamily();
    const playerData = generatePlayer(cinsiyet, baslangicYili);

    const familyChars = familyMembers.map((m) =>
      createCharacterFromFamily(m, life.id, uid, baslangicYili)
    );

    const anne = familyChars.find((c) =>
      familyMembers.find((m) => m.rol === "anne" && m.isim === c.isim)
    );
    const baba = familyChars.find((c) =>
      familyMembers.find((m) => m.rol === "baba" && m.isim === c.isim)
    );

    const player: Character = {
      id: createId(),
      userId: uid,
      lifeId: life.id,
      isim: playerData.isim,
      soyisim: playerData.soyisim,
      yas: 0,
      dogumYili: baslangicYili,
      cinsiyet,
      meslek: null,
      gelir: 0,
      ozellikler: playerData.ozellikler,
      saglik: playerData.ozellikler.saglik,
      mutluluk: playerData.ozellikler.mutluluk,
      stres: 10,
      uyku: 80,
      beslenme: 80,
      kilo: 3 + Math.floor(Math.random() * 2),
      psikoloji: 70,
      egitim: "yok",
      durum: "yasiyor",
      anneId: anne?.id ?? null,
      babaId: baba?.id ?? null,
      esId: null,
      sehir: familyChars[0]?.sehir ?? "İstanbul",
      ulke: "Türkiye",
      isPlayer: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const relationships: Relationship[] = familyChars.map((member) => {
      const memberData = familyMembers.find((m) => m.isim === member.isim);
      const tip =
        memberData?.rol === "anne" ? "anne" : memberData?.rol === "baba" ? "baba" : "kardes";
      return {
        id: createId(),
        lifeId: life.id,
        characterId: player.id,
        targetId: member.id,
        tip: tip as Relationship["tip"],
        puan: 70 + Math.floor(Math.random() * 20),
        romantik: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    set({
      life,
      player,
      family: familyChars,
      relationships,
      currentEvent: getRandomEvent("bebek"),
      eventHistory: [],
      properties: [],
      investments: [],
      companies: [],
      loans: [],
      achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
      notifications: addNotification([], "Hayatına hoş geldin!"),
      activeTab: "hayat",
      isDead: false,
      userId: uid,
      error: null,
    });

    get().persist();
  },

  advanceYear: () => {
    const state = get();
    const { player, life, currentEvent, family, relationships, investments, loans } = state;
    if (!player || !life || currentEvent || state.isDead) return;

    const newYas = player.yas + 1;
    const newYil = life.mevcutYil + 1;
    const ageGroup = getAgeGroup(newYas);

    let updatedPlayer: Character = {
      ...player,
      yas: newYas,
      ...applyHealthDecay(player),
      updatedAt: new Date().toISOString(),
    };

    const edu = getEducationForAge(newYas);
    if (edu && updatedPlayer.egitim !== edu) {
      updatedPlayer.egitim = edu as EducationLevel;
    }

    if (updatedPlayer.meslek && updatedPlayer.meslek !== "Öğrenci" && updatedPlayer.meslek !== "Emekli") {
      updatedPlayer.gelir = calculateSalary(
        updatedPlayer.meslek,
        updatedPlayer.ozellikler.zeka,
        newYas - 18
      );
    }

    let updatedLife: Life = {
      ...life,
      mevcutYil: newYil,
      para: life.para + (updatedPlayer.gelir ?? 0),
      updatedAt: new Date().toISOString(),
    };

    let updatedFamily = family.map((npc) => {
      const updates = simulateNpcLife(npc, newYil);
      return {
        ...npc,
        yas: npc.yas + 1,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    });

    let updatedInvestments = investments.map((inv) => ({
      ...inv,
      mevcutFiyat: simulateMarketPrice(inv.mevcutFiyat),
    }));

    let updatedLoans = loans.map((loan) => {
      if (!loan.aktif) return loan;
      const yillikOdeme = loan.aylikOdeme * 12;
      const kalan = Math.max(0, loan.kalanBorc - yillikOdeme);
      updatedLife.para -= yillikOdeme;
      return { ...loan, kalanBorc: kalan, aktif: kalan > 0 };
    });

    updatedLife.krediBorcu = updatedLoans.reduce((s, l) => s + l.kalanBorc, 0);

    const dead = checkPlayerDeath(updatedPlayer);
    if (dead) {
      updatedPlayer = { ...updatedPlayer, durum: "oldu", saglik: 0 };
    }

    const beforeAchievements = state.achievements;
    const hasSpouse = relationships.some((r) => r.tip === "es" || r.tip === "sevgili");
    const hasChild = relationships.some((r) => r.tip === "cocuk");
    const updatedAchievements = checkAchievements(beforeAchievements, {
      player: updatedPlayer,
      life: updatedLife,
      properties: state.properties,
      investments: updatedInvestments,
      companies: state.companies,
      hasSpouse,
      hasChild,
      yearsPlayed: newYas,
    });

    const newlyUnlocked = getNewlyUnlocked(beforeAchievements, updatedAchievements);
    let notifications = state.notifications;
    for (const a of newlyUnlocked) {
      notifications = addNotification(notifications, `Başarım kazandın: ${a.ad}`, "basarim");
      if (state.userId && state.userId !== "local-user") {
        unlockAchievement(state.userId, life.id, a.id, newYil);
      }
    }

    set({
      player: updatedPlayer,
      life: updatedLife,
      family: updatedFamily,
      investments: updatedInvestments,
      loans: updatedLoans,
      achievements: updatedAchievements,
      currentEvent: dead ? null : getRandomEvent(ageGroup),
      isDead: dead,
      notifications: dead
        ? addNotification(notifications, `${updatedPlayer.isim} ${updatedPlayer.yas} yaşında vefat etti.`, "uyari")
        : notifications,
    });

    get().persist();
  },

  selectChoice: (choiceId) => {
    const { player, life, currentEvent, eventHistory, relationships } = get();
    if (!player || !life || !currentEvent) return;

    const choice = currentEvent.secenekler.find((c) => c.id === choiceId);
    if (!choice) return;

    let updatedPlayer = { ...player };
    let updatedLife = { ...life };
    let updatedRelationships = [...relationships];

    if (choice.etkiler) {
      for (const effect of choice.etkiler) {
        switch (effect.tip) {
          case "mutluluk":
            updatedPlayer.mutluluk = clamp(updatedPlayer.mutluluk + effect.deger);
            break;
          case "saglik":
            updatedPlayer.saglik = clamp(updatedPlayer.saglik + effect.deger);
            break;
          case "stres":
            updatedPlayer.stres = clamp(updatedPlayer.stres + effect.deger);
            break;
          case "para":
            updatedLife.para += effect.deger;
            break;
          case "ozellik":
            if (effect.ozellik) {
              updatedPlayer.ozellikler = {
                ...updatedPlayer.ozellikler,
                [effect.ozellik]: clamp(
                  updatedPlayer.ozellikler[effect.ozellik] + effect.deger
                ),
              };
            }
            break;
          case "iliski":
            if (effect.hedefId) {
              updatedRelationships = updatedRelationships.map((r) =>
                r.targetId === effect.hedefId
                  ? { ...r, puan: clamp(r.puan + effect.deger) }
                  : r
              );
            }
            break;
        }
      }
    }

    const log: EventLog = {
      id: createId(),
      lifeId: life.id,
      yil: life.mevcutYil,
      yas: player.yas,
      baslik: currentEvent.baslik,
      aciklama: choice.sonuc,
      kategori: currentEvent.kategori,
      createdAt: new Date().toISOString(),
    };

    set({
      player: updatedPlayer,
      life: updatedLife,
      relationships: updatedRelationships,
      currentEvent: null,
      eventHistory: [log, ...eventHistory],
    });

    get().persist();
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  relationshipAction: (targetId, action) => {
    const { relationships, player, notifications } = get();
    if (!player) return;

    const rel = relationships.find((r) => r.targetId === targetId);
    if (!rel) return;

    const result = applyRelationshipAction(rel, action);
    const updated = relationships.map((r) =>
      r.id === rel.id ? { ...r, puan: result.puan, romantik: action === "sevgili" || action === "evlilik" ? true : r.romantik } : r
    );

    let updatedPlayer = { ...player, mutluluk: clamp(player.mutluluk + (result.puan - rel.puan) * 0.1) };

    set({
      relationships: updated,
      player: updatedPlayer,
      notifications: addNotification(notifications, result.mesaj),
    });
    get().persist();
  },

  buyProperty: (propertyData) => {
    const { life, properties, notifications } = get();
    if (!life) return;

    const cost = propertyData.satinAlindi ? propertyData.deger : propertyData.kira * 12;
    if (life.para < cost) {
      set({ notifications: addNotification(notifications, "Yeterli paranız yok.", "uyari") });
      return;
    }

    const property: Property = {
      ...propertyData,
      id: createId(),
      lifeId: life.id,
    };

    const updatedLife = {
      ...life,
      para: life.para - cost,
      evId: property.tip === "ev" ? property.id : life.evId,
      aracId: property.tip === "arac" ? property.id : life.aracId,
    };

    set({
      life: updatedLife,
      properties: [...properties, property],
      notifications: addNotification(notifications, `${property.ad} satın alındı!`),
    });
    get().persist();
  },

  buyInvestment: (tip, sembol, miktar, fiyat) => {
    const { life, investments, notifications } = get();
    if (!life) return;

    const cost = miktar * fiyat;
    if (life.para < cost) {
      set({ notifications: addNotification(notifications, "Yeterli paranız yok.", "uyari") });
      return;
    }

    const investment: Investment = {
      id: createId(),
      lifeId: life.id,
      tip,
      sembol,
      miktar,
      alisFiyati: fiyat,
      mevcutFiyat: fiyat,
    };

    set({
      life: { ...life, para: life.para - cost },
      investments: [...investments, investment],
      notifications: addNotification(notifications, `${sembol} yatırımı yapıldı.`),
    });
    get().persist();
  },

  takeLoan: (tutar, vadeYil) => {
    const { life, loans, notifications } = get();
    if (!life) return;

    const { aylikOdeme } = calculateLoanPayment(tutar, 15, vadeYil);
    const loan: Loan = {
      id: createId(),
      lifeId: life.id,
      tutar,
      kalanBorc: tutar,
      faizOrani: 15,
      aylikOdeme,
      baslangicYili: life.mevcutYil,
      bitisYili: life.mevcutYil + vadeYil,
      aktif: true,
    };

    set({
      life: { ...life, para: life.para + tutar, krediBorcu: life.krediBorcu + tutar },
      loans: [...loans, loan],
      notifications: addNotification(notifications, `${tutar.toLocaleString("tr-TR")} TL kredi çekildi.`),
    });
    get().persist();
  },

  startCompany: (ad, sektor) => {
    const { life, companies, player, notifications } = get();
    if (!life || !player || player.yas < 18) return;

    const maliyet = 50000;
    if (life.para < maliyet) {
      set({ notifications: addNotification(notifications, "Şirket kurmak için 50.000 TL gerekli.", "uyari") });
      return;
    }

    const company: Company = {
      id: createId(),
      lifeId: life.id,
      ad,
      sektor,
      deger: maliyet,
      gelir: 10000,
      calisanSayisi: 1,
      kurulusYili: life.mevcutYil,
    };

    set({
      life: { ...life, para: life.para - maliyet },
      companies: [...companies, company],
      player: { ...player, meslek: "CEO" },
      notifications: addNotification(notifications, `${ad} şirketi kuruldu!`),
    });
    get().persist();
  },

  healthAction: (tip) => {
    const { player, life, notifications } = get();
    if (!player || !life) return;

    const costs = { doktor: 500, dinlenme: 0, spor: 300, beslenme: 200 };
    if (life.para < costs[tip]) {
      set({ notifications: addNotification(notifications, "Yeterli paranız yok.", "uyari") });
      return;
    }

    const healing = applyHealing(player, tip);
    const messages = {
      doktor: "Doktora gittin, sağlığın düzeldi.",
      dinlenme: "Dinlendin, stresin azaldı.",
      spor: "Spor yaptın, kendini iyi hissediyorsun.",
      beslenme: "Sağlıklı beslendin.",
    };

    set({
      player: { ...player, ...healing },
      life: { ...life, para: life.para - costs[tip] },
      notifications: addNotification(notifications, messages[tip]),
    });
    get().persist();
  },

  study: (seviye) => {
    const { player, notifications } = get();
    if (!player) return;

    set({
      player: {
        ...player,
        egitim: seviye,
        ozellikler: {
          ...player.ozellikler,
          zeka: clamp(player.ozellikler.zeka + 5),
        },
      },
      notifications: addNotification(notifications, `${seviye} eğitimine devam ediyorsun.`),
    });
    get().persist();
  },

  findJob: (meslek) => {
    const { player, life, notifications } = get();
    if (!player || !life || player.yas < 16) return;

    const maas = calculateSalary(meslek, player.ozellikler.zeka, player.yas - 18);

    set({
      player: { ...player, meslek, gelir: maas },
      notifications: addNotification(notifications, `${meslek} olarak işe başladın!`),
    });
    get().persist();
  },

  continueAsChild: (childId) => {
    const { family, player, life, relationships } = get();
    if (!player || !life) return;

    const child = family.find((c) => c.id === childId);
    if (!child || child.durum === "oldu") return;

    const newPlayer: Character = {
      ...child,
      isPlayer: true,
      updatedAt: new Date().toISOString(),
    };

    const updatedFamily = family
      .filter((c) => c.id !== childId)
      .map((c) => (c.id === player.id ? { ...player, isPlayer: false } : c));

    const childRels = relationships.map((r) =>
      r.characterId === player.id
        ? { ...r, characterId: childId }
        : r
    );

    set({
      player: newPlayer,
      family: updatedFamily,
      relationships: childRels,
      isDead: false,
      currentEvent: getRandomEvent(getAgeGroup(newPlayer.yas)),
      notifications: addNotification([], `${newPlayer.isim} olarak hayata devam ediyorsun.`),
      activeTab: "hayat",
    });
    get().persist();
  },

  dismissNotification: (id) => {
    set({ notifications: get().notifications.filter((n) => n.id !== id) });
  },

  resetGame: () => {
    set({
      life: null,
      player: null,
      family: [],
      relationships: [],
      currentEvent: null,
      eventHistory: [],
      properties: [],
      investments: [],
      companies: [],
      loans: [],
      achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
      notifications: [],
      activeTab: "hayat",
      isDead: false,
      error: null,
    });
  },

  persist: async () => {
    const state = get();
    if (!state.life || !state.player) return;

    set({ isSaving: true });
    const { error } = await saveGameState({
      life: state.life,
      player: state.player,
      family: state.family,
      relationships: state.relationships,
      eventHistory: state.eventHistory,
      properties: state.properties,
      investments: state.investments,
      companies: state.companies,
      loans: state.loans,
      achievements: state.achievements,
    });
    set({ isSaving: false, error: error ?? null });
  },
}));

export { VEHICLE_TYPES, INVESTMENT_SYMBOLS };
