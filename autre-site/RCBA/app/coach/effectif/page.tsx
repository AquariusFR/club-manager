import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";

import PageLabel from "@/components/PageLabel";
import { Users, Search, Filter, ArrowUpDown, MoreHorizontal, User as UserIcon, Shield, Activity, Target } from "lucide-react";
import HudCorners from "@/components/HudCorners";
import MagneticWrapper from "@/components/MagneticWrapper";
import EffectifClient from "@/components/EffectifClient";
import { getPlayerSelectionMerit } from "@/lib/actions";
import { getPlayerCombatGrade } from "@/lib/tactical";
import DashboardClientWrapper, { MotionSection } from "@/components/DashboardClientWrapper";

export default async function EffectifPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const db = await getDb();
  
  // Get coach's team IDs and categories
  let coachTeams = await db.all("SELECT e.id, e.categorie FROM Staff s JOIN Equipes e ON s.equipe_id = e.id WHERE s.email = ?", [session.email]);
  if (coachTeams.length === 0 && (session.roleName.toLowerCase() === 'admin' || session.roleName.toLowerCase() === 'direction')) {
    coachTeams = await db.all("SELECT id, categorie FROM Equipes LIMIT 1");
  }
  const categories = Array.from(new Set(coachTeams.map((t: any) => t.categorie).filter(Boolean)));

  if (categories.length === 0) {
    return (
      <div className="p-8">
        <PageLabel 
          section="Coach"
          category="Effectif"
          title="Mon Effectif"
          subtitle="Vous n'êtes assigné à aucune équipe pour le moment."
          icon="staff"
          variant="blue"
        />
      </div>
    );
  }

  // Fetch players with their team name and latest Flash Forme
  const players = await db.all(`
    SELECT j.*, 
           CASE 
             WHEN l.status_paiement = 'payé' AND l.documents_complets = 1 THEN 'Validée' 
             WHEN l.id IS NOT NULL THEN 'En attente' 
             ELSE 'Non renseignée' 
           END as licence_status, 
           e.nom as equipe_nom,
           f.sdi_score, f.sleep_quality, f.pain_level, f.energy_level, f.stress_level, f.pain_location, f.date as f_date,
           IFNULL(ms.buts, 0) as buts,
           IFNULL(ms.passes, 0) as passes,
           IFNULL(ms.matchs_joues, 0) as matchs_joues,
           ind.indisponibilite_type
    FROM Joueurs j 
    JOIN Equipes e ON j.equipe_id = e.id 
    LEFT JOIN Licences l ON j.id = l.joueur_id
    LEFT JOIN (
      SELECT joueur_id, sdi_score, sleep_quality, pain_level, energy_level, stress_level, pain_location, date,
             ROW_NUMBER() OVER(PARTITION BY joueur_id ORDER BY date DESC) as rn
      FROM FlashFormeLogs
    ) f ON j.id = f.joueur_id AND f.rn = 1
    LEFT JOIN (
      SELECT joueur_id, 
             SUM(buts) as buts, 
             SUM(passes) as passes,
             SUM(CASE WHEN minutes_jouees > 0 THEN 1 ELSE 0 END) as matchs_joues
      FROM MatchStats
      GROUP BY joueur_id
    ) ms ON j.id = ms.joueur_id
    LEFT JOIN (
      SELECT joueur_id, type as indisponibilite_type,
             ROW_NUMBER() OVER(PARTITION BY joueur_id ORDER BY created_at DESC) as rn
      FROM Indisponibilites
      WHERE date_fin IS NULL OR date_fin >= date('now')
    ) ind ON j.id = ind.joueur_id AND ind.rn = 1
    WHERE e.categorie IN (${categories.map(() => '?').join(',')})
    ORDER BY e.nom ASC, j.nom ASC, j.prenom ASC
  `, categories);

  const playersWithDetails = [];
  for (const player of players) {
    const meritData = await getPlayerSelectionMerit(player);
    playersWithDetails.push({
      ...player,
      meritData,
      combatGrade: getPlayerCombatGrade(player)
    });
  }

  const teams = Array.from(new Set<string>(players.map((p: any) => p.equipe_nom)));

  return (
    <DashboardClientWrapper>
      <div className="space-y-10 pb-20 hud-grain min-h-screen">
        <div className="relative">
          <PageLabel 
            section="Coach"
            category="Management"
            title="Mon Effectif"
            subtitle={`Gestion complète de vos ${players.length} joueurs — Analyse SDI, Mérite et Performance.`}
            icon="staff"
            variant="gold"
          />
          
          <div className="absolute top-0 right-0 p-8 hidden lg:block">
            <div className="flex gap-4">
               <div className="px-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-3xl glass-edge-highlight shadow-3xl">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic mb-1">Équipes Coachées</div>
                  <div className="flex items-center gap-2">
                    {teams.map((team: any, i) => (
                      <span key={i} className="text-sm font-black text-gold uppercase italic tracking-tighter athletic-title">
                        {team}
                        {i < teams.length - 1 && <span className="text-white/20 mx-2">/</span>}
                      </span>
                    ))}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <EffectifClient initialPlayers={playersWithDetails} teams={teams} />
      </div>
    </DashboardClientWrapper>
  );
}
