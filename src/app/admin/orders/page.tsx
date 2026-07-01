import { getAllOrders } from "@/lib/db/queries/orders";
import OrdersTable from "@/components/ui/OrdersTable";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div>
      <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
        Fulfillment
      </span>
      <h1 className="mt-3 font-display text-4xl italic text-ink">Orders</h1>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
        {orders.length} {orders.length === 1 ? "order" : "orders"}
      </p>

      <div className="mt-8">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
