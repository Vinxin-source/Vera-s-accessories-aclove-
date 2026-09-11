import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="card p-8 animate-fade-up">
          <p className="text-[var(--rose)] text-sm font-semibold uppercase tracking-wide">
            Order received
          </p>
          <h1 className="mt-3 font-display text-3xl">Thank you</h1>
          <p className="mt-3 text-[var(--muted)]">
            {id ? (
              <>
                Your order <strong className="text-[var(--ink)]">{id}</strong> is in. Vera will
                confirm shortly.
              </>
            ) : (
              "Your order is in. We’ll confirm shortly."
            )}
          </p>
          <Link href="/shop" className="btn btn-primary mt-6 inline-flex">
            Continue shopping
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
