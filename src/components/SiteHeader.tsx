"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartCount, getSettings, type StoreSettings } from "@/lib/store";

export function SiteHeader() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    const sync = () => {
      setCount(cartCount());
      setSettings(getSettings());
    };
    sync();
    window.addEventListener("vera-cart", sync);
    window.addEventListener("vera-settings", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("vera-cart", sync);
      window.removeEventListener("vera-settings", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const name = settings?.storeName || "Vera's Accessories Aclove";
  const short = name.length > 28 ? "Vera Aclove" : name;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl tracking-wide text-[var(--ink)]">
          {settings?.logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoDataUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : null}
          <span>
            {short.includes(" ") ? (
              <>
                {short.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-[var(--rose)]">{short.split(" ").slice(-1)}</span>
              </>
            ) : (
              <span className="text-[var(--rose)]">{short}</span>
            )}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-[var(--muted)] md:flex">
          <Link href="/shop" className="hover:text-[var(--ink)] transition-colors">Shop</Link>
          <Link href="/about" className="hover:text-[var(--ink)] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[var(--ink)] transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="btn btn-secondary !py-2 !px-3 text-sm relative">
            Cart
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--rose)] px-1 text-[10px] text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <button type="button" className="btn btn-ghost md:hidden !px-3" onClick={() => setOpen((v) => !v)}>
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-[var(--line)] px-4 py-3 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-3 text-sm">
            <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link>
            <Link href="/about" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
