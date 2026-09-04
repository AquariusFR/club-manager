import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  Calendar,
  ChevronRight,
  ArrowLeft,
  Smile,
  Meh,
  Frown,
  Download,
  Moon,
  Zap,
  Thermometer
} from "lucide-react";
import Link from "next/link";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import DashboardClientWrapper, { MotionSection } from "@/components/DashboardClientWrapper";
import PerformanceTeamFilter from "@/components/PerformanceTeamFilter";
import PlayerDetailModal from "@/components/PlayerDetailModal";
import { getPlayerRPETrends, getClubRPETrends, getRetentionAlerts, getOverloadAlerts, getCoachSubstitutions, getSDIAlerts, getClubWellnessAverages, getPainAlerts, getPlayerWellnessHistory } from "@/lib/performance-actions";
import { ExportPerformanceButton, PerformanceRangeSelector, PerformanceTrendsChart } from "@/components/PerformanceComponents";
import { PERFORMANCE_CONFIG } from "@/lib/config/performance";

import PerformanceAgentWrapper, { AnalyzeWidgetButton } from "@/components/PerformanceAgentWrapper";

const WellnessTrend = ({ current, previous, inverse = false }: { current: number | undefined, previous: number | undefined, inverse?: boolean }) => {
  if (!current || !previous) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.1) return null;
  
  // For stress, lower is better (inverse = true)
  const isGood = inverse ? diff < 0 : diff > 0;
  
  return (
    <div className={`flex items-center gap-1 text-[8px] font-bold italic mt-1 ${isGood ? 'text-pitch-green' : 'text-rose-500'}`}>
      {diff > 0 ? '+' : ''}{diff.toFixed(1)} {isGood ? '↑' : '↓'}
    </div>
  );
};

export default async function DirectionPerformancePage({
  searchParams,
}: {
  searchParams: { days?: string; team?: string; playerDetail?: string };
}) {
  // ... (previous logic)
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur' && session.roleName.toLowerCase() !== 'admin')) {
    redirect('/login');
  }

  const days = parseInt(searchParams.days || '14');
  const teamId = searchParams.team;
  const playerDetailId = searchParams.playerDetail;
  const db = await getDb();
  
  // Fetch all teams for the filter
  const teams = await db.all('SELECT id, nom FROM Equipes ORDER BY nom ASC');

  // Build the query with optional team filter
  let query = `
    SELECT 
      j.id, 
      j.prenom, 
      j.nom, 
      e.nom as equipe_nom,
      e.id as equipe_id,
      AVG(p.intensity) as avg_intensity,
      AVG(p.fatigue) as avg_fatigue,
      COUNT(p.id) as log_count,
      (SELECT mood FROM PlayerPerformanceLogs WHERE joueur_id = j.id ORDER BY date DESC LIMIT 1) as latest_mood
    FROM Joueurs j
    JOIN Equipes e ON j.equipe_id = e.id
    LEFT JOIN PlayerPerformanceLogs p ON j.id = p.joueur_id AND p.date >= date('now', '-' || ? || ' days')
    WHERE 1=1
  `;
  
  const queryParams: any[] = [days];
  if (teamId && teamId !== 'all') {
    query += ` AND e.id = ?`;
    queryParams.push(teamId);
  }
  
  query += `
    GROUP BY j.id
    ORDER BY avg_fatigue DESC
  `;

  const playerPerformance = await db.all(query, queryParams);

  const parsedTeamId = teamId && teamId !== 'all' ? parseInt(teamId) : undefined;

  // Filter trends data if team is selected
  const clubTrends = await getClubRPETrends(days, parsedTeamId);

  const retentionAlerts = await getRetentionAlerts(parsedTeamId);
  const overloadAlerts = await getOverloadAlerts(parsedTeamId);
  const coachSubstitutions = await getCoachSubstitutions();
  const sdiAlerts = await getSDIAlerts(parsedTeamId);
  const wellnessData = await getClubWellnessAverages(parsedTeamId);
  const wellnessAverages = wellnessData.current;
  const wellnessPrev = wellnessData.previous;
  const painAlerts = await getPainAlerts(parsedTeamId);

  // Fetch player detail trends if requested
  let playerDetail = null;
  let playerTrends = [];
  let playerWellness = [];
  if (playerDetailId) {
    playerDetail = playerPerformance.find((p: any) => p.id === parseInt(playerDetailId));
    if (playerDetail) {
      playerTrends = await getPlayerRPETrends(parseInt(playerDetailId), days);
      playerWellness = await getPlayerWellnessHistory(parseInt(playerDetailId), days);
    }
  }

  const atRiskPlayers = playerPerformance.filter((p: any) => p.avg_fatigue > 3.5 || p.avg_intensity > 8);

  const moodIcon = (mood: string) => {
    switch (mood) {
      case 'great': return <Smile className="text-pitch-green" size={16} />;
      case 'okay': return <Meh className="text-gold" size={16} />;
      case 'tired': return <Frown className="text-rose-500" size={16} />;
      default: return null;
    }
  };

  const getStatusBadge = (fatigue: number, intensity: number) => {
    const { THRESHOLDS } = PERFORMANCE_CONFIG;
    if (fatigue >= THRESHOLDS.FATIGUE.CRITICAL || intensity >= THRESHOLDS.INTENSITY.CRITICAL) 
      return <span className="px-2 py-1 rounded-md bg-rose-500/20 text-rose-500 text-[8px] font-black uppercase italic">Critique</span>;
    if (fatigue >= THRESHOLDS.FATIGUE.WARNING || intensity >= THRESHOLDS.INTENSITY.WARNING) 
      return <span className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-500 text-[8px] font-black uppercase italic">Surcharge</span>;
    if (fatigue < 2 && intensity > 5) 
      return <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-500 text-[8px] font-black uppercase italic">Optimal</span>;
    return <span className="px-2 py-1 rounded-md bg-white/5 text-white/40 text-[8px] font-black uppercase italic">Stable</span>;
  };


  return (
    <PerformanceAgentWrapper>
      <DashboardClientWrapper>
      <div className="flex items-center justify-between mb-12">
        <Link href="/direction/dashboard" className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Retour Dashboard</span>
        </Link>
        <div className="flex gap-4">
          <PerformanceTeamFilter teams={teams} />
          <ExportPerformanceButton data={playerPerformance} />
        </div>
      </div>

      <PageLabel 
        section="ANALYTICS"
        category="ATHLETIC MONITORING"
        title={teamId && teamId !== 'all' ? `STATS : ${teams.find((t: any) => t.id === parseInt(teamId))?.nom}` : "PERFORMANCE ATHLÉTIQUE"}
        subtitle={`Suivi systémique de la charge de travail et de la fatigue des athlètes sur ${days} jours.`}
        icon="activity"
        variant="blue"
      />

      <div className="space-y-16">
        {/* Direction Management Widgets */}
        <section className="grid lg:grid-cols-3 gap-8">
          {/* Radar de Rétention */}
          <div className="glass-card-elevated p-8 border-orange-500/20 bg-orange-500/[0.02] relative overflow-hidden rounded-3xl glass-edge-highlight">
            <HudCorners color="#f97316" opacity={0.2} size={20} />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                <TrendingUp size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-orange-500 italic">Radar de Rétention</h4>
                <p className="text-[9px] text-orange-500/60 uppercase tracking-widest italic">Risque de décrochage</p>
              </div>
            </div>
            
            <div className="absolute top-8 right-8">
              <AnalyzeWidgetButton 
                label="ANALYSER RISQUES"
                agentKey="ALEX"
                context={`ANALYSE DE RÉTENTION - Joueurs à risque détectés: ${retentionAlerts.map((p: any) => `${p.prenom} ${p.nom} (Stress: ${p.avg_stress}, Énergie: ${p.avg_energy})`).join(', ')}. Analysez les causes possibles et proposez un plan de remédiation.`} 
              />
            </div>
            
            <div className="space-y-3">
              {retentionAlerts.length > 0 ? retentionAlerts.slice(0, 4).map((p: any, i: number) => (
                <div key={i} className="flex flex-col p-3 bg-white/5 rounded-xl border border-white/5 hover:border-orange-500/30 transition">
                  <span className="text-sm font-black text-white uppercase italic">{p.prenom} {p.nom}</span>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[8px] text-white/40 uppercase tracking-widest">{p.equipe_nom}</span>
                    <span className="text-[10px] font-black text-orange-400 italic text-right">Stress: {p.avg_stress?.toFixed(1)} / Énergie: {p.avg_energy?.toFixed(1)}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 opacity-40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Aucun risque détecté</span>
                </div>
              )}
            </div>
          </div>

          {/* Alerte Surcharge (Teams) */}
          <div className="glass-card-elevated p-8 border-rose-500/20 bg-rose-500/[0.02] relative overflow-hidden rounded-3xl glass-edge-highlight">
            <HudCorners color="#f43f5e" opacity={0.2} size={20} />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-rose-500 italic">Alerte Surcharge</h4>
                <p className="text-[9px] text-rose-500/60 uppercase tracking-widest italic">Équipes en surentraînement</p>
              </div>
            </div>

            <div className="absolute top-8 right-8">
              <AnalyzeWidgetButton 
                label="AUDIT CHARGE"
                agentKey="ALEX"
                context={`ALERTE SURCHARGE - Équipes critiques: ${overloadAlerts.map((t: any) => `${t.nom} (Fatigue: ${t.avg_team_fatigue})`).join(', ')}. Évaluez l'impact sur le calendrier et proposez des ajustements d'intensité.`} 
              />
            </div>

            <div className="space-y-3">
              {overloadAlerts.length > 0 ? overloadAlerts.slice(0, 4).map((t: any, i: number) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:border-rose-500/30 transition">
                  <span className="text-sm font-black text-white uppercase italic">{t.nom}</span>
                  <div className="flex flex-col items-end">
                    <span className="text-[12px] font-black tabular-nums text-rose-500 italic">{t.avg_team_fatigue?.toFixed(1)} / 5</span>
                    <span className="text-[8px] text-white/40 tabular-nums uppercase tracking-widest">{t.total_logs} logs (7j)</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 opacity-40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Normalisation détectée</span>
                </div>
              )}
            </div>
          </div>

          {/* Neural Readiness (SDI) */}
          <div className="glass-card-elevated p-8 border-blue-500/20 bg-blue-500/[0.02] relative overflow-hidden rounded-3xl glass-edge-highlight">
            <HudCorners color="#3b82f6" opacity={0.2} size={20} />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Activity size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 italic">Disponibilité (SDI)</h4>
                <p className="text-[9px] text-blue-400/60 uppercase tracking-widest italic">Peak vs Critical Readiness</p>
              </div>
            </div>

            <div className="absolute top-8 right-8">
              <AnalyzeWidgetButton 
                label="CHECK DISPO"
                agentKey="ALEX"
                context={`INDEX DE DISPONIBILITÉ (SDI) - Top Alertes: ${sdiAlerts.slice(0, 5).map((p: any) => `${p.prenom} ${p.nom} (${p.sdi_score}%)`).join(', ')}. Évaluez la préparation du groupe pour les prochaines échéances.`} 
              />
            </div>

            <div className="space-y-3">
              {sdiAlerts.length > 0 ? sdiAlerts.slice(0, 4).map((p: any, i: number) => (
                <div key={i} className="flex flex-col p-3 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-white uppercase italic">{p.prenom} {p.nom}</span>
                    <span className={`text-[10px] tabular-nums font-black italic ${p.sdi_score >= 90 ? 'text-pitch-green' : 'text-rose-400'}`}>
                      {p.sdi_score}%
                    </span>
                  </div>
                  <span className="text-[8px] text-white/40 uppercase tracking-widest mt-1">{p.equipe_nom}</span>
                </div>
              )) : (
                <div className="text-center py-6 opacity-40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Calibration stable</span>
                </div>
              )}
            </div>
          </div>
          <div className="glass-card-elevated p-8 border-blue-500/20 bg-blue-500/[0.02] relative overflow-hidden rounded-3xl glass-edge-highlight flex flex-col">
            <HudCorners color="#3b82f6" opacity={0.2} size={20} />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-[0.2em] text-blue-400 italic">Remplacement</h4>
                  <p className="text-[9px] text-blue-400/60 uppercase tracking-widest italic">Gestion Éducateurs</p>
                </div>
              </div>
              <div className="absolute top-8 right-8">
                <AnalyzeWidgetButton 
                  label="PLAN STAFF"
                  agentKey="ALEX"
                  context={`GESTION DES REMPLACEMENTS - Demandes actives: ${coachSubstitutions.filter((s: any) => s.status === 'PENDING').map((s: any) => `${s.prenom} ${s.nom} pour le ${new Date(s.date).toLocaleDateString()}`).join(', ')}. Analysez les besoins en staff et suggérez des solutions pour couvrir les séances.`} 
                />
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto">
              {coachSubstitutions.filter((s: any) => s.status !== 'CANCELLED').length > 0 ? 
                coachSubstitutions
                  .filter((s: any) => s.status !== 'CANCELLED')
                  .slice(0, 3)
                  .map((sub: any, i: number) => (
                <div key={i} className={`flex flex-col p-3 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition ${sub.status === 'FILLED' ? 'opacity-60' : ''}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic">{new Date(sub.date).toLocaleDateString()}</span>
                    <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter ${sub.status === 'FILLED' ? 'bg-pitch-green/20 text-pitch-green' : 'bg-gold/20 text-gold'}`}>
                      {sub.status === 'FILLED' ? 'Remplacé' : 'En Attente'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-white uppercase italic">{sub.prenom} {sub.nom}</span>
                    <span className="text-[9px] text-white/40 uppercase italic font-bold">
                      {sub.sub_prenom ? sub.sub_prenom : 'À assigner'}
                    </span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 opacity-40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Aucune demande</span>
                </div>
              )}
            </div>
            
            <div className="pt-4 mt-auto">
              <Link href="/direction/performance/remplacements" className="w-full py-3 bg-blue-500/10 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition border border-blue-500/30 flex items-center justify-center">
                Gérer les remplacements
              </Link>
            </div>
          </div>

          {/* Wellness Global */}
          <div className="glass-card-elevated p-8 border-pitch-green/20 bg-pitch-green/[0.02] relative overflow-hidden rounded-3xl glass-edge-highlight">
            <HudCorners color="#10b981" opacity={0.2} size={20} />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pitch-green/10 flex items-center justify-center text-pitch-green border border-pitch-green/20">
                <Moon size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-pitch-green italic">Wellness Global</h4>
                <p className="text-[9px] text-pitch-green/60 uppercase tracking-widest italic">Santé & Récupération</p>
              </div>
            </div>

            <div className="absolute top-8 right-8">
              <AnalyzeWidgetButton 
                label="AUDIT SANTÉ"
                agentKey="ALEX"
                context={`WELLNESS GLOBAL - Moyennes Club: Sommeil: ${wellnessAverages?.avg_sleep}, Nutrition: ${wellnessAverages?.avg_nutrition}, Énergie: ${wellnessAverages?.avg_energy}, Stress: ${wellnessAverages?.avg_stress}. Analysez les corrélations entre hygiène de vie et performance globale.`} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Moon size={10} className="text-blue-400" />
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">Sommeil</span>
                </div>
                <div className="text-xl tabular-nums font-black text-white italic">{wellnessAverages?.avg_sleep?.toFixed(1) || '--'}<span className="text-[10px] text-white/20 ml-1">/5</span></div>
                <WellnessTrend current={wellnessAverages?.avg_sleep} previous={wellnessPrev?.avg_sleep} />
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Zap size={10} className="text-gold" />
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">Nutrition</span>
                </div>
                <div className="text-xl tabular-nums font-black text-white italic">{wellnessAverages?.avg_nutrition?.toFixed(1) || '--'}<span className="text-[10px] text-white/20 ml-1">/5</span></div>
                <WellnessTrend current={wellnessAverages?.avg_nutrition} previous={wellnessPrev?.avg_nutrition} />
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Activity size={10} className="text-pitch-green" />
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">Énergie</span>
                </div>
                <div className="text-xl tabular-nums font-black text-white italic">{wellnessAverages?.avg_energy?.toFixed(1) || '--'}<span className="text-[10px] text-white/20 ml-1">/5</span></div>
                <WellnessTrend current={wellnessAverages?.avg_energy} previous={wellnessPrev?.avg_energy} />
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={10} className="text-orange-500" />
                  <span className="text-[8px] text-white/40 uppercase tracking-widest">Stress</span>
                </div>
                <div className="text-xl tabular-nums font-black text-white italic">{wellnessAverages?.avg_stress?.toFixed(1) || '--'}<span className="text-[10px] text-white/20 ml-1">/5</span></div>
                <WellnessTrend current={wellnessAverages?.avg_stress} previous={wellnessPrev?.avg_stress} inverse={true} />
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] italic">{wellnessAverages?.total_logs || 0} rapports cette semaine</span>
            </div>
          </div>

          {/* Alerte Douleurs */}
          <div className="glass-card-elevated p-8 border-rose-500/20 bg-rose-500/[0.02] relative overflow-hidden rounded-3xl glass-edge-highlight">
            <HudCorners color="#f43f5e" opacity={0.2} size={20} />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                <Thermometer size={20} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-[0.2em] text-rose-500 italic">Radar Douleurs</h4>
                <p className="text-[9px] text-rose-500/60 uppercase tracking-widest italic">Zones critiques détectées</p>
              </div>
            </div>
            <div className="absolute top-8 right-8">
              <AnalyzeWidgetButton 
                label="ANALYSER DOULEURS"
                agentKey="ALEX"
                context={`RADAR DOULEURS - Alertes critiques: ${painAlerts.slice(0, 5).map((p: any) => `${p.prenom} ${p.nom} (${p.pain_location}, Niveau ${p.pain_level})`).join(', ')}. Évaluez la gravité et recommandez des protocoles de soin ou des mises au repos.`} 
              />
            </div>

            <div className="space-y-3">
              {painAlerts.length > 0 ? painAlerts.slice(0, 4).map((p: any, i: number) => (
                <Link 
                  key={i} 
                  href={`?${new URLSearchParams({ ...searchParams, playerDetail: p.id.toString(), tab: 'health' }).toString()}`}
                  scroll={false}
                  className="flex flex-col p-3 bg-white/5 rounded-xl border border-white/5 hover:border-rose-500/30 hover:bg-white/10 transition cursor-pointer group"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-white uppercase italic group-hover:text-rose-400 transition-colors">{p.prenom} {p.nom}</span>
                    <span className="text-[10px] font-black text-rose-500 italic flex items-center gap-1">
                      Niveau {p.pain_level}
                      <ChevronRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[8px] text-white/40 uppercase tracking-widest">{p.equipe_nom}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] text-rose-400 uppercase font-bold italic">{p.pain_location || 'Localisation non spécifiée'}</span>
                      {p.frequency > 1 && (
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 text-[7px] font-black italic">
                          {p.frequency}x
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="text-center py-6 opacity-40">
                  <span className="text-[10px] font-black uppercase tracking-widest text-pitch-green">Aucune douleur critique</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Global Trends Graph */}
        <section className="glass-card-elevated overflow-hidden border-white/5 bg-white/[0.01] shadow-3xl relative rounded-[3rem] p-10">
           <div className="absolute top-10 right-10 z-10">
             <AnalyzeWidgetButton 
               label="ANALYSER TENDANCES"
               agentKey="ALEX"
               context={`DYNAMIQUE DE CHARGE GLOBALE - Données sur ${days} jours. Analysez les pics de charge et la fatigue moyenne du club pour anticiper les risques de blessures collectives.`} 
             />
           </div>
           <PerformanceTrendsChart 
             data={clubTrends} 
             title={teamId && teamId !== 'all' ? `DYNAMIQUE DE CHARGE : ${teams.find((t: any) => t.id === parseInt(teamId))?.nom}` : `DYNAMIQUE DE CHARGE GLOBALE`}
             variant="blue" 
           />
        </section>

        {/* Player List */}
        <section className="glass-card overflow-hidden border-white/5 bg-white/[0.01] shadow-3xl relative rounded-[3rem] hud-scanline">
          <HudCorners opacity={0.05} />
          <div className="p-10 border-b border-white/5 flex items-center justify-between">
            <h3 className="athletic-title athletic-skew text-2xl text-white uppercase tracking-tighter italic">INDEX DE PERFORMANCE <span className="text-blue-500/40">{teamId && teamId !== 'all' ? teams.find((t: any) => t.id === parseInt(teamId))?.nom : 'SQUAD'}</span></h3>
            <PerformanceRangeSelector />
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 italic">ATHLÈTE</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 italic text-center">STATUS</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 italic text-center text-blue-400/60">ÉQUIPE</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 italic text-center">RPE AVG</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 italic text-center">FATIGUE AVG</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 italic text-center">MOOD</th>
                <th className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 italic text-right">LOGS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {playerPerformance.map((p: any, i: number) => (
                <tr 
                  key={i} 
                  id={`player-${p.id}`} 
                  className="hover:bg-white/[0.04] transition duration-500 group cursor-pointer target:bg-blue-500/10 target:border-blue-500/30"
                >
                  <td className="px-10 py-6">
                    <Link href={`?${new URLSearchParams({...searchParams, playerDetail: p.id.toString()}).toString()}`} className="flex flex-col">
                      <span className="text-sm font-black text-white italic group-hover:text-blue-400 transition uppercase tracking-tight athletic-title">{p.prenom} {p.nom}</span>
                      <span className="text-[8px] text-white/20 uppercase tracking-widest block lg:hidden">{p.equipe_nom}</span>
                    </Link>
                  </td>
                  <td className="px-10 py-6 text-center">
                    {getStatusBadge(p.avg_fatigue || 0, p.avg_intensity || 0)}
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">{p.equipe_nom}</span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`text-lg tabular-nums font-black athletic-title italic ${p.avg_intensity >= PERFORMANCE_CONFIG.THRESHOLDS.INTENSITY.WARNING ? 'text-rose-500' : 'text-pitch-green'}`}>
                      {p.avg_intensity ? p.avg_intensity.toFixed(1) : '--'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`text-lg tabular-nums font-black athletic-title italic ${p.avg_fatigue >= PERFORMANCE_CONFIG.THRESHOLDS.FATIGUE.WARNING ? 'text-rose-500' : 'text-blue-400'}`}>
                      {p.avg_fatigue ? p.avg_fatigue.toFixed(1) : '--'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <div className="flex justify-center">
                      {moodIcon(p.latest_mood)}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className="text-[10px] tabular-nums font-black text-white/20 uppercase tracking-widest italic">{p.log_count}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <PlayerDetailModal 
        isOpen={!!playerDetailId && !!playerDetail} 
        player={playerDetail}
        trends={playerTrends}
        wellnessHistory={playerWellness}
      />
    </DashboardClientWrapper>
    </PerformanceAgentWrapper>
  );
}
