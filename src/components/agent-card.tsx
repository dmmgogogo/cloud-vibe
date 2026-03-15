"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CursorAgent } from "@/lib/cursor-api";
import { StatusBadge } from "@/components/tui/status-badge";
import { TuiButton } from "@/components/tui/button";
import { formatRelativeTime, extractRepoName } from "@/lib/utils";

interface AgentCardProps {
  agent: CursorAgent;
  onMutate: () => void;
}

export function AgentCard({ agent, onMutate }: AgentCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handleStop() {
    setLoading("stop");
    setErr(null);
    try {
      const res = await fetch(`/api/agents/${agent.id}/stop`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      onMutate();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "error");
    } finally {
      setLoading(null);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete agent ${agent.id}?`)) return;
    setLoading("delete");
    setErr(null);
    try {
      const res = await fetch(`/api/agents/${agent.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      onMutate();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "error");
    } finally {
      setLoading(null);
    }
  }

  const repoName = extractRepoName(agent.source.repository);

  return (
    <div className="border border-white/20 font-mono">
      <div className="border-b border-white/10 px-3 py-1 text-xs text-white/40 flex items-center justify-between">
        <span>─ {agent.id} ─</span>
        <span>{formatRelativeTime(agent.createdAt)}</span>
      </div>
      <div className="p-3 space-y-1">
        <div className="text-sm text-white">{agent.name}</div>
        <div className="text-xs text-white/50">
          repo: {repoName}
          {agent.source.ref && <span> | ref: {agent.source.ref}</span>}
          {agent.target.branchName && (
            <span> | branch: {agent.target.branchName}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <StatusBadge status={agent.status} />
          {agent.target.prUrl && (
            <a
              href={agent.target.prUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white underline"
            >
              PR ↗
            </a>
          )}
        </div>
        {agent.summary && (
          <div className="text-xs text-white/40 mt-1 border-t border-white/10 pt-1">
            {agent.summary.slice(0, 120)}
            {agent.summary.length > 120 ? "..." : ""}
          </div>
        )}
        {err && <div className="text-xs text-red-400">[error] {err}</div>}
      </div>
      <div className="border-t border-white/10 px-3 py-2 flex flex-wrap gap-2">
        <TuiButton onClick={() => router.push(`/dashboard/${agent.id}`)}>
          DETAIL
        </TuiButton>
        {(agent.status === "RUNNING" || agent.status === "CREATING") && (
          <TuiButton
            onClick={handleStop}
            disabled={loading === "stop"}
            variant="danger"
          >
            {loading === "stop" ? "..." : "STOP"}
          </TuiButton>
        )}
        <TuiButton
          onClick={handleDelete}
          disabled={loading === "delete"}
          variant="danger"
        >
          {loading === "delete" ? "..." : "DELETE"}
        </TuiButton>
      </div>
    </div>
  );
}
