export interface SchoolState {
  okulAdi: string;
  sinifMevcudu: number;
  sira: number;
  ortalama: number;
  calisma: number;
}

const OKULLAR = [
  "Atatürk İlkokulu", "Cumhuriyet Ortaokulu", "Anadolu Lisesi", "Fen Lisesi",
  "Meslek Lisesi", "Özel Koleji", "İmam Hatip Lisesi",
];

export function createSchoolState(yas: number): SchoolState | null {
  if (yas < 6 || yas > 18) return null;
  const okulAdi =
    yas <= 10 ? OKULLAR[0] : yas <= 13 ? OKULLAR[1] : OKULLAR[2 + Math.floor(Math.random() * 4)];
  const mevcudu = 24 + Math.floor(Math.random() * 12);
  return {
    okulAdi,
    sinifMevcudu: mevcudu,
    sira: Math.ceil(mevcudu / 2),
    ortalama: 70 + Math.floor(Math.random() * 15),
    calisma: 40,
  };
}

export function studyHarder(state: SchoolState): SchoolState {
  const calisma = Math.min(100, state.calisma + 12);
  const ortalama = Math.min(100, state.ortalama + 2 + Math.floor(calisma / 40));
  const sira = Math.max(1, state.sira - (ortalama > 85 ? 2 : 1));
  return { ...state, calisma, ortalama, sira };
}

export function skipStudy(state: SchoolState): SchoolState {
  const ortalama = Math.max(40, state.ortalama - 3);
  const sira = Math.min(state.sinifMevcudu, state.sira + 1);
  return { ...state, calisma: Math.max(0, state.calisma - 8), ortalama, sira };
}

export function schoolYearTick(state: SchoolState, zeka: number): SchoolState {
  const drift = Math.floor((zeka - 50) / 25) + Math.floor((Math.random() - 0.5) * 3);
  const ortalama = Math.max(35, Math.min(100, state.ortalama + drift));
  let sira = state.sira;
  if (ortalama > 88) sira = Math.max(1, sira - 1);
  if (ortalama < 55) sira = Math.min(state.sinifMevcudu, sira + 1);
  return { ...state, ortalama, sira, calisma: Math.max(20, state.calisma - 5) };
}

export function schoolRankLabel(state: SchoolState): string {
  return `${state.sira}/${state.sinifMevcudu}. sıra · Ort. ${state.ortalama}`;
}
