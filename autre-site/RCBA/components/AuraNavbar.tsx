'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LogOut, 
  Shield, 
  User, 
  ChevronRight, 
  X, 
  Bell, 
  Trophy, 
  ChevronDown, 
  Menu, 
  Globe, 
  Euro, 
  FileText, 
  Users, 
  Activity,
  Moon,
  Package,
  Target,
  TrendingUp,
  Network,
  Scale,
  Zap,
  Clock,
  CreditCard as CreditCardIcon,
  Share2,
  Camera,
  Video,
  UserCheck,
  Flame,
  Calendar,
  MapPin
} from "lucide-react";
import { logoutAction, getUnreadIntelligenceCountAction } from "@/lib/actions";
import { PORTAL_LIST } from "@/lib/config/portals";
import HudCorners from "./HudCorners";
import {
  Magnetic,
  ThemeTrigger,
  MobileAccordion,
  MenuLink,
  MobileLink,
  TeamMenuLink,
  TeamMobileLink
} from "./AuraNavbar/NavComponents";

interface UserSession {
  id: number;
  email: string;
  roleId: number;
  roleName: string;
  username: string;
  playerId?: number;
}

export default function AuraNavbar({ session }: { session: UserSession | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activePortalOpen, setActivePortalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const activePole: string | null = pathname.startsWith('/club') ? 'club' : 
                     pathname.startsWith('/equipes') ? 'equipes' : 
                     pathname.startsWith('/inscription') ? 'inscription' : 
                     pathname.startsWith('/partenaires') ? 'partenaires' : null;

  const isCoach = session?.roleName === 'Coach';

  const handleMouseEnter = (menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 500); // 500ms delay ensures stable transitions
  };

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.nav-trigger-container')) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function checkNotifs() {
      if (session) {
        const count = await getUnreadIntelligenceCountAction();
        setUnreadCount(count);
      }
    }
    checkNotifs();
    const interval = setInterval(checkNotifs, 30000);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [session]);

  const hasNewNotifs = unreadCount > 0;

  return (
    <nav
      className="w-full sticky top-0 z-[9999] transition duration-700 ease-in-out py-2 md:py-4"
      aria-label="Navigation principale RCBA"
    >
      
      {/* ════════════════════════════════════════════════════
           📡 TOP BAR — RÉSEAUX SOCIAUX + INFOS RAPIDES
      ════════════════════════════════════════════════════ */}
      <div className="w-full bg-black/60 backdrop-blur-sm border-b border-white/5 overflow-hidden h-[34px] hidden sm:block">
        <div className="flex items-center justify-between h-full px-6 md:px-10">

          {/* Left — Social Links */}
          <div className="flex items-center gap-1">
            {[
              { href: "https://facebook.com", label: "Facebook", icon: Share2 },
              { href: "https://instagram.com", label: "Instagram", icon: Camera },
              { href: "https://youtube.com", label: "YouTube", icon: Video },
              { href: "https://rcba.footeo.com", label: "Footeo", icon: Trophy },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-7 h-7 flex items-center justify-center text-white/30 hover:text-gold transition-colors duration-300 rounded-lg hover:bg-white/5"
              >
                <Icon size={13} />
              </a>
            ))}
            <div className="w-px h-4 bg-white/10 mx-2" />
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 bg-pitch-green rounded-full animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.35em] text-white/30">
                RCBA <span className="text-pitch-green">Online</span>
              </span>
            </div>
          </div>

          {/* Center — Ticker */}
          <div className="hidden md:block flex-1 overflow-hidden relative mx-8">
            <motion.div
              animate={{ x: [0, -1000] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex gap-16 whitespace-nowrap text-[8px] font-black uppercase tracking-[0.35em] text-gold/50 italic"
            >
              <span>Deux Villages • Une Seule Ferveur</span>
              <span className="text-white/15">•</span>
              <span>Prochain Match: Séniors vs Dreux (Dimanche 15:00)</span>
              <span className="text-white/15">•</span>
              <span>Inscriptions & Re-licenciement 2025/2026 Ouvertes</span>
              <span className="text-white/15">•</span>
              <span>Labels FFF Bronze Jeunes & Féminines</span>
              <span className="text-white/15">•</span>
              <span>Victoire U18 R2 3-2 vs Montargis</span>
              <span className="text-white/15">•</span>
              <span>Deux Villages • Une Seule Ferveur</span>
              <span className="text-white/15">•</span>
              <span>Prochain Match: Séniors vs Dreux (Dimanche 15:00)</span>
            </motion.div>
          </div>

          {/* Right — CTA Rejoindre */}
          <div className="flex items-center gap-3">
            <Link
              href="/rejoindre"
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gold/15 border border-gold/25 text-[8px] font-black uppercase tracking-[0.25em] text-gold hover:bg-gold/25 hover:border-gold/50 transition-all duration-300 group"
            >
              <UserCheck size={10} className="group-hover:scale-110 transition-transform" />
              Rejoindre le club
            </Link>
          </div>
        </div>
      </div>

      <div className={`mx-auto px-4 md:px-8 transition duration-700 ${scrolled ? 'max-w-6xl' : 'max-w-[100vw]'}`}>
        <div className={`flex items-center justify-between px-8 py-4 rounded-[2.5rem] border transition duration-700 relative group/nav ${scrolled ? 'bg-navy-deep/80 backdrop-blur-3xl border-white/10 shadow-3xl' : 'bg-navy-deep/40 border-white/5 backdrop-blur-xl shadow-glass-luminous'}`}>
          <HudCorners color="#d4af37" opacity={0.05} />
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 group-hover/nav:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.02] hud-scanline" />
          
          <Link 
            href="/" 
            className="flex items-center gap-4 group rounded-2xl focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none" 
            title="Retour au site public RCBA"
            aria-label="Accueil - Racing Club Bû Abondant"
          >
            <motion.div 
              whileHover={{ 
                scale: 1.1, 
                y: [0, -6, 0, -3, 0],
                transition: { duration: 0.8, ease: "easeInOut" }
              }}
              whileTap={{ scale: 0.95 }}
              className={`bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-gold/40 transition duration-700 p-1 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative ${scrolled ? 'w-16 h-16 md:w-20 md:h-20' : 'w-24 h-24 md:w-32 md:h-32'}`}
            >
              <img src="/logo.png" alt="RCBA - Racing Club Bû Abondant" className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_25px_rgba(212,175,55,0.5)] transition duration-500 scale-110" />
              <div className="absolute inset-0 bg-gold/5 blur-xl group-hover:bg-gold/20 transition duration-700" />
            </motion.div>
            <div className="flex flex-col">
              <div className={`font-black text-white italic uppercase tracking-tighter font-display leading-[0.8] group-hover:text-gold transition duration-500 athletic-title athletic-skew ${scrolled ? 'text-[16px] md:text-xl' : 'text-xl md:text-3xl'}`}>
                BÛ <span className="text-gold">ABONDANT</span>
              </div>
              {!scrolled && (
                <div className="text-[8px] md:text-[9px] font-black uppercase text-white/80 tracking-[0.3em] font-body mt-1.5 flex items-center gap-2 transition-opacity duration-500">
                  <span className="w-1.5 h-[1px] bg-gold/40"></span>
                  Portail Officiel • Depuis 2020
                </div>
              )}
            </div>
          </Link>

          {/* 🧭 Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 mx-8 h-full nav-trigger-container">
            
            {/* CLUB */}
            <ThemeTrigger 
              title="Le Club" 
              active={openMenu === 'club'} 
              isPathActive={activePole === 'club'}
              onMouseEnter={() => handleMouseEnter('club')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="grid grid-cols-2 gap-6 w-[580px] p-4">
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 mb-2 px-2 italic">L'Identité</div>
                  <MenuLink href="/club/presentation" icon={<Shield size={16} />} title="Présentation" desc="Histoire & Identité" />
                  <MenuLink href="/club/organigramme" icon={<Network size={16} />} title="Organigramme" desc="Structure du club" />
                  <MenuLink href="/club/dirigeants" icon={<Users size={16} />} title="Les Dirigeants" desc="Bureau & Comité" />
                  <MenuLink href="/club/horaires" icon={<Clock size={16} />} title="Horaires" desc="Saison 2025/2026" />
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 mb-2 px-2 italic">Valeurs & Cadre</div>
                  <MenuLink href="/club/charte" icon={<Shield size={16} />} title="La Charte" desc="Nos Valeurs" />
                  <MenuLink href="/club/reglement" icon={<Scale size={16} />} title="Règlement" desc="Règles de vie" />
                  <MenuLink href="/contact" icon={<MapPin size={16} />} title="Contact & Stades" desc="Bû & Abondant" />
                </div>
              </div>
            </ThemeTrigger>

            {/* VIE DU CLUB */}
            <ThemeTrigger 
              title="Vie du Club" 
              active={openMenu === 'vie-du-club'} 
              isPathActive={activePole === 'vie-du-club'}
              onMouseEnter={() => handleMouseEnter('vie-du-club')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="grid grid-cols-1 gap-1.5 w-72 p-4">
                <MenuLink href="/club/actualites" icon={<Flame size={16} />} title="Actualités" desc="Dernières news" />
                <MenuLink href="/club/evenements" icon={<Calendar size={16} />} title="Événements" desc="Agenda du club" />
                <MenuLink href="/club/palmares" icon={<Trophy size={16} />} title="Palmarès" desc="Nos succès" />
              </div>
            </ThemeTrigger>

            {/* ÉQUIPES / MON EFFECTIF */}
            {isCoach ? (
              <Link 
                href="/coach/effectif"
                className={`flex items-center gap-2 px-4 py-2 transition font-black text-[11px] uppercase tracking-[0.3em] italic group relative ${pathname === '/coach/effectif' ? 'text-gold' : 'text-white/60 hover:text-white/90'}`}
              >
                Mon Effectif
                <Users size={11} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                <span className={`absolute bottom-[-2px] left-4 right-4 h-[2px] bg-gold transition duration-500 origin-left ${pathname === '/coach/effectif' ? 'scale-x-100 opacity-100 shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-40'}`} />
              </Link>
            ) : (
              <ThemeTrigger 
                title="Équipes" 
                active={openMenu === 'equipes'} 
                isPathActive={activePole === 'equipes'}
                onMouseEnter={() => handleMouseEnter('equipes')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="grid grid-cols-4 gap-6 w-[1000px] p-4">
                  <div className="space-y-2">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gold/60 mb-2 px-2 italic">Séniors</div>
                    <TeamMenuLink href="/equipes/1" title="Senior (D3)" />
                    <TeamMenuLink href="/equipes/10" title="Vétéran (D1)" />
                    <TeamMenuLink href="/equipes/12" title="Vétéran (D3)" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gold/60 mb-2 px-2 italic">Jeunes</div>
                    <TeamMenuLink href="/equipes/3" title="U18 (R2)" />
                    <TeamMenuLink href="/equipes/11" title="U18 (D1)" />
                    <TeamMenuLink href="/equipes/4" title="U15 (D2)" />
                    <TeamMenuLink href="/equipes/13" title="U13 (D2)" />
                    <TeamMenuLink href="/equipes/14" title="U13 (D3)" />
                    <TeamMenuLink href="/equipes/18" title="U12 (D1)" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gold/60 mb-2 px-2 italic">Féminines</div>
                    <TeamMenuLink href="/equipes/9" title="U15 Féminines" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gold/60 mb-2 px-2 italic">École de Foot</div>
                    <TeamMenuLink href="/equipes/6" title="U11 (Niveau 2)" />
                    <TeamMenuLink href="/equipes/15" title="U11 (Niv 3-1)" />
                    <TeamMenuLink href="/equipes/16" title="U11 (Niv 3-2)" />
                    <TeamMenuLink href="/equipes/17" title="U10 (Niveau 1)" />
                    <TeamMenuLink href="/equipes/7" title="U9 (Niveau 1)" />
                    <TeamMenuLink href="/equipes/19" title="U9 (Niveau 2)" />
                    <TeamMenuLink href="/equipes/8" title="U7 (+ Baby)" />
                  </div>
                </div>
              </ThemeTrigger>
            )}

            {/* INSCRIPTION */}
            <ThemeTrigger 
              title="Inscription" 
              active={openMenu === 'inscription'} 
              isPathActive={activePole === 'inscription'}
              onMouseEnter={() => handleMouseEnter('inscription')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="grid grid-cols-2 gap-6 w-[600px] p-4">
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 mb-2 px-2 italic">Nous Rejoindre</div>
                  <MenuLink href="/rejoindre" icon={<User size={16} />} title="Recrutement" desc="Devenir Joueur, Arbitre ou Staff" />
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60 mb-2 px-2 italic">Modalités</div>
                  <MenuLink href="/club/tarifs" icon={<Euro size={16} />} title="Adhésions" desc="Tarifs & Licences" />
                  <MenuLink href="/club/paiement" icon={<CreditCardIcon size={16} />} title="Paiement" desc="Moyens acceptés" />
                </div>
              </div>
            </ThemeTrigger>



            {/* PARTENAIRES */}
            <ThemeTrigger 
              title="Partenaires" 
              active={openMenu === 'partenaires'} 
              isPathActive={activePole === 'partenaires'}
              onMouseEnter={() => handleMouseEnter('partenaires')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="grid grid-cols-1 gap-1.5 w-72">
                <MenuLink href="/club/partenaires" icon={<Users size={16} />} title="Nos Partenaires" desc="Soutenez le club" />
                <MenuLink href="/club/partenaires#contact" icon={<Globe size={16} />} title="Devenir Partenaire" desc="Rejoignez l'élite" />
              </div>
            </ThemeTrigger>

            {/* ÉQUIPEMENTS (Ex-Boutique) */}
            <Link 
              href="/boutique"
              className={`flex items-center gap-2 px-4 py-2 transition font-black text-[11px] uppercase tracking-[0.3em] italic group relative ${pathname === '/boutique' ? 'text-gold' : 'text-white/60 hover:text-white/90'}`}
            >
              Équipements
              <Package size={11} className="opacity-60 group-hover:opacity-100 transition-opacity" />
              <span className={`absolute bottom-[-2px] left-4 right-4 h-[2px] bg-gold transition duration-500 origin-left ${pathname === '/boutique' ? 'scale-x-100 opacity-100 shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'scale-x-0 opacity-0 group-hover:scale-x-50 group-hover:opacity-40'}`} />
            </Link>
          </div>

          {/* 🛠️ Action Center */}
          <div className="flex items-center gap-3 md:gap-5">
            {session ? (
              <div className="flex items-center gap-2 md:gap-4">
                {/* Notification Bell */}
                <Magnetic strength={0.4}>
                  <button
                    className="relative w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition group shadow-inner"
                    aria-label={hasNewNotifs ? `Notifications — ${unreadCount} non lu${unreadCount > 1 ? 'es' : ''}` : 'Notifications'}
                    aria-live="polite"
                  >
                    <Bell size={18} className="text-white/60 group-hover:text-gold transition-colors" />
                    {hasNewNotifs && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-pitch-green rounded-full border-2 border-navy-deep animate-pulse shadow-[0_0_10px_rgba(0,255,0,0.5)]" />
                    )}
                  </button>
                </Magnetic>

                {/* Portal Switcher Trigger */}
                <Magnetic strength={0.2}>
                  <div className="relative">
                    <button 
                      onClick={() => setActivePortalOpen(!activePortalOpen)}
                      aria-label="Menu utilisateur et changement de portail"
                      aria-expanded={activePortalOpen}
                      aria-haspopup="dialog"
                      className={`flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl border transition duration-300 ${
                        activePortalOpen 
                        ? 'bg-gold/20 border-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex flex-col items-end text-right hidden sm:flex mr-2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{session.roleName}</span>
                        <span className="text-[11px] font-black text-white italic athletic-title uppercase tracking-wider">{session.username || 'Utilisateur'}</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-navy-deep border border-white/10 flex items-center justify-center text-white/60">
                        <User size={16} />
                      </div>
                    </button>

                    <AnimatePresence>
                      {activePortalOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-3 w-72 z-[10000]"
                        >
                          <div className="bg-navy-deep/95 border border-white/20 rounded-[2rem] shadow-3xl backdrop-blur-3xl overflow-hidden glass-card relative hud-scanline p-2">
                            <div className="px-4 pt-4 pb-2 border-b border-white/10 flex items-center justify-between">
                               <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 italic">Accès Portails</span>
                               <X size={14} className="text-white/40 cursor-pointer hover:text-white" onClick={() => setActivePortalOpen(false)} />
                            </div>
                            <div className="space-y-1 p-1">
                              {PORTAL_LIST.map((p) => (
                                <Link 
                                  key={p.role} 
                                  href={session ? `/${p.role}` : `/login?role=${p.role}`} 
                                  className={`flex items-center gap-4 px-4 py-3 rounded-xl border border-transparent transition group ${p.role === session?.roleName?.toLowerCase() ? 'bg-gold/10 border-gold/20 pointer-events-none' : 'hover:bg-white/5 hover:border-white/10'}`}
                                >
                                  <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 ${p.color}`}>
                                    <p.icon size={14} />
                                  </div>
                                  <div className="flex-1 text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-white">{p.label}</div>
                                  <ChevronRight size={10} className="text-white/40 group-hover:translate-x-1" />
                                </Link>
                              ))}
                            </div>
                            <form action={logoutAction} className="mt-2 p-1">
                              <button className="w-full flex items-center justify-center gap-2 py-3 text-red-400 hover:text-red-300 transition-colors text-[10px] font-black uppercase tracking-widest italic hover:bg-red-500/10 rounded-xl">
                                <LogOut size={14} /> Déconnexion
                              </button>
                            </form>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Magnetic>
              </div>
            ) : (
              <Magnetic strength={0.3}>
                <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 bg-gold text-navy-deep font-black text-sm rounded-xl hover:bg-gold-bright transition shadow-[0_0_30px_rgba(212,175,55,0.3)] athletic-title group">
                   <Zap size={14} className="animate-pulse" />
                   <span className="uppercase tracking-widest italic">Accès Club</span>
                </Link>
              </Magnetic>
            )}

            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-gold transition"
              aria-label="Ouvrir le menu de navigation"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {/* 📱 Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div
            id="mobile-nav-panel"
            className="fixed inset-0 z-[200] lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation mobile"
          >
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-navy-deep/80 backdrop-blur-xl" 
               onClick={() => setMobileMenuOpen(false)} 
             />
             <motion.div 
               initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="absolute right-0 top-0 bottom-0 w-80 bg-navy-deep border-l border-white/10 p-6 flex flex-col shadow-3xl"
             >
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <img src="/logo.png" alt="RCBA - Racing Club Bû Abondant" className="w-12 h-12 object-contain" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white italic">RCBA ELITE</span>
                   </div>
                   <button
                     onClick={() => setMobileMenuOpen(false)}
                     className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60"
                     aria-label="Fermer le menu de navigation"
                   >
                      <X size={20} />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pb-10">
                   <MobileAccordion title="Le Club" icon={<Shield size={18} />}>
                      <div className="space-y-1 pl-4 py-2 border-l border-white/5 ml-4">
                         <MobileLink href="/club/presentation" title="Présentation" onClick={() => setMobileMenuOpen(false)} />
                         <MobileLink href="/club/organigramme" title="Organigramme" onClick={() => setMobileMenuOpen(false)} />
                         <MobileLink href="/club/dirigeants" title="Les Dirigeants" onClick={() => setMobileMenuOpen(false)} />
                         <MobileLink href="/club/horaires" title="Horaires & Terrains" onClick={() => setMobileMenuOpen(false)} />
                         <MobileLink href="/club/charte" title="La Charte" onClick={() => setMobileMenuOpen(false)} />
                         <MobileLink href="/club/reglement" title="Règlement Intérieur" onClick={() => setMobileMenuOpen(false)} />
                         <MobileLink href="/contact" title="Contact & Stades" onClick={() => setMobileMenuOpen(false)} />
                      </div>
                   </MobileAccordion>

                   <MobileAccordion title="Vie du Club" icon={<Flame size={18} />}>
                      <div className="space-y-1 pl-4 py-2 border-l border-white/5 ml-4">
                         <MobileLink href="/club/actualites" title="Actualités" onClick={() => setMobileMenuOpen(false)} />
                         <MobileLink href="/club/evenements" title="Événements & Stages" onClick={() => setMobileMenuOpen(false)} />
                         <MobileLink href="/club/palmares" title="Palmarès & Labels" onClick={() => setMobileMenuOpen(false)} />
                      </div>
                   </MobileAccordion>

                   <MobileAccordion title={isCoach ? "Ma Team" : "Équipes"} icon={<Users size={18} />}>
                      <div className="space-y-4 pl-4 py-2 border-l border-white/5 ml-4">
                         {isCoach ? (
                            <div className="space-y-1">
                               <TeamMobileLink href="/coach/effectif" title="Mon Groupe" onClick={() => setMobileMenuOpen(false)} />
                               <TeamMobileLink href="/coach/matchs" title="Mes Matchs" onClick={() => setMobileMenuOpen(false)} />
                            </div>
                         ) : (
                            <div className="grid grid-cols-1 gap-4">
                               <div className="space-y-1">
                                  <div className="text-[8px] font-black uppercase tracking-widest text-gold/60 mb-1 px-1 italic">Séniors</div>
                                  <TeamMobileLink href="/equipes/1" title="Senior (D3)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/10" title="Vétéran (D1)" onClick={() => setMobileMenuOpen(false)} />
                               </div>
                               <div className="space-y-1">
                                  <div className="text-[8px] font-black uppercase tracking-widest text-gold/60 mb-1 px-1 italic">Jeunes</div>
                                  <TeamMobileLink href="/equipes/3" title="U18 (R2)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/11" title="U18 (D1)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/4" title="U15 (D2)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/13" title="U13 (D2)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/14" title="U13 (D3)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/18" title="U12 (D1)" onClick={() => setMobileMenuOpen(false)} />
                               </div>
                               <div className="space-y-1">
                                  <div className="text-[8px] font-black uppercase tracking-widest text-gold/60 mb-1 px-1 italic">Féminines</div>
                                  <TeamMobileLink href="/equipes/9" title="U15 Féminines" onClick={() => setMobileMenuOpen(false)} />
                               </div>
                               <div className="space-y-1">
                                  <div className="text-[8px] font-black uppercase tracking-widest text-gold/60 mb-1 px-1 italic">École de Foot</div>
                                  <TeamMobileLink href="/equipes/6" title="U11 (Niveau 2)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/15" title="U11 (Niv 3-1)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/16" title="U11 (Niv 3-2)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/17" title="U10 (Niveau 1)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/7" title="U9 (Niveau 1)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/19" title="U9 (Niveau 2)" onClick={() => setMobileMenuOpen(false)} />
                                  <TeamMobileLink href="/equipes/8" title="U7 (+ Baby)" onClick={() => setMobileMenuOpen(false)} />
                               </div>
                            </div>
                         )}
                      </div>
                   </MobileAccordion>

                   <MobileAccordion title="Inscription" icon={<Euro size={18} />}>
                      <div className="space-y-1 pl-4 py-2 border-l border-white/5 ml-4">
                         <MobileLink href="/rejoindre" title="Recrutement" onClick={() => setMobileMenuOpen(false)} />
                         <MobileLink href="/club/tarifs" title="Adhésions & Tarifs" onClick={() => setMobileMenuOpen(false)} />
                         <MobileLink href="/club/paiement" title="Moyens de Paiement" onClick={() => setMobileMenuOpen(false)} />
                      </div>
                   </MobileAccordion>

                   <MobileAccordion title="Partenaires" icon={<Globe size={18} />}>
                      <div className="space-y-1 pl-4 py-2 border-l border-white/5 ml-4">
                         <MobileLink href="/club/partenaires" title="Nos Partenaires" onClick={() => setMobileMenuOpen(false)} />
                         <MobileLink href="/club/partenaires#contact" title="Devenir Partenaire" onClick={() => setMobileMenuOpen(false)} />
                      </div>
                   </MobileAccordion>

                   <div className="space-y-2 pt-4">
                       <MobileLink href="/boutique" title="Boutique Officielle Adidas" icon={<Package size={16} />} onClick={() => setMobileMenuOpen(false)} />
                   </div>
                </div>
                
                <div className="mt-auto pt-6 border-t border-white/5 text-center">
                   <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 italic">Racing Club Bû Abondant — Saison 2025-2026</p>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
