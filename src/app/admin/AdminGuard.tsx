"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAdminLoggedIn, setAdminLoggedIn } from "@/lib/store";

const nav = [
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const isLogin = path === "/admin/login";

  useEffect(() => {
    if (isLogin) {
      setReady(true);
      return;
    }
    if (!isAdminLoggedIn()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [path, isLogin, router]);

  if (isLogin) {
    return <div className="min-h-screen bg-[var(--bg)]">{children}</div>;
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[var(--muted)]">
        Checking admin…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f0ff]">
      <header className="border-b border-[var(--line)] bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted)]">Store admin</p>
            <p className="font-display text-lg text-[var(--rose)]">Dashboard</p>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-3 py-1.5 ${
                  path.startsWith(n.href)
                    ? "bg-[var(--rose)] text-white"
                    : "bg-[var(--gold-soft)] text-[var(--ink)]"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <Link href="/" className="rounded-full px-3 py-1.5 text-[var(--muted)]">
              View shop
            </Link>
            <button
              type="button"
              className="rounded-full px-3 py-1.5 text-[var(--muted)]"
              onClick={() => {
                setAdminLoggedIn(false);
                router.push("/admin/login");
              }}
            >
              Log out
            </button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-4xl">{children}</div>
    </div>
  );
          }
