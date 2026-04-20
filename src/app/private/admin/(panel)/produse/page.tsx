"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/products").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
    ])
      .then(([pData, cData]) => {
        if (pData.error) { window.location.href = "/private/admin/login"; return; }
        setProducts(pData.products || []);
        setCategories(cData);
      })
      .finally(() => setLoading(false));
  }, []);

  async function deleteProduct(id: string) {
    if (!confirm("Sigur vrei sa stergi acest produs?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  }

  if (loading) return <div className="text-center py-20">Se incarca...</div>;

  const statusBadge: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    DRAFT: "bg-yellow-100 text-yellow-700",
    ARCHIVED: "bg-gray-100 text-gray-700",
  };

  const statusLabels: Record<string, string> = {
    ACTIVE: "Activ",
    DRAFT: "Draft",
    ARCHIVED: "Arhivat",
  };

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCat && p.categoryId !== filterCat) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produse ({filtered.length})</h1>
        <Link
          href="/private/admin/produse/nou"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          + Adauga Produs
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cauta produs..."
            className="w-full rounded-lg border pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Toate categoriile</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Toate statusurile</option>
          <option value="ACTIVE">Activ</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Arhivat</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Produs</th>
                <th className="text-left p-3 font-medium">Categorie</th>
                <th className="text-left p-3 font-medium">Pret</th>
                <th className="text-left p-3 font-medium">Stoc</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Actiuni</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const totalStock = p.sizes?.reduce((sum: number, s: any) => sum + s.stock, 0) || 0;
                return (
                  <tr key={p.id} className="border-t hover:bg-muted/30">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                          {["🌸", "👖", "🧥", "👕", "👒", "🧸"][p.name.length % 6]}
                        </div>
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">{p.category?.name}</td>
                    <td className="p-3">
                      <div>{p.price.toFixed(2)} lei</div>
                      {p.salePrice && (
                        <div className="text-xs text-red-500">{p.salePrice.toFixed(2)} lei</div>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`text-xs font-medium ${totalStock > 0 ? "text-green-600" : "text-red-500"}`}>
                        {totalStock} buc.
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusBadge[p.status] || ""}`}>
                        {statusLabels[p.status] || p.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/private/admin/produse/${p.id}`}
                          className="text-xs px-2.5 py-1 rounded-lg bg-muted hover:bg-muted/80 font-medium"
                        >
                          Editeaza
                        </Link>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium"
                        >
                          Sterge
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <span className="text-3xl block mb-2">📦</span>
            Nu s-au gasit produse
          </div>
        )}
      </div>
    </div>
  );
}
