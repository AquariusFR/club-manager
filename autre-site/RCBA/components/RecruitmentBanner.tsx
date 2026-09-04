"use client";

import React from "react";
import * as motion from "framer-motion/client";
import { ArrowRight, Users, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function RecruitmentBanner() {
  return (
    <section className="w-full max-w-7xl mx-auto mt-32 mb-20 px-4 relative">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-64 h-64 bg-pitch-green/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="bg-navy border-4 border-gold p-8 md:p-16 relative overflow-hidden group transition-all duration-700 shadow-[8px_8px_0_0_#D4AF37] transform -skew-y-1">
        <div className="transform skew-y-1">
          {/* Animated grid background */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity duration-1000 group-hover:opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />

          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border-2 border-red-600/50 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 transform -skew-x-6">
                <span className="relative flex h-2 w-2 transform skew-x-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="transform skew-x-6">CLÔTURE DES INSCRIPTIONS IMMINENTE</span>
              </div>
              
              <h2 className="athletic-title text-5xl md:text-6xl italic leading-[0.9] mb-6 text-white uppercase drop-shadow-glow">
                REJOINS <br />
                <span className="text-pitch-green bg-navy-deep px-2">LA FAMILLE</span>
              </h2>
              
              <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 italic font-medium">
                Les effectifs de la saison prochaine se remplissent à vitesse grand V. Ne rate pas le coche : viens défendre nos couleurs et vivre ta passion à 200% !
              </p>

              <Link 
                href="https://inscription.rcba.club/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-4 px-8 py-5 bg-pitch-green text-navy-deep border-4 border-navy-deep font-black uppercase tracking-widest transition-all shadow-[4px_4px_0_0_#d4af37] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_#d4af37] transform -skew-x-6 group/btn"
              >
                <span className="transform skew-x-6 flex items-center gap-2">BLOQUER MA PLACE <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" /></span>
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { icon: Users, title: "Joueurs & Joueuses", desc: "Quelques places restantes dans nos 17 équipes compétitives.", color: "text-blue-400", border: "border-blue-400/20", bg: "bg-blue-400/10" },
                { icon: Zap, title: "Éducateurs & Coachs", desc: "Transmets ton savoir avec des outils de niveau pro.", color: "text-pitch-green", border: "border-pitch-green/20", bg: "bg-pitch-green/10" },
                { icon: Shield, title: "Bénévoles & Dirigeants", desc: "Le cœur du réacteur. Deviens acteur de nos événements !", color: "text-gold", border: "border-gold/20", bg: "bg-gold/10" },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-navy-deep border-4 border-white/5 p-5 flex items-start gap-5 hover:bg-navy hover:border-gold/30 transition-all duration-300 group/card shadow-[2px_2px_0_0_rgba(255,255,255,0.05)]"
                >
                  <div className={`shrink-0 w-12 h-12 ${item.bg} border-2 ${item.border} flex items-center justify-center ${item.color} group-hover/card:scale-110 transition-transform transform -skew-x-6`}>
                    <item.icon size={20} className="transform skew-x-6" />
                  </div>
                  <div>
                    <h4 className="athletic-title text-xl text-white italic mb-1">{item.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
