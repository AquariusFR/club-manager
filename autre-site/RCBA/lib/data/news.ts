export interface NewsItem {
  id: number;
  titre: string;
  date: string;
  categorie?: string;
  image_url?: string;
  extrait?: string;
  slug?: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  Seniors:    "bg-gold/15 text-gold border-gold/30",
  Club:       "bg-blue-500/15 text-blue-300 border-blue-400/30",
  Jeunes:     "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
  Féminines:  "bg-pink-500/15 text-pink-300 border-pink-400/30",
  Partenaires:"bg-purple-500/15 text-purple-300 border-purple-400/30",
};

export function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 1,
    titre: "Victoire éclatante de nos U18 en Régionale 2",
    date: "2025-06-28",
    categorie: "Jeunes",
    extrait:
      "Un match de haute intensité qui aura tenu le public en haleine jusqu'au coup de sifflet final. Nos U18 réalisent une saison exceptionnelle et confirment leur place dans le top 3 régional.",
  },
  {
    id: 2,
    titre: "Inscriptions 2025/2026 ouvertes pour toutes les catégories",
    date: "2025-06-25",
    categorie: "Club",
    extrait:
      "Les inscriptions pour la nouvelle saison sportive 2025/2026 sont officiellement ouvertes. Retrouvez les tarifs et les modalités sur la page dédiée.",
  },
  {
    id: 3,
    titre: "Nos U13 remportent le tournoi de Jouy-en-Josas",
    date: "2025-06-20",
    categorie: "Jeunes",
    extrait:
      "Magnifique victoire de nos U13 qui ont dominé la compétition de bout en bout. Une belle démonstration du travail effectué tout au long de la saison.",
  },
  {
    id: 4,
    titre: "Label FFF Bronze renouvelé pour 2023–2026",
    date: "2025-06-15",
    categorie: "Club",
    extrait:
      "Le RCBA obtient le renouvellement de son double Label Jeunes et Féminines FFF Bronze, reconnaissant la qualité de notre formation.",
  },
  {
    id: 5,
    titre: "Nouveau partenariat avec Groupe CMA Renault",
    date: "2025-06-10",
    categorie: "Partenaires",
    extrait:
      "Le RCBA renforce ses partenariats locaux avec l'arrivée du Groupe CMA Renault comme partenaire officiel de la saison.",
  },
  {
    id: 6,
    titre: "Journée Portes Ouvertes — Stade de Bû",
    date: "2025-06-05",
    categorie: "Club",
    extrait:
      "La journée portes ouvertes a rassemblé plus de 150 familles. Venez découvrir nos infrastructures et rencontrer les éducateurs.",
  },
  {
    id: 7,
    titre: "Détection U15 Féminines — Inscrivez-vous",
    date: "2025-05-28",
    categorie: "Féminines",
    extrait:
      "La cellule féminine organise une séance de détection pour les joueuses U15. Toutes les informations pratiques dans cet article.",
  },
  {
    id: 8,
    titre: "Tournoi Ivry 2025 — Le bilan",
    date: "2025-05-15",
    categorie: "Jeunes",
    extrait:
      "Retour sur le tournoi d'Ivry 2025 où nos équipes de jeunes ont brillé par leur fair-play et leur niveau technique.",
  },
];
