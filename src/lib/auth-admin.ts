"use client";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function signInWithEmail(email: string) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const { error } = await sb.auth.signInWithOtp({
    email: email.trim(),
    options: {
      emailRedirectTo: `${origin}/admin/callback`,
    },
  });
  if (error) throw error;
}

export async function signOutAdmin() {
  const sb = getSupabase();
  if (sb) await sb.auth.signOut();
  if (typeof window !== "undefined") {
    localStorage.removeItem("vera_admin_session");
  }
}

export async function getAdminSession() {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session;
}

export async function isAdminAuthed() {
  const session = await getAdminSession();
  return Boolean(session?.user);
}
