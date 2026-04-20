import Link from "next/link";

const values = [
  { emoji: "🌿", title: "Materiale Naturale", desc: "Folosim doar materiale 100% naturale, sigure si delicate cu pielea copiilor." },
  { emoji: "🎨", title: "Design Creativ", desc: "Fiecare piesa este conceputa cu imaginatie si atentie la detalii." },
  { emoji: "🤝", title: "Produs Local", desc: "Sprijinim productia locala si artizanii romani din intreaga tara." },
  { emoji: "💚", title: "Sustenabilitate", desc: "Ne pasa de planeta - folosim ambalaje reciclabile si materiale eco-friendly." },
];

const team = [
  { name: "Ana Popescu", role: "Fondatoare & Designer", emoji: "👩‍🎨" },
  { name: "Mihai Ionescu", role: "Operatiuni & Livrari", emoji: "👨‍💼" },
  { name: "Elena Dumitrescu", role: "Relatii cu Clientii", emoji: "👩‍💻" },
  { name: "Cristian Marin", role: "Marketing & Social Media", emoji: "👨‍🎤" },
];

const milestones = [
  { year: "2020", text: "MiniBoutique se naste din pasiunea pentru hainele de calitate pentru copii." },
  { year: "2021", text: "Lansam primul magazin online si livram primele 100 de comenzi." },
  { year: "2022", text: "Ne extindem la peste 500 de produse si 4 categorii principale." },
  { year: "2023", text: "Depasim 5.000 de clienti fericiti si lansam programul de loialitate." },
  { year: "2024", text: "Introducem linia eco-friendly si ambalajele sustenabile." },
  { year: "2025", text: "Ne extindem in toata Romania cu livrare rapida in 24-48h." },
];

const stats = [
  { value: "10K+", label: "Clienti Fericiti" },
  { value: "500+", label: "Produse" },
  { value: "4.9", label: "Rating" },
  { value: "5 ani", label: "Experienta" },
];

export default function DesprePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 lg:px-8 max-w-4xl text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-near-black mb-6 tracking-tight leading-[1.05]">
            Povestea din spatele<br />hainutelor cu suflet
          </h1>
          <p className="text-base md:text-lg text-secondary-gray max-w-2xl mx-auto leading-relaxed">
            Suntem o echipa de parinti pasionati care cred ca fiecare copil merita hainite frumoase, confortabile si facute cu dragoste.
          </p>
        </div>
      </section>

      {/* Story + Stats */}
      <section className="container mx-auto px-5 lg:px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-5">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-near-black tracking-tight">Povestea Noastra</h2>
              <p className="text-secondary-gray leading-relaxed text-[15px]">
                MiniBoutique s-a nascut in 2020 din dorinta de a oferi parintilor din Romania acces la haine de calitate pentru copii, la preturi accesibile. Am inceput intr-un garaj mic, cu cateva rochite si blugi cusuti manual, si am crescut pana am devenit unul dintre magazinele preferate de haine pentru copii din Romania.
              </p>
              <p className="text-secondary-gray leading-relaxed text-[15px]">
                Ceea ce ne diferentiaza este grija pentru detalii - fiecare produs este testat pentru confort si siguranta, iar materialele noastre sunt atent selectionate pentru a fi delicate cu pielea sensibila a celor mici.
              </p>
            </div>
            <div className="bg-light-surface rounded-3xl p-10 text-center border border-border-gray">
              <div className="text-6xl mb-8">🧸</div>
              <div className="grid grid-cols-2 gap-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-heading text-3xl font-bold text-rausch">{s.value}</div>
                    <div className="text-xs text-secondary-gray mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-light-surface">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="py-20">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-near-black">Valorile Noastre</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="bg-white p-8 text-center space-y-3 rounded-xl border border-border-gray hover:shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px,rgba(0,0,0,0.1)_0px_4px_8px] transition-shadow duration-300"
                >
                  <div className="text-3xl">{v.emoji}</div>
                  <h3 className="font-semibold text-sm text-near-black">{v.title}</h3>
                  <p className="text-xs text-secondary-gray leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-5 lg:px-8 py-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold text-near-black">Momente Importante</h2>
          </div>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-6 group">
                <div className="flex-shrink-0 w-14 text-right">
                  <span className="text-xs font-bold text-rausch">{m.year}</span>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-rausch ring-4 ring-rausch/10" />
                  {i < milestones.length - 1 && <div className="w-px flex-1 bg-border-gray" />}
                </div>
                <p className="text-secondary-gray text-sm pb-8 leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-light-surface">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold text-near-black">Oamenii din Spatele Brandului</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
            {team.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-xl p-6 text-center border border-border-gray hover:shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px,rgba(0,0,0,0.1)_0px_4px_8px] transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-light-surface rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">{t.emoji}</div>
                <h3 className="font-semibold text-sm text-near-black">{t.name}</h3>
                <p className="text-xs text-secondary-gray mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-5 lg:px-8 py-16 text-center">
        <Link
          href="/produse"
          className="inline-flex items-center gap-2.5 rounded-full bg-rausch px-9 py-4 text-sm font-semibold text-white hover:bg-rausch-dark transition-colors duration-200"
        >
          Vezi produsele
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </section>
    </>
  );
}
