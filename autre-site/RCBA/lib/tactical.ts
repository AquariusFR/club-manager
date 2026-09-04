import { Joueur } from './types';

export const TACTICAL_REQUIREMENTS = {
  Gardiens: ["Réflexes", "Jeu au pied", "Com. & Placement", "Détente"],
  Défenseurs: ["Duel & Anticipation", "Lecture Tactique", "Relance", "Marquage"],
  Milieux: ["Vision & Passe", "Volume (Endurance)", "Récupération", "Transition"],
  Attaquants: ["Finition", "Vitesse & Explosivité", "Appels & Mobilité", "Pressing"]
};

export type RequirementSet = {
  labels: string[];
  prefix: string;
};

export const getPlayerRequirements = (poste: string | null | undefined): RequirementSet => {
  const p = (poste || "").toLowerCase();
  
  if (p.includes('gardien') || p === 'gk') {
    return { labels: TACTICAL_REQUIREMENTS.Gardiens, prefix: 'gk' };
  }
  
  if (p.includes('défenseur') || p.includes('latéral') || p.includes('def')) {
    return { labels: TACTICAL_REQUIREMENTS.Défenseurs, prefix: 'def' };
  }
  
  if (p.includes('milieu') || p.includes('mid')) {
    return { labels: TACTICAL_REQUIREMENTS.Milieux, prefix: 'mid' };
  }
  
  // Default to Attaquants for FWD, Attaquant, Buteur, Ailier
  return { labels: TACTICAL_REQUIREMENTS.Attaquants, prefix: 'fwd' };
};

export const getRequirementValue = (player: Record<string, any>, prefix: string, index: number): number => {
  const suffixes = {
    gk: ['reflexes', 'pied', 'com', 'detente'],
    def: ['duel', 'lecture', 'relance', 'marquage'],
    mid: ['vision', 'volume', 'recup', 'transition'],
    fwd: ['finition', 'vitesse', 'appel', 'pressing']
  };
  
  const key = `${prefix}_${suffixes[prefix as keyof typeof suffixes][index]}`;
  return player[key] || 3;
};

/**
 * Calculates a global synergy score for the squad based on attribute balancing.
 */
export const calculateSquadSynergy = (players: Partial<Joueur>[]) => {
  if (!players.length) return { score: 0, status: "INACTIF" };

  const squadAvg = {
    technique: players.reduce((sum, p) => sum + (p.aptitude_technique || 3), 0) / players.length,
    tactique: players.reduce((sum, p) => sum + (p.aptitude_tactique || 3), 0) / players.length,
    physique: players.reduce((sum, p) => sum + (p.aptitude_physique || 3), 0) / players.length,
    mental: players.reduce((sum, p) => sum + (p.aptitude_mentale || 3), 0) / players.length,
  };

  const totalPossible = 20; // 4 categories * 5 points
  const currentTotal = squadAvg.technique + squadAvg.tactique + squadAvg.physique + squadAvg.mental;
  const score = (currentTotal / totalPossible) * 100;

  let status = "OPTIMAL";
  if (score < 50) status = "CRITIQUE";
  else if (score < 70) status = "STABLE";

  return { 
    score: Math.round(score), 
    status,
    averages: squadAvg
  };
};

/**
 * Assigns a tactical 'Combat Grade' based on player attributes.
 */
export const getPlayerCombatGrade = (player: Partial<Joueur>) => {
  const avg = (
    (player.aptitude_technique || 3) + 
    (player.aptitude_tactique || 3) + 
    (player.aptitude_physique || 3) + 
    (player.aptitude_mentale || 3)
  ) / 4;

  if (avg >= 4.5) return { grade: "S", color: "text-gold", glow: "shadow-gold/20" };
  if (avg >= 3.8) return { grade: "A", color: "text-pitch-green", glow: "shadow-pitch-green/20" };
  if (avg >= 3.0) return { grade: "B", color: "text-white/80", glow: "shadow-white/10" };
  return { grade: "C", color: "text-white/70", glow: "" };
};
