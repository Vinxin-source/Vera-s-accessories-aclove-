import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = (
  process.env.NEXT_PUBLIC_SUPABASE_URL || ""
).trim();

const key = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  ""
).trim();

export function isSupabaseConfigured() {
  return Boolean(url && key && url.startsWith("http"));
}

let client: SupabaseClient | null = null;

export function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!client) client = createClient(url, key);
  return client;
}
