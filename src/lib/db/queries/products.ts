import { isValidObjectId } from "mongoose";

import connectToDatabase from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import type { ProductCategory } from "@/lib/constants";

export type SortOption = "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export type ProductListItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  dateCreated: string;
};

type ProductDocument = {
  _id: { toString(): string };
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  dateCreated: Date;
};

function serializeProduct(doc: ProductDocument): ProductListItem {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    price: doc.price,
    images: doc.images,
    category: doc.category,
    stock: doc.stock,
    dateCreated: doc.dateCreated.toISOString(),
  };
}

const SORT_MAP: Record<SortOption, Record<string, 1 | -1>> = {
  newest: { dateCreated: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
};

export async function getProducts(options: {
  category?: string;
  sort?: SortOption;
}): Promise<ProductListItem[]> {
  await connectToDatabase();

  const filter: Partial<Record<"category", ProductCategory>> = {};
  if (options.category) {
    filter.category = options.category as ProductCategory;
  }

  const sort = SORT_MAP[options.sort ?? "newest"];

  const products = await Product.find(filter).sort(sort).lean<ProductDocument[]>();
  return products.map(serializeProduct);
}

export async function getProductById(
  id: string
): Promise<ProductListItem | null> {
  if (!isValidObjectId(id)) return null;

  await connectToDatabase();

  const product = await Product.findById(id).lean<ProductDocument | null>();
  return product ? serializeProduct(product) : null;
}
