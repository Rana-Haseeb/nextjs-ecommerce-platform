"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/hooks/useCart";

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeCart();
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        aria-hidden
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-display text-xl italic text-ink">
            Your Cart{" "}
            {itemCount > 0 && (
              <span className="not-italic text-ink-soft">({itemCount})</span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="text-lg text-ink-soft transition hover:text-ink"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-display text-xl italic text-ink">
              Your cart is empty
            </p>
            <p className="text-sm text-ink-soft">
              Add something beautiful to it.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-4 border-b border-ink pb-1 text-xs font-medium uppercase tracking-[0.15em] text-ink transition hover:border-accent hover:text-accent"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6">
              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-5">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-cream">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/product/${item.id}`}
                            onClick={closeCart}
                            className="font-display text-base leading-snug text-ink transition hover:text-accent"
                          >
                            {item.title}
                          </Link>
                          <p className="mt-1 text-xs text-ink-soft">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.title} from cart`}
                          className="text-ink-soft transition hover:text-accent-dark"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-line">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            aria-label={`Decrease quantity of ${item.title}`}
                            className="px-2 py-1 text-ink transition hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.stock}
                            aria-label={`Increase quantity of ${item.title}`}
                            className="px-2 py-1 text-ink transition hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-medium text-ink">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {item.quantity >= item.stock && (
                        <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-gold">
                          Max stock reached
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-line px-6 py-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">Subtotal</span>
                <span className="font-display text-lg text-ink">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-ink-soft">
                Taxes calculated at checkout.
              </p>

              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-5 block w-full border border-ink py-3 text-center text-xs font-medium uppercase tracking-[0.2em] text-ink transition hover:border-accent hover:text-accent"
              >
                View cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-3 block w-full bg-ink py-3 text-center text-xs font-medium uppercase tracking-[0.25em] text-cream transition hover:bg-accent"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
