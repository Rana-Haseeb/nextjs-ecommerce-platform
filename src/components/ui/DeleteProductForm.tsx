"use client";

import { deleteProductAction } from "@/actions/products";

export default function DeleteProductForm({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deleteProductAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-soft transition hover:text-accent-dark"
      >
        Delete
      </button>
    </form>
  );
}
