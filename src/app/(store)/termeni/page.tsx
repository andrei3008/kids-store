import Link from "next/link";

const sections = [
  { n: "1", title: "Dispozitii Generale", content: ["Prezentul document stabileste termenii si conditiile de utilizare a site-ului MiniBoutique (miniboutique.ro), proprietatea S.C. MiniBoutique S.R.L., inregistrata in Registrul Comertului sub numarul J40/12345/2020, CUI RO34567890, sediul social in Bucuresti, Str. Florilor nr. 42, Sector 1.", "Prin accesarea si utilizarea acestui site, sunteti de acord cu termenii si conditiile de mai jos. Daca nu sunteti de acord, va rugam sa nu utilizati site-ul."] },
  { n: "2", title: "Contul de Utilizator", content: ["Pentru a plasa o comanda, nu este necesar un cont. Puteti comanda ca vizitator, furnizand datele de contact si livrare necesare.", "Va rezervam dreptul de a refuza sau anula comenzi in cazul in care exista suspiciuni de frauda sau incalcarea termenilor de utilizare."] },
  { n: "3", title: "Produse si Preturi", content: ["Toate preturile afisate pe site sunt exprimate in lei (RON) si includ TVA. MiniBoutique isi rezerva dreptul de a modifica preturile fara notificare prealabila. Pretul aplicabil este cel valabil la momentul plasarii comenzii.", "Ne straduim sa afisam cat mai exact culorile si caracteristicile produselor. Totusi, datorita setarilor monitorului, pot exista mici diferente de nuanta.", "Stocul produselor este actualizat in timp real. In cazul in care un produs comandat nu mai este pe stoc, va vom notifica si va oferi o alternativa sau rambursare."] },
  { n: "4", title: "Comenzi si Plata", content: ["Comanda se considera validata dupa confirmarea ei de catre echipa noastra. Veti primi un email de confirmare cu detaliile comenzii.", "Metode de plata acceptate: ramburs la livrare (numerar) si transfer bancar (ordin de plata). In cazul platii ramburs, taxa de ramburs este suportata de client si este afisata la finalizarea comenzii."] },
  { n: "5", title: "Livrare", content: ["Livram in toata Romania prin curier rapid. Timpul de livrare este de 2-5 zile lucratoare, in functie de localitate. Livrarea este gratuita pentru comenzi peste 150 lei.", "Riscul transferului produselor trece la client in momentul predarii coletului catre curier. Va recomandam sa verificati coletul la livrare."] },
  { n: "6", title: "Retur si Rambursare", content: ["Conform legislatiei in vigoare, aveti dreptul sa returnati produsele in termen de 14 zile de la primire, fara a preciza un motiv. MiniBoutique ofera un termen extins de 30 de zile pentru returnare.", "Produsele returnate trebuie sa fie in stare noua, cu etichetele atasate si in ambalajul original. Costul transportului de returnare este suportat de client.", "Rambursarea se va face in maximum 14 zile de la primirea produsului returnat, prin aceeasi metoda de plata folosita la achizitie."] },
  { n: "7", title: "Proprietate Intelectuala", content: ["Tot continutul site-ului (texte, imagini, logo-uri, design) este proprietatea MiniBoutique si este protejat de legile privind drepturile de autor. Reproducerea sau utilizarea fara acordul nostru este interzisa."] },
  { n: "8", title: "Protectia Datelor Personale", content: ["MiniBoutique respecta legislatia privind protectia datelor cu caracter personal (GDPR). Datele personale colectate sunt folosite exclusiv pentru procesarea comenzilor si comunicarea cu clientii.", "Nu vom trimite comunicari comerciale fara acordul dumneavoastra. Va puteti dezabona oricand de la newsletter."] },
  { n: "9", title: "Limitarea Raspunderii", content: ["MiniBoutique nu poate fi tinuta responsabila pentru daune indirecte, accidentale sau consecvente care pot rezulta din utilizarea site-ului sau a produselor noastre. Raspunderea noastra este limitata la valoarea produselor achizitionate."] },
  { n: "10", title: "Solutionarea Litigiilor", content: ["Orice litigiu va fi solutionat pe cale amiabila. In cazul in care acest lucru nu este posibil, litigiile vor fi solutionate de instantele competente din Romania, in conformitate cu legislatia romana in vigoare."] },
  { n: "11", title: "Modificari ale Termenilor", content: ["MiniBoutique isi rezerva dreptul de a modifica termenii si conditiile oricand. Modificarile intra in vigoare de la data publicarii pe site. Va recomandam sa consultati periodic aceasta pagina."] },
];

export default function TermeniPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 lg:px-8 max-w-4xl text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-near-black mb-4 tracking-tight">
            Termeni si Conditii
          </h1>
          <p className="text-sm text-secondary-gray">
            Ultima actualizare: 1 Ianuarie 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-5 lg:px-8 pb-24">
        <div className="max-w-3xl mx-auto space-y-12">
          {sections.map((s) => (
            <div key={s.n}>
              <h2 className="font-heading text-lg font-bold text-near-black mb-4 flex items-center gap-3">
                <span className="w-7 h-7 bg-rausch/10 rounded-full flex items-center justify-center text-xs font-bold text-rausch shrink-0">
                  {s.n}
                </span>
                {s.title}
              </h2>
              <div className="space-y-3 text-sm text-secondary-gray leading-relaxed pl-10">
                {s.content.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          ))}

          {/* CTA card */}
          <div className="bg-light-surface border border-border-gray rounded-xl p-7 mt-8">
            <h3 className="font-heading font-bold text-near-black mb-2">
              Intrebari despre termeni?
            </h3>
            <p className="text-sm text-secondary-gray mb-5">
              Daca aveti intrebari sau nelamuriri, nu ezitati sa ne contactati.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-rausch px-6 py-2.5 text-sm font-semibold text-white hover:bg-rausch-dark transition-colors duration-200"
              >
                Contacteaza-ne
              </Link>
              <Link
                href="/livrare"
                className="inline-flex items-center justify-center rounded-full border border-border-gray px-6 py-2.5 text-sm font-medium text-secondary-gray hover:text-near-black hover:border-near-black transition-colors duration-200"
              >
                Vezi Politica de Livrare
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
