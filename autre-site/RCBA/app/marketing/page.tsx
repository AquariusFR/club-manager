import React from 'react';
import { 
  Zap, 
  Shield, 
  Target, 
  Cpu, 
  Globe, 
  Award, 
  ChevronRight, 
  Layers,
  BarChart3,
  Users,
  Users2,
  Trophy,
  Activity
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MagneticWrapper from '@/components/MagneticWrapper';

export default function MarketingElitePage() {
  return (
    <div className="min-h-screen bg-navy-deep text-white overflow-x-hidden selection:bg-pitch-green selection:text-navy-deep">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pitch-green/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 blur-[120px] rounded-full animate-pulse delay-700" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] bg-[length:50px_50px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 p-8 flex items-center justify-between backdrop-blur-md bg-navy-deep/20 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-pitch-green flex items-center justify-center text-navy-deep shadow-[0_0_20px_rgba(98,203,114,0.3)]">
            <Trophy size={20} />
          </div>
          <span className="athletic-title text-xl italic tracking-widest uppercase font-black">RCBA <span className="text-pitch-green">ELITE</span></span>
        </div>
        <div className="hidden md:flex items-center gap-12 font-black text-[10px] uppercase tracking-[0.3em]">
          <Link href="/" className="hover:text-pitch-green transition-colors italic">Club</Link>
          <Link href="/marketing" className="text-pitch-green italic underline underline-offset-8">Intelligence</Link>
          <Link href="/contact" className="hover:text-pitch-green transition-colors italic">Partenariat</Link>
        </div>
        <MagneticWrapper>
          <Link href="/login" className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] hover:bg-pitch-green hover:text-navy-deep transition duration-500 italic">
            Accès au club
          </Link>
        </MagneticWrapper>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-48 pb-32 px-8 lg:px-20 text-center flex flex-col items-center">
        <div className="flex items-center gap-4 text-pitch-green text-[10px] font-black uppercase tracking-[0.8em] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="w-20 h-px bg-pitch-green/40"></span> L&apos;ÈRE DE L&apos;IA TACTIQUE
        </div>
        
        <h1 className="athletic-title text-6xl md:text-8xl lg:text-[10rem] text-white italic leading-[0.85] tracking-[1rem] uppercase font-black mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          ELITE <br />
          <span className="text-pitch-green drop-shadow-[0_0_50px_rgba(98,203,114,0.3)]">TWELVE</span>
        </h1>

        <p className="max-w-2xl text-white/60 text-sm md:text-lg font-medium leading-relaxed mb-16 px-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          Fusionner l'expertise humaine et l'intelligence agentique. Le RCBA redéfinit la performance footballistique via un écosystème d'agents autonomes dédiés à la victoire.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-700">
          <MagneticWrapper>
            <button className="px-12 py-6 rounded-full bg-pitch-green text-navy-deep text-sm font-black uppercase tracking-[0.5em] shadow-[0_20px_40px_rgba(98,203,114,0.2)] hover:scale-105 active:scale-95 transition italic">
              Découvrir l&apos;Écosystème
            </button>
          </MagneticWrapper>
          <button className="px-12 py-6 rounded-full bg-white/5 border border-white/10 text-sm font-black uppercase tracking-[0.5em] hover:bg-white/10 transition italic">
            Voir les Stats Live
          </button>
        </div>
      </section>

      {/* Agent Ecosystem Grid */}
      <section className="relative z-10 py-32 px-8 lg:px-20">
        <div className="mb-20">
          <h2 className="athletic-title text-4xl text-white italic uppercase tracking-wider mb-4">Architecture <span className="text-pitch-green">Agentique</span></h2>
          <div className="h-1 w-32 bg-pitch-green/40"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              name: "Sirchmunk", 
              role: "Recon expert", 
              desc: "Analyse en temps réel de l'adversaire et scouting digital via Footeo & FFF Data.", 
              icon: Target,
              color: "text-pitch-green",
              bg: "bg-pitch-green/5"
            },
            { 
              name: "Aura Core", 
              role: "Orchestrator", 
              desc: "Coordination centrale des flux de données et prise de décision multisectorielle.", 
              icon: Cpu,
              color: "text-blue-400",
              bg: "bg-blue-400/5"
            },
            { 
              name: "Combat Grades", 
              role: "Stat Analyst", 
              desc: "Évaluation algorithmique du potentiel de victoire basée sur 48 métriques techniques.", 
              icon: Award,
              color: "text-gold",
              bg: "bg-gold/5"
            },
            { 
              name: "Aura Sync", 
              role: "Team cohesion", 
              desc: "Optimisation de la synergie entre les joueurs via le Tactical Quorum v2.", 
              icon: Zap,
              color: "text-purple-400",
              bg: "bg-purple-400/5"
            },
            { 
              name: "Guardian", 
              role: "Defensive Logic", 
              desc: "Modélisation des structures défensives et anticipation des brèches tactiques.", 
              icon: Shield,
              color: "text-rose-400",
              bg: "bg-rose-400/5"
            },
            { 
              name: "Sphere", 
              role: "Public Interface", 
              desc: "Expansion de l'shadow du club via une communication automatisée multi-canaux.", 
              icon: Globe,
              color: "text-cyan-400",
              bg: "bg-cyan-400/5"
            }
          ].map((agent, i) => (
            <div key={i} className={`glass-card p-10 border-white/5 group hover:border-pitch-green/30 transition duration-700 relative overflow-hidden`}>
              <div className={`absolute -right-8 -bottom-8 opacity-5 group-hover:scale-125 transition-transform duration-1000 ${agent.color}`}>
                <agent.icon size={160} />
              </div>
              <div className={`w-14 h-14 rounded-2xl ${agent.bg} flex items-center justify-center ${agent.color} mb-8 border border-white/10 group-hover:scale-110 transition-transform`}>
                <agent.icon size={28} />
              </div>
              <h3 className="athletic-title text-2xl text-white italic uppercase tracking-tighter mb-2">{agent.name}</h3>
              <div className={`text-[10px] font-black uppercase tracking-[0.4em] mb-6 italic opacity-60 ${agent.color}`}>{agent.role}</div>
              <p className="text-white/70 text-sm leading-relaxed mb-10 italic">
                {agent.desc}
              </p>
              <ChevronRight className="text-white/80 group-hover:text-pitch-green group-hover:translate-x-2 transition" size={20} />
            </div>
          ))}
        </div>
      </section>

      {/* Performance Section */}
      <section className="relative z-10 py-32 px-8 lg:px-20 bg-white/[0.01] border-y border-white/5">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <h2 className="athletic-title text-6xl text-white italic leading-[1] uppercase font-black">
              DES RÉSULTATS <br />
              <span className="text-pitch-green">MEASURABLES.</span>
            </h2>
            <p className="text-white/80 text-lg italic leading-relaxed">
              Nos agents traitent plus de 10,000 points de données par match pour fournir un avantage compétitif inégalé en District.
            </p>
            <div className="grid grid-cols-2 gap-8">
              {[
                { label: "Unités (Équipes)", val: "17", icon: Activity },
                { label: "Opérateurs (Licenciés)", val: "450", icon: Users2 },
                { label: "Augmentation Synergie", val: "+24%", icon: Zap },
                { label: "Précision Tactique", val: "92%", icon: Target },
              ].map((stat, i) => (
                <div key={i} className="space-y-2 group/stat hover:translate-x-2 transition-transform duration-500">
                  <div className="text-4xl font-black text-white italic tracking-tighter group-hover/stat:text-pitch-green transition-colors">{stat.val}</div>
                  <div className="text-[10px] font-black text-white/70 uppercase tracking-widest italic">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-pitch-green/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="glass-card p-1 bg-white/5">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-navy-deep flex items-center justify-center p-12 border border-white/10">
                <BarChart3 className="text-pitch-green/40 opacity-20" size={120} />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                  <div className="flex items-center gap-4 text-white/70 animate-pulse font-black text-[10px] uppercase tracking-[0.5em]">
                    <span className="w-8 h-px bg-white/20"></span> Calcul du Combat Grade en cours
                  </div>
                  <div className="h-4 w-64 bg-white/5 rounded-full overflow-hidden border border-white/10">
                    <div className="h-full bg-pitch-green animate-progress-loading" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 pt-32 pb-16 px-8 lg:px-20 border-t border-white/5 text-center">
        <div className="mb-20">
          <h2 className="athletic-title text-3xl text-white italic uppercase tracking-wider mb-8 italic">Rejoignez la <span className="text-pitch-green">Révolution</span> Elite</h2>
          <MagneticWrapper>
            <button className="px-12 py-6 rounded-full bg-white text-navy-deep text-sm font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-pitch-green hover:shadow-pitch-green/20 transition italic">
              Devenir Partenaire
            </button>
          </MagneticWrapper>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-16 border-t border-white/5 gap-8 opacity-40">
          <div className="text-[10px] font-black uppercase tracking-widest italic">© 2026 Racing Club Bû Abondant</div>
          <div className="flex items-center gap-12 font-black text-[10px] uppercase tracking-widest italic">
            <span>Données Privées</span>
            <span>Conditions</span>
            <span>Agentic Labs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
