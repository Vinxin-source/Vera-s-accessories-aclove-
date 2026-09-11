"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/data/products";
import { DELIVERY_LABELS, LOCATION_LABELS, formatNGN } from "@/data/products";
import { addToCart, getProductBySlug } from "@/lib/store";

export function ProductDetail({ slug }: { slug: string }) {
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setProduct(getProductBySlug(slug) ?? null);
  }, [slug]);

  if (product === undefined) {
    return <p className="text-sm text-[var(--muted)]">Loading…</p>;
  }
  if (!product) {
    return (
      <p>
        Product not found.{" "}
        <Link href="/shop" className="text-[var(--rose)]">
          Back to shop
        </Link>
      </p>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 animate-fade-up">
      <div className="aspect-[4/5] overflow-hidden rounded-[20px] bg-[var(--gold-soft)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.images[0] || ""} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{product.category}</p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">{product.name}</h1>
        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-[var(--rose-deep)]">
            {formatNGN(product.price)}
          </span>
          {product.compareAt ? (
            <span className="text-[var(--muted)] line-through">{formatNGN(product.compareAt)}</span>
          ) : null}
        </div>
        <p className="mt-6 leading-relaxed text-[var(--muted)]">{product.description}</p>
        <div className="mt-4 space-y-2 text-sm">
          {product.inStock ? (
            <p className="text-[var(--success)]">Available ({product.stock})</p>
          ) : (
            <p className="text-[var(--danger)]">Out of stock</p>
          )}
          {product.stockLocation ? (
            <p className="text-[var(--muted)]">{LOCATION_LABELS[product.stockLocation]}</p>
          ) : null}
          {product.deliveryWindow ? (
            <p className="rounded-full bg-[var(--gold-soft)] inline-block px-3 py-1 font-medium text-[var(--ink)]">
              Estimated delivery: {DELIVERY_LABELS[product.deliveryWindow]}
            </p>
          ) : null}
          {product.minOrderQty && product.minOrderQty > 1 ? (
            <p className="text-[var(--muted)]">Minimum order: {product.minOrderQty}</p>
          ) : null}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <input
            type="number"
            min={1}
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="input !w-20"
          />
          <button
            type="button"
            className="btn btn-primary"
            disabled={!product.inStock}
            onClick={() => {
              addToCart(product.id, qty);
              setAdded(true);
              setTimeout(() => setAdded(false), 2000);
            }}
          >
            {added ? "Added ✓" : "Add to cart"}
          </button>
          <Link href="/cart" className="btn btn-secondary">
            View cart
          </Link>
        </div>
      </div>
    </div>
  );
}
