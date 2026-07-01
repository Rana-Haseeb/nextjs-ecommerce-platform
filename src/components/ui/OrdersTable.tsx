import Link from "next/link";

import type { OrderListItem } from "@/lib/db/queries/orders";
import OrderStatusBadge from "@/components/ui/OrderStatusBadge";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default function OrdersTable({ orders }: { orders: OrderListItem[] }) {
  if (orders.length === 0) {
    return (
      <div className="border border-line py-16 text-center">
        <p className="text-sm text-ink-soft">No orders yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[10px] font-medium uppercase tracking-[0.15em] text-ink-soft">
            <th className="px-4 py-3 font-medium">Order</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Items</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {orders.map((order) => (
            <tr key={order.id} className="transition hover:bg-paper">
              <td className="px-4 py-4 font-mono text-xs text-ink">
                #{order.id.slice(-8).toUpperCase()}
              </td>
              <td className="px-4 py-4">
                {order.customerEmail ? (
                  <div>
                    <p className="text-ink">{order.customerName ?? "—"}</p>
                    <p className="text-xs text-ink-soft">
                      {order.customerEmail}
                    </p>
                  </div>
                ) : (
                  <span className="text-ink-soft">Guest</span>
                )}
              </td>
              <td className="px-4 py-4 text-ink-soft">
                {dateFormatter.format(new Date(order.createdAt))}
              </td>
              <td className="px-4 py-4 tabular-nums text-ink">
                {order.itemCount}
              </td>
              <td className="px-4 py-4 tabular-nums text-ink">
                ${order.totalAmount.toFixed(2)}
              </td>
              <td className="px-4 py-4">
                <OrderStatusBadge status={order.paymentStatus} />
              </td>
              <td className="px-4 py-4">
                <div className="flex justify-end">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-soft transition hover:text-accent"
                  >
                    View
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
