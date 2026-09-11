"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSettings } from "@/lib/store";

export function SiteFooter() {
  const [name, setName] = useState("Vera's Accessories Aclove");
  const [ig, setIg] = useState("https://www.instagram.com/vera_accessories_aclove");

  useEffect(() => {
    const s = getSettings();
    setName(s.storeName);
    setIg(s.instagram);
  }, []);

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--gold-soft)]/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-lg">{name}</p>
          <p className="mt-1 max-w-xs text-sm text-[var(--muted)]">
            China procurement · Personal shopper · Trusted imports
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          <Link href="/shop" className="hover:text-[var(--ink)]">Shop</Link>
          <Link href="/contact" className="hover:text-[var(--ink)]">Contact</Link>
          <a href={ig} target="_blank" rel="noreferrer" className="hover:text-[var(--ink)]">Instagram</a>
          <Link href="/admin/products" className="hover:text-[var(--ink)]">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
