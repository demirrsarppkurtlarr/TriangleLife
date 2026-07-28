export interface FinancialSummary {
  nakit: number;
  banka: number;
  toplamVarlik: number;
  krediBorcu: number;
  netVarlik: number;
  aylikGelir: number;
  aylikGider: number;
}

export function calculateFinancialSummary(
  para: number,
  bankaBakiyesi: number,
  krediBorcu: number,
  gelir: number,
  giderler: number
): FinancialSummary {
  const toplamVarlik = para + bankaBakiyesi;
  const netVarlik = toplamVarlik - krediBorcu;

  return {
    nakit: para,
    banka: bankaBakiyesi,
    toplamVarlik,
    krediBorcu,
    netVarlik,
    aylikGelir: gelir,
    aylikGider: giderler,
  };
}

export function calculateLoanPayment(
  tutar: number,
  faizOrani: number,
  vadeYil: number
): { aylikOdeme: number; toplamOdeme: number } {
  const aylikFaiz = faizOrani / 100 / 12;
  const vadeAy = vadeYil * 12;

  if (aylikFaiz === 0) {
    const aylikOdeme = tutar / vadeAy;
    return { aylikOdeme, toplamOdeme: tutar };
  }

  const aylikOdeme =
    tutar * (aylikFaiz * Math.pow(1 + aylikFaiz, vadeAy)) /
    (Math.pow(1 + aylikFaiz, vadeAy) - 1);

  return {
    aylikOdeme: Math.round(aylikOdeme),
    toplamOdeme: Math.round(aylikOdeme * vadeAy),
  };
}

export function calculateInvestmentReturn(
  miktar: number,
  alisFiyati: number,
  mevcutFiyat: number
): { deger: number; kar: number; yuzde: number } {
  const deger = miktar * mevcutFiyat;
  const maliyet = miktar * alisFiyati;
  const kar = deger - maliyet;
  const yuzde = maliyet > 0 ? (kar / maliyet) * 100 : 0;

  return { deger, kar, yuzde };
}

export function calculateTax(gelir: number): number {
  if (gelir <= 15000) return gelir * 0.15;
  if (gelir <= 40000) return gelir * 0.20;
  if (gelir <= 100000) return gelir * 0.27;
  return gelir * 0.35;
}

export const INVESTMENT_SYMBOLS = {
  hisse: ["THYAO", "GARAN", "AKBNK", "EREGL", "BIMAS", "TUPRS", "SAHOL"],
  etf: ["BIST30", "BIST100", "ALTIN_ETF", "TEKNO_ETF"],
  altin: ["GRAM_ALTIN", "CEYREK_ALTIN", "YARIM_ALTIN"],
  kripto: ["BTC", "ETH", "SOL", "AVAX"],
};

export function simulateMarketPrice(
  mevcutFiyat: number,
  volatilite: number = 0.05
): number {
  const degisim = (Math.random() - 0.5) * 2 * volatilite;
  return Math.max(0.01, mevcutFiyat * (1 + degisim));
}
