import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getPlayerCategoryByAge } from "@/lib/utils";
import Link from "next/link";
import PageLabel from "@/components/PageLabel";
import { 
  TrendingUp, 
  Calendar, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  Zap, 
  Play, 
  Dumbbell, 
  Activity,
  ChevronRight,
  UserCheck,
  Radar,
  Cpu,
  Network,
  Database,
  ArrowUpRight,
  Layers,
  Brain,
  Target
 } from "lucide-react";
import PerformanceRadar from "@/components/PerformanceRadar";
import MagneticWrapper from "@/components/MagneticWrapper";
import HudCorners from "@/components/HudCorners";
import AuraCognitiveEngine from "@/components/AuraCognitiveEngine";
import { RPETracker } from "@/components/RPETracker";
import PerformanceTrendsChart from "@/components/PerformanceTrendsChart";
import DashboardClientWrapper, { MotionSection } from "@/components/DashboardClientWrapper";
import { motion } from "framer-motion";
import { getPlayerRPEHistory, getPlayerRPETrends } from "@/lib/performance-actions";
import PerformanceRangeSelector from "@/components/PerformanceRangeSelector";


export default async function ParentsDashboard({
  searchParams,
}: {
  searchParams: { days?: string };
}) {
  const session = await getSession();

  if (!session || !['Parent', 'Joueur', 'Direction', 'admin', 'Admin'].includes(session.roleName.toLowerCase())) {
    redirect('/login');
  }

  const days = parseInt(searchParams.days || '14');
  const db = await getDb();
  const userData = await db.get("SELECT player_id FROM Users WHERE email = ?", [session.email]);
  let playerId = userData?.player_id;

  if (!playerId && (session.roleName === 'Direction' || session.roleName.toLowerCase() === 'admin')) {
    // Admin preview mode: pick the first available player
    const firstPlayer = await db.get("SELECT id FROM Joueurs LIMIT 1");
    if (firstPlayer) {
      playerId = firstPlayer.id;
    }
  }

  if (!playerId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/80">
          <Activity size={40} />
        </div>
        <h2 className="text-2xl font-black text-white italic uppercase tracking-widest">RCBA Expert Offline</h2>
        <p className="text-white/70 max-w-md uppercase text-[10px] font-bold tracking-wider italic">Aucun profil joueur n'est rattaché à ce compte.</p>
      </div>
    );
  }

  // Fetch relevant player data
  const player = await db.get(`
    SELECT j.*, e.nom as equipe_nom, e.categorie, 
       (CASE WHEN l.status_paiement = 'payé' THEN 1 ELSE 0 END) as paiement_effectue,
       l.documents_complets
    FROM Joueurs j
    LEFT JOIN Equipes e ON j.equipe_id = e.id
    LEFT JOIN Licences l ON j.id = l.joueur_id
    WHERE j.id = ?
  `, [playerId]);

  if (!player) {
    redirect('/login?role=parents');
  }

  // Fetch stats sequentially to avoid SQLite locking
  const attendanceRaw = await db.get(`
    SELECT COUNT(*) as total,
       SUM(CASE WHEN statut = 'présent' THEN 1 ELSE 0 END) as present
    FROM Presences
    WHERE joueur_id = ?
  `, [playerId]);

  const observations = await db.all(`
    SELECT * FROM Observations WHERE joueur_id = ? ORDER BY date DESC LIMIT 3
  `, [playerId]);

  const upcomingConvs = await db.all(`
    SELECT c.*, e.adversaire, e.date, e.lieu, cr.statut
    FROM Convocations c
    JOIN Evenements e ON c.evenement_id = e.id
    LEFT JOIN ConvocationResponses cr ON cr.convocation_id = c.id AND cr.joueur_id = ?
    WHERE e.date >= date('now')
    ORDER BY e.date ASC
    LIMIT 3
  `, [playerId]);

  const recentAttendance = await db.all(`
    SELECT p.statut, e.titre, e.date
    FROM Presences p
    JOIN Evenements e ON p.evenement_id = e.id
    WHERE p.joueur_id = ?
    ORDER BY e.date DESC
    LIMIT 5
  `, [playerId]);

  const rpeTrends = await getPlayerRPETrends(playerId, days);

  const matchStatsRaw = await db.all(`
    SELECT buts, passes, cartons_jaunes, carton_rouge, minutes_jouees
    FROM MatchStats
    WHERE joueur_id = ?
  `, [playerId]);

  const attendanceRate = attendanceRaw.total > 0 
    ? Math.round((attendanceRaw.present / attendanceRaw.total) * 100) 
    : 0;

  const matchStats = matchStatsRaw.reduce((acc: any, stat: any) => ({
    buts: acc.buts + (stat.buts || 0),
    passes: acc.passes + (stat.passes || 0),
    cartons_jaunes: acc.cartons_jaunes + (stat.cartons_jaunes || 0),
    carton_rouge: acc.carton_rouge + (stat.carton_rouge || 0),
    minutes_jouees: acc.minutes_jouees + (stat.minutes_jouees || 0),
    matchs_joues: acc.matchs_joues + 1
  }), { buts: 0, passes: 0, cartons_jaunes: 0, carton_rouge: 0, minutes_jouees: 0, matchs_joues: 0 });

  // Derive merit from aptitudes
  const avgApt = (player.aptitude_technique + player.aptitude_tactique + player.aptitude_physique + player.aptitude_mentale) / 4;
  const meritScore = Math.round(avgApt * 20);
  
  const merit = {
    merit: meritScore,
    status: meritScore >= 80 ? 'LÉGENDAIRE' : meritScore >= 60 ? 'ÉLITE' : 'STABLE',
    isTopPerformer: meritScore >= 80
  };

  return (
    <DashboardClientWrapper>
      <div className="space-y-16 pb-20 hud-grain min-h-screen relative overflow-hidden">
        {/* Dynamic Atmosphere Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/5 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-30" />

        <div className="relative">
          <PageLabel 
            section="Parents"
            category="Matrix Analytics"
            title="Neural Monitoring"
            subtitle="Système de Performance Agentique RCBA v4.0. Observation en temps réel des flux de données athlétiques."
            icon="parent"
            variant="purple"
          />
          <div className="absolute top-0 right-0 p-8 hidden lg:block">
            <div className="px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl glass-edge-highlight flex items-center gap-4 shadow-2xl">
              <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse shadow-[0_0_15px_#c084fc]" />
              <span className="text-[10px] font-black text-purple-300 uppercase tracking-[0.2em] italic">Parental Oversight Active</span>
              <div className="w-[1px] h-4 bg-white/10" />
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">NODE_ID: 0x{playerId.toString(16).toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* High-Fidelity Profile Header — Elite v4.0 */}
        <MotionSection delay={0.1}>
          <div className="relative group">
            <div className="absolute inset-0 bg-purple-500/5 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-10 bg-navy-deep/60 border border-white/10 p-10 lg:p-12 rounded-[3.5rem] backdrop-blur-2xl transition duration-700 shadow-4xl overflow-hidden hud-scanline glass-edge-highlight">
              <HudCorners color="#c084fc" opacity={0.3} size={40} />
              
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="relative">
                  <div className="w-28 h-28 rounded-[2.5rem] bg-purple-500/10 border-2 border-purple-500/40 flex items-center justify-center text-4xl font-black text-purple-300 shadow-[0_0_40px_rgba(168,85,247,0.2)] group-hover:scale-110 transition-transform duration-700 overflow-hidden relative">
                    {player.photo_url ? (
                      <img src={player.photo_url} alt={`${player.prenom} ${player.nom}`} className="w-full h-full object-cover absolute inset-0" />
                    ) : (
                      <>{player.prenom[0]}{player.nom[0]}</>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2.5 rounded-xl bg-navy-deep border border-purple-500/40 text-purple-400 shadow-lg">
                    <ShieldCheck size={20} />
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center gap-6 justify-center md:justify-start mb-4">
                    <h2 className="text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tighter athletic-title athletic-skew leading-none drop-shadow-glow">
                      {player.prenom} <span className="text-purple-400">{player.nom}</span>
                    </h2>
                    <div className="px-4 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-300 uppercase tracking-widest italic shadow-lg">PROSPECT v4.0_ELITE</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-[12px] font-bold text-white/60 uppercase tracking-[0.3em] italic">
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                      <Database size={16} className="text-purple-400" /> {player.equipe_nom || 'U12'}
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                      <Target size={16} className="text-purple-400" /> {player.poste || 'PIVOT'}
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                      <Activity size={16} className="text-purple-400" /> {getPlayerCategoryByAge(player.date_naissance)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 w-full md:w-auto relative z-10">
                <div className={`flex items-center justify-between gap-8 px-10 py-6 rounded-[2.5rem] border transition duration-700 glass-edge-highlight ${
                  (player.paiement_effectue && player.documents_complets) 
                    ? 'bg-pitch-green/10 border-pitch-green/20 ring-1 ring-pitch-green/20 shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)]' 
                    : 'bg-rose-500/5 border-rose-500/20'
                }`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-1 italic">Dossier Licence</span>
                    <span className={`text-[15px] font-black uppercase tracking-widest italic ${
                      (player.paiement_effectue && player.documents_complets) ? 'text-pitch-green drop-shadow-glow' : 'text-rose-400 animate-pulse'
                    }`}>
                      {(player.paiement_effectue && player.documents_complets) ? 'MODÈLE_OPÉRATIONNEL' : 'ACTION_REQUISE'}
                    </span>
                  </div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-2xl ${
                    (player.paiement_effectue && player.documents_complets) 
                      ? 'bg-pitch-green/10 border-pitch-green/20 text-pitch-green' 
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse'
                  }`}>
                    {(player.paiement_effectue && player.documents_complets) ? <ShieldCheck size={28} className="drop-shadow-glow" /> : <Zap size={28} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionSection>

        {/* Neural KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'Assiduité Engine', val: `${attendanceRate}%`, icon: Activity, color: '#4ade80', status: 'SYNCHRONISÉ' },
            { label: 'Synergy Pulse', val: `${meritScore}%`, icon: Network, color: '#c084fc', status: merit.status },
            { label: 'Aptitude Vector', val: player.aptitude_technique?.toFixed(1) || '0.0', icon: Cpu, color: '#60a5fa', status: 'STABLE' },
            { label: 'Neural Activity', val: recentAttendance.length * 20 + '%', icon: Brain, color: '#f472b6', status: 'ACTIVE' }
          ].map((kpi, i) => (
            <MotionSection key={i} delay={0.2 + i * 0.1}>
              <div className="relative group h-full">
                <div className="absolute inset-0 bg-white/[0.02] border border-white/10 rounded-[2rem] backdrop-blur-xl group-hover:bg-white/[0.05] group-hover:-translate-y-2 transition duration-500 shadow-3xl p-8 overflow-hidden h-full glass-card-elevated glass-edge-highlight">
                  <HudCorners color={kpi.color} opacity={0.3} size={24} />
                  <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="p-3.5 rounded-[1.25rem] bg-white/5 border border-white/5 text-white/70 group-hover:text-white transition-colors shadow-inner">
                      <kpi.icon size={24} style={{ color: kpi.color }} className="drop-shadow-glow" />
                    </div>
                    <div className="text-[12px] font-mono text-white/20 group-hover:text-white/40 duration-700 italic">PACK_0x0{i+1}</div>
                  </div>
                  <div className="space-y-2 relative z-10">
                    <div className="text-[11px] font-black text-white/50 uppercase tracking-[0.4em] italic mb-2 leading-none">{kpi.label}</div>
                    <div className="text-5xl font-black text-white italic tracking-tighter drop-shadow-glow" style={{ textShadow: `0 0 25px ${kpi.color}55` }}>{kpi.val}</div>
                  </div>
                  <div className="mt-8 flex items-center gap-3 relative z-10 bg-white/[0.03] w-fit px-4 py-1.5 rounded-full border border-white/5">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: kpi.color, boxShadow: `0 0 10px ${kpi.color}` }} />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] italic">{kpi.status}</span>
                  </div>

                  {/* Matrix Scanline Overlay — Elite v4.0 */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.05] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-scanline" />
                  </div>
                </div>
              </div>
            </MotionSection>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Neural Analysis Column */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Match Stats Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-6">
                <h3 className="athletic-title athletic-skew text-4xl flex items-center gap-6 italic text-white font-black uppercase tracking-tight">
                  <Target className="text-gold" size={36} /> IMPACT <span className="text-gold opacity-60">MATCH</span>
                </h3>
                <div className="px-4 py-1.5 rounded-xl bg-gold/10 border border-gold/20 text-[10px] font-black text-gold uppercase tracking-widest italic shadow-lg">DONNÉES OFFICIELLES COACH</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { l: 'MATCHS', v: matchStats.matchs_joues, c: 'text-white' },
                  { l: 'BUTS', v: matchStats.buts, c: 'text-pitch-green' },
                  { l: 'PASSES', v: matchStats.passes, c: 'text-blue-400' },
                  { l: 'MINUTES', v: matchStats.minutes_jouees, c: 'text-purple-400' },
                  { l: 'CJ/CR', v: `${matchStats.cartons_jaunes}/${matchStats.carton_rouge}`, c: 'text-rose-400' }
                ].map((stat, idx) => (
                  <div key={idx} className="glass-card-elevated p-6 border-white/5 bg-navy-deep/60 rounded-[2rem] flex flex-col items-center justify-center gap-2 group hover:bg-white/[0.05] transition duration-500 shadow-3xl hud-scanline">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">{stat.l}</span>
                    <span className={`text-4xl font-black italic ${stat.c} drop-shadow-glow`}>{stat.v}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="space-y-8">
              <div className="flex items-center justify-between px-6">
                <h3 className="athletic-title athletic-skew text-4xl flex items-center gap-6 italic text-white font-black uppercase tracking-tight">
                  <Network className="text-purple-400 animate-pulse" size={36} /> COGNITIVE <span className="text-purple-400 opacity-60">CORE</span>
                </h3>
                <div className="flex gap-3">
                  <div className="px-4 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[10px] font-black text-purple-300 uppercase tracking-widest italic shadow-lg">RAG-SYNAPSE v4.0_READY</div>
                </div>
              </div>
              
              <div className="group relative glass-edge-highlight rounded-[3.5rem] overflow-hidden shadow-4xl border border-white/5 bg-navy-deep/40 min-h-[500px]">
                <HudCorners color="#c084fc" opacity={0.2} size={50} />
                <AuraCognitiveEngine player={player} />
              </div>
            </section>

            {/* Detailed Observations Grid — Elite v4.0 */}
            <section className="space-y-10">
              <div className="flex items-center justify-between px-6">
                <h3 className="athletic-title athletic-skew text-4xl flex items-center gap-6 italic text-white font-black uppercase tracking-tight">
                  <MessageSquare className="text-purple-400" size={36} /> NEURAL <span className="text-purple-400 opacity-60">INSIGHTS</span>
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-10">
                {observations.length > 0 ? observations.map((obs: any, i: number) => (
                  <MotionSection key={i} delay={0.2 + i * 0.1}>
                    <div className="glass-card-elevated p-12 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition relative group overflow-hidden shadow-3xl rounded-[3rem] hud-scanline glass-edge-highlight hud-grain">
                      <HudCorners color={i === 0 ? "#c084fc" : "#ffffff"} opacity={0.3} size={30} />
                      <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                          <div className={`w-2.5 h-2.5 rounded-full ${i === 0 ? 'bg-purple-400 animate-pulse shadow-[0_0_15px_#c084fc]' : 'bg-white/20'}`} />
                          <span className="text-[11px] font-black uppercase text-white/40 tracking-[0.4em] italic leading-none">Observation #0x0{i+1}</span>
                        </div>
                        <span className="text-[10px] font-mono text-white/30 italic">{new Date(obs.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>
                      </div>
                      <p className="text-[19px] text-white/90 leading-relaxed italic font-bold group-hover:text-purple-300 transition-colors tracking-tight mb-10 athletic-title uppercase">
                        "{obs.contenu}"
                      </p>
                      <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/30 italic flex items-center gap-3">
                          <Layers size={14} className="text-purple-500/40" /> Staff Intelligence Data
                        </div>
                        <ArrowUpRight size={18} className="text-white/20 group-hover:text-purple-400 group-hover:scale-125 transition" />
                      </div>
                    </div>
                  </MotionSection>
                )) : (
                  <div className="col-span-2 py-40 text-center border-2 border-dashed border-white/5 rounded-[4rem] opacity-20 hud-grain bg-white/[0.01]">
                    <Activity size={80} className="mx-auto mb-8 text-white/40" />
                    <p className="text-[13px] font-black uppercase tracking-[0.8em] italic text-white/60">En attente de flux énergétique staff</p>
                  </div>
                )}
              </div>

              <MagneticWrapper>
                <Link href="/parents/reports" className="group/btn w-full bg-purple-500/5 border border-purple-500/20 hover:bg-purple-500/10 hover:border-purple-500/50 rounded-[2.5rem] p-10 flex items-center justify-between transition shadow-4xl relative overflow-hidden glass-edge-highlight">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-6 relative z-10 px-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-2xl">
                      <Database size={24} />
                    </div>
                    <span className="text-[14px] font-black text-purple-300 group-hover:text-white uppercase tracking-[0.6em] italic">DÉPLOIEMENT_ARCHIVES_COMPLÈTES</span>
                  </div>
                  <ChevronRight size={32} className="text-purple-400 group-hover:text-white group-hover:translate-x-4 transition relative z-10" />
                </Link>
              </MagneticWrapper>
            </section>

            {/* Performance Feedback — RPE Tracking & Trends */}
            <section className="space-y-10">
              <div className="flex items-center justify-between px-6">
                <h3 className="athletic-title athletic-skew text-4xl flex items-center gap-6 italic text-white font-black uppercase tracking-tight">
                  <Zap className="text-pitch-green animate-pulse" size={36} /> PERFORMANCE <span className="text-pitch-green opacity-60">PULSE</span>
                </h3>
                <PerformanceRangeSelector />
              </div>
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div className="flex justify-center">
                  <RPETracker />
                </div>
                <PerformanceTrendsChart data={rpeTrends} title={`MA DYNAMIQUE ATHLÉTIQUE (${days} JOURS)`} variant="green" />
              </div>
            </section>
          </div>

          {/* Sidebar Intelligence — Elite v4.0 */}
          <div className="lg:col-span-4 space-y-12">
            {/* Performance Radar */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-6">
                <h3 className="athletic-title athletic-skew text-3xl flex items-center gap-5 italic text-white font-black uppercase tracking-tight">
                  <Radar className="text-purple-400" size={30} /> PERFORMANCE <span className="text-purple-400 opacity-60">VECTOR</span>
                </h3>
              </div>
              <div className="glass-card-elevated p-12 border-white/10 bg-navy-deep/40 flex flex-col items-center justify-center rounded-[3.5rem] shadow-4xl group relative overflow-hidden h-[550px] glass-edge-highlight hud-grain">
                <HudCorners color="#c084fc" opacity={0.3} size={40} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(168,85,247,0.08),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <div className="relative z-10 scale-95 transition-transform duration-1000 group-hover:scale-105">
                  <PerformanceRadar 
                    technique={player.aptitude_technique}
                    tactique={player.aptitude_tactique}
                    physique={player.aptitude_physique}
                    mental={player.aptitude_mentale}
                    size={380}
                  />
                </div>
                
                <div className="mt-14 w-full grid grid-cols-2 gap-5 px-4 text-center relative z-10">
                  {[
                    { l: 'TECH', v: player.aptitude_technique, c: 'text-purple-400' },
                    { l: 'TACT', v: player.aptitude_tactique, c: 'text-blue-400' },
                    { l: 'PHYS', v: player.aptitude_pitch, c: 'text-pitch-green' },
                    { l: 'MENT', v: player.aptitude_mentale, c: 'text-rose-400' }
                  ].map((p, i) => (
                    <div key={i} className="flex justify-between items-center bg-white/[0.03] border border-white/5 p-5 rounded-[1.5rem] group/stat cursor-default glass-edge-highlight hover:bg-white/[0.06] transition-colors shadow-lg">
                      <span className="text-[11px] font-black text-white/40 uppercase tracking-widest italic leading-none">{p.l}</span>
                      <span className={`${p.c} font-black text-2xl italic tracking-tight drop-shadow-glow leading-none`}>{p.v?.toFixed(1) || '3.0'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Event Stream / Next Matchs */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-6">
                <h3 className="athletic-title athletic-skew text-3xl flex items-center gap-5 italic text-white font-black uppercase tracking-tight">
                  <Calendar className="text-purple-400" size={30} /> MISSION <span className="text-purple-400 opacity-60">CORE</span>
                </h3>
              </div>
              
              <div className="glass-card-elevated bg-navy-deep/20 border-white/10 rounded-[3.5rem] overflow-hidden flex flex-col shadow-4xl p-4 lg:p-6 gap-5 glass-edge-highlight hud-grain">
                {upcomingConvs.length > 0 ? upcomingConvs.map((conv: any, i: number) => (
                  <MagneticWrapper key={i}>
                    <Link href={`/parents/convocations/${conv.id}`} className="flex items-center gap-6 p-6 lg:p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:bg-purple-500/10 hover:border-purple-500/40 transition group/conv relative overflow-hidden glass-edge-highlight shadow-xl">
                      <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                        <ChevronRight size={48} />
                      </div>
                      <div className="w-20 h-20 bg-navy-deep rounded-[1.5rem] border border-white/10 flex flex-col items-center justify-center text-center shadow-inner group-hover/conv:border-purple-400/40 duration-500 shrink-0 relative overflow-hidden">
                        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover/conv:opacity-100 transition-opacity" />
                        <span className="text-[10px] font-black uppercase text-purple-400 italic tracking-widest leading-none mb-2 z-10">{new Date(conv.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</span>
                        <span className="text-3xl font-black text-white italic tracking-tight leading-none z-10">{new Date(conv.date).getDate()}</span>
                      </div>
                      <div className="flex-1 min-w-0 pr-6 relative z-10">
                        <div className="text-[15px] font-black text-white uppercase italic truncate tracking-tight mb-2 athletic-title">VS {conv.adversaire}</div>
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${conv.statut === 'présent' ? 'bg-pitch-green shadow-[0_0_12px_rgba(34,197,94,0.6)]' : conv.statut === 'absent' ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]' : 'bg-purple-400 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.6)]'}`} />
                          <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] italic">{conv.statut ? conv.statut.toUpperCase() : 'EN_ATTENTE_SYNC'}</span>
                        </div>
                      </div>
                    </Link>
                  </MagneticWrapper>
                )) : (
                  <div className="py-32 text-center space-y-6 opacity-20 hud-grain bg-white/[0.01] rounded-[2rem]">
                    <Activity size={50} className="mx-auto text-white/40" />
                    <p className="text-[12px] text-white uppercase font-black italic tracking-[0.5em]">AUCUN_FLUX_MISSION</p>
                  </div>
                )}

                <div className="px-4 py-2 border-t border-white/5 mt-2">
                  <Link href="/parents/convocations" className="block w-full py-4 text-center text-[11px] font-black text-white/40 uppercase tracking-[0.5em] hover:text-purple-300 transition-colors italic group/all relative">
                    OPEN_FULL_STACK_EVENT 0x0
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-purple-400 group-hover/all:w-40 transition duration-700" />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* 📡 NEURAL STATUS STREAM: FAMILY MATRIX HUD — Elite v4.0 */}
        <MotionSection delay={1.0}>
          <section className="relative mt-32 pt-24 border-t border-white/5 opacity-50 hover:opacity-100 transition duration-1000 glass-edge-highlight rounded-t-[4rem] p-12 hud-grain bg-gradient-to-b from-purple-500/[0.03] to-transparent">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-purple-400/40 uppercase tracking-[1.5em] italic select-none whitespace-nowrap">NEURAL STATUS STREAM v4.00_ELITE</div>
            <HudCorners color="#c084fc" opacity={0.3} size={40} />
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 px-10 relative z-10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-pitch-green shadow-[0_0_10px_#22c55e]" />
                    <span className="text-[11px] font-black text-white/80 uppercase tracking-widest italic">Synapse Status: <span className="text-pitch-green">SYNCHRONIZED_STABLE</span></span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc]" />
                    <span className="text-[11px] font-black text-white/80 uppercase tracking-widest italic">Data Integrity: <span className="text-purple-400 font-mono">0.9998_AXIS_SECURE</span></span>
                  </div>
                </div>
                <div className="flex-1 max-w-2xl h-[2px] bg-white/5 relative overflow-hidden rounded-full shadow-inner">
                  <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                      className="w-1/3 h-full bg-gradient-to-r from-transparent via-purple-400 to-transparent"
                  />
                </div>
                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic text-right leading-relaxed font-mono">
                  AUTH_ROLE: {session.roleName} <br /> 
                  SESSION_ID: {new Date().getTime().toString(16).toUpperCase()} <br />
                  RCBA_CLOUD_CORE_v4.0
                </div>
            </div>
          </section>
        </MotionSection>
      </div>
    </DashboardClientWrapper>
  );
}
