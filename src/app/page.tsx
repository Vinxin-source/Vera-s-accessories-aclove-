import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { HomeFeatured } from "@/components/HomeFeatured";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-30 blur-3xl"
            style={{ background: "var(--rose)" }}
          />
          <div
            className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
            style={{ background: "var(--accent)" }}
          />
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
            <div className="animate-fade-up relative z-10">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--rose)] font-medium">
                Vera&apos;s Accessories Aclove
              </p>
              <h1 className="mt-4 font-display text-4xl leading-[1.15] text-[var(--ink)] md:text-5xl">
                China procurement &amp; accessories —
                <span className="text-[var(--rose)]"> sourced with care</span>
              </h1>
              <p className="mt-5 max-w-md text-[var(--muted)] leading-relaxed">
                Personal shopper · Preorders · Product sourcing · RMB exchange · Trusted imports.
                Clear delivery times on every product — from days in Lagos to months from China.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/shop" className="btn btn-primary">
                  Browse shop
                </Link>
                <Link href="/contact" className="btn btn-secondary">
                  Contact us
                </Link>
              </div>
            </div>
            <div className="animate-scale-in stagger-2 relative z-10">
              <div className="animate-float flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-lg)]">
                <div className="px-8 text-center">
                  <div
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-white text-xl font-display"
                    style={{ background: "var(--rose)" }}
                  >
                    V
                  </div>
                  <p className="font-display text-3xl text-[var(--ink)]">Aclove</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Your catalog · your colours · your bank</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <HomeFeatured />
      </main>
      <SiteFooter />
    </div>
  );
}
