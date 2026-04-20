import Link from "next/link";

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const params = await searchParams;
  const orderNumber = params.order || "";

  return (
    <div className="container mx-auto px-5 lg:px-8 py-28 text-center">
      <div className="max-w-md mx-auto space-y-7">
        {/* Green checkmark circle */}
        <div className="w-16 h-16 bg-sage-light rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-7 h-7 text-sage"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-near-black tracking-tight">
          Comanda Plasata!
        </h1>

        <p className="text-secondary-gray text-sm leading-relaxed">
          Multumim pentru comanda! Numarul comenzii tale este:
        </p>

        {/* Order number card */}
        <div className="bg-light-surface border border-border-gray rounded-xl px-8 py-5 inline-block">
          <span className="font-heading text-2xl font-bold text-near-black tracking-tight">
            {orderNumber}
          </span>
        </div>

        <p className="text-xs text-secondary-gray">
          Vei primi un email de confirmare in curand.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
          <Link
            href="/produse"
            className="inline-flex items-center justify-center rounded-full bg-rausch px-8 py-3.5 text-sm font-semibold text-white hover:bg-rausch-dark transition-colors duration-200"
          >
            Continua Cumparaturile
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border-gray px-8 py-3.5 text-sm font-medium text-secondary-gray hover:text-near-black hover:border-near-black transition-colors duration-200"
          >
            Acasa
          </Link>
        </div>
      </div>
    </div>
  );
}
