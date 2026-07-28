import type { SavedGameState } from "@/types/game";

const SLOT_PREFIX = "triangle-life-slot-";
const ACTIVE_SLOT_KEY = "triangle-life-active-slot";
const LEGACY_KEY = "triangle-life-save";

export const SAVE_SLOT_COUNT = 3;

export function getActiveSlot(): number {
  try {
    const v = localStorage.getItem(ACTIVE_SLOT_KEY);
    const n = v ? parseInt(v, 10) : 0;
    return Number.isFinite(n) && n >= 0 && n < SAVE_SLOT_COUNT ? n : 0;
  } catch {
    return 0;
  }
}

export function setActiveSlot(slot: number): void {
  try {
    localStorage.setItem(ACTIVE_SLOT_KEY, String(Math.max(0, Math.min(SAVE_SLOT_COUNT - 1, slot))));
  } catch {
    // ignore
  }
}

function slotKey(slot: number): string {
  return `${SLOT_PREFIX}${slot}`;
}

export function saveToLocal(state: SavedGameState, slot?: number): void {
  const s = slot ?? getActiveSlot();
  try {
    localStorage.setItem(slotKey(s), JSON.stringify(state));
    localStorage.setItem(LEGACY_KEY, JSON.stringify(state));
    setActiveSlot(s);
  } catch {
    // localStorage dolu veya erişim yok
  }
}

export function loadFromLocal(slot?: number): SavedGameState | null {
  const s = slot ?? getActiveSlot();
  try {
    const raw = localStorage.getItem(slotKey(s)) ?? (s === 0 ? localStorage.getItem(LEGACY_KEY) : null);
    if (!raw) return null;
    return JSON.parse(raw) as SavedGameState;
  } catch {
    return null;
  }
}

export function clearLocalSave(slot?: number): void {
  const s = slot ?? getActiveSlot();
  try {
    localStorage.removeItem(slotKey(s));
    if (s === 0) localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore
  }
}

export function hasLocalSave(slot?: number): boolean {
  const s = slot ?? getActiveSlot();
  try {
    return localStorage.getItem(slotKey(s)) !== null || (s === 0 && localStorage.getItem(LEGACY_KEY) !== null);
  } catch {
    return false;
  }
}

export function listSaveSlots(): Array<{
  slot: number;
  occupied: boolean;
  preview: string | null;
}> {
  return Array.from({ length: SAVE_SLOT_COUNT }, (_, slot) => {
    const data = loadFromLocal(slot);
    if (!data) return { slot, occupied: false, preview: null };
    return {
      slot,
      occupied: true,
      preview: `${data.player.isim} ${data.player.soyisim} · ${data.player.yas} yaş · ${data.life.mevcutYil}`,
    };
  });
}
