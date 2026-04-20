import prisma from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import ProductSearch from "./ProductSearch";

export const metadata = { title: "Produse - MiniBoutique" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const search = params.search;
  const sort = params.sort;

  const where: any = { status: "ACTIVE" };
  if (category) {
    const cat = await prisma.category.findUnique({
      where: { slug: category },
      include: { children: true },
    });
    if (cat) {
      if (cat.children.length > 0) {
        const catIds = [cat.id, ...cat.children.map((c) => c.id)];
        where.categoryId = { in: catIds };
      } else {
        where.categoryId = cat.id;
      }
    }
  }
  if (search) where.name = { contains: search };

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  const mainCategories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: { orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });

  let activeName = "Toate produsele";
  if (category) {
    for (const mc of mainCategories) {
      if (mc.slug === category) { activeName = mc.name; break; }
      for (const sc of mc.children) {
        if (sc.slug === category) { activeName = sc.name; break; }
      }
    }
  }

  const [products] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, sizes: true },
      orderBy,
    }),
  ]);

  return (
    <div className="max-w-[1760px] mx-auto px-6 lg:px-10 py-8 md:py-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-near-black tracking-tight" style={{ letterSpacing: "-0.02em" }}>
          {activeName}
        </h1>
        <p className="text-[14px] text-secondary-gray mt-1">
          {products.length} {products.length === 1 ? "produs" : "produse"}
        </p>
      </div>

      {/* Search + Sort */}
      <div className="mb-6">
        <ProductSearch initialSearch={search || ""} />
      </div>

      {/* Category filter pills */}
      <CategoryFilter categories={mainCategories} active={category} />

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-light-surface rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-secondary-gray" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-[18px] font-semibold text-near-black mb-2">Nu am gasit produse</p>
          {search && (
            <p className="text-[14px] text-secondary-gray">
              Incearca un alt termen de cautare sau{" "}
              <a href="/produse" className="text-rausch font-medium hover:underline">
                vezi toate produsele
              </a>
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
