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
}

export const CRIME_OPTIONS = [
  { id: "kacmak", ad: "Toplu taşımada bilet kaçırmak", minYas: 14, siddet: "hafif" as const, risk: 0.35, ceza: 400, itibar: 3 },
  { id: "kucuk-hirsizlik", ad: "Marketten ufak şey çalmak", minYas: 14, siddet: "orta" as const, risk: 0.55, ceza: 2500, itibar: 12 },
  { id: "kavga-sokak", ad: "Sokak kavgasına karışmak", minYas: 16, siddet: "orta" as const, risk: 0.45, ceza: 5000, itibar: 15 },
  { id: "sahte-belge", ad: "Sahte belge riski almak", minYas: 18, siddet: "agir" as const, risk: 0.65, ceza: 25000, itibar: 30 },
];

export function createCrimeState(): CrimeState {
  return { kayitlar: [], sabika: 0, tutuklu: false };
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
    return { state, mesaj: "Şu an tutuklusun; yeni bir suç işleyemezsin.", paraDelta: 0, yakalandi: false };
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
  return {
    state: {
      kayitlar: [kayit, ...state.kayitlar].slice(0, 20),
      sabika: state.sabika + 1,
      tutuklu,
    },
    mesaj: tutuklu
      ? `Yakalandın ve tutuklandın. Ceza: ${opt.ceza.toLocaleString("tr-TR")} TL.`
      : `Yakalandın. Ceza: ${opt.ceza.toLocaleString("tr-TR")} TL.`,
    paraDelta: -opt.ceza,
    yakalandi: true,
  };
}

export function releaseIfDue(state: CrimeState): CrimeState {
  if (!state.tutuklu) return state;
  return { ...state, tutuklu: false };
}
