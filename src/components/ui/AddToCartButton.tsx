"use client";

import { useState } from "react";

import { useCart, type CartProduct } from "@/hooks/useCart";

export default function AddToCartButton({ product }: { product: CartProduct }) {
  const { addToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "added" | "blocked">("idle");

  const soldOut = product.stock === 0;

  function handleAdd() {
    if (soldOut) return;

    const result = addToCart(product, quantity);

    if (result.success) {
      setStatus("added");
      setQuantity(1);
      openCart();
    } else {
      setStatus("blocked");
    }

    window.setTimeout(() => setStatus("idle"), 1800);
  }

  return (
    <div className="flex flex-col gap-5">
      {!soldOut && (
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
            Quantity
          </span>
          <div className="flex items-center border border-line">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-2 text-ink transition hover:text-accent"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-10 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="px-3 py-2 text-ink transition hover:text-accent"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={soldOut}
        className={`w-full py-4 text-xs font-medium uppercase tracking-[0.25em] transition disabled:cursor-not-allowed disabled:opacity-40 sm:w-72 ${
          status === "added"
            ? "bg-olive text-cream"
            : status === "blocked"
              ? "bg-gold text-cream"
              : "bg-ink text-cream hover:bg-accent"
        }`}
      >
        {soldOut
          ? "Sold out"
          : status === "added"
            ? "Added to cart ✓"
            : status === "blocked"
              ? "Max stock reached"
              : "Add to cart"}
      </button>
    </div>
  );
}
