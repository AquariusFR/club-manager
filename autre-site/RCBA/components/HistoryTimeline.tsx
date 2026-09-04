"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronRight, Trophy, Star, History, Target, TrendingUp, ShieldCheck, Users } from "lucide-react";
import HudCorners from "./HudCorners";

const timelineEvents = [
  {
    year: "2020",
    title: "Fusion Fondatrice du RCBA",
    description: "Le Football Club de Bû (FC Bû) et le Club Olympique Abondant (CO Abondant) unissent leurs forces pour donner naissance au Racing Club Bû Abondant (RCBA).",
    icon: Star,
    color: "gold",
    colorHex: "#d4af37"
  },
  {
    year: "2021",
    title: "Essor de l'École de Foot",
    description: "Structuration massive du pôle jeunes (des U7 aux U18), plaçant la formation au cœur du projet du nouveau club.",
    icon: Users,
    color: "neon-cyan",
    colorHex: "#06b6d4"
  },
  {
    year: "2022",
    title: "Génération Dorée U15",
    description: "Saison exceptionnelle pour nos U15 qui terminent invaincus et sont sacrés champions départementaux.",
    icon: Trophy,
    color: "pitch-green",
    colorHex: "#4ade80"
  },
  {
    year: "2022",
    title: "Montée en D2",
    description: "L'équipe Sénior A accède à la Départementale 2 après une saison remarquable.",
    icon: TrendingUp,
    color: "blue",
    colorHex: "#3b82f6"
  },
  {
    year: "2023",
    title: "Double Labellisation FFF",
    description: "Le RCBA reçoit les Labels Jeunes et Féminines (Niveau Bronze) de la Fédération, récompensant son excellence dans la formation.",
    icon: ShieldCheck,
    color: "gold",
    colorHex: "#d4af37"
  },
  {
    year: "2023",
    title: "Finaliste Coupe District",
    description: "L'équipe Sénior A réalise un parcours mémorable jusqu'en finale de la Coupe du District.",
    icon: Trophy,
    color: "pitch-green",
    colorHex: "#4ade80"
  },
  {
    year: "2024",
    title: "Épopée des U18",
    description: "Un parcours historique pour nos U18, remportant la Coupe d'Eure-et-Loir au terme d'une saison mémorable.",
    icon: Star,
    color: "gold",
    colorHex: "#d4af37"
  },
  {
    year: "2024",
    title: "Champion District 28",
    description: "L'équipe Sénior A est sacrée championne de son groupe en District 28, couronnant le travail de tout un club.",
    icon: Target,
    color: "purple",
    colorHex: "#a855f7"
  },
  {
    year: "2025",
    title: "Une Année Record",
    description: "Le club franchit un cap historique en termes d'effectifs et poursuit son développement structurant pour l'ensemble de ses catégories.",
    icon: TrendingUp,
    color: "blue",
    colorHex: "#3b82f6"
  }
];

export default function HistoryTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative py-20 w-full max-w-6xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h3 className="athletic-title text-4xl md:text-5xl italic uppercase text-white drop-shadow-glow">
          LA TIMELINE <span className="text-gold">LÉGENDAIRE</span>
        </h3>
        <p className="text-white/50 text-sm font-black uppercase tracking-[0.5em] italic">Depuis 2020</p>
      </div>

      {/* Interactive Timeline Display */}
      <div className="relative flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Progress Bar & Dots (Left / Top) */}
        <div className="w-full lg:w-1/3 overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 hide-scrollbar">
          <div className="flex flex-row lg:flex-col gap-8 lg:gap-0 lg:justify-between relative h-[100px] lg:h-[500px] min-w-max lg:min-w-0 px-4 lg:px-0">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-4 right-4 lg:right-auto lg:left-[23px] h-[2px] lg:h-full lg:w-[2px] lg:top-0 bg-white/5" />
            
            <div className="absolute top-1/2 left-4 h-[2px] lg:hidden bg-gold shadow-[0_0_15px_#d4af37] origin-left transition duration-700 ease-out" 
                 style={{ width: `calc((100% - 2rem) * ${timelineEvents.length > 1 ? activeIndex / (timelineEvents.length - 1) : 1})` }} 
            />
            <div className="hidden lg:block absolute top-0 left-[23px] h-full w-[2px] bg-gold shadow-[0_0_15px_#d4af37] origin-top transition duration-700 ease-out" 
                 style={{ transform: `scaleY(${timelineEvents.length > 1 ? activeIndex / (timelineEvents.length - 1) : 1})` }} 
            />

            {timelineEvents.map((event, i) => (
              <div 
                key={i}
                onClick={() => setActiveIndex(i)}
                className="relative z-10 flex items-center gap-6 cursor-pointer group flex-shrink-0"
              >
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition duration-500 ${
                  i <= activeIndex 
                    ? 'bg-navy-deep border-gold text-gold shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-110' 
                    : 'bg-navy-deep border-white/10 text-white/30 group-hover:border-white/30'
                }`}>
                  <span className="text-[10px] font-black italic">{event.year.slice(-2)}'</span>
                </div>
                <div className={`hidden lg:block text-2xl font-black italic athletic-title transition duration-500 ${
                  i === activeIndex ? 'text-gold drop-shadow-glow translate-x-2' : 'text-white/30 group-hover:text-white/60'
                }`}>
                  {event.year}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Event Details (Right / Bottom) */}
        <div className="w-full lg:w-2/3 min-h-[400px] relative">
          {timelineEvents.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ 
                opacity: activeIndex === i ? 1 : 0, 
                x: activeIndex === i ? 0 : 40,
                scale: activeIndex === i ? 1 : 0.95,
                pointerEvents: activeIndex === i ? "auto" : "none"
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <div className="w-full h-full glass-card-elevated p-10 md:p-16 border-white/10 bg-white/[0.02] rounded-[3rem] relative overflow-hidden flex flex-col justify-center shadow-4xl glass-edge-highlight hud-grain group">
                <HudCorners color={event.colorHex} opacity={0.3} size={50} />
                
                {/* Background Number */}
                <div className="absolute -right-10 -bottom-20 text-[200px] font-black text-white/[0.02] italic athletic-title pointer-events-none select-none">
                  {event.year}
                </div>

                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-3xl bg-${event.color}/10 border border-${event.color}/20 flex items-center justify-center text-${event.color} mb-10 shadow-2xl`}>
                    <event.icon size={40} className="drop-shadow-glow" />
                  </div>
                  
                  <div className="flex items-baseline gap-4 mb-4">
                    <h4 className="text-4xl md:text-5xl font-black italic uppercase athletic-title text-white">
                      {event.title}
                    </h4>
                    <span className={`text-xl md:text-2xl font-black italic text-${event.color} drop-shadow-glow`}>
                      {event.year}
                    </span>
                  </div>
                  
                  <p className="text-lg md:text-xl text-white/60 font-medium italic leading-relaxed max-w-2xl">
                    "{event.description}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
