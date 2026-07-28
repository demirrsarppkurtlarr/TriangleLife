"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/game-store";
import { formatMoney } from "@/lib/generators";
import { calculateFinancialSummary, calculateInvestmentReturn } from "@/lib/systems/finance";
import { INVESTMENT_SYMBOLS } from "@/store/game-store";
import {
  canAccessFinance,
  canInvest,
  canTakeLoan,
  canStartCompany,
  getAgeBlockedMessage,
} from "@/lib/systems/age-gates";
import { Wallet, TrendingUp, Building2, CreditCard } from "lucide-react";

export function FinancePanel() {
  const {
    life,
    player,
    investments,
    companies,
    loans,
    buyInvestment,
    takeLoan,
    startCompany,
    payTax,
    hireEmployee,
  } = useGameStore();

  if (!life || !player) return null;

  if (!canAccessFinance(player.yas)) {
    return (
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-3">
          <Wallet size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Finans</h3>
        </div>
        <p className="text-sm text-content-secondary">
          {getAgeBlockedMessage(player.yas, "finans")}
        </p>
        <p className="text-xs text-content-muted mt-2">
          6–17 yaş: yalnızca harçlık. Yatırım ve kredi 18+, şirket 21+.
        </p>
        <p className="text-sm font-medium text-content mt-4">
          Nakit (harçlık): {formatMoney(life.para)}
        </p>
      </Card>
    );
  }

  const summary = calculateFinancialSummary(
    life.para,
    life.bankaBakiyesi,
    life.krediBorcu,
    0,
    loans.filter((l) => l.aktif).reduce((s, l) => s + l.aylikOdeme * 12, 0)
  );

  const totalInvestment = investments.reduce((s, inv) => {
    const { deger } = calculateInvestmentReturn(inv.miktar, inv.alisFiyati, inv.mevcutFiyat);
    return s + deger;
  }, 0);

  return (
    <div className="space-y-4">
      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Wallet size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Finansal Durum</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-button bg-surface-overlay/40 p-3">
            <p className="text-xs text-content-muted">Nakit</p>
            <p className="font-bold text-content">{formatMoney(summary.nakit)}</p>
          </div>
          <div className="rounded-button bg-surface-overlay/40 p-3">
            <p className="text-xs text-content-muted">Banka</p>
            <p className="font-bold text-content">{formatMoney(summary.banka)}</p>
          </div>
          <div className="rounded-button bg-surface-overlay/40 p-3">
            <p className="text-xs text-content-muted">Yatırımlar</p>
            <p className="font-bold text-content">{formatMoney(totalInvestment)}</p>
          </div>
          <div className="rounded-button bg-surface-overlay/40 p-3">
            <p className="text-xs text-content-muted">Net Varlık</p>
            <p className="font-bold text-accent">{formatMoney(summary.netVarlik + totalInvestment)}</p>
          </div>
        </div>
        {player.gelir > 0 && (
          <Button variant="secondary" size="sm" className="mt-3" onClick={payTax}>
            Yıllık vergi öde
          </Button>
        )}
      </Card>

      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Yatırım Yap</h3>
        </div>
        {!canInvest(player.yas) ? (
          <p className="text-sm text-content-muted">{getAgeBlockedMessage(player.yas, "yatirim")}</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["hisse", "etf", "altin", "kripto"] as const).map((tip) => {
              const sembol = INVESTMENT_SYMBOLS[tip][0];
              const fiyatlar = { hisse: 150, etf: 80, altin: 2500, kripto: 50000 };
              return (
                <Button
                  key={tip}
                  variant="secondary"
                  size="sm"
                  onClick={() => buyInvestment(tip, sembol, 1, fiyatlar[tip])}
                  className="capitalize"
                >
                  {tip === "hisse" ? "Hisse" : tip === "etf" ? "ETF" : tip === "altin" ? "Altın" : "Kripto"}
                </Button>
              );
            })}
          </div>
        )}
        {investments.length > 0 && (
          <div className="mt-4 space-y-2">
            {investments.map((inv) => (
              <div key={inv.id} className="flex justify-between text-sm rounded-button bg-surface-overlay/40 px-3 py-2">
                <span>{inv.sembol}</span>
                <span>{formatMoney(inv.miktar * inv.mevcutFiyat)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Kredi</h3>
        </div>
        {!canTakeLoan(player.yas) ? (
          <p className="text-sm text-content-muted">{getAgeBlockedMessage(player.yas, "kredi")}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {[10000, 50000, 100000].map((tutar) => (
              <Button key={tutar} variant="secondary" size="sm" onClick={() => takeLoan(tutar, 5)}>
                {formatMoney(tutar)}
              </Button>
            ))}
          </div>
        )}
      </Card>

      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Şirket</h3>
        </div>
        {!canStartCompany(player.yas) ? (
          <p className="text-sm text-content-muted">{getAgeBlockedMessage(player.yas, "sirket")}</p>
        ) : (
          <>
            <Button variant="secondary" size="sm" onClick={() => startCompany("Yeni Şirket", "Teknoloji")}>
              Şirket kur (50.000 TL)
            </Button>
            {companies.map((c) => (
              <div key={c.id} className="mt-3 flex items-center justify-between rounded-button bg-surface-overlay/40 px-3 py-2">
                <div>
                  <p className="text-sm font-medium">{c.ad}</p>
                  <p className="text-xs text-content-muted">{c.calisanSayisi} çalışan · {formatMoney(c.gelir)}/yıl</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => hireEmployee(c.id)}>
                  Çalışan al
                </Button>
              </div>
            ))}
          </>
        )}
      </Card>
    </div>
  );
}
