import Link from "next/link";

const EMOJIS = ["🌸", "👖", "🧥", "👕", "👒", "🧸", "🎀", "👶", "🧢", "👗", "🎒", "🧣"];
const BG_COLORS = [
  "bg-[#FFD4DA]",
  "bg-[#E0F0E0]",
  "bg-[#FFF8DC]",
  "bg-[#FFEBEE]",
  "bg-[#E8F0FE]",
  "bg-[#F3E5F5]",
];

export default function ProductCard({ product }: { product: any }) {
  const effectivePrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : null;
  const emoji = EMOJIS[product.name.length % EMOJIS.length];
  const bgColor = BG_COLORS[product.name.length % BG_COLORS.length];

  return (
    <Link href={`/produse/${product.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden transition-shadow duration-200 ease-out hover:shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
        {/* Image area — Airbnb-style: large, immersive */}
        <div className={`aspect-[4/3] ${bgColor} flex items-center justify-center relative overflow-hidden`}>
          <span className="text-6xl md:text-7xl transition-transform duration-300 ease-out group-hover:scale-110">
            {emoji}
          </span>

          {/* Wishlist-style heart icon */}
          <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center">
            <svg className="w-6 h-6 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </div>

          {/* Guest favorite badge (Airbnb-style) */}
          {discountPercent ? (
            <span className="absolute top-3 left-3 bg-white text-near-black text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
              {discountPercent}% reducere
            </span>
          ) : null}
        </div>

        {/* Content — Airbnb listing details style */}
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-near-black leading-snug line-clamp-1" style={{ letterSpacing: "-0.01em" }}>
              {product.name}
            </h3>
          </div>

          {product.category?.name && (
            <p className="text-[13px] text-secondary-gray mt-0.5">
              {product.category.name}
            </p>
          )}

          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-[15px] font-semibold text-near-black">
              {effectivePrice.toFixed(0)} lei
            </span>
            {hasDiscount && (
              <span className="text-[13px] text-secondary-gray line-through">
                {product.price.toFixed(0)} lei
              </span>
            )}
          </div>

          {/* Sizes — subtle dots */}
          {product.sizes && product.sizes.length > 0 && (
            <p className="text-[12px] text-secondary-gray mt-1">
              Marimi: {product.sizes.filter((s: any) => s.stock > 0).map((s: any) => s.label).join(", ")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
