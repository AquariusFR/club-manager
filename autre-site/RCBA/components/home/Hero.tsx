import Link from "next/link";
import Image from "next/image";
import * as motion from "framer-motion/client";
import { MapPin, Trophy, ChevronRight, ChevronDown } from "lucide-react";
import IntelligencePulse from "@/components/IntelligencePulse";

interface HeroProps {
  yearsHistory: number;
}

export default function Hero({ yearsHistory }: HeroProps) {
  return (
    <>
      {/* ════════════════════════════════════════════════════════════════════════
          🏟️ STADIUM CINEMATIC BACKGROUND (YOUTUBE)
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-navy-deep">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full slash-overlay"
        >
          <div className="absolute inset-0 w-full h-full">
            <Image 
              src="/stadium-bg.png" 
              alt="Stadium RCBA" 
              fill
              className="object-cover opacity-30 mix-blend-luminosity grayscale"
              priority
            />
          </div>
          {/* Overlay brutal - no smooth gradients */}
          <div className="absolute inset-0 bg-navy-deep/80" />
        </motion.div>
        
        {/* Pitch Lines Overlay (subtle CSS art) */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `
            linear-gradient(0deg, transparent 48%, rgba(255,255,255,1) 48%, rgba(255,255,255,1) 52%, transparent 52%)
          `
        }} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          🏆 HERO SECTION — STADIUM EXPERIENCE
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="w-full max-w-7xl z-10 px-6 pt-20 pb-16 md:pt-32 md:pb-24 flex-1 relative">
        
        {/* Live Season Badge */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-pitch-green text-navy-deep font-black uppercase tracking-[0.2em] shadow-[4px_4px_0_0_#fff] border-2 border-navy-deep transform -skew-x-6">
            <span className="relative flex h-2 w-2 transform skew-x-6">
              <span className="animate-ping absolute inline-flex h-full w-full bg-navy-deep opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 bg-navy-deep"></span>
            </span>
            <span className="transform skew-x-6">En Direct · Saison <span className="font-extrabold mx-1">2025 - 2026</span> · Eure-et-Loir (28)</span>
          </div>
        </motion.div>

        {/* Hero Title */}
        <header className="text-center mb-16 relative">
          {/* Location Badge */}
          <div className="absolute top-0 right-4 md:right-0 hidden lg:flex items-center gap-2.5 bg-white border-2 border-navy-deep px-5 py-2.5 shadow-[4px_4px_0_0_rgba(10,25,47,1)] text-sm font-black uppercase tracking-widest text-navy-deep transform -skew-x-6">
            <MapPin size={16} className="text-pitch-green transform skew-x-6" />
            <div className="flex flex-col items-start translate-y-[1px] transform skew-x-6">
              <span className="text-[10px] text-navy/70 leading-none mb-1">Localisation</span>
              <span className="text-navy-deep">Bû & Abondant (28)</span>
            </div>
          </div>

          {/* Founded Badge */}
          <div className="absolute top-0 left-4 md:left-0 hidden lg:flex items-center gap-2.5 bg-white border-2 border-navy-deep px-5 py-2.5 shadow-[4px_4px_0_0_rgba(10,25,47,1)] text-sm font-black uppercase tracking-widest text-navy-deep z-20 transform -skew-x-6">
            <Trophy size={16} className="text-pitch-green transform skew-x-6" />
            <div className="flex flex-col items-start translate-y-[1px] transform skew-x-6">
              <span className="text-[10px] text-navy/70 leading-none mb-1">Fusion Historique</span>
              <span className="text-navy-deep">2020 • {yearsHistory} ans d'union</span>
            </div>
          </div>

          {/* Club Logo & Labels */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center gap-4 sm:gap-10 mb-6 relative z-20 w-full"
          >
            {/* Label Gauche */}
            <div className="flex flex-col items-center group bg-navy border-4 border-pitch-green p-4 sm:p-6 shadow-[8px_8px_0_0_#145014] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0_0_#145014] transition-all transform -skew-x-6">
               <div className="h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center transform skew-x-6">
                 <Image src="/label-espoir.png" alt="Label Jeunes FFF" width={120} height={120} className="h-full w-auto object-contain transition-all duration-300" />
               </div>
               <div className="mt-3 text-center hidden sm:block transform skew-x-6">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Label Jeunes FFF</span>
                 <p className="text-[9px] text-pitch-green font-bold uppercase tracking-widest mt-0.5">Bronze 2023 - 2026</p>
               </div>
            </div>

            {/* Logo Central */}
            <div className="relative w-56 h-56 md:w-80 md:h-80 shrink-0 z-30 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo officiel Racing Club Bû Abondant"
                width={320}
                height={320}
                priority
                className="w-full h-full object-contain filter drop-shadow-[0_10px_0_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* Label Droite */}
            <div className="flex flex-col items-center group bg-navy border-4 border-pitch-green p-4 sm:p-6 shadow-[8px_8px_0_0_#145014] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0_0_#145014] transition-all transform -skew-x-6">
               <div className="h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center transform skew-x-6">
                 <Image src="/label-feminine.png" alt="Label Féminines FFF" width={120} height={120} className="h-full w-auto object-contain transition-all duration-300" />
               </div>
               <div className="mt-3 text-center hidden sm:block transform skew-x-6">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Label Féminines FFF</span>
                 <p className="text-[9px] text-pitch-green font-bold uppercase tracking-widest mt-0.5">Bronze 2023 - 2026</p>
               </div>
            </div>
          </motion.div>

          {/* Slogan Épique au-dessus du titre */}
          <div className="text-pitch-green font-black uppercase tracking-[0.4em] text-sm md:text-lg italic mb-2">
            Deux Villages • Une Seule Ferveur
          </div>

          {/* Main Title */}
          <div className="relative mt-2">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              className="athletic-title text-[clamp(2.8rem,7vw,6.5rem)] mb-6 leading-[0.9] tracking-tighter italic uppercase text-white"
              style={{ textShadow: "4px 4px 0 rgba(20,80,20,1), 8px 8px 0 rgba(10,25,47,1)" }}
            >
              RACING CLUB{" "}
              <span className="text-pitch-green block md:inline mt-2 md:mt-0">
                BÛ ABONDANT
              </span>
            </motion.h1>
          </div>

          {/* Intelligence Pulse Integration */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mb-12 hover:opacity-100 transition-all"
          >
            <IntelligencePulse />
          </motion.div>

          {/* Separator */}
          <div className="flex items-center justify-center gap-6 mb-8 mt-12">
            <div className="h-2 w-16 bg-pitch-green transform -skew-x-12" />
            <div className="text-white text-lg font-black tracking-[0.3em] uppercase athletic-title">RCBA</div>
            <div className="h-2 w-16 bg-pitch-green transform -skew-x-12" />
          </div>

          {/* Tagline */}
          <p className="text-white max-w-3xl mx-auto text-lg md:text-xl leading-relaxed font-bold uppercase tracking-wide bg-navy-deep/80 p-5 border-l-4 border-pitch-green shadow-xl">
            L'union fait la force. Né de la fusion de nos deux communes en <span className="text-pitch-green font-black">2020</span>, 
            le Racing Club Bû Abondant rassemble <span className="text-pitch-green font-black">450 passionnés</span> et <span className="text-pitch-green font-black">17 équipes</span>. 
            Découvrez nos résultats, rejoignez l'aventure et partagez notre ambition sportive.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10">
            <div className="flex flex-col items-center">
              <Link 
                href="/rejoindre"
                aria-label="Rejoindre le Racing Club Bû Abondant — Licences, Joueurs et Bénévoles"
                className="group px-8 py-4 bg-pitch-green text-navy-deep font-black uppercase tracking-[0.2em] border-2 border-navy-deep brutal-shadow relative overflow-hidden athletic-title transform -skew-x-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#0a192f] transition-all"
              >
                <span className="relative z-10" style={{ display: "inline-block", transform: "skewX(6deg)" }}>Rejoindre la Ferveur</span>
              </Link>
              <span className="text-[10px] text-white/60 mt-3 font-black uppercase tracking-widest italic" aria-hidden="true">Licences, Joueurs &amp; Bénévoles</span>
            </div>

            <div className="flex flex-col items-center">
              <Link
                href="/equipes"
                aria-label="Explorer les 17 équipes du RCBA, du Baby-Foot aux Séniors"
                className="group px-8 py-4 bg-white text-navy-deep border-2 border-navy-deep font-black uppercase tracking-[0.2em] shadow-[4px_4px_0_0_rgba(10,25,47,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_rgba(10,25,47,1)] transition-all flex items-center gap-2 transform -skew-x-6"
              >
                <span style={{ transform: "skewX(6deg)", display: "flex", alignItems: "center", gap: "8px" }}>
                  Explorer nos 17 Équipes <ChevronRight size={18} className="text-pitch-green group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </span>
              </Link>
              <span className="text-[10px] text-white/60 mt-3 font-black uppercase tracking-widest italic" aria-hidden="true">Du Baby-Foot aux Séniors</span>
            </div>
          </div>

          {/* Scroll hint — accessible */}
          <div className="flex justify-center mt-16" aria-hidden="true">
            <div className="flex flex-col items-center gap-2 text-white group">
              <span className="text-[12px] font-black uppercase tracking-[0.4em] bg-navy px-3 py-1 border-2 border-pitch-green select-none">
                Découvrir le Club
              </span>
              <ChevronDown size={24} className="text-pitch-green mt-2 animate-bounce" />
            </div>
          </div>
        </header>
      </section>
    </>
  );
}
