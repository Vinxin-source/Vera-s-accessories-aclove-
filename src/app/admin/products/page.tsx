"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import type { Category, DeliveryWindow, Product, StockLocation } from "@/data/products";
import { DELIVERY_LABELS, LOCATION_LABELS, formatNGN, slugify } from "@/data/products";
import { deleteProduct, getProducts, saveProducts, upsertProduct } from "@/lib/store";

const CATS: Category[] = ["necklaces","earrings","bracelets","rings","sets","beads","bags","other"];
const WINDOWS: DeliveryWindow[] = ["1-3_days","3-7_days","7-14_days","2-4_weeks","1-2_months","2-3_months"];
const LOCS: StockLocation[] = ["nigeria","china","preorder"];

export default function AdminProductsPage() {
  const [list, setList] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [bulkMsg, setBulkMsg] = useState("");

  function refresh() { setList(getProducts()); }
  useEffect(() => { refresh(); }, []);

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const arr = Array.from(files).slice(0, 8);
    arr.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 2 * 1024 * 1024) {
        alert(file.name + " is over 2MB — skip");
        return;
      }
      const r = new FileReader();
      r.onload = () => setPhotos((prev) => [...prev, String(r.result)].slice(0, 8));
      r.readAsDataURL(file);
    });
  }

  function removePhoto(i: number) {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  }

  function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    if (!name) return;
    const urlExtra = String(form.get("image") || "").trim();
    const images = [...photos];
    if (urlExtra) images.push(urlExtra);
    const product: Product = {
      id: crypto.randomUUID(),
      name,
      slug: slugify(name) + "-" + Date.now().toString(36),
      description: String(form.get("description") || ""),
      price: Number(form.get("price") || 0),
      compareAt: form.get("compareAt") ? Number(form.get("compareAt")) : undefined,
      category: String(form.get("category") || "other") as Category,
      tags: String(form.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean),
      images,
      inStock: true,
      stock: Number(form.get("stock") || 10),
      featured: form.get("featured") === "on",
      createdAt: new Date().toISOString(),
      stockLocation: String(form.get("stockLocation") || "china") as StockLocation,
      deliveryWindow: String(form.get("deliveryWindow") || "1-2_months") as DeliveryWindow,
      minOrderQty: Number(form.get("minOrderQty") || 1) || 1,
    };
    upsertProduct(product);
    e.currentTarget.reset();
    setPhotos([]);
    setOpen(false);
    refresh();
  }

  function onBulk(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = String(new FormData(e.currentTarget).get("csv") || "");
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const existing = getProducts();
    const added: Product[] = [];
    const start = lines[0]?.toLowerCase().includes("name") ? 1 : 0;
    for (let i = start; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim());
      if (cols.length < 2) continue;
      const name = cols[0];
      const price = Number(cols[1] || 0);
      if (!name || !price) continue;
      const loc = (cols[3] || "china") as StockLocation;
      const delivery = (cols[4] || "1-2_months") as DeliveryWindow;
      added.push({
        id: crypto.randomUUID(),
        name,
        slug: slugify(name) + "-" + Date.now().toString(36) + i,
        description: cols[7] || "",
        price,
        category: (cols[2] || "other") as Category,
        tags: [],
        images: [],
        inStock: true,
        stock: Number(cols[5] || 10),
        createdAt: new Date().toISOString(),
        stockLocation: LOCS.includes(loc) ? loc : "china",
        deliveryWindow: WINDOWS.includes(delivery) ? delivery : "1-2_months",
        minOrderQty: Number(cols[6] || 1) || 1,
      });
    }
    saveProducts([...added, ...existing]);
    setBulkMsg("Added " + added.length + " products");
    setBulkOpen(false);
    refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 animate-fade-up">
      <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
        <Link href="/admin/settings">Settings</Link>
        <span>·</span>
        <Link href="/admin/orders">Orders</Link>
        <span>·</span>
        <Link href="/shop">View shop</Link>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl">Products</h1>
          <p className="text-sm text-[var(--muted)] mt-1">{list.length} items</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="btn btn-secondary" onClick={() => { setBulkOpen(!bulkOpen); setOpen(false); }}>Bulk CSV</button>
          <button type="button" className="btn btn-primary" onClick={() => { setOpen(!open); setBulkOpen(false); }}>{open ? "Close" : "Add product"}</button>
        </div>
      </div>
      {bulkMsg ? <p className="mt-3 text-sm text-[var(--success)]">{bulkMsg}</p> : null}

      {bulkOpen ? (
        <form className="card mt-6 space-y-3 p-5" onSubmit={onBulk}>
          <h2 className="font-medium">Bulk CSV</h2>
          <p className="text-xs text-[var(--muted)]">name,price,category,stockLocation,deliveryWindow,stock,minOrderQty,description</p>
          <textarea name="csv" rows={8} required className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2 font-mono text-xs"
            placeholder={"Gold Chain,15000,necklaces,china,1-2_months,50,1,From China"} />
          <button type="submit" className="btn btn-primary">Import all</button>
        </form>
      ) : null}

      {open ? (
        <form className="card mt-6 space-y-3 p-5" onSubmit={onAdd}>
          <input name="name" placeholder="Name *" required className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
          <textarea name="description" placeholder="Description" rows={2} className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
          <div className="grid grid-cols-2 gap-3">
            <input name="price" type="number" min={0} placeholder="Price NGN *" required className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
            <input name="compareAt" type="number" min={0} placeholder="Old price" className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select name="category" className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" defaultValue="other">
              {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input name="stock" type="number" min={0} defaultValue={10} className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
          </div>
          <label className="text-sm block">Stock location
            <select name="stockLocation" className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" defaultValue="china">
              {LOCS.map((l) => <option key={l} value={l}>{LOCATION_LABELS[l]}</option>)}
            </select>
          </label>
          <label className="text-sm block">Delivery time
            <select name="deliveryWindow" className="mt-1 w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" defaultValue="1-2_months">
              {WINDOWS.map((w) => <option key={w} value={w}>{DELIVERY_LABELS[w]}</option>)}
            </select>
          </label>
          <input name="minOrderQty" type="number" min={1} defaultValue={1} placeholder="Min order qty" className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />

          <div>
            <p className="text-sm font-medium mb-1">Photos (up to 8)</p>
            <p className="text-xs text-[var(--muted)] mb-2">Select multiple images from phone gallery</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onFiles(e.target.files)}
            />
            {photos.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {photos.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} alt="" className="h-20 w-20 rounded-lg object-cover border border-[var(--line)]" />
                    <button type="button" className="absolute -right-1 -top-1 h-6 w-6 rounded-full bg-[var(--danger)] text-white text-xs" onClick={() => removePhoto(i)}>×</button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <input name="image" placeholder="Or extra image URL" className="w-full rounded-[var(--radius)] border border-[var(--line)] px-3 py-2.5" />
          <label className="flex gap-2 text-sm items-center"><input name="featured" type="checkbox" /> Featured on home</label>
          <button type="submit" className="btn btn-primary">Publish product</button>
        </form>
      ) : null}

      <ul className="mt-8 space-y-3">
        {list.length === 0 ? (
          <li className="card p-10 text-center text-[var(--muted)]">No products yet</li>
        ) : list.map((p) => (
          <li key={p.id} className="card flex gap-3 p-3 items-center">
            <div className="h-14 w-14 rounded-lg bg-[var(--gold-soft)] overflow-hidden shrink-0">
              {p.images[0] ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">{p.name}</p>
              <p className="text-xs text-[var(--muted)]">
                {formatNGN(p.price)} · {p.images?.length || 0} photos
                {p.deliveryWindow ? " · " + DELIVERY_LABELS[p.deliveryWindow] : ""}
              </p>
            </div>
            <button type="button" className="btn btn-ghost text-sm" onClick={() => { if (confirm("Delete?")) { deleteProduct(p.id); refresh(); } }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
