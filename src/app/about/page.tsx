import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-2xl flex-1 px-4 py-12 animate-fade-up">
        <h1 className="font-display text-4xl">About Vera</h1>
        <p className="mt-6 leading-relaxed text-[var(--muted)]">
          Vera Accessories Aclove creates and curates jewelry and handmade accessories for women
          who want pieces that feel personal — from daily chains to celebration sets and bead kits
          for makers.
        </p>
        <p className="mt-4 leading-relaxed text-[var(--muted)]">
          This store is the online home of the same brand you know on Instagram: clear prices, easy
          cart, and orders the team can fulfil without stress.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
