'use client';

import { Handshake } from "lucide-react";
import clubData from "@/lib/data/club-info.json";

export default function PartnersList() {
  const partners = (clubData.partners || []) as any[];

  return (
    <section className="space-y-8 mt-12">
      <div className="flex items-center justify-between px-4">
        <h3 className="athletic-title athletic-skew text-3xl italic text-white/90 uppercase tracking-tighter flex items-center gap-4">
          <div className="p-2 bg-gold/20 rounded-xl text-gold border border-gold/40">
            <Handshake size={24} />
          </div>
          Nos <span className="text-gold/60">Partenaires</span>
        </h3>
        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hidden sm:block">
          Saison 2025-2026 / Tactical Support
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {partners.map((partner, i) => (
          <div 
            key={i} 
            className="glass-card p-6 flex flex-col items-center justify-center text-center group hover:border-gold/30 hover:bg-gold/5 transition duration-500 border-white/5 bg-white/[0.01]"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
               <span className="text-xl font-athletic text-gold/40 group-hover:text-gold transition-colors">
                  {partner.name.charAt(0)}
               </span>
            </div>
            <div className="text-[10px] font-black text-gold/50 uppercase tracking-widest mb-1 italic">
              {partner.category}
            </div>
            <div className="text-sm font-bold text-white/90 uppercase tracking-tight leading-tight group-hover:text-white transition-colors">
              {partner.name}
            </div>
            
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>
      
      <div className="glass-card p-8 border-gold/20 bg-gold/[0.02] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute -left-10 top-1/2 -translate-y-1/2">
           <Handshake className="w-32 h-32 text-gold opacity-[0.03] -rotate-12" />
        </div>
        <div className="relative z-10 text-center md:text-left">
           <h4 className="text-xl font-black italic text-white uppercase athletic-title tracking-tight">
             Devenez <span className="text-gold">Partenaire</span>
           </h4>
           <p className="text-sm text-white/60 italic font-medium mt-1">
             Soutenez le sport local et boostez votre visibilité auprès de notre communauté.
           </p>
        </div>
        <button className="relative z-10 px-8 py-3 rounded-xl bg-gold text-navy-deep font-black uppercase italic tracking-widest text-sm hover:scale-105 active:scale-95 transition shadow-[0_0_20px_rgba(212,175,55,0.3)]">
          Nous Contacter
        </button>
      </div>
    </section>
  );
}
