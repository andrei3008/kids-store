"use client";

import { useState } from "react";

const contactInfo = [
  { emoji: "📞", title: "Telefon", value: "0721 234 567", desc: "Luni - Vineri, 09:00 - 18:00" },
  { emoji: "📧", title: "Email", value: "contact@miniboutique.ro", desc: "Raspundem in maximum 24h" },
  { emoji: "📍", title: "Adresa", value: "Str. Florilor nr. 42", desc: "Bucuresti, Sector 1" },
  { emoji: "💬", title: "WhatsApp", value: "0721 234 567", desc: "Mesaje rapide si comenzi" },
];

const faqItems = [
  { q: "Care sunt metodele de plata?", a: "Acceptam plata ramburs la livrare si transfer bancar. In curand vom introduce si plata cu cardul online." },
  { q: "Cat dureaza livrarea?", a: "Livrarea se face in 2-5 zile lucratoare, in functie de locatia de livrare. In Bucuresti livram in 24-48h." },
  { q: "Pot returna un produs?", a: "Da, ai 30 de zile pentru returnare. Produsul trebuie sa fie in stare originala, cu etichetele atasate." },
  { q: "Cum pot afla marimea potrivita?", a: "Pe pagina fiecarui produs gasesti ghidul de marimi. Daca ai nelamuriri, ne poti contacta si te ajutam cu drag." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  const inputClass =
    "w-full rounded-lg border border-border-gray bg-white px-4 py-3 text-sm text-near-black placeholder:text-secondary-gray/50 focus:outline-none focus:border-near-black transition-colors duration-200";

  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 lg:px-8 max-w-4xl text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-near-black mb-5 tracking-tight">
            Contacteaza-ne
          </h1>
          <p className="text-secondary-gray max-w-lg mx-auto leading-relaxed">
            Ai intrebari sau ai nevoie de ajutor? Suntem aici pentru tine.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-5 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto -mt-4">
          {contactInfo.map((info) => (
            <div
              key={info.title}
              className="bg-white rounded-xl p-5 text-center border border-border-gray hover:shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px,rgba(0,0,0,0.1)_0px_4px_8px] transition-shadow duration-300"
            >
              <div className="text-2xl mb-2">{info.emoji}</div>
              <h3 className="text-xs font-semibold text-secondary-gray">{info.title}</h3>
              <p className="text-sm font-medium text-near-black mt-1.5">{info.value}</p>
              <p className="text-[11px] text-secondary-gray mt-1">{info.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="container mx-auto px-5 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-border-gray p-7 md:p-8 shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px,rgba(0,0,0,0.1)_0px_4px_8px]">
            <h2 className="font-heading text-xl font-bold text-near-black mb-7">Trimite un mesaj</h2>
            {sent ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-14 h-14 bg-rausch/10 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-rausch" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg font-bold text-near-black">Mesaj trimis!</h3>
                <p className="text-secondary-gray text-sm">Iti vom raspunde in maximum 24 de ore.</p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="text-sm text-rausch hover:underline font-semibold mt-2"
                >
                  Trimite alt mesaj
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-2 text-near-black">Nume *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Numele tau"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-2 text-near-black">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="adresa@email.ro"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 text-near-black">Subiect *</label>
                  <input
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Despre ce este vorba?"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 text-near-black">Mesaj *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Scrie mesajul tau aici..."
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-rausch py-3.5 text-sm font-semibold text-white hover:bg-rausch-dark transition-colors duration-200"
                >
                  Trimite mesajul
                </button>
              </form>
            )}
          </div>

          <div className="space-y-5">
            {/* Map placeholder */}
            <div className="bg-light-surface border border-border-gray rounded-xl h-56 flex items-center justify-center">
              <div className="text-center space-y-2">
                <span className="text-3xl block">🗺️</span>
                <p className="text-xs text-secondary-gray">Str. Florilor nr. 42, Bucuresti</p>
              </div>
            </div>

            {/* Working hours */}
            <div className="bg-white rounded-xl border border-border-gray p-6 shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px,rgba(0,0,0,0.1)_0px_4px_8px]">
              <h3 className="text-xs font-semibold text-secondary-gray mb-4">Program de lucru</h3>
              <div className="space-y-0">
                {[
                  { day: "Luni - Vineri", hours: "09:00 - 18:00" },
                  { day: "Sambata", hours: "10:00 - 14:00" },
                  { day: "Duminica", hours: "Inchis" },
                ].map((row) => (
                  <div key={row.day} className="flex justify-between py-3 border-b border-border-gray last:border-0 text-sm">
                    <span className="text-secondary-gray">{row.day}</span>
                    <span className={`font-medium text-sm ${row.hours === "Inchis" ? "text-rausch" : "text-near-black"}`}>{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-light-surface py-24">
        <div className="container mx-auto px-5 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold text-near-black">Intrebari frecvente</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqItems.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white border border-border-gray rounded-xl hover:shadow-[rgba(0,0,0,0.02)_0px_0px_0px_1px,rgba(0,0,0,0.04)_0px_2px_6px,rgba(0,0,0,0.1)_0px_4px_8px] transition-shadow duration-200"
              >
                <summary className="font-semibold cursor-pointer list-none flex items-center justify-between p-5 text-sm text-near-black">
                  {faq.q}
                  <span className="text-secondary-gray group-open:rotate-45 transition-transform duration-300 text-lg font-light">+</span>
                </summary>
                <p className="text-sm text-secondary-gray px-5 pb-5 pt-0 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
