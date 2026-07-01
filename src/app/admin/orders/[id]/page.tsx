import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getOrderById } from "@/lib/db/queries/orders";
import { TAX_RATE } from "@/lib/constants";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";
import OrderStatusForm from "@/components/ui/OrderStatusForm";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
  timeStyle: "short",
});

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  // Orders store a single tax-inclusive total; derive the split for display.
  const subtotal = order.totalAmount / (1 + TAX_RATE);
  const tax = order.totalAmount - subtotal;

  return (
    <div>
      <nav className="mb-8 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
        <Link href="/admin/orders" className="transition hover:text-ink">
          Orders
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">
          #{order.id.slice(-8).toUpperCase()}
        </span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
            Fulfillment
          </span>
          <h1 className="mt-3 font-display text-4xl italic text-ink">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            {dateFormatter.format(new Date(order.createdAt))}
          </p>
        </div>
        <OrderStatusBadge status={order.paymentStatus} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <h2 className="border-b border-line pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
            Items
          </h2>
          <ul className="divide-y divide-line">
            {order.items.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className="flex items-center gap-4 py-4"
              >
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
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-line pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd className="text-ink">${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">
                Tax ({(TAX_RATE * 100).toFixed(0)}%)
              </dt>
              <dd className="text-ink">${tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="font-medium uppercase tracking-[0.1em] text-ink">
                Total
              </dt>
              <dd className="font-display text-lg text-ink">
                ${order.totalAmount.toFixed(2)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-8">
          <div className="border border-line p-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
              Customer
            </h2>
            {order.customerEmail ? (
              <div className="mt-3">
                <p className="font-display text-lg text-ink">
                  {order.customerName ?? "—"}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {order.customerEmail}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-soft">
                Guest checkout (no account)
              </p>
            )}
          </div>

          <div className="border border-line p-6">
            <OrderStatusForm
              orderId={order.id}
              currentStatus={order.paymentStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
