import { cn } from "@/lib/utils";

interface TriangleLogoProps {
  size?: number;
  className?: string;
  withWordmark?: boolean;
}

export function TriangleLogo({ size = 36, className, withWordmark = false }: TriangleLogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <linearGradient id="tl-grad" x1="8" y1="42" x2="40" y2="6" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0071e3" />
            <stop offset="1" stopColor="#64d2ff" />
          </linearGradient>
        </defs>
        <path
          d="M24 4.5L44.5 40.5H3.5L24 4.5Z"
          fill="url(#tl-grad)"
          stroke="currentColor"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
        <path
          d="M24 16L34 34H14L24 16Z"
          fill="white"
          fillOpacity="0.22"
        />
      </svg>
      {withWordmark && (
        <span className="font-display text-[17px] font-semibold tracking-tight text-content">
          TriangleLife
        </span>
      )}
    </div>
  );
}
