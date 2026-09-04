import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { 
  Users2, 
  AlertCircle,
  CheckCircle2,
  FileText,
  ChevronRight,
  Activity,
  Euro,
  Trophy,
  Zap,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu
} from "lucide-react";
import Link from "next/link";
import PerformanceRadar from "@/components/PerformanceRadar";
import IntelligenceAxis from "@/components/IntelligenceAxis";
import KillSwitchButton from "@/components/KillSwitchButton";
import AuraIntelligenceMatrix from "@/components/AuraIntelligenceMatrix";
import { getPlayerSelectionMerit } from "@/lib/actions";
import { getMinibusStats } from "@/lib/logistique-actions";
import { getClubRPETrends, getClubRPEAverages } from "@/lib/performance-actions";
import { getLicensePrice } from "@/lib/utils";
import PerformanceTrendsChart from "@/components/PerformanceTrendsChart";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import DashboardClientWrapper, { MotionSection, ScanningLine } from "@/components/DashboardClientWrapper";
import RecruitmentNotifsPanel from "@/components/RecruitmentNotifsPanel";

export default async function DirectionDashboard() {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur' && session.roleName.toLowerCase() !== 'admin')) {
    redirect('/login');
  }

  const db = await getDb();
  
  const licenseStats = await db.get(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status_paiement = 'payé' AND documents_complets = 1 THEN 1 ELSE 0 END) as valid,
      SUM(CASE WHEN documents_complets = 0 THEN 1 ELSE 0 END) as missing_docs,
      SUM(CASE WHEN status_paiement != 'payé' THEN 1 ELSE 0 END) as unpaid
    FROM Licences
  `);
  
  const buvetteStats = await db.get(`
    SELECT 
      SUM(recette_totale) as total_recette,
      SUM(depenses) as total_depenses
    FROM BuvetteStats
  `);
  
  const allPlayers = await db.all("SELECT j.*, e.nom as equipe_nom FROM Joueurs j JOIN Equipes e ON j.equipe_id = e.id");
  
  const clubPerf = await db.get(`
    SELECT 
      AVG(aptitude_physique) as phys,
      AVG(aptitude_technique) as tech,
      AVG(aptitude_tactique) as tact,
      AVG(aptitude_mentale) as ment
    FROM Joueurs
  `);
  
  const globalAttendance = await db.get(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN statut = 'présent' THEN 1 ELSE 0 END) as present
    FROM Presences p
    JOIN Evenements e ON p.evenement_id = e.id
    WHERE e.type = 'entraînement'
  `);
  
  const tacticalVolume = await db.get(`
    SELECT COUNT(*) as total FROM EventExercises
  `);
  
  const categoryStats = await db.all(`
    SELECT 
      e.categorie,
      COUNT(p.id) as total_presences,
      SUM(CASE WHEN p.statut = 'présent' THEN 1 ELSE 0 END) as count_present
    FROM Equipes e
    LEFT JOIN Evenements ev ON e.id = ev.equipe_id AND ev.type = 'entraînement'
    LEFT JOIN Presences p ON ev.id = p.evenement_id
    GROUP BY e.categorie
    ORDER BY e.categorie ASC
  `);
  
  const recentNotifs = await db.all(`
    SELECT n.*, j.prenom, j.nom 
    FROM NotifsLog n 
    JOIN Joueurs j ON n.joueur_id = j.id 
    ORDER BY n.date DESC 
    LIMIT 4
  `);
  
  const recruNotifs = await db.all(`
    SELECT * FROM MessagesRecrutement 
    WHERE destinataire = 'direction@rcba.fr' AND lu = 0
    ORDER BY date DESC 
  `);
  
  const minibusStats = await getMinibusStats();
  const rpeAverages = await getClubRPEAverages();
  const rpeTrends = await getClubRPETrends();

  // Financial Forecast Consolidation (Dynamic Cotisations from club-info.json)
  const licensesWithCategories = await db.all(`
    SELECT 
      l.status_paiement,
      j.categorie_actuelle as category
    FROM Licences l
    LEFT JOIN Joueurs j ON l.joueur_id = j.id
  `);

  let paidLicensesCash = 0;
  let unpaidLicensesCash = 0;

  for (const lic of licensesWithCategories) {
    const price = getLicensePrice(lic.category);
    if (lic.status_paiement === 'payé') {
      paidLicensesCash += price;
    } else {
      unpaidLicensesCash += price;
    }
  }

  const realCash = paidLicensesCash + ((buvetteStats?.total_recette || 0) - (buvetteStats?.total_depenses || 0));
  const recoverableCash = unpaidLicensesCash;
  const projectedTotal = realCash + recoverableCash;

  // High-Merit Players (Elite Synergy)
  const playersWithMerit = [];
  for (const p of allPlayers) {
    const synergy = await getPlayerSelectionMerit(p);
    playersWithMerit.push({ ...p, synergy });
  }
  const elitePlayers = playersWithMerit
    .filter((p: any) => p.synergy.merit > 80)
    .sort((a: any, b: any) => b.synergy.merit - a.synergy.merit)
    .slice(0, 4);

  const eliteIndex = (( ( (clubPerf?.phys || 0) + (clubPerf?.tech || 0) + (clubPerf?.tact || 0) + (clubPerf?.ment || 0) ) / 4 ) || 0);
  const eliteTarget = 4.0;
  const progressToTarget = (eliteIndex / eliteTarget) * 100;

  const totalKm = minibusStats.reduce((acc: number, curr: any) => acc + curr.total_km, 0);
  const totalFuel = minibusStats.reduce((acc: number, curr: any) => acc + curr.total_fuel, 0);

  const attendanceRate = ((globalAttendance?.present || 0) / (globalAttendance?.total || 1)) * 100;
  const financialHealth = (realCash / (projectedTotal || 1)) * 100;
  const licenseValidity = ((licenseStats?.valid || 0) / (licenseStats?.total || 1)) * 100;


  return (
    <DashboardClientWrapper>
      <PageLabel 
        section="DIRECTION"
        category="PILOTAGE STRATÉGIQUE"
        title="TABLEAU DE BORD"
        subtitle="Interface de direction RCBA — Vue globale sur les performances et la santé du club."
        icon="direction"
        variant="gold"
      />

      <div className="space-y-24">
        <MotionSection delay={0.2}>
          <RecruitmentNotifsPanel messages={recruNotifs} />
        </MotionSection>

        {/* ══════════════════════════════════════════
            ELITE KPI SENSORS (Interactive Grid)
        ══════════════════════════════════════════ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Taux de Présence", value: `${attendanceRate.toFixed(0)}%`, icon: Activity, color: "text-pitch-green", sub: "Engagements entraînements", trend: attendanceRate > 85 ? "OPTIMAL" : attendanceRate > 75 ? "NOMINAL" : "ATTENTION", glow: "shadow-[0_0_30px_rgba(0,255,65,0.1)]" },
            { label: "Licences", value: `${licenseValidity.toFixed(0)}%`, icon: ShieldCheck, color: "text-blue-400", sub: "Licences validées", trend: (licenseStats?.missing_docs || 0) > 10 ? "CRITIQUE" : (licenseStats?.missing_docs || 0) > 0 ? "Alerte Docs" : "OK", glow: "shadow-[0_0_30px_rgba(96,165,250,0.1)]" },
            { label: "Niveau Sportif", value: eliteIndex.toFixed(1), icon: Trophy, color: "text-gold", sub: "Moyenne RCBA Elite", trend: eliteIndex > 3.5 ? "ELITE" : "NOMINAL", glow: "shadow-[0_0_30px_rgba(212,175,55,0.15)]" },
            { label: "Trésorerie", value: `${realCash.toLocaleString()}€`, icon: Euro, color: "text-rose-400", sub: "Liquidités (Inc. Buvette)", trend: financialHealth > 85 ? "STABLE" : "RECOUVREMENT", glow: "shadow-[0_0_30px_rgba(244,63,94,0.1)]" }
          ].map((kpi, i) => (
            <MotionSection key={i} delay={i * 0.1}>
              <div className={`glass-card p-10 border-white/5 bg-white/[0.01] relative overflow-hidden group hover:shadow-gold transition duration-700 shadow-2xl ${kpi.glow} hud-scanline`}>
                <HudCorners color={i === 2 ? "#d4af37" : (i === 0 ? "#4ade80" : "#ffffff")} opacity={0.1} />
                <div className="absolute top-0 right-0 p-8">
                  <kpi.icon className={`w-16 h-16 opacity-[0.05] group-hover:opacity-20 group-hover:scale-125 transition duration-1000 -rotate-12 ${kpi.color}`} />
                </div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-8">
                    <span className="w-1 h-3 bg-gold/40 rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 italic">{kpi.label}</span>
                  </div>
                  
                  <div className={`text-7xl font-black tabular-nums italic tracking-tight ${kpi.color} group-hover:translate-x-2 transition-transform duration-700 pr-4 drop-shadow-2xl`}>
                    {kpi.value}
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] italic">{kpi.sub}</div>
                    <div className={`text-[8px] font-black px-3 py-1 rounded border transition-colors ${
                      i === 3 ? 'border-rose-500/30 text-rose-500 bg-rose-500/5' : 
                      i === 1 && (licenseStats?.missing_docs || 0) > 0 ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' :
                      'border-white/10 text-white/40 group-hover:text-white/60'
                    } tracking-[0.4em] uppercase italic`}>
                      {kpi.trend}
                    </div>
                  </div>
                </div>
                
                {/* Elite Background Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              </div>
            </MotionSection>
          ))}
        </section>

        {/* ══════════════════════════════════════════
            INTELLIGENCE MATRIX (Visual Core)
        ══════════════════════════════════════════ */}
        <MotionSection delay={0.4}>
          <section className="relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] font-black text-gold/20 uppercase tracking-[1em] italic select-none">AURA INTELLIGENCE ARTIFICIELLE</div>
            <HudCorners color="#d4af37" opacity={0.1} />
            <AuraIntelligenceMatrix 
              players={elitePlayers}
              attendanceRate={attendanceRate}
              financialHealth={financialHealth}
              licenseValidity={licenseValidity}
              tacticalVolume={tacticalVolume?.total || 0}
            />
          </section>
        </MotionSection>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* ══════════════════════════════════════════
            TECHNICAL ENGINE & BENCHMARKING
        ══════════════════════════════════════════ */}
        <MotionSection delay={0.6}>
          <div className="lg:col-span-2 space-y-12">
          
          <section className="glass-card p-12 border-platinum-white/10 bg-white/[0.01] flex flex-col items-center relative overflow-hidden group shadow-3xl hud-scanline">
            <HudCorners color="#d4af37" opacity={0.05} />
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-gold/5 rounded-full blur-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
            
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20 relative z-10 w-full font-body">
              <div className="w-full md:w-1/2 flex flex-col items-center relative">
                <div className="flex items-center gap-4 text-gold text-[11px] font-black uppercase tracking-[0.4em] mb-8 md:mb-14 w-full justify-center italic">
                  <div className="p-3 rounded-2xl bg-gold/10 border border-gold/20 shadow-inner group-hover:rotate-12 transition-transform">
                    <Activity size={22} className="shadow-gold" />
                  </div>
                  SYNERGIE <span className="text-white/40">RCBA ELITE</span>
                </div>
                
                <div className="relative group/radar transition duration-1000 group-hover:scale-105">
                  <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full scale-50 group-hover/radar:scale-110 transition duration-1000 opacity-0 group-hover/radar:opacity-100" />
                  <PerformanceRadar 
                    technique={clubPerf?.tech || 0}
                    tactique={clubPerf?.tact || 0}
                    physique={clubPerf?.phys || 0}
                    mental={clubPerf?.ment || 0}
                    size={380}
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2 space-y-12">
                <div className="bg-white/[0.02] p-10 rounded-[3rem] border border-white/10 border-l-[6px] border-l-gold shadow-3xl relative overflow-hidden group/box hover:bg-white/[0.04] transition duration-700">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.04] to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity duration-1000" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/50 mb-6 italic flex items-center gap-3 relative z-10">
                    <ShieldCheck size={20} className="text-gold shadow-glow" /> AUDIT ANALYTIQUE
                  </h4>
                  <p className="text-[17px] text-white italic leading-relaxed font-black relative z-10 athletic-title uppercase tracking-tight">
                    "Infrastructure stable. Index de performance supérieur à la moyenne régionale. <span className="text-gold">Optimisation tactique recommandée</span> pour la phase finale."
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-10">
                  {[
                    { label: 'TECH INTERFACE', val: clubPerf?.tech || 0, color: 'text-gold' },
                    { label: 'TACTICAL FLOW', val: clubPerf?.tact || 0, color: 'text-blue-400' },
                    { label: 'ATHLETIC CORE', val: clubPerf?.phys || 0, color: 'text-pitch-green' },
                    { label: 'PSY CORE', val: clubPerf?.ment || 0, color: 'text-rose-400' }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col gap-3 group/item cursor-default">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors italic">{item.label}</span>
                      <div className="flex items-end gap-3 transition duration-500 group-hover:translate-x-2">
                        <span className={`text-4xl font-black tabular-nums italic leading-none tracking-tighter ${item.color} drop-shadow-2xl`}>{item.val.toFixed(1)}</span>
                        <div className="text-[8px] text-white/30 font-black mb-1 tracking-widest px-2.5 py-1 bg-white/[0.03] rounded-lg border border-white/5 uppercase italic">UNIT.EXP</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════
              DYNAMIC BENCHMARKING (Elite Table)
          ══════════════════════════════════════════ */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 gap-4">
              <h3 className="athletic-title athletic-skew text-xl md:text-3xl flex items-center gap-3 md:gap-5 italic text-white uppercase tracking-tighter pr-4">
                <div className="p-3 rounded-2xl bg-white/[0.03] text-gold border border-white/5 shadow-2xl">
                  <Cpu size={26} className="shadow-gold" />
                </div>
                RCBA <span className="text-gold/40">SYSTEM BENCHMARKING</span>
              </h3>
              <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.5em] italic">SYNC REALTIME 100ms</div>
            </div>
            
            <div className="glass-card overflow-hidden border-white/5 bg-white/[0.01] shadow-3xl relative rounded-[3rem] hud-scanline">
              <HudCorners opacity={0.05} />
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
              <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-white/5">
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-gold italic whitespace-nowrap">NODE / CATÉGORIE</th>
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-gold italic whitespace-nowrap">ENGAGEMENT FLUX</th>
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-gold italic text-center whitespace-nowrap">INDEX</th>
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-gold italic text-right whitespace-nowrap">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {categoryStats.map((stat: any, i: number) => {
                    const rate = stat.total_presences > 0 ? (stat.count_present / stat.total_presences * 100) : 0;
                    return (
                      <tr key={i} className="hover:bg-white/[0.04] transition duration-500 group cursor-pointer">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                            <div className={`w-2 h-2 rounded-full ${rate > 80 ? 'bg-pitch-green animate-pulse shadow-glow' : 'bg-white/20'}`} />
                            <span className="text-xl font-black text-white italic group-hover:text-gold transition group-hover:translate-x-2 inline-block uppercase tracking-tight athletic-title athletic-skew">{stat.categorie}</span>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="w-44 h-2.5 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5 shadow-inner group-hover:border-gold/20 transition-colors">
                            <div className="bg-gradient-to-r from-gold via-gold-bright to-gold h-full shadow-gold rounded-full transition duration-1000" style={{ width: `${rate}%` }} />
                          </div>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <span className={`text-3xl font-black tabular-nums italic tracking-tight ${rate > 80 ? 'text-pitch-green' : rate > 60 ? 'text-gold' : 'text-rose-500 opacity-80'}`}>
                            {rate.toFixed(0)}<span className="text-[10px] ml-1 uppercase text-white/30">%</span>
                          </span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className={`inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] italic border transition duration-500 ${
                            rate > 80 ? 'bg-pitch-green/10 text-pitch-green border-pitch-green/20 shadow-inner' : 'bg-white/5 text-white/40 border-white/10 group-hover:text-white/60'
                          }`}>
                            {rate > 80 ? <Zap size={14} className="shadow-gold" /> : <Activity size={14} />}
                            {rate > 80 ? 'MAX PERFORMANCE' : 'NOMINAL FLUX'}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
              <div className="p-10 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-gold/40 animate-pulse" />
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.5em] italic">Diagnostic Systat 0x01 — Operational</span>
                </div>
                <div className="flex gap-1.5">
                  {[1,2,3,4,5,6,7].map(j => <div key={j} className="w-1 h-4 bg-white/5 rounded-full" />)}
                </div>
              </div>
            </div>
          </section>
        </div>
      </MotionSection>

        {/* ══════════════════════════════════════════
            ELITE TREASURY & SYSTEM STATUS (Right)
        ══════════════════════════════════════════ */}
        <MotionSection delay={0.8}>
          <div className="space-y-12">
          <KillSwitchButton />
          
          {/* Logistics & Fleet Analytics — Elite v4.0 */}
          <section className="glass-card p-12 border-blue-500/10 bg-blue-500/[0.01] relative overflow-hidden group shadow-3xl rounded-[3rem] hud-scanline">
            <HudCorners color="#3b82f6" opacity={0.15} />
            <div className="relative z-10">
              <h3 className="athletic-title athletic-skew text-2xl md:text-3xl mb-8 md:mb-14 flex items-center gap-3 md:gap-5 italic text-white uppercase tracking-tighter">
                <div className="p-3.5 rounded-[1.5rem] bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                  <Activity size={32} className="shadow-gold" />
                </div>
                FLUX <span className="text-blue-500/40">LOGISTIQUE</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Mobilité (KM)</span>
                  <span className="text-2xl font-black tabular-nums text-blue-400 italic">{totalKm.toLocaleString()}</span>
                </div>
                <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center">
                  <span className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Fuel Consumption</span>
                  <span className="text-2xl font-black tabular-nums text-gold italic">{totalFuel.toLocaleString()}€</span>
                </div>
              </div>

              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap size={40} className="text-pitch-green" />
                </div>
                <h4 className="text-[10px] font-black uppercase text-white/40 tracking-widest mb-4 italic flex items-center gap-2">
                  <ShieldCheck size={14} className="text-pitch-green" /> État Performance Athlétique
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-white/60 uppercase">Intensité Moyenne (RPE)</span>
                    <span className="text-lg font-black tabular-nums text-pitch-green italic">{(rpeAverages?.avg_intensity || 0).toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-white/60 uppercase">Niveau Fatigue Cluster</span>
                    <span className="text-lg font-black tabular-nums text-rose-400 italic">{(rpeAverages?.avg_fatigue || 0).toFixed(1)}/5</span>
                  </div>
                </div>
              </div>

              {/* RPE Trend Chart Overlay */}
              <div className="mt-8">
                <PerformanceTrendsChart data={rpeTrends} title="DYNAMIQUE DE PERFORMANCE (CLUB)" variant="blue" />
              </div>

              <Link href="/direction/performance" className="group/btn relative overflow-hidden block w-full mt-8 p-1 shadow-2xl rounded-3xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 animate-gradient-x" />
                <div className="relative bg-navy-deep/80 py-4 px-6 rounded-[1.4rem] flex items-center justify-between transition group-hover/btn:bg-blue-600">
                  <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic leading-none">Analyse Athlétique Détaillée</span>
                  <ArrowRight size={20} className="text-white group-hover/btn:translate-x-3 transition-transform" />
                </div>
              </Link>

          </div>
          </section>

          <section className="glass-card p-12 border-gold/10 bg-gold/[0.01] relative overflow-hidden group shadow-3xl rounded-[3rem] hud-scanline">
            <HudCorners color="#d4af37" opacity={0.15} />
            <div className="absolute -bottom-20 -right-20 p-8">
              <TrendingUp size={240} className="text-gold opacity-[0.02] group-hover:scale-110 group-hover:rotate-12 transition duration-1000" />
            </div>
            
            <div className="relative z-10">
              <h3 className="athletic-title athletic-skew text-2xl md:text-3xl mb-8 md:mb-14 flex items-center gap-3 md:gap-5 italic text-white uppercase tracking-tighter">
                <div className="p-3.5 rounded-[1.5rem] bg-gold/10 text-gold border border-gold/20 shadow-[0_0_40px_rgba(212,175,55,0.1)]">
                  <Euro size={32} className="shadow-gold" />
                </div>
                RÉGIE <span className="text-gold/40">TREASURY</span>
              </h3>
              
              <div className="space-y-14 mb-14">
                <div>
                  <div className="flex justify-between items-end text-[11px] font-black mb-5 uppercase tracking-[0.4em]">
                    <span className="text-white/40 italic">Global Liquidity Health</span>
                    <span className="text-gold tabular-nums text-2xl drop-shadow-glow italic font-black">
                      {financialHealth.toFixed(0)}<span className="text-[10px] ml-1 text-white/40">%</span>
                    </span>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5 shadow-inner group-hover:border-gold/20 transition duration-700">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
                    <div className="bg-gradient-to-r from-gold-deep via-gold to-gold-bright h-full rounded-full shadow-[0_0_25px_rgba(212,175,55,0.4)] relative transition duration-1000" style={{ width: `${financialHealth}%` }}>
                      <div className="absolute top-0 right-0 w-8 h-full bg-white/30 blur-md animate-shimmer" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/5 flex flex-col gap-2 group/ledger hover:bg-white/[0.06] transition relative overflow-hidden shadow-2xl">
                    <div className="absolute left-0 top-0 w-2 h-full bg-pitch-green shadow-glow" />
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black uppercase text-white/30 tracking-[0.5em] italic">Liquidités Réelles</span>
                      <div className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-[7px] font-black text-gold uppercase tracking-widest">Consolidé</div>
                    </div>
                    <div className="flex items-end gap-3">
                       <span className="text-pitch-green font-black tabular-nums text-5xl italic tracking-tight">
                         {realCash.toLocaleString()}
                       </span>
                       <span className="text-2xl font-black text-white/40 italic mb-2">€</span>
                    </div>
                    <div className="text-[8px] text-white/20 font-black uppercase tracking-widest italic mt-2">Licences payées + Profits Buvette</div>
                  </div>
                  
                  <div className="p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/5 flex flex-col gap-2 group/ledger hover:bg-white/[0.06] transition relative overflow-hidden shadow-2xl">
                    <div className="absolute left-0 top-0 w-2 h-full bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]" />
                    <span className="text-[10px] font-black uppercase text-white/30 tracking-[0.5em] italic">Encours de Recouvrement</span>
                    <div className="flex items-end gap-3">
                       <span className="text-rose-500 font-black tabular-nums text-5xl italic tracking-tight opacity-90 group-hover:opacity-100 transition-opacity">
                         {recoverableCash.toLocaleString()}
                       </span>
                       <span className="text-2xl font-black text-white/40 italic mb-2">€</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/direction/licences" className="group/btn relative overflow-hidden block w-full p-1 shadow-2xl rounded-3xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-gold-deep via-gold-bright to-gold-deep animate-gradient-x" />
                <div className="relative bg-gold py-6 px-8 rounded-[1.4rem] flex items-center justify-between transition group-hover/btn:bg-gold-bright">
                  <span className="text-[12px] font-black text-navy-deep uppercase tracking-[0.4em] italic leading-none">Exécuter l'Audit Global</span>
                  <ArrowRight size={26} className="text-navy-deep group-hover/btn:translate-x-3 transition-transform" />
                </div>
              </Link>
            </div>
            
            <div className="mt-12 pt-10 border-t border-white/5">
              <div className="flex items-center gap-4 px-2 opacity-30">
                <ShieldCheck size={14} className="text-gold" />
                <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">System Verified — Financial Integrity 0.9997</span>
              </div>
            </div>
          </section>

          {/* Pôle 0x01: Intelligence Axis (Sirchmunk Recon) */}
          <div className="shadow-gold-gold rounded-[3rem] overflow-hidden">
             <IntelligenceAxis />
          </div>
          </div>
        </MotionSection>
      </div>

      {/* 📡 STRATEGIC STATUS STREAM: MATRIX HUD INTEGRATION */}
      <MotionSection delay={1.0}>
        <section className="relative mt-20 pt-20 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity duration-1000">
           <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] font-black text-gold/30 uppercase tracking-[1em] italic select-none">STRATEGIC COMMAND MATRIX V.02</div>
           <HudCorners color="#d4af37" opacity={0.1} />
           <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-10">
              <div className="flex flex-col gap-2 items-center md:items-start">
                 <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Node Status: <span className="text-pitch-green">STABLE</span></span>
                 <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Encryption: <span className="text-gold">ECC_V2_ACTIVE</span></span>
              </div>
              <div className="flex-1 w-full max-w-2xl h-[1px] bg-white/5 relative overflow-hidden hidden md:block">
                 <ScanningLine />
              </div>
              <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em] italic text-center md:text-right">
                 AUTHENTICATED: {session.roleName} {" // "} {new Date().getFullYear()}
              </div>
           </div>
        </section>
      </MotionSection>
    </div>
    </DashboardClientWrapper>
  );
}
