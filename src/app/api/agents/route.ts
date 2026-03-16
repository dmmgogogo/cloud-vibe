import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getActiveApiKey } from "@/lib/get-api-key";
import { listAgents, createAgent } from "@/lib/cursor-api";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apiKey = await getActiveApiKey();
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 50;
    const cursor = searchParams.get("cursor") ?? undefined;

    const data = await listAgents(apiKey, { limit, cursor });
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Unauthorized") return NextResponse.json({ error: message }, { status: 401 });
    if (message === "No API key configured") return NextResponse.json({ error: message }, { status: 400 });
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const apiKey = await getActiveApiKey();
    const body = await request.json();
    const data = await createAgent(apiKey, body);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
