import type { PersonalityTraits, Gender } from "@/types/game";

export interface GeneticsProfile {
  sacRengi: string;
  gozRengi: string;
  tenRengi: string;
  boyPotansiyeli: number;
  saglikRiski: number;
  zekaYatkinligi: number;
  ebeveynKatkisi: { anne: number; baba: number };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(v: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

/** Ebeveyn özelliklerinden çocuk genetiği */
export function inheritGenetics(
  anne: { ozellikler: PersonalityTraits; sacRengi?: string; gozRengi?: string; tenRengi?: string } | null,
  baba: { ozellikler: PersonalityTraits; sacRengi?: string; gozRengi?: string; tenRengi?: string } | null,
  cinsiyet: Gender
): { genetics: GeneticsProfile; ozellikler: PersonalityTraits } {
  const a = anne?.ozellikler;
  const b = baba?.ozellikler;
  const mix = (key: keyof PersonalityTraits) => {
    const av = a?.[key] ?? 50;
    const bv = b?.[key] ?? 50;
    const base = lerp(av, bv, 0.45 + Math.random() * 0.1);
    const noise = (Math.random() - 0.5) * 16;
    return clamp(Math.round(base + noise));
  };

  const ozellikler: PersonalityTraits = {
    mutluluk: mix("mutluluk"),
    saglik: mix("saglik"),
    zeka: mix("zeka"),
    sabir: mix("sabir"),
    comertlik: mix("comertlik"),
    sosyallik: mix("sosyallik"),
    guven: mix("guven"),
    sevgi: mix("sevgi"),
    empati: mix("empati"),
  };

  const sac =
    Math.random() < 0.5
      ? anne?.sacRengi ?? baba?.sacRengi ?? "kahve"
      : baba?.sacRengi ?? anne?.sacRengi ?? "siyah";
  const goz =
    Math.random() < 0.55
      ? anne?.gozRengi ?? baba?.gozRengi ?? "kahve"
      : baba?.gozRengi ?? anne?.gozRengi ?? "ela";
  const ten =
    Math.random() < 0.5
      ? anne?.tenRengi ?? baba?.tenRengi ?? "orta"
      : baba?.tenRengi ?? anne?.tenRengi ?? "acik";

  const genetics: GeneticsProfile = {
    sacRengi: sac,
    gozRengi: goz,
    tenRengi: ten,
    boyPotansiyeli: Math.round(160 + (cinsiyet === "erkek" ? 18 : 8) + (Math.random() - 0.5) * 20),
    saglikRiski: clamp(100 - ozellikler.saglik + Math.floor(Math.random() * 10)),
    zekaYatkinligi: ozellikler.zeka,
    ebeveynKatkisi: { anne: anne ? 48 + Math.floor(Math.random() * 8) : 0, baba: baba ? 48 + Math.floor(Math.random() * 8) : 0 },
  };

  return { genetics, ozellikler };
}

export function geneticsSummary(g: GeneticsProfile): string {
  return `Boy potansiyeli ~${g.boyPotansiyeli} cm · Sağlık riski ${g.saglikRiski}% · Zekâ yatkınlığı ${g.zekaYatkinligi}`;
}
