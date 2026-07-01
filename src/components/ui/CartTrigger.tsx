"use client";

import { useCart } from "@/hooks/useCart";

export default function CartTrigger() {
  const { itemCount, toggleCart } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label={`Open cart${itemCount > 0 ? ` (${itemCount} items)` : ""}`}
      className="flex items-center gap-2 text-cream/70 transition hover:text-cream"
    >
      Cart
      <span
        className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold normal-case tracking-normal transition ${
          itemCount > 0 ? "bg-accent text-cream" : "bg-cream/15 text-cream/50"
        }`}
      >
        {itemCount}
      </span>
    </button>
  );
}
