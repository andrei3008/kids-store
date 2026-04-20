import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Produs - MiniBoutique" };

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, sizes: true },
  });

  if (!product || product.status !== "ACTIVE") notFound();

  const emojis = ["🌸", "👖", "🧥", "👕", "👒", "🧸", "🎀", "👶", "🧢", "👗", "🎒", "🧣"];
  const emoji = emojis[product.name.length % emojis.length];
  const effectivePrice = product.salePrice ?? product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
          {/* Image Section */}
          <div className="aspect-square bg-light-surface rounded-[20px] flex items-center justify-center relative overflow-hidden">
            <span className="text-[8rem] md:text-[10rem] select-none">{emoji}</span>
            {discountPercent && (
              <span className="absolute top-5 left-5 bg-rausch text-white text-xs font-bold px-3.5 py-1.5 rounded-[8px] tracking-wide uppercase">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-center py-2 md:py-6">
            {/* Category */}
            {product.category && (
              <span className="text-xs font-medium text-secondary-gray uppercase tracking-[0.12em] mb-4">
                {product.category.name}
              </span>
            )}

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-near-black leading-tight tracking-tight mb-6">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-bold text-near-black">
                {effectivePrice.toFixed(2)} lei
              </span>
              {hasDiscount && (
                <span className="text-lg text-secondary-gray line-through">
                  {product.price.toFixed(2)} lei
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-base text-secondary-gray leading-relaxed max-w-md mb-8">
                {product.description}
              </p>
            )}

            {/* Add to Cart */}
            <div className="mb-10">
              <AddToCartButton product={product} />
            </div>

            {/* Trust Badges */}
            <div className="border-t border-border-gray pt-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                {[
                  { emoji: "🚚", label: "Livrare express 2-3 zile" },
                  { emoji: "↩️", label: "Retur gratuit 30 zile" },
                  { emoji: "✨", label: "Calitate garantata" },
                  { emoji: "🔒", label: "Plati 100% securizate" },
                ].map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2.5 text-sm text-secondary-gray font-medium"
                  >
                    <span className="text-base">{badge.emoji}</span>
                    {badge.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
