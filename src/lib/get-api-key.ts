import { createSupabaseServerClient } from "./supabase/server";
import { decrypt } from "./crypto";

export async function getActiveApiKey(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("cursor_api_keys")
    .select("encrypted_key")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (error || !data) throw new Error("No API key configured");
  return decrypt(data.encrypted_key);
}
