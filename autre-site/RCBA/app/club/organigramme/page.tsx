"use client";

import { useEffect, useState } from "react";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import { 
  Users, 
  Shield, 
  Network, 
  FileText, 
  ChevronRight, 
  Camera,
  Briefcase,
  Megaphone,
  CreditCard,
  Beer,
  Goal,
  Trophy,
  Activity,
  Layers,
  Search,
  Star,
  Award
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ImageZoom from "@/components/ImageZoom";
import LeaderCard from "@/components/LeaderCard";

// Types
interface StaffMember {
  id: number;
  nom: string;
  prenom: string;
  role: string;
  photo_url: string;
  telephone?: string;
  email?: string;
  role_priority: number;
}

export default function OrganigrammePage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/club/staff');
        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setStaff(data);
        }
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const findMember = (fullName: string) => {
    if (!Array.isArray(staff)) return undefined;
    return staff.find(s => {
      const prenom = s.prenom || "";
      const nom = s.nom || "";
      return (
        `${prenom} ${nom}`.toLowerCase().includes(fullName.toLowerCase()) ||
        `${nom} ${prenom}`.toLowerCase().includes(fullName.toLowerCase()) ||
        fullName.toLowerCase().includes(nom.toLowerCase())
      );
    });
  };

  // --- DATA ---
  const bureauDir = {
    president: { member: findMember("Marc WAROQUIER"), roles: ["PRÉSIDENT", "RÉF. ARBITRE", "FINANCES"] },
    secretaire: { member: findMember("Vincent GODET"), roles: ["SECRÉTAIRE", "TRÉSORIER (int.)", "RÉF. PROJET CLUB", "RESP. ADMIN"] },
    vicePresident: { member: findMember("Matthieu VITY"), roles: ["VICE-PRÉSIDENT", "RÉF. SÉCURITÉ"] }
  };

  const comiteDir = [
    { member: findMember("Vanessa AMELINE"), roles: ["COMITÉ DIRECTEUR", "ADMIN, RH & BUVETTE"] },
    { member: findMember("Ghislaine VITY"), roles: ["COMITÉ DIRECTEUR", "RESP. BUVETTE", "FINANCES"] },
    { member: findMember("Vanessa DESSIRIER"), roles: ["COMITÉ DIRECTEUR", "RESP. PARTENARIAT"] },
    { member: findMember("Nicolas HIBLOT"), roles: ["COMITÉ DIRECTEUR", "RESP. COMMUNICATION"] }
  ];

  const poleSportif = [
    { member: findMember("Quentin LE CORRE"), roles: ["COORDINATEUR SPORTIF", "RESP. ÉCOLE DE FOOT", "RÉF. PEF"] },
    { member: findMember("Maël BOURDIN"), roles: ["CONTRAT BMF"] },
    { member: findMember("Benjamin HARACHE"), roles: ["SERVICE CIVIQUE"] },
    { member: findMember("Philippe BARBIER"), roles: ["RESP. FOOT À 11"] },
    { member: findMember("Yannick CAVADASKI"), roles: ["RESP. FOOT FÉMININ"] }
  ];

  const poles = [
    { id: "01", title: "Administratif & RH", color: "#3b82f6", icon: <Briefcase size={16} />, managers: ["Vincent GODET"], support: ["Vanessa AMELINE"] },
    { id: "02", title: "Partenariat", color: "#d4af37", icon: <Users size={16} />, managers: ["Vanessa DESSIRIER", "Mickael DESSIRIER-GIROUDOT"], support: ["Marc WAROQUIER"] },
    { id: "03", title: "Communication", color: "#f97316", icon: <Megaphone size={16} />, managers: ["Nicolas HIBLOT"], support: ["Sabine COIPEAU", "Florence RACLOT", "Sébastien PETACCIA"] },
    { id: "04", title: "Financier", color: "#10b981", icon: <CreditCard size={16} />, managers: ["Vincent GODET", "Marc WAROQUIER"], support: ["Ghislaine VITY", "Sabine COIPEAU"] },
    { id: "05", title: "Animations / Évènements", color: "#8b5cf6", icon: <Star size={16} />, managers: [], support: ["Comité de direction"] },
    { id: "06", title: "Buvette et Collation", color: "#f43f5e", icon: <Beer size={16} />, managers: ["Ghislaine VITY"], support: ["Vanessa AMELINE"] }
  ];

  // --- RENDER HELPERS ---
  const renderMemberCard = (memberData: any, size: 'sm' | 'md' | 'lg' = 'md', isShiny: boolean = false, theme: 'gold' | 'blue' | 'silver' = 'gold') => {
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 flex justify-center w-full"
      >
        <LeaderCard member={memberData.member} roleLabel={memberData.roles} size={size} isShiny={isShiny} theme={theme} />
      </motion.div>
    );
  };

  const renderSimpleRow = (name: string) => {
    const m = findMember(name);
    const initials = name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div key={name} className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/10 transition-all duration-300 group/item text-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-navy-deep border-4 border-white/10 shrink-0 flex items-center justify-center shadow-2xl transition-all duration-300 group-hover/item:border-gold/50 group-hover/item:shadow-gold/20">
          {m?.photo_url && !m.photo_url.includes('ui-avatars') ? (
            <img 
              src={m.photo_url} 
              className="w-full h-full object-cover object-top group-hover/item:scale-110 transition-transform duration-500" 
              alt={name}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-navy-light to-navy flex items-center justify-center font-display font-black text-xl text-gold/80 group-hover/item:text-gold transition-colors">
              {initials}
            </div>
          )}
        </div>
        <div className="text-sm font-black tracking-wide text-white/90 group-hover/item:text-gold transition-colors">
          {name}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050b1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-gold font-black uppercase tracking-widest animate-pulse">Initialisation du Node...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050b1a] text-white selection:bg-gold/30 pb-40 relative overflow-hidden font-body">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] opacity-30 animate-pulse" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-gold/5 rounded-full blur-[180px] opacity-20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-32 relative">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <Layers size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Gouvernance Club</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-7xl font-display font-black text-white italic tracking-tighter leading-none mb-8"
            >
              L'ORGANIGRAMME <br/>
              <span className="text-gold">GÉNÉRAL</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-lg max-w-xl uppercase tracking-widest text-[10px] font-bold"
            >
              Saison 2025 - 2026
            </motion.p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link 
              href="https://s2.static-footeo.com/uploads/rcba/Medias/RCBA_Organigramme_g%C3%A9n%C3%A9ral_2025_2026_court__t6yqb4.pdf"
              target="_blank"
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group hover:bg-gold hover:border-gold transition duration-500"
            >
              <FileText size={18} className="text-gold group-hover:text-navy-deep transition-colors" />
              <div className="text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-navy-deep/60">Télécharger</div>
                <div className="text-sm font-bold text-white group-hover:text-navy-deep">PDF OFFICIEL</div>
              </div>
            </Link>
          </div>
        </div>

        {/* SECTION 1: BUREAU DIRECTEUR */}
        <div className="space-y-20 mb-40">
          <div className="relative flex flex-col items-center">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-display font-black italic tracking-tighter uppercase mb-4 text-gold">Le Bureau</h3>
              <div className="h-1 w-20 bg-gold/50 mx-auto rounded-full" />
            </div>

            <div className="relative flex flex-col items-center gap-16 w-full max-w-5xl">
              {/* ROOT */}
              <div className="relative z-10 flex flex-col items-center w-full max-w-[280px] sm:max-w-[340px]">
                {renderMemberCard(bureauDir.president, "lg", true, "gold")}
                {/* Trunk Line */}
                <div className="hidden md:block w-px h-16 bg-gradient-to-b from-gold/50 to-gold/20" />
              </div>

              {/* BRANCH ROW */}
              <div className="relative z-10 flex flex-col md:flex-row justify-center gap-8 md:gap-16 w-full">
                {/* Horizontal Connector Line */}
                <div className="hidden md:block absolute top-0 left-[25%] right-[25%] h-px bg-gold/20 -translate-y-px" />
                
                <div className="flex flex-col items-center flex-1 relative w-full max-w-[280px] mx-auto md:max-w-none">
                  <div className="hidden md:block absolute top-0 w-px h-8 bg-gold/20 -translate-y-full" />
                  {renderMemberCard(bureauDir.secretaire, "md", true, "gold")}
                </div>
                <div className="flex flex-col items-center flex-1 relative w-full max-w-[280px] mx-auto md:max-w-none">
                  <div className="hidden md:block absolute top-0 w-px h-8 bg-gold/20 -translate-y-full" />
                  {renderMemberCard(bureauDir.vicePresident, "md", true, "gold")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: COMITE DIRECTEUR */}
        <div className="mb-40">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-display font-black italic tracking-tighter uppercase mb-4 text-white">Comité Directeur</h3>
            <div className="h-1 w-20 bg-white/20 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 justify-items-center">
            {comiteDir.map((m, idx) => (
              <div key={idx} className="w-full max-w-[280px]">
                {renderMemberCard(m, "sm", false, "silver")}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: POLE SPORTIF */}
        <div className="mb-40">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-display font-black italic tracking-tighter uppercase mb-4 text-blue-500">Pôle Sportif</h3>
            <div className="h-1 w-20 bg-blue-500/50 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 justify-items-center">
            {poleSportif.map((m, idx) => (
              <div key={idx} className="w-full max-w-[280px]">
                {renderMemberCard(m, "sm", false, "blue")}
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: POLES OPERATIONNELS */}
        <div>
          <div className="text-center mb-16">
            <h3 className="text-3xl font-display font-black italic tracking-tighter uppercase mb-4">Répartition des Pôles</h3>
            <div className="h-1 w-20 bg-white/20 mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {poles.map((pole) => (
              <div key={pole.id} className="relative group flex flex-col h-full">
                <div className="absolute inset-0 bg-white/[0.02] border border-white/10 rounded-3xl transition group-hover:border-white/20 group-hover:bg-white/[0.04] duration-500" />
                <div className="p-8 relative flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-gold shadow-inner group-hover:scale-110 transition-transform">
                      {pole.icon}
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Pôle</div>
                  </div>
                  
                  <h3 className="text-lg font-black uppercase tracking-tight mb-8 italic group-hover:text-gold transition-colors">{pole.title}</h3>
                  
                  <div className="space-y-6 flex-1 flex flex-col">
                    <div>
                      <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Activity size={10} className="text-gold" /> RESPONSABLE{pole.managers.length > 1 ? 'S' : ''}
                      </div>
                      <div className="space-y-3">
                        {pole.managers.length > 0 ? (
                          pole.managers.map(name => renderSimpleRow(name))
                        ) : (
                          <div className="p-4 border border-dashed border-white/10 rounded-2xl text-center text-xs text-white/40 font-bold uppercase">Non Défini</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-white/5">
                      <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Layers size={10} className="text-white/20" /> MEMBRES
                      </div>
                      <div className="space-y-3">
                        {pole.support.map((name) => renderSimpleRow(name))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="mt-40 relative">
          <div className="absolute inset-0 bg-gold/5 rounded-[40px] blur-[100px] pointer-events-none" />
          <div className="relative bg-navy-light/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-12 md:p-20 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
              <div className="max-w-2xl text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 text-gold mb-8">
                  <Goal size={28} />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em]">Rejoindre l'équipe</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black text-white italic tracking-tighter uppercase mb-8">
                  Participez à la <span className="text-gold">Vie du Club</span>
                </h2>
                <p className="text-white/40 text-lg leading-relaxed">
                  Le RCBA repose sur l'engagement de ses bénévoles et de son staff. Vous souhaitez vous investir dans un projet sportif ambitieux et convivial ?
                </p>
              </div>

              <Link 
                href="/contact"
                className="group relative px-12 py-6 bg-gold rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(212,175,55,0.2)] active:scale-95 transition shrink-0"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="relative flex items-center gap-4 text-navy-deep font-black uppercase tracking-widest text-sm">
                  Candidature Spontanée
                  <ChevronRight size={18} />
                </div>
              </Link>
            </div>
          </div>
        </section>

      </div>
      
      <HudCorners color="#d4af37" opacity={0.05} />
    </main>
  );
}
