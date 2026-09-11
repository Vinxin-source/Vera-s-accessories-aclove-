"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import { DELIVERY_LABELS, LOCATION_LABELS, formatNGN } from "@/data/products";
import { addToCart } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const img = product.images?.[0];
  const delivery = product.deliveryWindow
    ? DELIVERY_LABELS[product.deliveryWindow]
    : null;
  const loc = product.stockLocation
    ? LOCATION_LABELS[product.stockLocation]
    : null;

  return (
    <article className="card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-up">
      <Link href={`/product/${product.slug}`} className="block relative">
        <div className="aspect-[4/5] bg-[var(--gold-soft)] overflow-hidden flex items-center justify-center">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
          ) : (
            <span className="text-sm text-[var(--muted)] px-4 text-center">{product.name}</span>
          )}
        </div>
        {delivery ? (
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-1 text-[10px] font-medium text-[var(--ink)] shadow-sm">
            {delivery}
          </span>
        ) : null}
      </Link>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
          {product.category}
          {loc ? ` · ${loc}` : ""}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-medium leading-snug">{product.name}</h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold text-[var(--rose-deep)]">{formatNGN(product.price)}</span>
          {product.compareAt ? (
            <span className="text-sm text-[var(--muted)] line-through">{formatNGN(product.compareAt)}</span>
          ) : null}
        </div>
        {product.minOrderQty && product.minOrderQty > 1 ? (
          <p className="mt-1 text-xs text-[var(--muted)]">Min order: {product.minOrderQty}</p>
        ) : null}
        {typeof product.stock === "number" ? (
          <p className="mt-1 text-xs text-[var(--muted)]">{product.stock} remaining</p>
        ) : null}
        <button
          type="button"
          className="btn btn-primary mt-4 w-full !py-2.5 text-sm"
          onClick={() => addToCart(product.id, product.minOrderQty || 1)}
          disabled={!product.inStock}
        >
          {product.inStock ? "Add to cart" : "Sold out"}
        </button>
      </div>
    </article>
  );
}
