import React from 'react';
import { Share2, ExternalLink, MessageCircle, Trophy } from 'lucide-react';
import * as motion from 'framer-motion/client';
import Link from 'next/link';

export default function FacebookFeed() {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-16 relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#1877F2] text-white rounded-2xl shadow-[0_0_25px_rgba(24,119,242,0.4)]">
            <Share2 size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1877F2]">Réseaux Sociaux • Facebook Officiel</span>
            <h2 className="athletic-title text-3xl md:text-5xl italic text-white tracking-tight">
              EN DIRECT DU <span className="text-gold">CLUB</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <a 
            href="https://www.facebook.com/RacingClubBuAbondant" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1877F2] hover:bg-[#1877F2]/80 text-white text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(24,119,242,0.3)] active:scale-95"
          >
            <span>Rejoindre la page Facebook</span>
            <ExternalLink size={14} />
          </a>
          <a 
            href="https://rcba.footeo.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95"
          >
            <span>Site Footeo FFF</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Colonne Communication Rapide */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 md:p-8 border border-white/10 rounded-3xl bg-navy-light/40 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-lg font-black uppercase tracking-wider text-white mb-3 flex items-center gap-2">
              <MessageCircle size={18} className="text-gold" />
              Canaux d'Information Officiels
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6 font-light">
              Le RCBA communique au quotidien sur ses réseaux pour partager les convocations, les résultats du week-end, les dates de stages vacances et les événements festifs.
            </p>
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Résultats & Matchs du Week-end</span>
                  <span className="text-[10px] text-white/40">Publiés chaque dimanche soir sur Facebook</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-pitch-green bg-pitch-green/10 px-2.5 py-1 rounded-full border border-pitch-green/20">Hebdo</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Stages Vacances & Tournois</span>
                  <span className="text-[10px] text-white/40">Inscriptions ouvertes aux jeunes U6 à U15</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/20">Saisonnier</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Programme Éducatif Fédéral (PEF)</span>
                  <span className="text-[10px] text-white/40">Sensibilisation citoyenne, santé et écologie</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-full border border-blue-400/20">Labellisé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne Iframe Facebook Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 bg-navy-light/40 border border-white/10 p-4 md:p-6 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="w-full max-w-[500px] overflow-hidden rounded-2xl bg-white flex justify-center shadow-inner">
            <iframe 
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FRacingClubBuAbondant&tabs=timeline&width=500&height=550&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId" 
              width="500" 
              height="550" 
              style={{ border: 'none', overflow: 'hidden' }} 
              scrolling="no" 
              frameBorder="0" 
              allowFullScreen={true} 
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              className="max-w-full"
              title="Flux Facebook Racing Club Bû Abondant"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
