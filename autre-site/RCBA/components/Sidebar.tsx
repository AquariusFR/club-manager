'use client'

import React, { useState } from 'react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { 
  LogOut, 
  Settings,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  Bell,
  Building2,
  ShieldCheck,
  Users2
} from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { PORTALS } from "@/lib/config/portals";
import { motion } from "framer-motion";

interface SidebarProps {
  role: string;
  userName: string;
  userRole?: string;
}

export default function Sidebar({ role, userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Normalize role for config lookup
  let normalizedRole = role.toLowerCase();
  if (normalizedRole === 'parent') normalizedRole = 'parents';
  
  const config = PORTALS[normalizedRole] || PORTALS.coach; // Fallback to coach

  const navItems = config.navItems;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-6 right-6 z-[60] p-4 ${config.dot} text-navy-deep rounded-2xl md:hidden shadow-2xl shadow-gold active:scale-90 transition-transform`}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-navy-deep/60 backdrop-blur-sm z-[55] md:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`
        fixed md:relative top-0 left-0 h-screen md:h-full w-64 bg-navy-deep/80 backdrop-blur-[64px] border-r border-white/10 z-50
        transition-transform duration-500 md:duration-0 cubic-bezier(0.4, 0, 0.2, 1) shadow-3xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] animate-scanline bg-gradient-to-b from-transparent via-gold to-transparent h-20 w-full" />
        
        <div className="flex flex-col h-full p-8 relative z-10">
          {/* Logo / Brand */}
          <div className="mb-12 px-2">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1 group-hover:border-gold/30 transition-colors shadow-xl">
                <img src="/logo.png" alt="RCBA" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black italic tracking-tighter text-white group-hover:text-gold transition-colors athletic-title athletic-skew leading-none">
                  RCBA <span className={config.color}>PORTAL</span>
                </span>
                <span className="text-[9px] font-black uppercase text-white/70 tracking-wider mt-1 flex items-center gap-2">
                  <span className="w-2 h-[1px] bg-gold/30"></span>
                  ESPACE MEMBRE
                  <span className="w-2 h-[1px] bg-gold/30"></span>
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile Info */}
          <div className="mb-12 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 shadow-glass-luminous relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 transition-opacity group-hover:opacity-40 ${config.dot}`} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={10} className={config.color} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">Statut Session</span>
                </div>
                <div className="flex gap-3 items-center">
                  {/* Notification Bell */}
                  <div className="relative cursor-pointer group/bell">
                    <Bell size={18} className="text-white/40 group-hover/bell:text-white transition-colors" />
                    {(normalizedRole === 'coach' || normalizedRole === 'direction') && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border border-navy-deep"></span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <div className="w-1 h-3 bg-pitch-green rounded-full animate-pulse" />
                    <div className="w-1 h-3 bg-pitch-green/40 rounded-full" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-white truncate italic tracking-tighter athletic-title athletic-skew leading-none mb-2">{userName}</h3>
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em]">Identité</span>
                  <span className={`text-[9px] font-black uppercase ${config.color} italic`}>{config.role}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em]">Statut</span>
                  <span className="text-[9px] font-black uppercase text-pitch-green italic">En ligne</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition duration-500 group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none
                    ${isActive 
                      ? `${config.bg} ${config.color} border border-${config.accent}/30 shadow-glass-luminous` 
                      : `text-white/40 border border-transparent hover:bg-white/[0.03] hover:text-white`
                    }
                  `}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-glow"
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" 
                    />
                  )}
                  
                  <Icon className={`w-5 h-5 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-6 ${isActive ? config.color : 'text-white/20 group-hover:text-white/60'}`} />
                  <span className="font-black tracking-tight text-sm uppercase italic pr-6 whitespace-nowrap athletic-title athletic-skew">{item.name}</span>
                  
                  {isActive && (
                    <div className="ml-auto flex gap-1">
                      <div className={`w-1 h-1 rounded-full ${config.dot} animate-ping`} />
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* System Actions */}
          <div className="mt-auto space-y-4">
            <div className="flex items-center justify-between mb-2 px-6">
              <span className="text-[7px] font-black uppercase tracking-[0.5em] text-white/20">Système</span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-1 bg-white/10 rounded-full" />)}
              </div>
            </div>
            
            <Link
              href="/"
              className="flex items-center gap-4 px-6 py-4 text-white/30 hover:text-gold transition group rounded-2xl hover:bg-white/[0.02] focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            >
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" />
              <span className="font-black text-[10px] uppercase tracking-widest italic athletic-title athletic-skew transition-colors">Retour au site public</span>
            </Link>

            {(userRole?.toLowerCase() === 'développeur' || userRole?.toLowerCase() === 'admin') && (
              <div className="space-y-1 py-2 border-y border-white/5 my-2">
                <span className="text-[7px] font-black uppercase tracking-[0.5em] text-white/20 px-6 block mb-2 mt-1">Navigation Globale</span>
                <Link
                  href="/direction/dashboard"
                  className="flex items-center gap-4 px-6 py-3 text-white/30 hover:text-gold transition group rounded-2xl hover:bg-gold/10 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
                >
                  <Building2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 text-gold" />
                  <span className="font-black text-[9px] uppercase tracking-widest italic athletic-title athletic-skew transition-colors">Portail Direction</span>
                </Link>
                <Link
                  href="/coach/dashboard"
                  className="flex items-center gap-4 px-6 py-3 text-white/30 hover:text-pitch-green transition group rounded-2xl hover:bg-pitch-green/10 focus-visible:ring-2 focus-visible:ring-pitch-green focus-visible:outline-none"
                >
                  <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 text-pitch-green" />
                  <span className="font-black text-[9px] uppercase tracking-widest italic athletic-title athletic-skew transition-colors">Portail Coach</span>
                </Link>
                <Link
                  href="/parents/dashboard"
                  className="flex items-center gap-4 px-6 py-3 text-white/30 hover:text-sky-400 transition group rounded-2xl hover:bg-sky-400/10 focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:outline-none"
                >
                  <Users2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-500 text-sky-400" />
                  <span className="font-black text-[9px] uppercase tracking-widest italic athletic-title athletic-skew transition-colors">Portail Famille</span>
                </Link>
              </div>
            )}

            <Link
              href="/settings"
              className="flex items-center gap-4 px-6 py-4 text-white/30 hover:text-white transition group rounded-2xl hover:bg-white/[0.02] focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
            >
              <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-1000" />
              <span className="font-black text-[10px] uppercase tracking-widest italic athletic-title athletic-skew transition-colors">Paramètres</span>
            </Link>
            
            <form action={logoutAction}>
              <button
                className="w-full flex items-center gap-4 px-6 py-6 rounded-[2rem] bg-white/[0.03] hover:bg-rose-500/10 text-white/30 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 transition duration-500 group shadow-2xl focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-500" />
                <span className="font-black text-[11px] uppercase tracking-widest italic athletic-title athletic-skew">Déconnexion</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
