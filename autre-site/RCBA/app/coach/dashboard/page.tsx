import Link from "next/link";
import PageLabel from "@/components/PageLabel";
import { Search, SlidersHorizontal, Activity, Zap, Target, ClipboardList, Info, Circle, MessageSquare, Swords } from "lucide-react";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import MagneticWrapper from "@/components/MagneticWrapper";
import PerformanceRadar from "@/components/PerformanceRadar";
import IntelligencePanel from "@/components/IntelligencePanel";
import { getPlayerSelectionMerit } from "@/lib/actions";
import { calculateSquadSynergy, getPlayerCombatGrade } from "@/lib/tactical";
import DashboardClientWrapper, { MotionSection } from "@/components/DashboardClientWrapper";
import HudCorners from "@/components/HudCorners";
import AuraIntelligenceMatrix from "@/components/AuraIntelligenceMatrix";
import CoachDashboardTabs from "@/components/CoachDashboardTabs";
import BalancedTeamsClient from "@/components/BalancedTeamsClient";
import CoachMessagerie from "@/components/CoachMessagerie";
import RecruitmentNotifsPanel from "@/components/RecruitmentNotifsPanel";

export default async function CoachDashboard() {
  const db = await getDb();
  const session = await getSession();

  let coachTeams: any[] = [];
  if (session?.roleName === 'Coach') {
    coachTeams = await db.all("SELECT equipe_id FROM Staff WHERE email = ?", [session.email]);
  }

  let playersQuery = `
    SELECT j.*, e.nom as equipe_nom,
           f.sdi_score, f.sleep_quality, f.pain_level, f.energy_level, f.stress_level, f.pain_location, f.date as f_date,
           p.total_events, p.presences
    FROM Joueurs j 
    JOIN Equipes e ON j.equipe_id = e.id 
    LEFT JOIN (
      SELECT joueur_id, sdi_score, sleep_quality, pain_level, energy_level, stress_level, pain_location, date,
             ROW_NUMBER() OVER(PARTITION BY joueur_id ORDER BY date DESC) as rn
      FROM FlashFormeLogs
    ) f ON j.id = f.joueur_id AND f.rn = 1
    LEFT JOIN (
      SELECT joueur_id, COUNT(*) as total_events, SUM(CASE WHEN statut = 'présent' THEN 1 ELSE 0 END) as presences
      FROM Presences
      GROUP BY joueur_id
    ) p ON j.id = p.joueur_id
  `;

  let queryParams: any[] = [];
  if (session?.roleName === 'Coach') {
    const equipeIds = coachTeams.map((t: any) => t.equipe_id).filter(Boolean);
    if (equipeIds.length > 0) {
      playersQuery += ` WHERE j.equipe_id IN (${equipeIds.map(() => '?').join(',')})`;
      queryParams = equipeIds;
    } else {
      playersQuery += ` WHERE 1=0`;
    }
  }

  playersQuery += ` ORDER BY j.prenom ASC`;

  // Fetch sequential data to prevent sqlite locking
  const players = await db.all(playersQuery, queryParams);
  
  const teamNotifs = await db.all(`
    SELECT n.*, j.prenom, j.nom 
    FROM NotifsLog n 
    JOIN Joueurs j ON n.joueur_id = j.id 
    ${session?.roleName === 'Coach' && queryParams.length > 0 
      ? `WHERE j.equipe_id IN (${queryParams.map(() => '?').join(',')})` 
      : ''}
    ORDER BY n.date DESC 
    LIMIT 4
  `, session?.roleName === 'Coach' ? queryParams : []);

  const recruNotifs = session?.roleName === 'Coach' ? await db.all(`
    SELECT * FROM MessagesRecrutement 
    WHERE destinataire = ? AND lu = 0
    ORDER BY date DESC 
  `, [session.email]) : [];

  const labProgress = session ? await db.get(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed
    FROM UserLabProgress 
    WHERE user_id = ?
  `, [session.userId]) : { total: 0, completed: 0 };

  // Prep data for Elite Display
  const playersWithMerit = [];
  for (const player of players) {
    playersWithMerit.push({
      ...player,
      meritData: await getPlayerSelectionMerit(player)
    });
  }

  // Tactical Intelligence Engine
  const squadData = calculateSquadSynergy(players);
  const avg = squadData.averages || { technique: 50, tactique: 50, physique: 50, mental: 50 };

  const labPercent = labProgress.total > 0 ? Math.round((labProgress.completed / labProgress.total) * 100) : 0;
  
  // Status Logic for Pressé
  const getPlayerStatus = (p: any) => {
    if (!p.sdi_score) return { color: 'bg-white/10', glow: '', label: 'PAS DE DONNÉES', type: 'unknown' };
    
    if (p.sdi_score < 40 || p.pain_level <= 2 || p.energy_level <= 2) {
      return { color: 'bg-red-500', glow: 'shadow-[0_0_15px_#ef4444]', label: 'REPOS CONSEILLÉ', type: 'danger' };
    }
    
    if (p.sdi_score < 70 || p.sleep_quality <= 2 || p.stress_level <= 2) {
      let reason = 'A SURVEILLER';
      if (p.pain_level < 3) reason = `Douleur: ${p.pain_location || 'Non précisée'}`;
      else if (p.sleep_quality <= 2) reason = 'A mal dormi';
      else if (p.stress_level <= 2) reason = 'Stress élevé';
      
      return { color: 'bg-orange-500', glow: 'shadow-[0_0_15px_#f97316]', label: reason.toUpperCase(), type: 'warning' };
    }
    
    return { color: 'bg-pitch-green', glow: 'shadow-[0_0_15px_#4ade80]', label: 'TOUT VA BIEN', type: 'good' };
  };

  // VIEWS
  const presseView = (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/[0.02] p-6 rounded-3xl border border-white/5 glass-edge-highlight">
        <div>
          <h3 className="text-xl font-black italic text-white uppercase tracking-widest drop-shadow-glow">Vue Rapide</h3>
          <p className="text-white/40 text-sm mt-1 uppercase tracking-widest italic">Feux tricolores basés sur le SDI Flash Forme</p>
        </div>
        <MagneticWrapper>
          <button className="px-8 py-4 bg-pitch-green text-navy-deep rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-gold hover:text-navy-deep active:scale-95 transition shadow-[0_0_30px_rgba(74,222,128,0.2)] italic">
            CONVOCATION EXPRESS
          </button>
        </MagneticWrapper>
      </div>

      <div className="space-y-8">
        <MotionSection delay={0.2}>
          <RecruitmentNotifsPanel messages={recruNotifs} />
        </MotionSection>

        {/* Tactical Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {playersWithMerit.map((player: any) => {
          const status = getPlayerStatus(player);
          return (
            <div key={player.id} className="glass-card-elevated p-6 rounded-3xl border-white/5 bg-white/[0.01] flex items-center justify-between group hover:bg-white/[0.03] transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-navy-light border border-white/10 flex items-center justify-center text-white font-black shadow-xl">
                  {player.nom[0]}{player.prenom[0]}
                </div>
                <div>
                  <div className="text-white font-black tracking-tight text-lg italic uppercase">{player.prenom} {player.nom}</div>
                  <div className="text-[10px] text-white/50 font-black uppercase tracking-widest italic">{player.poste || 'JOUEUR'}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`w-6 h-6 rounded-full ${status.color} ${status.glow} border border-white/20`} />
                <span className={`text-[9px] font-black uppercase tracking-widest italic ${status.type === 'good' ? 'text-pitch-green' : status.type === 'warning' ? 'text-orange-500' : status.type === 'danger' ? 'text-red-500' : 'text-white/40'}`}>
                  {status.label}
                </span>
              </div>
            </div>
          );
        })}
        </section>
      </div>
    </div>
  );

  const formateurView = (
    <div className="space-y-12">
      <section className="glass-card-elevated overflow-hidden border-white/5 bg-white/[0.01] shadow-3xl relative hud-scanline glass-edge-highlight rounded-[3rem] hud-grain">
        <HudCorners color="#3b82f6" opacity={0.2} size={40} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
        
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-2xl font-black italic text-white uppercase tracking-widest drop-shadow-glow">Analyse Long Terme</h3>
          <p className="text-white/40 text-sm uppercase tracking-widest italic">Comparaison et évolution des compétences</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.05]">
                <th className="px-10 py-6 text-[10px] uppercase font-black tracking-wider text-blue-400 italic text-center w-28 whitespace-nowrap">Grade</th>
                <th className="px-10 py-6 text-[10px] uppercase font-black tracking-wider text-blue-400 italic whitespace-nowrap">Joueur</th>
                <th className="px-10 py-6 text-[10px] uppercase font-black tracking-wider text-blue-400 italic hidden xl:table-cell text-center whitespace-nowrap">Indice Mérite</th>
                <th className="px-10 py-6 text-[10px] uppercase font-black tracking-wider text-blue-400 italic text-center whitespace-nowrap">Assiduité</th>
                <th className="px-10 py-6 text-[10px] uppercase font-black tracking-wider text-blue-400 italic text-center whitespace-nowrap">SDI Actuel</th>
                <th className="px-10 py-6 text-[10px] uppercase font-black tracking-wider text-blue-400 italic text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
               {playersWithMerit.map((player: any) => {
                 const { meritData } = player;
                 const combat = getPlayerCombatGrade(player);
                 return (
                  <tr key={player.id} className="hover:bg-blue-500/[0.03] transition duration-300 group cursor-default relative overflow-hidden">
                    <td className="px-10 py-6 text-center relative z-10">
                      <div className={`text-2xl ${combat.color} italic drop-shadow-glow group-hover:scale-125 transition-transform duration-500 font-black`}>
                        {combat.grade}
                      </div>
                    </td>
                    <td className="px-10 py-6 relative z-10">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-navy-light border border-white/10 flex items-center justify-center text-blue-400 font-black text-sm shadow-xl group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition relative">
                           {player.nom[0]}{player.prenom[0]}
                        </div>
                        <div>
                          <div className="text-white font-black tracking-tight text-base group-hover:text-blue-400 transition-colors italic uppercase">{player.prenom} {player.nom}</div>
                          <div className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em] italic">{player.poste || 'JOUEUR'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 hidden xl:table-cell text-center relative z-10">
                      <div className="flex flex-col items-center">
                        <span className={`text-[12px] font-black tabular-nums ${meritData.score > 80 ? 'text-gold' : 'text-white/80'} italic`}>
                          {meritData.score}%
                        </span>
                        <div className="w-16 h-1 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
                          <div className="h-full bg-blue-500 transition shadow-[0_0_10px_#3b82f6]" style={{ width: `${meritData.score}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-center relative z-10">
                      {player.total_events ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xl font-black tabular-nums text-white italic drop-shadow-glow">
                            {Math.round((player.presences / player.total_events) * 100)}%
                          </span>
                          <span className="text-[9px] text-white/40 uppercase tabular-nums tracking-widest italic">{player.presences}/{player.total_events}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-white/40 uppercase italic">N/A</span>
                      )}
                    </td>
                    <td className="px-10 py-6 text-center relative z-10">
                      {player.sdi_score ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xl font-black text-white tabular-nums italic drop-shadow-glow">{player.sdi_score}</span>
                          <span className="text-[9px] text-white/40 uppercase tabular-nums tracking-widest italic">{new Date(player.f_date).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-white/40 uppercase italic">N/A</span>
                      )}
                    </td>
                    <td className="px-10 py-6 text-right relative z-10">
                      <div className="flex justify-end gap-3">
                        <MagneticWrapper>
                          <button className="p-3 bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 rounded-xl text-white/60 transition border border-white/10 hover:border-blue-500/50 shadow-xl group/btn active:scale-95" title="Radar de compétences">
                            <Activity size={18} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </MagneticWrapper>
                        <MagneticWrapper>
                          <button className="p-3 bg-white/5 hover:bg-gold/20 hover:text-gold rounded-xl text-white/60 transition border border-white/10 hover:border-gold/50 shadow-xl group/btn active:scale-95" title="Note vocale du match">
                            <MessageSquare size={18} className="group-hover/btn:scale-110 transition-transform" />
                          </button>
                        </MagneticWrapper>
                      </div>
                    </td>
                  </tr>
                 );
               })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );

  const tactiqueView = (
    <div className="space-y-8">
      <div className="glass-card-elevated p-8 rounded-[3rem] border-white/5 bg-white/[0.01] relative overflow-hidden hud-scanline glass-edge-highlight">
        <HudCorners color="#f59e0b" opacity={0.2} size={40} />
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-black italic text-white uppercase tracking-[0.2em] drop-shadow-glow">Équilibrage Auto</h3>
            <p className="text-white/40 text-[10px] mt-1 uppercase tracking-widest italic font-bold">Algorithme de répartition équitable par mérite & SDI</p>
          </div>
          <Swords size={32} className="text-amber-500 opacity-30 rotate-12" />
        </div>

        <BalancedTeamsClient players={playersWithMerit} />
      </div>
    </div>
  );

  return (
    <DashboardClientWrapper>
      <div className="space-y-16 pb-20 hud-grain">
        <div className="relative">
          <PageLabel 
            section="Coach"
            category="Management"
            title="Gestion de l'Effectif"
            subtitle="Espace Technique Staff — Modes de suivi personnalisés : Pressé & Formateur."
            icon="staff"
            variant="blue"
          />
          <div className="absolute top-0 right-0 p-8 hidden lg:block">
            <div className="flex flex-col items-end gap-4">
              <div className="px-5 py-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl glass-edge-highlight flex items-center gap-4 shadow-3xl">
                <div className="w-3 h-3 rounded-full bg-pitch-green animate-pulse shadow-[0_0_15px_#4ade80]" />
                <span className="text-[10px] font-black text-pitch-green uppercase tracking-[0.2em] italic">Tactical Feed Active</span>
                <div className="w-[1px] h-4 bg-white/10" />
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-tighter italic">SQUAD_SYNC_v4.1</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 relative z-10 w-full lg:items-center justify-between">
          <div className="relative group flex-1 max-w-2xl">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500/40 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700" />
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-500 transition-colors drop-shadow-glow" size={24} />
            <input 
              type="text" 
              placeholder="FILTRER L'EFFECTIF JOUER PAR NOM OU POSTE..." 
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-6 pl-16 pr-8 text-[11px] font-black uppercase tracking-[0.3em] focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition placeholder:text-white/40 text-white backdrop-blur-md relative z-10 italic hud-scanline glass-edge-highlight"
            />
            <HudCorners color="#3b82f6" opacity={0.3} size={24} />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 space-y-12">
            <MotionSection>
              <CoachDashboardTabs 
                presseView={presseView} 
                formateurView={formateurView} 
                tactiqueView={tactiqueView}
              />
            </MotionSection>
          </div>

          {/* Sidebar: Coach Telemetry */}
          <div className="space-y-12">
            <Link href="/coach/tactical">
              <IntelligencePanel />
            </Link>

            <MotionSection delay={0.1}>
              <CoachMessagerie coachTeams={coachTeams} />
            </MotionSection>
            <MotionSection delay={0.2}>
              <section className="glass-card-elevated p-10 border-white/10 bg-navy-deep/40 shadow-3xl relative overflow-hidden group rounded-[3rem] hud-scanline glass-edge-highlight hud-grain">
                <HudCorners color="#3b82f6" opacity={0.2} size={30} />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                <h2 className="athletic-title text-4xl mb-6 flex items-center gap-3 italic text-white drop-shadow-glow">
                  <span className="bg-blue-500 h-8 w-1 skew-x-[15deg] shadow-[0_0_10px_#3b82f6]"></span>
                  <span>SQUAD <span className="text-blue-500">RADAR</span></span>
                </h2>
                
                <div className="flex justify-center py-6 scale-110 group-hover:scale-115 transition-transform duration-1000">
                  <PerformanceRadar 
                    technique={avg.technique}
                    tactique={avg.tactique}
                    physique={avg.physique}
                    mental={avg.mental}
                    size={280}
                  />
                </div>

                <div className="mt-12 grid grid-cols-2 gap-6 relative z-10">
                  <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 glass-edge-highlight group/stat cursor-default">
                    <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 italic text-center group-hover:text-white/60">Balance</div>
                    <div className="text-base font-black text-white text-center uppercase italic tracking-tighter drop-shadow-glow">{squadData.status}</div>
                  </div>
                  <div className="p-5 bg-white/[0.03] rounded-2xl border border-white/5 glass-edge-highlight group/stat cursor-default">
                    <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 italic text-center group-hover:text-white/60">Synergy</div>
                    <div className="text-base font-black text-blue-400 tabular-nums text-center uppercase italic tracking-tighter drop-shadow-glow">{squadData.score}%</div>
                  </div>
                </div>
              </section>
            </MotionSection>
            <MotionSection delay={0.3}>
              <section className="glass-card-elevated p-10 border-blue-500/20 bg-blue-500/[0.03] relative overflow-hidden group shadow-3xl rounded-[3rem] hud-scanline glass-edge-highlight hud-grain">
                <HudCorners color="#3b82f6" opacity={0.3} size={40} />
                <h2 className="athletic-title text-2xl mb-10 flex items-center gap-3 italic text-white drop-shadow-glow">
                  <span className="bg-blue-500 h-6 w-1 skew-x-[15deg] shadow-[0_0_10px_#3b82f6]"></span>
                  <span>TACTICAL <span className="text-blue-500">LOGS</span></span>
                </h2>
                
                <div className="space-y-10 relative z-10">
                  {teamNotifs.map((notif: any, i: number) => (
                    <div key={i} className="relative pl-8 border-l-2 border-white/5 py-4 group/item hover:border-blue-500/40 transition-colors">
                      <div className="absolute -left-[2px] top-0 w-[2px] h-0 bg-blue-500 group-hover/item:h-full transition duration-700 shadow-[0_0_8px_#3b82f6]" />
                      <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-3 flex justify-between items-center italic group-hover:text-white/80">
                        <span className="flex items-center gap-2">
                           <Zap size={10} className="text-blue-500" />
                           {notif.prenom} {notif.nom}
                        </span>
                        <span className="text-[8px] text-white/60 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 font-mono">{new Date(notif.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="text-[11px] text-white/80 font-bold uppercase tracking-widest leading-relaxed group-hover:text-white transition-colors italic line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </MotionSection>
          </div>
        </div>
      </div>
    </DashboardClientWrapper>
  );
}
