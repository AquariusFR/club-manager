"use client";

import React, { useState, useRef } from "react";
import { Shield, User } from "lucide-react";

interface LeaderCardProps {
  member: any;
  roleLabel?: string | string[];
  placeholderName?: string;
  size?: 'sm' | 'md' | 'lg';
  isShiny?: boolean;
  theme?: 'gold' | 'blue' | 'silver';
}

export default function LeaderCard({ member, roleLabel, placeholderName, size = 'md', isShiny = false, theme = 'gold' }: LeaderCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const isPlaceholder = !member && placeholderName;
  const displayName = member ? `${member.prenom} ${member.nom}` : (placeholderName || "Siège Vacant");
  const role = roleLabel || member?.role || ["Membre"];
  const rolesArray = Array.isArray(role) ? role : [role];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;
    
    setRotation({ x: rotateX, y: rotateY });
    
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlare({ x: glareX, y: glareY, opacity: 0.6 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlare({ opacity: 0, x: 50, y: 50 });
    setIsHovered(false);
  };

  const widthClass = size === 'lg' ? 'w-64 md:w-72 lg:w-80' : size === 'md' ? 'w-56 md:w-64 lg:w-72' : 'w-48 md:w-56 lg:w-64';

  const themeStyles = {
    gold: {
      outer: "from-yellow-200 via-yellow-500 to-amber-700 shadow-[0_0_15px_rgba(251,191,36,0.3)]",
      inner: "border-yellow-200/40",
      frame: "border-yellow-800/80",
      banner: "from-yellow-50 to-white border-amber-500 shadow-[0_-4px_15px_rgba(245,158,11,0.25)]",
      nameFirst: "text-amber-700/80",
      nameLast: "text-navy-deep",
      badgeFirst: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-sm",
      badgeRest: "bg-yellow-500/10 text-amber-800",
      foil: "linear-gradient(115deg, transparent 20%, rgba(255, 215, 0, 0.4) 30%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0.7) 55%, rgba(255, 215, 0, 0.4) 70%, transparent 80%)"
    },
    blue: {
      outer: "from-blue-200 via-blue-500 to-blue-800 shadow-[0_0_15px_rgba(59,130,246,0.3)]",
      inner: "border-blue-200/40",
      frame: "border-blue-800/80",
      banner: "from-blue-50 to-white border-blue-500 shadow-[0_-4px_15px_rgba(59,130,246,0.25)]",
      nameFirst: "text-blue-700/80",
      nameLast: "text-navy-deep",
      badgeFirst: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm",
      badgeRest: "bg-blue-500/10 text-blue-800",
      foil: "linear-gradient(115deg, transparent 20%, rgba(59, 130, 246, 0.4) 30%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0.7) 55%, rgba(59, 130, 246, 0.4) 70%, transparent 80%)"
    },
    silver: {
      outer: "from-gray-200 via-gray-400 to-gray-500 shadow-[0_0_15px_rgba(156,163,175,0.3)]",
      inner: "border-gray-200/40",
      frame: "border-gray-500/80",
      banner: "from-gray-50 to-white border-gray-400 shadow-[0_-4px_15px_rgba(156,163,175,0.25)]",
      nameFirst: "text-gray-500/80",
      nameLast: "text-navy-deep",
      badgeFirst: "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-sm",
      badgeRest: "bg-gray-500/10 text-gray-700",
      foil: "linear-gradient(115deg, transparent 20%, rgba(156, 163, 175, 0.4) 30%, rgba(255, 255, 255, 0.7) 45%, rgba(255, 255, 255, 0.7) 55%, rgba(156, 163, 175, 0.4) 70%, transparent 80%)"
    }
  };

  const t = themeStyles[theme] || themeStyles.gold;

  if (!member && !placeholderName) {
    return (
      <div className={`${widthClass} aspect-[2.5/3.5] bg-navy-light/10 border-2 border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center mx-auto shadow-lg backdrop-blur-sm`}>
        <Shield size={32} className="text-white/20 mb-3" />
        <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest text-center">Siège Vacant</span>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      className={`${widthClass} mx-auto relative flex flex-col cursor-pointer group/card transition-transform duration-200 ease-out isolate select-none shadow-2xl active:scale-[0.96] z-10`}
      style={{
        aspectRatio: '2.5/3.5',
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${isHovered ? 1.05 : 1})`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer Theme Border */}
      <div className={`absolute inset-0 bg-gradient-to-br ${t.outer} p-[5%] z-10 overflow-hidden rounded-md`}>
        {/* Inner highlight */}
        <div className={`absolute inset-0 border-[3px] ${t.inner} rounded-md pointer-events-none`} />
        
        {/* Inner Frame */}
        <div className={`relative w-full h-full flex flex-col overflow-hidden bg-navy border-2 ${t.frame} shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]`}>
          
          {/* Main Image */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-end overflow-hidden">
            {member?.photo_url && !member.photo_url.includes('ui-avatars') ? (
              <img 
                src={member.photo_url.startsWith('http') || member.photo_url.startsWith('/') || member.photo_url.startsWith('data:') ? member.photo_url : `/images/profiles/${member.photo_url}`} 
                alt={displayName}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover/card:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-navy-light via-navy to-navy-deep pb-12">
                 {isPlaceholder ? (
                   <span className="text-5xl font-bold text-white/20">?</span>
                 ) : (
                   <div className="flex flex-col items-center gap-2">
                     <div className="w-20 h-20 rounded-full border-2 border-white/20 bg-white/5 flex items-center justify-center shadow-inner">
                       <span className="text-2xl font-black font-display tracking-widest text-gold drop-shadow-md">
                         {((member?.prenom?.[0] || '') + (member?.nom?.[0] || (displayName[0] || ''))).toUpperCase()}
                       </span>
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">RCBA STAFF</span>
                   </div>
                 )}
              </div>
            )}
            {/* Soft Vignette so the photo looks grounded without obscuring it */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Top Left Club Logo */}
          <div className="absolute top-2 left-2 z-20 flex items-center justify-center bg-white rounded-full p-0.5 shadow-md border border-gray-200 w-10 h-10 md:w-12 md:h-12">
             <img src="/logo.png" alt="RCBA" className="w-full h-full object-contain drop-shadow-sm" />
          </div>



          {/* Bottom Name & Role Banner - Themed */}
          <div className={`absolute bottom-0 inset-x-0 bg-gradient-to-b ${t.banner} border-t-[3px] z-20 p-2 md:p-3 text-center flex flex-col justify-center`}>
            <div className="flex items-baseline justify-center gap-1.5 mb-1.5">
              {member?.prenom && (
                <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${t.nameFirst}`} style={{ fontFamily: 'var(--font-display)' }}>
                  {member.prenom}
                </span>
              )}
              <span className={`text-xs md:text-sm font-black uppercase tracking-tight ${t.nameLast}`} style={{ fontFamily: 'var(--font-display)' }}>
                {member?.nom || displayName}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-1">
              {rolesArray.map((role, i) => (
                <div key={i} className={`px-2 py-0.5 rounded-sm ${i === 0 ? t.badgeFirst : t.badgeRest} text-[8px] md:text-[9px] font-bold uppercase tracking-widest leading-none border border-transparent`} style={{ fontFamily: 'var(--font-display)' }}>
                  {role}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Right Dot Grid (Panini Hallmark - Subtle) */}
          <div className="absolute bottom-2 left-12 md:left-16 z-20 grid grid-cols-4 gap-[2px] opacity-40 mix-blend-overlay">
            {Array.from({length: 12}).map((_, i) => (
              <div key={i} className="w-[2px] h-[2px] bg-white rounded-full" />
            ))}
          </div>

          {/* Glare overlay (Mouse tracking) */}
          <div 
            className="absolute inset-0 z-30 pointer-events-none mix-blend-screen transition-opacity duration-200"
            style={{
              opacity: glare.opacity,
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)`
            }}
          />

          {/* Foil / Hologram layer */}
          <style>{`
            @keyframes holo-sweep {
              0% { background-position: 200% center; }
              100% { background-position: -200% center; }
            }
          `}</style>
          <div 
            className="absolute inset-0 z-40 pointer-events-none transition-opacity duration-500 opacity-30 mix-blend-overlay group-hover/card:opacity-60"
            style={{
              backgroundImage: t.foil,
              backgroundSize: '300% 300%',
              animation: 'holo-sweep 7s infinite linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}

