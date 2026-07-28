"use client";

import { Button } from "@/components/ui/Button";
import { CharacterPanel } from "@/components/game/CharacterPanel";
import { EventCard } from "@/components/game/EventCard";
import { FamilyPanel } from "@/components/game/FamilyPanel";
import { GameTabs } from "@/components/game/GameTabs";
import { FinancePanel } from "@/components/game/FinancePanel";
import { RelationshipPanel } from "@/components/game/RelationshipPanel";
import { EducationPanel } from "@/components/game/EducationPanel";
import { PropertyPanel } from "@/components/game/PropertyPanel";
import { HealthPanel } from "@/components/game/HealthPanel";
import { AchievementsPanel } from "@/components/game/AchievementsPanel";
import { SocialPanel } from "@/components/game/SocialPanel";
import { LifestylePanel } from "@/components/game/LifestylePanel";
import { LifeJournal } from "@/components/game/LifeJournal";
import { DeathScreen } from "@/components/game/DeathScreen";
import { Notifications } from "@/components/game/Notifications";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useGameStore } from "@/store/game-store";
import { Calendar, LogOut, Save } from "lucide-react";

export function GameScreen() {
  const {
    player,
    life,
    family,
    relationships,
    currentEvent,
    eventHistory,
    journal,
    lifetimeScore,
    activeTab,
    isDead,
    isSaving,
    advanceYear,
    selectChoice,
    setActiveTab,
    resetGame,
    persist,
  } = useGameStore();

  useKeyboardShortcuts();

  if (!player || !life) return null;

  if (isDead) {
    return (
      <>
        <Notifications />
        <DeathScreen />
      </>
    );
  }

  return (
    <div className="space-y-5 md:space-y-6 pb-24 md:pb-0">
      <Notifications />

      <GameTabs active={activeTab} onChange={setActiveTab} />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-content tracking-tight">
            {life.mevcutYil}
          </h2>
          <p className="text-content-secondary text-sm">
            {player.isim} {player.soyisim} · {player.yas} yaş · {player.sehir}
            {player.meslek && ` · ${player.meslek}`}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!currentEvent && activeTab === "hayat" && (
            <Button onClick={advanceYear} className="gap-2 rounded-full">
              <Calendar size={18} />
              Yılı İlerlet
            </Button>
          )}
          <Button variant="secondary" onClick={persist} disabled={isSaving} className="gap-2 rounded-full">
            <Save size={18} />
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
          <Button variant="ghost" onClick={resetGame} className="gap-2 rounded-full">
            <LogOut size={18} />
            Çıkış
          </Button>
        </div>
      </div>

      {activeTab === "hayat" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <CharacterPanel character={player} money={life.para} score={lifetimeScore} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            {currentEvent ? (
              <EventCard event={currentEvent} onSelectChoice={selectChoice} />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[300px] rounded-card bg-surface-overlay/30 border border-border-subtle/50">
                <Calendar size={48} className="text-content-muted mb-4" />
                <p className="text-content-secondary text-lg mb-4">
                  Bu yıl için olay tamamlandı.
                </p>
                <Button onClick={advanceYear} className="gap-2">
                  <Calendar size={18} />
                  Yılı İlerlet
                </Button>
              </div>
            )}
            <LifeJournal journal={journal} events={eventHistory} />
          </div>
        </div>
      )}

      {activeTab === "aile" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FamilyPanel family={family} relationships={relationships} />
          <RelationshipPanel />
        </div>
      )}

      {activeTab === "finans" && <FinancePanel />}
      {activeTab === "saglik" && <HealthPanel />}
      {activeTab === "egitim" && <EducationPanel />}
      {activeTab === "mulk" && <PropertyPanel />}
      {activeTab === "sosyal" && <SocialPanel />}
      {activeTab === "yasam" && <LifestylePanel />}
      {activeTab === "basarim" && <AchievementsPanel />}
    </div>
  );
}
