"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/game-store";
import { formatMoney } from "@/lib/generators";
import { calculateFinancialSummary, calculateInvestmentReturn } from "@/lib/systems/finance";
import { INVESTMENT_SYMBOLS } from "@/store/game-store";
import { Wallet, TrendingUp, Building2, CreditCard } from "lucide-react";

export function FinancePanel() {
  const { life, investments, companies, loans, buyInvestment, takeLoan, startCompany, payTax, hireEmployee } =
    useGameStore();

  if (!life) return null;

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
      </Card>

      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Yatırım Yap</h3>
        </div>
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
        {investments.length > 0 && (
          <div className="mt-4 space-y-2">
            {investments.map((inv) => {
              const { deger, kar, yuzde } = calculateInvestmentReturn(
                inv.miktar,
                inv.alisFiyati,
                inv.mevcutFiyat
              );
              return (
                <div key={inv.id} className="flex justify-between rounded-button bg-surface-overlay/40 px-3 py-2 text-sm">
                  <span className="text-content">{inv.sembol}</span>
                  <span className={kar >= 0 ? "text-success" : "text-danger"}>
                    {formatMoney(deger)} ({yuzde >= 0 ? "+" : ""}{yuzde.toFixed(1)}%)
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Kredi</h3>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" size="sm" onClick={() => takeLoan(10000, 5)}>
            10.000 TL (5 yıl)
          </Button>
          <Button variant="secondary" size="sm" onClick={() => takeLoan(50000, 10)}>
            50.000 TL (10 yıl)
          </Button>
          <Button variant="secondary" size="sm" onClick={() => takeLoan(200000, 15)}>
            200.000 TL (15 yıl)
          </Button>
        </div>
        {loans.filter((l) => l.aktif).length > 0 && (
          <div className="mt-3 space-y-2">
            {loans.filter((l) => l.aktif).map((loan) => (
              <div key={loan.id} className="text-sm text-content-secondary">
                Kalan borç: {formatMoney(loan.kalanBorc)} · Aylık: {formatMoney(loan.aylikOdeme)}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card variant="glass" padding="md">
        <div className="flex items-center gap-2 mb-4">
          <Building2 size={20} className="text-accent" />
          <h3 className="font-display text-lg font-semibold text-content">Şirket</h3>
        </div>
        <Button
          variant="secondary"
          onClick={() => startCompany("Triangle Corp", "Teknoloji")}
          className="w-full"
        >
          Şirket Kur (50.000 TL)
        </Button>
        {companies.length > 0 && (
          <div className="mt-3 space-y-2">
            {companies.map((c) => (
              <div key={c.id} className="rounded-button bg-surface-overlay/40 px-3 py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-content">{c.ad}</p>
                    <p className="text-xs text-content-muted">{c.sektor} · {c.calisanSayisi} çalışan</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => hireEmployee(c.id)}>
                    Çalışan Al
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card variant="glass" padding="md">
        <h3 className="font-display text-lg font-semibold text-content mb-3">Vergi</h3>
        <Button variant="secondary" onClick={payTax} className="w-full">
          Yıllık Vergiyi Öde
        </Button>
      </Card>
    </div>
  );
}
