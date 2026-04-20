"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProductFormPage({ editId }: { editId?: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [sizes, setSizes] = useState<{ label: string; stock: number }[]>([
    { label: "", stock: 0 },
  ]);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    salePrice: "",
    featured: false,
    status: "ACTIVE",
    categoryId: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories);

    if (editId) {
      fetch(`/api/admin/products/${editId}`)
        .then((r) => r.json())
        .then((p) => {
          if (p.error) return;
          setForm({
            name: p.name,
            slug: p.slug,
            description: p.description || "",
            price: p.price,
            salePrice: p.salePrice?.toString() || "",
            featured: p.featured,
            status: p.status,
            categoryId: p.categoryId,
          });
          setSizes(p.sizes?.map((s: any) => ({ label: s.label, stock: s.stock })) || [{ label: "", stock: 0 }]);
        });
    }
  }, [editId]);

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[ăâ]/g, "a")
      .replace(/[î]/g, "i")
      .replace(/[ș]/g, "s")
      .replace(/[ț]/g, "t")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const data = {
      ...form,
      price: Number(form.price),
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      images: [],
      sizes: sizes.filter((s) => s.label),
    };

    const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Eroare");
        return;
      }

      router.push("/private/admin/produse");
    } catch {
      alert("Eroare de conexiune");
    } finally {
      setLoading(false);
    }
  }

  function addSize() {
    setSizes([...sizes, { label: "", stock: 0 }]);
  }

  function removeSize(index: number) {
    setSizes(sizes.filter((_, i) => i !== index));
  }

  function updateSize(index: number, field: "label" | "stock", value: string | number) {
    const newSizes = [...sizes];
    if (field === "stock") newSizes[index].stock = Number(value);
    else newSizes[index].label = value as string;
    setSizes(newSizes);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{editId ? "Editează Produs" : "Produs Nou"}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nume *</label>
            <input
              required
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value, slug: generateSlug(e.target.value) });
              }}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug *</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descriere</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Preț (lei) *</label>
            <input
              required
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preț Redus (lei)</label>
            <input
              type="number"
              step="0.01"
              value={form.salePrice}
              onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Categorie *</label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selectează</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />
            Featured
          </label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="rounded-lg border px-3 py-1.5 text-sm"
          >
            <option value="ACTIVE">Activ</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Arhivat</option>
          </select>
        </div>

        {/* Sizes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Mărimi & Stoc</label>
            <button type="button" onClick={addSize} className="text-xs px-3 py-1 rounded bg-muted hover:bg-muted/80">
              + Adaugă mărime
            </button>
          </div>
          {sizes.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Mărime (ex: 4-5 ani)"
                value={s.label}
                onChange={(e) => updateSize(i, "label", e.target.value)}
                className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Stoc"
                value={s.stock}
                onChange={(e) => updateSize(i, "stock", e.target.value)}
                className="w-24 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => removeSize(i)}
                className="px-2 text-destructive hover:bg-destructive/10 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Se salvează..." : editId ? "Salvează" : "Creează Produs"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/private/admin/produse")}
            className="rounded-xl border px-6 py-2.5 text-sm hover:bg-muted"
          >
            Anulează
          </button>
        </div>
      </form>
    </div>
  );
}
