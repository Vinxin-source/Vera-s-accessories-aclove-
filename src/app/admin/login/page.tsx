"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  checkAdminPassword,
  isAdminLoggedIn,
  setAdminLoggedIn,
} from "@/lib/store";
import { isSupabaseConfigured } from "@/lib/supabase";
import { signInWithEmail } from "@/lib/auth-admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasCloud, setHasCloud] = useState(false);

  useEffect(() => {
    setHasCloud(isSupabaseConfigured());
    if (isAdminLoggedIn()) router.replace("/admin/products");
  }, [router]);

  async function onMagic(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setLoading(true);
    try {
      const email = String(new FormData(e.currentTarget).get("email") || "").trim();
      await signInWithEmail(email);
      setInfo("Check your Gmail. Open the link on this phone.");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Could not send email");
    } finally {
      setLoading(false);
    }
  }

  function onPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    const password = String(new FormData(e.currentTarget).get("password") || "");
    if (checkAdminPassword(password)) {
      setAdminLoggedIn(true);
      router.push("/admin/products");
      return;
    }
    setErr("Wrong password. Use: vera2026");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#e8e0f5" }}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg space-y-5">
        <div>
          <h1 className="text-2xl font-serif">Admin login</h1>
          <p className="mt-1 text-sm text-gray-500">Owners only — not for customers</p>
        </div>

        {hasCloud ? (
          <form onSubmit={onMagic} className="space-y-3">
            <label className="block text-xs font-medium text-gray-500">Gmail</label>
            <input name="email" type="email" required placeholder="you@gmail.com"
              className="w-full rounded-xl border border-gray-200 px-3 py-3" />
            <button type="submit" disabled={loading}
              className="w-full rounded-full bg-purple-700 py-3 text-white font-medium">
              {loading ? "Sending…" : "Email me a login link"}
            </button>
          </form>
        ) : null}

        <form onSubmit={onPassword} className="space-y-3">
          <label className="block text-xs font-medium text-gray-500">Password</label>
          <input name="password" type="password" required placeholder="Password"
            className="w-full rounded-xl border border-gray-200 px-3 py-3" />
          <button type="submit"
            className="w-full rounded-full bg-purple-700 py-3 text-white font-medium">
            Enter admin
          </button>
          <p className="text-center text-xs text-gray-500">
            Default: <b>vera2026</b>
          </p>
        </form>

        {info ? <p className="text-sm text-green-700">{info}</p> : null}
        {err ? <p className="text-sm text-red-600">{err}</p> : null}

        <Link href="/" className="block text-center text-sm text-gray-500">← Back to shop</Link>
      </div>
    </div>
  );
}
