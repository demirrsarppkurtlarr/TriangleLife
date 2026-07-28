"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-button
        bg-surface-overlay/60 backdrop-blur-glass border border-border-subtle/50
        text-content-secondary hover:text-content transition-colors"
      aria-label={theme === "light" ? "Koyu temaya geç" : "Açık temaya geç"}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
