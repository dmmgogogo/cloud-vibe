"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TuiInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const TuiInput = forwardRef<HTMLInputElement, TuiInputProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="font-mono flex items-center gap-1 text-sm">
        {label && <span className="text-white/50 whitespace-nowrap">$ {label}&gt;</span>}
        <input
          ref={ref}
          {...props}
          className={cn(
            "flex-1 bg-transparent text-white outline-none border-b border-white/20",
            "focus:border-white/60 placeholder:text-white/20 caret-white",
            "font-mono text-sm py-0.5",
            className
          )}
        />
      </div>
    );
  }
);
TuiInput.displayName = "TuiInput";
