"use client";

import useSWR from "swr";
import { CursorAgent, CursorMessage, CursorArtifact } from "@/lib/cursor-api";

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export function useAgentDetail(id: string) {
  const { data: agent, error: agentError, mutate: mutateAgent } = useSWR<CursorAgent>(
    `/api/agents/${id}`,
    fetcher,
    {
      refreshInterval: (data) =>
        data?.status === "RUNNING" || data?.status === "CREATING" ? 5000 : 0,
    }
  );

  const { data: convData, error: convError, mutate: mutateConv } = useSWR<{
    id: string;
    messages: CursorMessage[];
  }>(`/api/agents/${id}/conversation`, fetcher, {
    refreshInterval: agent?.status === "RUNNING" ? 5000 : 0,
  });

  const { data: artifactsData } = useSWR<{ artifacts: CursorArtifact[] }>(
    agent?.status === "FINISHED" ? `/api/agents/${id}/artifacts` : null,
    fetcher
  );

  return {
    agent,
    messages: convData?.messages ?? [],
    artifacts: artifactsData?.artifacts ?? [],
    error: agentError || convError,
    mutateAgent,
    mutateConv,
  };
}
