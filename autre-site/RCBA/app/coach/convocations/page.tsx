import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";

import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Clock,
  ChevronRight,
  Send,
  MoreVertical,
  Activity,
  History,
  Shield,
  Zap,
  Radio,
  Trophy
} from "lucide-react";
import Link from "next/link";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import MagneticWrapper from "@/components/MagneticWrapper";

export default async function CoachConvocationsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const db = await getDb();
  
  // 1. Fetch Coach's Team ID
  const staff = await db.get(`SELECT equipe_id FROM Staff WHERE email = ?`, [session.email]);
  const equipeId = staff?.equipe_id;

  // 2. Fetch Convocations with Evenements details
  const convocations = await db.all(`
    SELECT c.*, e.date, e.heure, e.lieu, e.adversaire, e.type, eq.nom as equipe_nom
    FROM Convocations c
    JOIN Evenements e ON c.evenement_id = e.id
    JOIN Equipes eq ON e.equipe_id = eq.id
    ${equipeId ? 'WHERE e.equipe_id = ?' : ''}
    ORDER BY e.date DESC, e.heure DESC
  `, equipeId ? [equipeId] : []);

  // 3. Dynamic Telemetry
  const stats = await db.get(`
    SELECT 
      COUNT(*) as total,
      ROUND(CAST(COUNT(CASE WHEN statut = 'présent' THEN 1 END) AS FLOAT) / NULLIF(COUNT(*), 0) * 100) as percent
    FROM ConvocationResponses cr
    JOIN Convocations c ON cr.convocation_id = c.id
    JOIN Evenements e ON c.evenement_id = e.id
    ${equipeId ? 'WHERE e.equipe_id = ?' : ''}
  `, equipeId ? [equipeId] : []);

  const latestMatch = await db.get(`
    SELECT adversaire 
    FROM Evenements 
    WHERE type = 'match' ${equipeId ? 'AND equipe_id = ?' : ''}
    ORDER BY date DESC 
    LIMIT 1
  `, equipeId ? [equipeId] : []);

  return (
    <main className="min-h-screen bg-navy-deep relative overflow-hidden hud-grain">
      
      {/* Global Neural Aura */}
      <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-pitch-green/5 blur-[200px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse" />

      <div className="container mx-auto px-6 py-16 relative z-10 space-y-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16 border-b border-white/5 relative overflow-hidden glass-edge-highlight px-8 lg:px-12">
          {/* Pitch Green Aura Glow */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pitch-green/5 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-40 animate-pulse" />
          
          <PageLabel 
            section="Staff"
            category="Opérations"
            title="Dispatch Élite"
            subtitle="Gestion stratégique des effectifs et déploiement tactique pour les prochaines échéances."
            variant="green"
            icon="coach"
          />

          <MagneticWrapper>
            <Link href="/coach/convocations/new" className="group flex items-center gap-8 bg-pitch-green text-navy-deep px-12 py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-gold transition shadow-3xl shadow-pitch-green/20 border border-pitch-green/20 active:scale-95 italic text-center glass-edge-highlight relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">INITIER_DISPATCH</span>
              <Send size={24} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 relative z-10 drop-shadow-lg" />
            </Link>
          </MagneticWrapper>
        </header>

        {/* Strategic Stats: Neural Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="glass-card-elevated p-12 border-white/5 bg-navy-deep/40 relative overflow-hidden group rounded-[3rem] glass-edge-highlight shadow-3xl">
             <HudCorners color="#ffffff" opacity={0.1} size={40} />
             <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-6 italic flex items-center gap-3">
                <Radio size={14} className="text-white/20 animate-pulse" /> TOTAL_ENVOYÉES
             </div>
             <div className="text-6xl text-white italic drop-shadow-glow group-hover:scale-105 transition duration-700">{convocations.length}</div>
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <History size={120} />
             </div>
          </div>
          
          <div className="glass-card-elevated p-12 border-pitch-green/20 bg-pitch-green/5 relative overflow-hidden group rounded-[3rem] glass-edge-highlight shadow-3xl">
             <HudCorners color="#4ade80" opacity={0.2} size={40} />
             <div className="text-[10px] font-black text-pitch-green/60 uppercase tracking-[0.5em] mb-6 italic flex items-center gap-3">
                <Shield size={14} className="text-pitch-green/40" /> CONFIRMATION_RATIO
             </div>
             <div className="text-6xl text-pitch-green italic drop-shadow-glow group-hover:scale-105 transition duration-700">{stats?.percent || 0}%</div>
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <CheckCircle2 size={120} className="text-pitch-green" />
             </div>
          </div>

          <div className="glass-card-elevated p-12 border-blue-500/10 bg-blue-500/5 relative overflow-hidden group rounded-[3rem] glass-edge-highlight shadow-3xl">
             <HudCorners color="#3b82f6" opacity={0.1} size={40} />
             <div className="text-[10px] font-black text-blue-400/60 uppercase tracking-[0.5em] mb-6 italic flex items-center gap-3">
                <Zap size={14} className="text-blue-500/40" /> DERNIER_MATCH
             </div>
             <div className="athletic-title text-3xl text-blue-400 italic drop-shadow-glow leading-tight line-clamp-1 group-hover:scale-105 transition duration-700">
                {latestMatch?.adversaire ? `VS ${latestMatch.adversaire}` : 'AUCUNE_DATA'}
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Trophy size={120} className="text-blue-500" />
             </div>
          </div>
        </div>

        {/* Convocations Feed: Mission Logs */}
        <section className="space-y-10">
          <h3 className="athletic-title text-xl flex items-center gap-4 italic text-white/70 tracking-[0.5em] uppercase font-black px-4">
            <Radio className="text-pitch-green animate-pulse" size={20} /> DISPATCH_LOGS <span className="text-white/30">NEURAL_DEPLOYS</span>
          </h3>

          <div className="space-y-6">
            {convocations.length > 0 ? convocations.map((conv: any) => (
              <div key={conv.id} className="glass-card-elevated border-white/5 bg-navy-deep/40 overflow-hidden group/item hover:bg-white/[0.05] transition duration-700 rounded-[2.5rem] glass-edge-highlight hud-scanline relative">
                <HudCorners color="#4ade80" opacity={0.05} size={30} />
                
                <div className="flex flex-col lg:flex-row">
                  {/* Visual / Date Column: Chronos Axis */}
                  <div className="lg:w-56 p-10 flex flex-col items-center justify-center bg-white/[0.03] relative overflow-hidden border-r border-white/5">
                    <div className="absolute inset-0 bg-pitch-green/[0.02] opacity-0 group-hover/item:opacity-100 transition-opacity duration-1000" />
                    <div className="text-4xl font-black text-white italic drop-shadow-glow group-hover/item:text-pitch-green transition-colors duration-700">
                      {new Date(conv.date).getDate()}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 italic mt-3">
                      {new Date(conv.date).toLocaleDateString('fr-FR', { month: 'short' })}
                    </div>
                    <div className="mt-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black text-white/40 uppercase tracking-widest italic group-hover/item:border-pitch-green/30 group-hover/item:text-pitch-green/60 transition">
                      LOG_{conv.id.slice(0, 4)}
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 p-10 lg:p-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-pitch-green/10 border border-pitch-green/20 text-[9px] font-black text-pitch-green uppercase tracking-[0.3em] italic">
                          <Shield size={12} /> {conv.type || 'MATCH_ÉLITE'}
                        </div>
                        <h3 className="athletic-title text-4xl italic text-white uppercase tracking-tight drop-shadow-glow group-hover/item:text-pitch-green transition-colors duration-700">
                          {conv.adversaire ? `RCBA_VS_${conv.adversaire.replace(' ', '_')}` : 'NEURAL_DISPATCH'}
                        </h3>
                      </div>

                      <div className="flex items-center gap-8">
                        <div className="flex flex-col text-right">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2 italic">DEPLOY_TIME</span>
                          <span className="text-lg font-black text-white uppercase tracking-tight italic flex items-center justify-end gap-3 athletic-title">
                            <Clock size={16} className="text-pitch-green" /> {conv.heure}
                          </span>
                        </div>
                        <MagneticWrapper>
                          <Link href={`/coach/convocations/${conv.id}`} className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-pitch-green hover:bg-pitch-green/10 hover:border-pitch-green/40 transition shadow-gold shadow-xl">
                            <ChevronRight size={24} className="group-hover/item:translate-x-1 transition-transform" />
                          </Link>
                        </MagneticWrapper>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="flex flex-wrap gap-12">
                        <div className="flex items-center gap-5 group/info">
                          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover/info:shadow-gold transition">
                            <MapPin size={20} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2 italic">COORDINATES</div>
                            <div className="text-sm font-black text-white uppercase tracking-widest italic">{conv.lieu || 'STADE_MUNICIPAL, BÙ'}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 group/info">
                          <div className="w-12 h-12 rounded-2xl bg-pitch-green/10 border border-pitch-green/20 flex items-center justify-center text-pitch-green group-hover/info:shadow-gold transition">
                            <Users size={20} />
                          </div>
                          <div>
                            <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2 italic">SQUAD_UNIT</div>
                            <div className="text-sm font-black text-white uppercase tracking-widest italic">{conv.equipe_nom}</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 md:pt-0">
                        <div className="flex -space-x-4">
                          {[1, 2, 3, 4, 5].map((i: number) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-navy-deep bg-navy-light flex items-center justify-center text-[10px] font-black text-white/60 shadow-xl relative overflow-hidden group/avatar">
                              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                              JD
                            </div>
                          ))}
                          <div className="w-10 h-10 rounded-full border-2 border-navy-deep bg-pitch-green/20 backdrop-blur-md flex items-center justify-center text-[10px] font-black text-pitch-green shadow-xl shadow-pitch-green/20 relative z-10 glass-edge-highlight">
                            +12
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-40 text-center glass-card-elevated border-white/5 bg-navy-deep/20 rounded-[4rem] relative overflow-hidden">
                <HudCorners color="#ffffff" opacity={0.05} size={60} />
                <div className="mb-10 relative inline-block">
                  <div className="absolute inset-0 bg-pitch-green/20 blur-[80px] rounded-full animate-pulse"></div>
                  <Users size={80} className="mx-auto text-white relative z-10 opacity-20" />
                </div>
                <p className="athletic-title text-3xl text-white italic uppercase tracking-[0.2em] drop-shadow-glow">AUCUN_LOG_DÉPLOIEMENT</p>
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-white/30 mt-6 italic max-w-sm mx-auto leading-relaxed">
                  Utilisez la console RCBA Expert pour initialiser de nouveaux dispatch de mission.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* Strategic Footer */}
      <footer className="mt-40 border-t border-white/5 pt-24 pb-16 opacity-30 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center space-y-4">
          <div className="athletic-title text-2xl text-white italic drop-shadow-glow uppercase tracking-[0.3em]">Racing_Club_Bù_Abondant</div>
          <div className="text-[10px] font-black uppercase tracking-[1em] text-pitch-green italic">AXIS_DISPATCH_PROTOCOL v4.0.0_ELITE</div>
        </div>
      </footer>
    </main>
  );
}
