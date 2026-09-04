import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import PageLabel from "@/components/PageLabel";
import DashboardClientWrapper, { MotionSection } from "@/components/DashboardClientWrapper";
import MagneticWrapper from "@/components/MagneticWrapper";
import { Save, Activity, Target, Shield, Zap, TrendingUp, AlertCircle, FileText, Phone, Mail, Users, Video } from "lucide-react";
import { saveMatchObservation, getPlayerSelectionMerit, updatePlayerPoste, calculateDynamicPlayerAnalysis } from "@/lib/actions";
import { getPlayerCombatGrade } from "@/lib/tactical";
import { getPlayerCategoryByAge } from "@/lib/utils";

export default async function JoueurPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect('/login');

  const db = await getDb();
  
  // Verify coach's access to this player
  let coachTeams = await db.all("SELECT e.categorie FROM Staff s JOIN Equipes e ON s.equipe_id = e.id WHERE s.email = ?", [session.email]);
  if (coachTeams.length === 0 && (session.roleName.toLowerCase() === 'admin' || session.roleName.toLowerCase() === 'direction')) {
    coachTeams = await db.all("SELECT categorie FROM Equipes");
  }
  const categories = Array.from(new Set(coachTeams.map((t: any) => t.categorie).filter(Boolean)));

  const player = await db.get(`
    SELECT j.*, e.nom as equipe_nom
    FROM Joueurs j
    JOIN Equipes e ON j.equipe_id = e.id
    WHERE j.id = ? AND e.categorie IN (${categories.map(() => '?').join(',')})
  `, [id, ...categories]);

  if (!player) {
    redirect('/coach/effectif');
  }

  const observations = await db.all(`
    SELECT o.*, u.username as coach_name
    FROM Observations o
    LEFT JOIN Users u ON o.coach_id = u.id
    WHERE o.joueur_id = ?
    ORDER BY o.date DESC
  `, [player.id]);

  const dynamicAnalysis = await calculateDynamicPlayerAnalysis(player.id);
  if (dynamicAnalysis) {
    player.aptitude_technique = dynamicAnalysis.final.tech;
    player.aptitude_tactique = dynamicAnalysis.final.tac;
    player.aptitude_physique = dynamicAnalysis.final.phy;
    player.aptitude_mentale = dynamicAnalysis.final.men;
  }

  const meritData = await getPlayerSelectionMerit(player);
  const combatGrade = getPlayerCombatGrade(player);

  const indisponibilites = await db.all(`
    SELECT * FROM Indisponibilites
    WHERE joueur_id = ?
    ORDER BY created_at DESC
  `, [player.id]);

  const matchStats = await db.all(`
    SELECT ms.*, e.titre, e.date, e.adversaire 
    FROM MatchStats ms
    JOIN Evenements e ON ms.evenement_id = e.id
    WHERE ms.joueur_id = ?
    ORDER BY e.date DESC
  `, [player.id]);

  const totalStats = matchStats.reduce((acc: any, stat: any) => ({
    buts: acc.buts + stat.buts,
    passes: acc.passes + stat.passes,
    cartons_jaunes: acc.cartons_jaunes + stat.cartons_jaunes,
    carton_rouge: acc.carton_rouge + stat.carton_rouge,
    minutes_jouees: acc.minutes_jouees + stat.minutes_jouees,
  }), { buts: 0, passes: 0, cartons_jaunes: 0, carton_rouge: 0, minutes_jouees: 0 });

  const recentMatches = await db.all(`
    SELECT id, titre, date, adversaire 
    FROM Evenements 
    WHERE equipe_id = ? AND type = 'match' AND date <= date('now')
    ORDER BY date DESC LIMIT 10
  `, [player.equipe_id]);

  const videoStats = await db.all(`
    SELECT action_type, COUNT(*) as count
    FROM VideoTags
    WHERE joueur_id = ?
    GROUP BY action_type
    ORDER BY count DESC
  `, [player.id]);

  const today = new Date();
  let isBirthday = false;
  let formattedDateNaissance = "";

  if (player.date_naissance) {
    const birthDate = new Date(player.date_naissance);
    isBirthday = birthDate.getDate() === today.getDate() && birthDate.getMonth() === today.getMonth();
    formattedDateNaissance = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(birthDate);
  }

  const categorieExacte = player.categorie_actuelle || getPlayerCategoryByAge(player.date_naissance);
  const teamsInCategory = await db.all("SELECT id, nom FROM Equipes WHERE categorie = ?", [categorieExacte]);

  const subtitleContent = (
    <div className="flex flex-col gap-1">
      <span>Catégorie: {categorieExacte} | Poste: {player.poste || 'Non défini'} | Équipe: {player.equipe_nom}</span>
      {formattedDateNaissance && (
        <span className="text-white/60 text-lg">
          Né(e) le {formattedDateNaissance}
          {isBirthday && (
            <span className="ml-3 text-gold animate-pulse inline-flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
              🎂 Joyeux Anniversaire !
            </span>
          )}
        </span>
      )}
    </div>
  );

  return (
    <DashboardClientWrapper>
      <div className="space-y-10 pb-20 hud-grain min-h-screen">
        <PageLabel 
          section="Coach"
          category="Effectif"
          title={`${player.prenom} ${player.nom}`}
          subtitle={subtitleContent}
          icon="staff"
          variant="gold"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 1: Stats & Formulaire d'Observation */}
          <div className="lg:col-span-2 space-y-8">
            <MotionSection>
              <div className="glass-card-elevated p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01] relative overflow-hidden glass-edge-highlight">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <Activity size={24} />
                  </div>
                  <div className="flex-1 flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-black text-white italic uppercase tracking-widest drop-shadow-glow">Aptitudes & Notation</h2>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Mise à jour des notes et observations</p>
                    </div>
                    
                    {/* Selecteur de poste */}
                    <form action={async (formData) => {
                      "use server";
                      await updatePlayerPoste(formData);
                    }} className="flex items-center gap-2 bg-white/[0.02] border border-white/10 rounded-xl p-2 pr-2">
                      <input type="hidden" name="joueur_id" value={player.id} />
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                        <Target size={16} />
                      </div>
                      <select 
                        name="poste" 
                        defaultValue={player.poste || "Non défini"}
                        className="bg-transparent border-none text-[10px] font-black text-white uppercase tracking-widest italic outline-none cursor-pointer appearance-none px-2"
                      >
                        <option value="Non défini" className="bg-navy-deep">Poste: Non défini</option>
                        <option value="Gardien" className="bg-navy-deep">Gardien</option>
                        <option value="Défenseur" className="bg-navy-deep">Défenseur</option>
                        <option value="Milieu" className="bg-navy-deep">Milieu</option>
                        <option value="Attaquant" className="bg-navy-deep">Attaquant</option>
                      </select>
                      <button type="submit" className="w-8 h-8 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold flex items-center justify-center transition-colors">
                        <Save size={14} />
                      </button>
                    </form>

                    {/* Selecteur d'équipe (si plusieurs équipes dans la catégorie) */}
                    {teamsInCategory.length > 1 && (
                      <form action={async (formData) => {
                        "use server";
                        const { updatePlayerEquipeAction } = await import('@/lib/actions');
                        await updatePlayerEquipeAction(formData);
                      }} className="flex items-center gap-2 bg-white/[0.02] border border-white/10 rounded-xl p-2 pr-2">
                        <input type="hidden" name="joueur_id" value={player.id} />
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/60">
                          <Users size={16} />
                        </div>
                        <select 
                          name="equipe_id" 
                          defaultValue={player.equipe_id}
                          className="bg-transparent border-none text-[10px] font-black text-white uppercase tracking-widest italic outline-none cursor-pointer appearance-none px-2"
                        >
                          {teamsInCategory.map((t: any) => (
                            <option key={t.id} value={t.id} className="bg-navy-deep">{t.nom}</option>
                          ))}
                        </select>
                        <button type="submit" className="w-8 h-8 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold flex items-center justify-center transition-colors">
                          <Save size={14} />
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {dynamicAnalysis?.synthese && (
                  <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic mb-2">Bilan Analytique Dynamique</h3>
                    <p className="text-xs text-blue-200/80 italic leading-relaxed">
                      {dynamicAnalysis.synthese}
                    </p>
                  </div>
                )}

                <form action={async (formData) => {
                  "use server";
                  await saveMatchObservation(formData);
                }} className="space-y-8">
                  <input type="hidden" name="joueur_id" value={player.id} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['technique', 'tactique', 'physique', 'mentale'].map((apt) => {
                      const baseKey = apt.substring(0, 3) as 'tech' | 'tac' | 'phy' | 'men';
                      const baseVal = dynamicAnalysis?.base[baseKey] || 3;
                      const finalVal = dynamicAnalysis?.final[baseKey] || 3;
                      const diff = (finalVal - baseVal).toFixed(1);
                      const isPos = finalVal > baseVal;
                      const isNeg = finalVal < baseVal;
                      
                      let colorClass = "text-white";
                      let bgClass = "bg-white";
                      let accentClass = "accent-white";

                      if (apt === 'technique') { colorClass = "text-gold"; bgClass = "bg-gold"; accentClass = "accent-gold"; }
                      if (apt === 'tactique') { colorClass = "text-blue-400"; bgClass = "bg-blue-400"; accentClass = "accent-blue-400"; }
                      if (apt === 'physique') { colorClass = "text-pitch-green"; bgClass = "bg-pitch-green"; accentClass = "accent-pitch-green"; }
                      if (apt === 'mentale') { colorClass = "text-purple-400"; bgClass = "bg-purple-400"; accentClass = "accent-purple-400"; }

                      return (
                        <div key={apt} className="space-y-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                          <label className="text-[10px] font-black text-white/60 uppercase tracking-widest italic flex justify-between items-center">
                            <span>{apt}</span>
                            <div className="flex gap-2 items-center">
                              {(isPos || isNeg) && (
                                <span className={`text-[9px] font-black ${isPos ? 'text-pitch-green' : 'text-red-500'} flex items-center bg-white/5 px-2 py-0.5 rounded`}>
                                  {isPos ? '↗' : '↘'} {Math.abs(Number(diff))}
                                </span>
                              )}
                              <span className={`${colorClass} text-sm`}>{finalVal}/5</span>
                            </div>
                          </label>
                          
                          {/* Visual Bar */}
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                             <div className={`absolute top-0 left-0 h-full ${bgClass} opacity-30`} style={{ width: `${(baseVal/5)*100}%` }} />
                             <div className={`absolute top-0 left-0 h-full ${bgClass} shadow-[0_0_10px_currentColor]`} style={{ width: `${(finalVal/5)*100}%` }} />
                          </div>

                          {/* Range for manual override */}
                          <div className="pt-2">
                            <span className="text-[8px] text-white/30 block mb-1 uppercase tracking-widest italic">Note Coach :</span>
                            <input 
                              type="range" name={`apt_${apt}`} min="1" max="5" defaultValue={baseVal}
                              className={`w-full ${accentClass}`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-white/60 uppercase tracking-widest italic">Nouvelle Observation (Efforts, Progrès, Axes d'amélioration)</label>
                    <textarea 
                      name="observation"
                      required
                      placeholder="Commentaire sur la performance ou l'attitude..."
                      className="w-full h-32 bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-[12px] font-bold text-white focus:border-gold/50 focus:ring-4 focus:ring-gold/5 outline-none transition placeholder:text-white/20 resize-none italic"
                    />
                  </div>

                  <div className="flex justify-end">
                    <MagneticWrapper>
                      <button type="submit" className="flex items-center gap-3 px-8 py-4 bg-gold text-navy-deep rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-bright transition italic shadow-luminous">
                        <Save size={16} /> Enregistrer l'observation
                      </button>
                    </MagneticWrapper>
                  </div>
                </form>
              </div>
            </MotionSection>

            {/* Historique des observations */}
            <MotionSection delay={0.2}>
              <div className="glass-card-elevated p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01] relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-widest drop-shadow-glow">Historique des Observations</h2>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{observations.length} Notes existantes</p>
                  </div>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                  {observations.length > 0 ? (
                    observations.map((obs: any, idx: number) => (
                      <div key={idx} className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl hover:border-white/20 transition">
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">
                            Par {obs.coach_name || 'Staff'} le {new Date(obs.date).toLocaleDateString('fr-FR')}
                          </div>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-black text-white/60">T: {obs.apt_technique || '-'}</span>
                            <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-black text-white/60">Ta: {obs.apt_tactique || '-'}</span>
                            <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-black text-white/60">P: {obs.apt_physique || '-'}</span>
                            <span className="px-2 py-1 bg-white/5 rounded text-[8px] font-black text-white/60">M: {obs.apt_mentale || '-'}</span>
                          </div>
                        </div>
                        <p className="text-sm text-white/80 italic">{obs.contenu}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-10 text-center border border-white/5 rounded-2xl border-dashed">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Aucune observation enregistrée</p>
                    </div>
                  )}
                </div>
              </div>
            </MotionSection>
            {/* Statistiques Match */}
            <MotionSection delay={0.3}>
              <div className="glass-card-elevated p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01] relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-pitch-green/10 border border-pitch-green/20 flex items-center justify-center text-pitch-green shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-widest drop-shadow-glow">Statistiques en Match</h2>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Buts, Passes, Cartons</p>
                  </div>
                </div>

                {/* Saisie de nouvelles stats */}
                {recentMatches.length > 0 ? (
                  <form action={async (formData) => {
                    "use server";
                    const { saveMatchStats } = await import('@/lib/actions');
                    await saveMatchStats(formData);
                  }} className="mb-8 p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
                    <input type="hidden" name="joueur_id" value={player.id} />
                    <h3 className="text-sm font-black text-white italic mb-4">Saisir les stats d'un match</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <select name="evenement_id" required className="col-span-2 md:col-span-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[12px] font-bold text-white outline-none">
                        <option value="">Sélectionner un match récent...</option>
                        {recentMatches.map((m: any) => (
                          <option key={m.id} value={m.id}>{new Date(m.date).toLocaleDateString('fr-FR')} - {m.adversaire}</option>
                        ))}
                      </select>
                      <div>
                        <label className="block text-[10px] font-black text-white/40 uppercase mb-1">Buts</label>
                        <input type="number" name="buts" min="0" defaultValue="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-white/40 uppercase mb-1">Passes Déc.</label>
                        <input type="number" name="passes" min="0" defaultValue="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-white/40 uppercase mb-1">C. Jaunes</label>
                        <input type="number" name="cartons_jaunes" min="0" defaultValue="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-white/40 uppercase mb-1">C. Rouges</label>
                        <input type="number" name="carton_rouge" min="0" max="1" defaultValue="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-black text-white/40 uppercase mb-1">Minutes Jouées</label>
                        <input type="number" name="minutes_jouees" min="0" max="120" defaultValue="90" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button type="submit" className="px-6 py-3 bg-white/10 hover:bg-pitch-green hover:text-navy-deep text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition italic">
                        Enregistrer
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-[10px] text-white/40 mb-8 italic">Aucun match récent enregistré pour cette équipe.</p>
                )}

                {/* Historique des stats */}
                <div className="space-y-3">
                  {matchStats.length > 0 ? matchStats.map((ms: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                      <div>
                        <div className="text-sm font-bold text-white">{ms.adversaire}</div>
                        <div className="text-[10px] text-white/40">{new Date(ms.date).toLocaleDateString('fr-FR')} - {ms.minutes_jouees || 0} min</div>
                      </div>
                      <div className="flex gap-4 text-center">
                        <div>
                          <div className="text-lg font-black text-pitch-green">{ms.buts}</div>
                          <div className="text-[8px] text-white/40 uppercase">Buts</div>
                        </div>
                        <div>
                          <div className="text-lg font-black text-blue-400">{ms.passes}</div>
                          <div className="text-[8px] text-white/40 uppercase">Passes</div>
                        </div>
                        <div>
                          <div className="text-lg font-black text-yellow-500">{ms.cartons_jaunes}</div>
                          <div className="text-[8px] text-white/40 uppercase">CJ</div>
                        </div>
                        <div>
                          <div className="text-lg font-black text-red-500">{ms.carton_rouge}</div>
                          <div className="text-[8px] text-white/40 uppercase">CR</div>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-6 text-center border border-white/5 rounded-xl border-dashed">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Aucune statistique enregistrée</p>
                    </div>
                  )}
                </div>
              </div>
            </MotionSection>

            {/* Analyse Vidéo (Tags) */}
            <MotionSection delay={0.35}>
              <div className="glass-card-elevated p-8 rounded-[2.5rem] border-purple-500/10 bg-purple-500/[0.01] relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                    <Video size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-widest drop-shadow-glow">Analyse Vidéo</h2>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Actions taguées en vidéo</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {videoStats.length > 0 ? videoStats.map((stat: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center">
                      <span className="text-xs font-bold text-white/80">{stat.action_type}</span>
                      <span className="text-lg font-black text-purple-400">{stat.count}</span>
                    </div>
                  )) : (
                    <div className="col-span-2 p-6 text-center border border-white/5 rounded-xl border-dashed">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Aucune donnée vidéo</p>
                    </div>
                  )}
                </div>
              </div>
            </MotionSection>

            {/* Indisponibilités */}
            <MotionSection delay={0.4}>
              <div className="glass-card-elevated p-8 rounded-[2.5rem] border-red-500/10 bg-red-500/[0.02] relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-widest drop-shadow-glow">Indisponibilités</h2>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Blessures & Suspensions</p>
                  </div>
                </div>

                <form action={async (formData) => {
                  "use server";
                  const { addIndisponibilite } = await import('@/lib/actions');
                  await addIndisponibilite(formData);
                }} className="mb-8 p-6 bg-white/[0.02] border border-red-500/10 rounded-2xl">
                  <input type="hidden" name="joueur_id" value={player.id} />
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-white/40 uppercase mb-1">Type</label>
                      <select name="type" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[12px] font-bold text-white outline-none">
                        <option value="blessure">Blessure</option>
                        <option value="suspension">Suspension</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase mb-1">Date Début</label>
                      <input type="date" name="date_debut" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-white/40 uppercase mb-1">Date Fin (estimée)</label>
                      <input type="date" name="date_fin" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-white/40 uppercase mb-1">Matchs Suspendus (si suspension)</label>
                      <input type="number" name="nb_matchs" min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-white/40 uppercase mb-1">Raison / Détails</label>
                      <input type="text" name="raison" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" placeholder="Ex: Entorse cheville droite" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="px-6 py-3 bg-red-500/20 hover:bg-red-500 hover:text-white text-red-500 border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition italic">
                      Déclarer Indisponible
                    </button>
                  </div>
                </form>

                {/* Historique indispos */}
                <div className="space-y-3">
                  {indisponibilites.length > 0 ? indisponibilites.map((ind: any, i: number) => {
                    const isActive = (!ind.date_fin || new Date(ind.date_fin) >= new Date()) && ind.type === 'blessure';
                    return (
                      <div key={i} className={`flex justify-between items-center p-4 bg-white/[0.02] border rounded-xl ${isActive ? 'border-red-500/50' : 'border-white/5'}`}>
                        <div>
                          <div className="text-sm font-bold text-white capitalize flex items-center gap-2">
                            {ind.type} {isActive && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                          </div>
                          <div className="text-[10px] text-white/40">
                            Du {new Date(ind.date_debut).toLocaleDateString('fr-FR')} 
                            {ind.date_fin ? ` au ${new Date(ind.date_fin).toLocaleDateString('fr-FR')}` : ' (En cours)'}
                          </div>
                          {ind.raison && <div className="text-xs text-white/60 italic mt-1">{ind.raison}</div>}
                          {ind.nb_matchs > 0 && <div className="text-xs text-red-400 font-bold mt-1">{ind.nb_matchs} match(s) de suspension</div>}
                        </div>
                        <form action={async () => {
                          "use server";
                          const { deleteIndisponibilite } = await import('@/lib/actions');
                          await deleteIndisponibilite(ind.id, player.id);
                        }}>
                          <button type="submit" className="text-white/20 hover:text-red-500 transition-colors p-2">
                            ✕
                          </button>
                        </form>
                      </div>
                    );
                  }) : (
                    <div className="p-6 text-center border border-white/5 rounded-xl border-dashed">
                      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] italic">Aucune indisponibilité</p>
                    </div>
                  )}
                </div>
              </div>
            </MotionSection>
          </div>

          {/* Section 2: Profil & Badge (Sidebar) */}
          <div className="space-y-8">
            <MotionSection delay={0.1}>
              <div className="glass-card-elevated p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01] relative overflow-hidden flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gold/20 mb-4 mx-auto relative group flex items-center justify-center bg-gold/10 text-gold text-3xl font-black italic">
                  {player.photo_url && !player.photo_url.includes('ui-avatars.com') ? (
                    <img src={player.photo_url} alt={`${player.prenom} ${player.nom}`} className="w-full h-full object-cover" />
                  ) : (
                    <span>{player.prenom?.[0] || ''}{player.nom?.[0] || ''}</span>
                  )}
                </div>
                
                <form action={async (formData) => {
                  "use server";
                  const { updatePlayerPhotoAction } = await import('@/lib/actions');
                  const url = formData.get('photo_url') as string;
                  await updatePlayerPhotoAction(player.id, url);
                }} className="w-full flex flex-col gap-2 mt-2 mb-6">
                  <input 
                    type="url" 
                    name="photo_url" 
                    placeholder="URL de la photo" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[10px] text-white focus:outline-none focus:border-gold/50"
                  />
                  <button type="submit" className="w-full py-2 rounded-xl bg-gold/10 border border-gold/40 text-gold font-black text-[9px] uppercase tracking-widest hover:bg-gold hover:text-navy-deep transition">
                    Mettre à jour la photo
                  </button>
                </form>

                <div className={`text-6xl ${combatGrade?.color || 'text-white'} font-black italic drop-shadow-glow my-6`}>
                  {combatGrade?.grade || 'N/A'}
                </div>
                <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic mb-6">Grade de Combat</div>
                
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />
                
                {/* Contacts Block */}
                <div className="w-full space-y-4 mb-6">
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4 text-left glass-edge-highlight">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <Phone size={24} />
                      </div>
                      <div>
                        <div className="text-[12px] font-black text-white/40 uppercase tracking-widest italic mb-1">Téléphone</div>
                        <div className="text-3xl font-black text-white tracking-wider">
                          {player.telephone || 'Non renseigné'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full h-[1px] bg-white/5 my-2" />

                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gold/10 rounded-xl text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                        <Mail size={24} />
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-[12px] font-black text-white/40 uppercase tracking-widest italic mb-1">Email</div>
                        <div className="text-xl font-bold text-white/90 truncate">
                          {player.email || 'Non renseigné'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />
                
                <div className="w-full space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic flex items-center gap-2">
                      <Target size={12} className="text-gold" /> Mérite
                    </span>
                    <span className="text-lg font-black text-white italic">{meritData.score}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic flex items-center gap-2">
                      <Shield size={12} className="text-blue-400" /> Statut
                    </span>
                    <span className="text-xs font-black text-white italic bg-white/10 px-3 py-1 rounded-lg">{meritData.status}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic flex items-center gap-2">
                      <Zap size={12} className="text-pitch-green" /> Mental
                    </span>
                    <span className="text-lg font-black text-white italic">{player.mental_score || 0}</span>
                  </div>
                </div>
              </div>
            </MotionSection>
          </div>
        </div>
      </div>
    </DashboardClientWrapper>
  );
}
