"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => {
        if (!r.ok) throw new Error("Not auth");
        return r.json();
      })
      .then(setStats)
      .catch(() => (window.location.href = "/private/admin/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Se incarca...</p>
        </div>
      </div>
    );
  }
  if (!stats) return null;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500",
    CONFIRMED: "bg-green-500",
    SHIPPED: "bg-blue-500",
    DELIVERED: "bg-emerald-500",
    CANCELLED: "bg-red-500",
  };
  const statusLabels: Record<string, string> = {
    PENDING: "In asteptare",
    CONFIRMED: "Confirmata",
    SHIPPED: "Expediata",
    DELIVERED: "Livrate",
    CANCELLED: "Anulata",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <span className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard emoji="💰" label="Venit Total" value={`${stats.totalRevenue.toFixed(2)} lei`} sub={`${stats.revenueLast30Days.toFixed(2)} lei (30 zile)`} color="bg-green-50 text-green-700 border-green-200" />
        <KPICard emoji="📦" label="Total Produse" value={stats.totalProducts} sub={`${stats.ordersLast30Days} comenzi (30 zile)`} color="bg-blue-50 text-blue-700 border-blue-200" />
        <KPICard emoji="🛍️" label="Comenzi" value={stats.totalOrders} sub={`${stats.todayOrders} azi / ${stats.weekOrders} sapt.`} color="bg-purple-50 text-purple-700 border-purple-200" />
        <KPICard emoji="⏳" label="In Asteptare" value={stats.pendingOrders} sub="Comenzi de procesat" color="bg-yellow-50 text-yellow-700 border-yellow-200" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Venituri Ultimele 14 Zile</h2>
          {stats.dailyRevenue?.length > 0 ? (
            <div className="space-y-2">
              {(() => {
                const maxRev = Math.max(...stats.dailyRevenue.map((d: any) => Number(d.revenue)), 1);
                return stats.dailyRevenue.map((day: any) => {
                  const pct = (Number(day.revenue) / maxRev) * 100;
                  const date = new Date(day.date);
                  const label = date.toLocaleDateString("ro-RO", { day: "2-digit", month: "short" });
                  return (
                    <div key={day.date} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-14 text-right flex-shrink-0">{label}</span>
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full transition-all flex items-center justify-end pr-2"
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        >
                          {pct > 15 && (
                            <span className="text-[10px] font-medium text-primary-foreground">
                              {Number(day.revenue).toFixed(0)} lei
                            </span>
                          )}
                        </div>
                      </div>
                      {pct <= 15 && (
                        <span className="text-xs text-muted-foreground">{Number(day.revenue).toFixed(0)} lei</span>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <EmptyState emoji="📊" text="Inca nu sunt date de vanzari" />
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Comenzi dupa Status</h2>
          {stats.ordersByStatus?.length > 0 ? (
            <div className="space-y-4">
              {(() => {
                const total = stats.ordersByStatus.reduce((s: number, o: any) => s + o.count, 0);
                return stats.ordersByStatus.map((s: any) => {
                  const pct = total > 0 ? (s.count / total) * 100 : 0;
                  return (
                    <div key={s.status}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${statusColors[s.status]}`} />
                          {statusLabels[s.status] || s.status}
                        </span>
                        <span className="font-medium">{s.count} ({pct.toFixed(0)}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className={`${statusColors[s.status]} h-full rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <EmptyState emoji="📋" text="Inca nu sunt comenzi" />
          )}
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-card border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Top Produse (30 zile)</h2>
            <Link href="/private/admin/produse" className="text-xs text-primary hover:underline">Vezi toate →</Link>
          </div>
          {stats.topProducts?.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((p: any, i: number) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category?.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary">{p.monthlySales} vandute</p>
                    <p className="text-xs text-muted-foreground">{p.price.toFixed(2)} lei</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState emoji="🏆" text="Inca nu sunt vanzari" />
          )}
        </div>

        {/* Category Revenue */}
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Venituri pe Categorie</h2>
          {stats.categoryRevenue?.length > 0 ? (
            <div className="space-y-3">
              {(() => {
                const maxRev = Math.max(...stats.categoryRevenue.map((c: any) => c.revenue), 1);
                return stats.categoryRevenue.map((cat: any) => {
                  const pct = (cat.revenue / maxRev) * 100;
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-muted-foreground">{cat.revenue.toFixed(2)} lei ({cat.sales} buc.)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-secondary h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <EmptyState emoji="📊" text="Inca nu sunt date pe categorii" />
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-semibold">Ultimele Comenzi</h2>
          <Link href="/private/admin/comenzi" className="text-xs text-primary hover:underline">Vezi toate →</Link>
        </div>
        {stats.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Nr. Comanda</th>
                  <th className="text-left p-3 font-medium">Client</th>
                  <th className="text-left p-3 font-medium">Produse</th>
                  <th className="text-left p-3 font-medium">Total</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-t hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-xs">{order.orderNumber}</td>
                    <td className="p-3">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                    </td>
                    <td className="p-3 text-muted-foreground">{order.items?.length || 0} articole</td>
                    <td className="p-3 font-bold">{order.total.toFixed(2)} lei</td>
                    <td className="p-3"><StatusBadge status={order.status} /></td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {new Date(order.createdAt).toLocaleDateString("ro-RO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState emoji="📭" text="Inca nu sunt comenzi" />
        )}
      </div>
    </div>
  );
}

function KPICard({ emoji, label, value, sub, color }: { emoji: string; label: string; value: any; sub: string; color: string }) {
  return (
    <div className={`${color} border rounded-xl p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-70">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <span className="text-2xl">{emoji}</span>
      </div>
      <p className="text-xs opacity-60 mt-2">{sub}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; cls: string }> = {
    PENDING: { label: "In asteptare", cls: "bg-yellow-100 text-yellow-700" },
    CONFIRMED: { label: "Confirmata", cls: "bg-green-100 text-green-700" },
    SHIPPED: { label: "Expediata", cls: "bg-blue-100 text-blue-700" },
    DELIVERED: { label: "Livrate", cls: "bg-emerald-100 text-emerald-700" },
    CANCELLED: { label: "Anulata", cls: "bg-red-100 text-red-700" },
  };
  const c = config[status] || { label: status, cls: "bg-muted" };
  return <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.cls}`}>{c.label}</span>;
}

function EmptyState({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <span className="text-3xl block mb-2">{emoji}</span>
      <p className="text-sm">{text}</p>
    </div>
  );
}
