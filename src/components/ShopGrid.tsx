"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getProducts } from "@/lib/store";
import type { Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export function ShopGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const params = useSearchParams();
  const category = params.get("category") || "all";
  const q = (params.get("q") || "").toLowerCase();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (p.name + p.description + p.tags.join(" ")).toLowerCase().includes(q);
    });
  }, [products, category, q]);

  if (!products.length) {
    return (
      <div className="card p-12 text-center animate-fade-up">
        <p className="font-display text-xl">No products listed yet</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          New items will show here when available. Contact us for sourcing requests.
        </p>
        <Link href="/contact" className="btn btn-primary mt-6 inline-flex">
          Contact us
        </Link>
      </div>
    );
  }

  if (!filtered.length) {
    return <p className="text-center text-[var(--muted)] py-12">No matches.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {filtered.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
