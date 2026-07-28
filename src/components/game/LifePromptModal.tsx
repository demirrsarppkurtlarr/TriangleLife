"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useGameStore } from "@/store/game-store";
import { AlertTriangle, Home, Briefcase, GraduationCap, Heart } from "lucide-react";

const TIP_ICON = {
  zorunlu: AlertTriangle,
  onemli: Home,
  firsati: Heart,
};

export function LifePromptModal() {
  const prompt = useGameStore((s) => s.currentPrompt);
  const resolvePrompt = useGameStore((s) => s.resolvePrompt);

  return (
    <AnimatePresence>
      {prompt && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="life-prompt-title"
            className="w-full max-w-lg rounded-3xl border border-border-subtle bg-surface shadow-2xl p-6 space-y-5"
            initial={{ scale: 0.92, y: 24 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
          >
            <div className="flex items-start gap-3">
              {(() => {
                const Icon = TIP_ICON[prompt.tip] ?? GraduationCap;
                return (
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15 text-accent shrink-0">
                    <Icon size={22} />
                  </div>
                );
              })()}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-accent mb-1">
                  {prompt.tip === "zorunlu"
                    ? "Yaşam kararı"
                    : prompt.tip === "onemli"
                      ? "Önemli bildirim"
                      : "Fırsat"}
                </p>
                <h2 id="life-prompt-title" className="font-display text-xl font-bold text-content">
                  {prompt.baslik}
                </h2>
              </div>
            </div>

            <p className="text-sm text-content-secondary leading-relaxed">{prompt.aciklama}</p>

            <div className="space-y-2">
              {prompt.secenekler.map((c) => (
                <Button
                  key={c.id}
                  variant="secondary"
                  fullWidth
                  className="justify-start text-left h-auto py-3 whitespace-normal"
                  onClick={() => resolvePrompt(c.id)}
                >
                  {c.metin}
                </Button>
              ))}
            </div>

            <p className="text-[11px] text-content-muted text-center">
              BitLife tarzı: Bu karar bu yılı şekillendirir. Devam etmek için seçim yap.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
