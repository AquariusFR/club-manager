import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import { 
  Plus, 
  Calendar, 
  Activity, 
  ChevronRight, 
  PlayCircle, 
  Target, 
  Zap, 
  Cpu, 
  Shield, 
  Flame 
} from "lucide-react";
import Link from "next/link";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import MagneticWrapper from "@/components/MagneticWrapper";
import { redirect } from "next/navigation";

export default async function TrainingHubPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const db = await getDb();
  
  // 1. Identify Coach's Team
  let staff = await db.get("SELECT equipe_id FROM Staff WHERE email = ?", [session.email]);
  if (!staff && (session.roleName.toLowerCase() === 'admin' || session.roleName.toLowerCase() === 'direction')) {
    const firstTeam = await db.get("SELECT id as equipe_id FROM Equipes LIMIT 1");
    if (firstTeam) staff = firstTeam;
  }
  if (!staff) return <div className="p-20 text-center text-white/80 uppercase font-black tracking-widest italic">Equipe non configurée</div>;

  const equipe_id = staff.equipe_id;

  // 2. Fetch Sessions
  const sessions = await db.all(`
    SELECT e.*, 
    (SELECT COUNT(*) FROM Presences WHERE evenement_id = e.id AND statut = 'présent') as present_count,
    (SELECT COUNT(*) FROM Presences WHERE evenement_id = e.id) as total_players
    FROM Evenements e 
    WHERE e.equipe_id = ? AND e.type = 'entraînement'
    ORDER BY e.date DESC
  `, [equipe_id]);

  // 3. Tactical Prescription Logic
  const squad = await db.all("SELECT aptitude_physique, aptitude_technique, aptitude_tactique, aptitude_mentale FROM Joueurs WHERE equipe_id = ?", [equipe_id]);
  
  const squadAvg = {
    Technique: squad.reduce((sum: number, p: any) => sum + (p.aptitude_technique || 3), 0) / (squad.length || 1),
    Tactique: squad.reduce((sum: number, p: any) => sum + (p.aptitude_tactique || 3), 0) / (squad.length || 1),
    Physique: squad.reduce((sum: number, p: any) => sum + (p.aptitude_physique || 3), 0) / (squad.length || 1),
    Mentale: squad.reduce((sum: number, p: any) => sum + (p.aptitude_mentale || 3), 0) / (squad.length || 1),
  };

  const weakestAttr = Object.entries(squadAvg).sort((a, b) => a[1] - b[1])[0][0];

  const suggestedDrills = await db.all(`
    SELECT * FROM Exercices 
    WHERE categorie = ? 
    ORDER BY intensite DESC 
    LIMIT 3
  `, [weakestAttr]);

  const allDrills = await db.all("SELECT * FROM Exercices LIMIT 5");

  const today = new Date().setHours(0,0,0,0);
  const upcoming = sessions.filter((s: any) => new Date(s.date).getTime() >= today);
  const past = sessions.filter((s: any) => new Date(s.date).getTime() < today);

  return (
    <div className="space-y-16 animate-in fade-in duration-1000 pb-20 hud-grain">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 pb-16 border-b border-white/5 relative overflow-hidden glass-edge-highlight px-8 lg:px-12">
        {/* Pitch Green Aura Glow */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pitch-green/5 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-40 animate-pulse" />
        
        <PageLabel 
          section="Staff"
          category="Entraînement"
          title="Sessions Élite"
          subtitle="Planification et suivi des entraînements pour l'excellence opérationnelle."
          variant="green"
          icon="coach"
        />

        <MagneticWrapper>
          <Link href="/coach/training/new" className="group flex items-center gap-8 bg-pitch-green text-navy-deep px-12 py-6 rounded-[2rem] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-gold transition shadow-3xl shadow-pitch-green/20 border border-pitch-green/20 active:scale-95 italic text-center glass-edge-highlight relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">DÉPLOIEMENT_SESSION</span>
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-500 relative z-10 drop-shadow-lg" />
          </Link>
        </MagneticWrapper>
      </header>

      <div className="grid lg:grid-cols-12 gap-12 px-8 lg:px-12">
        {/* Main Content: Neural Session Grid */}
        <div className="lg:col-span-8 space-y-12">
          {upcoming.length > 0 && (
            <section className="space-y-6">
              <h3 className="athletic-title text-xl flex items-center gap-4 italic text-white/70 tracking-[0.5em] uppercase font-black">
                <Calendar className="text-pitch-green" size={20} /> SESSIONS <span className="text-white/60">À VENIR</span>
              </h3>
              
              <div className="grid gap-4">
                {upcoming.map((s: any) => (
                  <TrainingCard key={s.id} session={s} isPast={false} />
                ))}
              </div>
            </section>
          )}

          <section className="space-y-6">
            <h3 className="athletic-title text-xl flex items-center gap-4 italic text-white/70 tracking-[0.5em] uppercase font-black">
              <Activity className="text-white/60" size={20} /> ARCHIVES <span className="text-white/60">PERFORMANCE</span>
            </h3>
            
            <div className="grid gap-4">
              {past.map((s: any) => (
                <TrainingCard key={s.id} session={s} isPast={true} />
              ))}
              {past.length === 0 && <div className="p-12 glass-card text-center text-white/80 italic font-bold text-sm uppercase tracking-widest border border-dashed border-white/5">Aucune session passée</div>}
            </div>
          </section>
        </div>

        {/* Sidebar: Aura Intelligence Fixed Prescriptions */}
        <div className="lg:col-span-4 space-y-12">
          <section className="glass-card-elevated p-12 border-pitch-green/20 bg-navy-deep/40 relative overflow-hidden group shadow-3xl rounded-[3rem] glass-edge-highlight hud-grain">
            <HudCorners color="#4ade80" opacity={0.3} size={50} />
            <div className="absolute top-0 right-0 p-10">
              <Cpu size={120} className="text-pitch-green opacity-[0.03] group-hover:scale-125 group-hover:rotate-12 transition-transform duration-1000" />
            </div>
            
            <h3 className="athletic-title text-2xl mb-10 flex items-center gap-5 italic tracking-[0.2em] uppercase font-black text-white drop-shadow-glow">
              <Zap className="text-pitch-green animate-pulse" size={28} />
              <span>AURA_PRESCRIPTION</span>
            </h3>
            
            <div className="p-8 bg-pitch-green/10 rounded-3xl border border-pitch-green/20 mb-10 relative overflow-hidden group/alert">
               <div className="absolute inset-0 bg-pitch-green/5 opacity-0 group-hover/alert:opacity-100 transition-opacity" />
              <div className="text-[10px] font-black text-pitch-green uppercase tracking-[0.3em] mb-2 italic flex items-center gap-2">
                <span className="w-4 h-px bg-pitch-green" /> DÉFICIENCE_DÉTECTÉE
              </div>
              <div className="text-lg font-black text-white uppercase italic tracking-widest drop-shadow-glow">
                 {weakestAttr} <span className="text-pitch-green">SYSTEM_LOW</span>
              </div>
              <div className="mt-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Score Unité: {(squadAvg[weakestAttr as keyof typeof squadAvg] * 20).toFixed(0)}% • Re-calibration nécessaire
              </div>
            </div>

            <div className="space-y-6">
              {suggestedDrills.map((drill: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-pitch-green/40 hover:bg-white/[0.05] transition cursor-pointer group/drill glass-edge-highlight relative overflow-hidden">
                   <div className="absolute inset-0 bg-pitch-green/5 opacity-0 group-hover/drill:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="text-[10px] font-black text-pitch-green/60 uppercase tracking-[0.4em] italic leading-tight mb-2">{drill.categorie}</div>
                    <div className="text-base font-black text-white group-hover/drill:text-pitch-green transition-colors uppercase italic tracking-tighter athletic-title">{drill.titre}</div>
                    <div className="text-[10px] text-white/40 mt-2 italic font-medium uppercase tracking-widest line-clamp-1">{drill.description}</div>
                  </div>
                  <div className="flex gap-1.5 relative z-10">
                    {[1,2,3,4,5].map((v: number) => (
                      <div key={v} className={`w-1.5 h-4 rounded-full transition duration-500 ${v <= drill.intensite ? 'bg-pitch-green shadow-[0_0_10px_#4ade80]' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <MagneticWrapper>
              <button className="w-full mt-12 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black text-white/50 uppercase tracking-[0.5em] hover:bg-pitch-green/10 hover:text-pitch-green hover:border-pitch-green/40 transition italic flex items-center justify-center gap-4 group/all glass-edge-highlight">
                EXPLORER_DRILLERTHÈQUE
                <ChevronRight size={16} className="group-hover/all:translate-x-2 transition-transform" />
              </button>
            </MagneticWrapper>
          </section>

          <section className="glass-card-elevated p-10 border-white/5 bg-white/[0.01] rounded-[3rem] glass-edge-highlight hud-grain relative overflow-hidden">
             <HudCorners color="#ffffff" opacity={0.05} size={30} />
            <h3 className="athletic-title text-xl mb-10 flex items-center gap-5 italic tracking-[0.2em] uppercase font-black">
              <PlayCircle className="text-white/40" size={24} /> 
              <span>SQUAD_DRILLS</span> <span className="text-white/20">GENERAL</span>
            </h3>
            
            <div className="space-y-6">
              {allDrills.slice(0, 3).map((drill: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-[1.5rem] border border-white/5 hover:border-white/20 transition cursor-pointer group">
                  <div>
                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic leading-tight mb-2">{drill.categorie}</div>
                    <div className="text-sm font-black text-white group-hover:text-pitch-green transition-colors uppercase italic tracking-widest">{drill.titre}</div>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map((v: number) => (
                      <div key={v} className={`w-1 h-3 rounded-full ${v <= drill.intensite ? 'bg-white/40' : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card-elevated p-10 border-pitch-green/10 bg-pitch-green/[0.01] rounded-[3rem] glass-edge-highlight relative overflow-hidden">
            <div className="flex items-center gap-4 mb-4">
               <Flame size={18} className="text-pitch-green drop-shadow-glow" />
               <div className="text-[11px] font-black text-pitch-green uppercase tracking-[0.5em] italic drop-shadow-glow">Performance_Pulse</div>
            </div>
            <p className="text-[10px] text-white/50 italic leading-relaxed uppercase tracking-[0.2em] font-medium">
              L'ASSIDUITÉ AUX ENTRAÎNEMENTS EST LE PREMIER CRITÈRE DE SÉLECTION POUR LES <span className="text-white font-black drop-shadow-glow">CONVOCATIONS_ELITE</span> DU WEEKEND.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function TrainingCard({ session, isPast }: { session: any, isPast : boolean }) {
  const attendanceRate = session.total_players > 0 
    ? Math.round((session.present_count / session.total_players) * 100) 
    : 0;

  return (
    <Link href={`/coach/training/${session.id}`} className="group relative overflow-hidden block">
      <div className={`glass-card-elevated p-10 border-white/5 bg-navy-deep/40 flex flex-col md:flex-row md:items-center justify-between gap-10 group-hover:bg-white/[0.05] transition duration-700 rounded-[2.5rem] glass-edge-highlight hud-scanline relative overflow-hidden ${isPast ? 'border-l-4 border-l-white/10' : 'border-l-4 border-l-pitch-green shadow-3xl shadow-pitch-green/10'}`}>
        <HudCorners color={isPast ? "#ffffff" : "#4ade80"} opacity={0.1} size={30} />
        
        <div className="flex items-center gap-10 relative z-10">
          <div className="text-center min-w-[70px]">
            <div className={`text-4xl font-black athletic-title italic leading-none drop-shadow-glow ${!isPast ? 'text-pitch-green' : 'text-white'}`}>
               <span>{new Date(session.date).getDate()}</span>
            </div>
            <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mt-2 italic">
              {new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(new Date(session.date))}
            </div>
          </div>

          <div className="h-14 w-px bg-white/10 hidden md:block"></div>

          <div className="space-y-2">
            <div className={`text-[10px] font-black uppercase tracking-[0.4em] italic flex items-center gap-3 ${isPast ? 'text-white/40' : 'text-pitch-green/80'}`}>
               <Calendar size={12} />
               {session.heure} • {session.lieu}
            </div>
            <h4 className="text-2xl font-black text-white uppercase tracking-widest group-hover:text-pitch-green transition-colors italic leading-tight athletic-title drop-shadow-glow">
               {session.titre}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-12 relative z-10">
          {isPast && (
            <div className="text-right">
              <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2 italic">Engagement_Ratio</div>
              <div className="flex items-center gap-4">
                <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <div className="h-full bg-pitch-green transition duration-1000 shadow-[0_0_10px_#4ade80]" style={{ width: `${attendanceRate}%` }} />
                </div>
                <span className="text-base font-black text-white italic athletic-title drop-shadow-glow">{attendanceRate}%</span>
              </div>
            </div>
          )}
          
          <div className="bg-white/5 p-5 rounded-2xl group-hover:bg-pitch-green group-hover:text-navy-deep transition duration-700 border border-white/10 group-hover:border-pitch-green/50 shadow-2xl group-hover:shadow-gold">
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {!isPast && (
          <div className="absolute top-0 right-0 p-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-pitch-green/10 border border-pitch-green/30 rounded-full animate-pulse shadow-glow shadow-pitch-green/20">
               <span className="h-2 w-2 rounded-full bg-pitch-green animate-ping" />
               <span className="text-[10px] font-black text-pitch-green uppercase tracking-widest italic">NEURAL_LIVE</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
