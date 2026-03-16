"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAgentDetail } from "@/hooks/use-agent-detail";
import { StatusBadge } from "@/components/tui/status-badge";
import { TuiButton } from "@/components/tui/button";
import { Spinner } from "@/components/tui/spinner";
import { ChatMessage } from "@/components/chat-message";
import { extractRepoName, formatRelativeTime } from "@/lib/utils";
import { CursorArtifact } from "@/lib/cursor-api";

interface PageProps {
  params: Promise<{ id: string }>;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}K`;
  return `${(bytes / 1024 / 1024).toFixed(1)}M`;
}

export default function AgentDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { agent, messages, artifacts, error, mutateAgent, mutateConv } =
    useAgentDetail(id);
  const [followup, setFollowup] = useState("");
  const [sending, setSending] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionErr, setActionErr] = useState<string | null>(null);
  const [tab, setTab] = useState<"conversation" | "artifacts">("conversation");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleFollowup(e: React.FormEvent) {
    e.preventDefault();
    if (!followup.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/agents/${id}/followup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: followup }),
      });
      if (!res.ok) throw new Error("Failed to send follow-up");
      setFollowup("");
      mutateConv();
      mutateAgent();
    } catch (e) {
      setActionErr(e instanceof Error ? e.message : "error");
    } finally {
      setSending(false);
    }
  }

  async function handleStop() {
    setActionLoading("stop");
    setActionErr(null);
    try {
      await fetch(`/api/agents/${id}/stop`, { method: "POST" });
      mutateAgent();
    } catch (e) {
      setActionErr(e instanceof Error ? e.message : "error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete agent ${id}?`)) return;
    setActionLoading("delete");
    try {
      await fetch(`/api/agents/${id}`, { method: "DELETE" });
      router.push("/dashboard");
    } catch (e) {
      setActionErr(e instanceof Error ? e.message : "error");
      setActionLoading(null);
    }
  }

  async function handleDownload(artifact: CursorArtifact) {
    try {
      const res = await fetch(
        `/api/agents/${id}/artifacts?path=${encodeURIComponent(artifact.absolutePath)}`
      );
      const { url } = await res.json();
      window.open(url, "_blank");
    } catch {
      setActionErr("Failed to get download URL");
    }
  }

  if (error) {
    return (
      <div className="font-mono text-red-400 text-sm p-4">
        [error] {error.message}
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="py-8 flex justify-center">
        <Spinner text="loading agent" />
      </div>
    );
  }

  const repoName = extractRepoName(agent.source.repository);

  return (
    <div className="space-y-3 font-mono">
      {/* Back */}
      <button
        onClick={() => router.push("/dashboard")}
        className="text-xs text-white/40 hover:text-white"
      >
        ← back
      </button>

      {/* Agent Header */}
      <div className="border border-white/20">
        <div className="border-b border-white/10 px-3 py-1 text-xs text-white/40">
          ─ {agent.id} ─
        </div>
        <div className="p-3 space-y-1">
          <div className="text-sm text-white">{agent.name}</div>
          <div className="text-xs text-white/50">
            repo: {repoName} | created: {formatRelativeTime(agent.createdAt)}
          </div>
          {agent.target.branchName && (
            <div className="text-xs text-white/50">
              branch: {agent.target.branchName}
            </div>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={agent.status} />
            {agent.target.prUrl && (
              <a
                href={agent.target.prUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white underline"
              >
                view PR ↗
              </a>
            )}
            {agent.target.url && (
              <a
                href={agent.target.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/40 hover:text-white underline"
              >
                cursor.com ↗
              </a>
            )}
          </div>
          {agent.summary && (
            <div className="text-xs text-white/40 border-t border-white/10 pt-1 mt-1">
              {agent.summary}
            </div>
          )}
        </div>
        <div className="border-t border-white/10 px-3 py-2 flex flex-wrap gap-2">
          {(agent.status === "RUNNING" || agent.status === "CREATING") && (
            <TuiButton
              onClick={handleStop}
              disabled={actionLoading === "stop"}
              variant="danger"
            >
              {actionLoading === "stop" ? "..." : "STOP"}
            </TuiButton>
          )}
          <TuiButton
            onClick={handleDelete}
            disabled={actionLoading === "delete"}
            variant="danger"
          >
            {actionLoading === "delete" ? "..." : "DELETE"}
          </TuiButton>
          {actionErr && (
            <span className="text-xs text-red-400 self-center">
              [error] {actionErr}
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 text-xs border-b border-white/10 pb-1">
        <button
          onClick={() => setTab("conversation")}
          className={tab === "conversation" ? "text-white" : "text-white/40 hover:text-white"}
        >
          {tab === "conversation" ? "[conversation]" : "conversation"}
        </button>
        <span className="text-white/20">|</span>
        <button
          onClick={() => setTab("artifacts")}
          className={tab === "artifacts" ? "text-white" : "text-white/40 hover:text-white"}
        >
          {tab === "artifacts"
            ? `[artifacts (${artifacts.length})]`
            : `artifacts (${artifacts.length})`}
        </button>
      </div>

      {/* Conversation */}
      {tab === "conversation" && (
        <div className="border border-white/20">
          <div className="h-96 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-xs text-white/20 text-center py-8">
                no messages yet
              </div>
            )}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-white/20">
            <form onSubmit={handleFollowup} className="flex items-center gap-2 p-2">
              <span className="text-xs text-white/40 whitespace-nowrap">$ followup&gt;</span>
              <input
                value={followup}
                onChange={(e) => setFollowup(e.target.value)}
                placeholder="send a follow-up instruction..."
                disabled={sending}
                className="flex-1 bg-transparent text-sm text-white outline-none border-b border-white/20 focus:border-white/60 placeholder:text-white/20 font-mono py-0.5"
              />
              {sending ? (
                <Spinner text="sending" />
              ) : (
                <TuiButton type="submit" disabled={!followup.trim()}>
                  SEND
                </TuiButton>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Artifacts */}
      {tab === "artifacts" && (
        <div className="border border-white/20">
          {artifacts.length === 0 ? (
            <div className="p-4 text-xs text-white/30 text-center">
              {agent.status === "FINISHED"
                ? "no artifacts"
                : "artifacts available after agent finishes"}
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              <div className="px-3 py-1 text-xs text-white/30 flex gap-4">
                <span className="flex-1">path</span>
                <span className="w-16 text-right">size</span>
                <span className="w-12 text-right">action</span>
              </div>
              {artifacts.map((artifact) => (
                <div
                  key={artifact.absolutePath}
                  className="px-3 py-1.5 text-xs flex gap-4 items-center"
                >
                  <span className="flex-1 text-white/70 truncate font-mono">
                    {artifact.absolutePath}
                  </span>
                  <span className="w-16 text-right text-white/40">
                    {formatBytes(artifact.sizeBytes)}
                  </span>
                  <span className="w-12 text-right">
                    <button
                      onClick={() => handleDownload(artifact)}
                      className="text-white/50 hover:text-white underline"
                    >
                      dl ↓
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
