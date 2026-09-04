'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  Cpu, 
  Filter, 
  Terminal,
  PackageCheck
} from 'lucide-react';
import MatrixDiscoveryRenderer from '@/components/MatrixDiscoveryRenderer';
import BoutiqueProductCard from '@/components/BoutiqueProductCard';
import HudCorners from '@/components/HudCorners';
import MagneticWrapper from '@/components/MagneticWrapper';
import { UserSession } from '@/lib/authentication';

const PRODUCTS = [
  {
    id: 'maillot-dom',
    name: 'Maillot Domicile RCBA 2025/26',
    category: 'Matchday',
    price: '65.00 €',
    image: '/images/boutique/maillot-domicile.png',
    tag: 'Officiel',
    specs: ['Tissu respirant Haute Performance', 'Coupe athlétique', 'Logo brodé']
  },
  {
    id: 'veste-coach',
    name: 'Veste Softshell Club',
    category: 'Training',
    price: '85.00 €',
    image: '/images/boutique/veste-softshell.png',
    tag: 'Premium',
    specs: ['Imperméable & Coupe-vent', 'Doublure polaire', 'Poches zippées']
  },
  {
    id: 'pack-training',
    name: 'Pack Entraînement Joueur',
    category: 'Essential',
    price: '45.00 €',
    image: '/images/boutique/pack-training.png',
    tag: 'Best Seller',
    specs: ['Maillot + Short + Chaussettes', 'Plusieurs coloris disponibles']
  },
  {
    id: 'sac-sport',
    name: 'Sac de Sport RCBA Élite',
    category: 'Essential',
    price: '35.00 €',
    image: '/images/boutique/sac-sport.png',
    tag: 'Indispensable',
    specs: ['Large capacité 50L', 'Compartiment chaussures séparé', 'Sangles renforcées']
  }
];

const CATEGORIES = ['Tout', 'Matchday', 'Training', 'Essential'];

interface BoutiqueClientProps {
  session: UserSession | null;
}

export default function BoutiqueClient({ session }: BoutiqueClientProps) {
  const [activeCategory, setActiveCategory] = useState('Tout');
  
  const filteredProducts = activeCategory === 'Tout' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-navy-black text-white selection:bg-gold selection:text-navy-deep overflow-x-hidden relative pb-40">
      {/* HERO SECTION */}
      <section className="relative pt-48 pb-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-6 text-xs text-white/50">
            <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1">
              <ArrowLeft size={14} /> Accueil
            </Link>
            <span>/</span>
            <span className="text-gold font-medium">Boutique</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gold/10 border border-gold/40 text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-12 shadow-glass-gold"
          >
            <Shield size={14} /> BOUTIQUE OFFICIELLE RCBA
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="athletic-title text-7xl md:text-9xl italic uppercase tracking-tighter mb-10 leading-[0.8] mix-blend-lighten drop-shadow-glow"
          >
            BOUTIQUE <span className="text-gold">RCBA</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed mb-16 italic font-light"
          >
            Portez fièrement les couleurs de Bû &amp; Abondant. Chaque commande contribue directement aux équipements de nos jeunes et au développement du club.
          </motion.p>
        </div>

        {/* Backdrop Glow Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] opacity-50" />
        </div>
      </section>

      {/* PRODUCT GRID & FILTERING */}
      <section className="relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* CONTROL BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-20 p-8 glass-card border-white/5 bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] relative">
            <HudCorners color="#d4af37" opacity={0.1} />
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Filter size={14} className="text-gold mr-4 hidden md:block" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition border ${
                    activeCategory === cat 
                      ? 'bg-gold text-navy-deep border-gold shadow-glass-gold' 
                      : 'bg-white/5 text-white/40 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="mt-6 md:mt-0 flex items-center gap-6">
               <div className="flex items-center gap-3 border-r border-white/10 pr-6 mr-6 hidden lg:flex">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Disponibilité :</span>
                  <span className="text-[10px] font-black text-pitch-green uppercase tracking-widest flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-pitch-green animate-pulse shadow-[0_0_10px_#10b981]" /> En stock
                  </span>
               </div>
               
               <MagneticWrapper>
                  <a 
                    href="https://www.adidasteam.com/fr-fr/clubshop/racing-club-bu-abondant/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gold/10 border border-gold/40 text-gold font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-navy-deep transition shadow-glass-gold group"
                  >
                    <ShoppingBag size={14} className="group-hover:scale-110 transition-transform" />
                    Boutique Adidas Officielle
                  </a>
               </MagneticWrapper>
            </div>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                >
                  <BoutiqueProductCard product={product} session={session} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* COMING SOON PLACEHOLDER */}
          <div className="mt-32 p-20 rounded-[4rem] border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center text-center group relative overflow-hidden">
             <div className="absolute inset-0 bg-gold/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center text-white/30 mb-10 group-hover:bg-gold/10 group-hover:text-gold transition duration-700 shadow-2xl">
                <Sparkles size={48} className="group-hover:rotate-12 transition-transform" />
             </div>
             <h3 className="athletic-title text-4xl italic uppercase text-white/40 mb-8 tracking-tighter group-hover:text-white transition-colors duration-700">NOUVELLE COLLECTION EN PRÉPARATION</h3>
             <p className="text-white/40 text-lg max-w-xl italic mb-12 font-light group-hover:text-white/70 transition-colors duration-700 leading-relaxed">
               Les nouveaux équipements de la saison arrivent très bientôt. Écharpes, bonnets et nouveautés exclusives pour les supporters du Racing !
             </p>
             <Link href="/club/contact" className="flex items-center gap-4 px-10 py-5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/60 hover:text-white hover:border-gold/40 hover:bg-gold/5 transition">
                ÊTRE INFORMÉ DES NOUVEAUTÉS <ArrowRight size={16} />
             </Link>
          </div>
        </div>
      </section>

      {/* SUPPORT & INFO */}
      <section className="relative z-10 py-32 border-t border-white/5 bg-gradient-to-b from-transparent to-navy-deep/40">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
          <div className="flex justify-center mb-8">
             <PackageCheck size={48} className="text-gold/60" />
          </div>
          <h2 className="athletic-title text-5xl md:text-7xl italic uppercase tracking-tighter leading-tight relative">
             UNE QUESTION SUR <br/> <span className="text-gold">VOS ÉQUIPEMENTS ?</span>
             <div className="absolute -inset-10 bg-gold/5 blur-3xl rounded-full -z-10" />
          </h2>
          <p className="text-xl text-white/60 mb-12 italic font-light max-w-3xl mx-auto leading-relaxed">
            Un doute sur une taille pour votre enfant ? Une question sur la livraison des packs d&apos;entraînement ? Nos responsables matériels et bénévoles sont à votre écoute.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
             <Link href="/club/contact" className="px-10 py-5 rounded-2xl border border-gold/40 bg-gold text-navy-deep font-black text-sm uppercase tracking-[0.3em] transition hover:bg-gold-bright hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]">
               Contacter le Secrétariat
             </Link>
             <a href="https://www.adidasteam.com/fr-fr/clubshop/racing-club-bu-abondant/" target="_blank" rel="noopener noreferrer" className="px-10 py-5 rounded-2xl border border-white/10 bg-white/5 text-white font-black text-sm uppercase tracking-[0.3em] transition hover:border-white/30 hover:bg-white/10">
               Accéder au Clubshop Adidas
             </a>
          </div>
        </div>
      </section>

      {/* FOOTER METADATA */}
      <footer className="opacity-40 border-t border-white/5 py-12">
         <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] italic">
               <PackageCheck size={12} className="text-gold" />
               <span>Boutique Officielle Adidas • RCBA</span>
            </div>
            <div className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">© Racing Club Bû Abondant — 2025-2026</div>
         </div>
      </footer>
    </main>
  );
}
