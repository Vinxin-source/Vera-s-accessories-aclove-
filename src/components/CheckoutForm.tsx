"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatNGN } from "@/data/products";
import {
  clearCart,
  getCart,
  getProductById,
  getSettings,
  saveOrder,
  type Order,
  type StoreSettings,
} from "@/lib/store";

const SHIPPING = 2500;

export function CheckoutForm() {
  const router = useRouter();
  const [cart, setCart] = useState(getCart());
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    setCart(getCart());
    setSettings(getSettings());
  }, []);

  const lines = useMemo(() => {
    return cart
      .map((c) => {
        const p = getProductById(c.productId);
        if (!p) return null;
        return { product: p, qty: c.qty, lineTotal: p.price * c.qty };
      })
      .filter(Boolean) as {
      product: NonNullable<ReturnType<typeof getProductById>>;
      qty: number;
      lineTotal: number;
    }[];
  }, [cart]);

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const total = subtotal + (lines.length ? SHIPPING : 0);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!lines.length) return;
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const order: Order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "new",
      customer: {
        name: String(form.get("name") || ""),
        phone: String(form.get("phone") || ""),
        email: String(form.get("email") || "") || undefined,
        address: String(form.get("address") || ""),
        city: String(form.get("city") || ""),
        note: String(form.get("note") || "") || undefined,
      },
      items: lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        price: l.product.price,
        qty: l.qty,
      })),
      subtotal,
      shipping: SHIPPING,
      total,
    };
    saveOrder(order);
    clearCart();
    router.push(`/checkout/success?id=${order.id}`);
  }

  if (!lines.length) {
    return (
      <div className="card p-6 text-center">
        <p className="text-[var(--muted)]">Cart is empty.</p>
        <Link href="/shop" className="btn btn-primary mt-4 inline-flex">Shop</Link>
      </div>
    );
  }

  const hasBank = settings?.bankName && settings?.accountNumber;

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <form className="card space-y-4 p-6 lg:col-span-3" onSubmit={onSubmit}>
        <h2 className="font-display text-xl">Delivery details</h2>
        <input name="name" required placeholder="Full name" className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
        <input name="phone" required placeholder="Phone / WhatsApp" className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
        <input name="email" type="email" placeholder="Email (optional)" className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
        <input name="address" required placeholder="Address" className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
        <input name="city" required placeholder="City" className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
        <textarea name="note" placeholder="Note (optional)" rows={2} className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
        <button type="submit" className="btn btn-primary w-full" disabled={saving}>
          {saving ? "Placing order…" : "Place order"}
        </button>
      </form>

      <aside className="space-y-4 lg:col-span-2">
        <div className="card p-6">
          <h2 className="font-display text-xl">Summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {lines.map((l) => (
              <li key={l.product.id} className="flex justify-between gap-2">
                <span>{l.product.name} × {l.qty}</span>
                <span>{formatNGN(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-[var(--line)] pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatNGN(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatNGN(SHIPPING)}</span></div>
            <div className="flex justify-between font-medium text-base pt-1"><span>Total</span><span>{formatNGN(total)}</span></div>
          </div>
        </div>

        <div className="card border-[var(--rose)]/20 bg-[var(--gold-soft)]/50 p-6">
          <h2 className="font-display text-lg">Pay to this account</h2>
          {hasBank ? (
            <dl className="mt-3 space-y-2 text-sm">
              <div><dt className="text-[var(--muted)]">Bank</dt><dd className="font-medium">{settings?.bankName}</dd></div>
              <div><dt className="text-[var(--muted)]">Account name</dt><dd className="font-medium">{settings?.accountName}</dd></div>
              <div><dt className="text-[var(--muted)]">Account number</dt><dd className="font-medium tracking-wide">{settings?.accountNumber}</dd></div>
            </dl>
          ) : (
            <p className="mt-3 text-sm text-[var(--muted)]">
              Bank details not set. Owner adds them in Admin → Settings.
            </p>
          )}
          {settings?.shippingNote ? (
            <p className="mt-4 text-xs text-[var(--muted)]">{settings.shippingNote}</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
