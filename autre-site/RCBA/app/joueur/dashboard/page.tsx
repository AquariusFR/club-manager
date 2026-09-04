import { getSession } from "@/lib/authentication";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, ShieldAlert, FileText, ArrowRight, Activity, TrendingUp, MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function JoueurDashboard() {
  const session = await getSession();
  if (!session) redirect('/login');
  let playerId = session.playerId;

  const db = await getDb();

  if (!playerId && (session.roleName === 'Direction' || session.roleName.toLowerCase() === 'admin')) {
    const firstPlayer = await db.get("SELECT id FROM Joueurs LIMIT 1");
    if (firstPlayer) {
      playerId = firstPlayer.id;
    }
  }

  if (!playerId) {
    return <div className="text-white text-center py-20">Profil joueur introuvable.</div>;
  }

  // Get player details
  const player = await db.get(`
    SELECT j.*, e.nom as equipe_nom, e.categorie
    FROM Joueurs j
    LEFT JOIN Equipes e ON j.equipe_id = e.id
    WHERE j.id = ?
  `, [playerId]);

  if (!player) {
    return <div className="text-white text-center py-20">Profil joueur introuvable.</div>;
  }

  const upcomingEvents = await db.all(`
    SELECT e.*, c.id as convocation_id, cr.statut as reponse_statut
    FROM Evenements e
    LEFT JOIN Convocations c ON e.id = c.evenement_id
    LEFT JOIN ConvocationResponses cr ON c.id = cr.convocation_id AND cr.joueur_id = ?
    WHERE e.equipe_id = ? AND date(e.date) >= date('now')
    ORDER BY date(e.date) ASC, e.heure ASC
    LIMIT 5
  `, [playerId, player.equipe_id]);

  // Get messages from coach
  const messages = await db.all(`
    SELECT m.*, s.nom, s.prenom, s.role 
    FROM Messages m
    LEFT JOIN Staff s ON m.sender_id = s.id AND m.sender_role = 'Coach'
    WHERE m.receiver_type = 'equipe' AND m.target_id = ?
    ORDER BY m.created_at DESC
    LIMIT 10
  `, [player.equipe_id]);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl athletic-title italic text-white uppercase tracking-wider mb-2">
            Salut <span className="text-sky-400">{player.prenom}</span>
          </h2>
          <p className="text-sm font-bold text-white/70 uppercase tracking-widest italic flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
            Équipe: {player.equipe_nom}
          </p>
        </div>
        
        <Link href="/joueur/flash-forme" className="group relative px-6 py-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition overflow-hidden flex items-center gap-3 backdrop-blur-xl">
          <Activity size={18} className="text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] italic text-white/80">Remplir Flash Forme</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-card p-6 border-white/5 backdrop-blur-xl bg-white/[0.02]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg athletic-title italic text-white uppercase tracking-widest flex items-center gap-3">
                <Calendar className="text-sky-400" size={20} /> Mon Programme
              </h3>
            </div>
            
            <div className="space-y-3">
              {upcomingEvents.map((ev: any) => (
                <div key={ev.id} className="p-4 rounded-xl border border-white/5 bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-sm">
                        {ev.type}
                      </span>
                      <span className="text-xs font-bold text-white/70 uppercase tracking-wider">
                        {format(new Date(ev.date), 'dd MMM yyyy', { locale: fr })} à {ev.heure}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-white capitalize">{ev.titre}</p>
                    <p className="text-xs text-white/50">{ev.lieu}</p>
                  </div>
                  
                  {ev.convocation_id && (
                    <div className="shrink-0 flex flex-col items-end">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                        ev.reponse_statut === 'présent' ? 'bg-pitch-green/10 text-pitch-green border border-pitch-green/20' : 
                        ev.reponse_statut === 'absent' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 
                        'bg-gold/10 text-gold border border-gold/20'
                      }`}>
                        {ev.reponse_statut || 'EN ATTENTE'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              
              {upcomingEvents.length === 0 && (
                <div className="text-center py-8 text-white/50 text-xs font-bold uppercase tracking-widest italic border border-dashed border-white/10 rounded-xl">
                  Aucun événement à venir
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6 border-white/5 backdrop-blur-xl bg-white/[0.02]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg athletic-title italic text-white uppercase tracking-widest flex items-center gap-3">
                <TrendingUp className="text-gold" size={20} /> Ma Progression
              </h3>
              <Link href="/parents/reports" className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-white transition-colors flex items-center gap-1">
                Tous les rapports <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-white/5 bg-black/40 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Technique</p>
                <p className="text-2xl font-black text-white">{player.aptitude_technique}/5</p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-black/40 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Tactique</p>
                <p className="text-2xl font-black text-white">{player.aptitude_tactique}/5</p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-black/40 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Physique</p>
                <p className="text-2xl font-black text-white">{player.aptitude_physique}/5</p>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-black/40 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Mental</p>
                <p className="text-2xl font-black text-white">{player.aptitude_mentale}/5</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 border-white/5 backdrop-blur-xl bg-white/[0.02] h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg athletic-title italic text-white uppercase tracking-widest flex items-center gap-3">
                <MessageCircle className="text-sky-400" size={20} /> Mots du Coach
              </h3>
            </div>
            
            <div className="space-y-4 flex-1">
              {messages.map((msg: any) => (
                <div key={msg.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
                      {msg.prenom} {msg.nom}
                    </span>
                    <span className="text-[9px] text-white/40 font-bold">
                      {format(new Date(msg.created_at), 'dd MMM', { locale: fr })}
                    </span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}

              {messages.length === 0 && (
                <div className="text-center py-10 flex flex-col items-center justify-center h-full text-white/40">
                  <MessageCircle size={32} className="mb-4 opacity-50" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic">Aucun message</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
