import type { Product } from "@/data/products";
import type { Order, StoreSettings } from "@/lib/store";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function cloudFetchProducts(): Promise<Product[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from("vera_products").select("data");
  if (error || !data) return null;
  return data.map((r) => r.data as Product);
}

export async function cloudSaveProducts(products: Product[]) {
  const sb = getSupabase();
  if (!sb) return;
  // replace all rows simply
  await sb.from("vera_products").delete().neq("id", "");
  if (!products.length) return;
  await sb.from("vera_products").upsert(
    products.map((p) => ({ id: p.id, data: p, updated_at: new Date().toISOString() })),
  );
}

export async function cloudFetchSettings(): Promise<Partial<StoreSettings> | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from("vera_settings").select("data").eq("id", 1).maybeSingle();
  if (error || !data) return null;
  return data.data as Partial<StoreSettings>;
}

export async function cloudSaveSettings(settings: StoreSettings) {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("vera_settings").upsert({
    id: 1,
    data: settings,
    updated_at: new Date().toISOString(),
  });
}

export async function cloudFetchOrders(): Promise<Order[] | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("vera_orders")
    .select("data")
    .order("created_at", { ascending: false });
  if (error || !data) return null;
  return data.map((r) => r.data as Order);
}

export async function cloudSaveOrder(order: Order) {
  const sb = getSupabase();
  if (!sb) return;
  await sb.from("vera_orders").upsert({
    id: order.id,
    data: order,
    created_at: order.createdAt,
  });
}

export async function cloudUpdateOrder(order: Order) {
  return cloudSaveOrder(order);
}

export { isSupabaseConfigured };
