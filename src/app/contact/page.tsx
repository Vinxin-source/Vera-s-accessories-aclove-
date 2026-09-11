"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getSettings, type StoreSettings } from "@/lib/store";

export default function ContactPage() {
  const [s, setS] = useState<StoreSettings | null>(null);
  useEffect(() => setS(getSettings()), []);

  const wa = s?.whatsapp?.replace(/\D/g, "");
  const waLink = wa ? `https://wa.me/${wa}` : s?.instagram || "https://www.instagram.com/vera_accessories_aclove";

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-xl flex-1 px-4 py-12 animate-fade-up">
        <h1 className="font-display text-4xl">Contact us</h1>
        <p className="mt-4 text-[var(--muted)] leading-relaxed">
          {s?.tagline ||
            "China procurement, personal shopping, preorders, and trusted imports."}
        </p>
        <div className="mt-8 space-y-3">
          {wa ? (
            <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-primary inline-flex">
              WhatsApp {s?.whatsapp}
            </a>
          ) : (
            <p className="text-sm text-[var(--muted)]">
              WhatsApp number not set yet — add it in Admin → Settings.
            </p>
          )}
          <div>
            <a
              href={s?.instagram || "https://www.instagram.com/vera_accessories_aclove"}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary inline-flex"
            >
              Instagram
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
