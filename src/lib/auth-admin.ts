"use client";

import { getSupabase } from "@/lib/supabase";
import { setAdminLoggedIn } from "@/lib/store";

export async function signInWithPassword(email: string, password: string) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  setAdminLoggedIn(true); // keeps your other admin pages' checks working
}

export async function sendPasswordReset(email: string) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const { error } = await sb.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: `${origin}/admin/reset-password`,
  });
  if (error) throw error;
}

export async function updateOwnPassword(newPassword: string) {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase not configured");
  const { error } = await sb.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function signOutAdmin() {
  const sb = getSupabase();
  if (sb) await sb.auth.signOut();
  setAdminLoggedIn(false);
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
