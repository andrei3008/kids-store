"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CARD_SHADOW =
  "shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px,rgba(0,0,0,0.1)_0px_4px_8px]";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    city: "",
    county: "",
    postalCode: "",
    notes: "",
  });

  useEffect(() => {
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(c);
    if (c.length === 0) router.push("/cos");
  }, [router]);

  const total = cart.reduce((sum, item) => {
    const price = item.salePrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: cart.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.salePrice ?? item.price,
            quantity: item.quantity,
            size: item.size,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Eroare la plasarea comenzii");
        setLoading(false);
        return;
      }

      const order = await res.json();
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cart-updated"));
      router.push(`/comanda-confirmata?order=${order.orderNumber}`);
    } catch {
      alert("Eroare de conexiune");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border-gray bg-white px-4 py-3 text-sm text-near-black placeholder:text-secondary-gray/60 focus:outline-none focus:ring-2 focus:ring-rausch/20 focus:border-rausch/40 transition-all duration-150";

  const labelClass = "block text-xs font-medium text-secondary-gray mb-1.5";

  return (
    <div className="container mx-auto px-5 lg:px-8 py-10 md:py-16">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-near-black">
          Finalizeaza comanda
        </h1>
        <p className="text-sm text-secondary-gray mt-1">
          Completeaza datele pentru a plasa comanda
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form fields */}
          <div className="lg:col-span-2 space-y-5">
            {/* Personal data */}
            <div
              className={`bg-white border border-border-gray rounded-[20px] p-6 space-y-5 ${CARD_SHADOW}`}
            >
              <h2 className="text-base font-semibold text-near-black">
                Date personale
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nume complet *</label>
                  <input
                    required
                    type="text"
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input
                    required
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) =>
                      setForm({ ...form, customerEmail: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Telefon *</label>
                  <input
                    required
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) =>
                      setForm({ ...form, customerPhone: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div
              className={`bg-white border border-border-gray rounded-[20px] p-6 space-y-5 ${CARD_SHADOW}`}
            >
              <h2 className="text-base font-semibold text-near-black">
                Adresa de livrare
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Adresa *</label>
                  <input
                    required
                    type="text"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Oras *</label>
                    <input
                      required
                      type="text"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Judet *</label>
                    <input
                      required
                      type="text"
                      value={form.county}
                      onChange={(e) =>
                        setForm({ ...form, county: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Cod postal *</label>
                    <input
                      required
                      type="text"
                      value={form.postalCode}
                      onChange={(e) =>
                        setForm({ ...form, postalCode: e.target.value })
                      }
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div
              className={`bg-white border border-border-gray rounded-[20px] p-6 ${CARD_SHADOW}`}
            >
              <label className={labelClass}>Note (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Instructiuni speciale de livrare..."
              />
            </div>
          </div>

          {/* Order summary sidebar */}
          <div className="h-fit lg:sticky lg:top-24">
            <div
              className={`bg-white border border-border-gray rounded-[20px] p-6 space-y-5 ${CARD_SHADOW}`}
            >
              <h3 className="text-base font-semibold text-near-black">
                Sumar comanda
              </h3>

              <div className="space-y-2.5">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm gap-3">
                    <span className="text-secondary-gray truncate">
                      {item.name} ({item.size}) x{item.quantity}
                    </span>
                    <span className="shrink-0 text-near-black font-medium">
                      {((item.salePrice ?? item.price) * item.quantity).toFixed(
                        2
                      )}{" "}
                      lei
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-secondary-gray">Livrare</span>
                <span className="font-medium text-near-black">Gratuit</span>
              </div>

              <div className="border-t border-border-gray pt-4 flex justify-between">
                <span className="font-bold text-near-black">Total</span>
                <span className="font-bold text-near-black">
                  {total.toFixed(2)} lei
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-rausch py-3.5 text-sm font-semibold text-white hover:bg-rausch-dark transition-colors duration-150 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
              >
                {loading
                  ? "Se proceseaza..."
                  : `Plaseaza comanda - ${total.toFixed(2)} lei`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
