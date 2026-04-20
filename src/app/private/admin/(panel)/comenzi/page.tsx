"use client";

import { useEffect, useState } from "react";

const statusLabels: Record<string, string> = {
  PENDING: "⏳ În așteptare",
  CONFIRMED: "✅ Confirmată",
  SHIPPED: "🚚 Expediată",
  DELIVERED: "📦 Livrată",
  CANCELLED: "❌ Anulată",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-green-100 text-green-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const url = filter ? `/api/orders?status=${filter}` : "/api/orders";
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Not auth");
        return r.json();
      })
      .then((data) => setOrders(data.orders || []))
      .catch(() => (window.location.href = "/private/admin/login"))
      .finally(() => setLoading(false));
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    }
  }

  if (loading) return <div className="text-center py-20">Se încarcă...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Comenzi ({orders.length})</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">Toate</option>
          <option value="PENDING">În așteptare</option>
          <option value="CONFIRMED">Confirmate</option>
          <option value="SHIPPED">Expediate</option>
          <option value="DELIVERED">Livrate</option>
          <option value="CANCELLED">Anulate</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Nu sunt comenzi</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm font-bold">{order.orderNumber}</span>
                  <span className="text-sm text-muted-foreground ml-3">
                    {new Date(order.createdAt).toLocaleDateString("ro-RO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="PENDING">În așteptare</option>
                    <option value="CONFIRMED">Confirmată</option>
                    <option value="SHIPPED">Expediată</option>
                    <option value="DELIVERED">Livrată</option>
                    <option value="CANCELLED">Anulată</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Client:</span>
                  <div className="font-medium">{order.customerName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <div>{order.customerEmail}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Telefon:</span>
                  <div>{order.customerPhone}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Adresa:</span>
                  <div>{order.address}, {order.city}</div>
                </div>
              </div>

              <div className="border-t pt-3">
                <div className="space-y-1">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span>{item.name} ({item.size}) x{item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} lei</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-sm mt-2 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{order.total.toFixed(2)} lei</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
