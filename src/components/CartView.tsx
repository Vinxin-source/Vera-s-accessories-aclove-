"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatNGN } from "@/data/products";
import { getCart, getProductById, updateCartQty, type CartItem } from "@/lib/store";

export function CartView() {
  const [cart, setCart] = useState<CartItem[]>([]);

  function refresh() {
    setCart(getCart());
  }

  useEffect(() => {
    refresh();
    const onCart = () => refresh();
    window.addEventListener("vera-cart", onCart);
    return () => window.removeEventListener("vera-cart", onCart);
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

  if (!lines.length) {
    return (
      <div className="card mx-auto max-w-md p-10 text-center animate-fade-up">
        <p className="font-display text-xl">Your cart is empty</p>
        <p className="mt-2 text-sm text-[var(--muted)]">Browse the shop and add items you like.</p>
        <Link href="/shop" className="btn btn-primary mt-6 inline-flex">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5 animate-fade-up">
      <div className="space-y-4 lg:col-span-3">
        {lines.map(({ product, qty, lineTotal }) => (
          <div key={product.id} className="card flex gap-4 p-4">
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[var(--gold-soft)]">
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0]} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/product/${product.slug}`} className="font-medium hover:text-[var(--rose)]">
                {product.name}
              </Link>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {formatNGN(product.price)} each
                {product.stock != null ? ` · ${product.stock} left` : ""}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-full border border-[var(--line)]">
                  <button
                    type="button"
                    className="px-3 py-1 text-lg"
                    onClick={() => updateCartQty(product.id, qty - 1)}
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-sm">{qty}</span>
                  <button
                    type="button"
                    className="px-3 py-1 text-lg"
                    disabled={qty >= (product.stock || 99)}
                    onClick={() => updateCartQty(product.id, Math.min(qty + 1, product.stock || qty + 1))}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="text-sm text-[var(--danger)]"
                  onClick={() => updateCartQty(product.id, 0)}
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-semibold text-[var(--rose-deep)]">{formatNGN(lineTotal)}</p>
          </div>
        ))}
        <Link href="/shop" className="text-sm text-[var(--rose)]">
          ← Keep shopping
        </Link>
      </div>

      <aside className="card h-fit p-6 lg:col-span-2">
        <h2 className="font-display text-xl">Order summary</h2>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-[var(--muted)]">Subtotal</span>
          <span className="font-medium">{formatNGN(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">Shipping calculated at checkout</p>
        <Link href="/checkout" className="btn btn-primary mt-6 w-full">
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
