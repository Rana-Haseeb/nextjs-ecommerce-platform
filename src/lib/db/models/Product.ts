import { Schema, models, model, type InferSchemaType } from "mongoose";

import { PRODUCT_CATEGORIES } from "@/lib/constants";

const ProductSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  images: { type: [String], required: true, default: [] },
  category: { type: String, required: true, enum: PRODUCT_CATEGORIES },
  stock: { type: Number, required: true, min: 0, default: 0 },
  dateCreated: { type: Date, required: true, default: Date.now },
});

export type IProduct = InferSchemaType<typeof ProductSchema>;

const Product = models.Product || model("Product", ProductSchema);

export default Product;
