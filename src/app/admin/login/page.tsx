"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithPassword, isAdminAuthed } from "@/lib/auth-admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    isAdminAuthed().then((ok) => {
      if (ok) router.replace("/admin/products");
    });
  }, [router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    try {
      await signInWithPassword(email, password);
      router.replace("/admin/products");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Could not sign in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#e8e0f5" }}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg space-y-5">
        <div>
          <h1 className="text-2xl font-serif">Admin login</h1>
          <p className="mt-1 text-sm text-gray-500">Owners only — not for customers</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <label className="block text-xs font-medium text-gray-500">Email</label>
          <input name="email" type="email" required placeholder="you@gmail.com"
            className="w-full rounded-xl border border-gray-200 px-3 py-3" />

          <label className="block text-xs font-medium text-gray-500">Password</label>
          <input name="password" type="password" required placeholder="Password"
            className="w-full rounded-xl border border-gray-200 px-3 py-3" />

          <button type="submit" disabled={loading}
            className="w-full rounded-full bg-purple-700 py-3 text-white font-medium disabled:opacity-60">
            {loading ? "Signing in…" : "Enter admin"}
          </button>
        </form>

        <Link href="/admin/forgot-password" className="block text-center text-sm text-purple-700">
          Forgot password?
        </Link>

        {err ? <p className="text-sm text-red-600">{err}</p> : null}

        <Link href="/" className="block text-center text-sm text-gray-500">← Back to shop</Link>
      </div>
    </div>
  );
}
