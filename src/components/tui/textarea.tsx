"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TuiTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TuiTextarea = forwardRef<HTMLTextAreaElement, TuiTextareaProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <div className="font-mono text-sm">
        {label && (
          <div className="text-white/50 mb-1">$ {label}&gt;</div>
        )}
        <textarea
          ref={ref}
          {...props}
          className={cn(
            "w-full bg-transparent text-white outline-none border border-white/20",
            "focus:border-white/60 placeholder:text-white/20 caret-white",
            "font-mono text-sm p-2 resize-none overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",
            className
          )}
        />
      </div>
    );
  }
);
TuiTextarea.displayName = "TuiTextarea";
