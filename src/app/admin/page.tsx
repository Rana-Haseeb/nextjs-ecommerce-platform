import { auth } from "@/auth";
import { getDashboardMetrics } from "@/lib/db/queries/admin";
import MetricCard from "@/components/ui/MetricCard";

export default async function AdminDashboardPage() {
  const [session, metrics] = await Promise.all([auth(), getDashboardMetrics()]);

  return (
    <div>
      <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
        Overview
      </span>
      <h1 className="mt-3 font-display text-4xl italic text-ink">
        Welcome back, {session?.user?.name?.split(" ")[0]}.
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        A quick look at how the shop is doing.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total Revenue"
          value={`$${metrics.totalRevenue.toFixed(2)}`}
          accent
        />
        <MetricCard
          label="Total Orders"
          value={metrics.totalOrders.toString()}
        />
        <MetricCard
          label="Out of Stock Items"
          value={metrics.outOfStockCount.toString()}
        />
      </div>
    </div>
  );
}
