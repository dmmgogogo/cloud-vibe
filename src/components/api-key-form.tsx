"use client";

import { useState } from "react";
import { TuiButton } from "@/components/tui/button";
import { TuiInput } from "@/components/tui/input";
import { Spinner } from "@/components/tui/spinner";

interface ApiKeyFormProps {
  onSaved: () => void;
}

export function ApiKeyForm({ onSaved }: ApiKeyFormProps) {
  const [keyName, setKeyName] = useState("Default");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key_name: keyName, api_key: apiKey }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed");
      }
      setSuccess(true);
      setApiKey("");
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <TuiInput
        label="key-name"
        value={keyName}
        onChange={(e) => setKeyName(e.target.value)}
        placeholder="Default"
      />
      <TuiInput
        label="api-key"
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="your Cursor API key..."
        required
      />
      {err && <div className="text-xs text-red-400 font-mono">[error] {err}</div>}
      {success && <div className="text-xs text-green-400 font-mono">[ok] key saved</div>}
      <div className="flex gap-2">
        {loading ? (
          <Spinner text="saving" />
        ) : (
          <TuiButton type="submit" disabled={!apiKey.trim()}>
            SAVE KEY
          </TuiButton>
        )}
      </div>
    </form>
  );
}
