"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

import { useCart } from "@/hooks/useCart";

export default function CheckoutSuccessPage() {
  const { clearCart, isHydrated } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    // Wait for the cart to finish reading its previous state from
    // localStorage before clearing it. On a fresh page load (which is
    // exactly what happens when Stripe redirects back here), that
    // hydration effect and this one are both racing to set the initial
    // cart state — clearing too early gets silently overwritten once
    // hydration finishes.
    if (!isHydrated || hasCleared.current) return;
    hasCleared.current = true;
    clearCart();
  }, [isHydrated, clearCart]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
        Order confirmed
      </span>
      <h1 className="font-display text-4xl italic text-ink">Thank you.</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        Your payment was received and your order is being prepared. A
        confirmation has been recorded — we&apos;ll be in touch as it ships.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center gap-3 border-b border-ink pb-1 text-sm font-medium uppercase tracking-[0.15em] text-ink transition hover:gap-5 hover:border-accent hover:text-accent"
      >
        Continue shopping
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
