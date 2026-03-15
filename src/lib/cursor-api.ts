const CURSOR_API_BASE = "https://api.cursor.com/v0";

export interface CursorAgent {
  id: string;
  name: string;
  status: "CREATING" | "RUNNING" | "FINISHED" | "STOPPED" | "ERROR";
  source: {
    repository: string;
    ref?: string;
  };
  target: {
    branchName?: string;
    url?: string;
    prUrl?: string;
    autoCreatePr?: boolean;
    openAsCursorGithubApp?: boolean;
    skipReviewerRequest?: boolean;
  };
  summary?: string;
  createdAt: string;
}

export interface CursorMessage {
  id: string;
  type: "user_message" | "assistant_message";
  text: string;
}

export interface CursorArtifact {
  absolutePath: string;
  sizeBytes: number;
  updatedAt: string;
}

export async function cursorFetch(
  apiKey: string,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const credentials = Buffer.from(`${apiKey}:`).toString("base64");
  return fetch(`${CURSOR_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export async function listAgents(
  apiKey: string,
  params?: { limit?: number; cursor?: string }
): Promise<{ agents: CursorAgent[]; nextCursor?: string }> {
  const query = new URLSearchParams();
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.cursor) query.set("cursor", params.cursor);
  const res = await cursorFetch(apiKey, `/agents?${query}`);
  if (!res.ok) throw new Error(`Cursor API error: ${res.status}`);
  return res.json();
}

export async function getAgent(apiKey: string, id: string): Promise<CursorAgent> {
  const res = await cursorFetch(apiKey, `/agents/${id}`);
  if (!res.ok) throw new Error(`Cursor API error: ${res.status}`);
  return res.json();
}

export async function getConversation(
  apiKey: string,
  id: string
): Promise<{ id: string; messages: CursorMessage[] }> {
  const res = await cursorFetch(apiKey, `/agents/${id}/conversation`);
  if (!res.ok) throw new Error(`Cursor API error: ${res.status}`);
  return res.json();
}

export async function getArtifacts(
  apiKey: string,
  id: string
): Promise<{ artifacts: CursorArtifact[] }> {
  const res = await cursorFetch(apiKey, `/agents/${id}/artifacts`);
  if (!res.ok) throw new Error(`Cursor API error: ${res.status}`);
  return res.json();
}

export async function downloadArtifact(
  apiKey: string,
  id: string,
  path: string
): Promise<{ url: string; expiresAt: string }> {
  const res = await cursorFetch(
    apiKey,
    `/agents/${id}/artifacts/download?path=${encodeURIComponent(path)}`
  );
  if (!res.ok) throw new Error(`Cursor API error: ${res.status}`);
  return res.json();
}

export async function createAgent(
  apiKey: string,
  payload: {
    prompt: { text: string };
    model?: string;
    source: { repository: string; ref?: string };
    target?: {
      autoCreatePr?: boolean;
      branchName?: string;
    };
  }
): Promise<CursorAgent> {
  const res = await cursorFetch(apiKey, "/agents", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cursor API error: ${res.status} ${err}`);
  }
  return res.json();
}

export async function sendFollowup(
  apiKey: string,
  id: string,
  text: string
): Promise<{ id: string }> {
  const res = await cursorFetch(apiKey, `/agents/${id}/followup`, {
    method: "POST",
    body: JSON.stringify({ prompt: { text } }),
  });
  if (!res.ok) throw new Error(`Cursor API error: ${res.status}`);
  return res.json();
}

export async function stopAgent(
  apiKey: string,
  id: string
): Promise<{ id: string }> {
  const res = await cursorFetch(apiKey, `/agents/${id}/stop`, { method: "POST" });
  if (!res.ok) throw new Error(`Cursor API error: ${res.status}`);
  return res.json();
}

export async function deleteAgent(
  apiKey: string,
  id: string
): Promise<{ id: string }> {
  const res = await cursorFetch(apiKey, `/agents/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Cursor API error: ${res.status}`);
  return res.json();
}

export async function listModels(
  apiKey: string
): Promise<{ models: string[] }> {
  const res = await cursorFetch(apiKey, "/models");
  if (!res.ok) throw new Error(`Cursor API error: ${res.status}`);
  return res.json();
}

export async function listRepositories(
  apiKey: string
): Promise<{ repositories: { owner: string; name: string; repository: string }[] }> {
  const res = await cursorFetch(apiKey, "/repositories");
  if (!res.ok) throw new Error(`Cursor API error: ${res.status}`);
  return res.json();
}
