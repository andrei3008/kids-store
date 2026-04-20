"use client";

import Link from "next/link";

interface SubCat {
  id: string;
  name: string;
  slug: string;
}

interface Cat {
  id: string;
  name: string;
  slug: string;
  children: SubCat[];
}

export default function CategoryFilter({
  categories,
  active,
}: {
  categories: Cat[];
  active?: string;
}) {
  const activeParent = categories.find((c) => c.slug === active);
  const activeIsParent = activeParent && activeParent.children.length > 0;

  return (
    <div className="mb-8">
      {/* Main category pill bar */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        <Link
          href="/produse"
          className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            !active
              ? "bg-near-black text-white"
              : "bg-transparent text-secondary-gray hover:bg-light-surface"
          }`}
        >
          Toate
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/produse?category=${cat.slug}`}
            className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              active === cat.slug
                ? "bg-near-black text-white"
                : "bg-transparent text-secondary-gray hover:bg-light-surface"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Subcategory row */}
      {activeIsParent && activeParent && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none mt-3">
          {activeParent.children.map((sub) => (
            <Link
              key={sub.id}
              href={`/produse?category=${sub.slug}`}
              className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium text-secondary-gray border border-border-gray hover:border-near-black hover:text-near-black transition-colors duration-200"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
