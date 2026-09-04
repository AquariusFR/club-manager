'use server';

import { getDb } from './db';
import { getSession } from './authentication';
import { revalidatePath } from 'next/cache';
import { sendSubstitutionNotification } from './notifications';
import { PERFORMANCE_CONFIG } from './config/performance';

export async function saveRPEAction(data: { intensity: number; mood: 'great' | 'okay' | 'tired'; fatigue: number }) {
  const session = await getSession();
  if (!session || !session.playerId) {
    return { error: "Non autorisé" };
  }

  const db = await getDb();
  
  try {
    await db.run(`
      INSERT INTO PlayerPerformanceLogs (joueur_id, intensity, mood, fatigue)
      VALUES (?, ?, ?, ?)
    `, [session.playerId, data.intensity, data.mood, data.fatigue]);

    revalidatePath('/parents/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error saving RPE:", error);
    return { error: "Erreur lors de l'enregistrement des données de performance." };
  }
}

export async function getPlayerRPEHistory(playerId: number) {
  const db = await getDb();
  return await db.all(`
    SELECT * FROM PlayerPerformanceLogs 
    WHERE joueur_id = ? 
    ORDER BY date DESC 
    LIMIT 10
  `, [playerId]);
}

export async function getClubRPEAverages() {
  const db = await getDb();
  return await db.get(`
    SELECT 
      AVG(intensity) as avg_intensity,
      AVG(fatigue) as avg_fatigue,
      COUNT(*) as total_logs
    FROM PlayerPerformanceLogs
    WHERE date >= date('now', '-7 days')
  `);
}
export interface RPETrend {
  day: string;
  avg_intensity: number;
  avg_fatigue: number;
}

export async function getClubRPETrends(days: number = 14, teamId?: number): Promise<RPETrend[]> {
  const db = await getDb();
  let query = `
    SELECT 
      date(p.date) as day,
      AVG(p.intensity) as avg_intensity,
      AVG(p.fatigue) as avg_fatigue
    FROM PlayerPerformanceLogs p
  `;
  
  const queryParams: (number | string)[] = [];
  
  if (teamId) {
    query += ` JOIN Joueurs j ON p.joueur_id = j.id WHERE j.equipe_id = ? AND p.date >= date('now', '-' || ? || ' days') `;
    queryParams.push(teamId, days);
  } else {
    query += ` WHERE p.date >= date('now', '-' || ? || ' days') `;
    queryParams.push(days);
  }

  query += `
    GROUP BY day
    ORDER BY day ASC
  `;
  
  return await db.all(query, queryParams);
}

export async function getPlayerRPETrends(playerId: number, days: number = 14) {
  const db = await getDb();
  return await db.all(`
    SELECT 
      date(date) as day,
      AVG(intensity) as avg_intensity,
      AVG(fatigue) as avg_fatigue
    FROM PlayerPerformanceLogs
    WHERE joueur_id = ? AND date >= date('now', '-' || ? || ' days')
    GROUP BY day
    ORDER BY day ASC
  `, [playerId, days]);
}

export async function getPlayerWellnessHistory(playerId: number, days: number = 14) {
  const db = await getDb();
  return await db.all(`
    SELECT 
      date,
      sleep_quality,
      energy_level,
      pain_level,
      pain_location,
      stress_level,
      nutrition_hydration,
      sdi_score
    FROM FlashFormeLogs
    WHERE joueur_id = ? AND date >= date('now', '-' || ? || ' days')
    ORDER BY date DESC
  `, [playerId, days]);
}

// ==========================================
// FLASH FORME & COACHING ACTIONS
// ==========================================

export async function submitFlashForme(data: {
  sleep_quality: number;
  energy_level: number;
  pain_level: number;
  pain_location?: string;
  stress_level: number;
  nutrition_hydration: number;
}) {
  const session = await getSession();
  if (!session || !session.playerId) {
    return { error: "Non autorisé" };
  }

  const db = await getDb();

  // SDI Algorithm: ((Sleep * 1.5) + Energy + Pain + Stress) / 5.5
  // Max possible: ((5 * 1.5) + 5 + 5 + 5) / 5.5 = 22.5 / 5.5 = ~4.09
  // To get a percentage, we divide by 4.0909 and multiply by 100
  const maxScore = (5 * 1.5) + 5 + 5 + 5;
  const currentScore = (data.sleep_quality * 1.5) + data.energy_level + data.pain_level + data.stress_level;
  const sdi_score = Math.round((currentScore / maxScore) * 100);

  try {
    await db.run(`
      INSERT INTO FlashFormeLogs (joueur_id, sleep_quality, energy_level, pain_level, pain_location, stress_level, nutrition_hydration, sdi_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      session.playerId, 
      data.sleep_quality, 
      data.energy_level, 
      data.pain_level, 
      data.pain_location || null, 
      data.stress_level, 
      data.nutrition_hydration, 
      sdi_score
    ]);

    revalidatePath('/joueur/flash-forme');
    return { success: true, sdi_score };
  } catch (error) {
    console.error("Error saving Flash Forme:", error);
    return { error: "Erreur lors de l'enregistrement du formulaire." };
  }
}

export interface SDILog {
  id: number;
  prenom: string;
  nom: string;
  niveau_technique: number;
  sdi_score: number | null;
  sleep_quality: number | null;
  pain_level: number | null;
  date: string | null;
}

export async function getPlayersSDI(teamId: number): Promise<SDILog[]> {
  const db = await getDb();
  // Fetch latest SDI for each player in the team
  return await db.all(`
    SELECT j.id, j.prenom, j.nom, j.niveau_technique, f.sdi_score, f.sleep_quality, f.pain_level, f.date
    FROM Joueurs j
    LEFT JOIN (
      SELECT joueur_id, sdi_score, sleep_quality, pain_level, date,
             ROW_NUMBER() OVER(PARTITION BY joueur_id ORDER BY date DESC) as rn
      FROM FlashFormeLogs
    ) f ON j.id = f.joueur_id AND f.rn = 1
    WHERE j.equipe_id = ?
    ORDER BY j.nom ASC
  `, [teamId]);
}

export async function getRetentionAlerts(teamId?: number) {
  const db = await getDb();
  // Find players who have 3 consecutive logs with stress_level <= 2 or energy_level <= 2
  // For simplicity, we just check if the average of their last 3 logs is <= 2
  let query = `
    SELECT j.id, j.prenom, j.nom, j.telephone, e.nom as equipe_nom,
           AVG(f.stress_level) as avg_stress,
           AVG(f.energy_level) as avg_energy,
           COUNT(f.id) as log_count
    FROM Joueurs j
    JOIN Equipes e ON j.equipe_id = e.id
    JOIN FlashFormeLogs f ON j.id = f.joueur_id
    WHERE f.date >= date('now', '-' || ? || ' days')
  `;
  
  const queryParams: (string | number)[] = [PERFORMANCE_CONFIG.THRESHOLDS.RETENTION.DAYS_LOOKBACK];
  
  if (teamId) {
    query += ` AND e.id = ? `;
    queryParams.push(teamId);
  }
  
  query += `
    GROUP BY j.id
    HAVING log_count >= ? AND (avg_stress <= ? OR avg_energy <= ?)
  `;
  
  queryParams.push(
    PERFORMANCE_CONFIG.THRESHOLDS.RETENTION.MIN_LOGS,
    PERFORMANCE_CONFIG.THRESHOLDS.RETENTION.STRESS_MAX,
    PERFORMANCE_CONFIG.THRESHOLDS.RETENTION.ENERGY_MIN
  );
  
  return await db.all(query, queryParams);
}

export async function getOverloadAlerts(teamId?: number) {
  const db = await getDb();
  // Find teams where the average fatigue from old PlayerPerformanceLogs > 3.5 over last 7 days
  let query = `
    SELECT e.id, e.nom, AVG(p.fatigue) as avg_team_fatigue, COUNT(p.id) as total_logs
    FROM Equipes e
    JOIN Joueurs j ON e.id = j.equipe_id
    JOIN PlayerPerformanceLogs p ON j.id = p.joueur_id
    WHERE p.date >= date('now', '-' || ? || ' days')
  `;
  
  const queryParams: (string | number)[] = [PERFORMANCE_CONFIG.LOOKBACK.ALERTS_DAYS];
  
  if (teamId) {
    query += ` AND e.id = ? `;
    queryParams.push(teamId);
  }
  
  query += `
    GROUP BY e.id
    HAVING avg_team_fatigue > ?
  `;
  
  queryParams.push(PERFORMANCE_CONFIG.THRESHOLDS.FATIGUE.WARNING);
  
  return await db.all(query, queryParams);
}

export async function getSDIAlerts(teamId?: number) {
  const db = await getDb();
  // Find players with SDI < 60 (Critical) or SDI > 90 (Peak) in their latest log
  let query = `
    SELECT j.id, j.prenom, j.nom, e.nom as equipe_nom, f.sdi_score, f.date
    FROM Joueurs j
    JOIN Equipes e ON j.equipe_id = e.id
    JOIN (
      SELECT joueur_id, sdi_score, date,
             ROW_NUMBER() OVER(PARTITION BY joueur_id ORDER BY date DESC) as rn
      FROM FlashFormeLogs
      WHERE date >= date('now', '-' || ? || ' days')
    ) f ON j.id = f.joueur_id AND f.rn = 1
    WHERE (f.sdi_score < ? OR f.sdi_score > ?)
  `;
  
  const queryParams: (string | number)[] = [
    PERFORMANCE_CONFIG.LOOKBACK.ALERTS_DAYS,
    PERFORMANCE_CONFIG.THRESHOLDS.SDI.CRITICAL,
    PERFORMANCE_CONFIG.THRESHOLDS.SDI.PEAK
  ];
  
  if (teamId) {
    query += ` AND e.id = ? `;
    queryParams.push(teamId);
  }
  
  query += ` ORDER BY f.sdi_score ASC `;
  
  return await db.all(query, queryParams);
}

export async function getClubWellnessAverages(teamId?: number) {
  const db = await getDb();
  const lookback = PERFORMANCE_CONFIG.LOOKBACK.ALERTS_DAYS;
  
  let baseQuery = `FROM FlashFormeLogs f `;
  let whereClause = `WHERE f.date >= date('now', '-' || ? || ' days') `;
  const queryParams: (string | number)[] = [];

  if (teamId) {
    baseQuery += `JOIN Joueurs j ON f.joueur_id = j.id `;
    whereClause += `AND j.equipe_id = ? `;
  }

  // Current period (last 7 days)
  const current = await db.get(`
    SELECT 
      AVG(sleep_quality) as avg_sleep,
      AVG(nutrition_hydration) as avg_nutrition,
      AVG(energy_level) as avg_energy,
      AVG(stress_level) as avg_stress,
      COUNT(*) as total_logs
    ${baseQuery}
    ${whereClause}
  `, [...queryParams, lookback, ...(teamId ? [teamId] : [])]);

  // Previous period (7-14 days ago)
  const previous = await db.get(`
    SELECT 
      AVG(sleep_quality) as avg_sleep,
      AVG(nutrition_hydration) as avg_nutrition,
      AVG(energy_level) as avg_energy,
      AVG(stress_level) as avg_stress
    ${baseQuery}
    WHERE f.date >= date('now', '-' || ? || ' days') 
      AND f.date < date('now', '-' || ? || ' days')
      ${teamId ? 'AND j.equipe_id = ?' : ''}
  `, [...queryParams, lookback * 2, lookback, ...(teamId ? [teamId] : [])]);

  return {
    current,
    previous,
    total_logs: current.total_logs
  };
}

export async function getPainAlerts(teamId?: number) {
  const db = await getDb();
  // Find players with pain_level >= 4 in their latest log
  // AND count how many times they reported pain >= 4 in the lookback period
  let query = `
    SELECT 
      j.id, j.prenom, j.nom, e.nom as equipe_nom, 
      f.pain_level, f.pain_location, f.date,
      (SELECT COUNT(*) FROM FlashFormeLogs WHERE joueur_id = j.id AND pain_level >= ? AND date >= date('now', '-' || ? || ' days')) as frequency
    FROM Joueurs j
    JOIN Equipes e ON j.equipe_id = e.id
    JOIN (
      SELECT joueur_id, pain_level, pain_location, date,
             ROW_NUMBER() OVER(PARTITION BY joueur_id ORDER BY date DESC) as rn
      FROM FlashFormeLogs
      WHERE date >= date('now', '-' || ? || ' days')
    ) f ON j.id = f.joueur_id AND f.rn = 1
    WHERE f.pain_level >= ?
  `;
  
  const queryParams: (string | number)[] = [
    PERFORMANCE_CONFIG.THRESHOLDS.PAIN.CRITICAL_LEVEL,
    PERFORMANCE_CONFIG.LOOKBACK.ALERTS_DAYS,
    PERFORMANCE_CONFIG.LOOKBACK.ALERTS_DAYS,
    PERFORMANCE_CONFIG.THRESHOLDS.PAIN.CRITICAL_LEVEL
  ];
  
  if (teamId) {
    query += ` AND e.id = ? `;
    queryParams.push(teamId);
  }
  
  query += ` ORDER BY f.pain_level DESC, frequency DESC `;
  
  return await db.all(query, queryParams);
}

export async function generateBalancedTeams(teamId: number) {
  // Fetch players with SDI and technique
  const players = await getPlayersSDI(teamId);
  
  // Sort players by an overall score: SDI (max 100) + Technique (max 10 * 10)
  // Let's assume technique is out of 10.
  const sortedPlayers = players.map((p) => {
    const sdi = p.sdi_score || 50;
    const technique = (p.niveau_technique || 5) * 10;
    return {
      ...p,
      overall_score: sdi + technique
    };
  }).sort((a, b) => b.overall_score - a.overall_score);

  // Snake draft distribution to balance teams
  const teamA = [];
  const teamB = [];
  let scoreA = 0;
  let scoreB = 0;

  for (let i = 0; i < sortedPlayers.length; i++) {
    const p = sortedPlayers[i];
    if (scoreA <= scoreB) {
      teamA.push(p);
      scoreA += p.overall_score;
    } else {
      teamB.push(p);
      scoreB += p.overall_score;
    }
  }

  return { teamA, teamB, scoreA, scoreB };
}

export async function getCoachSubstitutions() {
  const db = await getDb();
  return await db.all(`
    SELECT s.*, u.prenom, u.nom, sub.prenom as sub_prenom, sub.nom as sub_nom
    FROM CoachSubstitutions s
    JOIN Users u ON s.coach_id = u.id
    LEFT JOIN Users sub ON s.substitute_coach_id = sub.id
    ORDER BY s.date DESC
  `);
}

export async function getCoachesAction() {
  const db = await getDb();
  return await db.all(`
    SELECT u.id, u.prenom, u.nom, u.email, u.roleName
    FROM Users u
    WHERE u.roleName = 'Coach'
    ORDER BY u.nom ASC
  `);
}

export async function assignSubstitutionAction(substitutionId: number, substituteCoachId: number) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur')) {
    return { error: "Non autorisé" };
  }

  const db = await getDb();
  try {
    // 1. Get substitution and coach details
    const substitution = await db.get("SELECT * FROM CoachSubstitutions WHERE id = ?", [substitutionId]);
    const coach = await db.get("SELECT * FROM Users WHERE id = ?", [substituteCoachId]);

    if (!substitution || !coach) {
      return { error: "Remplacement ou Coach introuvable" };
    }

    // 2. Validation: Check if coach is already assigned on this date
    const existing = await db.get(`
      SELECT id FROM CoachSubstitutions 
      WHERE substitute_coach_id = ? AND date = ? AND id != ? AND status = 'FILLED'
    `, [substituteCoachId, substitution.date, substitutionId]);

    if (existing) {
      return { error: `Ce coach est déjà assigné à un autre remplacement le ${substitution.date}.` };
    }

    // 3. Update the database
    await db.run(`
      UPDATE CoachSubstitutions 
      SET substitute_coach_id = ?, status = 'FILLED'
      WHERE id = ?
    `, [substituteCoachId, substitutionId]);

    // 4. Send notification
    await sendSubstitutionNotification(coach, substitution);

    revalidatePath('/direction/performance');
    revalidatePath('/direction/performance/remplacements');
    return { success: true };
  } catch (error) {
    console.error("Error assigning substitution:", error);
    return { error: "Erreur lors de l'assignation du remplacement." };
  }
}

export async function cancelSubstitutionAction(substitutionId: number) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur')) {
    return { error: "Non autorisé" };
  }

  const db = await getDb();
  try {
    await db.run(`
      UPDATE CoachSubstitutions 
      SET status = 'CANCELLED'
      WHERE id = ?
    `, [substitutionId]);

    revalidatePath('/direction/performance');
    revalidatePath('/direction/performance/remplacements');
    return { success: true };
  } catch (error) {
    console.error("Error cancelling substitution:", error);
    return { error: "Erreur lors de l'annulation du remplacement." };
  }
}

export async function requestSubstitution(date: string, reason: string) {
  const session = await getSession();
  if (!session || !session.userId) return { error: "Non autorisé" };

  const db = await getDb();
  await db.run(`
    INSERT INTO CoachSubstitutions (coach_id, date, reason)
    VALUES (?, ?, ?)
  `, [session.userId, date, reason]);
  
  revalidatePath('/direction/performance');
  return { success: true };
}

// ==========================================
// PARENT HEALTH LOG
// ==========================================

export async function getPlayerFlashFormeHistory(playerId: number, limit: number = 14) {
  const db = await getDb();
  return await db.all(`
    SELECT 
      id, joueur_id, sleep_quality, energy_level, pain_level,
      pain_location, stress_level, nutrition_hydration, sdi_score,
      date, created_at
    FROM FlashFormeLogs
    WHERE joueur_id = ?
    ORDER BY date DESC
    LIMIT ?
  `, [playerId, limit]);
}

export async function getPlayerWellnessSummary(playerId: number) {
  const db = await getDb();
  const last7 = await db.get(`
    SELECT 
      AVG(sleep_quality)        as avg_sleep,
      AVG(energy_level)         as avg_energy,
      AVG(pain_level)           as avg_pain,
      AVG(stress_level)         as avg_stress,
      AVG(nutrition_hydration)  as avg_nutrition,
      AVG(sdi_score)            as avg_sdi,
      COUNT(*)                  as total_logs
    FROM FlashFormeLogs
    WHERE joueur_id = ? AND date >= date('now', '-7 days')
  `, [playerId]);

  const prev7 = await db.get(`
    SELECT AVG(sdi_score) as avg_sdi_prev
    FROM FlashFormeLogs
    WHERE joueur_id = ? 
      AND date >= date('now', '-14 days')
      AND date < date('now', '-7 days')
  `, [playerId]);

  return { ...last7, avg_sdi_prev: prev7?.avg_sdi_prev ?? null };
}
