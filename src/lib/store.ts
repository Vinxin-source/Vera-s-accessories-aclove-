"use client";

import { SEED_PRODUCTS, type Product } from "@/data/products";
import {
  cloudFetchOrders,
  cloudFetchProducts,
  cloudFetchSettings,
  cloudSaveOrder,
  cloudSaveProducts,
  cloudSaveSettings,
  cloudUpdateOrder,
  isSupabaseConfigured,
} from "@/lib/cloud";

const PRODUCTS_KEY = "vera_products";
const ORDERS_KEY = "vera_orders";
const CART_KEY = "vera_cart";
const ADMIN_KEY = "vera_admin_session";

export type OrderStatus = "new" | "awaiting_payment" | "paid" | "shipped" | "delivered" | "cancelled";

export interface CartItem {
  productId: string;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    note?: string;
  };
  items: { productId: string; name: string; price: number; qty: number }[];
  subtotal: number;
  shipping: number;
  total: number;
}

function canUse() {
  return typeof window !== "undefined";
}

export function getProducts(): Product[] {
  if (!canUse()) return SEED_PRODUCTS;
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw === null) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    return JSON.parse(raw) as Product[];
  } catch {
    return SEED_PRODUCTS;
  }
}

export function saveProducts(products: Product[]) {
  if (!canUse()) return;
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  if (isSupabaseConfigured()) {
    void cloudSaveProducts(products);
  }
}

/** Load products from cloud into localStorage when Supabase is configured */
export async function syncProductsFromCloud() {
  if (!canUse() || !isSupabaseConfigured()) return getProducts();
  const remote = await cloudFetchProducts();
  if (remote) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(remote));
    return remote;
  }
  return getProducts();
}

export function getProductBySlug(slug: string) {
  return getProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string) {
  return getProducts().find((p) => p.id === id);
}

export function upsertProduct(product: Product) {
  const list = getProducts();
  const i = list.findIndex((p) => p.id === product.id);
  if (i >= 0) list[i] = product;
  else list.unshift(product);
  saveProducts(list);
}

export function deleteProduct(id: string) {
  saveProducts(getProducts().filter((p) => p.id !== id));
}

export function getCart(): CartItem[] {
  if (!canUse()) return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  if (!canUse()) return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("vera-cart"));
}

export function addToCart(productId: string, qty = 1) {
  const cart = getCart();
  const existing = cart.find((c) => c.productId === productId);
  if (existing) existing.qty += qty;
  else cart.push({ productId, qty });
  setCart(cart);
}

export function updateCartQty(productId: string, qty: number) {
  if (qty <= 0) setCart(getCart().filter((c) => c.productId !== productId));
  else
    setCart(
      getCart().map((c) => (c.productId === productId ? { ...c, qty } : c))
    );
}

export function clearCart() {
  setCart([]);
}

export function getOrders(): Order[] {
  if (!canUse()) return [];
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveOrder(order: Order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  if (isSupabaseConfigured()) void cloudSaveOrder(order);
  // Reserve stock when order is placed
  const products = getProducts();
  let changed = false;
  for (const line of order.items) {
    const i = products.findIndex((p) => p.id === line.productId);
    if (i < 0) continue;
    const next = Math.max(0, (products[i].stock || 0) - line.qty);
    products[i] = {
      ...products[i],
      stock: next,
      inStock: next > 0,
    };
    changed = true;
  }
  if (changed) saveProducts(products);
}

export function restoreStockForOrder(order: Order) {
  const products = getProducts();
  for (const line of order.items) {
    const i = products.findIndex((p) => p.id === line.productId);
    if (i < 0) continue;
    const next = (products[i].stock || 0) + line.qty;
    products[i] = { ...products[i], stock: next, inStock: true };
  }
  saveProducts(products);
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const prev = getOrders().find((o) => o.id === id);
  const orders = getOrders().map((o) => (o.id === id ? { ...o, status } : o));
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  const updated = orders.find((o) => o.id === id);
  if (updated && isSupabaseConfigured()) void cloudUpdateOrder(updated);
  if (prev && status === "cancelled" && prev.status !== "cancelled") {
    restoreStockForOrder(prev);
  }
}

/** Simple admin gate — change password in production */
const ADMIN_PASSWORD = "vera2026";

export function adminLogin(password: string) {
  if (checkAdminPassword(password)) {
    localStorage.setItem(ADMIN_KEY, "1");
    return true;
  }
  return false;
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_KEY);
}


export function cartCount() {
  return getCart().reduce((n, i) => n + i.qty, 0);
}


export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsapp: string;
  instagram: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  shippingNote: string;
  shippingFee: number;
  adminEmail: string;
  logoDataUrl?: string;
  aboutTitle: string;
  aboutBody: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
}

const SETTINGS_KEY = "vera_settings_v1";

export const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Vera's Accessories Aclove",
  tagline: "China procurement • Personal shopper • Trusted imports",
  whatsapp: "",
  instagram: "https://www.instagram.com/vera_accessories_aclove",
  bankName: "",
  accountName: "",
  accountNumber: "",
  shippingNote: "Delivery options confirmed after order on WhatsApp.",
  shippingFee: 2500,
  adminEmail: "",
  logoDataUrl: "",
  aboutTitle: "About us",
  aboutBody: "China procurement agent, personal shopper, preorders, product sourcing, RMB exchange, and trusted import services. We source with care so you know what you are buying and when it arrives.",
  primaryColor: "#6D28D9",
  accentColor: "#A78BFA",
  backgroundColor: "#F5F3FF",
};

export function getSettings(): StoreSettings {
  if (!canUse()) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: StoreSettings) {
  if (!canUse()) return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("vera-settings"));
  if (isSupabaseConfigured()) void cloudSaveSettings(settings);
}

export async function syncSettingsFromCloud() {
  if (!canUse() || !isSupabaseConfigured()) return getSettings();
  const remote = await cloudFetchSettings();
  if (remote) {
    const merged = { ...getSettings(), ...remote };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event("vera-settings"));
    return merged;
  }
  return getSettings();
}

export async function syncOrdersFromCloud() {
  if (!canUse() || !isSupabaseConfigured()) return getOrders();
  const remote = await cloudFetchOrders();
  if (remote) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(remote));
    return remote;
  }
  return getOrders();
}


const ADMIN_PASS_KEY = "vera_admin_pass_v1";
const DEFAULT_ADMIN_PASS = "vera2026";

export function getAdminPassword(): string {
  if (!canUse()) return DEFAULT_ADMIN_PASS;
  try {
    return localStorage.getItem(ADMIN_PASS_KEY) || DEFAULT_ADMIN_PASS;
  } catch {
    return DEFAULT_ADMIN_PASS;
  }
}

export function setAdminPassword(next: string) {
  if (!canUse()) return;
  const v = next.trim();
  if (v.length < 4) throw new Error("Password at least 4 characters");
  localStorage.setItem(ADMIN_PASS_KEY, v);
}

export function checkAdminPassword(input: string): boolean {
  const trimmed = (input || "").trim();
  if (!trimmed) return false;
  if (trimmed === DEFAULT_ADMIN_PASS) return true;
  try {
    return trimmed === getAdminPassword();
  } catch {
    return trimmed === DEFAULT_ADMIN_PASS;
  }
}

export function isAdminLoggedIn(): boolean {
  if (!canUse()) return false;
  return localStorage.getItem(ADMIN_KEY) === "1";
}

export function setAdminLoggedIn(ok: boolean) {
  if (!canUse()) return;
  if (ok) localStorage.setItem(ADMIN_KEY, "1");
  else localStorage.removeItem(ADMIN_KEY);
}
