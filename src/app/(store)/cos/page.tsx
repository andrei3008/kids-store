"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EMOJIS = ["🌸", "👖", "🧥", "👕", "👒", "🧸"];

const CARD_SHADOW =
  "shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px,rgba(0,0,0,0.1)_0px_4px_8px]";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));

    function onUpdate() {
      setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
    }
    window.addEventListener("cart-updated", onUpdate);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

  if (!mounted) return null;

  const total = cart.reduce((sum, item) => {
    const price = item.salePrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);

  function removeItem(index: number) {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
  }

  function updateQty(index: number, qty: number) {
    if (qty < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = qty;
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-xs mx-auto px-6">
          <div className="w-16 h-16 bg-light-surface rounded-full flex items-center justify-center mx-auto mb-5">
            <svg
              className="w-7 h-7 text-secondary-gray"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-near-black mb-1.5">
            Cosul este gol
          </h1>
          <p className="text-sm text-secondary-gray mb-7">
            Adauga produse din magazinul nostru
          </p>
          <Link
            href="/produse"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-rausch px-6 py-3 text-sm font-semibold text-white hover:bg-rausch-dark transition-colors duration-150"
          >
            Vezi produsele
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-5 lg:px-8 py-10 md:py-16">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-near-black">
          Cosul tau
        </h1>
        <p className="text-sm text-secondary-gray mt-1">
          {cart.length} {cart.length === 1 ? "produs" : "produse"} in cos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item, i) => {
            const itemTotal = (item.salePrice ?? item.price) * item.quantity;
            return (
              <div
                key={`${item.id}-${item.size}`}
                className={`flex items-center gap-4 bg-white border border-border-gray rounded-xl p-4 md:p-5 transition-colors duration-150 hover:border-near-black/20 ${CARD_SHADOW}`}
              >
                {/* Product emoji */}
                <div className="w-14 h-14 bg-light-surface rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {EMOJIS[i % EMOJIS.length]}
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/produse/${item.slug}`}
                    className="text-sm font-medium text-near-black hover:text-rausch transition-colors duration-150"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-secondary-gray mt-0.5">
                    Marime: {item.size}
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center border border-border-gray rounded-full overflow-hidden">
                  <button
                    onClick={() => updateQty(i, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center bg-light-surface hover:bg-border-gray transition-colors duration-100 text-sm text-secondary-gray"
                  >
                    -
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-near-black">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQty(i, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center bg-light-surface hover:bg-border-gray transition-colors duration-100 text-sm text-secondary-gray"
                  >
                    +
                  </button>
                </div>

                {/* Price */}
                <span className="text-sm font-semibold text-near-black whitespace-nowrap">
                  {itemTotal.toFixed(2)} lei
                </span>

                {/* Remove button */}
                <button
                  onClick={() => removeItem(i)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-secondary-gray hover:text-rausch hover:bg-rausch/5 transition-colors duration-150"
                  aria-label="Elimina produsul"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary sidebar */}
        <div className="h-fit lg:sticky lg:top-24">
          <div
            className={`bg-white border border-border-gray rounded-[20px] p-6 space-y-5 ${CARD_SHADOW}`}
          >
            <h3 className="text-base font-semibold text-near-black">
              Sumar comanda
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-gray">Subtotal</span>
                <span className="text-near-black font-medium">
                  {total.toFixed(2)} lei
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-gray">Livrare</span>
                <span className="font-medium text-near-black">Gratuit</span>
              </div>
            </div>

            <div className="border-t border-border-gray pt-4 flex justify-between">
              <span className="font-bold text-near-black">Total</span>
              <span className="font-bold text-near-black">
                {total.toFixed(2)} lei
              </span>
            </div>

            <button
              onClick={() => router.push("/checkout")}
              className="w-full rounded-lg bg-rausch py-3.5 text-sm font-semibold text-white hover:bg-rausch-dark transition-colors duration-150 active:scale-[0.98]"
            >
              Finalizeaza comanda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
