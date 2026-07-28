"use client";

interface AvatarFaceProps {
  sacRengi?: string;
  gozRengi?: string;
  tenRengi?: string;
  cinsiyet?: "erkek" | "kadin";
  yas?: number;
  size?: number;
  className?: string;
}

const HAIR: Record<string, string> = {
  siyah: "#1a1a1a",
  kahve: "#5c3a21",
  kumral: "#a67c52",
  sari: "#d4b483",
  kizil: "#8b3a2a",
  gri: "#9ca3af",
  beyaz: "#e5e7eb",
};

const EYE: Record<string, string> = {
  kahve: "#5c4033",
  ela: "#8b7355",
  yesil: "#3d6b4f",
  mavi: "#4a6fa5",
  siyah: "#222",
  gri: "#6b7280",
};

const SKIN: Record<string, string> = {
  acik: "#f3d5b5",
  orta: "#d4a574",
  buğday: "#c68642",
  bugday: "#c68642",
  koyu: "#8d5524",
  esmer: "#6b4423",
};

export function AvatarFace({
  sacRengi = "kahve",
  gozRengi = "kahve",
  tenRengi = "orta",
  cinsiyet = "erkek",
  yas = 20,
  size = 64,
  className,
}: AvatarFaceProps) {
  const skin = SKIN[tenRengi] ?? SKIN.orta;
  const hair = yas < 2 ? skin : HAIR[sacRengi] ?? HAIR.kahve;
  const eye = EYE[gozRengi] ?? EYE.kahve;
  const baby = yas < 3;
  const elder = yas >= 65;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      className={className}
      aria-hidden
    >
      <circle cx="40" cy="40" r="38" fill="rgba(0,0,0,0.04)" />
      {/* Saç arka */}
      {!baby && (
        <ellipse cx="40" cy="28" rx="28" ry={cinsiyet === "kadin" ? 26 : 20} fill={hair} />
      )}
      {/* Yüz */}
      <ellipse cx="40" cy="42" rx="24" ry="26" fill={skin} />
      {/* Saç ön */}
      {!baby && (
        <path
          d={
            cinsiyet === "kadin"
              ? "M16 36 Q20 18 40 16 Q60 18 64 36 Q58 28 40 26 Q22 28 16 36"
              : "M18 34 Q22 18 40 16 Q58 18 62 34 Q52 24 40 24 Q28 24 18 34"
          }
          fill={hair}
        />
      )}
      {elder && (
        <path d="M28 20 Q40 14 52 20" stroke="#e5e7eb" strokeWidth="2" fill="none" opacity="0.7" />
      )}
      {/* Gözler */}
      <ellipse cx="31" cy="40" rx={baby ? 3 : 3.5} ry={baby ? 3.5 : 4} fill="#fff" />
      <ellipse cx="49" cy="40" rx={baby ? 3 : 3.5} ry={baby ? 3.5 : 4} fill="#fff" />
      <circle cx="31" cy="40" r="2" fill={eye} />
      <circle cx="49" cy="40" r="2" fill={eye} />
      {/* Kaş */}
      {!baby && (
        <>
          <path d="M26 34 Q31 32 36 34" stroke="#3a2a1a" strokeWidth="1.2" fill="none" opacity="0.5" />
          <path d="M44 34 Q49 32 54 34" stroke="#3a2a1a" strokeWidth="1.2" fill="none" opacity="0.5" />
        </>
      )}
      {/* Burun */}
      <path d="M40 42 L38 48 L42 48" stroke="#000" strokeOpacity="0.15" strokeWidth="1.2" fill="none" />
      {/* Ağız */}
      <path
        d={baby ? "M34 54 Q40 58 46 54" : "M33 55 Q40 59 47 55"}
        stroke="#b45a4a"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
