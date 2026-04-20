import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { categoryCreateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

    const body = await request.json();
    const data = categoryCreateSchema.parse(body);

    const category = await prisma.category.create({ data });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Date invalide", issues: error.issues }, { status: 400 });
    }
    if (error.code === "P2002") {
      return NextResponse.json({ error: "O categorie cu acest nume sau slug există deja" }, { status: 409 });
    }
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

    const body = await request.json();
    const { id, ...data } = body;

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Categorie negăsită" }, { status: 404 });
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return NextResponse.json({ error: "Neautorizat" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID obligatoriu" }, { status: 400 });

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Categorie negăsită" }, { status: 404 });
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}
