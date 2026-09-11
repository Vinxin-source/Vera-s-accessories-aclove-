"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { formatNGN } from "@/data/products";
import { getOrders, getSettings } from "@/lib/store";

function SuccessInner() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [total, setTotal] = useState<number | null>(null);
  const [bank, setBank] = useState({ name: "", accountName: "", accountNumber: "", wa: "" });

  useEffect(() => {
    const order = getOrders().find((o) => o.id === id);
    if (order) setTotal(order.total);
    const s = getSettings();
    setBank({
      name: s.bankName || "",
      accountName: s.accountName || "",
      accountNumber: s.accountNumber || "",
      wa: s.whatsapp || "",
    });
  }, [id]);

  const wa = bank.wa.replace(/\D/g, "");
  const waLink = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent("Hello, I paid for order " + id)}`
    : null;

  return (
    <div className="card mx-auto max-w-lg p-8 text-center animate-fade-up">
      <p className="text-sm uppercase tracking-wide text-[var(--success)]">Order placed</p>
      <h1 className="mt-2 font-display text-3xl">Thank you</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">Order ID: {id || "—"}</p>
      {total != null ? (
        <p className="mt-4 text-xl font-semibold text-[var(--rose-deep)]">{formatNGN(total)}</p>
      ) : null}

      <div className="mt-6 rounded-2xl bg-[var(--gold-soft)]/60 p-4 text-left text-sm">
        <p className="font-medium">How to complete payment</p>
        <ol className="mt-2 list-decimal space-y-1 pl-4 text-[var(--muted)]">
          <li>Transfer the total to the account below</li>
          <li>Send payment proof on WhatsApp with your order ID</li>
          <li>We mark your order as <strong>Paid</strong> when confirmed</li>
        </ol>
        {(bank.name || bank.accountNumber) && (
          <dl className="mt-4 space-y-1 border-t border-[var(--line)] pt-3">
            {bank.name ? <div><dt className="text-[var(--muted)]">Bank</dt><dd className="font-medium">{bank.name}</dd></div> : null}
            {bank.accountName ? <div><dt className="text-[var(--muted)]">Name</dt><dd className="font-medium">{bank.accountName}</dd></div> : null}
            {bank.accountNumber ? <div><dt className="text-[var(--muted)]">Number</dt><dd className="font-medium tracking-wide">{bank.accountNumber}</dd></div> : null}
          </dl>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {waLink ? (
          <a href={waLink} target="_blank" rel="noreferrer" className="btn btn-primary">
            Send proof on WhatsApp
          </a>
        ) : null}
        <Link href="/shop" className="btn btn-secondary">
          Back to shop
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 px-4 py-12">
        <Suspense fallback={<p className="text-center text-sm text-[var(--muted)]">Loading…</p>}>
          <SuccessInner />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
