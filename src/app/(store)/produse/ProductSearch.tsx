"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductSearch({ initialSearch }: { initialSearch: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialSearch);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    router.push(`/produse?${params.toString()}`);
  }

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    router.push(`/produse?${params.toString()}`);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <form onSubmit={handleSearch} className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-gray" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cauta produse..."
            className="w-full rounded-full border border-border-gray bg-white pl-11 pr-4 py-3 text-[14px] font-medium text-near-black placeholder:text-secondary-gray focus:outline-none focus:border-near-black transition-colors duration-150"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-near-black px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#3f3f3f] transition-colors duration-150"
        >
          Cauta
        </button>
      </form>

      <select
        value={searchParams.get("sort") || ""}
        onChange={(e) => handleSort(e.target.value)}
        className="rounded-full border border-border-gray bg-white px-4 py-3 text-[14px] font-medium text-secondary-gray focus:outline-none focus:border-near-black transition-colors duration-150"
      >
        <option value="">Sortare: Noi</option>
        <option value="price-asc">Pret: Crescator</option>
        <option value="price-desc">Pret: Descrescator</option>
        <option value="name">Nume: A-Z</option>
      </select>
    </div>
  );
}
