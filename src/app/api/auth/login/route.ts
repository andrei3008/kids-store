import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, createSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      return NextResponse.json({ error: "Email sau parolă incorectă" }, { status: 401 });
    }

    const valid = await verifyPassword(data.password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Email sau parolă incorectă" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Acces interzis" }, { status: 403 });
    }

    const session = createSessionCookie(user.id, user.email, user.name, user.role);

    const response = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    response.cookies.set("admin_session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }
    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}
