import Link from "next/link";

const shippingMethods = [
  { emoji: "📦", name: "Curier Rapid", desc: "Livrare prin curier in toata Romania", price: "Gratuit peste 150 lei", time: "2-5 zile lucratoare" },
  { emoji: "🏃", name: "Livrare Express", desc: "Livrare accelerata in Bucuresti si Ilfov", price: "15 lei", time: "24-48 ore" },
  { emoji: "📍", name: "Ridicare din Depozit", desc: "Ridicare personala din depozitul nostru", price: "Gratuit", time: "In aceeasi zi" },
];

const returnSteps = [
  { step: "1", title: "Completeaza cererea de retur", desc: "Trimite-ne un email la retur@miniboutique.ro cu numarul comenzii si motivul returnarii." },
  { step: "2", title: "Pregateste produsul", desc: "Asigura-te ca produsul este in stare originala, cu etichetele atasate si in ambalajul original." },
  { step: "3", title: "Expediere", desc: "Trimite produsul prin curier la adresa noastra. Costul transportului este suportat de client." },
  { step: "4", title: "Refund", desc: "Dupa primirea si verificarea produsului, iti vom returna banii in 5-7 zile lucratoare." },
];

export default function LivrarePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 lg:px-8 max-w-4xl text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-near-black mb-5 tracking-tight">Livrare & Retur</h1>
          <p className="text-secondary-gray max-w-lg mx-auto leading-relaxed">Tot ce trebuie sa stii despre livrare, returnare si schimburi.</p>
        </div>
      </section>

      {/* Shipping Methods */}
      <section className="container mx-auto px-5 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl font-bold text-near-black">Metode de livrare</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {shippingMethods.map((method) => (
              <div
                key={method.name}
                className="bg-white border border-border-gray rounded-xl p-7 hover:shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px,rgba(0,0,0,0.1)_0px_4px_8px] transition-shadow duration-300"
              >
                <div className="text-3xl mb-4">{method.emoji}</div>
                <h3 className="font-semibold text-near-black mb-1.5">{method.name}</h3>
                <p className="text-xs text-secondary-gray mb-5">{method.desc}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-gray">Cost</span>
                    <span className="font-medium text-near-black">{method.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-gray">Timp</span>
                    <span className="font-medium text-near-black">{method.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="bg-light-surface">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="py-20">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="font-heading text-2xl font-bold text-near-black text-center">Informatii utile</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-white rounded-xl border border-border-gray p-6 space-y-4">
                  <h3 className="text-xs font-semibold text-secondary-gray">Ce include livrarea</h3>
                  <ul className="space-y-2.5 text-sm text-secondary-gray">
                    {["Confirmare prin SMS si email", "Tracking in timp real", "Ambalare atenta si sigura", "Verificare colet la livrare"].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="text-rausch mt-1 text-[6px]">●</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-xl border border-border-gray p-6 space-y-4">
                  <h3 className="text-xs font-semibold text-secondary-gray">Atentie la livrare</h3>
                  <ul className="space-y-2.5 text-sm text-secondary-gray">
                    {["Verificati coletul in prezenta curierului", "Semnati procesul-verbal daca exista probleme", "Fotografiati orice deteriorare a ambalajului", "Contactati-ne in maxim 24h daca sunt probleme"].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="text-rausch mt-1 text-[6px]">●</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bg-white border border-border-gray rounded-xl p-6 text-center shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px,rgba(0,0,0,0.1)_0px_4px_8px]">
                <p className="font-heading font-bold text-near-black">Livrare gratuita pentru comenzi peste 150 lei!</p>
                <p className="text-xs text-secondary-gray mt-1">Valabil pentru toate metodele de livrare standard in Romania.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Returns */}
      <section className="container mx-auto px-5 lg:px-8 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl font-bold text-near-black mb-2">Politica de retur</h2>
            <p className="text-secondary-gray text-sm">Ai 30 de zile pentru a returna orice produs cumparat de la noi.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {returnSteps.map((step) => (
              <div key={step.step} className="flex gap-4 bg-white border border-border-gray rounded-xl p-5 hover:shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px,rgba(0,0,0,0.1)_0px_4px_8px] transition-shadow duration-300">
                <div className="flex-shrink-0 w-9 h-9 bg-rausch/10 text-rausch rounded-lg flex items-center justify-center font-bold text-sm">{step.step}</div>
                <div>
                  <h3 className="font-semibold text-sm text-near-black mb-1">{step.title}</h3>
                  <p className="text-xs text-secondary-gray leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Return Conditions */}
      <section className="bg-light-surface py-24">
        <div className="container mx-auto px-5 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-near-black text-center mb-10">Conditii de retur</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white border border-border-gray rounded-xl p-6">
              <h3 className="text-xs font-semibold text-secondary-gray mb-3">Acceptat pentru retur</h3>
              <ul className="space-y-2.5 text-sm text-secondary-gray">
                {["Produse cu etichetele atasate", "Produse nefolosite si nespalate", "Produse in ambalajul original", "Cerere facuta in 30 de zile"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-rausch mt-1 text-[6px]">●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-border-gray rounded-xl p-6">
              <h3 className="text-xs font-semibold text-secondary-gray mb-3">Nu este acceptat</h3>
              <ul className="space-y-2.5 text-sm text-secondary-gray">
                {["Produse fara etichete", "Produse spalate sau folosite", "Lenjerie intima si ciorapi", "Produse personalizate"].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-rausch mt-1 text-[6px]">●</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-5 lg:px-8 py-16 text-center">
        <h2 className="font-heading text-xl font-bold text-near-black mb-3">Ai intrebari despre livrare?</h2>
        <p className="text-secondary-gray text-sm mb-6">Contacteaza-ne si te ajutam cu drag.</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-rausch px-8 py-3.5 text-sm font-semibold text-white hover:bg-rausch-dark transition-colors duration-200"
        >
          Contacteaza-ne
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </section>
    </>
  );
}
