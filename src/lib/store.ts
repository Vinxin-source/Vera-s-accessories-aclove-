"use client";

import { SEED_PRODUCTS, type Product } from "@/data/products";

const PRODUCTS_KEY = "vera_products";
const ORDERS_KEY = "vera_orders";
const CART_KEY = "vera_cart";
const ADMIN_KEY = "vera_admin_session";

export type OrderStatus = "new" | "confirmed" | "shipped" | "delivered" | "cancelled";

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
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const orders = getOrders().map((o) => (o.id === id ? { ...o, status } : o));
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

/** Simple admin gate — change password in production */
const ADMIN_PASSWORD = "vera2026";

export function adminLogin(password: string) {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, "1");
    return true;
  }
  return false;
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_KEY);
}

export function isAdminLoggedIn() {
  if (!canUse()) return false;
  return localStorage.getItem(ADMIN_KEY) === "1";
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
  logoDataUrl?: string;
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
  logoDataUrl: "",
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
}
