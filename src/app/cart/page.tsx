"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart, TAX_RATE } from "@/hooks/useCart";

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeFromCart, clearCart } =
    useCart();

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  function handleClear() {
    if (items.length === 0) return;
    if (window.confirm("Remove all items from your cart?")) {
      clearCart();
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
          Your cart
        </span>
        <h1 className="font-display text-4xl italic text-ink">
          It&apos;s empty in here.
        </h1>
        <p className="max-w-sm text-sm text-ink-soft">
          Browse the collection and add a few considered things.
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
    <section className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
            Checkout
          </span>
          <h1 className="mt-3 font-display text-4xl italic text-ink">
            Shopping Cart
          </h1>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-soft transition hover:text-accent-dark"
        >
          Clear cart
        </button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-14 lg:grid-cols-[1.6fr_1fr]">
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-6 py-8">
              <Link
                href={`/product/${item.id}`}
                className="relative h-32 w-24 shrink-0 overflow-hidden bg-paper sm:h-40 sm:w-32"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      href={`/product/${item.id}`}
                      className="font-display text-xl text-ink transition hover:text-accent"
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-ink-soft">
                      ${item.price.toFixed(2)} each
                    </p>
                    {item.quantity >= item.stock && (
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.1em] text-gold">
                        Max stock reached
                      </p>
                    )}
                  </div>
                  <p className="whitespace-nowrap font-display text-xl text-ink">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-line">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label={`Decrease quantity of ${item.title}`}
                      className="px-3 py-2 text-ink transition hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label={`Increase quantity of ${item.title}`}
                      className="px-3 py-2 text-ink transition hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-soft transition hover:text-accent-dark"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit border border-line p-8 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl italic text-ink">
            Order Summary
          </h2>
          <dl className="mt-6 space-y-3 text-sm">
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
              <dd className="text-ink-soft">Calculated at checkout</dd>
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
          <Link
            href="/checkout"
            className="mt-8 block w-full bg-ink py-4 text-center text-xs font-medium uppercase tracking-[0.25em] text-cream transition hover:bg-accent"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/"
            className="mt-4 block text-center text-[11px] font-medium uppercase tracking-[0.15em] text-ink-soft transition hover:text-ink"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
