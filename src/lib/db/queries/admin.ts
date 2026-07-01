import connectToDatabase from "@/lib/db/mongodb";
import Order from "@/lib/db/models/Order";
import Product from "@/lib/db/models/Product";

export type DashboardMetrics = {
  totalRevenue: number;
  totalOrders: number;
  outOfStockCount: number;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  await connectToDatabase();

  const [revenueResult, totalOrders, outOfStockCount] = await Promise.all([
    Order.aggregate<{ _id: null; total: number }>([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
    Order.countDocuments(),
    Product.countDocuments({ stock: 0 }),
  ]);

  return {
    totalRevenue: revenueResult[0]?.total ?? 0,
    totalOrders,
    outOfStockCount,
  };
}
