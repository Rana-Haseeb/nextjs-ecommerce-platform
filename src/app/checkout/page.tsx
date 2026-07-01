"use client";

import { useState } from "react";
import Link from "next/link";

import { useCart, TAX_RATE } from "@/hooks/useCart";

export default function CheckoutPage() {
  const { items, itemCount, subtotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (!data.url) {
        setError("Could not start checkout. Please try again.");
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
          Checkout
        </span>
        <h1 className="font-display text-4xl italic text-ink">
          Nothing to check out yet.
        </h1>
        <p className="max-w-sm text-sm text-ink-soft">
          Your cart is empty. Add a few pieces before checking out.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-3 border-b border-ink pb-1 text-sm font-medium uppercase tracking-[0.15em] text-ink transition hover:gap-5 hover:border-accent hover:text-accent"
        >
          Browse the collection
          <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
      <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
        Checkout
      </span>
      <h1 className="mt-3 font-display text-4xl italic text-ink">
        Almost there.
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
        Review your order, then continue to a secure Stripe checkout.
      </p>

      <div className="mt-10 border border-line p-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl italic text-ink">
            Order Summary
          </h2>
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </span>
        </div>

        <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="text-ink">${subtotal.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">
              Estimated tax ({(TAX_RATE * 100).toFixed(0)}%)
            </dt>
            <dd className="text-ink">${tax.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Shipping</dt>
            <dd className="text-ink-soft">Free</dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center justify-between border-t border-line pt-6">
          <span className="text-sm font-medium uppercase tracking-[0.15em] text-ink">
            Total
          </span>
          <span className="font-display text-2xl text-ink">
            ${total.toFixed(2)}
          </span>
        </div>

        {error && (
          <p className="mt-4 text-sm text-accent-dark" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleCheckout}
          disabled={isLoading}
          className="mt-8 w-full bg-ink py-4 text-center text-xs font-medium uppercase tracking-[0.25em] text-cream transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Redirecting to Stripe..." : "Pay with Stripe"}
        </button>
        <Link
          href="/cart"
          className="mt-4 block text-center text-[11px] font-medium uppercase tracking-[0.15em] text-ink-soft transition hover:text-ink"
        >
          Back to cart
        </Link>
      </div>
    </section>
  );
}
