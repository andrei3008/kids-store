import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      recentOrders,
      ordersLast30Days,
      revenueLast30Days,
      todayOrders,
      weekOrders,
      topProducts,
      ordersByStatus,
      revenueByCategory,
      dailyRevenue,
    ] = await Promise.all([
      // Basic counts
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),

      // 30-day stats
      prisma.order.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      // Today / This week
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.count({ where: { createdAt: { gte: sevenDaysAgo } } }),

      // Top selling products (by monthlySales)
      prisma.product.findMany({
        where: { monthlySales: { gt: 0 } },
        orderBy: { monthlySales: "desc" },
        take: 5,
        include: { category: true },
      }),

      // Orders by status
      prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      // Revenue by category
      prisma.orderItem.groupBy({
        by: ["productId"],
        _sum: { price: true, quantity: true },
        orderBy: { _sum: { price: "desc" } },
        take: 10,
      }),

      // Daily revenue for last 14 days
      prisma.$queryRaw<
        { date: string; revenue: number; count: number }[]
      >`
        SELECT
          date(createdAt) as date,
          SUM(total) as revenue,
          COUNT(*) as count
        FROM \`Order\`
        WHERE createdAt >= datetime('now', '-14 days')
        GROUP BY date(createdAt)
        ORDER BY date ASC
      `,
    ]);

    // Enrich revenueByCategory with product/category info
    const productIds = revenueByCategory.map((r) => r.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { category: true },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Group by category
    const categoryRevenue = new Map<string, { name: string; revenue: number; sales: number }>();
    for (const item of revenueByCategory) {
      const product = productMap.get(item.productId);
      if (!product) continue;
      const catName = product.category?.name || "Fara categorie";
      const existing = categoryRevenue.get(catName) || { name: catName, revenue: 0, sales: 0 };
      existing.revenue += item._sum.price || 0;
      existing.sales += item._sum.quantity || 0;
      categoryRevenue.set(catName, existing);
    }

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      recentOrders,
      ordersLast30Days,
      revenueLast30Days: revenueLast30Days._sum.total || 0,
      todayOrders,
      weekOrders,
      topProducts,
      ordersByStatus: ordersByStatus.map((s) => ({
        status: s.status,
        count: s._count.status,
      })),
      categoryRevenue: Array.from(categoryRevenue.values()).sort((a, b) => b.revenue - a.revenue),
      dailyRevenue,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}
