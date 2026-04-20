import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: { where: { status: "ACTIVE" } } } } },
    });
    return NextResponse.json(categories.map((c) => ({
      ...c,
      productCount: c._count.products,
    })));
  } catch (error) {
    return NextResponse.json({ error: "Eroare la încărcarea categoriilor" }, { status: 500 });
  }
}
