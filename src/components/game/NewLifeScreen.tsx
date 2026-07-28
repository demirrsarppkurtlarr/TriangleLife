"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Shuffle, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TriangleLogo } from "@/components/ui/TriangleLogo";
import { useGameStore } from "@/store/game-store";
import { hasLocalSave } from "@/lib/local-storage";
import { TURKISH_NAMES, TURKISH_SURNAMES, CITIES } from "@/lib/constants";
import type { CharacterCreationOptions, FamilyWealth, PersonalityFocus, CharacterDifficulty, HairColor, EyeColor, SkinTone } from "@/types/creation";
import {
  WEALTH_LABELS,
  DIFFICULTY_LABELS,
  FOCUS_LABELS,
  HAIR_LABELS,
  EYE_LABELS,
  SKIN_LABELS,
} from "@/types/creation";
import { cn } from "@/lib/utils";
import type { Gender } from "@/types/game";

const STEPS = ["Kimlik", "Görünüm", "Aile", "Başlangıç"] as const;

function ChoiceChip<T extends string>({
  options,
  value,
  onChange,
  labels,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels: Record<T, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={cn(
            "rounded-full px-3.5 py-2 text-sm font-medium transition-all border",
            value === opt
              ? "bg-content text-surface border-transparent"
              : "bg-surface-overlay/50 text-content-secondary border-border-subtle hover:text-content"
          )}
        >
          {labels[opt]}
        </button>
      ))}
    </div>
  );
}

export function NewLifeScreen() {
  const startNewLife = useGameStore((s) => s.startNewLife);
  const loadLocalGame = useGameStore((s) => s.loadLocalGame);
  const [hasSave, setHasSave] = useState(false);
  const [step, setStep] = useState(0);

  const [cinsiyet, setCinsiyet] = useState<Gender>("erkek");
  const [isim, setIsim] = useState("");
  const [soyisim, setSoyisim] = useState(TURKISH_SURNAMES[0]);
  const [sehir, setSehir] = useState(CITIES[0]);
  const [kardesSayisi, setKardesSayisi] = useState(1);
  const [aileDurumu, setAileDurumu] = useState<FamilyWealth>("orta");
  const [zorluk, setZorluk] = useState<CharacterDifficulty>("normal");
  const [kisilikOdagi, setKisilikOdagi] = useState<PersonalityFocus>("dengeli");
  const [sacRengi, setSacRengi] = useState<HairColor>("kahve");
  const [gozRengi, setGozRengi] = useState<EyeColor>("kahve");
  const [tenRengi, setTenRengi] = useState<SkinTone>("bugday");
  const [dogumYili, setDogumYili] = useState(2026);

  useEffect(() => {
    setHasSave(hasLocalSave());
  }, []);

  const nameSuggestions = useMemo(() => TURKISH_NAMES[cinsiyet].slice(0, 8), [cinsiyet]);

  const randomizeName = () => {
    const names = TURKISH_NAMES[cinsiyet];
    setIsim(names[Math.floor(Math.random() * names.length)]);
  };

  const randomizeAll = () => {
    const names = TURKISH_NAMES[cinsiyet];
    setIsim(names[Math.floor(Math.random() * names.length)]);
    setSoyisim(TURKISH_SURNAMES[Math.floor(Math.random() * TURKISH_SURNAMES.length)]);
    setSehir(CITIES[Math.floor(Math.random() * CITIES.length)]);
    setKardesSayisi(Math.floor(Math.random() * 4));
  };

  const canProceed = () => {
    if (step === 0) return isim.trim().length >= 2 && soyisim.trim().length >= 2;
    return true;
  };

  const handleStart = () => {
    if (!canProceed()) return;
    const options: CharacterCreationOptions = {
      cinsiyet,
      isim: isim.trim(),
      soyisim: soyisim.trim(),
      sehir,
      kardesSayisi,
      aileDurumu,
      zorluk,
      kisilikOdagi,
      sacRengi,
      gozRengi,
      tenRengi,
      dogumYili,
    };
    startNewLife(options);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] pb-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="mx-auto flex justify-center">
            <TriangleLogo size={56} />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-content">
            TriangleLife
          </h1>
          <p className="text-content-secondary">
            Karakterini oluştur. Soyadın tüm ailenin soyadı olacak.
          </p>
        </div>

        {hasSave && (
          <Button onClick={() => loadLocalGame()} fullWidth size="lg" className="gap-2 rounded-full">
            <Play size={18} />
            Kayıtlı Oyuna Devam Et
          </Button>
        )}

        <Card variant="elevated" padding="lg" className="rounded-[1.75rem]">
          {/* Step indicators */}
          <div className="flex items-center justify-between mb-6">
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => i <= step && setStep(i)}
                className={cn(
                  "flex-1 text-center text-xs font-medium pb-2 border-b-2 transition-colors",
                  i === step
                    ? "border-accent text-accent"
                    : i < step
                      ? "border-content/20 text-content"
                      : "border-transparent text-content-muted"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-5 min-h-[280px]"
            >
              {step === 0 && (
                <>
                  <div>
                    <p className="text-sm text-content-secondary mb-2">Cinsiyet</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(["erkek", "kadin"] as Gender[]).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setCinsiyet(g)}
                          className={cn(
                            "rounded-2xl py-3 font-medium transition-all border",
                            cinsiyet === g
                              ? "bg-content text-surface border-transparent"
                              : "bg-surface-overlay/40 border-border-subtle text-content-secondary"
                          )}
                        >
                          {g === "erkek" ? "Erkek" : "Kadın"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-content-secondary">İsim</p>
                      <button type="button" onClick={randomizeName} className="text-xs text-accent flex items-center gap-1">
                        <Shuffle size={12} /> Rastgele
                      </button>
                    </div>
                    <input
                      value={isim}
                      onChange={(e) => setIsim(e.target.value)}
                      placeholder="Adını yaz"
                      maxLength={24}
                      className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-content focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {nameSuggestions.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setIsim(n)}
                          className="text-xs rounded-full px-2.5 py-1 bg-surface-overlay/60 text-content-secondary hover:text-content"
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-content-secondary mb-2">
                      Soyisim <span className="text-content-muted">(çekirdek ailenin soyadı)</span>
                    </p>
                    <input
                      value={soyisim}
                      onChange={(e) => setSoyisim(e.target.value)}
                      placeholder="Soyadını yaz"
                      maxLength={24}
                      className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-content focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto">
                      {TURKISH_SURNAMES.slice(0, 16).map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSoyisim(s)}
                          className={cn(
                            "text-xs rounded-full px-2.5 py-1",
                            soyisim === s
                              ? "bg-accent text-white"
                              : "bg-surface-overlay/60 text-content-secondary hover:text-content"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div>
                    <p className="text-sm text-content-secondary mb-2">Saç rengi</p>
                    <ChoiceChip options={Object.keys(HAIR_LABELS) as HairColor[]} value={sacRengi} onChange={setSacRengi} labels={HAIR_LABELS} />
                  </div>
                  <div>
                    <p className="text-sm text-content-secondary mb-2">Göz rengi</p>
                    <ChoiceChip options={Object.keys(EYE_LABELS) as EyeColor[]} value={gozRengi} onChange={setGozRengi} labels={EYE_LABELS} />
                  </div>
                  <div>
                    <p className="text-sm text-content-secondary mb-2">Ten rengi</p>
                    <ChoiceChip options={Object.keys(SKIN_LABELS) as SkinTone[]} value={tenRengi} onChange={setTenRengi} labels={SKIN_LABELS} />
                  </div>
                  <div>
                    <p className="text-sm text-content-secondary mb-2">Kişilik odağı</p>
                    <ChoiceChip options={Object.keys(FOCUS_LABELS) as PersonalityFocus[]} value={kisilikOdagi} onChange={setKisilikOdagi} labels={FOCUS_LABELS} />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div>
                    <p className="text-sm text-content-secondary mb-2">Doğum şehri</p>
                    <select
                      value={sehir}
                      onChange={(e) => setSehir(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-content focus:outline-none focus:ring-2 focus:ring-accent/40"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-sm text-content-secondary mb-2">Kardeş sayısı: {kardesSayisi}</p>
                    <input
                      type="range"
                      min={0}
                      max={3}
                      value={kardesSayisi}
                      onChange={(e) => setKardesSayisi(Number(e.target.value))}
                      className="w-full accent-[var(--color-accent)]"
                    />
                    <p className="text-xs text-content-muted mt-1">
                      Anne, baba ve {kardesSayisi} kardeş · hepsi <strong>{soyisim || "…"}</strong> soyadını taşır
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-content-secondary mb-2">Aile durumu</p>
                    <ChoiceChip options={Object.keys(WEALTH_LABELS) as FamilyWealth[]} value={aileDurumu} onChange={setAileDurumu} labels={WEALTH_LABELS} />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div>
                    <p className="text-sm text-content-secondary mb-2">Zorluk</p>
                    <ChoiceChip options={Object.keys(DIFFICULTY_LABELS) as CharacterDifficulty[]} value={zorluk} onChange={setZorluk} labels={DIFFICULTY_LABELS} />
                  </div>
                  <div>
                    <p className="text-sm text-content-secondary mb-2">Doğum yılı</p>
                    <input
                      type="number"
                      min={1980}
                      max={2030}
                      value={dogumYili}
                      onChange={(e) => setDogumYili(Number(e.target.value))}
                      className="w-full rounded-2xl border border-border bg-surface-elevated px-4 py-3 text-content focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  </div>
                  <div className="rounded-2xl bg-surface-overlay/50 p-4 space-y-1 text-sm">
                    <p className="font-display font-semibold text-content text-lg">
                      {isim || "…"} {soyisim || "…"}
                    </p>
                    <p className="text-content-secondary">
                      {cinsiyet === "erkek" ? "Erkek" : "Kadın"} · {sehir} · {FOCUS_LABELS[kisilikOdagi]}
                    </p>
                    <p className="text-content-muted text-xs">
                      {HAIR_LABELS[sacRengi]} saç · {EYE_LABELS[gozRengi]} göz · {SKIN_LABELS[tenRengi]} ten
                    </p>
                    <p className="text-content-muted text-xs">
                      {WEALTH_LABELS[aileDurumu]} aile · {kardesSayisi} kardeş · {DIFFICULTY_LABELS[zorluk]}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-6 gap-2">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="gap-1 rounded-full"
            >
              <ChevronLeft size={16} /> Geri
            </Button>
            <button type="button" onClick={randomizeAll} className="text-xs text-content-muted hover:text-accent flex items-center gap-1">
              <Shuffle size={12} /> Rastgele doldur
            </button>
            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canProceed()}
                className="gap-1 rounded-full"
              >
                İleri <ChevronRight size={16} />
              </Button>
            ) : (
              <Button onClick={handleStart} disabled={!canProceed()} className="rounded-full">
                Hayata Başla
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
