"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatNGN } from "@/data/products";
import { getOrders, type Order } from "@/lib/store";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fade-up">
      <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
        <Link href="/admin/products">Products</Link>
        <span>·</span>
        <Link href="/admin/settings">Settings</Link>
      </div>
      <h1 className="mt-4 font-display text-3xl">Orders</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">New orders from checkout appear here on this device.</p>

      <ul className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <li className="card p-10 text-center text-[var(--muted)]">No orders yet.</li>
        ) : (
          orders.map((o) => (
            <li key={o.id} className="card p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-medium">{o.id}</p>
                <p className="text-sm text-[var(--muted)]">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-2 text-sm">
                {o.customer.name} · {o.customer.phone}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {o.customer.address}, {o.customer.city}
              </p>
              <ul className="mt-3 text-sm space-y-1">
                {o.items.map((i) => (
                  <li key={i.productId}>
                    {i.name} × {i.qty} — {formatNGN(i.price * i.qty)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 font-medium">Total {formatNGN(o.total)}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
