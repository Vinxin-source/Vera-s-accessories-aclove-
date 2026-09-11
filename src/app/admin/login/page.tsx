"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  checkAdminPassword,
  isAdminLoggedIn,
  setAdminLoggedIn,
} from "@/lib/store";

export default function AdminLoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAdminLoggedIn());
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") || "");
    if (checkAdminPassword(password)) {
      setAdminLoggedIn(true);
      setLoggedIn(true);
      router.push("/admin/products");
      return;
    }
    setErr("Wrong password");
  }

  if (loggedIn) {
    return (
      <div className="min-h-screen bg-[var(--bg)] px-4 py-12">
        <div className="mx-auto max-w-md space-y-4 animate-fade-up">
          <h1 className="font-display text-3xl">Store admin</h1>
          <p className="text-sm text-[var(--muted)]">
            Separate from the public shop. Customers never see this menu.
          </p>
          <div className="grid gap-3">
            <Link href="/admin/products" className="card p-4 font-medium hover:border-[var(--rose)] transition-colors">
              Products →
            </Link>
            <Link href="/admin/orders" className="card p-4 font-medium hover:border-[var(--rose)] transition-colors">
              Orders (mark paid) →
            </Link>
            <Link href="/admin/settings" className="card p-4 font-medium hover:border-[var(--rose)] transition-colors">
              Settings (bank, colours, about, password) →
            </Link>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setAdminLoggedIn(false);
                setLoggedIn(false);
              }}
            >
              Log out
            </button>
            <Link href="/" className="text-center text-sm text-[var(--muted)]">
              ← View public shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <form className="card w-full max-w-sm p-6 space-y-4 animate-fade-up" onSubmit={onSubmit}>
        <h1 className="font-display text-2xl">Admin login</h1>
        <p className="text-sm text-[var(--muted)]">
          Not part of the customer shop. Default password <strong>vera2026</strong> until changed in
          Settings.
        </p>
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5"
        />
        {err ? <p className="text-sm text-[var(--danger)]">{err}</p> : null}
        <button type="submit" className="btn btn-primary w-full">
          Enter admin
        </button>
        <Link href="/" className="block text-center text-sm text-[var(--muted)]">
          ← Back to shop
        </Link>
      </form>
    </div>
  );
}
