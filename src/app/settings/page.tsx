"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { ApiKeyForm } from "@/components/api-key-form";
import { TuiButton } from "@/components/tui/button";
import { Spinner } from "@/components/tui/spinner";
import { formatRelativeTime } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ApiKey {
  id: string;
  key_name: string;
  created_at: string;
}

export default function SettingsPage() {
  const { data, isLoading, mutate } = useSWR<{ keys: ApiKey[] }>(
    "/api/keys",
    fetcher
  );
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Delete this API key?")) return;
      setDeleting(id);
      try {
        await fetch(`/api/keys/${id}`, { method: "DELETE" });
        mutate();
      } finally {
        setDeleting(null);
      }
    },
    [mutate]
  );

  return (
    <div className="space-y-6 font-mono">
      <div className="text-xs text-white/40 border-b border-white/10 pb-2">
        ─ settings ─────────────────────────────
      </div>

      {/* Cursor API Keys */}
      <div className="space-y-3">
        <div className="text-sm text-white/70">cursor api keys</div>
        <div className="text-xs text-white/30">
          get your api key from{" "}
          <a
            href="https://cursor.com/settings"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white"
          >
            cursor.com/settings ↗
          </a>
        </div>

        {/* Existing Keys */}
        {isLoading && <Spinner text="loading keys" />}
        {data?.keys && data.keys.length > 0 && (
          <div className="border border-white/20 divide-y divide-white/10">
            <div className="px-3 py-1 text-xs text-white/30 flex gap-4">
              <span className="flex-1">name</span>
              <span className="w-24">added</span>
              <span className="w-24 text-right">action</span>
            </div>
            {data.keys.map((key) => (
              <div key={key.id} className="px-3 py-2 flex gap-4 items-center text-xs">
                <span className="flex-1 text-white/70">{key.key_name}</span>
                <span className="w-24 text-white/40">
                  {formatRelativeTime(key.created_at)}
                </span>
                <span className="w-24 text-right">
                  <TuiButton
                    onClick={() => handleDelete(key.id)}
                    disabled={deleting === key.id}
                    variant="danger"
                    className="whitespace-nowrap"
                  >
                    {deleting === key.id ? "..." : "DEL"}
                  </TuiButton>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Add Key Form */}
        <div className="border border-white/20 p-4">
          <div className="text-xs text-white/40 mb-3">
            {data?.keys?.length ? "update / add key" : "add your first key"}
          </div>
          <ApiKeyForm onSaved={() => mutate()} />
        </div>
      </div>
    </div>
  );
}
