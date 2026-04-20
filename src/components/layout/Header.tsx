"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

interface SubCategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  children: SubCategory[];
}

export function Header({ categories }: { categories: Category[] }) {
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function updateCount() {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));
    }
    updateCount();
    window.addEventListener("cart-updated", updateCount);
    return () => window.removeEventListener("cart-updated", updateCount);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleDropdownEnter(slug: string) {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(slug);
  }

  function handleDropdownLeave() {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 150);
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-[0_2px_8px_rgba(0,0,0,0.08)]" : "shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        }`}
      >
        <div className="max-w-[1760px] mx-auto flex h-20 items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-[22px] font-bold tracking-tight text-near-black">
              MiniBoutique
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center h-full">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleDropdownEnter(cat.slug)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href={`/produse?category=${cat.slug}`}
                  className={`px-5 h-full flex items-center text-[14px] font-medium transition-colors duration-150 ${
                    activeDropdown === cat.slug
                      ? "text-near-black"
                      : "text-secondary-gray hover:text-near-black"
                  }`}
                >
                  {cat.name}
                </Link>
              </div>
            ))}
            <Link
              href="/despre"
              className="px-5 h-full flex items-center text-[14px] font-medium text-secondary-gray hover:text-near-black transition-colors duration-150"
            >
              Despre Noi
            </Link>
            <Link
              href="/contact"
              className="px-5 h-full flex items-center text-[14px] font-medium text-secondary-gray hover:text-near-black transition-colors duration-150"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/cos"
              className="relative flex items-center justify-center w-12 h-12 rounded-full hover:bg-light-surface transition-colors duration-150"
            >
              <svg
                className="w-[22px] h-[22px] text-near-black"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rausch text-[10px] font-bold text-white px-1 animate-bounce-in">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex items-center justify-center w-12 h-12 rounded-full hover:bg-light-surface transition-colors duration-150"
              aria-label="Menu"
            >
              <svg className="h-[22px] w-[22px] text-near-black" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mega Menu Dropdown */}
      <div
        className={`fixed top-20 left-0 right-0 z-40 transition-all duration-200 ease-out ${
          activeDropdown
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
        onMouseEnter={() => activeDropdown && handleDropdownEnter(activeDropdown)}
        onMouseLeave={handleDropdownLeave}
      >
        {activeDropdown && (() => {
          const cat = categories.find((c) => c.slug === activeDropdown);
          if (!cat) return null;
          return (
            <div className="bg-white border-t border-border-gray/50 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
              <div className="max-w-[1760px] mx-auto px-6 lg:px-10 py-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-1">
                  {cat.children.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/produse?category=${sub.slug}`}
                      onClick={() => setActiveDropdown(null)}
                      className="group/sub flex items-center gap-3 py-3 px-3 -mx-3 rounded-xl hover:bg-light-surface transition-colors duration-150"
                    >
                      <span className="text-[14px] font-medium text-near-black group-hover/sub:text-rausch transition-colors duration-150">
                        {sub.name}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-border-gray/40">
                  <Link
                    href={`/produse?category=${cat.slug}`}
                    onClick={() => setActiveDropdown(null)}
                    className="inline-flex items-center gap-2 text-[14px] font-semibold text-rausch hover:text-rausch-dark transition-colors duration-150"
                  >
                    Vezi toate produsele {cat.name.toLowerCase()}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Dropdown backdrop */}
      <div
        className={`fixed inset-0 top-20 bg-black/10 z-30 transition-opacity duration-200 ${
          activeDropdown ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setActiveDropdown(null)}
      />

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 z-50 w-[85%] max-w-sm h-full bg-white shadow-2xl transition-transform duration-300 ease-out lg:hidden overflow-y-auto ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-gray/50">
          <span className="text-[18px] font-bold tracking-tight text-near-black">MiniBoutique</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-light-surface transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-0.5">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center px-4 py-3.5 rounded-xl text-[15px] font-medium text-near-black hover:bg-light-surface transition-colors"
          >
            Acasa
          </Link>

          {categories.map((cat) => (
            <div key={cat.id}>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === cat.slug ? null : cat.slug)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-medium text-near-black hover:bg-light-surface transition-colors"
              >
                {cat.name}
                <svg
                  className={`w-4 h-4 text-secondary-gray transition-transform duration-200 ${mobileExpanded === cat.slug ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ease-out ${mobileExpanded === cat.slug ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="pl-4 py-1 space-y-0.5">
                  <Link
                    href={`/produse?category=${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center px-4 py-2.5 rounded-lg text-[14px] font-semibold text-rausch hover:bg-rausch/5 transition-colors"
                  >
                    Vezi toate
                  </Link>
                  {cat.children.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/produse?category=${sub.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center px-4 py-2.5 rounded-lg text-[14px] text-secondary-gray hover:text-near-black hover:bg-light-surface transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="h-px bg-border-gray/50 my-2" />
          <Link href="/despre" onClick={() => setMenuOpen(false)} className="flex items-center px-4 py-3.5 rounded-xl text-[15px] font-medium text-secondary-gray hover:text-near-black hover:bg-light-surface transition-colors">Despre Noi</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)} className="flex items-center px-4 py-3.5 rounded-xl text-[15px] font-medium text-secondary-gray hover:text-near-black hover:bg-light-surface transition-colors">Contact</Link>
          <Link href="/livrare" onClick={() => setMenuOpen(false)} className="flex items-center px-4 py-3.5 rounded-xl text-[15px] font-medium text-secondary-gray hover:text-near-black hover:bg-light-surface transition-colors">Livrare & Retur</Link>
        </nav>

        <div className="px-4 pt-2 pb-8 border-t border-border-gray/50 mt-2">
          <Link
            href="/cos"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-between px-5 py-3.5 rounded-xl bg-light-surface text-[15px] font-medium hover:bg-cream transition-colors"
          >
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5 text-near-black" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              Cosul meu
            </span>
            {cartCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-rausch text-[11px] font-bold text-white px-1.5">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  );
}
