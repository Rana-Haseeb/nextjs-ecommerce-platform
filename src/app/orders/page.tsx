import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { getUserOrders } from "@/lib/db/queries/orders";
import OrderCard from "@/components/ui/OrderCard";

export const metadata: Metadata = {
  title: "Your Orders — Maison & Co.",
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/orders");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-16 lg:px-10 lg:py-24">
      <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
        Your account
      </span>
      <h1 className="mt-3 font-display text-4xl italic text-ink">Orders</h1>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
        {orders.length} {orders.length === 1 ? "order" : "orders"}
      </p>

      {orders.length === 0 ? (
        <div className="mt-12 border border-line py-20 text-center">
          <p className="font-display text-2xl italic text-ink">
            No orders yet.
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Once you complete a purchase, it&apos;ll show up here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-3 border-b border-ink pb-1 text-sm font-medium uppercase tracking-[0.15em] text-ink transition hover:gap-5 hover:border-accent hover:text-accent"
          >
            Browse the collection
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  );
}
