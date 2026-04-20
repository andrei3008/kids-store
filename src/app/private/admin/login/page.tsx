"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la autentificare");
        return;
      }

      router.push("/private/admin");
    } catch {
      setError("Eroare de conexiune");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground items-center justify-center p-12">
        <div className="max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <span className="text-5xl">🧸</span>
            <span className="text-3xl font-bold">MiniBoutique</span>
          </div>
          <h2 className="text-2xl font-semibold">Panou de Administrare</h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Gestioneaza produsele, comenzile si categoriile magazinului tau online de haine pentru copii.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { emoji: "📦", label: "Produse" },
              { emoji: "🛍️", label: "Comenzi" },
              { emoji: "📊", label: "Statistici" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="text-xs font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile branding */}
          <div className="lg:hidden text-center">
            <span className="text-4xl">🧸</span>
            <h1 className="text-xl font-bold mt-2">MiniBoutique Admin</h1>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold">Bine ai venit!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Introdu datele pentru a accesa panoul de administrare.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="admin@miniboutique.ro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Parola</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Se conecteaza..." : "Autentificare"}
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            MiniBoutique &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
