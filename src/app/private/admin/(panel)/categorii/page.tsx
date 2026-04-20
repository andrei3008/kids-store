"use client";

import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", description: "", showForm: false });

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories).finally(() => setLoading(false));
  }, []);

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories([...categories, cat]);
      setForm({ name: "", slug: "", description: "", showForm: false });
    } else {
      const err = await res.json();
      alert(err.error);
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm("Sigur vrei să ștergi această categorie?")) return;
    const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    if (res.ok) setCategories(categories.filter((c) => c.id !== id));
    else alert("Nu se poate șterge - are produse asociate");
  }

  if (loading) return <div className="text-center py-20">Se încarcă...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorii ({categories.length})</h1>
        <button
          onClick={() => setForm({ ...form, showForm: !form.showForm })}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {form.showForm ? "Anulează" : "+ Adaugă Categorie"}
        </button>
      </div>

      {form.showForm && (
        <form onSubmit={createCategory} className="bg-card border rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              required
              placeholder="Nume"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[ăâ]/g, "a").replace(/[î]/g, "i").replace(/[ș]/g, "s").replace(/[ț]/g, "t").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })}
              className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              required
              placeholder="Slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              placeholder="Descriere"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Creează
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-card border rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{cat.name}</h3>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="text-xs text-destructive hover:underline"
              >
                Șterge
              </button>
            </div>
            <p className="text-xs text-muted-foreground font-mono">/{cat.slug}</p>
            {cat.description && <p className="text-sm text-muted-foreground">{cat.description}</p>}
            <p className="text-xs text-muted-foreground">
              {cat.productCount || 0} produse
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
