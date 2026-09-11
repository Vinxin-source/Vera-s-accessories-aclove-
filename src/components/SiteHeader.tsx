"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cartCount, getSettings, type StoreSettings } from "@/lib/store";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const name = settings?.storeName || "Vera's Accessories Aclove";
  const short = name.length > 22 ? "Vera Aclove" : name;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--bg)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-display text-lg tracking-wide text-[var(--ink)]">
          {settings?.logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logoDataUrl} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
          ) : null}
          <span className="truncate">
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

        <nav className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "text-[var(--rose)] font-medium" : "hover:text-[var(--ink)]"}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/cart"
            className="btn btn-secondary !py-2 !px-3 text-sm relative"
          >
            Cart
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--rose)] px-1 text-[10px] text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="btn btn-ghost md:hidden !px-3"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-[var(--line)] px-4 py-4 md:hidden animate-fade-in">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-3 py-3 text-sm ${pathname === l.href ? "bg-[var(--gold-soft)] text-[var(--rose)] font-medium" : "text-[var(--ink)]"}`}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/cart" className="rounded-xl px-3 py-3 text-sm text-[var(--ink)]">
              Cart {count > 0 ? `(${count})` : ""}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
