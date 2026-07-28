import type { Character, Life, Property, Investment, Company, Achievement } from "@/types/game";

export interface ScoreBreakdown {
  toplam: number;
  yas: number;
  servet: number;
  basarim: number;
  iliski: number;
  egitim: number;
  itibar: number;
}

export function calculateLifeScore(input: {
  player: Character;
  life: Life;
  properties: Property[];
  investments: Investment[];
  companies: Company[];
  achievements: Achievement[];
  avgRelationship: number;
  neighborhoodItibar: number;
  sabika: number;
}): ScoreBreakdown {
  const { player, life, properties, investments, companies, achievements, avgRelationship, neighborhoodItibar, sabika } = input;

  const propertyValue = properties.reduce((s, p) => s + (p.satinAlindi ? p.deger : 0), 0);
  const invValue = investments.reduce((s, i) => s + i.miktar * i.mevcutFiyat, 0);
  const companyValue = companies.reduce((s, c) => s + c.deger, 0);
  const netWorth = life.para + life.bankaBakiyesi + propertyValue + invValue + companyValue - life.krediBorcu;

  const yas = Math.min(40, player.yas);
  const servet = Math.min(40, Math.floor(Math.log10(Math.max(1, netWorth)) * 5));
  const basarim = Math.min(20, achievements.filter((a) => a.kazanildi).length * 2);
  const iliski = Math.min(15, Math.floor(avgRelationship / 7));
  const egitimMap: Record<string, number> = {
    yok: 0, kres: 1, anaokulu: 2, ilkokul: 3, ortaokul: 4, lise: 6, universite: 10, yuksek_lisans: 12, doktora: 15,
  };
  const egitim = egitimMap[player.egitim] ?? 0;
  const itibar = Math.min(15, Math.floor(neighborhoodItibar / 7) - sabika * 2);

  const toplam = Math.max(0, yas + servet + basarim + iliski + egitim + itibar);
  return { toplam, yas, servet, basarim, iliski, egitim, itibar: Math.max(0, itibar) };
}

export interface LeaderboardEntry {
  id: string;
  isim: string;
  soyisim: string;
  sehir: string;
  yas: number;
  skor: number;
  yil: number;
}

const LB_KEY = "triangle-life-leaderboard";

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LB_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function submitScore(entry: Omit<LeaderboardEntry, "id">): LeaderboardEntry[] {
  const list = loadLeaderboard();
  const full: LeaderboardEntry = { ...entry, id: crypto.randomUUID() };
  const next = [...list, full].sort((a, b) => b.skor - a.skor).slice(0, 50);
  try {
    localStorage.setItem(LB_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}
