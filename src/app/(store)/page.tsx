import Link from "next/link";
import prisma from "@/lib/prisma";

const categories = [
  { name: "Fete", emoji: "👗", href: "/produse?category=fete" },
  { name: "Baieti", emoji: "🧢", href: "/produse?category=baieti" },
  { name: "Bebelusi", emoji: "👶", href: "/produse?category=bebelusi" },
  { name: "Accesorii", emoji: "🎀", href: "/produse?category=accesorii" },
];

const benefits = [
  { title: "Livrare rapida", desc: "In 2-3 zile lucratoare" },
  { title: "Retur gratuit", desc: "30 de zile pentru returnare" },
  { title: "Calitate premium", desc: "Materiale 100% naturale" },
  { title: "Dragoste in detaliu", desc: "Fiecare produs e facut cu grija" },
];

const EMOJIS = ["🌸", "👖", "🧥", "👕", "👒", "🧸", "🎀", "👶", "🧢", "👗", "🎒", "🧣"];
const BG_GRADIENTS = [
  "from-terracotta-light/40 to-amber-light/20",
  "from-sage-light/40 to-cream/80",
  "from-amber-light/30 to-blush/30",
  "from-blush/40 to-terracotta-light/20",
  "from-sage-light/30 to-amber-light/20",
  "from-linen to-terracotta-light/20",
];

async function getPopularProducts() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const oldestReset = await prisma.product.findFirst({
    where: { salesResetAt: { lt: thirtyDaysAgo } },
    select: { id: true },
  });

  if (oldestReset) {
    await prisma.product.updateMany({
      data: { monthlySales: 0, salesResetAt: new Date() },
    });
  }

  const bySales = await prisma.product.findMany({
    where: { status: "ACTIVE", monthlySales: { gt: 0 } },
    include: { category: true, sizes: true },
    orderBy: { monthlySales: "desc" },
    take: 8,
  });

  if (bySales.length >= 4) return bySales;

  const existingIds = bySales.map((p) => p.id);
  const filler = await prisma.product.findMany({
    where: { status: "ACTIVE", id: { notIn: existingIds } },
    include: { category: true, sizes: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 8 - bySales.length,
  });

  return [...bySales, ...filler];
}

export default async function HomePage() {
  const popularProducts = await getPopularProducts();

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="bg-white">
        <div className="container mx-auto px-5 lg:px-8 pt-28 md:pt-40 pb-24 md:pb-36">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-light-surface rounded-[32px] px-5 py-2.5 text-sm font-semibold text-secondary-gray">
              <span className="w-2 h-2 rounded-full bg-rausch animate-pulse-soft" />
              Colectie Primavara 2026
            </div>

            {/* Heading */}
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-near-black leading-[1.05]">
              Hainute vesele pentru copii fericiti
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-secondary-gray max-w-md mx-auto leading-relaxed">
              Descopera colectia noastra de hainute confortabile si pline de culoare, create cu dragoste pentru cei mici.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Link
                href="/produse"
                className="inline-flex items-center justify-center rounded-[32px] bg-rausch px-9 py-4 text-base font-semibold text-white hover:bg-rausch-dark hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.98]"
              >
                Vezi Produsele
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/despre"
                className="inline-flex items-center justify-center rounded-[32px] border border-border-gray bg-white px-9 py-4 text-base font-semibold text-near-black hover:bg-light-surface transition-all duration-200"
              >
                Despre Noi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category Cards ── */}
      <section className="bg-white pb-24 md:pb-32">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-near-black">
              Cumpara pe categorii
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group bg-white rounded-[20px] p-8 text-center transition-all duration-200 hover:-translate-y-1 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_8px_16px_rgba(0,0,0,0.08),0_12px_24px_rgba(0,0,0,0.14)]"
              >
                <div className="text-5xl md:text-6xl mb-4 transition-transform duration-300 group-hover:scale-110">
                  {cat.emoji}
                </div>
                <h3 className="font-semibold text-sm text-near-black group-hover:text-rausch transition-colors duration-200">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Products ── */}
      <section className="pb-24 md:pb-32">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-near-black">
                Produse populare
              </h2>
            </div>
            <Link
              href="/produse"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-rausch hover:gap-3 transition-all duration-200"
            >
              Vezi toate
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {popularProducts.map((product) => {
              const emoji = EMOJIS[product.name.length % EMOJIS.length];
              const gradient = BG_GRADIENTS[product.name.length % BG_GRADIENTS.length];
              const effectivePrice = product.salePrice ?? product.price;
              const hasDiscount = product.salePrice && product.salePrice < product.price;
              const discountPercent = hasDiscount
                ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
                : null;

              return (
                <Link
                  key={product.id}
                  href={`/produse/${product.slug}`}
                  className="group block"
                >
                  <div
                    className="bg-white rounded-[20px] overflow-hidden transition-all duration-200 hover:-translate-y-1.5 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_2px_6px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.1)] hover:shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_8px_16px_rgba(0,0,0,0.08),0_12px_24px_rgba(0,0,0,0.14)]"
                  >
                    {/* Image area — 4:3 ratio */}
                    <div
                      className={`aspect-[4/3] bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}
                    >
                      <span className="text-5xl md:text-6xl transition-transform duration-300 group-hover:scale-110">
                        {emoji}
                      </span>
                      {discountPercent && (
                        <span className="absolute top-3 left-3 bg-rausch text-white text-xs font-bold px-3 py-1 rounded-lg">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-4 space-y-1.5">
                      <h3 className="text-sm font-semibold leading-snug line-clamp-2 text-near-black">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-base text-near-black">
                          {effectivePrice.toFixed(2)} lei
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-secondary-gray line-through">
                            {product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/produse"
              className="inline-flex items-center gap-2 text-sm font-semibold text-rausch"
            >
              Vezi toate produsele
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Benefits Strip ── */}
      <section className="border-y border-border-gray">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border-gray">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="py-10 px-6 text-center space-y-1.5"
              >
                <h3 className="text-sm font-semibold text-near-black">{b.title}</h3>
                <p className="text-xs text-secondary-gray">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="bg-white">
        <div className="container mx-auto px-5 lg:px-8 py-24 md:py-32">
          <div className="max-w-lg mx-auto text-center space-y-6 border border-border-gray rounded-[32px] p-10 md:p-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-near-black leading-tight">
              Fii la curent cu noutatile!
            </h2>
            <p className="text-secondary-gray leading-relaxed text-sm">
              Aboneaza-te si fii primul care afla de reduceri si colectii noi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <input
                type="email"
                placeholder="adresa@email.ro"
                className="flex-1 rounded-[8px] px-5 py-3.5 text-sm bg-light-surface text-near-black placeholder:text-secondary-gray border border-border-gray focus:outline-none focus:border-near-black transition-colors"
              />
              <button className="rounded-[8px] bg-rausch px-8 py-3.5 text-sm font-semibold text-white hover:bg-rausch-dark transition-colors duration-200 active:scale-[0.98]">
                Aboneaza-te
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
