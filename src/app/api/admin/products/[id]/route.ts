import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, sizes: true },
    });

    if (!product) return NextResponse.json({ error: "Produs negăsit" }, { status: 404 });
    return NextResponse.json({ ...product, images: JSON.parse(product.images) });
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

    const { id } = await params;
    const body = await request.json();

    // Delete old sizes and create new ones
    await prisma.productSize.deleteMany({ where: { productId: id } });

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        salePrice: body.salePrice ?? null,
        images: JSON.stringify(body.images || []),
        featured: body.featured,
        status: body.status,
        categoryId: body.categoryId,
        sizes: { create: body.sizes || [] },
      },
      include: { category: true, sizes: true },
    });

    return NextResponse.json({ ...product, images: JSON.parse(product.images) });
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Produs negăsit" }, { status: 404 });
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Produs negăsit" }, { status: 404 });
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}
