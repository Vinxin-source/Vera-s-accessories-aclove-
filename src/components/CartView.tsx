"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatNGN } from "@/data/products";
import {
  getCart,
  getProductById,
  updateCartQty,
  type CartItem,
} from "@/lib/store";

export function CartView() {
  const [cart, setCart] = useState<CartItem[]>([]);

  function refresh() {
    setCart(getCart());
  }

  useEffect(() => {
    refresh();
    window.addEventListener("vera-cart", refresh);
    return () => window.removeEventListener("vera-cart", refresh);
  }, []);

  const lines = useMemo(() => {
    return cart
      .map((c) => {
        const p = getProductById(c.productId);
        if (!p) return null;
        return { ...c, product: p, lineTotal: p.price * c.qty };
      })
      .filter(Boolean) as {
      productId: string;
      qty: number;
      product: NonNullable<ReturnType<typeof getProductById>>;
      lineTotal: number;
    }[];
  }, [cart]);

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);

  if (lines.length === 0) {
    return (
      <div className="card p-8 text-center animate-fade-up">
        <p className="text-[var(--muted)]">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-primary mt-4 inline-flex">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-up">
      {lines.map((l) => (
        <div key={l.productId} className="card flex gap-4 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={l.product.images[0]}
            alt=""
            className="h-24 w-20 rounded-lg object-cover"
          />
          <div className="flex-1">
            <p className="font-medium">{l.product.name}</p>
            <p className="text-sm text-[var(--muted)]">{formatNGN(l.product.price)}</p>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                className="btn btn-ghost !px-2 !py-1"
                onClick={() => updateCartQty(l.productId, l.qty - 1)}
              >
                −
              </button>
              <span className="text-sm w-6 text-center">{l.qty}</span>
              <button
                type="button"
                className="btn btn-ghost !px-2 !py-1"
                onClick={() => updateCartQty(l.productId, l.qty + 1)}
              >
                +
              </button>
            </div>
          </div>
          <p className="font-semibold">{formatNGN(l.lineTotal)}</p>
        </div>
      ))}
      <div className="card p-5">
        <div className="flex justify-between text-sm">
          <span className="text-[var(--muted)]">Subtotal</span>
          <span className="font-semibold">{formatNGN(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">Shipping calculated at checkout.</p>
        <Link href="/checkout" className="btn btn-primary mt-4 w-full">
          Checkout
        </Link>
      </div>
    </div>
  );
}
