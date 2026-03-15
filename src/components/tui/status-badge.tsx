type Status = "CREATING" | "RUNNING" | "FINISHED" | "STOPPED" | "ERROR" | string;

const STATUS_MAP: Record<string, { symbol: string; color: string }> = {
  CREATING: { symbol: "●", color: "text-yellow-400" },
  RUNNING: { symbol: "■", color: "text-green-400" },
  FINISHED: { symbol: "○", color: "text-white/60" },
  STOPPED: { symbol: "□", color: "text-white/40" },
  ERROR: { symbol: "✕", color: "text-red-400" },
};

interface StatusBadgeProps {
  status: Status;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_MAP[status] ?? { symbol: "?", color: "text-white/40" };
  return (
    <span className={`font-mono text-xs ${cfg.color}`}>
      [{cfg.symbol} {status}]
    </span>
  );
}
