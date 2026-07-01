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
