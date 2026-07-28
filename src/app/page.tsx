"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { GameScreen } from "@/components/game/GameScreen";
import { NewLifeScreen } from "@/components/game/NewLifeScreen";
import { useGameStore } from "@/store/game-store";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const player = useGameStore((s) => s.player);
  const isLoading = useGameStore((s) => s.isLoading);
  const loadGame = useGameStore((s) => s.loadGame);
  const setUserId = useGameStore((s) => s.setUserId);
  const [triedLoad, setTriedLoad] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      setUserId(user.id);
      if (!player && !triedLoad) {
        setTriedLoad(true);
        loadGame(user.id);
      }
    } else {
      setUserId(null);
    }
  }, [user, authLoading, player, triedLoad, loadGame, setUserId]);

  if (authLoading || isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-content-secondary">Yükleniyor...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {!user && (
        <div className="mb-6 flex items-center justify-between rounded-card bg-accent-muted px-4 py-3">
          <p className="text-sm text-content">
            İlerlemenizi kaydetmek için giriş yapın.
          </p>
          <div className="flex gap-2">
            <Link href="/giris">
              <Button variant="secondary" size="sm">Giriş</Button>
            </Link>
            <Link href="/kayit">
              <Button size="sm">Kayıt Ol</Button>
            </Link>
          </div>
        </div>
      )}
      {player ? <GameScreen /> : <NewLifeScreen />}
    </AppShell>
  );
}
