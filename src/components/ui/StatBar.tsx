import { cn } from "@/lib/utils";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
  color?: "accent" | "success" | "warning" | "danger";
  showValue?: boolean;
}

const colorClasses = {
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export function StatBar({
  label,
  value,
  max = 100,
  color = "accent",
  showValue = true,
}: StatBarProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-content-secondary">{label}</span>
        {showValue && (
          <span className="font-medium text-content tabular-nums">{Math.round(value)}</span>
        )}
      </div>
      <div className="h-2 rounded-full bg-surface-overlay overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
