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
    setItems(all.filter((p) => p.featured).slice(0, 4).length
      ? all.filter((p) => p.featured).slice(0, 4)
      : all.slice(0, 4));
  }, []);

  if (!items.length) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 text-center animate-fade-up">
        <h2 className="font-display text-2xl">Shop is ready</h2>
        <p className="mx-auto mt-3 max-w-md text-[var(--muted)]">
          Products will appear here when the store owner adds them in Admin. Catalog is empty on
          purpose — no demo clutter.
        </p>
        <Link href="/admin/products" className="btn btn-primary mt-6 inline-flex">
          Open admin · add products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <h2 className="font-display text-2xl md:text-3xl">Featured</h2>
        <Link href="/shop" className="text-sm text-[var(--rose)]">View all</Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((p, i) => (
          <div key={p.id} className={`animate-fade-up stagger-${Math.min(3, i + 1)}`}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
