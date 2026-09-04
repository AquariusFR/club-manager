'use client';

import React from 'react';
import { AlertTriangle, Trophy, Zap } from 'lucide-react';
import Link from 'next/link';

export default function GlobalTicker() {
  const announcements = [
    { text: "DÉTECTIONS U14 - U18 OUVERTES", icon: Zap, href: "/rejoindre" },
    { text: "MATCH DE COUPE CE DIMANCHE À 15H00", icon: Trophy, href: "/equipes/1" },
    { text: "REJOIGNEZ LA CELLULE BÉNÉVOLE", icon: AlertTriangle, href: "/rejoindre" }
  ];

  return (
    <div className="w-full bg-gold text-navy-deep py-2 overflow-hidden flex whitespace-nowrap relative z-[100] border-b border-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.4)]">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker-scroll 30s linear infinite;
        }
        .ticker-hover:hover .animate-ticker {
          animation-play-state: paused;
        }
      `}} />
      
      <div className="flex ticker-hover w-full">
        <div className="flex animate-ticker shrink-0">
          {[...Array(4)].map((_, repetitionIndex) => (
            <div key={repetitionIndex} className="flex items-center">
              {announcements.map((item, index) => (
                <Link 
                  key={`${repetitionIndex}-${index}`}
                  href={item.href}
                  className="flex items-center gap-3 px-8 text-[11px] font-black uppercase tracking-[0.3em] hover:text-white transition-colors duration-300"
                >
                  <item.icon size={14} className="animate-pulse" />
                  {item.text}
                  <span className="ml-8 text-navy-deep/30">•</span>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
