import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, sizes: true },
    });

    if (!product || product.status !== "ACTIVE") {
      return NextResponse.json({ error: "Produs negăsit" }, { status: 404 });
    }

    return NextResponse.json({
      ...product,
      images: JSON.parse(product.images),
    });
  } catch (error) {
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}
