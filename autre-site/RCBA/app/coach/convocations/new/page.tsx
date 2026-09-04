import { getDb } from "@/lib/db";
import PageLabel from "@/components/PageLabel";
import { getSession } from "@/lib/authentication";
import { getPlayerSelectionMerit, createEventAction } from "@/lib/actions";
import { Trophy, Users, Shield, Zap, Target, ArrowRight, Sparkles, Send } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewConvocationPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const db = await getDb();
  
  // 1. Identify Coach's Team
  let staff = await db.get("SELECT equipe_id FROM Staff WHERE email = ?", [session.email]);
  
  if (!staff && (session.roleName.toLowerCase() === 'admin' || session.roleName.toLowerCase() === 'direction')) {
    const firstTeam = await db.get("SELECT id as equipe_id FROM Equipes LIMIT 1");
    if (firstTeam) staff = firstTeam;
  }

  if (!staff) {
    return (
      <div className="p-12 glass-card bg-rose-500/5 border-rose-500/20 text-center">
        <h2 className="athletic-title text-2xl text-rose-500 mb-4">Erreur de Configuration</h2>
        <p className="text-white/60">Votre compte staff n'est associé à aucune équipe. Contactez la Direction.</p>
      </div>
    );
  }

  const equipe = await db.get("SELECT * FROM Equipes WHERE id = ?", [staff.equipe_id]);
  
  // 2. Fetch Team Roster with Licence Status
  const players = await db.all(`
    SELECT j.*, e.nom as equipe_nom,
           CASE 
             WHEN l.status_paiement = 'payé' AND l.documents_complets = 1 THEN 1 
             ELSE 0 
           END as licence_validee
    FROM Joueurs j
    LEFT JOIN Licences l ON j.id = l.joueur_id
    JOIN Equipes e ON j.equipe_id = e.id
    WHERE e.categorie = ?
    ORDER BY j.equipe_id = ? DESC, j.nom ASC
  `, [equipe.categorie, staff.equipe_id]);

  // 3. Process Merit Scores
  const playersWithMerit = [];
  for (const p of players) {
    const metrics = await getPlayerSelectionMerit(p);
    playersWithMerit.push({
      ...p,
      metrics
    });
  }

  return (
    <form action={async (formData) => {
      'use server'
      const res = await createEventAction(formData);
      if (!session) redirect('/login');
    }} className="space-y-12 animate-in fade-in duration-1000 pb-20">
      <input type="hidden" name="equipe_id" value={equipe.id} />
      
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-4 border-b border-white/5">
        <PageLabel 
          section="Staff"
          category="Opérations"
          title="Squad Builder"
          subtitle={`Sélection Elite pour ${equipe.nom} — Excellence RCBA`}
          variant="green"
          icon="coach"
        />

        <button type="submit" className="group flex items-center gap-6 bg-white text-navy-deep px-10 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-gold transition shadow-2xl shadow-white/5 border border-white/10 active:scale-95 italic">
          DÉPLOYER LA SQUAD
          <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
        </button>
      </header>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left: Match Settings */}
        <div className="lg:col-span-4 space-y-8">
          <section className="glass-card p-10 border-white/5 bg-white/[0.01]">
            <h3 className="athletic-title text-xl mb-8 flex items-center gap-4 italic">
              <Shield className="text-gold" size={24} /> CONFIGURATION <span className="text-white/60">MATCH</span>
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest pl-1 italic">Titre de l'Événement</label>
                <input name="titre" placeholder="ex: Championnat Régional" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/30 transition font-bold" required />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest pl-1 italic">Adversaire</label>
                <input name="adversaire" placeholder="ex: AS Sartrouville" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/30 transition font-bold" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/60 uppercase tracking-widest pl-1 italic">Date</label>
                  <input name="date" type="date" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/30 transition font-bold" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/60 uppercase tracking-widest pl-1 italic">Heure</label>
                  <input name="heure" type="time" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/30 transition font-bold" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest pl-1 italic">Lieu</label>
                <input name="lieu" placeholder="ex: Stade Municipal de Bù" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/30 transition font-bold" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest pl-1 italic">Type de Match</label>
                <select name="type" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-gold/30 transition font-bold appearance-none italic">
                  <option value="CHAMPIONNAT">Championnat</option>
                  <option value="COUPE">Coupe</option>
                  <option value="AMICAL">Match Amical</option>
                  <option value="TOURNOI">Tournoi</option>
                </select>
              </div>
            </div>
          </section>

          <section className="glass-card p-10 border-gold/10 bg-gold/[0.01] relative overflow-hidden group">
            <h3 className="athletic-title text-xl mb-8 flex items-center gap-4 italic text-gold">
              <Send size={24} /> DIFFUSION <span className="text-white/60">AUTO</span>
            </h3>
            
            <div className="space-y-6">
              <label className="flex items-center justify-between p-6 bg-white/[0.03] rounded-2xl border border-white/5 cursor-pointer hover:bg-white/[0.05] transition group/opt">
                <div>
                  <div className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5 italic">Diffuser Immédiatement</div>
                  <div className="text-[9px] text-white/80 italic font-bold">Envoi Email + SMS à la squad</div>
                </div>
                <div className="relative inline-flex items-center">
                  <input type="checkbox" name="immediate_dispatch" className="sr-only peer" />
                  <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition peer-checked:bg-gold shadow-inner"></div>
                </div>
              </label>
            </div>
            
            <p className="text-[10px] text-white/80 italic mt-6 pl-1">
              * Les parents recevront un lien direct vers leur portail de réponse Aura Glass.
            </p>
          </section>

          <section className="glass-card p-8 border-gold/10 bg-gold/[0.02]">
            <div className="flex items-center gap-4 text-gold mb-4">
              <Zap size={20} fill="currentColor" />
              <span className="text-[10px] font-black uppercase tracking-widest italic">Aide à la Décision</span>
            </div>
            <p className="text-sm text-white/70 italic leading-relaxed">
              Le <span className="text-white font-bold">Synergy Engine</span> analyse les dernières évaluations physiques et mentales pour suggérer les joueurs les plus "Prêts au Combat".
            </p>
          </section>
        </div>

        {/* Right: Player Selection Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="athletic-title text-2xl flex items-center gap-3 italic">
              <Users className="text-gold" size={24} /> ROSTER <span className="text-white/60">SELECTION</span>
            </h3>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{players.length} Joueurs Disponibles</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {playersWithMerit.map((player: any) => (
              <label key={player.id} className={`relative group block ${player.licence_validee ? 'cursor-pointer' : 'cursor-not-allowed opacity-60 grayscale'}`}>
                <input type="checkbox" name="players" value={player.id} className="peer sr-only" disabled={!player.licence_validee} />
                <div className={`glass-card p-6 border-white/5 bg-white/[0.01] flex items-center justify-between transition duration-500
                  ${player.licence_validee ? 'group-hover:bg-white/[0.03] peer-checked:bg-gold/[0.05] peer-checked:border-gold/40 hover:shadow-gold' : ''}`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm border shadow-xl transition duration-700 relative overflow-hidden ${player.metrics.isTopPerformer ? 'bg-gold/10 border-gold/30 text-gold' : 'bg-white/5 border-white/5 text-white/70'}`}>
                        {player.photo_url ? (
                          <img src={player.photo_url} alt={`${player.prenom} ${player.nom}`} className="w-full h-full object-cover absolute inset-0" />
                        ) : (
                          <>{player.prenom[0]}{player.nom[0]}</>
                        )}
                        {player.metrics.isTopPerformer && player.licence_validee && <Sparkles size={12} className="absolute -top-1 -right-1 text-gold animate-pulse z-10" />}
                      </div>
                      <div>
                      <div className="text-sm font-black text-white group-hover:text-gold transition-colors uppercase tracking-tight">{player.prenom} {player.nom}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Target size={10} className="text-white/80" />
                        <span className="text-[9px] text-white/80 font-bold uppercase tracking-[0.2em]">{player.poste} • {player.equipe_nom}</span>
                      </div>
                      {!player.licence_validee && (
                        <div className="text-[8px] font-black text-rose-500 uppercase tracking-widest mt-1">Licence non validée</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-black athletic-title tracking-tight ${player.metrics.merit >= 80 ? 'text-gold' : 'text-white/60'}`}>
                      {player.metrics.merit}%
                    </div>
                    <div className="text-[8px] font-black text-white/80 uppercase tracking-widest italic mt-1">Merit</div>
                  </div>

                  {/* Prestige Indicator */}
                  {player.licence_validee && (
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gold/0 peer-checked:bg-gold shadow-[0_0_8px_#d4af37] transition" />
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
