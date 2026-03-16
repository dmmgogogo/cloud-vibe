"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase/client";
import { TuiButton } from "@/components/tui/button";
import { TuiInput } from "@/components/tui/input";
import { Spinner } from "@/components/tui/spinner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const sb = getSupabaseClient();
    void sb.auth.getSession().then((result: { data: { session: Session | null } }) => {
      if (result.data.session) router.replace("/dashboard");
      else setChecking(false);
    }).catch(() => setChecking(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    const sb = getSupabaseClient();
    try {
      if (mode === "login") {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("[ok] check your email to confirm registration");
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "auth error");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner text="loading" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="border border-white/20 font-mono">
          <div className="border-b border-white/20 px-4 py-3 text-xs text-white/50 overflow-hidden">
            <pre className="text-white/80 leading-4 overflow-x-auto text-[10px] sm:text-xs whitespace-pre">{`  ____  _                 _ __     _____ _
 / ___|| | ___  _   _  __| |\\ \\   / /_ _| |__   ___
| |    | |/ _ \\| | | |/ _\` | \\ \\ / / | || '_ \\ / _ \\
| |___ | | (_) | |_| | (_| |  \\ V /  | || |_) |  __/
 \\____||_|\\___/ \\__,_|\\__,_|   \\_/  |___|_.__/ \\___|`}</pre>
            <div className="mt-2 text-white/30">cursor cloud agents manager</div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setMode("login")}
                className={mode === "login" ? "text-white" : "text-white/40 hover:text-white"}
              >
                {mode === "login" ? "[login]" : "login"}
              </button>
              <span className="text-white/20">|</span>
              <button
                onClick={() => setMode("register")}
                className={mode === "register" ? "text-white" : "text-white/40 hover:text-white"}
              >
                {mode === "register" ? "[register]" : "register"}
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <TuiInput
                label="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                autoComplete="email"
              />
              <TuiInput
                label="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              {err && <div className="text-xs text-red-400">[error] {err}</div>}
              {msg && <div className="text-xs text-green-400">{msg}</div>}
              <div className="pt-1">
                {loading ? (
                  <Spinner text={mode === "login" ? "signing in" : "creating account"} />
                ) : (
                  <TuiButton type="submit">
                    {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
                  </TuiButton>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
