"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { updateOwnPassword } from "@/lib/auth-admin";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const fd = new FormData(e.currentTarget);
    const pw = String(fd.get("password") || "");
    const confirm = String(fd.get("confirm") || "");
    if (pw.length < 6) return setErr("At least 6 characters");
    if (pw !== confirm) return setErr("Passwords don't match");
    setLoading(true);
    try {
      await updateOwnPassword(pw);
      router.replace("/admin/login");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Could not update password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#e8e0f5" }}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg space-y-5">
        <h1 className="text-2xl font-serif">Set a new password</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input name="password" type="password" required placeholder="New password"
            className="w-full rounded-xl border border-gray-200 px-3 py-3" />
          <input name="confirm" type="password" required placeholder="Confirm new password"
            className="w-full rounded-xl border border-gray-200 px-3 py-3" />
          <button type="submit" disabled={loading}
            className="w-full rounded-full bg-purple-700 py-3 text-white font-medium disabled:opacity-60">
            {loading ? "Saving…" : "Save password"}
          </button>
        </form>
        {err ? <p className="text-sm text-red-600">{err}</p> : null}
      </div>
    </div>
  );
}
