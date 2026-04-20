import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { orderCreateSchema } from "@/lib/validations";

function generateOrderNumber(): string {
  const d = new Date();
  const prefix = "MB";
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${date}-${rand}`;
}

export async function GET(request: Request) {
  try {
    const { requireAdmin } = await import("@/lib/auth");
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = orderCreateSchema.parse(body);

    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let orderNumber = generateOrderNumber();

    // Ensure unique order number
    const exists = await prisma.order.findUnique({ where: { orderNumber } });
    if (exists) orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        total,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        address: data.address,
        city: data.city,
        county: data.county,
        postalCode: data.postalCode,
        notes: data.notes,
        items: {
          create: data.items,
        },
      },
      include: { items: true },
    });

    // Increment monthly sales for each product
    await Promise.all(
      data.items.map((item: { productId: string; quantity: number }) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { monthlySales: { increment: item.quantity } },
        })
      )
    );

    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Date invalide", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Eroare la crearea comenzii" }, { status: 500 });
  }
}
