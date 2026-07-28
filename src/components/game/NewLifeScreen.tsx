"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useGameStore } from "@/store/game-store";
import type { Gender } from "@/types/game";
import { motion } from "framer-motion";
import { Baby, Sparkles } from "lucide-react";

export function NewLifeScreen() {
  const startNewLife = useGameStore((s) => s.startNewLife);

  const handleStart = (cinsiyet: Gender) => {
    startNewLife(cinsiyet);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 max-w-lg"
      >
        <div className="space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-accent text-white">
            <Sparkles size={40} />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-content">
            TriangleLife
          </h1>
          <p className="text-lg text-content-secondary leading-relaxed">
            Doğumdan ölüme kendi hayatını yaşa. Her seçim geleceğini şekillendirir.
          </p>
        </div>

        <Card variant="elevated" padding="lg" className="w-full">
          <div className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-content text-center">
              Yeni Hayat Başlat
            </h2>
            <p className="text-sm text-content-secondary text-center">
              Cinsiyetini seç ve hayatına başla
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleStart("erkek")}
                className="flex-col gap-2 h-auto py-4"
              >
                <Baby size={24} />
                Erkek
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleStart("kadin")}
                className="flex-col gap-2 h-auto py-4"
              >
                <Baby size={24} />
                Kadın
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
