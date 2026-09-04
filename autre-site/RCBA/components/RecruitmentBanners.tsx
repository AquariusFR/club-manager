'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { UserPlus, Star, Heart, ChevronRight, Zap } from 'lucide-react';

export default function RecruitmentBanners() {
  const categories = [
    {
      id: 'joueurs',
      title: "Devenir Joueur",
      subtitle: "Rejoignez nos effectifs",
      desc: "De l'école de football jusqu'aux Vétérans. Venez porter nos couleurs et développer votre talent sur le terrain.",
      icon: UserPlus,
      color: "gold",
      link: "/club/tarifs",
      bgClass: "bg-gold/10",
      borderClass: "border-gold/30",
      hoverShadow: "hover:shadow-[0_0_50px_rgba(212,175,55,0.2)]"
    },
    {
      id: 'benevoles',
      title: "Devenir Bénévole",
      subtitle: "Le cœur du RCBA",
      desc: "L'âme de notre club. Rejoignez une équipe dynamique pour encadrer, organiser et faire vivre le RCBA.",
      icon: Heart,
      color: "pitch-green",
      link: "/club/contact",
      bgClass: "bg-pitch-green/10",
      borderClass: "border-pitch-green/30",
      hoverShadow: "hover:shadow-[0_0_50px_rgba(98,203,114,0.2)]"
    },
    {
      id: 'arbitres',
      title: "Devenir Arbitre",
      subtitle: "Garant du beau jeu",
      desc: "Le RCBA vous accompagne, vous forme et finance votre formation d'arbitre officiel. Une vraie vocation.",
      icon: Star,
      color: "blue-400",
      link: "/club/contact",
      bgClass: "bg-blue-400/10",
      borderClass: "border-blue-400/30",
      hoverShadow: "hover:shadow-[0_0_50px_rgba(96,165,250,0.2)]"
    }
  ];

  return (
    <section className="mt-32 max-w-6xl mx-auto px-6 relative z-10">
      <div className="text-center mb-14">
        <div className="label-overline mb-3">Recrutement & Adhésions</div>
        <h2 className="athletic-title text-4xl md:text-5xl italic">
          REJOIGNEZ <span className="text-gold">L'AVENTURE</span>
        </h2>
        <p className="text-white/60 text-lg mt-4 italic max-w-2xl mx-auto font-medium">
          Le Racing Club Bû Abondant grandit chaque saison. Que vous ayez l'esprit de compétition, l'envie de transmettre ou de vous impliquer, il y a une place pour vous.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <Link
              href={cat.link}
              className={`group flex flex-col items-center text-center p-10 rounded-[2.5rem] glass-card glass-shine border ${cat.borderClass} ${cat.hoverShadow} transition duration-700 hover:-translate-y-2 relative overflow-hidden h-full`}
            >
              {/* Background Glow */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-30 group-hover:opacity-60 transition-opacity duration-700 ${cat.bgClass}`} />
              
              <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border ${cat.borderClass} ${cat.bgClass} mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                <cat.icon size={32} className={`text-${cat.color}`} />
              </div>
              
              <div className={`text-[10px] font-black uppercase tracking-[0.3em] text-${cat.color} mb-3`}>
                {cat.subtitle}
              </div>
              
              <h3 className="athletic-title text-3xl italic text-white mb-4 drop-shadow-md">
                {cat.title}
              </h3>
              
              <p className="text-white/70 text-sm leading-relaxed mb-8 flex-1">
                {cat.desc}
              </p>
              
              <div className={`flex items-center gap-2 text-[12px] font-black uppercase tracking-widest text-${cat.color} group-hover:text-white transition-colors duration-300`}>
                Nous rejoindre <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      {/* Banner / Callout for Partnership */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-12 group bg-gradient-to-r from-navy-deep via-navy to-navy-deep border border-gold/30 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-[0_0_60px_rgba(212,175,55,0.15)] transition-shadow duration-700"
      >
        <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('/noise.png')" }} />
        <div className="absolute left-0 w-1/2 h-full bg-gold/5 blur-[100px] pointer-events-none group-hover:opacity-100 opacity-50 transition-opacity" />
        
        <div className="relative z-10 flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <Zap size={20} className="text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">Devenir Partenaire</span>
          </div>
          <h3 className="athletic-title text-3xl md:text-4xl italic text-white mb-4">SOUTENEZ LE <span className="text-gold">PROJET RCBA</span></h3>
          <p className="text-white/70 text-sm max-w-xl">
            Associez l'image de votre entreprise à un club dynamique et formateur. Découvrez nos offres de sponsoring (Maillots, Panneaux, Digital, Événements).
          </p>
        </div>
        
        <div className="relative z-10">
          <Link 
            href="/club/partenaires" 
            className="px-8 py-4 bg-gold text-navy-deep rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-gold-bright active:scale-[0.96] transition shadow-[0_0_30px_rgba(212,175,55,0.3)] inline-flex items-center gap-2"
          >
            Devenir Sponsor
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
