'use client';

import { Shield, MapPin, History, Euro, Clock, CreditCard } from "lucide-react";
import clubData from "@/lib/data/club-info.json";
import PartnersList from "./PartnersList";

export default function ClubSections() {
  return (
    <div className="space-y-12">
      {/* History Section */}
      <section className="glass-card p-10 border-white/5 bg-white/[0.01] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8">
           <History className="w-24 h-24 text-gold opacity-[0.03] group-hover:scale-110 transition duration-1000 -rotate-12" />
        </div>
        <div className="relative z-10">
          <h3 className="athletic-title athletic-skew text-3xl italic text-white/90 uppercase mb-8 pr-4">
            Notre <span className="text-gold">Histoire</span>
          </h3>
          <p className="text-white/70 text-lg leading-relaxed italic max-w-3xl">
            {clubData.history}
          </p>
          <div className="mt-8 flex items-center gap-4 text-sm font-black uppercase text-white/70 tracking-[0.3em]">
             Fondation <span className="text-gold font-athletic">{clubData.founded}</span> — {clubData.philosophy}
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Venues Section */}
        <section className="glass-card p-10 border-white/5 bg-white/[0.01] flex flex-col h-full">
          <h3 className="athletic-title athletic-skew text-2xl italic text-white/90 uppercase mb-8 flex items-center gap-3">
             <MapPin size={24} className="text-gold" /> Nos <span className="text-gold/60">Terrains</span>
          </h3>
          <div className="space-y-6 flex-1">
            {clubData.venues.map((venue, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 group hover:border-gold/20 transition">
                <div className="text-sm font-black text-gold uppercase tracking-widest mb-1 italic">{venue.type}</div>
                <div className="text-lg font-black text-white italic uppercase tracking-tight athletic-title">{venue.name}</div>
                <div className="text-sm text-white/70 mt-1 font-medium">{venue.address}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Payments Section */}
        <section className="glass-card p-10 border-white/5 bg-white/[0.01] flex flex-col h-full overflow-hidden relative group">
           <div className="absolute -bottom-10 -right-10">
              <CreditCard className="w-40 h-40 text-gold opacity-[0.02]" />
           </div>
           <h3 className="athletic-title athletic-skew text-2xl italic text-white/90 uppercase mb-8 flex items-center gap-3 relative z-10">
             <CreditCard size={24} className="text-gold" /> Modes de <span className="text-gold/60">Paiement</span>
          </h3>
          <div className="grid grid-cols-1 gap-4 relative z-10">
            {clubData.payments.map((method, i) => (
              <div key={i} className="flex items-center gap-4 text-sm font-bold italic text-white/60">
                 <div className="w-2 h-2 rounded-full bg-gold/50 shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                 {method}
              </div>
            ))}
          </div>
          <div className="mt-auto pt-8 flex items-center gap-3 relative z-10">
             <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 text-gold">
                <Clock size={20} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-wider text-white/70 leading-tight">
                Facilités de paiement disponibles<br/>en 3 mensualités
             </p>
          </div>
        </section>
      </div>

      {/* Pricing / Cotisations Table */}
      <section className="space-y-6">
        <h3 className="athletic-title athletic-skew text-3xl italic text-white/90 uppercase tracking-tighter ml-4 flex items-center gap-4">
          <div className="p-2 bg-gold/20 rounded-xl text-gold border border-gold/40">
            <Euro size={24} />
          </div>
          Tarifs <span className="text-gold/60">Licences 2025-2026</span>
        </h3>
        <div className="glass-card overflow-hidden border-white/5 bg-white/[0.01]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className="px-10 py-6 text-[11px] font-black uppercase text-gold/60 italic tracking-widest">Catégorie</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase text-gold/60 italic tracking-widest">Tarif</th>
                <th className="px-10 py-6 text-[11px] font-black uppercase text-gold/60 italic tracking-widest hidden md:table-cell">Inclus dans le package</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {clubData.cotisations.map((item, i) => (
                <tr key={i} className="hover:bg-white/[0.04] transition group">
                  <td className="px-10 py-6">
                    <span className="text-lg font-black text-white italic athletic-title athletic-skew tracking-tight uppercase group-hover:text-gold transition-colors">{item.category}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-2xl font-black text-white italic athletic-title athletic-skew tracking-tight">{item.price}€</span>
                  </td>
                  <td className="px-10 py-6 text-white/80 text-sm italic font-medium hidden md:table-cell">
                    {item.includes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Partners List */}
      <PartnersList />
    </div>
  );
}
