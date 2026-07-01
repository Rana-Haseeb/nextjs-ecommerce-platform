"use client";

import { useActionState } from "react";

import {
  createProductAction,
  updateProductAction,
  type ProductActionState,
} from "@/actions/products";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import type { ProductListItem } from "@/lib/db/queries/products";

const initialState: ProductActionState = {};

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft"
    >
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-accent-dark">{message}</p>;
}

export default function ProductForm({
  product,
}: {
  product?: ProductListItem;
}) {
  const isEditing = Boolean(product);
  const action = isEditing ? updateProductAction : createProductAction;
  const [state, formAction, isPending] = useActionState(action, initialState);

  const inputClass =
    "mt-2 w-full border border-line bg-paper px-3 py-2 text-sm text-ink outline-none transition focus:border-ink";

  // Remount with fresh defaultValues whenever the server echoes back a
  // failed submission, so the admin doesn't lose their input on error.
  const formKey = state.values ? JSON.stringify(state.values) : "initial";

  return (
    <form key={formKey} action={formAction} className="max-w-xl space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={state.values?.title ?? product?.title}
          className={inputClass}
        />
        <FieldError message={state.fieldErrors?.title} />
      </div>

      <div>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <textarea
          id="description"
          name="description"
          required
          rows={4}
          defaultValue={state.values?.description ?? product?.description}
          className={inputClass}
        />
        <FieldError message={state.fieldErrors?.description} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel htmlFor="price">Price (USD)</FieldLabel>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={state.values?.price ?? product?.price}
            className={inputClass}
          />
          <FieldError message={state.fieldErrors?.price} />
        </div>
        <div>
          <FieldLabel htmlFor="stock">Stock</FieldLabel>
          <input
            id="stock"
            name="stock"
            type="number"
            step="1"
            min="0"
            required
            defaultValue={state.values?.stock ?? product?.stock}
            className={inputClass}
          />
          <FieldError message={state.fieldErrors?.stock} />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="category">Category</FieldLabel>
        <select
          id="category"
          name="category"
          required
          defaultValue={
            state.values?.category ?? product?.category ?? PRODUCT_CATEGORIES[0]
          }
          className={inputClass}
        >
          {PRODUCT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <FieldError message={state.fieldErrors?.category} />
      </div>

      <div>
        <FieldLabel htmlFor="images">Image URLs (one per line)</FieldLabel>
        <textarea
          id="images"
          name="images"
          required
          rows={3}
          placeholder="https://images.unsplash.com/..."
          defaultValue={state.values?.images ?? product?.images.join("\n")}
          className={inputClass}
        />
        <FieldError message={state.fieldErrors?.images} />
      </div>

      {state.error && (
        <p className="text-sm text-accent-dark" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.25em] text-cream transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending
          ? "Saving..."
          : isEditing
            ? "Save changes"
            : "Create product"}
      </button>
    </form>
  );
}
