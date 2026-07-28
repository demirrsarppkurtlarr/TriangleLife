/** Yaşa göre gerçekçi özellik kapıları */

export function canAccessFinance(yas: number): boolean {
  return yas >= 16;
}

export function canInvest(yas: number): boolean {
  return yas >= 18;
}

export function canTakeLoan(yas: number): boolean {
  return yas >= 18;
}

export function canStartCompany(yas: number): boolean {
  return yas >= 21;
}

export function canBuyHome(yas: number): boolean {
  return yas >= 18;
}

export function canBuyVehicle(yas: number, tip?: string): boolean {
  if (tip === "bisiklet") return yas >= 8;
  if (tip === "motosiklet") return yas >= 16;
  if (tip === "yat" || tip === "helikopter" || tip === "jet") return yas >= 25;
  return yas >= 18;
}

export function canWork(yas: number): boolean {
  return yas >= 15;
}

export function canStudyUniversity(yas: number): boolean {
  return yas >= 17;
}

export function canGoToClub(yas: number): boolean {
  return yas >= 12;
}

export function canGoToConcert(yas: number): boolean {
  return yas >= 13;
}

export function canGoToBar(yas: number): boolean {
  return yas >= 18;
}

export function canTravelAlone(yas: number): boolean {
  return yas >= 16;
}

export function canVote(yas: number): boolean {
  return yas >= 18;
}

export function canCommitCrime(yas: number): boolean {
  return yas >= 14;
}

export function canHaveHobby(yas: number): boolean {
  return yas >= 5;
}

export function canSocializeIndependently(yas: number): boolean {
  return yas >= 6;
}

export function getPocketMoney(yas: number, aileDurumu?: string): number {
  if (yas < 6) return 0;
  if (yas < 12) return aileDurumu === "varlikli" ? 50 : aileDurumu === "dar" ? 10 : 25;
  if (yas < 15) return aileDurumu === "varlikli" ? 200 : aileDurumu === "dar" ? 50 : 100;
  if (yas < 18) return aileDurumu === "varlikli" ? 800 : aileDurumu === "dar" ? 200 : 400;
  return 0;
}

export function canGamble(yas: number): boolean {
  return yas >= 18;
}

export function canDoSideGig(yas: number): boolean {
  return yas >= 14;
}

export function getAgeBlockedMessage(yas: number, feature: string): string {
  const map: Record<string, { min: number; label: string }> = {
    finans: { min: 16, label: "Finans işlemleri" },
    yatirim: { min: 18, label: "Yatırım" },
    kredi: { min: 18, label: "Kredi" },
    sirket: { min: 21, label: "Şirket kurma" },
    ev: { min: 18, label: "Ev alma" },
    arac: { min: 18, label: "Araç alma" },
    is: { min: 15, label: "İş bulma" },
    oy: { min: 18, label: "Oy kullanma" },
    bar: { min: 18, label: "Bar" },
    kumar: { min: 18, label: "Kumar / piyango" },
    ek_is: { min: 14, label: "Ek iş" },
  };
  const item = map[feature];
  if (!item) return "Bu işlem için uygun yaşta değilsin.";
  return `${item.label} için en az ${item.min} yaşında olmalısın. (Şu an ${yas})`;
}
