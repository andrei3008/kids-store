import Link from "next/link";

const shopLinks = [
  { label: "Toate Produsele", href: "/produse" },
  { label: "Fete", href: "/produse?category=fete" },
  { label: "Baieti", href: "/produse?category=baieti" },
  { label: "Bebelusi", href: "/produse?category=bebelusi" },
  { label: "Accesorii", href: "/produse?category=accesorii" },
];

const infoLinks = [
  { label: "Despre Noi", href: "/despre" },
  { label: "Livrare & Retur", href: "/livrare" },
  { label: "Termeni si Conditii", href: "/termeni" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-light-surface border-t border-border-gray/50">
      <div className="container mx-auto px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-block text-xl font-semibold text-near-black tracking-tight"
            >
              MiniBoutique
            </Link>
            <p className="text-secondary-gray text-sm leading-relaxed max-w-xs">
              Hainute vesele si confortabile pentru cei mici. Calitate si
              dragoste in fiecare produs.
            </p>
          </div>

          {/* Magazin */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-near-black">Magazin</h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-gray hover:text-near-black transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informatii */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-near-black">
              Informatii
            </h3>
            <ul className="space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary-gray hover:text-near-black transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-semibold text-near-black">Contact</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 mt-0.5 text-secondary-gray shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  />
                </svg>
                <div className="text-sm text-secondary-gray">
                  <div>0721 234 567</div>
                  <div className="text-xs text-secondary-gray/70 mt-0.5">
                    Luni - Vineri, 09:00 - 18:00
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 mt-0.5 text-secondary-gray shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                <span className="text-sm text-secondary-gray">
                  contact@miniboutique.ro
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-4 h-4 mt-0.5 text-secondary-gray shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <div className="text-sm text-secondary-gray">
                  <div>Str. Florilor nr. 42</div>
                  <div className="text-xs text-secondary-gray/70 mt-0.5">
                    Bucuresti, Sector 1
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border-gray/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-secondary-gray">
            <div>
              &copy; {new Date().getFullYear()} MiniBoutique. Toate drepturile
              rezervate.
            </div>
            <div className="flex gap-6">
              <Link
                href="/termeni"
                className="hover:text-near-black transition-colors duration-200"
              >
                Termeni si Conditii
              </Link>
              <Link
                href="/livrare"
                className="hover:text-near-black transition-colors duration-200"
              >
                Livrare & Retur
              </Link>
              <Link
                href="/contact"
                className="hover:text-near-black transition-colors duration-200"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
