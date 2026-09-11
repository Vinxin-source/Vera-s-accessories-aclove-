"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatNGN } from "@/data/products";
import { getOrders, updateOrderStatus, type Order, type OrderStatus } from "@/lib/store";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "awaiting_payment", label: "Awaiting payment" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "new", label: "New" },
];

function badge(status: string) {
  if (status === "paid") return "bg-emerald-100 text-emerald-800";
  if (status === "awaiting_payment" || status === "new") return "bg-amber-100 text-amber-900";
  if (status === "shipped" || status === "delivered") return "bg-blue-100 text-blue-900";
  if (status === "cancelled") return "bg-red-100 text-red-800";
  return "bg-[var(--line)] text-[var(--ink)]";
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  function refresh() {
    setOrders(getOrders());
  }

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fade-up">
      <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
        <Link href="/admin/products">Products</Link>
        <span>·</span>
        <Link href="/admin/settings">Settings</Link>
        <span>·</span>
        <Link href="/admin/login">Admin home</Link>
      </div>
      <h1 className="mt-4 font-display text-3xl">Orders</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        When a customer transfers money, open the order and mark <strong>Paid</strong>.
      </p>

      <ul className="mt-8 space-y-4">
        {orders.length === 0 ? (
          <li className="card p-10 text-center text-[var(--muted)]">No orders yet.</li>
        ) : (
          orders.map((o) => (
            <li key={o.id} className="card p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">{o.id}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${badge(o.status)}`}>
                  {STATUSES.find((s) => s.value === o.status)?.label || o.status}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)]">{new Date(o.createdAt).toLocaleString()}</p>
              <p className="text-sm">
                {o.customer.name} · {o.customer.phone}
              </p>
              <p className="text-sm text-[var(--muted)]">
                {o.customer.address}, {o.customer.city}
              </p>
              <ul className="text-sm space-y-1 border-t border-[var(--line)] pt-3">
                {o.items.map((i) => (
                  <li key={i.productId}>
                    {i.name} × {i.qty} — {formatNGN(i.price * i.qty)}
                  </li>
                ))}
              </ul>
              <p className="font-semibold">Total {formatNGN(o.total)}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  className="btn btn-primary !py-2 text-sm"
                  onClick={() => {
                    updateOrderStatus(o.id, "paid");
                    refresh();
                  }}
                >
                  Mark paid
                </button>
                <button
                  type="button"
                  className="btn btn-secondary !py-2 text-sm"
                  onClick={() => {
                    updateOrderStatus(o.id, "shipped");
                    refresh();
                  }}
                >
                  Mark shipped
                </button>
                <select
                  className="rounded-full border border-[var(--line)] px-3 py-2 text-sm"
                  value={o.status}
                  onChange={(e) => {
                    updateOrderStatus(o.id, e.target.value as OrderStatus);
                    refresh();
                  }}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
