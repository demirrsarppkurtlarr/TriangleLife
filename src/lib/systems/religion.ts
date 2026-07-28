export type ReligionPractice = "yok" | "kulturel" | "duzenli" | "yogun";

export interface ReligionState {
  inanc: string;
  pratik: ReligionPractice;
  baglilik: number;
}

export const INANC_OPTIONS = [
  "İslam", "Hristiyanlık", "Musevilik", "Alevilik", "Budizm", "Ateizm", "Agnostisizm", "Diğer",
];

export const PRACTICE_LABELS: Record<ReligionPractice, string> = {
  yok: "Pratik yok",
  kulturel: "Kültürel bağ",
  duzenli: "Düzenli pratik",
  yogun: "Yoğun bağlılık",
};

export function createReligionState(): ReligionState {
  return {
    inanc: "İslam",
    pratik: "kulturel",
    baglilik: 30 + Math.floor(Math.random() * 25),
  };
}

export function setBelief(state: ReligionState, inanc: string): ReligionState {
  return { ...state, inanc };
}

export function setPractice(state: ReligionState, pratik: ReligionPractice): ReligionState {
  const baglilik =
    pratik === "yok" ? Math.max(0, state.baglilik - 10)
      : pratik === "kulturel" ? state.baglilik
        : pratik === "duzenli" ? Math.min(100, state.baglilik + 8)
          : Math.min(100, state.baglilik + 15);
  return { ...state, pratik, baglilik };
}

export function worship(state: ReligionState): { state: ReligionState; mutluluk: number; stres: number } {
  if (state.pratik === "yok") {
    return { state, mutluluk: 0, stres: 0 };
  }
  return {
    state: { ...state, baglilik: Math.min(100, state.baglilik + 3) },
    mutluluk: state.pratik === "yogun" ? 4 : 2,
    stres: -3,
  };
}
