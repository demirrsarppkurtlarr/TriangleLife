import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: "default" | "glass" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
}

const variants = {
  default: "bg-surface-elevated border border-border-subtle",
  glass: "bg-surface-overlay/60 backdrop-blur-glass border border-border-subtle/50",
  elevated: "bg-surface-elevated border border-border shadow-xl shadow-black/5",
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  variant = "glass",
  padding = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card transition-all duration-300",
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
