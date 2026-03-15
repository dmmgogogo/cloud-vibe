import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TuiButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "danger" | "ghost";
}

export function TuiButton({
  children,
  variant = "default",
  className,
  disabled,
  ...props
}: TuiButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={cn(
        "font-mono text-xs px-2 py-0.5 border transition-colors select-none cursor-pointer",
        "disabled:opacity-30 disabled:cursor-not-allowed",
        variant === "default" &&
          "border-white/40 text-white/80 hover:bg-white hover:text-black",
        variant === "danger" &&
          "border-red-500/60 text-red-400 hover:bg-red-500 hover:text-black",
        variant === "ghost" &&
          "border-transparent text-white/50 hover:text-white hover:border-white/30",
        className
      )}
    >
      [ {children} ]
    </button>
  );
}
