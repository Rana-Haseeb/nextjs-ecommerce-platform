"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isValidObjectId } from "mongoose";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import { PRODUCT_CATEGORIES } from "@/lib/constants";

export type ProductFormValues = {
  title: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  images: string;
};

export type ProductActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: ProductFormValues;
};

function readFormValues(formData: FormData): ProductFormValues {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    price: String(formData.get("price") ?? ""),
    stock: String(formData.get("stock") ?? ""),
    category: String(formData.get("category") ?? ""),
    images: String(formData.get("images") ?? ""),
  };
}

const productSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
  category: z.enum(PRODUCT_CATEGORIES, "Select a valid category"),
  images: z
    .string()
    .trim()
    .min(1, "Add at least one image URL")
    .transform((value) =>
      value
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    )
    .pipe(
      z.array(z.url("Each image must be a valid URL")).min(1, "Add at least one image URL")
    ),
});

async function getAdminSession() {
  const session = await auth();
  return session?.user?.role === "admin" ? session : null;
}

function flattenZodErrors(
  error: z.ZodError<z.infer<typeof productSchema>>
): Record<string, string> {
  const fieldErrors = z.flattenError(error).fieldErrors;
  const result: Record<string, string> = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    if (messages && messages[0]) result[key] = messages[0];
  }
  return result;
}

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    category: formData.get("category"),
    images: formData.get("images"),
  });
}

export async function createProductAction(
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const admin = await getAdminSession();
  if (!admin) {
    return { error: "You must be an admin to perform this action." };
  }

  const result = parseProductForm(formData);
  if (!result.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: flattenZodErrors(result.error),
      values: readFormValues(formData),
    };
  }

  await connectToDatabase();
  await Product.create(result.data);

  revalidatePath("/");
  revalidatePath("/admin/products");

  redirect("/admin/products");
}

export async function updateProductAction(
  _prevState: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const admin = await getAdminSession();
  if (!admin) {
    return { error: "You must be an admin to perform this action." };
  }

  const id = formData.get("id");
  if (typeof id !== "string" || !isValidObjectId(id)) {
    return { error: "Invalid product." };
  }

  const result = parseProductForm(formData);
  if (!result.success) {
    return {
      error: "Please fix the errors below.",
      fieldErrors: flattenZodErrors(result.error),
      values: readFormValues(formData),
    };
  }

  await connectToDatabase();
  const updated = await Product.findByIdAndUpdate(id, result.data);

  if (!updated) {
    return { error: "Product not found." };
  }

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${id}`);

  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin) return;

  const id = formData.get("id");
  if (typeof id !== "string" || !isValidObjectId(id)) return;

  await connectToDatabase();
  await Product.findByIdAndDelete(id);

  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath(`/product/${id}`);
}
