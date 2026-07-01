import { Schema, models, model, type InferSchemaType } from "mongoose";

export const ORDER_PAYMENT_STATUSES = ["pending", "paid", "failed"] as const;

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      enum: ORDER_PAYMENT_STATUSES,
      default: "pending",
    },
    stripeSessionId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export type IOrder = InferSchemaType<typeof OrderSchema>;

const Order = models.Order || model("Order", OrderSchema);

export default Order;
