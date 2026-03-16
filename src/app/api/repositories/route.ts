import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveApiKey } from "@/lib/get-api-key";
import { listRepositories } from "@/lib/cursor-api";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apiKey = await getActiveApiKey();

    // Check cache first (TTL: 1 hour)
    const { data: cache } = await supabase
      .from("repo_cache")
      .select("repositories, cached_at")
      .eq("user_id", user.id)
      .single();

    if (cache) {
      const age = Date.now() - new Date(cache.cached_at).getTime();
      if (age < 3600 * 1000) {
        return NextResponse.json({ repositories: cache.repositories, cached: true });
      }
    }

    const data = await listRepositories(apiKey);

    // Upsert cache
    await supabase.from("repo_cache").upsert({
      user_id: user.id,
      repositories: data.repositories,
      cached_at: new Date().toISOString(),
    });

    return NextResponse.json({ repositories: data.repositories, cached: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
