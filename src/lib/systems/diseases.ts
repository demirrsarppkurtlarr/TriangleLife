export interface Disease {
  id: string;
  ad: string;
  siddet: "hafif" | "orta" | "agir";
  kalanYil: number;
  yillikSaglik: number;
  yillikMutluluk: number;
  yillikStres: number;
}

const DISEASE_POOL: Array<Omit<Disease, "id" | "kalanYil"> & { minYas: number; risk: number; sure: [number, number] }> = [
  { ad: "Grip", siddet: "hafif", minYas: 1, risk: 0.12, sure: [1, 1], yillikSaglik: -4, yillikMutluluk: -2, yillikStres: 3 },
  { ad: "Alerji", siddet: "hafif", minYas: 5, risk: 0.08, sure: [2, 4], yillikSaglik: -2, yillikMutluluk: -1, yillikStres: 2 },
  { ad: "Astım", siddet: "orta", minYas: 8, risk: 0.04, sure: [3, 8], yillikSaglik: -5, yillikMutluluk: -2, yillikStres: 4 },
  { ad: "Migren", siddet: "orta", minYas: 16, risk: 0.06, sure: [2, 5], yillikSaglik: -3, yillikMutluluk: -3, yillikStres: 5 },
  { ad: "Diyabet", siddet: "agir", minYas: 35, risk: 0.05, sure: [5, 20], yillikSaglik: -6, yillikMutluluk: -3, yillikStres: 4 },
  { ad: "Hipertansiyon", siddet: "agir", minYas: 40, risk: 0.07, sure: [4, 15], yillikSaglik: -5, yillikMutluluk: -2, yillikStres: 5 },
  { ad: "Kalp rahatsızlığı", siddet: "agir", minYas: 50, risk: 0.05, sure: [3, 12], yillikSaglik: -8, yillikMutluluk: -4, yillikStres: 6 },
  { ad: "Artrit", siddet: "orta", minYas: 55, risk: 0.08, sure: [4, 15], yillikSaglik: -4, yillikMutluluk: -3, yillikStres: 3 },
  { ad: "Demans riski", siddet: "agir", minYas: 70, risk: 0.06, sure: [3, 10], yillikSaglik: -5, yillikMutluluk: -6, yillikStres: 4 },
];

const DEATH_CAUSES = [
  "Doğal sebepler",
  "Kalp krizi",
  "İnme",
  "Kanser komplikasyonları",
  "Solunum yetmezliği",
  "Trafik kazası",
  "Ev kazası",
  "Enfeksiyon",
  "Yaşlılığa bağlı organ yetmezliği",
];

export function rollNewDisease(yas: number, mevcut: Disease[]): Disease | null {
  if (mevcut.length >= 3) return null;
  const adlar = new Set(mevcut.map((d) => d.ad));
  const candidates = DISEASE_POOL.filter((d) => yas >= d.minYas && !adlar.has(d.ad));
  for (const c of candidates) {
    const ageBoost = yas > 60 ? 1.4 : yas > 40 ? 1.15 : 1;
    if (Math.random() < c.risk * ageBoost) {
      const sure = c.sure[0] + Math.floor(Math.random() * (c.sure[1] - c.sure[0] + 1));
      return {
        id: `dis-${Date.now()}-${c.ad.slice(0, 4)}`,
        ad: c.ad,
        siddet: c.siddet,
        kalanYil: sure,
        yillikSaglik: c.yillikSaglik,
        yillikMutluluk: c.yillikMutluluk,
        yillikStres: c.yillikStres,
      };
    }
  }
  return null;
}

export function tickDiseases(diseases: Disease[]): {
  diseases: Disease[];
  saglik: number;
  mutluluk: number;
  stres: number;
  mesajlar: string[];
} {
  let saglik = 0;
  let mutluluk = 0;
  let stres = 0;
  const mesajlar: string[] = [];
  const next = diseases
    .map((d) => {
      saglik += d.yillikSaglik;
      mutluluk += d.yillikMutluluk;
      stres += d.yillikStres;
      return { ...d, kalanYil: d.kalanYil - 1 };
    })
    .filter((d) => {
      if (d.kalanYil <= 0) {
        mesajlar.push(`${d.ad} iyileşti.`);
        return false;
      }
      return true;
    });
  return { diseases: next, saglik, mutluluk, stres, mesajlar };
}

export function treatDisease(diseases: Disease[], diseaseId: string): {
  diseases: Disease[];
  maliyet: number;
  mesaj: string;
} {
  const d = diseases.find((x) => x.id === diseaseId);
  if (!d) return { diseases, maliyet: 0, mesaj: "Hastalık bulunamadı." };
  const maliyet = d.siddet === "hafif" ? 800 : d.siddet === "orta" ? 3500 : 12000;
  return {
    diseases: diseases.filter((x) => x.id !== diseaseId),
    maliyet,
    mesaj: `${d.ad} tedavi edildi.`,
  };
}

export function pickDeathCause(yas: number, diseases: Disease[], saglik: number): string {
  if (diseases.some((d) => d.ad.includes("Kalp"))) return "Kalp krizi";
  if (diseases.some((d) => d.ad.includes("Demans"))) return "Demans komplikasyonları";
  if (diseases.some((d) => d.siddet === "agir") && saglik < 25) {
    return `${diseases.find((d) => d.siddet === "agir")!.ad} komplikasyonları`;
  }
  if (yas < 30 && Math.random() < 0.35) return "Trafik kazası";
  if (yas > 80) return "Yaşlılığa bağlı organ yetmezliği";
  if (saglik <= 0) return "Sağlık sorunları";
  return DEATH_CAUSES[Math.floor(Math.random() * DEATH_CAUSES.length)];
}
