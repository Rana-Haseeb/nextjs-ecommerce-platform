import type { OrderPaymentStatus } from "@/lib/constants";

const STATUS_STYLES: Record<
  OrderPaymentStatus,
  { label: string; className: string }
> = {
  paid: { label: "Paid", className: "bg-olive text-cream" },
  pending: { label: "Pending", className: "bg-gold text-cream" },
  failed: { label: "Failed", className: "bg-accent-dark text-cream" },
};

export default function OrderStatusBadge({
  status,
}: {
  status: OrderPaymentStatus;
}) {
  const { label, className } = STATUS_STYLES[status];

  return (
    <span
      className={`inline-block px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] ${className}`}
    >
      {label}
    </span>
  );
}
