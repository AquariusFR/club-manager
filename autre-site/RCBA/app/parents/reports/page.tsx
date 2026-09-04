import { getSession } from "@/lib/authentication";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import { getPlayerFlashFormeHistory, getPlayerWellnessSummary } from "@/lib/performance-actions";
import { 
  ShieldCheck, 
  ChevronLeft, 
  MessageSquare,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Radar,
  Clock,
  UserCheck,
  TrendingUp as TrendIcon,
  ChevronRight,
  Database,
  ArrowUpRight,
  Brain,
  Target,
  Zap,
  Box,
  Moon,
  Flame,
  HeartPulse,
  Leaf,
  Droplets
} from "lucide-react";
import Link from "next/link";
import PerformanceRadar from "@/components/PerformanceRadar";
import ProgressionChart from "@/components/ProgressionChart";
import MagneticWrapper from "@/components/MagneticWrapper";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import DashboardClientWrapper, { MotionSection } from "@/components/DashboardClientWrapper";

export default async function PlayerReportsPage() {
  const session = await getSession();
  
  if (!session || !['Parent', 'Joueur', 'Direction', 'admin', 'Admin'].includes(session.roleName.toLowerCase())) {
    redirect('/login');
  }

  const db = await getDb();
  const user = await db.get("SELECT player_id FROM Users WHERE email = ?", [session.email]);
  const playerId = user?.player_id;

  if (!playerId) {
    redirect('/parents/dashboard');
  }

  const player = await db.get(`
    SELECT j.*, e.nom as equipe_nom, e.categorie,
       (CASE WHEN l.status_paiement = 'payé' THEN 1 ELSE 0 END) as paiement_effectue,
       l.documents_complets
    FROM Joueurs j
    LEFT JOIN Equipes e ON j.equipe_id = e.id
    LEFT JOIN Licences l ON j.id = l.joueur_id
    WHERE j.id = ?
  `, [playerId]);

  const observations = await db.all(`
    SELECT o.*, u.email as coach_email
    FROM Observations o
    JOIN Users u ON o.coach_id = u.id
    WHERE o.joueur_id = ?
    ORDER BY o.date DESC
  `, [playerId]);

  // Attendance for Engagement Badge
  const attendance = await db.get(`
    SELECT COUNT(*) as total, SUM(CASE WHEN statut = 'présent' THEN 1 ELSE 0 END) as present
    FROM Presences WHERE joueur_id = ?
  `, [playerId]);
  const attendanceRate = attendance.total > 0 ? (attendance.present / attendance.total * 100) : 100;

  // Match Stats
  const matchStatsRaw = await db.all(`
    SELECT buts, passes, cartons_jaunes, carton_rouge, minutes_jouees
    FROM MatchStats
    WHERE joueur_id = ?
  `, [playerId]);
  const matchStats = matchStatsRaw.reduce((acc: any, stat: any) => ({
    buts: acc.buts + (stat.buts || 0),
    passes: acc.passes + (stat.passes || 0),
    cartons_jaunes: acc.cartons_jaunes + (stat.cartons_jaunes || 0),
    carton_rouge: acc.carton_rouge + (stat.carton_rouge || 0),
    minutes_jouees: acc.minutes_jouees + (stat.minutes_jouees || 0),
    matchs_joues: acc.matchs_joues + 1
  }), { buts: 0, passes: 0, cartons_jaunes: 0, carton_rouge: 0, minutes_jouees: 0, matchs_joues: 0 });

  // Engagement Badge Logic
  const getEngagementBadge = (rate: number) => {
    if (rate >= 90) return { label: 'ELITE DELEGATE', color: 'text-pitch-green', bg: 'bg-pitch-green/10', border: 'border-pitch-green/20 shadow-[0_0_25px_rgba(34,197,94,0.3)]' };
    if (rate >= 75) return { label: 'TACTICAL ASYNC', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20 shadow-[0_0_25px_rgba(168,85,247,0.3)]' };
    return { label: 'ACTION_REQUIRED', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20 shadow-[0_0_25px_rgba(244,63,94,0.3)]' };
  };
  const badge = getEngagementBadge(attendanceRate);

  // Trust Score (Simulated complex metric)
  const avgAtts = ( (player.aptitude_technique || 0) + (player.aptitude_tactique || 0) + (player.aptitude_physique || 0) + (player.aptitude_mentale || 0) ) / 4;
  const trustScore = Math.min(100, (attendanceRate * 0.6 + avgAtts * 10)).toFixed(0);

  // Format data for ProgressionChart
  const chartData = observations
    .map((o: any) => ({
      date: o.date,
      tech: o.apt_technique || 3,
      tact: o.apt_tactique || 3,
      phys: o.apt_physique || 3,
      ment: o.apt_mentale || 3
    }))
    .reverse();

  // Training History & Skills tracking
  const historicSessions = await db.all(`
    SELECT e.id, e.titre, e.date, p.statut
    FROM Evenements e
    JOIN Presences p ON e.id = p.evenement_id
    WHERE p.joueur_id = ? AND e.type = 'entraînement'
    ORDER BY e.date DESC
    LIMIT 10
  `, [playerId]);

  const sessionIds = historicSessions.map((s: any) => s.id);
  let drillsPerformed = [];
  if (sessionIds.length > 0) {
    const ids = sessionIds.join(',');
    drillsPerformed = await db.all(`
      SELECT DISTINCT ex.titre, ex.categorie, ex.intensite
      FROM EventExercises ee
      JOIN Exercices ex ON ee.exercice_id = ex.id
      WHERE ee.evenement_id IN (${ids})
      LIMIT 12
    `);
  }

  const hasHistory = chartData.length >= 2;
  const latest = chartData.length > 0 ? chartData[chartData.length - 1] : { tech: 0, tact: 0, phys: 0, ment: 0 };
  const previous = hasHistory ? chartData[chartData.length - 2] : latest;
  const trend = ((latest.tech || 0) + (latest.tact || 0) + (latest.phys || 0) + (latest.ment || 0)) / 4 >= ((previous.tech || 0) + (previous.tact || 0) + (previous.phys || 0) + (previous.ment || 0)) / 4;

  // Flash Forme wellness data
  const flashFormeLogs = await getPlayerFlashFormeHistory(playerId, 14);
  const wellnessSummary = await getPlayerWellnessSummary(playerId);
  const sdiTrend = wellnessSummary?.avg_sdi !== null && wellnessSummary?.avg_sdi_prev !== null
    ? (wellnessSummary.avg_sdi >= wellnessSummary.avg_sdi_prev ? 'up' : 'down')
    : 'neutral';
  const wellnessMetrics = [
    { label: 'Sommeil', key: 'avg_sleep', icon: 'moon', color: 'text-blue-400', shadow: 'shadow-[0_0_15px_#60a5fa]' },
    { label: 'Énergie', key: 'avg_energy', icon: 'flame', color: 'text-orange-400', shadow: 'shadow-[0_0_15px_#fb923c]' },
    { label: 'Douleurs', key: 'avg_pain', icon: 'heart', color: 'text-rose-400', shadow: 'shadow-[0_0_15px_#f43f5e]' },
    { label: 'Sérénité', key: 'avg_stress', icon: 'leaf', color: 'text-pitch-green', shadow: 'shadow-[0_0_15px_#22c55e]' },
    { label: 'Nutrition', key: 'avg_nutrition', icon: 'droplets', color: 'text-cyan-400', shadow: 'shadow-[0_0_15px_#22d3ee]' },
  ];
  const getSdiColor = (score: number) => score >= 75 ? 'text-pitch-green' : score >= 50 ? 'text-gold' : 'text-rose-400';

  return (
    <DashboardClientWrapper>
      <div className="max-w-screen-2xl mx-auto space-y-20 pb-20 hud-grain relative min-h-screen">
        {/* Atmosphere */}
        <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-purple-500/5 blur-[200px] rounded-full pointer-events-none opacity-40 translate-x-1/3 -translate-y-1/3" />
        
        <div className="relative">
          <Link href="/parents/dashboard" className="flex items-center gap-3 text-white/40 hover:text-purple-400 transition-colors uppercase font-black text-[10px] tracking-[0.5em] mb-10 group italic">
            <ChevronLeft size={20} className="group-hover:-translate-x-2 transition-transform" /> Retour_Dashboard
          </Link>
          
          <PageLabel 
            section="Parents"
            category="Neural Records"
            title="Dossier Analyse v4.0"
            subtitle={`Archive haute fidélité des vecteurs de performance pour ${player.prenom} ${player.nom}. Observation cryptée.`}
            variant="purple"
            icon="parent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Sidebar: Neural Snapshot — Elite v4.0 */}
          <div className="lg:col-span-4 space-y-12">
            <MotionSection delay={0.1}>
              <div className="glass-card-elevated p-12 border-white/5 bg-navy-deep/60 flex flex-col items-center relative overflow-hidden group shadow-5xl rounded-[3.5rem] hud-scanline glass-edge-highlight">
                <HudCorners color="#c084fc" opacity={0.4} size={50} />
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                
                {/* Engagement Badge — Elite v4.0 */}
                <div className={`absolute top-10 left-10 px-6 py-2.5 rounded-2xl border ${badge.bg} ${badge.border} ${badge.color} text-[10px] font-black uppercase tracking-[0.4em] italic shadow-gold backdrop-blur-3xl shadow-3xl select-none`}>
                  {badge.label}
                </div>

                <h3 className="text-[11px] font-black uppercase tracking-[0.7em] text-white/40 mb-16 mt-16 italic leading-none">NEURAL_CORE_MAPPING</h3>
                
                <div className="relative shadow-gold group-hover:scale-105 transition-transform duration-1000 cursor-default">
                  <PerformanceRadar 
                    technique={player.aptitude_technique || 3}
                    tactique={player.aptitude_tactique || 3}
                    physique={player.aptitude_physique || 3}
                    mental={player.aptitude_mentale || 3}
                    size={380}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(168,85,247,0.1),transparent_70%)] pointer-events-none animate-pulse" />
                </div>

                <div className="mt-16 space-y-8 w-full bg-white/[0.02] p-12 rounded-[3rem] border border-white/5 backdrop-blur-md shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
                  {[
                    { label: 'Technique', val: player.aptitude_technique || 3, color: 'text-purple-400', shadow: 'shadow-[0_0_15px_#c084fc]' },
                    { label: 'Tactique', val: player.aptitude_tactique || 3, color: 'text-blue-400', shadow: 'shadow-[0_0_15px_#60a5fa]' },
                    { label: 'Physique', val: player.aptitude_physique || 3, color: 'text-pitch-green', shadow: 'shadow-[0_0_15px_#22c55e]' },
                    { label: 'Mental', val: player.aptitude_mentale || 3, color: 'text-rose-400', shadow: 'shadow-[0_0_15px_#f43f5e]' }
                  ].map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group/row">
                      <span className="text-[12px] font-black uppercase text-white/50 tracking-[0.4em] italic group-hover/row:text-white transition duration-500 leading-none">{item.label}</span>
                      <div className="flex gap-2.5 bg-navy-deep/40 p-3 rounded-2xl border border-white/5 shadow-inner">
                        {[1, 2, 3, 4, 5].map((s: number) => (
                          <div key={s} className={`w-2.5 h-5 rounded-full transition duration-700 ${s <= (item.val || 0) ? `bg-current ${item.color} ${item.shadow}` : 'bg-white/5'}`} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust Score Gauge — Elite v4.0 */}
                <div className="mt-12 w-full glass-card border-white/10 p-10 flex flex-col gap-10 group/trust hover:bg-white/[0.04] transition duration-700 shadow-4xl overflow-hidden rounded-[3rem] relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
                  <div className="flex items-center justify-between gap-8 relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 relative overflow-hidden shadow-3xl group-hover:rotate-12 transition-transform duration-700">
                        <ShieldCheck className="relative z-10" size={32} />
                        <div className="absolute inset-0 bg-purple-500/10 animate-pulse" />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white/50 uppercase tracking-[0.5em] mb-1 italic leading-none">TRUST_INDEX</div>
                        <div className="text-3xl font-black text-white italic tracking-[0.2em] relative overflow-hidden uppercase">CORE_<span className="text-purple-400 drop-shadow-glow">{trustScore}%</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden shadow-inner relative z-10">
                    <div 
                        style={{ width: `${trustScore}%` }}
                        className="bg-purple-500 h-full shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse transition duration-1000" 
                    />
                  </div>
                </div>
              </div>
            </MotionSection>

            <MotionSection delay={0.3}>
              <div className="glass-card-elevated p-12 border-white/5 bg-navy-deep/60 hover:bg-white/[0.03] transition relative overflow-hidden group shadow-5xl rounded-[3.5rem] hud-scanline glass-edge-highlight">
                <HudCorners color="#c084fc" opacity={0.3} size={40} />
                <Radar className="absolute -bottom-16 -right-16 text-white/5 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-1000" size={200} />
                <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-purple-400 mb-12 flex items-center gap-5 italic leading-none">
                  <Radar size={22} className="shadow-gold" /> ACTIVITÉ_NEURALE_RÉCENTE
                </h4>
                <div className="grid grid-cols-2 gap-6 relative z-10">
                  {drillsPerformed.length > 0 ? drillsPerformed.slice(0, 10).map((drill: any, idx: number) => (
                    <div key={idx} className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] hover:border-purple-500/30 transition flex flex-col gap-4 group/drill cursor-default shadow-xl glass-edge-highlight relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] to-transparent opacity-0 group-hover/drill:opacity-100 transition-opacity" />
                      <div className="text-[12px] font-black text-white uppercase tracking-tight italic truncate group-hover:text-purple-300 transition-colors relative z-10 athletic-title uppercase">{drill.titre}</div>
                      <div className="text-[9px] text-white/40 uppercase font-black tracking-widest italic group-hover:text-white/60 transition-colors relative z-10 uppercase">{drill.categorie}</div>
                    </div>
                  )) : (
                    <div className="col-span-2 text-center py-20 opacity-20 space-y-6">
                      <Activity size={60} className="mx-auto animate-pulse" />
                      <p className="text-[12px] uppercase font-black tracking-[0.5em] italic">Data Synchronization Active</p>
                    </div>
                  )}
                </div>
              </div>
            </MotionSection>
          </div>

          {/* Main Content: Evolution & Observation Timeline — Elite v4.0 */}
          <div className="lg:col-span-8 space-y-24">
            
            {/* Match Stats Section */}
            <section className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 px-6 relative">
                <div className="flex items-center gap-8">
                  <div className="p-6 bg-gold/10 border border-gold/20 rounded-[2rem] text-gold shadow-4xl group hover:rotate-12 transition-transform duration-700">
                    <Target size={40} className="shadow-gold" />
                  </div>
                  <div>
                    <h2 className="athletic-title text-4xl lg:text-5xl tracking-[0.2em] italic uppercase font-black text-white">IMPACT_<span className="text-gold opacity-60">MATCH</span></h2>
                    <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] italic mt-2 leading-none uppercase">Statistiques Officielles Coach</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {[
                  { l: 'MATCHS', v: matchStats.matchs_joues, c: 'text-white' },
                  { l: 'BUTS', v: matchStats.buts, c: 'text-pitch-green' },
                  { l: 'PASSES', v: matchStats.passes, c: 'text-blue-400' },
                  { l: 'MINUTES', v: matchStats.minutes_jouees, c: 'text-purple-400' },
                  { l: 'CJ/CR', v: `${matchStats.cartons_jaunes}/${matchStats.carton_rouge}`, c: 'text-rose-400' }
                ].map((stat, idx) => (
                  <div key={idx} className="glass-card-elevated p-8 border-white/5 bg-navy-deep/60 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group hover:bg-white/[0.05] transition duration-500 shadow-3xl hud-scanline">
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/40 italic">{stat.l}</span>
                    <span className={`text-5xl font-black athletic-title italic ${stat.c} drop-shadow-glow`}>{stat.v}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Progression Chart Section */}
            <section className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 px-6 relative">
                <div className="flex items-center gap-8">
                  <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-[2rem] text-purple-400 shadow-4xl group hover:rotate-12 transition-transform duration-700">
                    <TrendingUp size={40} className="shadow-gold" />
                  </div>
                  <div>
                    <h2 className="athletic-title text-4xl lg:text-5xl tracking-[0.2em] italic uppercase font-black text-white">ANALYSE_DE_<span className="text-purple-400 opacity-60">PROGRESSION</span></h2>
                    <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] italic mt-2 leading-none uppercase">Flux Matriciel RCBA — Optin: 25/26_ELITE</p>
                  </div>
                </div>

                {hasHistory && (
                  <div className="flex flex-col md:items-end gap-3 group cursor-default active:scale-95 transition-transform shrink-0">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic leading-none mb-1 uppercase">TENDANCE_PRÉDICTIVE</span>
                    <div className={`flex items-center gap-6 px-10 py-4 rounded-[1.5rem] text-[13px] font-black uppercase tracking-[0.1em] border transition shadow-4xl italic athletic-title ${
                      trend ? 'bg-pitch-green/10 border-pitch-green/30 text-pitch-green shadow-[0_0_30px_rgba(34,197,94,0.2)]' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}>
                      {trend ? <ArrowUp size={20} className="animate-bounce" /> : <ArrowDown size={20} />}
                      VECTEUR : {trend ? 'ASCENDANT' : 'STABLE_CORE'}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-purple-500/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
                <div className="glass-card-elevated bg-navy-deep/60 border-white/10 p-10 lg:p-14 animate-in fade-in zoom-in-95 duration-1000 shadow-5xl rounded-[4rem] overflow-hidden hud-scanline glass-edge-highlight">
                  <HudCorners color="#c084fc" opacity={0.3} size={60} />
                  <ProgressionChart data={chartData} />
                </div>
              </div>
            </section>

            {/* Observations Timeline — Elite v4.0 */}
            <section className="space-y-16">
              <div className="flex items-center gap-8 mb-12 px-6">
                <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-[2rem] text-purple-400 shadow-4xl">
                  <MessageSquare size={40} className="shadow-gold" />
                </div>
                <div>
                  <h2 className="athletic-title text-4xl lg:text-5xl italic uppercase font-black tracking-[0.2em] text-white">ARCHIVES_<span className="text-purple-400 opacity-60">OBSERVATIONS</span></h2>
                  <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] italic mt-2 leading-none uppercase">Intelligence Tactique — Protocol de Transmission Scellé</p>
                </div>
              </div>

              <div className="relative border-l-2 border-dashed border-white/10 ml-12 lg:ml-24 pl-16 lg:pl-28 space-y-24 py-12">
                <div className="absolute top-0 -left-1.5 w-3 h-3 bg-purple-500 rounded-full shadow-gold shadow-[0_0_15px_#c084fc]" />
                <div className="absolute bottom-0 -left-1.5 w-3 h-3 bg-purple-500 rounded-full opacity-20" />

                {observations.length > 0 ? observations.map((obs: any, i: number) => (
                  <div key={i} className="relative group/obs animate-in fade-in slide-in-from-left-8 transition duration-1000 hover:translate-x-4">
                    {/* Marker Node — Elite v4.0 */}
                    <div className="absolute -left-[108px] lg:-left-[162px] top-8 w-16 h-16 rounded-[1.5rem] bg-navy-deep border border-white/10 flex items-center justify-center z-10 transition duration-700 group-hover/obs:scale-125 group-hover/obs:border-purple-400 shadow-4xl group-hover/obs:shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                      <CheckCircle2 size={32} className="text-white/40 group-hover/obs:text-purple-400 transition-colors duration-500 drop-shadow-glow" />
                      <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover/obs:opacity-100 transition-opacity rounded-[1.5rem]" />
                    </div>
                    
                    <div className="glass-card-elevated p-12 lg:p-16 border-white/5 bg-navy-deep/60 group-hover/obs:bg-white/[0.04] group-hover/obs:border-purple-500/20 transition duration-700 shadow-5xl relative overflow-hidden rounded-[4rem] hud-scanline glass-edge-highlight hud-grain">
                      <HudCorners color={i === 0 ? "#c084fc" : "#444"} opacity={i === 0 ? 0.4 : 0.2} size={45} />
                      <div className="absolute top-0 left-0 w-2 h-0 bg-purple-500 group-hover/obs:h-full transition duration-1000" />
                      <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-500/5 blur-[100px] rounded-full opacity-0 group-hover/obs:opacity-100 transition-opacity duration-1000" />

                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-10 relative z-10">
                        <div className="flex items-center gap-8">
                          <div className="w-16 h-20 bg-navy-deep border border-white/10 rounded-[1.25rem] flex flex-col items-center justify-center text-center shadow-inner group-hover/obs:border-purple-400/40 transition-colors duration-700 relative overflow-hidden">
                            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover/obs:opacity-100 transition-opacity" />
                            <span className="text-[10px] font-black text-purple-400/80 uppercase tracking-widest italic z-10 leading-none mb-1.5">{new Date(obs.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}</span>
                            <span className="text-3xl font-black text-white athletic-title italic z-10 tracking-tight leading-none">{new Date(obs.date).getDate()}</span>
                          </div>
                          <div>
                            <span className="text-[13px] font-black uppercase tracking-[0.5em] text-white/40 italic block mb-3 leading-none uppercase">PROTOCOL_RECORD_NODE #0x{observations.length - i}</span>
                            <div className="flex items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-purple-400/40 group-hover/obs:animate-pulse" />
                              <span className="text-[11px] font-black text-white/70 uppercase tracking-[0.3em] italic">{new Date(obs.date).toLocaleDateString('fr-FR', { weekday: 'long' }).toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Attribute Snapshot Grid — Elite v4.0 */}
                        <div className="flex gap-5 bg-navy-deep/60 p-5 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-4xl relative overflow-hidden group/attr glass-edge-highlight">
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                          {[
                            { l: 'TECH', v: obs.apt_technique || 3, c: 'text-purple-400' },
                            { l: 'TACT', v: obs.apt_tactique || 3, c: 'text-blue-400' },
                            { l: 'PHYS', v: obs.apt_physique || 3, c: 'text-pitch-green' },
                            { l: 'MENT', v: obs.apt_mentale || 3, c: 'text-rose-400' }
                          ].map((a: any, idx: number) => (
                            <div key={idx} className="flex flex-col items-center min-w-[65px] h-full p-4 rounded-2xl group-hover/obs:bg-white/[0.04] transition duration-500">
                              <span className="text-[9px] font-black text-white/50 leading-none mb-4 tracking-[0.2em] uppercase italic transition-colors leading-none">{a.l}</span>
                              <span className={`text-2xl font-black athletic-title italic ${a.c} drop-shadow-glow tracking-tight leading-none`}>{a.v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative px-14 py-12 bg-white/[0.02] border border-white/5 rounded-[3.5rem] overflow-hidden group/text backdrop-blur-2xl shadow-inner active:scale-[0.99] transition-transform duration-500 glass-edge-highlight group/log">
                        <MessageSquare className="absolute top-10 left-10 text-white/[0.02] group-hover/log:text-purple-500/5 transition-colors duration-1000 group-hover:scale-110" size={120} />
                        <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-bold italic tracking-tight relative z-10 pr-10 font-body uppercase text-justify">
                          "{obs.contenu}"
                        </p>
                      </div>
                      
                      <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="flex items-center gap-8 group/staff cursor-default">
                          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xl font-black shadow-4xl group-hover/staff:rotate-12 group-hover/staff:scale-110 transition duration-500 relative overflow-hidden">
                            <div className="relative z-10">{obs.coach_email ? obs.coach_email[0].toUpperCase() : 'S'}</div>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover/staff:opacity-100 transition-opacity" />
                          </div>
                          <div className="space-y-2">
                            <div className="text-[12px] text-white font-black uppercase tracking-[0.4em] italic group-hover/staff:text-purple-300 transition-colors leading-none uppercase">ELITE_STAFF_SYNC_ACTIVE</div>
                            <div className="text-[10px] text-white/40 uppercase font-bold tracking-[0.5em] italic leading-tight">
                              HASH: {obs.coach_email ? obs.coach_email.split('@')[0].toUpperCase() : 'EXPERT'}@CORE.RCBA
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 opacity-40 group-hover/obs:opacity-100 transition duration-700">
                          <UserCheck size={20} className="text-purple-400 drop-shadow-glow" />
                          <span className="text-[10px] font-black text-white uppercase tracking-[0.8em] italic select-none">DATA_AUTHENTICATED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-40 border-4 border-dashed border-white/[0.03] rounded-[6rem] text-center bg-white/[0.01] opacity-20 space-y-12 animate-pulse hud-grain">
                    <Activity size={120} className="mx-auto text-white/40" />
                    <div>
                      <p className="text-white text-3xl font-black uppercase tracking-[1em] italic leading-loose select-none">HISTORIQUE_RCBA_ÉTEINT</p>
                      <p className="text-white/60 text-[12px] font-bold uppercase tracking-[0.8em] italic select-none">En attente de transmission de données du noyau staff</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* ===== FLASH FORME HEALTH LOG ===== */}
        <MotionSection delay={0.5}>
          <section className="space-y-16">
            <div className="flex items-center gap-8 px-6">
              <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-[2rem] text-cyan-400 shadow-4xl">
                <HeartPulse size={40} className="shadow-gold" />
              </div>
              <div>
                <h2 className="athletic-title text-4xl lg:text-5xl italic uppercase font-black tracking-[0.2em] text-white">JOURNAL_<span className="text-cyan-400 opacity-60">BIEN-ÊTRE</span></h2>
                <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.6em] italic mt-2 leading-none">Flash Forme — Historique 14 jours · Protocole SDI v2</p>
              </div>
            </div>

            {flashFormeLogs.length > 0 ? (
              <>
                {/* SDI Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* SDI Score */}
                  <div className="glass-card-elevated p-10 border-white/5 bg-navy-deep/60 rounded-[3rem] relative overflow-hidden col-span-2 lg:col-span-1">
                    <HudCorners color="#22d3ee" opacity={0.3} size={35} />
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic mb-6">SCORE SDI MOYEN (7J)</div>
                    <div className={`text-6xl font-black italic athletic-title tracking-tight ${getSdiColor(Math.round(wellnessSummary?.avg_sdi ?? 0))}`}>
                      {wellnessSummary?.avg_sdi ? Math.round(wellnessSummary.avg_sdi) : '--'}<span className="text-2xl text-white/30">%</span>
                    </div>
                    <div className={`mt-4 flex items-center gap-3 text-[11px] font-black uppercase tracking-widest italic ${
                      sdiTrend === 'up' ? 'text-pitch-green' : sdiTrend === 'down' ? 'text-rose-400' : 'text-white/40'
                    }`}>
                      {sdiTrend === 'up' ? <ArrowUp size={16} /> : sdiTrend === 'down' ? <ArrowDown size={16} /> : null}
                      {sdiTrend === 'up' ? 'En progression vs S-1' : sdiTrend === 'down' ? 'En baisse vs S-1' : 'Données insuffisantes'}
                    </div>
                    <div className="mt-6 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div style={{ width: `${wellnessSummary?.avg_sdi ?? 0}%` }} className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition duration-1000" />
                    </div>
                  </div>

                  {/* Metric Cards */}
                  {wellnessMetrics.map((m, i) => {
                    const val = wellnessSummary ? Math.round((wellnessSummary as any)[m.key] * 10) / 10 : null;
                    return (
                      <div key={i} className="glass-card p-8 border-white/5 bg-navy-deep/40 rounded-[2.5rem] flex flex-col gap-4 relative overflow-hidden hover:border-white/10 transition">
                        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic">{m.label}</div>
                        <div className={`text-4xl font-black italic athletic-title ${m.color}`}>{val ?? '--'}<span className="text-lg text-white/30">/5</span></div>
                        <div className="flex gap-1.5">
                          {[1,2,3,4,5].map(s => (
                            <div key={s} className={`flex-1 h-1.5 rounded-full transition ${
                              val && s <= Math.round(val) ? `bg-current ${m.color} ${m.shadow}` : 'bg-white/5'
                            }`} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Daily Log Table */}
                <div className="glass-card-elevated p-10 border-white/5 bg-navy-deep/60 rounded-[3rem] relative overflow-hidden">
                  <HudCorners color="#22d3ee" opacity={0.2} size={40} />
                  <h4 className="text-[11px] font-black uppercase tracking-[0.6em] text-cyan-400 mb-10 italic">LOG QUOTIDIEN — 14 DERNIERS JOURS</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] font-bold uppercase tracking-wide">
                      <thead>
                        <tr className="border-b border-white/5 text-white/30">
                          {['Date', 'SDI', 'Sommeil', 'Énergie', 'Douleur', 'Stress', 'Nutrition', 'Zone'].map(h => (
                            <th key={h} className="pb-6 pr-8 text-left font-black italic tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {flashFormeLogs.map((log: any, i: number) => {
                          const sdi = Math.round(log.sdi_score ?? 0);
                          const sdiCol = sdi >= 75 ? 'text-pitch-green' : sdi >= 50 ? 'text-gold' : 'text-rose-400';
                          return (
                            <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="py-5 pr-8 text-white/60 font-black italic">{new Date(log.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }).toUpperCase()}</td>
                              <td className={`py-5 pr-8 font-black italic athletic-title text-base ${sdiCol}`}>{sdi}%</td>
                              <td className="py-5 pr-8 text-blue-400 font-black">{log.sleep_quality}/5</td>
                              <td className="py-5 pr-8 text-orange-400 font-black">{log.energy_level}/5</td>
                              <td className="py-5 pr-8 text-rose-400 font-black">{log.pain_level}/5</td>
                              <td className="py-5 pr-8 text-pitch-green font-black">{log.stress_level}/5</td>
                              <td className="py-5 pr-8 text-cyan-400 font-black">{log.nutrition_hydration}/5</td>
                              <td className="py-5 text-white/40 italic">{log.pain_location || '—'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="glass-card p-20 rounded-[3rem] text-center opacity-20 space-y-8 animate-pulse">
                <HeartPulse size={80} className="mx-auto text-cyan-400" />
                <p className="text-white font-black uppercase tracking-[0.8em] italic text-xl">AUCUN LOG FLASH FORME</p>
                <p className="text-white/50 text-[12px] uppercase tracking-widest italic">En attente du premier rapport quotidien du joueur</p>
              </div>
            )}
          </section>
        </MotionSection>

        {/* 📡 NEURAL STATUS STREAM: MATRIX HUD — Elite v4.0 */}
        <section className="relative mt-40 pt-24 border-t border-white/5 opacity-50 hover:opacity-100 transition duration-1000 glass-edge-highlight rounded-t-[5rem] p-16 hud-grain bg-gradient-to-b from-purple-500/[0.04] to-transparent">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[11px] font-black text-purple-400/40 uppercase tracking-[2em] italic select-none whitespace-nowrap">NEURAL STATUS STREAM v4.00_REPORTS_SECURE</div>
          <HudCorners color="#c084fc" opacity={0.3} size={60} />
          <div className="flex flex-col md:flex-row items-center justify-between gap-16 px-12 relative z-10">
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-5">
                  <div className="w-3 h-3 rounded-full bg-pitch-green shadow-[0_0_15px_#22c55e]" />
                  <span className="text-[12px] font-black text-white/80 uppercase tracking-widest italic">Node Status: <span className="text-pitch-green">ARCHIVE_SYNCHRONIZED</span></span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_15px_#c084fc]" />
                  <span className="text-[12px] font-black text-white/80 uppercase tracking-widest italic">Encryption: <span className="text-purple-400 font-mono">QUORUM_LOCKED_0x07</span></span>
                </div>
              </div>
              <div className="flex-1 max-w-2xl h-[3px] bg-white/5 relative overflow-hidden rounded-full shadow-inner">
                <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-[slide_4s_linear_infinite]" />
              </div>
              <div className="text-[11px] font-bold text-white/30 uppercase tracking-[0.6em] italic text-right leading-relaxed font-mono">
                RCBA_REPORT_ENGINE <br />
                LAST_SYNC: {new Date().toLocaleTimeString()} <br />
                STATION: {session.email.split('@')[0].toUpperCase()}
              </div>
          </div>
        </section>
      </div>
    </DashboardClientWrapper>
  );
}
