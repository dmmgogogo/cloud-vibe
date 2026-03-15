"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TuiButton } from "@/components/tui/button";
import { TuiTextarea } from "@/components/tui/textarea";
import { TuiInput } from "@/components/tui/input";
import { TuiSelect } from "@/components/tui/select";
import { Spinner } from "@/components/tui/spinner";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface CreateAgentFormProps {
  onClose: () => void;
  onCreated: () => void;
}

export function CreateAgentForm({ onClose, onCreated }: CreateAgentFormProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [repo, setRepo] = useState("");
  const [ref, setRef] = useState("main");
  const [model, setModel] = useState("");
  const [autoCreatePr, setAutoCreatePr] = useState(false);
  const [branchName, setBranchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const { data: reposData } = useSWR<{
    repositories: { owner: string; name: string; repository: string }[];
    cached?: boolean;
  }>("/api/repositories", fetcher);

  const { data: modelsData } = useSWR<{ models: string[] }>("/api/models", fetcher);

  const repoOptions =
    reposData?.repositories.map((r) => ({
      value: r.repository,
      label: `${r.owner}/${r.name}`,
    })) ?? [];

  const modelOptions = (modelsData?.models ?? []).map((m) => ({
    value: m,
    label: m,
  }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || !repo) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: { text: prompt },
          model: model || "default",
          source: { repository: repo, ref: ref || "main" },
          target: {
            autoCreatePr,
            ...(branchName ? { branchName } : {}),
          },
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed");
      }
      const data = await res.json();
      onCreated();
      router.push(`/dashboard/${data.id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-white/30 font-mono bg-black">
      <div className="border-b border-white/20 px-3 py-1 text-xs text-white/50 flex justify-between">
        <span>─ new agent ─────────────────────────────</span>
        <button onClick={onClose} className="text-white/40 hover:text-white">
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <TuiTextarea
          label="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what the agent should do..."
          rows={4}
          required
        />
        <TuiSelect
          label="repo"
          options={repoOptions}
          value={repo}
          onChange={setRepo}
          placeholder={reposData ? "select repository..." : "loading repos..."}
        />
        <TuiInput
          label="ref"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="main"
        />
        <TuiSelect
          label="model"
          options={[{ value: "default", label: "default" }, ...modelOptions]}
          value={model || "default"}
          onChange={setModel}
          placeholder="default"
        />
        <TuiInput
          label="branch-name"
          value={branchName}
          onChange={(e) => setBranchName(e.target.value)}
          placeholder="auto-generated if empty"
        />
        <div className="flex items-center gap-2 text-xs text-white/70">
          <span>$ auto-create-pr&gt;</span>
          <button
            type="button"
            onClick={() => setAutoCreatePr(!autoCreatePr)}
            className="border border-white/30 px-2 py-0.5 hover:border-white/60"
          >
            {autoCreatePr ? "[yes]" : "[no]"}
          </button>
        </div>
        {err && <div className="text-xs text-red-400">[error] {err}</div>}
        <div className="flex gap-2 pt-2 border-t border-white/20">
          {loading ? (
            <Spinner text="creating agent" />
          ) : (
            <>
              <TuiButton type="submit" disabled={!prompt.trim() || !repo}>
                CREATE
              </TuiButton>
              <TuiButton type="button" variant="ghost" onClick={onClose}>
                CANCEL
              </TuiButton>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
