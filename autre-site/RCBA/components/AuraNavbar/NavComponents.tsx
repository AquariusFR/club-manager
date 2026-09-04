'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

export function Magnetic({ children, strength = 0.2 }: { children: React.ReactElement; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * strength, y: middleY * strength });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-flex"
    >
      {children}
    </motion.div>
  );
}

export function ThemeTrigger({ 
  title, active, isPathActive, children, onMouseEnter, onMouseLeave 
}: { 
  title: string; active: boolean; isPathActive: boolean; children: React.ReactNode; 
  onMouseEnter: () => void; onMouseLeave: () => void;
}) {
  const id = `nav-dropdown-${title.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="relative h-full flex items-center" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button 
        aria-expanded={active} 
        aria-haspopup="menu"
        aria-controls={id}
        className={`flex items-center gap-2 px-4 py-2 transition font-black text-[11px] uppercase tracking-[0.3em] italic relative z-[30] rounded-lg focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none ${active || isPathActive ? 'text-gold' : 'text-white/60 hover:text-white/90'}`}
      >
        {title}
        <ChevronDown size={11} className={`transition-transform duration-500 opacity-60 ${active ? 'rotate-180 text-gold opacity-100' : ''}`} />
        <span className={`absolute bottom-[-2px] left-4 right-4 h-[2px] bg-gold transition duration-500 origin-left ${active || isPathActive ? 'scale-x-100 opacity-100 shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'scale-x-0 opacity-0'}`} />
      </button>

      <AnimatePresence>
        {active && (
          <motion.div 
            id={id}
            role="menu"
            initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full left-0 pt-4 z-[10000]"
          >
            <div className="bg-navy-deep/98 border border-white/20 rounded-[2rem] shadow-3xl backdrop-blur-3xl p-3 border-t-gold/40 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileAccordion({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const id = `mobile-accordion-${title.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <div className="space-y-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        className={`w-full flex items-center justify-between p-4 rounded-xl border transition focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none ${isOpen ? 'bg-gold/10 border-gold/30 text-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'bg-white/[0.02] border-white/5 text-white/60 hover:bg-white/[0.05]'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg border transition-colors ${isOpen ? 'bg-navy-deep border-gold/30 text-gold shadow-inner' : 'bg-navy-deep border-white/10 text-white/70'}`}>{icon}</div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{title}</span>
        </div>
        <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div 
            id={`${id}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MenuLink({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 p-3.5 rounded-xl border border-white/10 bg-white/[0.04] hover:border-gold/50 hover:bg-gold/10 transition group relative overflow-hidden w-full focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none">
      <div className="w-10 h-10 rounded-lg bg-navy-deep border border-white/20 flex items-center justify-center text-white/70 group-hover:text-gold transition duration-500 shadow-lg">{icon}</div>
      <div className="flex-1">
        <div className="text-[11px] font-black uppercase tracking-widest text-white group-hover:text-gold italic leading-tight">{title}</div>
        <div className="text-[9px] font-bold uppercase text-white/60 tracking-wider mt-1 leading-none">{desc}</div>
      </div>
      <ChevronRight size={12} className="text-white/40 group-hover:text-gold group-hover:translate-x-1 transition" />
    </Link>
  );
}

export function MobileLink({ href, title, icon, onClick }: { href: string; title: string; icon?: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] text-white/60 hover:text-gold transition group focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none">
       {icon && <div className="p-2 bg-navy-deep rounded-lg border border-white/10 group-hover:border-gold/30">{icon}</div>}
       <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">{title}</span>
    </Link>
  );
}

export function TeamMenuLink({ href, title }: { href: string; title: string }) {
  return (
    <Link href={href} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 hover:border-gold/30 hover:bg-gold/5 transition group focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none">
      <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 group-hover:text-gold transition-colors">{title}</span>
      <ChevronRight size={10} className="text-white/20 group-hover:text-gold transition" />
    </Link>
  );
}

export function TeamMobileLink({ href, title, onClick }: { href: string; title: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center justify-between px-4 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-white/40 hover:text-gold transition focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none">
      <span className="text-[9px] font-bold uppercase tracking-widest">{title}</span>
      <ChevronRight size={10} />
    </Link>
  );
}
