import { Suspense } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ShopGrid } from "@/components/ShopGrid";

export default function ShopPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl md:text-4xl">Shop</h1>
          <p className="mt-2 text-[var(--muted)]">All pieces — filter by category or search.</p>
        </div>
        <Suspense fallback={<p className="text-sm text-[var(--muted)]">Loading shop…</p>}>
          <ShopGrid />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
