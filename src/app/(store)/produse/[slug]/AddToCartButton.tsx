"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ product }: { product: any }) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);

  function addToCart() {
    if (!selectedSize) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(
      (item: any) => item.id === product.id && item.size === selectedSize
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        salePrice: product.salePrice,
        size: selectedSize,
        quantity: qty,
        slug: product.slug,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
    router.push("/cos");
  }

  return (
    <div className="space-y-5">
      {/* Size selection */}
      <div>
        <h3 className="text-sm font-semibold text-near-black mb-3">
          Alege marimea
        </h3>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s: any) => (
            <button
              key={s.id}
              onClick={() => s.stock > 0 && setSelectedSize(s.label)}
              disabled={s.stock <= 0}
              className={`min-w-[3rem] px-4 py-2.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedSize === s.label
                  ? "bg-near-black text-white"
                  : s.stock > 0
                  ? "border border-border-gray text-secondary-gray hover:border-near-black hover:text-near-black"
                  : "border border-border-gray text-secondary-gray/40 line-through cursor-not-allowed opacity-50"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      {selectedSize && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-secondary-gray">
            Cantitate
          </span>
          <div className="flex items-center border border-border-gray rounded-full overflow-hidden">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-9 h-9 flex items-center justify-center hover:bg-light-surface transition-colors text-secondary-gray text-sm"
            >
              -
            </button>
            <span className="w-9 h-9 flex items-center justify-center font-medium text-sm text-near-black">
              {qty}
            </span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-9 h-9 flex items-center justify-center hover:bg-light-surface transition-colors text-secondary-gray text-sm"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Add to cart button */}
      <button
        onClick={addToCart}
        disabled={!selectedSize}
        className="w-full rounded-full bg-rausch px-8 py-4 text-sm font-semibold text-white hover:bg-rausch-dark transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-rausch active:scale-[0.98]"
      >
        {selectedSize ? "Adauga in Cos" : "Selecteaza o marime"}
      </button>
    </div>
  );
}
