"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { sendPasswordReset } from "@/lib/auth-admin";

export default function ForgotPasswordPage() {
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    const email = String(new FormData(e.currentTarget).get("email") || "").trim();
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Could not send email");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#e8e0f5" }}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg space-y-5">
        <h1 className="text-2xl font-serif">Reset password</h1>

        {sent ? (
          <p className="text-sm text-green-700">Check your email for a reset link.</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-xs font-medium text-gray-500">Email</label>
            <input name="email" type="email" required placeholder="you@gmail.com"
              className="w-full rounded-xl border border-gray-200 px-3 py-3" />
            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-purple-700 py-3 text-white font-medium disabled:opacity-60">
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        {err ? <p className="text-sm text-red-600">{err}</p> : null}
        <Link href="/admin/login" className="block text-center text-sm text-gray-500">← Back to login</Link>
      </div>
    </div>
  );
}
