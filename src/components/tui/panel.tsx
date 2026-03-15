import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export function Panel({ title, children, className, footer }: PanelProps) {
  return (
    <div className={cn("border border-white/20 font-mono", className)}>
      {title && (
        <div className="border-b border-white/20 px-3 py-1 text-xs text-white/60">
          ─ {title} {"─".repeat(Math.max(0, 40 - title.length))}
        </div>
      )}
      <div className="p-3">{children}</div>
      {footer && (
        <div className="border-t border-white/20 px-3 py-1">{footer}</div>
      )}
    </div>
  );
}
