import { getSession } from "@/lib/authentication";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import { Heart, Shield, Users, Target, Zap, Award, Sparkles, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import fs from "fs";
import path from "path";

export default async function ChartePage() {
  const session = await getSession();

  // Load club info data
  const clubInfoPath = path.join(process.cwd(), "lib", "data", "club-info.json");
  const clubData = JSON.parse(fs.readFileSync(clubInfoPath, "utf8"));

  // Mapping UI styles to values from JSON
  const valueStyles: Record<string, any> = {
    "Respect": { 
      icon: Shield, 
      color: "text-gold", 
      bg: "bg-gold/10", 
      border: "border-gold/30"
    },
    "Sérieux": { 
      icon: Target, 
      color: "text-blue-400", 
      bg: "bg-blue-400/10", 
      border: "border-blue-400/30"
    },
    "Convivialité": { 
      icon: Heart, 
      color: "text-pink-400", 
      bg: "bg-pink-400/10", 
      border: "border-pink-400/30"
    },
    "Engagement": { 
      icon: Users, 
      color: "text-amber-400", 
      bg: "bg-amber-400/10", 
      border: "border-amber-400/30"
    },
    "Performance": { 
      icon: Award, 
      color: "text-pitch-green", 
      bg: "bg-pitch-green/10", 
      border: "border-pitch-green/30"
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep text-white selection:bg-gold/30 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 pb-12 border-b border-white/5 relative">
          <HudCorners color="#d4af37" opacity={0.05} />
          <PageLabel 
            section="CLUB"
            category="IDENTITÉ & DÉONTOLOGIE"
            title="LA CHARTE" 
            subtitle="Les valeurs et engagements qui fondent l'identité et la discipline du Racing Club Bû Abondant."
            icon="docs" 
            variant="gold"
          />
        </div>

        <main className="space-y-20 pb-32">
          {/* Intro */}
          <section className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-white/70 leading-relaxed italic font-light">
              La présente charte définit les valeurs fondamentales et les engagements qui régissent la vie du Racing Club Bû Abondant. 
              Elle constitue le socle commun que chaque membre s'engage à respecter et à faire vivre au quotidien pour maintenir l'excellence de notre organisation.
            </p>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-wider text-gold mb-10 flex items-center gap-3">
              <Sparkles size={20} />
              Nos Piliers Fondamentaux
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {clubData.values.map((v: any, idx: number) => {
                const style = valueStyles[v.title] || valueStyles["Formation"];
                return (
                  <div 
                    key={idx}
                    className={`group bg-white/[0.02] border ${style.border} rounded-3xl p-8 hover:bg-white/[0.04] transition duration-500`}
                  >
                    <div className={`w-14 h-14 rounded-2xl ${style.bg} flex items-center justify-center mb-6 border ${style.border}`}>
                      <style.icon size={28} className={style.color} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-gold transition-colors">{v.title}</h3>
                    <p className="text-sm text-white/60 mb-6 leading-relaxed italic">
                      {v.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {v.keywords.map((kw: string, kIdx: number) => (
                        <span key={kIdx} className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 text-white/40 border border-white/5">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Commitments */}
          <section>
            <h2 className="text-xl font-black uppercase tracking-wider text-gold mb-10 flex items-center gap-3">
              <Shield size={20} />
              Engagements des Membres
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clubData.commitments.map((commitment: any, idx: number) => (
                <div 
                  key={idx}
                  className="flex items-start gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-gold/30 hover:bg-white/[0.04] transition duration-300"
                >
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 border border-gold/20">
                    <CheckCircle size={16} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">{commitment.title}</h4>
                    <p className="text-sm text-white/50 leading-relaxed italic">{commitment.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Signature */}
          <section className="bg-gradient-to-br from-gold/10 via-transparent to-blue-500/10 border border-white/10 rounded-3xl p-10 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/10 transition-colors duration-1000" />
            <Zap size={40} className="mx-auto text-gold mb-6 animate-pulse" />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4 italic">
              ENSEMBLE, NOUS SOMMES <span className="text-gold">RCBA</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto mb-8 font-light italic">
              En rejoignant le Racing Club Bû Abondant, vous devenez membre d'une famille partageant ces valeurs d'excellence. 
              Votre engagement individuel forge la puissance collective de notre club.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-3 px-10 py-5 bg-gold text-navy-deep font-black uppercase tracking-widest rounded-xl hover:bg-white transition hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.2)]"
            >
              Rejoindre le club <ChevronRight size={18} />
            </Link>
          </section>
        </main>
      </div>
    </div>
  );
}
