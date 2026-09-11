"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getSettings } from "@/lib/store";

export function SiteFooter() {
  const [name, setName] = useState("Vera's Accessories Aclove");
  const [ig, setIg] = useState("https://www.instagram.com/vera_accessories_aclove");
  const [tagline, setTagline] = useState("China procurement · Personal shopper · Trusted imports");

  useEffect(() => {
    const s = getSettings();
    setName(s.storeName);
    setIg(s.instagram);
    if (s.tagline) setTagline(s.tagline);
  }, []);

  return (
    <footer className="mt-auto border-t border-[var(--line)] bg-[var(--gold-soft)]/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:justify-between">
        <div>
          <p className="font-display text-lg">{name}</p>
          <p className="mt-1 max-w-xs text-sm text-[var(--muted)]">{tagline}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          <Link href="/shop" className="hover:text-[var(--ink)]">Shop</Link>
          <Link href="/about" className="hover:text-[var(--ink)]">About</Link>
          <Link href="/contact" className="hover:text-[var(--ink)]">Contact</Link>
          <Link href="/cart" className="hover:text-[var(--ink)]">Cart</Link>
          <a href={ig} target="_blank" rel="noreferrer" className="hover:text-[var(--ink)]">Instagram</a>
        </div>
      </div>
      {/* Admin is only at /admin/login — not listed for shoppers */}
    </footer>
  );
}
