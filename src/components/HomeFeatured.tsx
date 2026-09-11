"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts } from "@/lib/store";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export function HomeFeatured() {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const all = getProducts();
    setItems(
      all.filter((p) => p.featured).slice(0, 4).length
        ? all.filter((p) => p.featured).slice(0, 4)
        : all.slice(0, 4),
    );
  }, []);

  if (!items.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 text-center animate-fade-up">
        <h2 className="font-display text-2xl">New arrivals coming soon</h2>
        <p className="mx-auto mt-3 max-w-md text-[var(--muted)]">
          Check back shortly or message us on Instagram for sourcing and preorders.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="btn btn-primary">
            Browse shop
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact us
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl md:text-3xl">Featured</h2>
        <Link href="/shop" className="text-sm text-[var(--rose)]">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
