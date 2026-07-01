import { NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

import { auth } from "@/auth";
import connectToDatabase from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import Order from "@/lib/db/models/Order";
import { stripe } from "@/lib/stripe";
import { TAX_RATE } from "@/lib/constants";

type CheckoutRequestItem = {
  id: string;
  quantity: number;
};

type ProductDocument = {
  _id: { toString(): string };
  title: string;
  price: number;
  images: string[];
  stock: number;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const requestedItems: CheckoutRequestItem[] = body?.items;

  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  await connectToDatabase();

  const orderItems: {
    product: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[] = [];

  for (const item of requestedItems) {
    if (
      !item?.id ||
      !isValidObjectId(item.id) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
    }

    const product = await Product.findById(item.id).lean<ProductDocument | null>();

    if (!product) {
      return NextResponse.json(
        { error: "One of the items in your cart no longer exists." },
        { status: 400 }
      );
    }

    if (product.stock < item.quantity) {
      return NextResponse.json(
        {
          error: `${product.title} only has ${product.stock} left in stock.`,
        },
        { status: 400 }
      );
    }

    orderItems.push({
      product: product._id.toString(),
      title: product.title,
      price: product.price,
      quantity: item.quantity,
      image: product.images[0] ?? "",
    });
  }

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const totalAmount = subtotal + tax;

  const session = await auth();

  const order = await Order.create({
    user: session?.user?.id,
    items: orderItems,
    totalAmount,
    paymentStatus: "pending",
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        ...orderItems.map((item) => ({
          quantity: item.quantity,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.price * 100),
            product_data: {
              name: item.title,
              images: item.image ? [item.image] : undefined,
            },
          },
        })),
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: Math.round(tax * 100),
            product_data: {
              name: `Estimated tax (${(TAX_RATE * 100).toFixed(0)}%)`,
            },
          },
        },
      ],
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart`,
      metadata: { orderId: order._id.toString() },
    });

    order.stripeSessionId = checkoutSession.id;
    await order.save();

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    order.paymentStatus = "failed";
    await order.save();

    console.error("Stripe checkout session creation failed:", error);
    return NextResponse.json(
      { error: "Could not start checkout. Please try again." },
      { status: 502 }
    );
  }
}
