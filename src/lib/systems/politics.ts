export type PoliticalLean = "tarafsiz" | "muhafazakar" | "sosyal_demokrat" | "liberal" | "milliyetci";

export interface PoliticsState {
  egilim: PoliticalLean;
  ilgi: number;
  oyKullandiYil: number | null;
  partiUyeligi: boolean;
}

export const POLITICAL_LABELS: Record<PoliticalLean, string> = {
  tarafsiz: "Tarafsız",
  muhafazakar: "Muhafazakâr",
  sosyal_demokrat: "Sosyal Demokrat",
  liberal: "Liberal",
  milliyetci: "Milliyetçi",
};

export function createPoliticsState(): PoliticsState {
  return {
    egilim: "tarafsiz",
    ilgi: 20 + Math.floor(Math.random() * 30),
    oyKullandiYil: null,
    partiUyeligi: false,
  };
}

export function setLean(state: PoliticsState, egilim: PoliticalLean): PoliticsState {
  return { ...state, egilim, ilgi: Math.min(100, state.ilgi + 5) };
}

export function vote(state: PoliticsState, yil: number, yas: number): { state: PoliticsState; mesaj: string } {
  if (yas < 18) return { state, mesaj: "Oy kullanmak için 18 yaşında olmalısın." };
  if (state.oyKullandiYil === yil) return { state, mesaj: "Bu yıl zaten oy kullandın." };
  return {
    state: { ...state, oyKullandiYil: yil, ilgi: Math.min(100, state.ilgi + 8) },
    mesaj: "Sandığa gittin ve oyunu kullandın.",
  };
}

export function joinParty(state: PoliticsState, yas: number): { state: PoliticsState; mesaj: string } {
  if (yas < 18) return { state, mesaj: "Parti üyeliği için 18 yaşında olmalısın." };
  if (state.egilim === "tarafsiz") return { state, mesaj: "Önce bir siyasi eğilim seç." };
  return {
    state: { ...state, partiUyeligi: true, ilgi: Math.min(100, state.ilgi + 10) },
    mesaj: "Parti üyeliğin başladı. Toplantılar zamanını alacak.",
  };
}
