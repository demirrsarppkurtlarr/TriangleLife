"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/game-store";

export function useKeyboardShortcuts() {
  const advanceYear = useGameStore((s) => s.advanceYear);
  const currentEvent = useGameStore((s) => s.currentEvent);
  const isDead = useGameStore((s) => s.isDead);
  const activeTab = useGameStore((s) => s.activeTab);
  const setActiveTab = useGameStore((s) => s.setActiveTab);
  const persist = useGameStore((s) => s.persist);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case " ":
        case "Enter":
          if (!currentEvent && !isDead && activeTab === "hayat") {
            e.preventDefault();
            advanceYear();
          }
          break;
        case "s":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            persist();
          }
          break;
        case "1":
          setActiveTab("hayat");
          break;
        case "2":
          setActiveTab("aile");
          break;
        case "3":
          setActiveTab("finans");
          break;
        case "4":
          setActiveTab("saglik");
          break;
        case "5":
          setActiveTab("egitim");
          break;
        case "6":
          setActiveTab("mulk");
          break;
        case "7":
          setActiveTab("sosyal");
          break;
        case "8":
          setActiveTab("yasam");
          break;
        case "9":
          setActiveTab("basarim");
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [advanceYear, currentEvent, isDead, activeTab, setActiveTab, persist]);
}
