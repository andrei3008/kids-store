import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { productCreateSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search");

    const where: any = {};
    if (search) where.name = { contains: search };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, sizes: true },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products: products.map((p) => ({ ...p, images: JSON.parse(p.images) })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

    const body = await request.json();
    const data = productCreateSchema.parse(body);

    const existing = await prisma.product.findUnique({ where: { slug: data.slug } });
    if (existing) {
      return NextResponse.json({ error: "Un produs cu acest slug există deja" }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice ?? null,
        images: JSON.stringify(data.images),
        featured: data.featured,
        status: data.status,
        categoryId: data.categoryId,
        sizes: { create: data.sizes },
      },
      include: { category: true, sizes: true },
    });

    return NextResponse.json({ ...product, images: JSON.parse(product.images) }, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Date invalide", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}
