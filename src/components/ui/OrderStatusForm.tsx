"use client";

import { useActionState } from "react";

import {
  updateOrderStatusAction,
  type OrderActionState,
} from "@/actions/orders";
import { ORDER_PAYMENT_STATUSES, type OrderPaymentStatus } from "@/lib/constants";

const initialState: OrderActionState = {};

const STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
};

export default function OrderStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderPaymentStatus;
}) {
  const [state, formAction, isPending] = useActionState(
    updateOrderStatusAction,
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={orderId} />

      <div>
        <label
          htmlFor="status"
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft"
        >
          Payment status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="mt-2 w-full border border-line bg-paper px-3 py-2 text-sm text-ink outline-none transition focus:border-ink"
        >
          {ORDER_PAYMENT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      {state.error && (
        <p className="text-sm text-accent-dark" role="alert">
          {state.error}
        </p>
      )}
      {state.success && (
        <p className="text-sm text-olive" role="status">
          Status updated.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-ink py-3 text-xs font-medium uppercase tracking-[0.25em] text-cream transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Update status"}
      </button>

      <p className="text-[11px] leading-relaxed text-ink-soft">
        Manual overrides don&apos;t adjust product stock — stock is managed by
        the Stripe payment webhook and the product editor.
      </p>
    </form>
  );
}
