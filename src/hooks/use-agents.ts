"use client";

import useSWR from "swr";
import { CursorAgent } from "@/lib/cursor-api";

async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export function useAgents() {
  const { data, error, isLoading, mutate } = useSWR<{
    agents: CursorAgent[];
    nextCursor?: string;
  }>("/api/agents?limit=50", fetcher, {
    refreshInterval: (data) => {
      const hasActive = data?.agents.some(
        (a) => a.status === "RUNNING" || a.status === "CREATING"
      );
      return hasActive ? 10000 : 0;
    },
  });

  return {
    agents: data?.agents ?? [],
    nextCursor: data?.nextCursor,
    error,
    isLoading,
    mutate,
  };
}
