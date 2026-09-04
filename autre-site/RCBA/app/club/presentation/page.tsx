import { getSession } from "@/lib/authentication";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import MagneticWrapper from "@/components/MagneticWrapper";
import clubData from "@/lib/data/club-info.json";
import { 
  History, 
  Shield, 
  Sparkles, 
  Target, 
  Users, 
  Heart,
  TrendingUp,
  Award,
  Zap,
  Globe
} from "lucide-react";
import HistoryTimeline from "@/components/HistoryTimeline";

export default async function PresentationPage() {
  const session = await getSession();

  // Mapping UI styles to values from JSON
  const valueStyles: Record<string, any> = {
    "Respect": { 
      icon: Shield, 
      color: "text-gold", 
      bg: "bg-gold/5", 
      border: "border-gold/20"
    },
    "Sérieux": { 
      icon: Target, 
      color: "text-blue-400", 
      bg: "bg-blue-400/5", 
      border: "border-blue-400/20"
    },
    "Convivialité": { 
      icon: Heart, 
      color: "text-pink-400", 
      bg: "bg-pink-400/5", 
      border: "border-pink-400/20"
    },
    "Engagement": { 
      icon: Users, 
      color: "text-amber-400", 
      bg: "bg-amber-400/5", 
      border: "border-amber-400/20"
    },
    "Performance": { 
      icon: TrendingUp, 
      color: "text-pitch-green", 
      bg: "bg-pitch-green/5", 
      border: "border-pitch-green/20"
    }
  };

  return (
    <main className="min-h-screen bg-navy-deep text-white selection:bg-gold/30 relative pb-40 overflow-hidden">
      {/* ELECTRONIC ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none -z-50">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[180px] animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px]" />
      </div>

      
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10 space-y-40">
        
        {/* HEADER SECTION */}
        <section className="relative">
          <PageLabel 
            section="Le Club" 
            category="Identité & Valeurs" 
            title="Notre ADN" 
            subtitle="Explorez l'histoire et les fondations de notre organisation. Une fusion de traditions et d'ambitions futures."
            icon="club"
            variant="gold"
          />
          
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
               <div className="relative">
                 <div className="absolute -left-6 md:-left-12 top-0 bottom-0 w-1 bg-gradient-to-b from-gold/40 via-transparent to-transparent" />
                 <h2 className="athletic-title text-4xl sm:text-5xl md:text-7xl italic uppercase leading-[0.85] tracking-tighter">
                   D'UNE <span className="text-gold">VISION</span> <br/>
                   À UNE <span className="text-gold">RÉALITÉ</span>
                 </h2>
               </div>
               <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-light italic max-w-2xl">
                 Le Racing Club Bû Abondant n'est pas qu'un simple club de football. 
                 C'est une structure optimisée pour l'épanouissement sportif et social 
                 de notre territoire.
               </p>
               <div className="flex gap-6">
                  <div className="glass-card p-6 border-gold/20 flex flex-col items-center gap-2 min-w-[120px]">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gold/60">Effectif Global</span>
                     <span className="text-4xl font-black athletic-title athletic-skew italic">450+</span>
                  </div>
                  <div className="glass-card p-6 border-white/10 flex flex-col items-center gap-2 min-w-[120px]">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Équipes</span>
                     <span className="text-4xl font-black athletic-title athletic-skew italic text-white/80">17</span>
                  </div>
               </div>
            </div>

            <div className="relative group perspective-1000 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
               <div className="absolute inset-0 bg-gold/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="glass-card p-12 border-white/10 bg-white/[0.01] rotate-1 group-hover:rotate-0 transition duration-700 relative overflow-hidden backdrop-blur-2xl">
                  <HudCorners color="#d4af37" opacity={0.1} />
                  <History className="absolute -bottom-10 -right-10 w-48 h-48 text-gold opacity-[0.03] group-hover:scale-110 transition-transform duration-1000" />
                  <div className="text-[10px] font-black uppercase tracking-[0.5em] text-gold mb-6">Notre Histoire</div>
                  <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium italic mb-8 relative z-10">
                     "{clubData.history}"
                  </p>
                  <div className="flex items-center gap-4 border-t border-white/5 pt-8">
                     <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
                        <Globe size={18} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Ancrage territorial : Eure-et-Loir (28)</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* CORE VALUES - AURA CARDS */}
        <section className="space-y-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
             <div>
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-pitch-green mb-4">Core Principles</div>
                <h3 className="athletic-title text-4xl md:text-6xl italic uppercase tracking-tighter">NOS VALEURS</h3>
             </div>
              <p className="text-white/40 italic text-sm max-w-md md:text-right">Les cinq piliers fondamentaux qui régissent chaque action de la famille RCBA.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {clubData.values.map((v: any, i: number) => {
              const style = valueStyles[v.title] || valueStyles["Respect"];
              return (
                <MagneticWrapper key={i}>
                  <div className={`glass-card p-10 border ${style.border} ${style.bg} h-full group hover:bg-white/[0.03] transition duration-700 relative overflow-hidden flex flex-col justify-between`}>
                     <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-20 group-hover:scale-125 group-hover:rotate-12 transition duration-1000">
                        <style.icon size={120} className={style.color} />
                     </div>
                     <div className="relative z-10">
                        <div className={`w-14 h-14 rounded-2xl ${style.bg} border ${style.border} flex items-center justify-center ${style.color} mb-10 group-hover:scale-110 transition-transform`}>
                           <style.icon size={28} />
                        </div>
                        <h4 className="athletic-title text-3xl italic uppercase text-white mb-6 group-hover:text-gold transition-colors">{v.title}</h4>
                        <p className="text-sm text-white/50 italic leading-relaxed mb-8">{v.desc}</p>
                     </div>
                     <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/70 transition-colors">
                        <span>Pillier N°0{i + 1} • RCBA</span>
                        <TrendingUp size={12} />
                     </div>
                  </div>
                </MagneticWrapper>
              );
            })}
          </div>
        </section>

        {/* TIMELINE SECTION */}
        <section className="relative py-20 border-t border-white/5">
           <HistoryTimeline />
        </section>

        {/* FINAL MANIFESTO */}
        <section className="relative py-40 border-y border-white/5 overflow-hidden">
           <div className="absolute inset-0 bg-gold/[0.01] pointer-events-none" />
           <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
              <Sparkles className="mx-auto text-gold w-16 h-16 animate-pulse" />
              <h2 className="athletic-title text-5xl md:text-7xl italic uppercase tracking-tighter leading-[0.9]">
                 UNIS SUR LE TERRAIN <br/> <span className="text-gold">FIERS DE NOS COULEURS</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/80 italic leading-relaxed max-w-2xl mx-auto font-medium">
                 "Parce que le football à Bû et Abondant est une histoire de cœur, de passion et de partage, nous construisons ensemble un avenir radieux pour nos jeunes et notre territoire."
              </p>
              <div className="pt-10">
                 <div className="text-[10px] font-black uppercase tracking-[0.8em] text-gold/60">LE COMITÉ DIRECTEUR — RACING CLUB BÛ ABONDANT</div>
              </div>
           </div>
        </section>

      </div>
      
      {/* Footer Decoration */}
      <footer className="mt-20 opacity-40 group">
         <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-12 text-[9px] font-black uppercase tracking-[0.8em] text-white/20 italic">
               <span>Identité du Racing Club</span>
               <div className="w-px h-6 bg-white/10" />
               <span className="group-hover:text-gold transition-colors duration-1000">Saison 2025-2026</span>
            </div>
         </div>
      </footer>
    </main>
  );
}
