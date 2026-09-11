"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const KEY = "vera_admin_ok";

export default function AdminLoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") || "");
    // Default PIN — change later in code or we add to settings
    if (password === "vera2026") {
      localStorage.setItem(KEY, "1");
      router.push("/admin/products");
      return;
    }
    setErr("Wrong password");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form className="card w-full max-w-sm p-6 space-y-4" onSubmit={onSubmit}>
        <h1 className="font-display text-2xl">Admin</h1>
        <p className="text-sm text-[var(--muted)]">Default password: vera2026 — change after launch.</p>
        <input name="password" type="password" required placeholder="Password" className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
        {err ? <p className="text-sm text-[var(--danger)]">{err}</p> : null}
        <button type="submit" className="btn btn-primary w-full">Enter</button>
      </form>
    </div>
  );
}
