export type CrimeSeverity = "hafif" | "orta" | "agir";

export interface CrimeRecord {
  id: string;
  yil: number;
  tip: string;
  siddet: CrimeSeverity;
  ceza: number;
  itibarKaybi: number;
}

export interface CrimeState {
  kayitlar: CrimeRecord[];
  sabika: number;
  tutuklu: boolean;
  kalanCezaYil: number;
}

export const CRIME_OPTIONS = [
  { id: "kacmak", ad: "Toplu taşımada bilet kaçırmak", minYas: 14, siddet: "hafif" as const, risk: 0.35, ceza: 400, itibar: 3 },
  { id: "kucuk-hirsizlik", ad: "Marketten ufak şey çalmak", minYas: 14, siddet: "orta" as const, risk: 0.55, ceza: 2500, itibar: 12 },
  { id: "kavga-sokak", ad: "Sokak kavgasına karışmak", minYas: 16, siddet: "orta" as const, risk: 0.45, ceza: 5000, itibar: 15 },
  { id: "sahte-belge", ad: "Sahte belge riski almak", minYas: 18, siddet: "agir" as const, risk: 0.65, ceza: 25000, itibar: 30 },
];

export function createCrimeState(): CrimeState {
  return { kayitlar: [], sabika: 0, tutuklu: false, kalanCezaYil: 0 };
}

export function attemptCrime(
  state: CrimeState,
  optionId: string,
  yil: number,
  yas: number
): { state: CrimeState; mesaj: string; paraDelta: number; yakalandi: boolean } {
  const opt = CRIME_OPTIONS.find((o) => o.id === optionId);
  if (!opt) return { state, mesaj: "Geçersiz.", paraDelta: 0, yakalandi: false };
  if (yas < opt.minYas) {
    return { state, mesaj: `Bu eylem için en az ${opt.minYas} yaşında olmalısın.`, paraDelta: 0, yakalandi: false };
  }
  if (state.tutuklu) {
    return { state, mesaj: "Hapistesin; yeni bir suç işleyemezsin.", paraDelta: 0, yakalandi: false };
  }

  const yakalandi = Math.random() < opt.risk + state.sabika * 0.02;
  if (!yakalandi) {
    return {
      state: { ...state, sabika: state.sabika },
      mesaj: "Bu sefer yakalanmadın. Ama risk büyüyor.",
      paraDelta: opt.siddet === "hafif" ? 200 : 800,
      yakalandi: false,
    };
  }

  const kayit: CrimeRecord = {
    id: `crime-${yil}-${optionId}`,
    yil,
    tip: opt.ad,
    siddet: opt.siddet,
    ceza: opt.ceza,
    itibarKaybi: opt.itibar,
  };

  const tutuklu = opt.siddet === "agir" || state.sabika >= 3;
  const kalanCezaYil = tutuklu ? (opt.siddet === "agir" ? 2 + Math.floor(Math.random() * 2) : 1) : 0;

  return {
    state: {
      kayitlar: [kayit, ...state.kayitlar].slice(0, 20),
      sabika: state.sabika + 1,
      tutuklu,
      kalanCezaYil: tutuklu ? Math.max(state.kalanCezaYil, kalanCezaYil) : state.kalanCezaYil,
    },
    mesaj: tutuklu
      ? `Yakalandın. ${kalanCezaYil} yıl hapis + ${opt.ceza.toLocaleString("tr-TR")} TL ceza.`
      : `Yakalandın. Ceza: ${opt.ceza.toLocaleString("tr-TR")} TL.`,
    paraDelta: -opt.ceza,
    yakalandi: true,
  };
}

/** Her yıl hapis süresi azalır */
export function releaseIfDue(state: CrimeState): { state: CrimeState; mesaj?: string } {
  if (!state.tutuklu) return { state };
  const kalan = Math.max(0, (state.kalanCezaYil || 1) - 1);
  if (kalan <= 0) {
    return {
      state: { ...state, tutuklu: false, kalanCezaYil: 0 },
      mesaj: "Hapisten çıktın. Sabıkan kaldı.",
    };
  }
  return {
    state: { ...state, kalanCezaYil: kalan },
    mesaj: `Hapistesin. Kalan süre: ${kalan} yıl.`,
  };
}
