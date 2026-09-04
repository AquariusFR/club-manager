import { 
  Target, 
  Activity, 
  Zap, 
  Shield, 
  ChevronRight, 
  Cpu, 
  AlertCircle,
  BarChart3,
  Search,
  Crosshair
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { unstable_cache } from "next/cache";
import PageLabel from "@/components/PageLabel";
import MagneticWrapper from "@/components/MagneticWrapper";
import IntelligencePanel from "@/components/IntelligencePanel";
import HudCorners from "@/components/HudCorners";
import PerformanceRadar from "@/components/PerformanceRadar";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import { calculateSquadSynergy } from "@/lib/tactical";

const getCachedSynergy = unstable_cache(
  async () => {
    const db = await getDb();
    const players = await db.all("SELECT id, prenom, nom, poste, aptitude_technique, aptitude_tactique, aptitude_physique, aptitude_mentale FROM Joueurs");
    return calculateSquadSynergy(players);
  },
  ['squad-synergy-cache'],
  { revalidate: 3600, tags: ['squad-stats'] }
);

export default async function TacticalIntelligencePage() {
  const session = await getSession();

  // Fetch squad for aggregate metrics using cache
  const squadData = await getCachedSynergy();
  const avg = squadData.averages || { technique: 50, tactique: 50, physique: 50, mental: 50 };


  // Mock Sirchmunk Recon Data for demonstration
  const sirchmunkFindings = {
    target: "FFF - District 3 Opponent",
    timestamp: new Date().toISOString(),
    status: "MISSION_STABLE",
    threatLevel: "MODERE",
    findings: {
      standing: 4,
      synergy_delta: +2.4,
      scouted_players: 14,
      key_weakness: "Couloirs latéraux (Transitions)",
      recommended_formation: "4-4-2 Losange"
    }
  };

  return (
    <div className="flex-1 animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-12 pb-20 p-8 lg:p-12 hud-grain">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 pb-16 border-b border-white/5 relative overflow-hidden glass-edge-highlight">
        {/* Pitch Green Aura Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pitch-green/5 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-40 animate-pulse" />
        
        <PageLabel 
          section="Staff"
          category="Tactics"
          title="Playbook Élite"
          subtitle="Intelligence tactique, schémas de jeu et déploiement stratégique RCBA."
          variant="green"
          icon="tactical"
        />

        <div className="hidden xl:block bg-white/[0.02] border border-white/10 px-8 py-4 rounded-3xl backdrop-blur-3xl glass-edge-highlight relative overflow-hidden group">
          <div className="absolute inset-0 bg-pitch-green/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-pitch-green uppercase tracking-[0.4em] italic drop-shadow-glow">Target Selection</span>
               <span className="text-xl font-bold text-white uppercase italic athletic-title tracking-widest drop-shadow-glow">DYNAMIC_ALLOCATION</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-pitch-green/10 flex items-center justify-center border border-pitch-green/20 group-hover:shadow-gold transition">
               <Crosshair size={24} className="text-pitch-green" />
            </div>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Main Intelligence Feed: Neural Mission 0x02 */}
        <div className="lg:col-span-2 space-y-12">
          <section className="glass-card-elevated p-12 border-pitch-green/20 bg-navy-deep/40 relative overflow-hidden group rounded-[3rem] hud-scanline glass-edge-highlight hud-grain">
            <HudCorners color="#4ade80" opacity={0.3} size={50} />
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
              <Crosshair size={320} className="text-pitch-green group-hover:scale-110 transition-transform duration-1000" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-3xl bg-pitch-green/10 flex items-center justify-center text-pitch-green border border-pitch-green/20 shadow-2xl group-hover:shadow-gold transition">
                  <Target size={32} className="drop-shadow-glow" />
                </div>
                <div>
                  <h2 className="athletic-title text-4xl text-white italic uppercase tracking-wider drop-shadow-glow">
                    Recon <span className="text-pitch-green">Mission</span>
                  </h2>
                  <p className="text-[11px] font-black text-white/50 uppercase tracking-[0.5em] italic">Analyse du périmètre adverse par Sirchmunk</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-10 mb-14">
                <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 space-y-6 glass-edge-highlight relative overflow-hidden group/target">
                   <div className="absolute inset-0 bg-pitch-green/5 opacity-0 group-hover/target:opacity-100 transition-opacity duration-1000" />
                  <div className="text-[10px] font-black text-pitch-green uppercase tracking-widest italic flex items-center gap-2">
                    <span className="w-4 h-px bg-pitch-green" /> Cible Prioritaire
                  </div>
                  <div className="text-4xl font-black text-white italic tracking-tight drop-shadow-glow athletic-title uppercase">{sirchmunkFindings.target}</div>
                  <div className="flex items-center gap-4 pt-6">
                    <div className="px-5 py-2 rounded-xl bg-pitch-green/10 border border-pitch-green/20 text-[10px] font-black text-pitch-green italic tracking-widest shadow-inner">STALKING_ON</div>
                    <div className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black text-white/50 italic tracking-widest">ID: #RECON_094</div>
                  </div>
                </div>

                <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 space-y-6 glass-edge-highlight relative overflow-hidden group/threat">
                  <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover/threat:opacity-100 transition-opacity duration-1000" />
                  <div className="text-[10px] font-black text-gold uppercase tracking-widest italic flex items-center gap-2">
                    <span className="w-4 h-px bg-gold" /> Niveau de Menace
                  </div>
                  <div className="text-4xl font-black text-white italic tracking-tight drop-shadow-glow athletic-title uppercase">{sirchmunkFindings.threatLevel}</div>
                  <div className="flex items-center gap-4 pt-6">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-gold shadow-[0_0_10px_#d4af37]"></span>
                    </span>
                    <span className="text-[11px] font-black text-white/70 italic uppercase tracking-widest">Vigilance Couloirs Latéraux</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { label: "Synergy Delta", val: `+${sirchmunkFindings.findings.synergy_delta}%`, color: "text-pitch-green", icon: Activity, glow: "shadow-[0_0_15px_#4ade80]" },
                  { label: "Unités Scannées", val: sirchmunkFindings.findings.scouted_players, color: "text-blue-400", icon: Search, glow: "shadow-[0_0_15px_#60a5fa]" },
                  { label: "Top Formation", val: sirchmunkFindings.findings.recommended_formation, color: "text-gold", icon: Target, glow: "shadow-[0_0_15px_#d4af37]" },
                ].map((stat, i) => (
                  <div key={i} className="glass-card-elevated p-8 border-white/5 flex flex-col items-center text-center group/stat hover:bg-white/[0.05] transition bg-navy-deep/20 rounded-3xl glass-edge-highlight">
                    <stat.icon size={28} className={`${stat.color} mb-6 opacity-40 group-hover/stat:opacity-100 group-hover/stat:scale-125 transition drop-shadow-glow`} />
                    <div className={`text-2xl font-black tabular-nums text-white italic uppercase tracking-tighter mb-2 drop-shadow-glow`}>{stat.val}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 italic">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-12">
            <div className="glass-card-elevated p-12 border-white/10 bg-navy-deep/40 rounded-[3rem] space-y-10 relative overflow-hidden group glass-edge-highlight hud-grain">
              <HudCorners color="#4ade80" opacity={0.1} size={30} />
              <h3 className="athletic-title text-2xl text-white italic border-l-4 border-pitch-green pl-8 flex items-center gap-3 drop-shadow-glow">
                <Target size={20} className="text-pitch-green" />
                STRATEGIC_ADVISORY
              </h3>
              <p className="text-white/60 text-sm leading-relaxed italic uppercase tracking-widest font-medium">
                L&apos;analyse de l&apos;agent Sirchmunk révèle une vulnérabilité majeure sur le flanc gauche adverse lors des phases de transition.
                Il est recommandé d&apos;utiliser un <span className="text-pitch-green font-black drop-shadow-glow underline decoration-pitch-green/30 px-1">bloc haut</span> avec un pressing constant déclenché dès la perte de balle.
              </p>
              <div className="p-8 bg-pitch-green/[0.03] border border-pitch-green/20 rounded-3xl flex items-start gap-6 relative overflow-hidden group/alert">
                <div className="absolute inset-0 bg-pitch-green/5 opacity-0 group-hover/alert:opacity-100 transition-opacity" />
                <AlertCircle className="text-pitch-green shrink-0 mt-1 animate-pulse drop-shadow-glow" size={24} />
                <p className="text-[11px] font-black text-pitch-green uppercase tracking-widest leading-relaxed italic group-hover:text-white transition-colors">
                  Alerte : Le joueur n°10 adverse présente un indice de dangerosité élevé en contre-attaque. Calibration défense immédiate.
                </p>
              </div>
            </div>

            <div className="glass-card-elevated p-12 border-white/10 bg-pitch-green/[0.02] rounded-[3rem] space-y-10 relative overflow-hidden glass-edge-highlight hud-grain">
              <HudCorners color="#4ade80" opacity={0.2} size={30} />
              <h3 className="athletic-title text-2xl text-white italic border-l-4 border-gold pl-8 flex items-center gap-3 drop-shadow-glow">
                 <Zap size={20} className="text-gold" />
                 SYNERGY_RADAR
              </h3>
              <div className="flex justify-center py-4 scale-110">
                <PerformanceRadar 
                  technique={avg.technique}
                  tactique={avg.tactique}
                  physique={avg.physique}
                  mental={avg.mental}
                  size={260}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Intelligence — Axis Terminal v4.0 */}
        <div className="space-y-12">
          <IntelligencePanel data={sirchmunkFindings} />

          <section className="glass-card-elevated p-10 border-white/5 bg-navy-deep/60 shadow-3xl relative overflow-hidden group rounded-[3rem] glass-edge-highlight hud-grain">
             <HudCorners color="#d4af37" opacity={0.2} size={30} />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            
            <div className="flex items-center gap-4 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20 shadow-lg">
                <Cpu size={18} className="text-gold drop-shadow-glow" />
              </div>
              <h4 className="athletic-title text-base tracking-widest text-gold uppercase italic drop-shadow-glow">AXIS_SIGNAL_FEED</h4>
            </div>

            <div className="space-y-8 font-mono">
              {[
                { time: "14:22", msg: "Scan District 3: MISSION_COMPLETE", status: "OK" },
                { time: "12:05", msg: "Combat Grades: SQUAD_RECALIBRATED", status: "SYNC" },
                { time: "09:40", msg: "Sirchmunk Mirroring: FOO_ACTIVE", status: "WEB" },
              ].map((log, i) => (
                <div key={i} className="flex gap-6 group/log border-l-2 border-white/5 pl-4 hover:border-gold/40 transition-colors py-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] tabular-nums font-black text-white/30 uppercase tracking-tighter mb-1">{log.time}</span>
                    <span className="text-[8px] text-gold/60 font-black tracking-widest">[{log.status}]</span>
                  </div>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest italic group-hover/log:text-white transition-colors leading-relaxed">
                    {log.msg}
                  </p>
                </div>
              ))}
            </div>

            <MagneticWrapper>
              <button className="w-full mt-12 py-5 bg-white/[0.04] border border-white/10 rounded-2xl text-[10px] font-black text-white/50 uppercase tracking-[0.4em] hover:bg-gold/10 hover:text-gold hover:border-gold/40 active:scale-95 transition italic glass-edge-highlight shadow-xl">
                OPEN_TERMINAL_LOGS
              </button>
            </MagneticWrapper>
          </section>

          <section className="glass-card-elevated p-10 border-pitch-green/20 bg-pitch-green/[0.02] relative overflow-hidden group shadow-3xl rounded-[3rem] glass-edge-highlight hud-grain">
            <HudCorners color="#4ade80" opacity={0.3} size={40} />
            <div className="w-20 h-20 rounded-3xl bg-pitch-green/10 flex items-center justify-center text-pitch-green mx-auto mb-8 border border-pitch-green/20 shadow-2xl group-hover:shadow-gold transition">
              <Shield size={36} className="drop-shadow-glow" />
            </div>
            <div className="text-center">
              <h5 className="athletic-title text-xl text-white italic mb-4 tracking-widest drop-shadow-glow">QUORUM_SYNC_RATIO</h5>
              <div className="text-6xl font-black tabular-nums text-pitch-green italic tracking-tighter mb-6 drop-shadow-glow">
                {Math.round(squadData.score)}<span className="text-xl">%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div className="h-full bg-pitch-green transition shadow-[0_0_15px_#4ade80]" style={{ width: `${squadData.score}%` }} />
              </div>
              <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.6em] mt-8 italic animate-pulse">AXIS_ENCRYPTION_ACTIVE</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
