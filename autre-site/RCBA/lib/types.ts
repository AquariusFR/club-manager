export interface Joueur {
  id: number;
  nom: string;
  prenom: string;
  equipe_id: number;
  mental_score: number;
  poste: string;
  statut: string;
  photo_url: string;
  date_naissance: string;
  nationalite: string;
  club_precedent_id: number | null;
  aptitude_technique: number;
  aptitude_tactique: number;
  aptitude_physique: number;
  aptitude_mentale: number;
  telephone: string;
  categorie_actuelle: string;
  email: string;
  num_licence: string;
  adresse: string;
  numero_maillot: number;
}

export interface Equipe {
  id: number;
  nom: string;
  categorie: string;
}

export interface Resultat {
  id: number;
  equipe_id: number;
  date: string;
  adversaire: string;
  score: string;
  statut: string;
  equipe_nom?: string; // from join
}

export interface CalendrierMatch {
  id: number;
  equipe_id: number;
  competition: string;
  journee: string;
  date: string;
  domicile: string;
  exterieur: string;
  score_domicile: number;
  score_exterieur: number;
  statut: string;
  equipe_nom?: string; // from join
}

export interface User {
  id: number;
  email: string;
  role: string;
  staff_id: number | null;
  player_id: number | null;
}

export interface Evenement {
  id: number;
  equipe_id: number;
  titre: string;
  date: string;
  heure: string;
  lieu: string;
  adversaire: string;
  type: string;
}

export interface Staff {
  id: number;
  nom: string;
  prenom: string;
  role: string;
  telephone: string;
  email: string;
  role_priority: number;
}
