"use client";

import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

export function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // Tarayıcı engelledi
    }
  };

  return (
    <button
      onClick={toggle}
      className="flex h-10 w-10 items-center justify-center rounded-button
        bg-surface-overlay/60 backdrop-blur-glass border border-border-subtle/50
        text-content-secondary hover:text-content transition-colors"
      aria-label={isFullscreen ? "Tam ekrandan çık" : "Tam ekran"}
      title={isFullscreen ? "Tam ekrandan çık" : "Tam ekran"}
    >
      {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
    </button>
  );
}
