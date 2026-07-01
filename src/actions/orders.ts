"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { isValidObjectId } from "mongoose";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongodb";
import Order from "@/lib/db/models/Order";
import { ORDER_PAYMENT_STATUSES } from "@/lib/constants";

export type OrderActionState = {
  error?: string;
  success?: boolean;
};

const updateSchema = z.object({
  id: z.string().refine(isValidObjectId, "Invalid order."),
  status: z.enum(ORDER_PAYMENT_STATUSES),
});

/**
 * Admin-only manual override of an order's payment status. This is an
 * administrative correction tool and intentionally does NOT touch product
 * stock — stock is decremented exclusively by the Stripe payment webhook so
 * there is a single source of truth. Use the product editor to adjust stock.
 */
export async function updateOrderStatusAction(
  _prevState: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { error: "You must be an admin to perform this action." };
  }

  const parsed = updateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    return { error: "Please choose a valid status." };
  }

  await connectToDatabase();

  const updated = await Order.findByIdAndUpdate(parsed.data.id, {
    paymentStatus: parsed.data.status,
  });

  if (!updated) {
    return { error: "Order not found." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${parsed.data.id}`);

  return { success: true };
}
