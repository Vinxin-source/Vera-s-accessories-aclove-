export type Category =
  | "necklaces"
  | "earrings"
  | "bracelets"
  | "rings"
  | "sets"
  | "beads"
  | "bags"
  | "other";

/** Import / fulfillment timing — buyers see this clearly */
export type DeliveryWindow =
  | "1-3_days"
  | "3-7_days"
  | "7-14_days"
  | "2-4_weeks"
  | "1-2_months"
  | "2-3_months";

export type StockLocation = "nigeria" | "china" | "preorder";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAt?: number;
  category: Category;
  tags: string[];
  images: string[];
  inStock: boolean;
  stock: number;
  featured?: boolean;
  createdAt: string;
  /** Where goods sit */
  stockLocation?: StockLocation;
  /** When buyer should expect delivery */
  deliveryWindow?: DeliveryWindow;
  minOrderQty?: number;
}

export const DELIVERY_LABELS: Record<DeliveryWindow, string> = {
  "1-3_days": "1–3 days",
  "3-7_days": "3–7 days",
  "7-14_days": "1–2 weeks",
  "2-4_weeks": "2–4 weeks",
  "1-2_months": "1–2 months",
  "2-3_months": "2–3 months",
};

export const LOCATION_LABELS: Record<StockLocation, string> = {
  nigeria: "In Nigeria",
  china: "Ships from China",
  preorder: "Preorder",
};

export const SEED_PRODUCTS: Product[] = [];

export function formatNGN(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(n);
}

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
