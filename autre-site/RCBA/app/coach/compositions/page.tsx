import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import PageLabel from "@/components/PageLabel";
import LineupBuilder from "@/components/LineupBuilder";
import { getPlayerSelectionMerit } from "@/lib/actions";

export default async function CoachCompositionsPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const db = await getDb();
  
  // Get coach's team IDs
  let staff = await db.get("SELECT equipe_id FROM Staff WHERE email = ?", [session.email]);
  if (!staff && (session.roleName.toLowerCase() === 'admin' || session.roleName.toLowerCase() === 'direction')) {
    const firstTeam = await db.get("SELECT id as equipe_id FROM Equipes LIMIT 1");
    if (firstTeam) staff = firstTeam;
  }
  
  if (!staff || !staff.equipe_id) {
    return <div className="p-20 text-center text-white/80 uppercase font-black tracking-widest italic">Equipe non configurée</div>;
  }

  // Fetch players for the lineup
  const players = await db.all(`
    SELECT j.id, j.nom, j.prenom, j.poste, f.sdi_score
    FROM Joueurs j 
    LEFT JOIN (
      SELECT joueur_id, sdi_score, ROW_NUMBER() OVER(PARTITION BY joueur_id ORDER BY date DESC) as rn
      FROM FlashFormeLogs
    ) f ON j.id = f.joueur_id AND f.rn = 1
    WHERE j.equipe_id = ?
    ORDER BY j.nom ASC
  `, [staff.equipe_id]);

  // We could calculate merit here, but it's expensive. I'll just skip it for the simple lineup builder or do a lightweight version.
  
  // Fetch upcoming matches
  const matches = await db.all(`
    SELECT id, adversaire, date, heure, type 
    FROM Evenements 
    WHERE equipe_id = ? AND date >= CURRENT_DATE AND (type = 'match' OR type = 'tournoi')
    ORDER BY date ASC, heure ASC
    LIMIT 5
  `, [staff.equipe_id]);

  return (
    <div className="flex-1 animate-in fade-in slide-in-from-bottom-8 duration-1000 space-y-12 pb-20 p-8 lg:p-12 hud-grain">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-white/5 relative overflow-hidden glass-edge-highlight">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gold/5 blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-40 animate-pulse" />
        
        <div>
          <PageLabel 
            section="Staff"
            category="Tactical"
            title="Lineup Builder"
            subtitle="Préparez vos compositions d'équipe pour les prochaines échéances."
            variant="gold"
            icon="tactical"
          />
        </div>
      </header>

      <LineupBuilder players={players} matches={matches} />
    </div>
  );
}
