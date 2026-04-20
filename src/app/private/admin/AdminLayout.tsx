"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/private/admin/login");
  }

  if (!mounted) return null;

  const links = [
    { href: "/private/admin", label: "Dashboard", emoji: "📊" },
    { href: "/private/admin/produse", label: "Produse", emoji: "📦" },
    { href: "/private/admin/categorii", label: "Categorii", emoji: "🏷️" },
    { href: "/private/admin/comenzi", label: "Comenzi", emoji: "🛍️" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r hidden md:flex flex-col">
        <div className="p-4 border-b">
          <Link href="/private/admin" className="flex items-center gap-2">
            <span className="text-2xl">🧸</span>
            <span className="font-bold text-primary">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
            >
              <span>{link.emoji}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
          >
            <span>🏠</span> Vezi Magazinul
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-destructive/10 text-destructive w-full transition-colors"
          >
            <span>🚪</span> Deconectare
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-16 left-0 right-0 bg-card border-b z-40 px-4 py-2 flex gap-2 overflow-x-auto">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-1.5 rounded-lg text-sm whitespace-nowrap hover:bg-muted"
          >
            {link.emoji} {link.label}
          </Link>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 mt-12 md:mt-0">{children}</main>
    </div>
  );
}
