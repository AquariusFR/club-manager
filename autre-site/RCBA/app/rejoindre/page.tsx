'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, UserPlus, FileSignature, Handshake, Target, ArrowRight, ArrowLeft, Zap, ExternalLink } from 'lucide-react';
import PageLabel from '@/components/PageLabel';
import HudCorners from '@/components/HudCorners';
import MagneticWrapper from '@/components/MagneticWrapper';
import JoinFormModal from '@/components/JoinFormModal';

export default function RejoindrePage() {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{type: 'player' | 'staff', title: string}>({ type: 'player', title: '' });

  const pillars = [
    {
      id: 0,
      title: "Joueur / Joueuse",
      icon: Target,
      color: "text-gold",
      bgColor: "bg-gold/5",
      borderColor: "border-gold/20",
      glow: "gold",
      desc: "REJOINS LA FAMILLE BLEUE ET BLANCHE DU RCBA. PLACES LIMITÉES POUR LA NOUVELLE SAISON.",
      details: [
        "DERNIÈRES PLACES : École de Foot (U6 à U11)",
        "DÉTECTIONS U12-U18 : Prouve ta valeur sur le terrain",
        "PÔLE FÉMININ : Rejoins un projet ambitieux certifié FFF",
        "SÉNIORS & VÉTÉRANS : Essais et intégration sur convocation"
      ],
      action: "TENTER SA CHANCE"
    },
    {
      id: 1,
      title: "Éducateur",
      icon: FileSignature,
      color: "text-blue-400",
      bgColor: "bg-blue-400/5",
      borderColor: "border-blue-400/20",
      glow: "#60a5fa",
      desc: "FORME LES CHAMPIONS DE DEMAIN. LE RCBA CHERCHE DES LEADERS PASSIONNÉS.",
      details: [
        "FORMATION 100% PRISE EN CHARGE PAR LE CLUB",
        "ACCOMPAGNEMENT DIPLÔMES FFF GARANTI",
        "DOTATION COMPLÈTE ÉQUIPEMENTIER",
        "INTÉGRATION DANS UN PROJET DE JEU STRUCTURÉ"
      ],
      action: "INTÉGRER LE STAFF"
    },
    {
      id: 2,
      title: "Arbitre",
      icon: Shield,
      color: "text-pitch-green",
      bgColor: "bg-pitch-green/5",
      borderColor: "border-pitch-green/20",
      glow: "#4ade80",
      desc: "DEVIENS LE PATRON DU TERRAIN. ON T'ACCOMPAGNE DE A À Z.",
      details: [
        "FORMATION OFFICIELLE PAYÉE À 100%",
        "DOTATION COMPLÈTE (TENUES, ÉQUIPEMENTS)",
        "SUIVI PERSONNALISÉ PAR NOTRE RÉFÉRENT",
        "DÉFRAIEMENT ASSURÉ À CHAQUE MATCH"
      ],
      action: "PRENDRE LE SIFFLET"
    },
    {
      id: 3,
      title: "Bénévole",
      icon: Handshake,
      color: "text-pink-400",
      bgColor: "bg-pink-400/5",
      borderColor: "border-pink-400/20",
      glow: "#f472b6",
      desc: "LE SANG DU CLUB. REJOINS LA FAMILLE ET FAIS VIBRER LE RCBA.",
      details: [
        "BUVETTE & ACCUEIL : Au cœur de l'action",
        "ORGANISATION ÉVÉNEMENTS (Tournois, Loto...)",
        "LOGISTIQUE MATCHS : Essentiel au succès",
        "AMBIANCE FAMILIALE & 3ÈME MI-TEMPS GARANTIE"
      ],
      action: "REJOINDRE LA FAMILLE"
    }
  ];

  return (
    <main className="min-h-screen bg-navy-black text-white selection:bg-gold/30 relative overflow-hidden pb-40">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-gold/5 rounded-full blur-[180px] opacity-40 animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[50%] bg-blue-500/5 rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10 space-y-24">
        
        <div className="flex items-center gap-2 -mb-16 text-xs text-white/50">
          <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Accueil
          </Link>
          <span>/</span>
          <span className="text-gold font-medium">Rejoindre</span>
        </div>

        <PageLabel 
          section="RECRUTEMENT" 
          category="TALENT ACQUISITION" 
          title="REJOINDRE LE CLUB" 
          subtitle="Le Racing Club Bû Abondant est toujours à la recherche de nouveaux talents. Trouvez votre place dans notre organisation."
          icon="club"
          variant="gold"
        />

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pillars.map((pillar) => (
              <MagneticWrapper key={pillar.id}>
                <div 
                  onClick={() => setActiveTab(activeTab === pillar.id ? null : pillar.id)}
                  className={`glass-card p-8 border ${pillar.borderColor} ${pillar.bgColor} cursor-pointer hover:bg-white/[0.05] transition duration-500 relative overflow-hidden group rounded-3xl backdrop-blur-xl h-full flex flex-col justify-between`}
                >
                  <div className={`absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-20 group-hover:scale-125 group-hover:-rotate-12 transition duration-700 ${pillar.color}`}>
                    <pillar.icon size={160} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${pillar.color} shadow-lg group-hover:scale-110 transition-transform`}>
                        <pillar.icon size={28} />
                      </div>
                      <div className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 ${pillar.color} bg-white/5`}>
                        Ouvert
                      </div>
                    </div>
                    
                    <h3 className="athletic-title text-3xl md:text-4xl italic uppercase mb-4 tracking-tighter">{pillar.title}</h3>
                    <p className="text-white/60 italic leading-relaxed text-sm">{pillar.desc}</p>
                  </div>

                  <AnimatePresence>
                    {activeTab === pillar.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="relative z-10 border-t border-white/10 pt-6 overflow-hidden"
                      >
                        <ul className="space-y-3 mb-8">
                          {pillar.details.map((detail, idx) => (
                            <motion.li 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              key={idx} 
                              className="flex items-start gap-3 text-sm text-white/80"
                            >
                              <div className={`mt-1 min-w-[6px] w-[6px] h-[6px] rounded-full bg-current ${pillar.color}`} />
                              <span>{detail}</span>
                            </motion.li>
                          ))}
                        </ul>
                        
                        <button 
                          onClick={() => {
                            setModalConfig({ 
                              type: pillar.id === 0 ? 'player' : 'staff', 
                              title: `Candidature ${pillar.title}` 
                            });
                            setIsModalOpen(true);
                          }}
                          className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest transition hover:scale-[1.02] active:scale-[0.96] border border-white/20 bg-white/10 hover:bg-white/20 ${pillar.color}`}
                        >
                          {pillar.action} <ArrowRight size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expansion indicator */}
                  <div className="absolute bottom-6 right-6 text-white/20 group-hover:text-white/50 transition-colors">
                     {activeTab === pillar.id ? (
                        <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">-</div>
                     ) : (
                        <div className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">+</div>
                     )}
                  </div>
                </div>
              </MagneticWrapper>
            ))}
          </div>
        </div>

        {/* Global Contact Action */}
        <section className="mt-32 relative py-20 overflow-hidden rounded-[3rem] border border-gold/20 bg-gold/5 flex flex-col items-center justify-center text-center group">
           <HudCorners color="#d4af37" opacity={0.2} />
           <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-10" />
           <Sparkles className="text-gold w-12 h-12 mb-8 animate-pulse relative z-10" />
           <h2 className="athletic-title text-4xl md:text-5xl italic uppercase text-white mb-6 tracking-tighter relative z-10">
              PRÊT À <span className="text-gold">MOUILLER LE MAILLOT ?</span>
           </h2>
           <p className="text-white/60 italic font-bold max-w-xl mx-auto mb-10 relative z-10 text-lg">
             CONTACTE-NOUS DIRECTEMENT. LES PLACES SONT CHÈRES, NE TRAÎNE PAS.
           </p>
           <a href="mailto:rcba.football@gmail.com" className="relative z-10 flex items-center gap-3 px-8 py-4 rounded-xl bg-gold text-navy-deep font-black text-xs md:text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition shadow-glass-gold skew-x-[-10deg]">
             <span className="skew-x-[10deg] flex items-center gap-3">NOUS CONTACTER DIRECTEMENT <ExternalLink size={16} /></span>
           </a>
        </section>

      </div>

      <JoinFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        type={modalConfig.type} 
        title={modalConfig.title} 
      />
    </main>
  );
}
