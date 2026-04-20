import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "./prisma";

const SESSION_COOKIE = "admin_session";
const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(userId: string): Promise<string> {
  const token = crypto.randomUUID() + "-" + Date.now();
  // Simple token storage - in production use JWT or proper session store
  return token;
}

export async function requireAdmin(): Promise<{ id: string; email: string; name: string } | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  if (!session) return null;

  try {
    // Decode simple session: userId:email:name
    const decoded = Buffer.from(session, "base64").toString();
    const [id, email, name, role] = decoded.split(":");

    if (role !== "ADMIN") return null;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== "ADMIN") return null;

    return { id: user.id, email: user.email, name: user.name };
  } catch {
    return null;
  }
}

export function createSessionCookie(userId: string, email: string, name: string, role: string): string {
  return Buffer.from(`${userId}:${email}:${name}:${role}`).toString("base64");
}
