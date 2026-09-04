"use client";

import React, { useState, useRef } from "react";
import { Shield } from "lucide-react";

type Poste = 'gk' | 'def' | 'mid' | 'att' | 'unknown';

interface PlayerData {
  nom: string;
  prenom: string;
  numero?: number | string;
  photo_url?: string;
  date_naissance?: string;
  categorie_actuelle?: string;
  merit?: {
    technical?: number;
    mental?: number;
    physical?: number;
    tactical?: number;
    score?: number;
  };
  aptitude_technique?: number;
  aptitude_mentale?: number;
  aptitude_physique?: number;
  aptitude_tactique?: number;
}

interface TeamPlayerCardProps {
  player: PlayerData;
  cfg: {
    label: string;
    shortLabel: string;
    color: string;
    bg: string;
    border: string;
    textColor: string;
  };
  poste: Poste;
  index?: number;
  displayName?: string;
}

export default function TeamPlayerCard({ player: p, cfg, poste, index = 0, displayName }: TeamPlayerCardProps) {
  const tech = Math.round(p.merit?.technical || (p.aptitude_technique || 0) * 20 || 0);
  const mental = Math.round(p.merit?.mental || (p.aptitude_mentale || 0) * 20 || 0);
  const phy = Math.round(p.merit?.physical || (p.aptitude_physique || 0) * 20 || 0);
  const tac = Math.round(p.merit?.tactical || (p.aptitude_tactique || 0) * 20 || 0);
  const score = Math.round(p.merit?.score || (tech + mental + phy + tac) / 4 || 0);

  let age = null;
  if (p.date_naissance) {
    const birthDate = new Date(p.date_naissance);
    const today = new Date();
    age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  }

  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  // Accessibility: respect prefers-reduced-motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15; // Max 15deg
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setRotation({ x: rotateX, y: rotateY });
    
    // Calculate glare
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlare({ x: glareX, y: glareY, opacity: 0.6 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlare({ opacity: 0, x: 50, y: 50 });
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      className={`player-${poste === 'unknown' ? '' : poste} relative flex flex-col p-2 md:p-2 bg-white rounded-xl cursor-pointer group/card transition-transform duration-200 ease-out isolate select-none shadow-xl active:scale-[0.96] animate-in fade-in slide-in-from-bottom-4`}
      style={{
        aspectRatio: '2.5/3.5',
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.05 : 1})`,
        transformStyle: 'preserve-3d',
        boxShadow: isHovered ? `0 20px 40px -10px rgba(0,0,0,0.8)` : `0 8px 20px -4px rgba(0,0,0,0.5)`,
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      {/* The Inner Sticker Container */}
      <div 
        className="relative w-full h-full flex flex-col overflow-hidden border-[1.5px] border-gray-300 rounded"
        style={{ background: `linear-gradient(135deg, ${cfg.textColor}20 0%, #ffffff 100%)` }}
      >
        {/* Inner frame styling (Panini classic thin inner border) */}
        <div className="absolute inset-1 border-[2px] z-10 pointer-events-none opacity-50 mix-blend-overlay rounded-sm" style={{ borderColor: cfg.textColor }} />

        {/* Foil / Glare overlay - Reduced intensity to keep photo visible */}
        <div 
          className="absolute inset-0 z-50 pointer-events-none mix-blend-screen transition-opacity duration-200"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)`
          }}
        />
        {/* Holographic shimmer - Reduced intensity */}
        <div 
          className="absolute inset-0 z-40 pointer-events-none mix-blend-overlay opacity-0 group-hover/card:opacity-30 transition-opacity duration-500"
          style={{
            backgroundImage: `linear-gradient(125deg, transparent 20%, ${cfg.textColor}40 40%, ${cfg.textColor}40 60%, transparent 80%)`,
            backgroundSize: '200% 200%',
            backgroundPosition: isHovered ? '100% 100%' : '0% 0%',
            transition: 'background-position 1s ease-out'
          }}
        />

        {/* Top left flag/corner design typical of Panini */}
        <div 
          className="absolute top-0 left-0 w-20 h-20 z-20 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${cfg.textColor}e0 0%, transparent 60%)`
          }}
        >
           <div className="absolute top-2 left-2 w-7 h-7 bg-white rounded-full p-0.5 shadow-md flex items-center justify-center">
             <img src="/logo.png" alt="RCBA" className="w-full h-full object-contain" />
           </div>
           <span className="absolute top-2.5 left-10 text-[9px] font-black italic text-white drop-shadow-md tracking-wider">RCBA</span>
        </div>

         {/* Top right Position label */}
         <div className="absolute top-2 right-2 z-20 pointer-events-none text-right flex flex-col items-end gap-1">
            <div 
              className={`text-[10px] font-black uppercase backdrop-blur-sm px-2 py-0.5 rounded shadow-sm border ${poste === 'unknown' ? 'bg-gray-800/90 text-white border-gray-700' : 'text-white border-white/30'}`} 
              style={poste !== 'unknown' ? { backgroundColor: cfg.textColor } : {}}
            >
              {cfg.label}
            </div>
            {age !== null && (
              <div className="text-[9px] font-bold bg-black/50 backdrop-blur-sm text-white px-1.5 py-0.5 rounded border border-white/20">
                {age} ans
              </div>
            )}
            {p.categorie_actuelle && (
              <div className="text-[8px] font-bold bg-white/80 backdrop-blur-sm text-gray-800 px-1.5 py-0.5 rounded border border-gray-200 mt-0.5">
                {p.categorie_actuelle}
              </div>
            )}
         </div>

        {/* Main Image Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '10px 10px' }} />

        {/* Main Image */}
        <div className="flex-1 relative z-0 flex flex-col items-center justify-end overflow-hidden">
          {p.photo_url && !p.photo_url.includes('ui-avatars.com') ? (
            <img 
              src={p.photo_url.startsWith('http') || p.photo_url.startsWith('/') || p.photo_url.startsWith('data:') ? p.photo_url : `/images/profiles/${p.photo_url}`} 
              alt={`${p.prenom} ${p.nom}`}
              className="absolute inset-0 w-full h-full object-cover object-[50%_20%] transition-transform duration-700 group-hover/card:scale-105 border border-black/10"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100/50">
              <span className="text-8xl font-black text-gray-200">{p.prenom?.[0] || '?'}{p.nom?.[0] || ''}</span>
            </div>
          )}

          {/* Stats Overlay on image */}
          {score > 0 && (
            <div className="absolute bottom-1 right-1 flex flex-col gap-1 bg-white/90 backdrop-blur-md px-1.5 py-1 rounded shadow-sm border border-white/50 z-10">
               <div className="flex gap-1.5 justify-between">
                 <div className="flex flex-col items-center min-w-[16px]">
                   <span className="text-[5px] font-black uppercase text-gray-500 leading-none">Tec</span>
                   <span className="text-[8px] font-black text-gray-800 leading-none tabular-nums">{tech}</span>
                 </div>
                 <div className="w-px bg-gray-300" />
                 <div className="flex flex-col items-center min-w-[16px]">
                   <span className="text-[5px] font-black uppercase text-gray-500 leading-none">Men</span>
                   <span className="text-[8px] font-black text-gray-800 leading-none tabular-nums">{mental}</span>
                 </div>
               </div>
               <div className="h-px bg-gray-200" />
               <div className="flex gap-1.5 justify-between">
                 <div className="flex flex-col items-center min-w-[16px]">
                   <span className="text-[5px] font-black uppercase text-gray-500 leading-none">Phy</span>
                   <span className="text-[8px] font-black text-gray-800 leading-none tabular-nums">{phy}</span>
                 </div>
                 <div className="w-px bg-gray-300" />
                 <div className="flex flex-col items-center min-w-[16px]">
                   <span className="text-[5px] font-black uppercase text-gray-500 leading-none">Tac</span>
                   <span className="text-[8px] font-black text-gray-800 leading-none tabular-nums">{tac}</span>
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Bottom Panini Banner */}
        <div className="relative z-20 bg-white border-t-2 flex flex-col shrink-0" style={{ borderColor: cfg.textColor }}>
          {/* Colored strip header */}
          <div className="h-1.5 w-full" style={{ backgroundColor: cfg.textColor }} />
          
          <div className="flex flex-row items-stretch h-[3.25rem]">
            {/* Number Area */}
            <div className="w-10 md:w-12 flex flex-col items-center justify-center bg-gray-100 border-r-2" style={{ borderColor: cfg.textColor }}>
               <span className="text-[7px] md:text-[8px] font-black text-gray-400 leading-none mb-0.5">N°</span>
               <span className="text-lg md:text-xl font-black text-gray-800 leading-none tabular-nums">{p.numero || '?'}</span>
            </div>
            
            {/* Name Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-1 text-center bg-white">
               <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-gray-500 leading-none mb-0.5" style={{ fontFamily: 'var(--font-display)' }}>{p.prenom}</span>
               <span className="text-sm md:text-base font-black uppercase tracking-tight leading-none" style={{ color: cfg.textColor, fontFamily: 'var(--font-display)' }}>{displayName || p.nom}</span>
            </div>
            
            {/* General Score Area */}
            <div className="w-10 md:w-12 flex flex-col items-center justify-center bg-gray-100 border-l-2" style={{ borderColor: cfg.textColor }}>
               <span className="text-[7px] md:text-[8px] font-black uppercase leading-none mb-0.5" style={{ color: cfg.textColor }}>GÉN</span>
               <span className="text-lg md:text-xl font-black text-gray-800 leading-none tabular-nums">{score > 0 ? score : '-'}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
