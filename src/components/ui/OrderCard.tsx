import Image from "next/image";
import Link from "next/link";

import type { OrderListItem } from "@/lib/db/queries/orders";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function OrderCard({ order }: { order: OrderListItem }) {
  return (
    <article className="border border-line">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-6 py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-soft">
              Order
            </p>
            <p className="font-mono text-sm text-ink">
              #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-ink-soft">
              Placed
            </p>
            <p className="text-sm text-ink">
              {dateFormatter.format(new Date(order.createdAt))}
            </p>
          </div>
        </div>
        <OrderStatusBadge status={order.paymentStatus} />
      </header>

      <ul className="divide-y divide-line">
        {order.items.map((item, index) => {
          const line = (
            <>
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-cream">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 items-center justify-between gap-4">
                <div>
                  <p className="font-display text-base text-ink">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    ${item.price.toFixed(2)} &times; {item.quantity}
                  </p>
                </div>
                <p className="whitespace-nowrap text-sm text-ink">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </>
          );

          return (
            <li key={`${item.title}-${index}`} className="px-6 py-4">
              {item.productId ? (
                <Link
                  href={`/product/${item.productId}`}
                  className="flex items-center gap-4 transition hover:opacity-80"
                >
                  {line}
                </Link>
              ) : (
                <div className="flex items-center gap-4">{line}</div>
              )}
            </li>
          );
        })}
      </ul>

      <footer className="flex items-center justify-between border-t border-line px-6 py-4">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
          {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
        </span>
        <span className="font-display text-lg text-ink">
          ${order.totalAmount.toFixed(2)}
        </span>
      </footer>
    </article>
  );
}
