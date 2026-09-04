import { getSession } from "@/lib/authentication";
import PageLabel from "@/components/PageLabel";
import Palmares from "@/components/home/Palmares";
import LegendOfTheMonth from "@/components/home/LegendOfTheMonth";
import { getDb } from "@/lib/db";

export default async function PalmaresPage() {
  const session = await getSession();
  const db = await getDb();

  let legendOfTheMonth = await db.get(`
    SELECT id, nom, prenom, poste, photo_url, equipe_nom, score, type
    FROM (
      SELECT j.id, j.nom, j.prenom, j.poste, j.photo_url, e.nom as equipe_nom,
             (COALESCE(j.aptitude_technique, 3) + COALESCE(j.aptitude_mentale, 3) + COALESCE(j.aptitude_physique, 3) + COALESCE(j.aptitude_tactique, 3)) as score,
             'Joueur' as type
      FROM Joueurs j
      LEFT JOIN Equipes e ON j.equipe_id = e.id
      WHERE j.photo_url IS NOT NULL AND j.photo_url != ''
      
      UNION ALL
      
      SELECT s.id, s.nom, s.prenom, s.role as poste, s.photo_url, e.nom as equipe_nom,
             15 as score,
             'Coach' as type
      FROM Staff s
      LEFT JOIN Equipes e ON s.equipe_id = e.id
      WHERE s.photo_url IS NOT NULL AND s.photo_url != ''
    )
    ORDER BY RANDOM()
    LIMIT 1
  `).catch(() => null);

  if (!legendOfTheMonth) {
    legendOfTheMonth = {
      nom: "RCBA",
      prenom: "L'ESPRIT",
      poste: "Club",
      photo_url: null,
      equipe_nom: "Toutes les équipes",
      type: "Club"
    };
  }

  // Fetch palmares from DB or fallback to authentic achievements
  let palmaresItems = await db.all(`
    SELECT id, titre, competition, saison, medaille
    FROM Palmares
    ORDER BY id DESC
  `).catch(() => []);

  if (!palmaresItems || palmaresItems.length === 0) {
    palmaresItems = [
      {
        id: 1,
        titre: "Double Labellisation FFF Bronze",
        competition: "Label Jeunes FFF & Label Féminines FFF (2023-2026)",
        saison: "2023 - 2026",
        medaille: "🏆"
      },
      {
        id: 2,
        titre: "Accession Régionale 2 Ligue",
        competition: "Championnat U18 Régional — Ligue Centre-Val de Loire",
        saison: "2023 - 2024",
        medaille: "🥇"
      },
      {
        id: 3,
        titre: "Champion Départemental 4 & Montée D3",
        competition: "Championnat Seniors — District d'Eure-et-Loir",
        saison: "2022 - 2023",
        medaille: "🥇"
      },
      {
        id: 4,
        titre: "Création Historique du RCBA",
        competition: "Fusion fondatrice du FC Bû et du CO Abondant",
        saison: "2020",
        medaille: "🎖️"
      },
      {
        id: 5,
        titre: "Finaliste Coupe d'Eure-et-Loir",
        competition: "Coupe Départementale U15 — District 28",
        saison: "2023 - 2024",
        medaille: "🥈"
      },
      {
        id: 6,
        titre: "Vainqueur Tournoi Interdistricts",
        competition: "Plateau d'Honneur U11 Printemps",
        saison: "2024 - 2025",
        medaille: "🏆"
      }
    ];
  }

  return (
    <main className="min-h-screen bg-navy-deep text-white selection:bg-gold/30 pb-40">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <PageLabel 
          section="Le Club" 
          category="Histoire & Récompenses" 
          title="Palmarès & Légendes" 
          subtitle="Les moments de gloire, labellisations officielles FFF et personnalités qui forgent l'identité du Racing Club Bû Abondant."
          icon="club"
          variant="gold"
        />

        <div className="mt-12">
          <Palmares items={palmaresItems} />
        </div>

        <div className="mt-16">
          <LegendOfTheMonth legend={legendOfTheMonth} />
        </div>
      </div>
    </main>
  );
}
