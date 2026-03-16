"use client";

import { useState } from "react";
import { useAgents } from "@/hooks/use-agents";
import { AgentCard } from "@/components/agent-card";
import { CreateAgentForm } from "@/components/create-agent-form";
import { TuiButton } from "@/components/tui/button";
import { Spinner } from "@/components/tui/spinner";
import { CursorAgent } from "@/lib/cursor-api";

type FilterStatus = "all" | "RUNNING" | "CREATING" | "FINISHED" | "STOPPED";

export default function DashboardPage() {
  const { agents, error, isLoading, mutate } = useAgents();
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filters: FilterStatus[] = ["all", "RUNNING", "CREATING", "FINISHED", "STOPPED"];

  const filtered: CursorAgent[] =
    filter === "all" ? agents : agents.filter((a) => a.status === filter);

  const activeCount = agents.filter(
    (a) => a.status === "RUNNING" || a.status === "CREATING"
  ).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-mono text-white/50 border-b border-white/10 pb-2">
        <span>
          agents: {agents.length} total, {activeCount} active
        </span>
        <TuiButton onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "CANCEL" : "+ NEW"}
        </TuiButton>
      </div>

      {/* Create Form */}
      {showCreate && (
        <CreateAgentForm
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            mutate();
          }}
        />
      )}

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-1 text-xs font-mono">
        <span className="text-white/30">FILTER:</span>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              filter === f
                ? "text-white border-b border-white"
                : "text-white/40 hover:text-white"
            }
          >
            {filter === f ? `[${f.toLowerCase()}]` : f.toLowerCase()}
          </button>
        ))}
      </div>

      {/* Agent List */}
      {isLoading && (
        <div className="py-8 flex justify-center">
          <Spinner text="fetching agents" />
        </div>
      )}

      {error && (
        <div className="border border-red-500/30 p-3 font-mono text-xs text-red-400">
          [error] {error.message}
          {error.message.includes("No API key") && (
            <span className="ml-2">
              — go to{" "}
              <a href="/settings" className="underline">
                settings
              </a>{" "}
              to add your Cursor API key
            </span>
          )}
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="py-12 text-center font-mono text-white/20 text-sm">
          <pre>{`
  ┌─────────────────────────┐
  │   no agents found       │
  │                         │
  │   press [ + NEW ] to    │
  │   launch your first     │
  │   cloud agent           │
  └─────────────────────────┘`}</pre>
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onMutate={mutate} />
        ))}
      </div>

      {filtered.length > 0 && (
        <div className="text-xs text-white/20 font-mono text-center py-2">
          --- showing {filtered.length} of {agents.length} agents ---
        </div>
      )}
    </div>
  );
}
