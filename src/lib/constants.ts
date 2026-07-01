export const TAX_RATE = 0.08;

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Accessories",
  "Home & Kitchen",
  "Beauty",
  "Sports",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const ORDER_PAYMENT_STATUSES = ["pending", "paid", "failed"] as const;

export type OrderPaymentStatus = (typeof ORDER_PAYMENT_STATUSES)[number];
