import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import PageLabel from "@/components/PageLabel";
import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Clock,
  Shield,
  Send,
  Trophy
} from "lucide-react";
import MagneticWrapper from "@/components/MagneticWrapper";

export default async function ConvocationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect('/login');
  const db = await getDb();
  
  const convocation = await db.get("SELECT * FROM Convocations WHERE id = ?", [id]);
  if (!convocation) redirect('/coach/convocations');

  const responses = await db.all(`
    SELECT cr.*, j.nom, j.prenom, j.poste
    FROM ConvocationResponses cr
    JOIN Joueurs j ON cr.joueur_id = j.id
    WHERE cr.convocation_id = ?
    ORDER BY j.nom ASC, j.prenom ASC
  `, [id]);

  const stats = {
    present: responses.filter(r => r.statut === 'présent').length,
    absent: responses.filter(r => r.statut === 'absent').length,
    incertain: responses.filter(r => r.statut === 'incertain').length,
    total: responses.length
  };

  return (
    <main className="min-h-screen bg-navy-deep relative overflow-hidden hud-grain">
      <div className="container mx-auto px-6 py-16 relative z-10 space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5 relative">
          <PageLabel 
            section="Staff"
            category="Opérations"
            title="Détail Dispatch"
            subtitle={`Log de déploiement: ${convocation.titre}`}
            variant="green"
            icon="coach"
          />
          
          <MagneticWrapper>
            <form action={async () => {
              'use server';
              const { getDb } = await import('@/lib/db');
              const { triggerDispatchAction } = await import('@/lib/actions');
              await triggerDispatchAction(parseInt(id));
            }}>
              <button className="group flex items-center gap-4 bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gold hover:text-navy-deep hover:border-gold transition shadow-xl shadow-gold/20">
                <Send size={16} /> Relancer Dispatch
              </button>
            </form>
          </MagneticWrapper>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card-elevated p-8 border-pitch-green/20 bg-pitch-green/5 rounded-[2rem]">
              <h3 className="athletic-title text-xl text-pitch-green italic mb-6">INTEL MISSION</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Shield size={16} className="text-white/40" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-white/40 tracking-widest">Type</div>
                    <div className="text-sm font-bold text-white uppercase">{convocation.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Trophy size={16} className="text-white/40" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-white/40 tracking-widest">Adversaire</div>
                    <div className="text-sm font-bold text-white uppercase">{convocation.adversaire}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Calendar size={16} className="text-white/40" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-white/40 tracking-widest">Date & Heure</div>
                    <div className="text-sm font-bold text-white uppercase">{new Date(convocation.date).toLocaleDateString('fr-FR')} - {convocation.heure}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin size={16} className="text-white/40" />
                  <div>
                    <div className="text-[10px] font-black uppercase text-white/40 tracking-widest">Lieu</div>
                    <div className="text-sm font-bold text-white uppercase">{convocation.lieu}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card-elevated p-8 border-white/5 bg-navy-deep/40 rounded-[2rem]">
              <h3 className="athletic-title text-xl text-white italic mb-6">STATUT SQUAD</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-pitch-green flex items-center gap-2">
                    <CheckCircle2 size={14} /> Présents
                  </span>
                  <span className="athletic-title text-xl text-pitch-green">{stats.present}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 flex items-center gap-2">
                    <XCircle size={14} /> Absents
                  </span>
                  <span className="athletic-title text-xl text-rose-500">{stats.absent}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                    <AlertCircle size={14} /> En Attente
                  </span>
                  <span className="athletic-title text-xl text-gold">{stats.incertain}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="glass-card-elevated border-white/5 bg-navy-deep/40 rounded-[2rem] p-8">
              <h3 className="athletic-title text-2xl text-white italic mb-8">ROSTER DEPLOYMENT</h3>
              
              <div className="space-y-4">
                {responses.map((r: any) => (
                  <div key={r.id} className="flex flex-col p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-[10px] text-white/70">
                          {r.prenom[0]}{r.nom[0]}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white uppercase">{r.prenom} {r.nom}</div>
                          <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">{r.poste}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {r.besoin_covoiturage === 1 && (
                          <span className="px-2 py-1 rounded-md bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[8px] font-black uppercase tracking-widest" title="A besoin d'un covoiturage">🚗 Covoit</span>
                        )}
                        {r.statut === 'présent' && (
                          <span className="px-3 py-1 rounded-full bg-pitch-green/10 border border-pitch-green/20 text-pitch-green text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 size={12} /> Confirmé
                          </span>
                        )}
                        {r.statut === 'absent' && (
                          <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                            <XCircle size={12} /> Indisponible
                          </span>
                        )}
                        {r.statut === 'incertain' && (
                          <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle size={12} /> En Attente
                          </span>
                        )}
                      </div>
                    </div>
                    {r.commentaire && (
                      <div className="pl-14">
                        <div className="bg-navy-deep/50 rounded-lg p-3 border border-white/5 text-[11px] text-white/70 italic">
                          "{r.commentaire}"
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
