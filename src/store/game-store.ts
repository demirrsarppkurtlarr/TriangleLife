import { create } from "zustand";
import type {
  Character,
  Life,
  Relationship,
  GameEvent,
  EventLog,
  GameTab,
  Property,
  Investment,
  Company,
  Loan,
  Achievement,
  GameNotification,
  EducationLevel,
  JournalEntry,
  SavedGameState,
  EventEffect,
} from "@/types/game";
import { getAgeGroup, VEHICLE_TYPES, CITIES } from "@/lib/constants";
import { generateFamily, buildPersonalityFromFocus } from "@/lib/generators";
import { getRandomEvent } from "@/lib/events/event-pool";
import type { CharacterCreationOptions } from "@/types/creation";
import { WEALTH_STARTING_MONEY } from "@/types/creation";
import { applyHealthDecay, applyHealing } from "@/lib/systems/health";
import { calculateLoanPayment, simulateMarketPrice, INVESTMENT_SYMBOLS, calculateTax } from "@/lib/systems/finance";
import {
  applyRelationshipAction,
  checkActionAllowed,
  updateCooldowns,
  type ActionCooldown,
} from "@/lib/systems/relationships";
import { getEducationForAge, calculateSalary } from "@/lib/systems/career";
import { DEFAULT_ACHIEVEMENTS, checkAchievements, getNewlyUnlocked } from "@/lib/systems/achievements";
import { saveGameState, loadActiveLife, unlockAchievement } from "@/lib/supabase/game-service";
import { saveToLocal, loadFromLocal, clearLocalSave } from "@/lib/local-storage";
import { SOCIAL_ACTIVITIES } from "@/lib/systems/social";
import {
  createSpouse,
  createChild,
  createSpouseRelationship,
  createChildRelationship,
} from "@/lib/systems/npc-lifecycle";
import {
  simulateNpcYear,
  recordPlayerActionMemory,
  type NpcMemory,
} from "@/lib/systems/npc-ai";
import { DECORATION_CATALOG } from "@/lib/systems/decoration";
import {
  canAccessFinance,
  canInvest,
  canTakeLoan,
  canStartCompany,
  canBuyHome,
  canBuyVehicle,
  canWork,
  canStudyUniversity,
  getPocketMoney,
  getAgeBlockedMessage,
  canGamble,
  canDoSideGig,
} from "@/lib/systems/age-gates";
import { inheritGenetics, type GeneticsProfile } from "@/lib/systems/genetics";
import {
  createNeighborhood,
  neighborhoodYearTick,
  helpNeighbor as helpNeighborFn,
  type NeighborhoodState,
} from "@/lib/systems/neighborhood";
import {
  createSchoolState,
  schoolYearTick,
  studyHarder,
  skipStudy,
  type SchoolState,
} from "@/lib/systems/school";
import {
  createCrimeState,
  attemptCrime,
  releaseIfDue,
  type CrimeState,
} from "@/lib/systems/crime";
import {
  createPoliticsState,
  setLean,
  vote,
  joinParty,
  type PoliticsState,
  type PoliticalLean,
} from "@/lib/systems/politics";
import {
  createReligionState,
  setBelief,
  setPractice,
  worship,
  type ReligionState,
  type ReligionPractice,
} from "@/lib/systems/religion";
import {
  startHobby,
  practiceHobby,
  type Hobby,
} from "@/lib/systems/hobbies";
import { calculateLifeScore, submitScore } from "@/lib/systems/score";
import { pickLifePrompt, familyYearlyNews, type LifePrompt } from "@/lib/systems/life-prompts";
import { cityCostMultiplier } from "@/lib/systems/city-depth";
import {
  MONEY_GIGS,
  GAMBLE_GAMES,
  rollGigEarnings,
  resolveGamble,
} from "@/lib/systems/money-makers";
import {
  createEmptyStoryState,
  buildConsequencesFromChoice,
  applyConsequenceSeeds,
  tickStoryYear,
  popDueFollowUp,
  type StoryState,
} from "@/lib/systems/story-continuity";
import {
  createEmptyLifeExtras,
  canStartMilitary,
  startMilitary,
  tickMilitary,
  setUniversityMajor,
  advanceCareerTrack,
  SAC_RENKLERI,
  GOZ_RENKLERI,
  TEN_RENKLERI,
  UNIVERSITE_BOLUMLERI,
  type LifeExtras,
} from "@/lib/systems/life-extras";
import {
  adoptPet,
  carePet,
  tickPets,
  PET_TYPES,
  type Pet,
} from "@/lib/systems/pets";
import {
  rollNewDisease,
  tickDiseases,
  treatDisease,
  pickDeathCause,
  type Disease,
} from "@/lib/systems/diseases";
import {
  generateDatingCandidates,
  canGetPregnant,
  startPregnancy,
  tickPregnancy,
  attemptCheat,
  type DatingCandidate,
  type PregnancyState,
} from "@/lib/systems/romance-depth";

interface GigCooldown {
  gigId: string;
  yil: number;
  sayac: number;
}

interface GameState {
  life: Life | null;
  player: Character | null;
  family: Character[];
  relationships: Relationship[];
  currentEvent: GameEvent | null;
  currentPrompt: LifePrompt | null;
  lifePromptHistory: string[];
  storyState: StoryState;
  lifeExtras: LifeExtras;
  pets: Pet[];
  diseases: Disease[];
  pregnancy: PregnancyState | null;
  datingCandidates: DatingCandidate[];
  eventHistory: EventLog[];
  properties: Property[];
  investments: Investment[];
  companies: Company[];
  loans: Loan[];
  achievements: Achievement[];
  notifications: GameNotification[];
  npcMemories: NpcMemory[];
  decorations: string[];
  journal: JournalEntry[];
  neighborhood: NeighborhoodState | null;
  school: SchoolState | null;
  crime: CrimeState;
  politics: PoliticsState;
  religion: ReligionState;
  hobbies: Hobby[];
  genetics: GeneticsProfile | null;
  actionCooldowns: ActionCooldown[];
  gigCooldowns: GigCooldown[];
  aileDurumu: string;
  lifetimeScore: number;
  activeTab: GameTab;
  isLoading: boolean;
  isSaving: boolean;
  isDead: boolean;
  userId: string | null;
  error: string | null;

  setUserId: (id: string | null) => void;
  loadGame: (userId: string) => Promise<boolean>;
  startNewLife: (options: CharacterCreationOptions, userId?: string) => void;
  advanceYear: () => void;
  selectChoice: (choiceId: string) => void;
  resolvePrompt: (choiceId: string) => void;
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
  socialActivity: (activityId: string) => void;
  payTax: () => void;
  hireEmployee: (companyId: string) => void;
  buyDecoration: (decorationId: string) => void;
  doGig: (gigId: string) => void;
  gamble: (gameId: string, bahis: number) => void;
  helpNeighbor: (neighborId: string) => void;
  schoolStudy: (hard: boolean) => void;
  attemptCrimeAction: (crimeId: string) => void;
  setPoliticalLean: (lean: PoliticalLean) => void;
  castVote: () => void;
  joinPoliticalParty: () => void;
  setReligionBelief: (inanc: string) => void;
  setReligionPractice: (pratik: ReligionPractice) => void;
  worshipAction: () => void;
  startHobbyAction: (hobbyId: string) => void;
  practiceHobbyAction: (hobbyId: string) => void;
  getDriversLicense: () => void;
  moveCity: (sehir: string) => void;
  startMilitaryService: () => void;
  chooseUniversityMajor: (bolumId: string) => void;
  advanceCareer: () => void;
  adoptPetAction: (tur: Pet["tur"]) => void;
  carePetAction: (petId: string) => void;
  treatDiseaseAction: (diseaseId: string) => void;
  therapyAction: () => void;
  plasticSurgeryAction: () => void;
  joinGym: () => void;
  gymWorkout: () => void;
  refreshDatingPool: () => void;
  dateCandidate: (candidateId: string) => void;
  cheatOnPartner: () => void;
  tryPregnancy: () => void;
  adoptChildAction: () => void;
  renamePlayer: (isim: string, soyisim: string) => void;
  loadLocalGame: (slot?: number) => boolean;
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
    aileRolu: member.rol,
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

function addJournal(
  journal: JournalEntry[],
  yil: number,
  yas: number,
  baslik: string,
  metin: string,
  kategori: string
): JournalEntry[] {
  return [
    { id: createId(), yil, yas, baslik, metin, kategori },
    ...journal,
  ].slice(0, 200);
}

function checkPlayerDeath(player: Character): boolean {
  if (player.saglik <= 0) return true;
  if (player.yas > 95 && Math.random() < 0.3) return true;
  if (player.yas > 85 && Math.random() < 0.1) return true;
  if (player.yas > 75 && player.saglik < 20 && Math.random() < 0.15) return true;
  return false;
}

function defaultExtras() {
  return {
    journal: [] as JournalEntry[],
    neighborhood: null as NeighborhoodState | null,
    school: null as SchoolState | null,
    crime: createCrimeState(),
    politics: createPoliticsState(),
    religion: createReligionState(),
    hobbies: [] as Hobby[],
    genetics: null as GeneticsProfile | null,
    actionCooldowns: [] as ActionCooldown[],
    gigCooldowns: [] as GigCooldown[],
    aileDurumu: "orta",
    lifetimeScore: 0,
    lifePromptHistory: [],
    storyState: createEmptyStoryState(),
    lifeExtras: createEmptyLifeExtras(),
    pets: [] as Pet[],
    diseases: [] as Disease[],
    pregnancy: null as PregnancyState | null,
    datingCandidates: [] as DatingCandidate[],
  };
}

function applyEventEffects(
  player: Character,
  life: Life,
  effects: EventEffect[],
  yas: number,
  kategori?: string
): { player: Character; life: Life } {
  let updatedPlayer = { ...player, ozellikler: { ...player.ozellikler } };
  let updatedLife = { ...life };
  for (const effect of effects) {
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
        if (yas < 12 && Math.abs(effect.deger) > 200) break;
        if (yas < 16 && effect.deger > 2000) break;
        if (yas < 18 && effect.deger > 0 && kategori && ["finans", "kariyer"].includes(kategori)) {
          updatedLife.para += Math.min(effect.deger, 500);
        } else {
          updatedLife.para += effect.deger;
        }
        break;
      case "ozellik":
        if (effect.ozellik) {
          updatedPlayer.ozellikler = {
            ...updatedPlayer.ozellikler,
            [effect.ozellik]: clamp(updatedPlayer.ozellikler[effect.ozellik] + effect.deger),
          };
        }
        break;
    }
  }
  return { player: updatedPlayer, life: updatedLife };
}

export const useGameStore = create<GameState>((set, get) => ({
  life: null,
  player: null,
  family: [],
  relationships: [],
  currentEvent: null,
  currentPrompt: null,
  eventHistory: [],
  properties: [],
  investments: [],
  companies: [],
  loans: [],
  achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
  notifications: [],
  npcMemories: [],
  decorations: [],
  ...defaultExtras(),
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
        ...defaultExtras(),
        ...saved,
        journal: saved.journal ?? [],
        neighborhood: saved.neighborhood ?? createNeighborhood(saved.player.sehir),
        school: saved.school ?? createSchoolState(saved.player.yas),
        crime: {
          ...(saved.crime ?? createCrimeState()),
          kalanCezaYil: saved.crime?.kalanCezaYil ?? 0,
        },
        politics: saved.politics ?? createPoliticsState(),
        religion: saved.religion ?? createReligionState(),
        hobbies: saved.hobbies ?? [],
        genetics: saved.genetics ?? null,
        actionCooldowns: saved.actionCooldowns ?? [],
        aileDurumu: saved.aileDurumu ?? "orta",
        lifetimeScore: saved.lifetimeScore ?? 0,
        lifePromptHistory: saved.lifePromptHistory ?? [],
        storyState: saved.storyState ?? createEmptyStoryState(),
        lifeExtras: saved.lifeExtras ?? createEmptyLifeExtras(),
        pets: saved.pets ?? [],
        diseases: saved.diseases ?? [],
        pregnancy: saved.pregnancy ?? null,
        datingCandidates: saved.datingCandidates ?? [],
        decorations: saved.decorations ?? [],
        currentEvent: getRandomEvent(
          ageGroup,
          saved.player.yas,
          (saved.eventHistory ?? []).slice(0, 8).map((e) => e.baslik),
          (saved.storyState ?? createEmptyStoryState()).flags
        ),
        currentPrompt: null,
        notifications: [],
        npcMemories: [],
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

  startNewLife: (options, userId) => {
    const baslangicYili = options.dogumYili;
    const uid = userId ?? get().userId ?? "local-user";
    const life = createLife(uid, baslangicYili);
    // Bebek/çocuk nakit tutmaz — aile durumu sadece harçlık ve ileride miras için
    life.para = 0;

    const familyMembers = generateFamily({
      soyisim: options.soyisim.trim(),
      kardesSayisi: options.kardesSayisi,
    });

    const familyChars = familyMembers.map((m) => {
      const char = createCharacterFromFamily(m, life.id, uid, baslangicYili);
      return { ...char, sehir: options.sehir, aileRolu: m.rol };
    });

    const anne = familyChars.find((c) => c.aileRolu === "anne") ?? null;
    const baba = familyChars.find((c) => c.aileRolu === "baba") ?? null;

    const { genetics, ozellikler: inheritedBits } = inheritGenetics(
      anne ?? null,
      baba ?? null,
      options.cinsiyet
    );
    const focused = buildPersonalityFromFocus(options.kisilikOdagi);
    const ozellikler = {
      ...focused,
      saglik: Math.round((focused.saglik + inheritedBits.saglik) / 2),
      zeka: Math.round((focused.zeka + inheritedBits.zeka) / 2),
    };
    const difficultyHealth =
      options.zorluk === "kolay" ? 15 : options.zorluk === "zor" ? -10 : 0;

    const player: Character = {
      id: createId(),
      userId: uid,
      lifeId: life.id,
      isim: options.isim.trim(),
      soyisim: options.soyisim.trim(),
      yas: 0,
      dogumYili: baslangicYili,
      cinsiyet: options.cinsiyet,
      meslek: null,
      gelir: 0,
      ozellikler,
      saglik: Math.max(20, Math.min(100, ozellikler.saglik + difficultyHealth)),
      mutluluk: ozellikler.mutluluk,
      stres: options.zorluk === "zor" ? 25 : 10,
      uyku: 80,
      beslenme: 80,
      kilo: 3 + Math.floor(Math.random() * 2),
      psikoloji: 70,
      egitim: "yok",
      durum: "yasiyor",
      anneId: anne?.id ?? null,
      babaId: baba?.id ?? null,
      esId: null,
      sehir: options.sehir,
      ulke: "Türkiye",
      isPlayer: true,
      sacRengi: options.sacRengi || genetics.sacRengi,
      gozRengi: options.gozRengi || genetics.gozRengi,
      tenRengi: options.tenRengi || genetics.tenRengi,
      boyPotansiyeli: genetics.boyPotansiyeli,
      genetikOzet: `Anne %${genetics.ebeveynKatkisi.anne} / Baba %${genetics.ebeveynKatkisi.baba}`,
      zorluk: options.zorluk,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const relationships: Relationship[] = familyChars.map((member) => {
      const tipMap: Record<string, Relationship["tip"]> = {
        anne: "anne",
        baba: "baba",
        kardes: "kardes",
        dede: "akraba",
        anneanne: "akraba",
        babaanne: "akraba",
      };
      const tip = tipMap[member.aileRolu ?? ""] ?? "akraba";
      return {
        id: createId(),
        lifeId: life.id,
        characterId: player.id,
        targetId: member.id,
        tip,
        puan: tip === "anne" || tip === "baba" ? 80 + Math.floor(Math.random() * 15) : 65 + Math.floor(Math.random() * 20),
        romantik: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    const journal = addJournal(
      [],
      baslangicYili,
      0,
      "Doğum",
      `${player.isim} ${player.soyisim}, ${options.sehir}'de dünyaya geldi.`,
      "yasam"
    );

    // Aile birikimi bankada tutulur; oyuncu 18'de erişebilir (miras/ayrılma yoksa harçlık)
    life.bankaBakiyesi = Math.floor(WEALTH_STARTING_MONEY[options.aileDurumu] * 0.35);

    set({
      life,
      player,
      family: familyChars,
      relationships,
      currentEvent: getRandomEvent("bebek", 0),
      currentPrompt: null,
      lifePromptHistory: [],
      storyState: createEmptyStoryState(),
      eventHistory: [],
      properties: [],
      investments: [],
      companies: [],
      loans: [],
      achievements: DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a })),
      notifications: addNotification(
        [],
        `Hoş geldin ${player.isim}! Ailen: ${familyChars.map((f) => f.isim).join(", ")}.`,
        "yasam"
      ),
      npcMemories: [],
      decorations: [],
      journal,
      neighborhood: createNeighborhood(options.sehir),
      school: null,
      crime: createCrimeState(),
      politics: createPoliticsState(),
      religion: createReligionState(),
      hobbies: [],
      genetics,
      actionCooldowns: [],
      gigCooldowns: [],
      aileDurumu: options.aileDurumu,
      lifetimeScore: 0,
      lifeExtras: createEmptyLifeExtras(),
      pets: [],
      diseases: [],
      pregnancy: null,
      datingCandidates: [],
      activeTab: "hayat",
      isDead: false,
      userId: uid,
      error: null,
    });

    get().persist();
  },

  advanceYear: () => {
    const state = get();
    const { player, life, currentEvent, currentPrompt, family, relationships, investments, loans } = state;
    if (!player || !life || currentEvent || currentPrompt || state.isDead) return;

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

    if (
      updatedPlayer.meslek &&
      updatedPlayer.meslek !== "Öğrenci" &&
      updatedPlayer.meslek !== "Emekli" &&
      canWork(newYas)
    ) {
      updatedPlayer.gelir = calculateSalary(
        updatedPlayer.meslek,
        updatedPlayer.ozellikler.zeka,
        Math.max(0, newYas - 18)
      );
    } else if (!canWork(newYas)) {
      updatedPlayer.gelir = 0;
      updatedPlayer.meslek = newYas < 6 ? null : "Öğrenci";
    }

    let updatedLife: Life = {
      ...life,
      mevcutYil: newYil,
      para: life.para + (canWork(newYas) ? updatedPlayer.gelir ?? 0 : 0),
      updatedAt: new Date().toISOString(),
    };

    // Harçlık (çocuk/ergen) — yatırım değil
    const pocket = getPocketMoney(newYas, state.aileDurumu);
    if (pocket > 0) {
      updatedLife.para += pocket;
    }

    // 18 yaş: aile birikiminin bir kısmına erişim (gerçekçi: tam servet değil)
    if (newYas === 18 && life.bankaBakiyesi > 0) {
      const transfer = Math.floor(life.bankaBakiyesi * 0.4);
      updatedLife.para += transfer;
      updatedLife.bankaBakiyesi = life.bankaBakiyesi - transfer;
    }

    let notifications = state.notifications;
    let journal = state.journal;
    if (pocket > 0) {
      notifications = addNotification(notifications, `Bu yıl ${pocket} TL harçlık aldın.`);
    }
    if (newYas === 18) {
      notifications = addNotification(
        notifications,
        "18 yaşına girdin. Yatırım, kredi ve ev alma artık mümkün.",
        "yasam"
      );
    }

    let updatedMemories = state.npcMemories;
    let updatedFamily = family.map((npc) => {
      if (npc.durum === "oldu") return { ...npc, yas: npc.yas + 1 };
      const result = simulateNpcYear(
        npc,
        newYil,
        updatedMemories.filter((m) => m.npcId === npc.id)
      );
      updatedMemories = [
        ...updatedMemories.filter((m) => m.npcId !== npc.id),
        ...result.memories,
      ];
      if (result.message) {
        notifications = addNotification(notifications, result.message, "yasam");
      }
      return result.character;
    });

    // Aile ilişkileri + haberler (BitLife)
    const familyNews = familyYearlyNews(updatedFamily, relationships, newYil);
    updatedFamily = familyNews.family;
    let updatedRelationships = familyNews.relationships;
    for (const msg of familyNews.messages) {
      notifications = addNotification(notifications, msg, "yasam");
    }

    // Ebeveyn vefatında küçük miras
    for (const f of updatedFamily) {
      const wasAlive = family.find((x) => x.id === f.id);
      if (wasAlive && wasAlive.durum === "yasiyor" && f.durum === "oldu") {
        if (f.aileRolu === "anne" || f.aileRolu === "baba") {
          const miras = 15000 + Math.floor(Math.random() * 40000);
          updatedLife.para += miras;
          notifications = addNotification(
            notifications,
            `${f.isim} vefat etti. Sana ${miras.toLocaleString("tr-TR")} TL miras kaldı.`,
            "uyari"
          );
          journal = addJournal(
            journal,
            newYil,
            newYas,
            "Kayıp",
            `${f.isim} (${f.aileRolu}) hayata veda etti.`,
            "aile"
          );
        }
      }
    }

    // Yatırımlar sadece 18+ için fiyat güncellenir; çocuk portföyü olmamalı
    let updatedInvestments = investments;
    if (canInvest(newYas)) {
      updatedInvestments = investments.map((inv) => ({
        ...inv,
        mevcutFiyat: simulateMarketPrice(inv.mevcutFiyat),
      }));
    }

    let updatedLoans = loans;
    if (canTakeLoan(newYas) || loans.some((l) => l.aktif)) {
      updatedLoans = loans.map((loan) => {
        if (!loan.aktif) return loan;
        const yillikOdeme = loan.aylikOdeme * 12;
        const kalan = Math.max(0, loan.kalanBorc - yillikOdeme);
        updatedLife.para -= yillikOdeme;
        return { ...loan, kalanBorc: kalan, aktif: kalan > 0 };
      });
    }

    updatedLife.krediBorcu = updatedLoans.reduce((s, l) => s + l.kalanBorc, 0);

    if (canStartCompany(newYas)) {
      const companyIncome = state.companies.reduce((s, c) => s + c.gelir, 0);
      updatedLife.para += companyIncome;
    }

    let neighborhood = state.neighborhood
      ? neighborhoodYearTick(state.neighborhood)
      : createNeighborhood(updatedPlayer.sehir);
    if (neighborhood.sonOlay) {
      notifications = addNotification(notifications, neighborhood.sonOlay);
    }

    let school = state.school;
    if (newYas >= 6 && newYas <= 18) {
      school = school ? schoolYearTick(school, updatedPlayer.ozellikler.zeka) : createSchoolState(newYas);
    } else {
      school = null;
    }

    let crimeRelease = releaseIfDue(state.crime);
    let crime = crimeRelease.state;
    if (crimeRelease.mesaj) {
      notifications = addNotification(notifications, crimeRelease.mesaj, "uyari");
    }

    // Hapisteyken gelir yok, mutluluk düşer
    if (crime.tutuklu) {
      updatedPlayer.gelir = 0;
      updatedPlayer.meslek = "Mahkûm";
      updatedPlayer.mutluluk = clamp(updatedPlayer.mutluluk - 8);
      updatedPlayer.stres = clamp(updatedPlayer.stres + 10);
    }

    // Askerlik tick
    let lifeExtras = state.lifeExtras ?? createEmptyLifeExtras();
    const mil = tickMilitary(lifeExtras);
    lifeExtras = mil.extras;
    if (mil.mesaj) notifications = addNotification(notifications, mil.mesaj, "yasam");
    if (lifeExtras.askerlik?.durum === "aktif") {
      updatedPlayer.gelir = 9000;
      updatedPlayer.meslek = "Asker";
      updatedPlayer.stres = clamp(updatedPlayer.stres + 4);
    }

    // Hastalıklar
    let diseases = state.diseases ?? [];
    const disTick = tickDiseases(diseases);
    diseases = disTick.diseases;
    updatedPlayer.saglik = clamp(updatedPlayer.saglik + disTick.saglik);
    updatedPlayer.mutluluk = clamp(updatedPlayer.mutluluk + disTick.mutluluk);
    updatedPlayer.stres = clamp(updatedPlayer.stres + disTick.stres);
    for (const m of disTick.mesajlar) notifications = addNotification(notifications, m);
    const newDis = rollNewDisease(newYas, diseases);
    if (newDis) {
      diseases = [newDis, ...diseases];
      notifications = addNotification(notifications, `Teşhis: ${newDis.ad}`, "uyari");
      journal = addJournal(journal, newYil, newYas, "Hastalık", `${newDis.ad} teşhisi kondu.`, "saglik");
    }

    // Evcil hayvanlar
    let pets = state.pets ?? [];
    const petTick = tickPets(pets, newYil);
    pets = petTick.pets;
    updatedPlayer.mutluluk = clamp(updatedPlayer.mutluluk + petTick.mutlulukDelta);
    for (const m of petTick.mesajlar) notifications = addNotification(notifications, m, "yasam");

    // Hamilelik
    let pregnancy = state.pregnancy ?? null;
    const pregTick = tickPregnancy(pregnancy);
    pregnancy = pregTick.pregnancy;
    if (pregTick.dogum) {
      const spouse =
        updatedFamily.find((f) => f.id === updatedPlayer.esId) ??
        updatedFamily.find((f) =>
          updatedRelationships.some((r) => r.targetId === f.id && (r.tip === "es" || r.tip === "sevgili"))
        ) ??
        null;
      const child = createChild(updatedPlayer, spouse, updatedLife);
      updatedFamily = [...updatedFamily, child];
      updatedRelationships = [
        ...updatedRelationships,
        createChildRelationship(updatedPlayer, child, updatedLife),
      ];
      notifications = addNotification(notifications, `${child.isim} dünyaya geldi!`, "yasam");
      journal = addJournal(journal, newYil, newYas, "Doğum", `${child.isim} doğdu.`, "aile");
      lifeExtras = { ...lifeExtras, un: Math.min(100, lifeExtras.un + 1) };
    }

    // Gym üyeliği yıllık ücret
    if (lifeExtras.gymUyelik && !crime.tutuklu) {
      updatedLife.para -= 2400;
      updatedPlayer.saglik = clamp(updatedPlayer.saglik + 2);
    }

    // Kariyer yolu: her 3 yılda otomatik ilerleme şansı
    if (
      lifeExtras.kariyerYolu &&
      !crime.tutuklu &&
      lifeExtras.askerlik?.durum !== "aktif" &&
      newYas % 3 === 0 &&
      Math.random() < 0.45
    ) {
      const adv = advanceCareerTrack(lifeExtras);
      lifeExtras = adv.extras;
      if (adv.yeniMeslek) {
        updatedPlayer.meslek = adv.yeniMeslek;
        updatedPlayer.gelir = calculateSalary(
          adv.yeniMeslek,
          updatedPlayer.ozellikler.zeka,
          Math.max(0, newYas - 18),
          lifeExtras.un
        );
        if (adv.mesaj) notifications = addNotification(notifications, adv.mesaj, "yasam");
        if (["Ünlü Oyuncu", "Süperstar", "Milli Sporcu", "Efsane Sporcu", "CEO"].includes(adv.yeniMeslek)) {
          lifeExtras = { ...lifeExtras, un: Math.min(100, lifeExtras.un + 8) };
        }
      }
    }

    updatedPlayer.ehliyet = lifeExtras.ehliyet;
    updatedPlayer.un = lifeExtras.un;
    updatedPlayer.universiteBolumu = lifeExtras.universiteBolumu ?? undefined;

    if (newYas === 6) {
      journal = addJournal(journal, newYil, newYas, "Okul başladı", "İlkokul yılları başladı.", "egitim");
    }
    if (newYas === 18) {
      journal = addJournal(journal, newYil, newYas, "Reşit oldun", "Yasal yetişkinlik başladı.", "yasam");
    }

    const dead = checkPlayerDeath(updatedPlayer);
    if (dead) {
      const cause = pickDeathCause(newYas, diseases, updatedPlayer.saglik);
      updatedPlayer = {
        ...updatedPlayer,
        durum: "oldu",
        saglik: 0,
        olumNedeni: cause,
      };
      journal = addJournal(
        journal,
        newYil,
        newYas,
        "Vefat",
        `${updatedPlayer.isim} hayata veda etti. Sebep: ${cause}.`,
        "yasam"
      );
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
    for (const a of newlyUnlocked) {
      notifications = addNotification(notifications, `Başarım kazandın: ${a.ad}`, "basarim");
      if (state.userId && state.userId !== "local-user") {
        unlockAchievement(state.userId, life.id, a.id, newYil);
      }
    }

    const avgRel =
      updatedRelationships.length === 0
        ? 50
        : updatedRelationships.reduce((s, r) => s + r.puan, 0) / updatedRelationships.length;
    const score = calculateLifeScore({
      player: updatedPlayer,
      life: updatedLife,
      properties: state.properties,
      investments: updatedInvestments,
      companies: state.companies,
      achievements: updatedAchievements,
      avgRelationship: avgRel,
      neighborhoodItibar: neighborhood.itibar,
      sabika: crime.sabika,
    });

    if (dead) {
      submitScore({
        isim: updatedPlayer.isim,
        soyisim: updatedPlayer.soyisim,
        sehir: updatedPlayer.sehir,
        yas: updatedPlayer.yas,
        skor: score.toplam,
        yil: newYil,
      });
    }

    // Hikâye sürekliliği: bayraklar yıllık yan etki üretir
    let storyState = state.storyState ?? createEmptyStoryState();
    const storyTick = tickStoryYear(storyState, newYil);
    storyState = storyTick.state;
    if (storyTick.yillikEtkiler.length > 0) {
      const applied = applyEventEffects(updatedPlayer, updatedLife, storyTick.yillikEtkiler, newYas);
      updatedPlayer = applied.player;
      updatedLife = applied.life;
    }
    for (const msg of storyTick.mesajlar) {
      notifications = addNotification(notifications, msg, "yasam");
    }

    // Önce zincir olay (geçmiş seçim), sonra yaşam pop-up, yoksa rastgele
    let nextPrompt: LifePrompt | null = null;
    let nextEvent: GameEvent | null = null;
    let promptHistory = state.lifePromptHistory;

    if (!dead) {
      const follow = popDueFollowUp(storyState, newYil, newYas);
      storyState = follow.state;
      if (follow.event) {
        nextEvent = follow.event;
        notifications = addNotification(notifications, `Devam: ${follow.event.baslik}`, "yasam");
      } else {
        nextPrompt = pickLifePrompt({
          player: updatedPlayer,
          life: updatedLife,
          properties: state.properties,
          relationships: updatedRelationships,
          family: updatedFamily,
          aileDurumu: state.aileDurumu,
          triggeredIds: promptHistory,
        });
        if (nextPrompt) {
          promptHistory = [...promptHistory, nextPrompt.id].slice(-40);
          notifications = addNotification(notifications, nextPrompt.baslik, "yasam");
        } else {
          const recent = state.eventHistory.slice(0, 8).map((e) => e.baslik);
          nextEvent =
            getRandomEvent(ageGroup, newYas, recent, storyState.flags) ??
            getRandomEvent(ageGroup, newYas, [], storyState.flags);
        }
      }
    }

    set({
      player: updatedPlayer,
      life: updatedLife,
      family: updatedFamily,
      relationships: updatedRelationships,
      investments: updatedInvestments,
      loans: updatedLoans,
      achievements: updatedAchievements,
      npcMemories: updatedMemories,
      neighborhood,
      school,
      crime,
      journal,
      storyState,
      lifeExtras,
      pets,
      diseases,
      pregnancy,
      lifetimeScore: score.toplam,
      currentEvent: nextEvent,
      currentPrompt: nextPrompt,
      lifePromptHistory: promptHistory,
      isDead: dead,
      notifications: dead
        ? addNotification(notifications, `${updatedPlayer.isim} ${updatedPlayer.yas} yaşında vefat etti.`, "uyari")
        : notifications,
      activeTab: nextPrompt || nextEvent ? "hayat" : state.activeTab,
    });

    get().persist();
  },

  selectChoice: (choiceId) => {
    const state = get();
    const { player, life, currentEvent, eventHistory, relationships, journal } = state;
    if (!player || !life || !currentEvent) return;

    const choice = currentEvent.secenekler.find((c) => c.id === choiceId);
    if (!choice) return;

    let updatedPlayer = { ...player };
    let updatedLife = { ...life };
    let updatedRelationships = [...relationships];
    let notifications = state.notifications;

    if (choice.etkiler) {
      const applied = applyEventEffects(
        updatedPlayer,
        updatedLife,
        choice.etkiler,
        player.yas,
        currentEvent.kategori
      );
      updatedPlayer = applied.player;
      updatedLife = applied.life;
      for (const effect of choice.etkiler) {
        if (effect.tip === "iliski" && effect.hedefId) {
          updatedRelationships = updatedRelationships.map((r) =>
            r.targetId === effect.hedefId
              ? { ...r, puan: clamp(r.puan + effect.deger) }
              : r
          );
        }
      }
    }

    // Seçimin yan etkileri — sonraki yıllarda geri döner
    let storyState = state.storyState ?? createEmptyStoryState();
    const seeds = buildConsequencesFromChoice(
      currentEvent,
      choice,
      player.yas,
      life.mevcutYil
    );
    if (seeds.length > 0) {
      const appliedSeeds = applyConsequenceSeeds(storyState, seeds, life.mevcutYil);
      storyState = appliedSeeds.state;
      for (const msg of appliedSeeds.bildirimler) {
        notifications = addNotification(notifications, msg, "yasam");
      }
      for (const seed of seeds) {
        if (seed.aileIliskiDelta) {
          updatedRelationships = updatedRelationships.map((r) => {
            if (["anne", "baba", "kardes", "akraba"].includes(r.tip)) {
              return { ...r, puan: clamp(r.puan + seed.aileIliskiDelta!) };
            }
            return r;
          });
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

    let updatedJournal = addJournal(
      journal,
      life.mevcutYil,
      player.yas,
      currentEvent.baslik,
      choice.sonuc,
      currentEvent.kategori
    );

    if (seeds.length > 0) {
      const flagLabels = storyState.flags.map((f) => f.label).slice(0, 3).join(", ");
      updatedJournal = addJournal(
        updatedJournal,
        life.mevcutYil,
        player.yas,
        "Yan etkiler",
        flagLabels
          ? `Bu seçimin gölgesi devam ediyor: ${flagLabels}.`
          : "Bu seçimin sonuçları ileride geri dönebilir.",
        "yasam"
      );
    }

    set({
      player: updatedPlayer,
      life: updatedLife,
      relationships: updatedRelationships,
      currentEvent: null,
      eventHistory: [log, ...eventHistory],
      journal: updatedJournal,
      storyState,
      notifications,
    });

    get().persist();
  },

  resolvePrompt: (choiceId) => {
    const state = get();
    const { player, life, currentPrompt, journal, notifications, eventHistory } = state;
    if (!player || !life || !currentPrompt) return;

    const choice = currentPrompt.secenekler.find((c) => c.id === choiceId);
    if (!choice) return;

    let updatedPlayer = { ...player };
    let updatedLife = { ...life };
    let lifeExtras = state.lifeExtras ?? createEmptyLifeExtras();

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
                [effect.ozellik]: clamp(updatedPlayer.ozellikler[effect.ozellik] + effect.deger),
              };
            }
            break;
        }
      }
    }

    if (choice.eylem === "okula_git") {
      updatedPlayer.egitim = "ilkokul";
      updatedPlayer.meslek = "Öğrenci";
    }
    if (choice.eylem === "ise_basla") {
      updatedPlayer.meslek = updatedPlayer.meslek === "Öğrenci" || !updatedPlayer.meslek ? "Satış Temsilcisi" : updatedPlayer.meslek;
      updatedPlayer.gelir = calculateSalary(updatedPlayer.meslek, updatedPlayer.ozellikler.zeka, Math.max(0, player.yas - 18), lifeExtras.un);
    }
    if (choice.eylem === "emekli_ol") {
      updatedPlayer.meslek = "Emekli";
      updatedPlayer.gelir = Math.max(8000, Math.round((updatedPlayer.gelir || 15000) * 0.55));
    }
    if (choice.eylem === "ehliyet") {
      lifeExtras = { ...lifeExtras, ehliyet: true };
      updatedPlayer.ehliyet = true;
    }

    const log: EventLog = {
      id: createId(),
      lifeId: life.id,
      yil: life.mevcutYil,
      yas: player.yas,
      baslik: currentPrompt.baslik,
      aciklama: choice.sonuc,
      kategori: "yasam",
      createdAt: new Date().toISOString(),
    };

    const updatedJournal = addJournal(
      journal,
      life.mevcutYil,
      player.yas,
      currentPrompt.baslik,
      choice.sonuc,
      "yasam"
    );

    let nextNotifications = addNotification(notifications, choice.sonuc, "yasam");
    let nextTab = get().activeTab;
    if (choice.eylem === "ev_al_teklif") {
      nextNotifications = addNotification(
        nextNotifications,
        "Mülk sekmesinden ev bakabilirsin. Gerçekçi fiyatlar şehirine göre değişir.",
        "yasam"
      );
      nextTab = "mulk";
    }

    set({
      player: updatedPlayer,
      life: updatedLife,
      lifeExtras,
      currentPrompt: null,
      currentEvent: null,
      eventHistory: [log, ...eventHistory],
      journal: updatedJournal,
      notifications: nextNotifications,
      activeTab: nextTab,
    });
    get().persist();
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  relationshipAction: (targetId, action) => {
    const { relationships, player, life, family, notifications, npcMemories, actionCooldowns } = get();
    if (!player || !life) return;

    const allowed = checkActionAllowed(player.yas, targetId, action, life.mevcutYil, actionCooldowns);
    if (!allowed.ok) {
      set({ notifications: addNotification(notifications, allowed.reason ?? "Şu an yapılamaz.", "uyari") });
      return;
    }

    const rel = relationships.find((r) => r.targetId === targetId);
    if (!rel) return;
    const target = family.find((f) => f.id === targetId);

    const result = applyRelationshipAction(rel, action, player.yas);
    if (result.delta === 0 && result.mesaj.includes("genç")) {
      set({ notifications: addNotification(notifications, result.mesaj, "uyari") });
      return;
    }

    let updatedRels = relationships.map((r) =>
      r.id === rel.id
        ? {
            ...r,
            puan: result.puan,
            tip:
              action === "evlilik"
                ? ("es" as const)
                : action === "sevgili"
                  ? ("sevgili" as const)
                  : r.tip,
            romantik: action === "sevgili" || action === "evlilik" || r.romantik,
          }
        : r
    );

    let updatedFamily = [...family];
    let updatedPlayer = {
      ...player,
      mutluluk: clamp(player.mutluluk + (result.delta) * 0.15),
    };
    let newNotifications = addNotification(notifications, result.mesaj);
    let updatedMemories = [...npcMemories];
    const updatedCooldowns = updateCooldowns(actionCooldowns, targetId, action, life.mevcutYil);

    if (target) {
      const memory = recordPlayerActionMemory(
        target.id,
        result.mesaj,
        result.delta,
        life.mevcutYil,
        target
      );
      if (memory) updatedMemories = [...updatedMemories, memory];
    }

    if (action === "evlilik" && player.yas >= 18) {
      const spouse = createSpouse(player, life);
      const spouseRel = createSpouseRelationship(player, spouse, life);
      updatedFamily.push(spouse);
      updatedRels.push(spouseRel);
      updatedPlayer = { ...updatedPlayer, esId: spouse.id };
      newNotifications = addNotification(newNotifications, `${spouse.isim} ile evlendin!`, "basarim");
    }

    if (action === "cocuk" && player.yas >= 18) {
      const extras = get();
      if (extras.pregnancy) {
        newNotifications = addNotification(newNotifications, "Zaten bir hamilelik süreci var.", "uyari");
      } else {
        const spouse = updatedFamily.find((f) => f.id === player.esId);
        const partnerRel = updatedRels.find((r) => r.tip === "es" || r.tip === "sevgili");
        const partner =
          spouse ??
          updatedFamily.find((f) => f.id === partnerRel?.targetId) ??
          null;
        if (!partner) {
          newNotifications = addNotification(newNotifications, "Çocuk için partner gerekli.", "uyari");
        } else if (!canGetPregnant(player.yas, true, false) && player.cinsiyet === "erkek" && partner.cinsiyet === "erkek") {
          // same-sex: adoption style instant via try later
          const child = createChild(player, partner, life);
          const childRel = createChildRelationship(player, child, life);
          updatedFamily.push(child);
          updatedRels.push(childRel);
          newNotifications = addNotification(newNotifications, `${child.isim} (evlat edinme/doğum) ailenize katıldı!`, "basarim");
        } else {
          set({
            pregnancy: startPregnancy(partner.id, partner.isim),
            relationships: updatedRels,
            family: updatedFamily,
            player: updatedPlayer,
            notifications: addNotification(newNotifications, `Hamilelik başladı (${partner.isim}). Doğum gelecek yıl.`, "yasam"),
            npcMemories: updatedMemories,
            actionCooldowns: updatedCooldowns,
          });
          get().persist();
          return;
        }
      }
    }

    set({
      relationships: updatedRels,
      family: updatedFamily,
      player: updatedPlayer,
      notifications: newNotifications,
      npcMemories: updatedMemories,
      actionCooldowns: updatedCooldowns,
    });
    get().persist();
  },

  buyProperty: (propertyData) => {
    const { life, properties, notifications, player, lifeExtras } = get();
    if (!life || !player) return;

    if (propertyData.tip === "ev" && !canBuyHome(player.yas)) {
      set({ notifications: addNotification(notifications, getAgeBlockedMessage(player.yas, "ev"), "uyari") });
      return;
    }
    if (propertyData.tip === "arac") {
      if (!canBuyVehicle(player.yas, propertyData.aracTipi)) {
        set({ notifications: addNotification(notifications, getAgeBlockedMessage(player.yas, "arac"), "uyari") });
        return;
      }
      if (!(lifeExtras?.ehliyet || player.ehliyet)) {
        set({
          notifications: addNotification(
            notifications,
            "Araç almak için ehliyetin olmalı. Yaşam sekmesinden ehliyet al.",
            "uyari"
          ),
        });
        return;
      }
    }

    const mult = cityCostMultiplier(player.sehir);
    const cost = Math.floor(
      (propertyData.satinAlindi ? propertyData.deger : propertyData.kira * 12) * mult
    );
    if (life.para < cost) {
      set({ notifications: addNotification(notifications, "Yeterli paranız yok.", "uyari") });
      return;
    }

    const property: Property = {
      ...propertyData,
      id: createId(),
      lifeId: life.id,
      deger: Math.floor(propertyData.deger * mult),
    };

    set({
      life: {
        ...life,
        para: life.para - cost,
        evId: property.tip === "ev" ? property.id : life.evId,
        aracId: property.tip === "arac" ? property.id : life.aracId,
      },
      properties: [...properties, property],
      notifications: addNotification(notifications, `${property.ad} alındı.`),
    });
    get().persist();
  },

  buyInvestment: (tip, sembol, miktar, fiyat) => {
    const { life, investments, notifications, player } = get();
    if (!life || !player) return;

    if (!canInvest(player.yas)) {
      set({ notifications: addNotification(notifications, getAgeBlockedMessage(player.yas, "yatirim"), "uyari") });
      return;
    }

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
    const { life, loans, notifications, player } = get();
    if (!life || !player) return;

    if (!canTakeLoan(player.yas)) {
      set({ notifications: addNotification(notifications, getAgeBlockedMessage(player.yas, "kredi"), "uyari") });
      return;
    }

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
    if (!life || !player) return;

    if (!canStartCompany(player.yas)) {
      set({ notifications: addNotification(notifications, getAgeBlockedMessage(player.yas, "sirket"), "uyari") });
      return;
    }

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
    // Çocuk doktor/beslenme aile karşılar gibi küçük maliyet
    const cost = player.yas < 16 ? Math.floor(costs[tip] * 0.2) : costs[tip];
    if (life.para < cost && tip !== "dinlenme") {
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
      life: { ...life, para: life.para - (tip === "dinlenme" ? 0 : cost) },
      notifications: addNotification(notifications, messages[tip]),
    });
    get().persist();
  },

  study: (seviye) => {
    const { player, notifications } = get();
    if (!player) return;

    if ((seviye === "universite" || seviye === "yuksek_lisans" || seviye === "doktora") && !canStudyUniversity(player.yas)) {
      set({ notifications: addNotification(notifications, "Üniversite için en az 17 yaşında olmalısın.", "uyari") });
      return;
    }

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
    const { player, life, notifications, lifeExtras, crime } = get();
    if (!player || !life) return;

    if (crime.tutuklu) {
      set({ notifications: addNotification(notifications, "Hapisteyken işe giremezsin.", "uyari") });
      return;
    }
    if (lifeExtras.askerlik?.durum === "aktif") {
      set({ notifications: addNotification(notifications, "Askerdeyken sivil işe giremezsin.", "uyari") });
      return;
    }
    if (!canWork(player.yas)) {
      set({ notifications: addNotification(notifications, getAgeBlockedMessage(player.yas, "is"), "uyari") });
      return;
    }

    const maas = calculateSalary(meslek, player.ozellikler.zeka, Math.max(0, player.yas - 18), lifeExtras.un);

    set({
      player: { ...player, meslek, gelir: maas },
      notifications: addNotification(notifications, `${meslek} olarak işe başladın!`),
    });
    get().persist();
  },

  continueAsChild: (childId) => {
    const { family, player, life, relationships, properties, investments, companies, loans, journal } = get();
    if (!player || !life) return;

    const isChild = relationships.some((r) => r.targetId === childId && r.tip === "cocuk");
    const child = family.find((c) => c.id === childId);
    if (!child || child.durum === "oldu" || !isChild) {
      set({
        notifications: addNotification(get().notifications, "Sadece kendi çocuğunla devam edebilirsin.", "uyari"),
      });
      return;
    }

    // Miras: net varlıkların bir kısmı çocuğa geçer
    const propertyValue = properties.reduce((s, p) => s + (p.satinAlindi ? p.deger : 0), 0);
    const invValue = investments.reduce((s, i) => s + i.miktar * i.mevcutFiyat, 0);
    const companyValue = companies.reduce((s, c) => s + c.deger, 0);
    const net =
      life.para + life.bankaBakiyesi + propertyValue + invValue + companyValue - life.krediBorcu;
    const inheritance = Math.max(0, Math.floor(net * 0.55));

    const newPlayer: Character = {
      ...child,
      isPlayer: true,
      updatedAt: new Date().toISOString(),
    };

    const updatedFamily = family
      .filter((c) => c.id !== childId)
      .map((c) => (c.id === player.id ? { ...player, isPlayer: false, durum: "oldu" as const } : c));

    const childRels = relationships
      .filter((r) => r.targetId !== childId)
      .map((r) =>
        r.characterId === player.id
          ? { ...r, characterId: childId }
          : r
      );

    const newLife: Life = {
      ...life,
      para: inheritance,
      bankaBakiyesi: Math.floor(inheritance * 0.2),
      krediBorcu: 0,
      evId: null,
      aracId: null,
      updatedAt: new Date().toISOString(),
    };

    const updatedJournal = addJournal(
      journal,
      life.mevcutYil,
      newPlayer.yas,
      "Miras",
      `${player.isim}'den kalan mirasla ${newPlayer.isim} hayata devam ediyor.`,
      "yasam"
    );

    set({
      player: newPlayer,
      life: newLife,
      family: updatedFamily,
      relationships: childRels,
      properties: [],
      investments: [],
      companies: [],
      loans: [],
      journal: updatedJournal,
      school: createSchoolState(newPlayer.yas),
      storyState: createEmptyStoryState(),
      lifePromptHistory: [],
      lifeExtras: createEmptyLifeExtras(),
      pets: [],
      diseases: [],
      pregnancy: null,
      datingCandidates: [],
      isDead: false,
      currentEvent: getRandomEvent(
        getAgeGroup(newPlayer.yas),
        newPlayer.yas,
        journal.slice(0, 5).map((j) => j.baslik)
      ),
      notifications: addNotification(
        [],
        `${newPlayer.isim} olarak devam ediyorsun. Miras: ${inheritance.toLocaleString("tr-TR")} TL.`
      ),
      activeTab: "hayat",
    });
    get().persist();
  },

  dismissNotification: (id) => {
    set({ notifications: get().notifications.filter((n) => n.id !== id) });
  },

  socialActivity: (activityId) => {
    const { player, life, notifications } = get();
    if (!player || !life) return;

    const activity = SOCIAL_ACTIVITIES.find((a) => a.id === activityId);
    if (!activity || player.yas < activity.minYas) {
      set({ notifications: addNotification(notifications, "Bu aktivite için yaşın uygun değil.", "uyari") });
      return;
    }

    if (life.para < activity.maliyet) {
      set({ notifications: addNotification(notifications, "Yeterli paranız yok.", "uyari") });
      return;
    }

    set({
      player: {
        ...player,
        mutluluk: clamp(player.mutluluk + activity.mutluluk),
        ozellikler: {
          ...player.ozellikler,
          sosyallik: clamp(player.ozellikler.sosyallik + activity.sosyallik),
        },
      },
      life: { ...life, para: life.para - activity.maliyet },
      notifications: addNotification(notifications, activity.aciklama),
    });
    get().persist();
  },

  payTax: () => {
    const { player, life, notifications } = get();
    if (!player || !life || !player.gelir) return;
    if (!canAccessFinance(player.yas)) {
      set({ notifications: addNotification(notifications, getAgeBlockedMessage(player.yas, "finans"), "uyari") });
      return;
    }

    const tax = calculateTax(player.gelir * 12);
    if (life.para < tax) {
      set({ notifications: addNotification(notifications, "Vergi ödemek için yeterli para yok.", "uyari") });
      return;
    }

    set({
      life: { ...life, para: life.para - tax },
      notifications: addNotification(notifications, `${tax.toLocaleString("tr-TR")} TL vergi ödendi.`),
    });
    get().persist();
  },

  hireEmployee: (companyId) => {
    const { companies, life, notifications, player } = get();
    if (!life || !player || !canStartCompany(player.yas)) return;

    const company = companies.find((c) => c.id === companyId);
    if (!company) return;

    const maliyet = 5000;
    if (life.para < maliyet) {
      set({ notifications: addNotification(notifications, "Çalışan almak için 5.000 TL gerekli.", "uyari") });
      return;
    }

    const updated = companies.map((c) =>
      c.id === companyId
        ? { ...c, calisanSayisi: c.calisanSayisi + 1, gelir: c.gelir + 3000 }
        : c
    );

    set({
      companies: updated,
      life: { ...life, para: life.para - maliyet },
      notifications: addNotification(notifications, `${company.ad} şirketine yeni çalışan alındı.`),
    });
    get().persist();
  },

  buyDecoration: (decorationId) => {
    const { life, player, decorations, notifications } = get();
    if (!life || !player) return;
    if (player.yas < 16) {
      set({ notifications: addNotification(notifications, "Dekorasyon için en az 16 yaşında olmalısın.", "uyari") });
      return;
    }

    if (decorations.includes(decorationId)) {
      set({ notifications: addNotification(notifications, "Bu dekorasyon zaten var.", "uyari") });
      return;
    }

    const item = DECORATION_CATALOG.find((d) => d.id === decorationId);
    if (!item) return;

    if (life.para < item.fiyat) {
      set({ notifications: addNotification(notifications, "Yeterli paranız yok.", "uyari") });
      return;
    }

    set({
      life: { ...life, para: life.para - item.fiyat },
      decorations: [...decorations, item.id],
      player: { ...player, mutluluk: clamp(player.mutluluk + item.mutluluk) },
      notifications: addNotification(notifications, item.aciklama),
    });
    get().persist();
  },

  doGig: (gigId) => {
    const { player, life, properties, notifications, gigCooldowns: rawCd } = get();
    if (!player || !life) return;
    const gigCooldowns = rawCd ?? [];
    if (!canDoSideGig(player.yas)) {
      set({ notifications: addNotification(notifications, getAgeBlockedMessage(player.yas, "ek_is"), "uyari") });
      return;
    }

    const gig = MONEY_GIGS.find((g) => g.id === gigId);
    if (!gig) return;
    if (player.yas < gig.minYas || (gig.maxYas !== undefined && player.yas > gig.maxYas)) {
      set({ notifications: addNotification(notifications, "Bu iş için yaşın uygun değil.", "uyari") });
      return;
    }

    const cd = gigCooldowns.find((c) => c.gigId === gigId);
    if (cd && cd.yil === life.mevcutYil && cd.sayac >= gig.maxPerYear) {
      set({
        notifications: addNotification(
          notifications,
          `Bu yıl "${gig.ad}" limitine ulaştın (${gig.maxPerYear}x).`,
          "uyari"
        ),
      });
      return;
    }
    if (life.para < gig.maliyet) {
      set({ notifications: addNotification(notifications, "Başlangıç maliyeti için paran yetmiyor.", "uyari") });
      return;
    }

    const hasHome = properties.some((p) => p.tip === "ev" && p.satinAlindi);
    const result = rollGigEarnings(
      gig,
      player.ozellikler.zeka,
      player.ozellikler.sosyallik,
      hasHome,
      life.bankaBakiyesi,
      player.gelir
    );

    if (result.kazanc === 0 && gig.id !== "bagis-topla" && !result.mesaj.includes("TL")) {
      set({ notifications: addNotification(notifications, result.mesaj, "uyari") });
      return;
    }

    let updatedCooldowns = [...gigCooldowns];
    if (!cd) {
      updatedCooldowns.push({ gigId, yil: life.mevcutYil, sayac: 1 });
    } else if (cd.yil === life.mevcutYil) {
      updatedCooldowns = updatedCooldowns.map((c) =>
        c.gigId === gigId ? { ...c, sayac: c.sayac + 1 } : c
      );
    } else {
      updatedCooldowns = updatedCooldowns.map((c) =>
        c.gigId === gigId ? { ...c, yil: life.mevcutYil, sayac: 1 } : c
      );
    }

    const mutlulukDelta = gig.id === "bagis-topla" ? 6 : result.kazanc > 5000 ? 3 : result.kazanc > 0 ? 1 : -1;

    set({
      life: { ...life, para: life.para + result.kazanc },
      player: {
        ...player,
        stres: clamp(player.stres + gig.stres),
        saglik: clamp(player.saglik + (gig.saglik ?? 0)),
        mutluluk: clamp(player.mutluluk + mutlulukDelta),
      },
      gigCooldowns: updatedCooldowns,
      notifications: addNotification(notifications, result.mesaj),
    });
    get().persist();
  },

  gamble: (gameId, bahis) => {
    const { player, life, notifications } = get();
    if (!player || !life) return;

    const game = GAMBLE_GAMES.find((g) => g.id === gameId);
    if (!game) return;
    if (player.yas < game.minYas) {
      set({
        notifications: addNotification(
          notifications,
          game.minYas >= 21
            ? "Bu oyun için en az 21 yaşında olmalısın."
            : getAgeBlockedMessage(player.yas, "kumar"),
          "uyari"
        ),
      });
      return;
    }
    if (!canGamble(player.yas) && game.minYas >= 18) {
      set({ notifications: addNotification(notifications, getAgeBlockedMessage(player.yas, "kumar"), "uyari") });
      return;
    }

    const bet = Math.max(game.minBahis, Math.min(game.maxBahis, bahis));
    if (life.para < bet) {
      set({ notifications: addNotification(notifications, "Bahis için yeterli paran yok.", "uyari") });
      return;
    }

    const result = resolveGamble(game, bet, player.ozellikler.zeka);
    set({
      life: { ...life, para: life.para + result.net },
      player: {
        ...player,
        stres: clamp(player.stres + (result.kazandi ? 2 : 5)),
        mutluluk: clamp(player.mutluluk + (result.kazandi ? 4 : -3)),
      },
      notifications: addNotification(notifications, result.mesaj, result.kazandi ? "bilgi" : "uyari"),
    });
    get().persist();
  },

  helpNeighbor: (neighborId) => {
    const { neighborhood, player, notifications } = get();
    if (!neighborhood || !player || player.yas < 6) return;
    const next = helpNeighborFn(neighborhood, neighborId);
    set({
      neighborhood: next,
      player: { ...player, mutluluk: clamp(player.mutluluk + 2) },
      notifications: addNotification(notifications, "Komşuna yardım ettin."),
    });
    get().persist();
  },

  schoolStudy: (hard) => {
    const { school, player, notifications } = get();
    if (!school || !player) return;
    const next = hard ? studyHarder(school) : skipStudy(school);
    set({
      school: next,
      player: hard
        ? {
            ...player,
            stres: clamp(player.stres + 3),
            ozellikler: { ...player.ozellikler, zeka: clamp(player.ozellikler.zeka + 1) },
          }
        : { ...player, mutluluk: clamp(player.mutluluk + 2) },
      notifications: addNotification(
        notifications,
        hard ? "Bu yıl daha çok çalıştın." : "Dersleri biraz erteledin."
      ),
    });
    get().persist();
  },

  attemptCrimeAction: (crimeId) => {
    const { crime, player, life, notifications, neighborhood } = get();
    if (!player || !life) return;
    const result = attemptCrime(crime, crimeId, life.mevcutYil, player.yas);
    set({
      crime: result.state,
      life: { ...life, para: life.para + result.paraDelta },
      player: {
        ...player,
        stres: clamp(player.stres + (result.yakalandi ? 12 : 4)),
        mutluluk: clamp(player.mutluluk + (result.yakalandi ? -8 : 2)),
      },
      neighborhood: neighborhood
        ? {
            ...neighborhood,
            itibar: Math.max(0, neighborhood.itibar - (result.yakalandi ? 8 : 1)),
          }
        : neighborhood,
      notifications: addNotification(notifications, result.mesaj, result.yakalandi ? "uyari" : "bilgi"),
    });
    get().persist();
  },

  setPoliticalLean: (lean) => {
    const { politics } = get();
    set({ politics: setLean(politics, lean) });
    get().persist();
  },

  castVote: () => {
    const { politics, player, life, notifications } = get();
    if (!player || !life) return;
    const result = vote(politics, life.mevcutYil, player.yas);
    set({
      politics: result.state,
      notifications: addNotification(notifications, result.mesaj, result.mesaj.includes("18") ? "uyari" : "bilgi"),
    });
    get().persist();
  },

  joinPoliticalParty: () => {
    const { politics, player, notifications } = get();
    if (!player) return;
    const result = joinParty(politics, player.yas);
    set({
      politics: result.state,
      notifications: addNotification(notifications, result.mesaj),
    });
    get().persist();
  },

  setReligionBelief: (inanc) => {
    set({ religion: setBelief(get().religion, inanc) });
    get().persist();
  },

  setReligionPractice: (pratik) => {
    set({ religion: setPractice(get().religion, pratik) });
    get().persist();
  },

  worshipAction: () => {
    const { religion, player, notifications } = get();
    if (!player) return;
    const result = worship(religion);
    set({
      religion: result.state,
      player: {
        ...player,
        mutluluk: clamp(player.mutluluk + result.mutluluk),
        stres: clamp(player.stres + result.stres),
      },
      notifications: addNotification(notifications, "İçsel bir dinginlik hissettin."),
    });
    get().persist();
  },

  startHobbyAction: (hobbyId) => {
    const { hobbies, player, life, notifications } = get();
    if (!player || !life) return;
    const hobby = startHobby(hobbyId, player.yas);
    if (!hobby) {
      set({ notifications: addNotification(notifications, "Bu hobi için yaşın uygun değil.", "uyari") });
      return;
    }
    if (life.para < hobby.maliyet) {
      set({ notifications: addNotification(notifications, "Yeterli paranız yok.", "uyari") });
      return;
    }
    set({
      hobbies: [...hobbies, hobby],
      life: { ...life, para: life.para - hobby.maliyet },
      notifications: addNotification(notifications, `${hobby.ad} hobisine başladın.`),
    });
    get().persist();
  },

  practiceHobbyAction: (hobbyId) => {
    const { hobbies, player, notifications } = get();
    if (!player) return;
    const updated = hobbies.map((h) => (h.id === hobbyId ? practiceHobby(h) : h));
    const hobby = updated.find((h) => h.id === hobbyId);
    if (!hobby) return;
    set({
      hobbies: updated,
      player: {
        ...player,
        mutluluk: clamp(player.mutluluk + hobby.mutluluk),
        saglik: clamp(player.saglik + (hobby.saglik ?? 0)),
        ozellikler: {
          ...player.ozellikler,
          zeka: clamp(player.ozellikler.zeka + (hobby.zeka ?? 0)),
          sosyallik: clamp(player.ozellikler.sosyallik + (hobby.sosyallik ?? 0)),
        },
      },
      notifications: addNotification(notifications, `${hobby.ad} çalıştın.`),
    });
    get().persist();
  },

  getDriversLicense: () => {
    const { player, life, lifeExtras, notifications, crime } = get();
    if (!player || !life) return;
    if (crime.tutuklu) {
      set({ notifications: addNotification(notifications, "Hapisteyken ehliyet alamazsın.", "uyari") });
      return;
    }
    if (player.yas < 18) {
      set({ notifications: addNotification(notifications, "Ehliyet için en az 18 yaşında olmalısın.", "uyari") });
      return;
    }
    if (lifeExtras.ehliyet) {
      set({ notifications: addNotification(notifications, "Zaten ehliyetin var.") });
      return;
    }
    if (life.para < 3500) {
      set({ notifications: addNotification(notifications, "Ehliyet kursu 3500 TL tutuyor.", "uyari") });
      return;
    }
    set({
      life: { ...life, para: life.para - 3500 },
      lifeExtras: { ...lifeExtras, ehliyet: true },
      player: { ...player, ehliyet: true },
      notifications: addNotification(notifications, "Ehliyetini aldın!", "yasam"),
    });
    get().persist();
  },

  moveCity: (sehir) => {
    const { player, life, lifeExtras, notifications, crime } = get();
    if (!player || !life) return;
    if (crime.tutuklu || lifeExtras.askerlik?.durum === "aktif") {
      set({ notifications: addNotification(notifications, "Şu an taşınamazsın.", "uyari") });
      return;
    }
    if (player.yas < 16) {
      set({ notifications: addNotification(notifications, "Tek başına taşınmak için en az 16 yaşında olmalısın.", "uyari") });
      return;
    }
    if (player.sehir === sehir) return;
    const cost = 8000 + Math.floor(cityCostMultiplier(sehir) * 4000);
    if (life.para < cost) {
      set({ notifications: addNotification(notifications, `Taşınma maliyeti: ${cost.toLocaleString("tr-TR")} TL`, "uyari") });
      return;
    }
    set({
      player: { ...player, sehir },
      life: { ...life, para: life.para - cost },
      neighborhood: createNeighborhood(sehir),
      notifications: addNotification(notifications, `${sehir}'e taşındın.`, "yasam"),
    });
    get().persist();
  },

  startMilitaryService: () => {
    const { player, lifeExtras, notifications, crime, life } = get();
    if (!player || !life) return;
    if (crime.tutuklu) {
      set({ notifications: addNotification(notifications, "Hapisteyken askere gidemezsin.", "uyari") });
      return;
    }
    if (!canStartMilitary(player.yas, player.cinsiyet, lifeExtras)) {
      set({ notifications: addNotification(notifications, "Askerlik için uygun değilsin veya tamamladın.", "uyari") });
      return;
    }
    set({
      lifeExtras: startMilitary(lifeExtras, life.mevcutYil),
      player: { ...player, meslek: "Asker", gelir: 9000 },
      notifications: addNotification(notifications, "Askerlik hizmetin başladı.", "yasam"),
    });
    get().persist();
  },

  chooseUniversityMajor: (bolumId) => {
    const { player, lifeExtras, notifications } = get();
    if (!player) return;
    if (player.yas < 17) {
      set({ notifications: addNotification(notifications, "Bölüm seçmek için en az 17 yaşında olmalısın.", "uyari") });
      return;
    }
    const next = setUniversityMajor(lifeExtras, bolumId);
    const bolum = UNIVERSITE_BOLUMLERI.find((b) => b.id === bolumId);
    set({
      lifeExtras: next,
      player: {
        ...player,
        egitim: ["universite", "yuksek_lisans", "doktora"].includes(player.egitim)
          ? player.egitim
          : "universite",
        universiteBolumu: next.universiteBolumu ?? undefined,
        meslek: bolum?.kariyer[0] ?? player.meslek,
        gelir: bolum
          ? calculateSalary(bolum.kariyer[0], player.ozellikler.zeka, 0, next.un)
          : player.gelir,
      },
      notifications: addNotification(notifications, `${next.universiteBolumu} bölümünü seçtin.`, "yasam"),
    });
    get().persist();
  },

  advanceCareer: () => {
    const { player, lifeExtras, notifications, crime } = get();
    if (!player) return;
    if (crime.tutuklu || lifeExtras.askerlik?.durum === "aktif") {
      set({ notifications: addNotification(notifications, "Şu an kariyer ilerletilemez.", "uyari") });
      return;
    }
    const adv = advanceCareerTrack(lifeExtras);
    if (!adv.yeniMeslek) {
      set({ notifications: addNotification(notifications, "Daha fazla ilerleme yok veya yol seçilmedi.", "uyari") });
      return;
    }
    let extras = adv.extras;
    if (["Ünlü Oyuncu", "Süperstar", "Milli Sporcu", "Efsane Sporcu"].includes(adv.yeniMeslek)) {
      extras = { ...extras, un: Math.min(100, extras.un + 10) };
    }
    set({
      lifeExtras: extras,
      player: {
        ...player,
        meslek: adv.yeniMeslek,
        gelir: calculateSalary(adv.yeniMeslek, player.ozellikler.zeka, Math.max(0, player.yas - 18), extras.un),
        un: extras.un,
      },
      notifications: addNotification(notifications, adv.mesaj ?? "Kariyer ilerledi.", "yasam"),
    });
    get().persist();
  },

  adoptPetAction: (tur) => {
    const { player, life, pets, notifications } = get();
    if (!player || !life) return;
    if (player.yas < 8) {
      set({ notifications: addNotification(notifications, "Evcil hayvan için en az 8 yaşında olmalısın.", "uyari") });
      return;
    }
    if (pets.length >= 3) {
      set({ notifications: addNotification(notifications, "En fazla 3 evcil hayvan bakabilirsin.", "uyari") });
      return;
    }
    const tip = PET_TYPES.find((t) => t.tur === tur);
    if (!tip) return;
    if (life.para < tip.maliyet) {
      set({ notifications: addNotification(notifications, "Yeterli paranız yok.", "uyari") });
      return;
    }
    const pet = adoptPet(tur, life.mevcutYil);
    set({
      pets: [...pets, pet],
      life: { ...life, para: life.para - tip.maliyet },
      player: { ...player, mutluluk: clamp(player.mutluluk + 6) },
      notifications: addNotification(notifications, `${pet.isim} (${tip.ad}) ailenize katıldı!`, "yasam"),
    });
    get().persist();
  },

  carePetAction: (petId) => {
    const { pets, life, player, notifications } = get();
    if (!life || !player) return;
    if (life.para < 300) {
      set({ notifications: addNotification(notifications, "Bakım maliyeti 300 TL.", "uyari") });
      return;
    }
    set({
      pets: pets.map((p) => (p.id === petId ? carePet(p, life.mevcutYil) : p)),
      life: { ...life, para: life.para - 300 },
      player: { ...player, mutluluk: clamp(player.mutluluk + 3) },
      notifications: addNotification(notifications, "Evcil hayvanına baktın."),
    });
    get().persist();
  },

  treatDiseaseAction: (diseaseId) => {
    const { diseases, life, notifications } = get();
    if (!life) return;
    const result = treatDisease(diseases, diseaseId);
    if (life.para < result.maliyet) {
      set({ notifications: addNotification(notifications, `Tedavi ${result.maliyet.toLocaleString("tr-TR")} TL.`, "uyari") });
      return;
    }
    set({
      diseases: result.diseases,
      life: { ...life, para: life.para - result.maliyet },
      notifications: addNotification(notifications, result.mesaj, "yasam"),
    });
    get().persist();
  },

  therapyAction: () => {
    const { player, life, lifeExtras, notifications } = get();
    if (!player || !life) return;
    if (player.yas < 12) {
      set({ notifications: addNotification(notifications, "Terapi için en az 12 yaşında olmalısın.", "uyari") });
      return;
    }
    if (lifeExtras.sonTerapiYil === life.mevcutYil) {
      set({ notifications: addNotification(notifications, "Bu yıl zaten terapiye gittin.", "uyari") });
      return;
    }
    if (life.para < 2000) {
      set({ notifications: addNotification(notifications, "Terapi seansı 2000 TL.", "uyari") });
      return;
    }
    set({
      life: { ...life, para: life.para - 2000 },
      lifeExtras: { ...lifeExtras, sonTerapiYil: life.mevcutYil },
      player: {
        ...player,
        psikoloji: clamp(player.psikoloji + 12),
        stres: clamp(player.stres - 10),
        mutluluk: clamp(player.mutluluk + 5),
      },
      notifications: addNotification(notifications, "Terapi iyi geldi."),
    });
    get().persist();
  },

  plasticSurgeryAction: () => {
    const { player, life, lifeExtras, notifications } = get();
    if (!player || !life) return;
    if (player.yas < 18) {
      set({ notifications: addNotification(notifications, "Estetik için 18+ olmalısın.", "uyari") });
      return;
    }
    if (lifeExtras.sonEstetikYil === life.mevcutYil) {
      set({ notifications: addNotification(notifications, "Bu yıl zaten estetik yaptırdın.", "uyari") });
      return;
    }
    if (life.para < 25000) {
      set({ notifications: addNotification(notifications, "Estetik operasyon 25.000 TL.", "uyari") });
      return;
    }
    set({
      life: { ...life, para: life.para - 25000 },
      lifeExtras: {
        ...lifeExtras,
        sonEstetikYil: life.mevcutYil,
        un: Math.min(100, lifeExtras.un + 3),
      },
      player: {
        ...player,
        sacRengi: SAC_RENKLERI[Math.floor(Math.random() * SAC_RENKLERI.length)],
        gozRengi: GOZ_RENKLERI[Math.floor(Math.random() * GOZ_RENKLERI.length)],
        tenRengi: TEN_RENKLERI[Math.floor(Math.random() * TEN_RENKLERI.length)],
        mutluluk: clamp(player.mutluluk + 8),
        saglik: clamp(player.saglik - 4),
        un: Math.min(100, (player.un ?? 0) + 3),
      },
      notifications: addNotification(notifications, "Estetik operasyon tamamlandı. Görünümün değişti.", "yasam"),
    });
    get().persist();
  },

  joinGym: () => {
    const { player, life, lifeExtras, notifications } = get();
    if (!player || !life) return;
    if (player.yas < 14) {
      set({ notifications: addNotification(notifications, "Spor salonu için en az 14 yaşında olmalısın.", "uyari") });
      return;
    }
    if (lifeExtras.gymUyelik) {
      set({ notifications: addNotification(notifications, "Zaten üyesin.") });
      return;
    }
    if (life.para < 1500) {
      set({ notifications: addNotification(notifications, "Üyelik giriş ücreti 1500 TL.", "uyari") });
      return;
    }
    set({
      life: { ...life, para: life.para - 1500 },
      lifeExtras: { ...lifeExtras, gymUyelik: true },
      notifications: addNotification(notifications, "Spor salonuna üye oldun. Yıllık aidat kesilir."),
    });
    get().persist();
  },

  gymWorkout: () => {
    const { player, lifeExtras, notifications } = get();
    if (!player) return;
    if (!lifeExtras.gymUyelik) {
      set({ notifications: addNotification(notifications, "Önce spor salonuna üye ol.", "uyari") });
      return;
    }
    set({
      player: {
        ...player,
        saglik: clamp(player.saglik + 5),
        stres: clamp(player.stres - 4),
        kilo: Math.max(40, player.kilo - 1),
      },
      notifications: addNotification(notifications, "Antrenman yaptın."),
    });
    get().persist();
  },

  refreshDatingPool: () => {
    const { player, notifications } = get();
    if (!player || player.yas < 16) {
      set({ notifications: addNotification(notifications, "Flört uygulaması 16+.", "uyari") });
      return;
    }
    set({
      datingCandidates: generateDatingCandidates(player),
      notifications: addNotification(notifications, "Yeni eşleşmeler yüklendi."),
    });
  },

  dateCandidate: (candidateId) => {
    const { player, family, relationships, datingCandidates, life, notifications } = get();
    if (!player || !life) return;
    const cand = datingCandidates.find((c) => c.id === candidateId);
    if (!cand) return;
    const hasPartner = relationships.some((r) => r.tip === "es" || r.tip === "sevgili");
    if (hasPartner) {
      set({ notifications: addNotification(notifications, "Zaten bir ilişkin var.", "uyari") });
      return;
    }
    const npc: Character = {
      id: cand.id,
      userId: player.userId,
      lifeId: life.id,
      isim: cand.isim,
      soyisim: cand.soyisim,
      yas: cand.yas,
      dogumYili: life.mevcutYil - cand.yas,
      cinsiyet: cand.cinsiyet,
      meslek: cand.meslek,
      gelir: 10000,
      ozellikler: { ...player.ozellikler },
      saglik: 75,
      mutluluk: 70,
      stres: 20,
      uyku: 70,
      beslenme: 70,
      kilo: 65,
      psikoloji: 70,
      egitim: "universite",
      durum: "yasiyor",
      anneId: null,
      babaId: null,
      esId: null,
      sehir: player.sehir,
      ulke: player.ulke,
      isPlayer: false,
      aileRolu: "diger",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const rel = {
      id: createId(),
      lifeId: life.id,
      characterId: player.id,
      targetId: npc.id,
      tip: "sevgili" as const,
      puan: cand.puan,
      romantik: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({
      family: [...family, npc],
      relationships: [...relationships, rel],
      datingCandidates: datingCandidates.filter((c) => c.id !== candidateId),
      player: { ...player, mutluluk: clamp(player.mutluluk + 5) },
      notifications: addNotification(notifications, `${cand.isim} ile çıkmaya başladın!`, "yasam"),
    });
    get().persist();
  },

  cheatOnPartner: () => {
    const { player, relationships, notifications } = get();
    if (!player || player.yas < 16) return;
    const partner = relationships.find((r) => r.tip === "es" || r.tip === "sevgili");
    if (!partner) {
      set({ notifications: addNotification(notifications, "Aldatacak bir partnerin yok.", "uyari") });
      return;
    }
    const result = attemptCheat(relationships, partner.targetId);
    set({
      relationships: result.relationships,
      player: {
        ...player,
        stres: clamp(player.stres + (result.yakalandi ? 15 : 6)),
        mutluluk: clamp(player.mutluluk + (result.yakalandi ? -12 : 2)),
        psikoloji: clamp(player.psikoloji - (result.yakalandi ? 8 : 3)),
      },
      notifications: addNotification(notifications, result.mesaj, result.yakalandi ? "uyari" : "bilgi"),
    });
    get().persist();
  },

  tryPregnancy: () => {
    const { player, family, relationships, pregnancy, notifications } = get();
    if (!player) return;
    if (pregnancy) {
      set({ notifications: addNotification(notifications, "Zaten hamilelik süreci var.", "uyari") });
      return;
    }
    const partnerRel = relationships.find((r) => r.tip === "es" || r.tip === "sevgili");
    const partner = family.find((f) => f.id === partnerRel?.targetId);
    if (!partner || !canGetPregnant(player.yas, true, false)) {
      set({ notifications: addNotification(notifications, "Hamilelik için uygun partner/yaş yok.", "uyari") });
      return;
    }
    // Doğuran taraf: kadın oyuncu veya kadın partner
    if (player.cinsiyet !== "kadin" && partner.cinsiyet !== "kadin") {
      set({ notifications: addNotification(notifications, "Bu çift için evlat edinmeyi dene.", "uyari") });
      return;
    }
    set({
      pregnancy: startPregnancy(partner.id, partner.isim),
      notifications: addNotification(notifications, "Hamilelik başladı. Doğum gelecek yıl.", "yasam"),
    });
    get().persist();
  },

  adoptChildAction: () => {
    const { player, family, relationships, life, notifications } = get();
    if (!player || !life) return;
    if (player.yas < 21) {
      set({ notifications: addNotification(notifications, "Evlat edinmek için en az 21 yaşında olmalısın.", "uyari") });
      return;
    }
    if (life.para < 20000) {
      set({ notifications: addNotification(notifications, "Evlat edinme süreci ~20.000 TL.", "uyari") });
      return;
    }
    const spouse = family.find((f) => f.id === player.esId) ?? null;
    const child = createChild(player, spouse, life);
    const childRel = createChildRelationship(player, child, life);
    set({
      family: [...family, child],
      relationships: [...relationships, childRel],
      life: { ...life, para: life.para - 20000 },
      player: { ...player, mutluluk: clamp(player.mutluluk + 10) },
      notifications: addNotification(notifications, `${child.isim} evlat edinildi!`, "yasam"),
    });
    get().persist();
  },

  renamePlayer: (isim, soyisim) => {
    const { player, life, notifications } = get();
    if (!player || !life) return;
    if (player.yas < 18) {
      set({ notifications: addNotification(notifications, "İsim değişikliği 18+.", "uyari") });
      return;
    }
    if (life.para < 5000) {
      set({ notifications: addNotification(notifications, "Resmi işlem 5000 TL.", "uyari") });
      return;
    }
    const cleanIsim = isim.trim().slice(0, 24);
    const cleanSoy = soyisim.trim().slice(0, 24);
    if (!cleanIsim || !cleanSoy) return;
    set({
      player: { ...player, isim: cleanIsim, soyisim: cleanSoy },
      life: { ...life, para: life.para - 5000 },
      notifications: addNotification(notifications, `Yeni adın: ${cleanIsim} ${cleanSoy}`, "yasam"),
    });
    get().persist();
  },

  loadLocalGame: (slot) => {
    const saved = loadFromLocal(slot);
    if (!saved) return false;

    const ageGroup = getAgeGroup(saved.player.yas);
    set({
      ...defaultExtras(),
      ...saved,
      journal: saved.journal ?? [],
      neighborhood: saved.neighborhood ?? createNeighborhood(saved.player.sehir),
      school: saved.school ?? createSchoolState(saved.player.yas),
      crime: {
        ...(saved.crime ?? createCrimeState()),
        kalanCezaYil: saved.crime?.kalanCezaYil ?? 0,
      },
      politics: saved.politics ?? createPoliticsState(),
      religion: saved.religion ?? createReligionState(),
      hobbies: saved.hobbies ?? [],
      genetics: saved.genetics ?? null,
      actionCooldowns: saved.actionCooldowns ?? [],
      aileDurumu: saved.aileDurumu ?? "orta",
      lifetimeScore: saved.lifetimeScore ?? 0,
      lifePromptHistory: saved.lifePromptHistory ?? [],
      storyState: saved.storyState ?? createEmptyStoryState(),
      lifeExtras: saved.lifeExtras ?? createEmptyLifeExtras(),
      pets: saved.pets ?? [],
      diseases: saved.diseases ?? [],
      pregnancy: saved.pregnancy ?? null,
      datingCandidates: saved.datingCandidates ?? [],
      decorations: saved.decorations ?? [],
      npcMemories: [],
      currentEvent: getRandomEvent(
        ageGroup,
        saved.player.yas,
        (saved.eventHistory ?? []).slice(0, 8).map((e) => e.baslik),
        (saved.storyState ?? createEmptyStoryState()).flags
      ),
      currentPrompt: null,
      notifications: [],
      activeTab: "hayat",
      isDead: saved.player.durum === "oldu",
      isLoading: false,
    });
    return true;
  },

  resetGame: () => {
    clearLocalSave();
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
      npcMemories: [],
      decorations: [],
      ...defaultExtras(),
      activeTab: "hayat",
      isDead: false,
      error: null,
    });
  },

  persist: async () => {
    const state = get();
    if (!state.life || !state.player) return;

    const saveData: SavedGameState = {
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
      decorations: state.decorations,
      journal: state.journal,
      neighborhood: state.neighborhood ?? undefined,
      school: state.school,
      crime: state.crime,
      politics: state.politics,
      religion: state.religion,
      hobbies: state.hobbies,
      genetics: state.genetics,
      actionCooldowns: state.actionCooldowns,
      lifetimeScore: state.lifetimeScore,
      aileDurumu: state.aileDurumu,
      lifePromptHistory: state.lifePromptHistory,
      storyState: state.storyState,
      lifeExtras: state.lifeExtras,
      pets: state.pets,
      diseases: state.diseases,
      pregnancy: state.pregnancy,
      datingCandidates: state.datingCandidates,
    };

    saveToLocal(saveData);

    if (state.userId && state.userId !== "local-user") {
      set({ isSaving: true });
      const { error } = await saveGameState(saveData);
      set({ isSaving: false, error: error ?? null });
    }
  },
}));

export { VEHICLE_TYPES, INVESTMENT_SYMBOLS };
