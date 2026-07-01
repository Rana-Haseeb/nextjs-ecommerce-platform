import { isValidObjectId } from "mongoose";

import connectToDatabase from "@/lib/db/mongodb";
import Order from "@/lib/db/models/Order";
import type { OrderPaymentStatus } from "@/lib/constants";

export type OrderItem = {
  productId: string | null;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export type OrderListItem = {
  id: string;
  items: OrderItem[];
  itemCount: number;
  totalAmount: number;
  paymentStatus: OrderPaymentStatus;
  createdAt: string;
  customerName: string | null;
  customerEmail: string | null;
};

type PopulatedUser = {
  _id: { toString(): string };
  name?: string;
  email?: string;
} | null;

type OrderDocument = {
  _id: { toString(): string };
  user: PopulatedUser;
  items: {
    product: { toString(): string } | null;
    title: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  totalAmount: number;
  paymentStatus: OrderPaymentStatus;
  createdAt: Date;
};

function serializeOrder(doc: OrderDocument): OrderListItem {
  const items: OrderItem[] = doc.items.map((item) => ({
    productId: item.product ? item.product.toString() : null,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    image: item.image ?? "",
  }));

  return {
    id: doc._id.toString(),
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    totalAmount: doc.totalAmount,
    paymentStatus: doc.paymentStatus,
    createdAt: doc.createdAt.toISOString(),
    customerName: doc.user?.name ?? null,
    customerEmail: doc.user?.email ?? null,
  };
}

export async function getUserOrders(userId: string): Promise<OrderListItem[]> {
  if (!isValidObjectId(userId)) return [];

  await connectToDatabase();

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean<OrderDocument[]>();

  return orders.map(serializeOrder);
}

export async function getAllOrders(): Promise<OrderListItem[]> {
  await connectToDatabase();

  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .lean<OrderDocument[]>();

  return orders.map(serializeOrder);
}

export async function getOrderById(
  id: string
): Promise<OrderListItem | null> {
  if (!isValidObjectId(id)) return null;

  await connectToDatabase();

  const order = await Order.findById(id)
    .populate("user", "name email")
    .lean<OrderDocument | null>();

  return order ? serializeOrder(order) : null;
}
