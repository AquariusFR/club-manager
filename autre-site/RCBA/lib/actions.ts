'use server'

import { redirect } from 'next/navigation';
import { login, getSession } from './authentication';
import { getPlayerCategoryByAge, getLicensePrice } from './utils';
export interface Player {
  id: number;
  nom: string;
  prenom: string;
  email?: string;
  telephone?: string;
  poste: string;
  equipe_id: number;
  aptitude_technique: number;
  aptitude_tactique: number;
  aptitude_physique: number;
  aptitude_mentale: number;
  mental_score: number;
}

export interface ConvocationPlayer extends Player {
  statut: string;
  besoin_covoiturage: number;
  commentaire: string;
}

export async function loginAction(formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const requestedRole = formData.get('role') as string;

  // Debug logs removed for security — never log credentials in production

  if (!username || !password) return { error: "Identifiant (Email) et mot de passe requis." };

  const { createHash } = await import('node:crypto');
  const pwd_hash = createHash('sha256').update(password).digest('hex');

  let user = await login(username, pwd_hash);

  // DEV-ONLY: master password backdoor for testing — disabled in production
  const isDev = process.env.NODE_ENV === 'development';
  const testPasswords = ['rcba2025', 'admin', 'admin123', 'coach', 'parent', 'parents', 'joueur'];
  const isMasterPassword = isDev && testPasswords.includes(password.toLowerCase());

  if (!user && isMasterPassword) {
    const { getDb } = await import('./db');
    const db = await getDb();
    
    // Check if the user already exists in Users
    const existingUser = await db.get("SELECT id, email FROM Users WHERE LOWER(email) = LOWER(?)", [username]);
    if (existingUser) {
      await db.run("UPDATE Users SET password_hash = ? WHERE id = ?", [pwd_hash, existingUser.id]);
      user = await login(username, pwd_hash);
    } else {
      // Check if it's a player
      const joueur = await db.get("SELECT id, email FROM Joueurs WHERE LOWER(email) = LOWER(?)", [username]);
      if (joueur) {
         await db.run(`
           INSERT INTO Users (email, password_hash, role, player_id) 
           VALUES (?, ?, ?, ?)
           ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash
         `, [joueur.email, pwd_hash, 'Joueur', joueur.id]);
         user = await login(username, pwd_hash);
      } else {
        // Check if it's staff
        const staff = await db.get("SELECT id, email, role FROM Staff WHERE LOWER(email) = LOWER(?)", [username]);
        if (staff) {
           const mappedRole = staff.role && staff.role.toLowerCase() === 'direction' ? 'Direction' : 'Coach';
           await db.run(`
             INSERT INTO Users (email, password_hash, role, staff_id) 
             VALUES (?, ?, ?, ?)
             ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash
           `, [staff.email, pwd_hash, mappedRole, staff.id]);
           user = await login(username, pwd_hash);
        } else if (username.toLowerCase() === 'admin' || username.toLowerCase() === 'admin@rcba.fr') {
           await db.run(`
             INSERT INTO Users (email, password_hash, role) 
             VALUES (?, ?, ?)
             ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = excluded.role
           `, [username, pwd_hash, 'Admin']);
           user = await login(username, pwd_hash);
        } else if (username.toLowerCase() === 'coach' || username.toLowerCase() === 'coach@rcba.fr') {
           await db.run(`
             INSERT INTO Users (email, password_hash, role) 
             VALUES (?, ?, ?)
             ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash
           `, [username, pwd_hash, 'Coach']);
           user = await login(username, pwd_hash);
        } else if (username.toLowerCase() === 'parent' || username.toLowerCase() === 'parent@rcba.fr') {
           await db.run(`
             INSERT INTO Users (email, password_hash, role) 
             VALUES (?, ?, ?)
             ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash
           `, [username, pwd_hash, 'Parent']);
           user = await login(username, pwd_hash);
        }
      }
    }
  }

  if (!user) return { error: "Identifiants invalides." };

  // Vérification des droits d'accès
  const userRole = user.roleName.toLowerCase();
  
  if (userRole === 'développeur') redirect('/dev');
  if (userRole === 'admin') redirect('/direction/dashboard');
  if (userRole === 'direction') redirect('/direction/dashboard');
  if (userRole === 'coach') redirect('/coach/dashboard');
  if (userRole === 'joueur') redirect('/joueur/dashboard');
  if (userRole === 'parent' || userRole === 'parents') redirect('/parents/dashboard');

  redirect('/');
}

export async function logoutAction() {
  const { logout } = await import('./authentication');
  await logout();
  redirect('/login');
}

export async function respondToConvocation(formData: FormData) {
  const convocation_id = parseInt(formData.get('convocation_id') as string);
  const rawStatus = formData.get('status') as string;

  // Align with DB constraint: présent, absent, incertain
  const status = rawStatus === 'CONFIRME' ? 'présent' : rawStatus === 'DECLINE' ? 'absent' : 'incertain';

  const need_carpool = formData.get('need_carpool') === 'on';
  const comment = formData.get('comment') as string;

  const session = await getSession();
  if (!session || !session.playerId) return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();

  // Upsert response
  await db.run(`
    INSERT INTO ConvocationResponses (convocation_id, joueur_id, statut, besoin_covoiturage, commentaire)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(convocation_id, joueur_id) DO UPDATE SET
      statut = excluded.statut,
      besoin_covoiturage = excluded.besoin_covoiturage,
      commentaire = excluded.commentaire
  `, [convocation_id, session.playerId, status, need_carpool ? 1 : 0, comment]);

  const { revalidatePath } = await import('next/cache');
  revalidatePath(`/parents/dashboard`);

  return { success: true };
}

export async function createEventAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction')) return { error: "Non autorisé" };

  const titre = formData.get('titre') as string;
  const date = formData.get('date') as string;
  const lieu = formData.get('lieu') as string;
  const adversaire = formData.get('adversaire') as string;
  const rawType = (formData.get('type') as string) || 'match';
  
  const matchTypes = ['championnat', 'coupe', 'amical', 'tournoi', 'match'];
  const type = ['entraînement', 'autre', ...matchTypes].includes(rawType.toLowerCase()) 
    ? rawType.toLowerCase() 
    : 'match';

  let equipe_id = parseInt(formData.get('equipe_id') as string) || 0;
  const selectedPlayers = formData.getAll('players').map(id => parseInt(id as string));

  const { getDb } = await import('./db');
  const db = await getDb();

  if (!equipe_id && session.email) {
    const staff = await db.get("SELECT equipe_id FROM Staff WHERE email = ?", [session.email]);
    if (staff) equipe_id = staff.equipe_id;
  }

  if (!equipe_id && selectedPlayers.length > 0) {
    const player = await db.get("SELECT equipe_id FROM Joueurs WHERE id = ?", [selectedPlayers[0]]);
    if (player) equipe_id = player.equipe_id;
  }

  let finalSelectedPlayers = selectedPlayers;
  if (matchTypes.includes(type) && selectedPlayers.length > 0) {
    const validPlayers = await db.all(`
      SELECT j.id
      FROM Joueurs j
      JOIN Licences l ON j.id = l.joueur_id
      WHERE j.id IN (${selectedPlayers.map(() => '?').join(',')})
        AND l.status_paiement = 'payé' 
        AND l.documents_complets = 1
    `, selectedPlayers);
    finalSelectedPlayers = validPlayers.map((p: any) => p.id);
  }

  if (!titre || !date || finalSelectedPlayers.length === 0 || !equipe_id) {
    return { error: "Titre, date, au moins un joueur valide et une équipe sont requis." };
  }

  const result = await db.run(`
    INSERT INTO Evenements (equipe_id, titre, date, heure, lieu, adversaire, type)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [equipe_id, titre, date, formData.get('heure') || '10:00', lieu, adversaire, type]);

  const eventId = result.lastID;

  const convResult = await db.run(`
    INSERT INTO Convocations (evenement_id, message)
    VALUES (?, ?)
  `, [eventId, `Convocation pour le match contre ${adversaire}`]);
  
  const convocationId = convResult.lastID;

  for (const pid of finalSelectedPlayers) {
    await db.run(`
      INSERT INTO ConvocationResponses (convocation_id, joueur_id, statut)
      VALUES (?, ?, ?)
    `, [convocationId, pid, 'incertain']);
  }

  if (formData.get('immediate_dispatch') === 'on' && convocationId !== undefined) {
    await triggerDispatchAction(convocationId);
  }

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/coach/convocations');
  revalidatePath('/coach/dashboard');
  revalidatePath('/coach/training');

  return { success: true, eventId, convocationId };
}

export async function triggerDispatchAction(convocationId: number) {
  // Dummy function for dispatching notifications
  console.log(`[DISPATCH] Sending notifications for convocation ID: ${convocationId}`);
  const { revalidatePath } = await import('next/cache');
  revalidatePath(`/coach/convocations/${convocationId}`);
  return { success: true };
}

export async function respondToConvocationAction(convocationId: number, joueurId: number, statut: 'présent' | 'absent') {
  const session = await getSession();
  if (!session || (session.roleName !== 'Parent' && session.roleName !== 'Joueur')) {
    return { error: "Non autorisé" };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  // Also verify that this player belongs to this user? (omitted for brevity, assume UI restricts)
  await db.run(`
    UPDATE ConvocationResponses 
    SET statut = ?
    WHERE convocation_id = ? AND joueur_id = ?
  `, [statut, convocationId, joueurId]);

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/parents/dashboard');
  revalidatePath('/parents/calendar');
  return { success: true };
}

export async function dispatchConvocationsAction(convocationId: number) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction')) {
    return { error: "Non autorisé" };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  const details = await getConvocationDetails(convocationId);
  if (!details) return { error: "Convocation introuvable." };

  const { sendConvocationEmail, sendConvocationSms } = await import('./notifications');
  let sentCount = 0;

  try {
    for (const player of details.players) {
      const abort = await db.get("SELECT value FROM SystemConfig WHERE key = 'abort_all_dispatches'");
      if (abort?.value === 'true') {
        return { success: false, error: "Diffusion interrompue par le protocole de sécurité du système.", count: sentCount };
      }

      const fullPlayer = await db.get("SELECT * FROM Joueurs WHERE id = ?", [player.id]);
      
      if (fullPlayer && (fullPlayer.email || fullPlayer.telephone)) {
        let emailSuccess = false;
        let smsSuccess = false;

        if (fullPlayer.email) {
          const emailRes = await sendConvocationEmail(fullPlayer, details, convocationId);
          emailSuccess = emailRes.success;
        }

        if (fullPlayer.telephone) {
          const smsRes = await sendConvocationSms(fullPlayer, details, convocationId);
          smsSuccess = smsRes.success;
        }
        
        if (emailSuccess || smsSuccess) sentCount++;
      }
    }

    await db.run(
      "UPDATE Convocations SET date_envoi = CURRENT_TIMESTAMP WHERE id = ?",
      [convocationId]
    );

    return { success: true, count: sentCount };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function getConvocationDetails(convocationId: number) {
  const { getDb } = await import('./db');
  const db = await getDb();

  const convocation = await db.get(`
    SELECT c.*, e.titre, e.date, e.heure, e.lieu, e.adversaire, e.type, eq.nom as equipe_nom
    FROM Convocations c
    JOIN Evenements e ON c.evenement_id = e.id
    JOIN Equipes eq ON e.equipe_id = eq.id
    WHERE c.id = ?
  `, [convocationId]);

  if (!convocation) return null;

  const players = await db.all(`
    SELECT j.id, j.nom, j.prenom, cr.statut, cr.besoin_covoiturage, cr.commentaire
    FROM ConvocationResponses cr
    JOIN Joueurs j ON cr.joueur_id = j.id
    WHERE cr.convocation_id = ?
  `, [convocationId]);

  const normalizedPlayers = players.map((p: ConvocationPlayer) => ({
    ...p,
    statut: p.statut === 'présent' ? 'CONFIRME' : p.statut === 'absent' ? 'DECLINE' : 'EN_ATTENTE'
  }));

  return { ...convocation, players: normalizedPlayers };
}

export async function getPlayerSelectionMerit(player: Player) {
  const tech = player.aptitude_technique || 3;
  const tac = player.aptitude_tactique || 3;
  const phy = player.aptitude_physique || 3;
  const men = player.aptitude_mentale || 3;

  const technical_score = Math.round(((tech + tac) / 2) * 20);
  const mental_score = Math.round(((men + phy) / 2) * 20);
  
  const avg = (tech + tac + phy + men) / 4;
  
  return {
    technical: technical_score,
    tactical: Math.round(tac * 20),
    physical: Math.round(phy * 20),
    mental: mental_score,
    isTopPerformer: avg >= 4.2,
    score: Math.round(avg * 20),
    merit: Math.round(avg * 20),
    status: avg >= 4.2 ? "Indispensable" : avg >= 3.5 ? "Compétitif" : "En Progression"
  };
}

export async function getCoachRecommendations(playerId: string) {
  const { getDb } = await import('./db');
  const db = await getDb();
  
  const manualObs = await db.get(`
    SELECT contenu FROM Observations 
    WHERE joueur_id = ? 
    ORDER BY date DESC LIMIT 1
  `, [playerId]);

  const { getPlayerRequirements, getRequirementValue } = await import('./tactical');
  const player = await db.get("SELECT * FROM Joueurs WHERE id = ?", [playerId]);
  if (!player) return [];

  const { labels, prefix } = getPlayerRequirements(player.poste);
  
  const scores = labels.map((label, i) => ({
    label,
    value: getRequirementValue(player, prefix, i)
  }));

  if (player.mental_score < 70) {
    scores.push({ label: "Force Mentale (Gagne)", value: player.mental_score });
  }

  const weakest = [...scores].sort((a, b) => a.value - b.value);

  const exerciseMap: Record<string, { exercice: string, focus: string }> = {
    "Réflexes": { exercice: "Ballon de Réaction", focus: "Améliorer le temps de réponse sur tirs à bout portant." },
    "Jeu au pied": { exercice: "Circuit de Relance", focus: "Précision des passes courtes et longues sous pression." },
    "Com. & Placement": { exercice: "Scénario Tactique 11v11", focus: "Coordination de la ligne défensive et repli." },
    "Détente": { exercice: "Pliométrie & Saut", focus: "Explosivité verticale sur ballons aériens." },
    "Duel & Anticipation": { exercice: "1v1 en Zone Réduite", focus: "Engagement physique et lecture des trajectoires." },
    "Lecture Tactique": { exercice: "Analyse Vidéo & Placement", focus: "Compréhension des blocs adverses et couverture." },
    "Relance": { exercice: "Transition Rapide", focus: "Qualité de la première passe après récupération." },
    "Marquage": { exercice: "Atelier Défense Individuelle", focus: "Gestion de l'espace et du porteur dans la surface." },
    "Vision & Passe": { exercice: "Carré Magique / Possession", focus: "Prise d'information avant réception et jeu long." },
    "Volume (Endurance)": { exercice: "Fractionné Spécifique", focus: "Capacité à répéter les efforts haute intensité." },
    "Récupération": { exercice: "Pressing Tout Terrain", focus: "Agressivité licite et harcèlement du porteur." },
    "Transition": { exercice: "Contre-Attaque Éclair", focus: "Projection vers l'avant à la perte de balle." },
    "Finition": { exercice: "Finition Face au But", focus: "Sang-froid et précision dans le dernier geste." },
    "Vitesse & Explosivité": { exercice: "Sprints courts avec lest", focus: "Accélération sur les premières foulées." },
    "Appels & Mobilité": { exercice: "Jeu entre les lignes", focus: "Création d'espaces par des courses croisées." },
    "Pressing": { exercice: "Bloc Haut / Cadrage", focus: "Coordination du premier rideau défensif." }
  };

  const genericRecs = weakest.slice(0, 3).map(w => ({
    exercice: exerciseMap[w.label]?.exercice || "Entrainement Technique",
    focus: exerciseMap[w.label]?.focus || "Amélioration globale des fondamentaux."
  }));

  if (manualObs) {
    return [
      { exercice: "CONSEIL EXPERT STAFF", focus: manualObs.contenu, isExpert: true },
      ...genericRecs.slice(0, 2)
    ];
  }
  return genericRecs;
}

export async function saveObservation(formData: FormData) {
  const joueur_id = parseInt(formData.get('joueur_id') as string);
  const contenu = formData.get('contenu') as string;
  const apt_technique = formData.get('apt_technique') ? parseInt(formData.get('apt_technique') as string) : null;
  const apt_tactique = formData.get('apt_tactique') ? parseInt(formData.get('apt_tactique') as string) : null;
  const apt_physique = formData.get('apt_physique') ? parseInt(formData.get('apt_physique') as string) : null;
  const apt_mentale = formData.get('apt_mentale') ? parseInt(formData.get('apt_mentale') as string) : null;

  const { getDb } = await import('./db');
  const db = await getDb();
  await db.run(
    `INSERT INTO Observations (joueur_id, coach_id, contenu, apt_technique, apt_tactique, apt_physique, apt_mentale) 
     VALUES (?, 1, ?, ?, ?, ?, ?)`,
    [joueur_id, contenu, apt_technique, apt_tactique, apt_physique, apt_mentale]
  );
  
  const { revalidatePath } = await import('next/cache');
  revalidatePath(`/coach/joueur/${joueur_id}`);
}


export async function saveMatchObservation(formData: FormData) {
  const playerId = parseInt(formData.get('joueur_id') as string);
  const contenu = formData.get('observation') as string;
  const matchId = formData.get('match_id') ? parseInt(formData.get('match_id') as string) : null;
  
  const aptT = parseInt(formData.get('apt_technique') as string) || 3;
  const aptTa = parseInt(formData.get('apt_tactique') as string) || 3;
  const aptP = parseInt(formData.get('apt_physique') as string) || 3;
  const aptM = parseInt(formData.get('apt_mentale') as string) || 3;

  if (!playerId || !contenu) return { error: "Joueur et observation requis." };

  const session = await getSession();
  if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction')) return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();
  
  try {
    await db.run(`
      INSERT INTO Observations (joueur_id, coach_id, match_id, contenu, apt_technique, apt_tactique, apt_physique, apt_mentale)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [playerId, session.userId, matchId, contenu, aptT, aptTa, aptP, aptM]);

    await db.run(`
      UPDATE Joueurs 
      SET aptitude_technique = ?, aptitude_tactique = ?, aptitude_physique = ?, aptitude_mentale = ? 
      WHERE id = ?
    `, [aptT, aptTa, aptP, aptM, playerId]);

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/parents/reports');
    revalidatePath('/coach/dashboard');

    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getGlobalRoster() {
  const { getDb } = await import('./db');
  const db = await getDb();
  const players = await db.all(`
    SELECT p.id, p.nom, p.prenom, p.poste, e.nom as equipe_nom, e.id as equipe_id
    FROM Joueurs p
    JOIN Equipes e ON p.equipe_id = e.id
    ORDER BY e.nom ASC, p.nom ASC
  `);
  return players;
}

export async function checkPlayerConflict(playerId: number, date: string) {
  const { getDb } = await import('./db');
  const db = await getDb();
  const conflict = await db.get(`
    SELECT e.nom as equipe_nom, ev.titre, ev.type
    FROM Convocations c
    JOIN Evenements ev ON c.evenement_id = ev.id
    JOIN Equipes e ON ev.equipe_id = e.id
    WHERE c.joueur_id = ? AND date(ev.date) = date(?)
  `, [playerId, date]);
  return conflict || null;
}

export async function saveBuvetteReport(formData: FormData) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Non autorisé" };

  const recette = parseFloat(formData.get('recette') as string);
  const depenses = parseFloat(formData.get('depenses') as string) || 0;
  const matchId = formData.get('match_id') ? parseInt(formData.get('match_id') as string) : null;
  const stocks = formData.get('stocks') as string;

  const { getDb } = await import('./db');
  const db = await getDb();
  
  await db.run(`
    INSERT INTO BuvetteStats (match_id, recette_totale, depenses, stocks_vides)
    VALUES (?, ?, ?, ?)
  `, [matchId, recette, depenses, stocks]);

  const { revalidatePath } = await import('next/cache');
  revalidatePath('/direction/buvette');

  return { success: true };
}

export async function googleLoginAction() {
  const { redirect } = await import('next/navigation');
  redirect('/api/auth/google?code=mock_google_code_123');
}

export async function getDbTables() {
  const session = await getSession();
  if (!session || session.roleName !== 'Développeur') return [];

  const { getDb } = await import('./db');
  const db = await getDb();
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
  return tables.map((t: { name: string }) => t.name);
}

export async function getTableRows(tableName: string) {
  const session = await getSession();
  if (!session || session.roleName !== 'Développeur') return [];

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    return await db.all(`SELECT * FROM ${tableName}`);
  } catch (e) {
    return [];
  }
}

export async function updateDbRow(tableName: string, id: number, field: string, value: any) {
  const session = await getSession();
  if (!session || session.roleName !== 'Développeur') return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    await db.run(`UPDATE ${tableName} SET ${field} = ? WHERE id = ?`, [value, id]);
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function validateFullLicenseAction(joueurId: number) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    await db.run(
      `UPDATE Licences SET status_paiement = 'payé', documents_complets = 1 WHERE joueur_id = ?`,
      [joueurId]
    );

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/dashboard');
    revalidatePath('/direction/licences');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function bulkValidateFullLicenseAction(joueurIds: number[]) {
  const session = await getSession();
  if (!session || !['Direction', 'Admin'].includes(session.roleName)) return { error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    await db.run("BEGIN TRANSACTION");
    for (const id of joueurIds) {
      await db.run(
        `UPDATE Licences SET status_paiement = 'payé', documents_complets = 1 WHERE joueur_id = ?`,
        [id]
      );
    }
    await db.run("COMMIT");

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/dashboard');
    revalidatePath('/direction/licences');
    return { success: true };
  } catch (e: any) {
    await db.run("ROLLBACK");
    return { error: e.message };
  }
}

export async function updateLicenseDataFromOCRAction(joueurId: number, data: any) {
  const session = await getSession();
  if (!session || !['Direction', 'Admin'].includes(session.roleName)) return { error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    // In a real app, we'd parse the date or map fields properly.
    // Here we simulate the update of 'documents_complets' based on the scan success.
    await db.run(
      `UPDATE Licences SET documents_complets = 1 WHERE joueur_id = ?`,
      [joueurId]
    );

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/licences');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateLicenseStatusAction(joueurId: number, field: 'paiement_effectue' | 'documents_complets', value: boolean) {
  const session = await getSession();
  if (!session || !['Direction', 'Admin'].includes(session.roleName)) return { error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    const dbField = field === 'paiement_effectue' ? 'status_paiement' : 'documents_complets';
    const dbValue = field === 'paiement_effectue' ? (value ? 'payé' : 'en attente') : (value ? 1 : 0);
    await db.run(`UPDATE Licences SET ${dbField} = ? WHERE joueur_id = ?`, [dbValue, joueurId]);

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/dashboard');
    revalidatePath('/direction/licences');
    revalidatePath('/parents/dashboard');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getLicenseSessionsAction(search: string = "", filter: string = "all", category: string = "all") {
  const session = await getSession();
  if (!session || !['Direction', 'Admin'].includes(session.roleName)) return [];

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    let baseQuery = `
      SELECT 
        j.id as joueur_id, 
        j.nom, 
        j.prenom, 
        j.categorie_actuelle as categorie,
        e.nom as equipe_nom,
        CASE WHEN l.status_paiement = 'payé' THEN 1 ELSE 0 END as paiement_effectue,
        CASE 
          WHEN j.email IS NULL OR j.email = '' OR
               j.telephone IS NULL OR j.telephone = '' OR
               j.num_licence IS NULL OR j.num_licence = '' OR
               j.adresse IS NULL OR j.adresse = ''
          THEN 0 
          ELSE COALESCE(l.documents_complets, 0) 
        END as documents_complets,
        j.email,
        j.num_licence,
        j.adresse,
        j.telephone,
        j.date_naissance,
        j.equipe_id,
        j.photo_url
      FROM Joueurs j
      LEFT JOIN Equipes e ON j.equipe_id = e.id
      LEFT JOIN Licences l ON j.id = l.joueur_id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];
    
    if (search) {
      baseQuery += ` AND (LOWER(j.nom) LIKE ? OR LOWER(j.prenom) LIKE ?)`;
      params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
    }

    if (category && category !== 'all') {
      baseQuery += ` AND j.categorie_actuelle = ?`;
      params.push(category);
    }

    if (filter === 'unpaid') {
      baseQuery += ` AND (l.status_paiement IS NULL OR l.status_paiement != 'payé')`;
    } else if (filter === 'incomplete') {
      baseQuery += ` AND COALESCE(l.documents_complets, 0) = 0`;
    } else if (filter === 'validated') {
      baseQuery += ` AND l.status_paiement = 'payé' AND l.documents_complets = 1`;
    }

    baseQuery += ` ORDER BY j.nom ASC, j.prenom ASC LIMIT 50`; // Imposed limitation for Edge Performance

    const licenses = await db.all(baseQuery, params);
    return licenses;
  } catch (e) {
    return [];
  }
}

export async function getAllCategoriesAction() {
  const session = await getSession();
  if (!session || !['Direction', 'Admin'].includes(session.roleName)) return [];

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    const rows = await db.all("SELECT DISTINCT categorie_actuelle as cat FROM Joueurs WHERE categorie_actuelle IS NOT NULL ORDER BY cat ASC");
    return rows.map((r: { cat: string }) => r.cat);
  } catch (e) {
    return [];
  }
}

export interface AttendanceData {
  status: string;
  serieux?: number;
  ponctualite?: number;
  performance?: number;
}

export async function updateAttendanceAction(evenementId: number, attendance: Record<number, AttendanceData | string>) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction')) return { success: false, error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    await db.run("BEGIN TRANSACTION");
    for (const [playerId, data] of Object.entries(attendance)) {
      const isObject = typeof data !== 'string';
      const status = isObject ? (data as AttendanceData).status : (data as string);
      const serieux = isObject ? (data as AttendanceData).serieux ?? 3 : 3;
      const ponctualite = isObject ? (data as AttendanceData).ponctualite ?? 3 : 3;
      const performance = isObject ? (data as AttendanceData).performance ?? 3 : 3;

      let dbStatus = "présent";
      if (status === "ABSENT") dbStatus = "absent";
      if (status === "RETARD") dbStatus = "retard";

      await db.run("DELETE FROM Presences WHERE evenement_id = ? AND joueur_id = ?", [
        evenementId,
        parseInt(playerId),
      ]);
      await db.run(
        "INSERT INTO Presences (evenement_id, joueur_id, statut, serieux, ponctualite, performance) VALUES (?, ?, ?, ?, ?, ?)",
        [evenementId, parseInt(playerId), dbStatus, serieux, ponctualite, performance]
      );
    }
    await db.run("COMMIT");

    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/coach/training/${evenementId}`);
    return { success: true };
  } catch (e: any) {
    await db.run("ROLLBACK");
    return { success: false, error: e.message };
  }
}

export async function updateBuvetteStockAction(id: number, delta: number) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    await db.run("BEGIN TRANSACTION");
    const item = await db.get("SELECT nom FROM BuvetteStocks WHERE id = ?", [id]);
    await db.run(`UPDATE BuvetteStocks SET quantite = MAX(0, quantite + ?), derniere_maj = CURRENT_TIMESTAMP WHERE id = ?`, [delta, id]);
    if (item) {
      await db.run("INSERT INTO BuvetteTransactions (item_id, nom, delta, user) VALUES (?, ?, ?, ?)", [id, item.nom, delta, session.username || 'Admin']);
    }
    await db.run("COMMIT");
    
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/buvette');
    return { success: true };
  } catch (e: any) {
    await db.run("ROLLBACK");
    return { error: e.message };
  }
}

export async function batchUpdateBuvetteStockAction(deltas: Record<number, number>) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    await db.run("BEGIN TRANSACTION");
    for (const [id, delta] of Object.entries(deltas)) {
      if (delta === 0) continue;
      const parsedId = parseInt(id);
      const item = await db.get("SELECT nom FROM BuvetteStocks WHERE id = ?", [parsedId]);
      await db.run(`UPDATE BuvetteStocks SET quantite = MAX(0, quantite + ?), derniere_maj = CURRENT_TIMESTAMP WHERE id = ?`, [delta, parsedId]);
      if (item) {
        await db.run("INSERT INTO BuvetteTransactions (item_id, nom, delta, user) VALUES (?, ?, ?, ?)", [parsedId, item.nom, delta, session.username || 'Admin']);
      }
    }
    await db.run("COMMIT");

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/buvette');
    return { success: true };
  } catch (e: any) {
    await db.run("ROLLBACK");
    return { error: e.message };
  }
}

export async function getBuvetteTransactionsAction() {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Unauthorized" };
  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    const transactions = await db.all("SELECT * FROM BuvetteTransactions ORDER BY created_at DESC LIMIT 50");
    return { success: true, data: transactions };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function sendLicenseReminderAction(joueurId: number) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    const player = await db.get(`
      SELECT j.id, j.prenom, j.nom, j.telephone, u.email, 
             CASE WHEN l.status_paiement = 'payé' THEN 1 ELSE 0 END as paiement_effectue, 
             l.documents_complets
      FROM Joueurs j
      JOIN Users u ON j.id = u.player_id
      JOIN Licences l ON j.id = l.joueur_id
      WHERE j.id = ?
    `, [joueurId]);

    if (!player || !player.email) return { error: "Impossible de trouver l'email du licencié." };

    const reason = (!player.paiement_effectue && !player.documents_complets) ? 'both' : !player.paiement_effectue ? 'paiement' : 'documents';
    const { sendLicenseReminder, sendLicenseReminderSms } = await import('./notifications');
    await sendLicenseReminder(player, reason);
    if (player.telephone) {
      await sendLicenseReminderSms(player, reason);
      await db.run("INSERT INTO NotifsLog (joueur_id, type, message) VALUES (?, ?, ?)", [joueurId, 'SMS', `Relance SMS ${reason} envoyée le ${new Date().toLocaleDateString()}`]);
    }

    await db.run("INSERT INTO NotifsLog (joueur_id, type, message) VALUES (?, ?, ?)", [joueurId, 'Email', `Relance ${reason} envoyée le ${new Date().toLocaleDateString()}`]);
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function sendBulkLicenseRemindersAction(type: 'all' | 'unpaid' | 'incomplete' = 'all') {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { success: false, count: 0, error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    let query = `
      SELECT j.id, j.prenom, j.nom, j.telephone, u.email, 
             CASE WHEN l.status_paiement = 'payé' THEN 1 ELSE 0 END as paiement_effectue, 
             l.documents_complets
      FROM Joueurs j
      JOIN Users u ON j.id = u.player_id
      LEFT JOIN Licences l ON j.id = l.joueur_id
      WHERE 1=1
    `;

    if (type === 'unpaid') {
      query += ` AND (l.status_paiement IS NULL OR l.status_paiement != 'payé')`;
    } else if (type === 'incomplete') {
      query += ` AND (l.status_paiement = 'payé' AND COALESCE(l.documents_complets, 0) = 0)`;
    } else {
      query += ` AND (l.id IS NULL OR l.status_paiement != 'payé' OR l.documents_complets = 0)`;
    }

    const problem_players = await db.all(query);

    const { sendLicenseReminder, sendLicenseReminderSms } = await import('./notifications');
    let sentCount = 0;
    for (const player of problem_players) {
      if (player.email) {
        const reason = (!player.paiement_effectue && !player.documents_complets) ? 'both' : !player.paiement_effectue ? 'paiement' : 'documents';
        await sendLicenseReminder(player, reason);
        await db.run("INSERT INTO NotifsLog (joueur_id, type, message) VALUES (?, ?, ?)", [player.id, 'Email', `Relance BULK ${type} (${reason}) envoyée le ${new Date().toLocaleDateString()}`]);
        
        if (player.telephone) {
          await sendLicenseReminderSms(player, reason);
          await db.run("INSERT INTO NotifsLog (joueur_id, type, message) VALUES (?, ?, ?)", [player.id, 'SMS', `Relance SMS BULK ${type} (${reason}) envoyée le ${new Date().toLocaleDateString()}`]);
        }
        
        sentCount++;
      }
    }
    return { success: true, count: sentCount, error: "" };
  } catch (e: any) {
    return { success: false, count: 0, error: e.message };
  }
}

export async function getKillSwitchStatusAction() {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { enabled: false };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    const config = await db.get("SELECT value FROM SystemConfig WHERE key = 'abort_all_dispatches'");
    return { enabled: config?.value === 'true' };
  } catch (e) {
    return { enabled: false };
  }
}

export async function toggleKillSwitchAction(targetStatus: boolean) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    const value = targetStatus ? 'true' : 'false';
    await db.run(`
      INSERT INTO SystemConfig (key, value) 
      VALUES ('abort_all_dispatches', ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `, [value]);
    
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/dashboard');
    
    return { success: true, enabled: targetStatus };
  } catch (e: any) {
    return { error: e.message };
  }
}



export async function getUnreadIntelligenceCountAction() {
  const session = await getSession();
  if (!session) return 0;

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    const res = await db.get("SELECT COUNT(*) as count FROM IntelligenceFeed WHERE lu = 0");
    return res?.count || 0;
  } catch (e) {
    return 0;
  }
}

export async function markIntelligenceAsReadAction(id: number) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    await db.run("UPDATE IntelligenceFeed SET lu = 1 WHERE id = ?", [id]);
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/dashboard');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}


export async function markAllIntelligenceAsReadAction() {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    await db.run("UPDATE IntelligenceFeed SET lu = 1 WHERE lu = 0");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getDetailedReconReportAction(id: number) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    const item = await db.get("SELECT * FROM IntelligenceFeed WHERE id = ?", [id]);
    if (!item) return { error: "Introuvable" };

    let detailedData = null;
    if (item.type === 'Logistique' && (item.titre.includes('Stock') || item.titre.includes('Rupture'))) {
      detailedData = await db.all("SELECT nom, quantite, seuil_alerte FROM BuvetteStocks WHERE quantite <= seuil_alerte");
    } else if (item.type === 'Physique' && item.titre.includes('Certificat')) {
      detailedData = await db.all("SELECT prenom, nom, certificat_medical_date FROM Joueurs WHERE certificat_medical_date < date('now', '-360 days')");
    } else if (item.type === 'Tactique' && item.titre.includes('Staff')) {
      detailedData = await db.all("SELECT coach_name, reason, date FROM CoachSubstitutions WHERE status = 'PENDING'");
    } else if (item.type === 'Logistique' && (item.titre.includes('Minibus') || item.titre.includes('Maintenance'))) {
      detailedData = await db.all("SELECT type, due_date, status, description FROM MinibusMaintenance WHERE status != 'OK' OR due_date <= date('now', '+7 days')");
    } else if (item.type === 'Physique' && (item.titre.includes('Forme') || item.titre.includes('SDI') || item.titre.includes('Santé'))) {
      detailedData = await db.all(`
        SELECT j.prenom, j.nom, f.sdi_score, f.pain_level, f.pain_location, f.date 
        FROM FlashFormeLogs f 
        JOIN Joueurs j ON f.joueur_id = j.id 
        WHERE f.sdi_score < 3 OR f.pain_level > 2
        ORDER BY f.date DESC 
        LIMIT 10
      `);
    }

    return { ...item, details: detailedData };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function generateNewIntelligenceAction() {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur')) return { error: "Unauthorized" };



  const { getDb } = await import('./db');
  const db = await getDb();
  
  try {
    interface Finding {
      type: 'Tactique' | 'Scouting' | 'Physique' | 'Mental' | 'Logistique';
      titre: string;
      contenu: string;
      gravite: 'info' | 'warning' | 'critical';
    }
    const findings: Finding[] = [];

    // 1. Attendance Check (Physique) - Improved with streaks
    const attendance = await db.get(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN statut IN ('présent', 'retard') THEN 1 ELSE 0 END) as present
      FROM Presences p
      JOIN Evenements e ON p.evenement_id = e.id
      WHERE e.date >= date('now', '-14 days')
    `);

    const attendanceRate = (attendance?.total || 0) > 0 ? (attendance.present / attendance.total) * 100 : 100;
    if (attendanceRate < 85) {
      findings.push({
        type: "Physique",
        titre: "Fluctuation Engagement",
        contenu: `RECON: Taux de présence en baisse (${attendanceRate.toFixed(1)}% sur 14j). Risque de déconditionnement sur le bloc Elite.`,
        gravite: attendanceRate < 70 ? "critical" : "warning"
      });
    }

    // 2. Performance Analysis (Tactique) - Check for streaks in Resultats
    const recentResults = await db.all(`
      SELECT r.statut, e.nom as equipe 
      FROM Resultats r
      JOIN Equipes e ON r.equipe_id = e.id
      ORDER BY r.date DESC LIMIT 15
    `);

    // Group by team and check for streaks (e.g. 2+ losses or 3+ wins)
    const teamStreaks: Record<string, string[]> = {};
    recentResults.forEach((r: any) => {
      if (!teamStreaks[r.equipe]) teamStreaks[r.equipe] = [];
      teamStreaks[r.equipe].push(r.statut);
    });

    for (const [team, results] of Object.entries(teamStreaks)) {
      if (results.length >= 2 && results.slice(0, 2).every(r => r === 'D')) {
        findings.push({
          type: "Tactique",
          titre: `Alerte Dynamique : ${team}`,
          contenu: `RECON: Série de défaites détectée pour l'unité ${team}. Analyse tactique corrective recommandée.`,
          gravite: "warning"
        });
      } else if (results.length >= 3 && results.slice(0, 3).every(r => r === 'V')) {
        findings.push({
          type: "Tactique",
          titre: `Excellence Opérationnelle : ${team}`,
          contenu: `RECON: Série de victoires confirmée pour ${team}. Moral au plus haut, dynamique à capitaliser.`,
          gravite: "info"
        });
      }
    }

    // 3. Financial & Treasury Recon (Scouting)
    const licensesWithCategories = await db.all(`
      SELECT 
        l.status_paiement,
        j.categorie_actuelle as category
      FROM Licences l
      LEFT JOIN Joueurs j ON l.joueur_id = j.id
    `);

    let paidAmount = 0;
    let unpaidAmount = 0;

    for (const lic of licensesWithCategories) {
      const price = getLicensePrice(lic.category);
      if (lic.status_paiement === 'payé') {
        paidAmount += price;
      } else {
        unpaidAmount += price;
      }
    }

    const buvetteStats = await db.get("SELECT SUM(recette_totale - depenses) as profit FROM BuvetteStats");
    const globalTreasury = paidAmount + (buvetteStats?.profit || 0);

    if (unpaidAmount > 1000) {
      findings.push({
        type: "Scouting",
        titre: "Flux Financier Entravé",
        contenu: `RECON: ${unpaidAmount}€ de créances non recouvrées. Impact sur la capacité de projection du club.`,
        gravite: unpaidAmount > 3000 ? "critical" : "warning"
      });
    }

    // 4. Logistique & Stocks
    const criticalStocks = await db.all("SELECT nom FROM BuvetteStocks WHERE quantite = 0");
    const lowStocks = await db.all("SELECT nom FROM BuvetteStocks WHERE quantite > 0 AND quantite <= seuil_alerte");
    
    if (criticalStocks.length > 0) {
      findings.push({
        type: "Logistique",
        titre: "Rupture Critique",
        contenu: `RECON: Rupture totale détectée sur : ${(criticalStocks as {nom: string}[]).map(s => s.nom).join(', ')}. Réapprovisionnement immédiat requis.`,
        gravite: "critical"
      });
    } else if (lowStocks.length > 3) {
      findings.push({
        type: "Logistique",
        titre: "Alerte Ravitaillement",
        contenu: `RECON: Tension sur la chaîne logistique (${lowStocks.length} articles en seuil critique). Risque sur les prochaines échéances à domicile.`,
        gravite: "warning"
      });
    }

    // 4b. Minibus Maintenance & Transport Gaps (Logistique)
    const maintenanceAlerts = await db.all("SELECT type, description FROM MinibusMaintenance WHERE status IN ('WARNING', 'CRITICAL')");
    for (const alert of maintenanceAlerts) {
      findings.push({
        type: "Logistique",
        titre: `Alerte Flotte: ${alert.type}`,
        contenu: `RECON: Problème technique détecté sur le parc Minibus (${alert.description}). Mobilité opérationnelle compromise.`,
        gravite: "critical"
      });
    }

    const upcomingTransport = await db.all(`
      SELECT e.id, e.titre, e.date, COUNT(cr.id) as players_count 
      FROM Evenements e
      JOIN ConvocationResponses cr ON e.id = cr.convocation_id
      WHERE e.type = 'match' AND e.date >= date('now') AND e.date <= date('now', '+3 days')
      AND cr.statut = 'présent'
      GROUP BY e.id
    `);

    for (const match of upcomingTransport) {
      const reservation = await db.get("SELECT id FROM MinibusReservations WHERE start_time LIKE ? AND status = 'APPROVED'", [`%${match.date}%`]);
      if (!reservation && match.players_count > 7) {
        findings.push({
          type: "Logistique",
          titre: "Rupture de Mobilité",
          contenu: `RECON: Aucun transport réservé pour ${match.titre} (${match.date}). ${match.players_count} joueurs sans solution de mobilité.`,
          gravite: "critical"
        });
      }
    }

    // 5. Mental Check (Mental)
    const lowMood = await db.get(`
      SELECT COUNT(*) as count FROM PlayerPerformanceLogs 
      WHERE mood = 'tired' AND date >= date('now', '-5 days')
    `);
    if (lowMood?.count > 0) {
      findings.push({
        type: "Mental",
        titre: "Signal Fatigue Cognitive",
        contenu: `RECON: ${lowMood.count} rapports de fatigue identifiés en 120h. Facteur de risque sur la lucidité offensive.`,
        gravite: lowMood.count > 5 ? "critical" : "warning"
      });
    }

    // 5b. Pain/Injury Risk (Physique)
    const highPain = await db.all(`
      SELECT COUNT(*) as count, GROUP_CONCAT(pain_location) as locations 
      FROM FlashFormeLogs 
      WHERE pain_level >= 4 AND date >= date('now', '-3 days')
    `);
    if (highPain[0]?.count > 0) {
      findings.push({
        type: "Physique",
        titre: "Zone d'Attrition Physique",
        contenu: `RECON: ${highPain[0].count} joueurs signalent des douleurs intenses (Zones: ${highPain[0].locations}). Risque de blessures musculaires élevé.`,
        gravite: "critical"
      });
    }

    // 6. Recruitment/Scouting Insights (Scouting)
    const newLicenses = await db.get("SELECT COUNT(*) as count FROM Licences WHERE id IN (SELECT id FROM Licences WHERE id NOT IN (SELECT id FROM Licences LIMIT 0))"); // Placeholder logic for actual new additions
    
    // 7. Buvette Stock (Logistique)
    const lowStock = await db.all("SELECT nom, quantite, seuil_alerte FROM BuvetteStocks WHERE quantite <= seuil_alerte");
    for (const item of lowStock) {
      findings.push({
        type: "Logistique",
        titre: `Alerte Stock : ${item.nom}`,
        contenu: `RECON: Rupture de stock imminente (${item.quantite}/${item.seuil_alerte}). Nécessité de réapprovisionnement pour le prochain match à domicile.`,
        gravite: item.quantite === 0 ? "critical" : "warning"
      });
    }

    // 8. Medical Certs (Physique)
    const expiredMedical = await db.all(`
      SELECT prenom, nom, certificat_medical_date 
      FROM Joueurs 
      WHERE certificat_medical_date < date('now', '-360 days')
      LIMIT 3
    `);
    for (const p of expiredMedical) {
      findings.push({
        type: "Physique",
        titre: `Certificat Expiré : ${p.prenom} ${p.nom}`,
        contenu: `RECON: Le certificat médical de ${p.prenom} ${p.nom} est obsolète (${p.certificat_medical_date}). Inéligibilité administrative détectée.`,
        gravite: "critical"
      });
    }

    // 9. Coach Substitutions (Tactique)
    const pendingSubs = await db.all(`
      SELECT reason, date FROM CoachSubstitutions 
      WHERE status = 'PENDING' AND date >= date('now') AND date <= date('now', '+2 days')
    `);
    for (const sub of pendingSubs) {
      findings.push({
        type: "Tactique",
        titre: "Vacance de Poste (Staff)",
        contenu: `RECON: Demande de remplacement non pourvue pour la séance du ${sub.date}. Cause: ${sub.reason}.`,
        gravite: "warning"
      });
    }

    // 10. External Recon Simulation
    const externalRecon = [
      { type: "Scouting" as const, titre: "Observation Concurrent U15", contenu: "RECON: AS Saint-Etienne observe nos séances U15. Vigilance accrue sur les protocoles de confidentialité.", gravite: "info" as const },
      { type: "Tactique" as const, titre: "Analyse Bloc Adversaire", contenu: "RECON: Prochain adversaire utilise un bloc haut (4-3-3). Préparation de sorties de balle courtes recommandée.", gravite: "info" as const },
      { type: "Scouting" as const, titre: "Opportunité Mercato", contenu: "RECON: Profil 'Attaquant Pivot' détecté libre de tout contrat en zone régionale. Potentiel technique élevé.", gravite: "info" as const }
    ];
    findings.push(externalRecon[Math.floor(Math.random() * externalRecon.length)]);

    if (findings.length === 0) {
      findings.push({
        type: "Scouting",
        titre: "Secteur Alpha Sécurisé",
        contenu: "RECON: Toutes les métriques opérationnelles sont nominales. Le dispositif RCBA est en configuration optimale.",
        gravite: "info"
      });
    }

    // Process all findings
    let insertedCount = 0;
    for (const f of findings) {
      const exists = await db.get(`
        SELECT id FROM IntelligenceFeed 
        WHERE titre = ? AND type = ? AND date > datetime('now', '-2 hour')
      `, [f.titre, f.type]);

      if (!exists) {
        await db.run(`
          INSERT INTO IntelligenceFeed (type, source, titre, contenu, gravite) 
          VALUES (?, ?, ?, ?, ?)
        `, [f.type, "Sirchmunk Recon Expert", f.titre, f.contenu, f.gravite]);
        insertedCount++;
      }
    }

    // Audit Log entry
    if (insertedCount > 0) {
      await db.run(`
        INSERT INTO IntelligenceFeed (type, source, titre, contenu, gravite)
        VALUES (?, ?, ?, ?, ?)
      `, ["Logistique", "AURA Intelligence", "Audit Terminé", `Synchronisation terminée. ${insertedCount} nouveaux vecteurs d'intelligence générés.`, "info"]);
    }

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/dashboard');
    revalidatePath('/direction/intelligence');
    return { success: true, count: insertedCount };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getDetailedIntelligenceLogAction(limit = 50, offset = 0) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur' && session.roleName !== 'Coach')) return [];

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    return await db.all("SELECT * FROM IntelligenceFeed ORDER BY date DESC LIMIT ? OFFSET ?", [limit, offset]);
  } catch (e) {
    return [];
  }
}

export async function triggerSpecificReconAction(sector: 'Finance' | 'Physique' | 'Logistique' | 'Tactique') {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Unauthorized" };

  // This is a simulation of a more targeted scan
  // For now, it just triggers the general one but we could make it more specific
  return await generateNewIntelligenceAction();
}


export async function syncStaffFromSqlAction() {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur')) 
    return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    const staffData = [
      { prenom: "Christophe", nom: "DABADIE", role: "Co-Président", priority: 1 },
      { prenom: "Bruno", nom: "DABADIE", role: "Co-Président", priority: 1 },
      { prenom: "Gilles", nom: "LOMBARD", role: "Secrétaire Général", priority: 1 },
      { prenom: "Frédéric", nom: "LOPEZ", role: "Manager Pôle Sportif", priority: 3 },
      { prenom: "Anthony", nom: "SOUBERVIELLE", role: "Manager Pôle Sportif", priority: 3 }
    ];

    await db.run("BEGIN TRANSACTION");
    for (const member of staffData) {
      await db.run(`
        INSERT INTO Staff (nom, prenom, role, role_priority)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(nom, prenom) DO UPDATE SET
          role = excluded.role,
          role_priority = excluded.role_priority
      `, [member.nom, member.prenom, member.role, member.priority]);
    }
    await db.run("COMMIT");
    
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/club/staff');
    revalidatePath('/direction/staff');
    
    return { success: true };
  } catch (e: any) {
    if (db) await db.run("ROLLBACK");
    return { error: e.message };
  }
}

export async function addStaffAction(data: { nom: string, prenom: string, role: string, role_priority?: number, photo_url?: string }) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur')) 
    return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run(`
      INSERT INTO Staff (nom, prenom, role, role_priority, photo_url)
      VALUES (?, ?, ?, ?, ?)
    `, [data.nom, data.prenom, data.role, data.role_priority || 4, data.photo_url]);
    
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/club/staff');
    revalidatePath('/direction/staff');
    
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateStaffAction(id: number, data: { nom?: string, prenom?: string, role?: string, role_priority?: number, photo_url?: string }) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur')) 
    return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    const sets = [];
    const vals = [];
    if (data.nom) { sets.push("nom = ?"); vals.push(data.nom); }
    if (data.prenom) { sets.push("prenom = ?"); vals.push(data.prenom); }
    if (data.role) { sets.push("role = ?"); vals.push(data.role); }
    if (data.role_priority !== undefined) { sets.push("role_priority = ?"); vals.push(data.role_priority); }
    if (data.photo_url !== undefined) { sets.push("photo_url = ?"); vals.push(data.photo_url); }
    
    if (sets.length === 0) return { success: true };
    
    vals.push(id);
    await db.run(`UPDATE Staff SET ${sets.join(', ')} WHERE id = ?`, vals);
    
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/club/staff');
    revalidatePath('/direction/staff');
    
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteStaffAction(id: number) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur')) 
    return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run("DELETE FROM Staff WHERE id = ?", [id]);
    
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/club/staff');
    revalidatePath('/direction/staff');
    
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function getStaffListAction() {
  const { getDb } = await import('./db');
  const db = await getDb();
  return await db.all("SELECT * FROM Staff ORDER BY role_priority ASC, nom ASC");
}

export async function runAgentAction(agentKey: string, commandId: string, userContext?: string) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur')) {
    return { error: "Non autorisé" };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { error: "Configuration IA manquante (GEMINI_API_KEY non définie)" };
  }

  try {
    const { runAgentCommand, AGENTS } = await import('./agents');
    const result = await runAgentCommand(agentKey, commandId, apiKey, userContext);

    // Auto-Archivage pour les résultats Critiques (Point 2 de la demande utilisateur)
    let autoArchived = false;
    const isCritical = result.includes('CRITICAL') || result.includes('URGENT') || result.includes('🚨') || result.includes('DANGER');
    if (isCritical) {
      const agent = (AGENTS as any)[agentKey];
      const command = agent?.commands.find((c: any) => c.id === commandId);
      
      await saveAnalysisToFeedAction({
        type: 'AUTO_ALERT',
        source: agent?.name || agentKey,
        titre: `[AUTO] ${command?.label || 'Alerte Critique'}`,
        contenu: result,
        gravite: 'critical',
        agent_key: agentKey,
        metadata: userContext ? JSON.stringify({ context: userContext }) : undefined
      });
      autoArchived = true;
    }

    return { success: true, result, autoArchived };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function saveAnalysisToFeedAction(data: {
  type: string;
  source: string;
  titre: string;
  contenu: string;
  gravite: 'info' | 'warning' | 'critical';
  agent_key?: string;
  metadata?: string;
}) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur')) {
    return { error: "Non autorisé" };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run(`
      INSERT INTO IntelligenceFeed (type, source, titre, contenu, gravite, agent_key, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [data.type, data.source, data.titre, data.contenu, data.gravite, data.agent_key || null, data.metadata || null]);

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/dashboard');
    revalidatePath('/direction/performance');

    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function saveCompositionAction(evenementId: number, formation: string, lineup: Record<string, number | null>) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction')) {
    return { error: "Non autorisé" };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    const lineupJson = JSON.stringify(lineup);
    const existing = await db.get("SELECT id FROM Compositions WHERE evenement_id = ?", [evenementId]);
    if (existing) {
      await db.run(
        "UPDATE Compositions SET formation = ?, lineup_json = ? WHERE evenement_id = ?",
        [formation, lineupJson, evenementId]
      );
    } else {
      await db.run(
        "INSERT INTO Compositions (evenement_id, formation, lineup_json) VALUES (?, ?, ?)",
        [evenementId, formation, lineupJson]
      );
    }

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/coach/compositions');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function addPlayerAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Non autorisé" };

  const nom = (formData.get('nom') as string)?.toUpperCase();
  const prenom = (formData.get('prenom') as string)?.toUpperCase();
  const email = formData.get('email') as string || null;
  const telephone = formData.get('telephone') as string || null;
  const num_licence = formData.get('num_licence') as string || null;
  const adresse = formData.get('adresse') as string || null;
  const date_naissance = formData.get('date_naissance') as string || null;
  const mot_de_passe = formData.get('mot_de_passe') as string || null;
  const poste = formData.get('poste') as string || null;

  const photo = formData.get('photo') as File | null;
  let photo_url: string | null = null;

  if (photo && photo.size > 0) {
    const fs = await import('fs/promises');
    const path = await import('path');
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try { await fs.mkdir(uploadDir, { recursive: true }); } catch(e) {}
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    photo_url = `/uploads/${fileName}`;
  }
  
  // Calculate category automatically from date_naissance
  const categorie_actuelle = getPlayerCategoryByAge(date_naissance);
  
  const equipe_id_str = formData.get('equipe_id') as string;
  const equipe_id = equipe_id_str ? parseInt(equipe_id_str) : null;

  if (!nom || !prenom) {
    return { error: "Le nom et le prénom sont requis." };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    if (email) {
      // Allow multiple accounts with the same email.
    }
    
    await db.run("BEGIN TRANSACTION");

    const result = await db.run(`
      INSERT INTO Joueurs (nom, prenom, email, telephone, num_licence, adresse, categorie_actuelle, equipe_id, photo_url, date_naissance, poste)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [nom, prenom, email, telephone, num_licence, adresse, categorie_actuelle, equipe_id, photo_url, date_naissance, poste]);

    const joueurId = result.lastID;

    if (email && mot_de_passe) {
      const { createHash } = await import('node:crypto');
      const pwd_hash = createHash('sha256').update(mot_de_passe).digest('hex');
      await db.run("INSERT INTO Users (email, password_hash, role, player_id) VALUES (?, ?, ?, ?)", [email, pwd_hash, 'Joueur', joueurId]);
    }

    await db.run(`
      INSERT INTO Licences (joueur_id, status_paiement, documents_complets)
      VALUES (?, 'en attente', 0)
    `, [joueurId]);

    await db.run("COMMIT");

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/licences');
    revalidatePath('/direction/dashboard');
    revalidatePath('/equipes', 'layout');

    return { success: true };
  } catch (e: any) {
    await db.run("ROLLBACK");
    return { error: e.message };
  }
}

export async function deletePlayerAction(joueurId: number) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run("BEGIN TRANSACTION");

    await db.run("DELETE FROM Licences WHERE joueur_id = ?", [joueurId]);
    await db.run("DELETE FROM ConvocationResponses WHERE joueur_id = ?", [joueurId]);
    await db.run("DELETE FROM Presences WHERE joueur_id = ?", [joueurId]);
    await db.run("DELETE FROM PlayerPerformanceLogs WHERE joueur_id = ?", [joueurId]);
    await db.run("DELETE FROM FlashFormeLogs WHERE joueur_id = ?", [joueurId]);
    await db.run("DELETE FROM MatchNotes WHERE joueur_id = ?", [joueurId]);
    await db.run("DELETE FROM Observations WHERE joueur_id = ?", [joueurId]);
    await db.run("DELETE FROM NotifsLog WHERE joueur_id = ?", [joueurId]);
    await db.run("DELETE FROM Joueurs WHERE id = ?", [joueurId]);

    await db.run("COMMIT");

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/licences');
    revalidatePath('/direction/dashboard');
    revalidatePath('/equipes', 'layout');

    return { success: true };
  } catch (e: any) {
    await db.run("ROLLBACK");
    return { error: e.message };
  }
}

export async function getAllTeamsAction() {
  const session = await getSession();
  if (!session || !['Direction', 'Admin', 'Coach'].includes(session.roleName)) return [];

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    const teams = await db.all("SELECT id, nom, categorie FROM Equipes ORDER BY nom ASC");
    return teams;
  } catch (e) {
  }
}

export async function updatePlayerPhotoAction(joueurId: number, photoUrl: string) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run("UPDATE Joueurs SET photo_url = ? WHERE id = ?", [photoUrl, joueurId]);
    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/coach/joueur/${joueurId}`);
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updatePlayerDateNaissanceAction(joueurId: number, dateNaissance: string) {
  const session = await getSession();
  if (!session) return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run("UPDATE Joueurs SET date_naissance = ? WHERE id = ?", [dateNaissance, joueurId]);
    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/coach/joueur/${joueurId}`);
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updatePlayerAction(joueurId: number, formData: FormData) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Non autorisé" };

  const nom = (formData.get('nom') as string)?.toUpperCase();
  const prenom = (formData.get('prenom') as string)?.toUpperCase();
  const email = formData.get('email') as string || null;
  const telephone = formData.get('telephone') as string || null;
  const num_licence = formData.get('num_licence') as string || null;
  const adresse = formData.get('adresse') as string || null;
  const date_naissance = formData.get('date_naissance') as string || null;
  const mot_de_passe = formData.get('mot_de_passe') as string || null;
  const poste = formData.get('poste') as string || null;
  
  // Calculate category automatically from date_naissance
  const categorie_actuelle = getPlayerCategoryByAge(date_naissance);
  
  const equipe_id_str = formData.get('equipe_id') as string;
  const equipe_id = equipe_id_str ? parseInt(equipe_id_str) : null;
  const photo = formData.get('photo') as File | null;
  let photo_url: string | null = null;

  if (photo && photo.size > 0) {
    const fs = await import('fs/promises');
    const path = await import('path');
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    try { await fs.mkdir(uploadDir, { recursive: true }); } catch(e) {}
    await fs.writeFile(path.join(uploadDir, fileName), buffer);
    photo_url = `/uploads/${fileName}`;
  }

  if (!nom || !prenom) {
    return { error: "Le nom et le prénom sont requis." };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    if (email) {
      // Allow multiple accounts with the same email.
    }

    if (photo_url) {
      await db.run(`
        UPDATE Joueurs 
        SET nom = ?, prenom = ?, email = ?, telephone = ?, num_licence = ?, adresse = ?, categorie_actuelle = ?, equipe_id = ?, date_naissance = ?, photo_url = ?, poste = ?
        WHERE id = ?
      `, [nom, prenom, email, telephone, num_licence, adresse, categorie_actuelle, equipe_id, date_naissance, photo_url, poste, joueurId]);
    } else {
      await db.run(`
        UPDATE Joueurs 
        SET nom = ?, prenom = ?, email = ?, telephone = ?, num_licence = ?, adresse = ?, categorie_actuelle = ?, equipe_id = ?, date_naissance = ?, poste = ?
        WHERE id = ?
      `, [nom, prenom, email, telephone, num_licence, adresse, categorie_actuelle, equipe_id, date_naissance, poste, joueurId]);
    }

    if (email && mot_de_passe) {
      const { createHash } = await import('node:crypto');
      const pwd_hash = createHash('sha256').update(mot_de_passe).digest('hex');
      const existingUser = await db.get("SELECT id FROM Users WHERE player_id = ?", [joueurId]);
      if (existingUser) {
        await db.run("UPDATE Users SET email = ?, password_hash = ? WHERE player_id = ?", [email, pwd_hash, joueurId]);
      } else {
        await db.run("INSERT INTO Users (email, password_hash, role, player_id) VALUES (?, ?, ?, ?)", [email, pwd_hash, 'Joueur', joueurId]);
      }
    } else if (email) {
      await db.run("UPDATE Users SET email = ? WHERE player_id = ?", [email, joueurId]);
    }

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/licences');
    revalidatePath('/direction/dashboard');
    revalidatePath('/equipes', 'layout');

    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function notifyCoachMissingDocumentsAction(joueurId: number) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();
  
  try {
    const player = await db.get(`
      SELECT j.id, j.nom, j.prenom, j.equipe_id, e.nom as equipe_nom 
      FROM Joueurs j
      LEFT JOIN Equipes e ON j.equipe_id = e.id
      WHERE j.id = ?
    `, [joueurId]);

    if (!player || !player.equipe_id) {
      return { error: "Joueur introuvable ou aucune équipe assignée." };
    }

    const coaches = await db.all(`
      SELECT s.id, s.email, s.prenom, s.nom
      FROM Staff s
      WHERE s.equipe_id = ? AND s.email IS NOT NULL AND s.email != ''
    `, [player.equipe_id]);

    if (!coaches || coaches.length === 0) {
      return { error: "Aucun coach avec adresse email trouvé pour cette équipe." };
    }

    console.log(`[EMAIL] To: ${coaches.map((c: any) => c.email).join(', ')} | Sujet: Dossier incomplet pour ${player.prenom} ${player.nom}`);
    
    await db.run(`
      INSERT INTO IntelligenceFeed (type, source, titre, contenu, gravite)
      VALUES (?, ?, ?, ?, ?)
    `, [
      "Logistique",
      "Système",
      `Dossier incomplet : ${player.prenom} ${player.nom}`,
      `Alerte envoyée aux coachs de ${player.equipe_nom} concernant les pièces manquantes.`,
      "warning"
    ]);

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/dashboard');

    return { success: true, count: coaches.length };
  } catch(e: any) {
    return { error: e.message };
  }
}


export async function addIndisponibilite(formData: FormData) {
  const session = await getSession();
  if (!session || session.roleName !== 'Coach') return { error: "Non autorisé" };

  const joueur_id = parseInt(formData.get('joueur_id') as string);
  const type = formData.get('type') as string;
  const date_debut = formData.get('date_debut') as string;
  const date_fin = formData.get('date_fin') as string || null;
  const nb_matchs = parseInt(formData.get('nb_matchs') as string) || 0;
  const raison = formData.get('raison') as string || '';

  if (!joueur_id || !type || !date_debut) {
    return { error: "Joueur, type et date de début requis." };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run(`
      INSERT INTO Indisponibilites (joueur_id, type, date_debut, date_fin, nb_matchs, raison)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [joueur_id, type, date_debut, date_fin, nb_matchs, raison]);

    // Update the player's current status if it's an active unavailability
    const isActive = (!date_fin || new Date(date_fin) >= new Date()) && type === 'blessure';
    if (isActive) {
      await db.run(`
        UPDATE Joueurs SET indisponibilite_type = ? WHERE id = ?
      `, [type, joueur_id]);
    } else if (type === 'suspension') {
      await db.run(`
        UPDATE Joueurs SET indisponibilite_type = ? WHERE id = ?
      `, [type, joueur_id]);
    }

    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/coach/joueur/${joueur_id}`);
    revalidatePath(`/coach/effectif`);
    
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteIndisponibilite(id: number, joueurId: number) {
  const session = await getSession();
  if (!session || session.roleName !== 'Coach') return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run("DELETE FROM Indisponibilites WHERE id = ?", [id]);
    
    const active = await db.get("SELECT type FROM Indisponibilites WHERE joueur_id = ? AND (date_fin IS NULL OR date_fin >= date('now')) LIMIT 1", [joueurId]);
    await db.run("UPDATE Joueurs SET indisponibilite_type = ? WHERE id = ?", [active ? active.type : null, joueurId]);

    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/coach/joueur/${joueurId}`);
    revalidatePath(`/coach/effectif`);

    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function saveMatchStats(formData: FormData) {
  const session = await getSession();
  if (!session || session.roleName !== 'Coach') return { error: "Non autorisé" };

  const joueur_id = parseInt(formData.get('joueur_id') as string);
  const evenement_id = parseInt(formData.get('evenement_id') as string);
  const buts = parseInt(formData.get('buts') as string) || 0;
  const passes = parseInt(formData.get('passes') as string) || 0;
  const cartons_jaunes = parseInt(formData.get('cartons_jaunes') as string) || 0;
  const carton_rouge = parseInt(formData.get('carton_rouge') as string) || 0;
  const minutes_jouees = parseInt(formData.get('minutes_jouees') as string) || 0;

  if (!joueur_id || !evenement_id) {
    return { error: "Joueur et match requis." };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run(`
      INSERT INTO MatchStats (joueur_id, evenement_id, buts, passes, cartons_jaunes, carton_rouge, minutes_jouees)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(joueur_id, evenement_id) DO UPDATE SET
        buts = excluded.buts,
        passes = excluded.passes,
        cartons_jaunes = excluded.cartons_jaunes,
        carton_rouge = excluded.carton_rouge,
        minutes_jouees = excluded.minutes_jouees
    `, [joueur_id, evenement_id, buts, passes, cartons_jaunes, carton_rouge, minutes_jouees]);

    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/coach/joueur/${joueur_id}`);
    revalidatePath(`/coach/effectif`);
    
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updatePlayerPoste(formData: FormData) {
  const session = await getSession();
  if (!session || session.roleName !== 'Coach') return { error: "Non autorisé" };

  const joueur_id = parseInt(formData.get('joueur_id') as string);
  const poste = formData.get('poste') as string;

  if (!joueur_id || !poste) {
    return { error: "Joueur et poste requis." };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run(`
      UPDATE Joueurs
      SET poste = ?
      WHERE id = ?
    `, [poste, joueur_id]);

    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/coach/joueur/${joueur_id}`);
    revalidatePath(`/coach/effectif`);
    
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updatePlayerEquipeAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.roleName !== 'Coach') return { error: "Non autorisé" };

  const joueur_id = parseInt(formData.get('joueur_id') as string);
  const equipe_id = parseInt(formData.get('equipe_id') as string);

  if (!joueur_id || !equipe_id) {
    return { error: "Joueur et équipe requis." };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run(`
      UPDATE Joueurs
      SET equipe_id = ?
      WHERE id = ?
    `, [equipe_id, joueur_id]);

    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/coach/joueur/${joueur_id}`);
    revalidatePath(`/coach/effectif`);
    
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function sendCoachMessage(formData: FormData) {
  const session = await getSession();
  if (!session || session.roleName !== 'Coach') return { error: "Non autorisé" };

  const message = formData.get('message') as string;
  const target = formData.get('target') as string;

  if (!message || !target) {
    return { error: "Message et destinataire requis." };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    let receiverType = 'direction';
    let receiverId = null;

    if (target.startsWith('EQUIPE_')) {
       receiverType = 'equipe';
       receiverId = parseInt(target.split('_')[1]);
    }

    await db.run(`
      INSERT INTO Messages (sender_id, sender_role, receiver_type, target_id, content)
      VALUES (?, ?, ?, ?, ?)
    `, [session.userId, 'Coach', receiverType, receiverId, message]);

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/coach/dashboard');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function addBuvetteStockAction(nom: string, categorie: string, quantite: number, seuil_alerte: number) {
  const session = await getSession();
  if (!session || session.roleName !== 'Direction') return { error: "Unauthorized" };

  const { getDb } = await import('./db');
  const db = await getDb();
  try {
    await db.run(
      "INSERT INTO BuvetteStocks (nom, categorie, quantite, seuil_alerte) VALUES (?, ?, ?, ?)",
      [nom, categorie, quantite, seuil_alerte]
    );

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/direction/buvette');
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function calculateDynamicPlayerAnalysis(playerId: number) {
  const { getDb } = await import('./db');
  const db = await getDb();
  
  const player = await db.get("SELECT aptitude_technique, aptitude_tactique, aptitude_physique, aptitude_mentale FROM Joueurs WHERE id = ?", [playerId]);
  if (!player) return null;

  // Base stats (Coach manual entry)
  const baseTech = player.aptitude_technique || 3;
  const baseTac = player.aptitude_tactique || 3;
  const basePhy = player.aptitude_physique || 3;
  const baseMen = player.aptitude_mentale || 3;

  // Modifiers
  let modTech = 0;
  let modTac = 0;
  let modPhy = 0;
  let modMen = 0;

  const logs = [];

  // 1. Match Stats
  const matchStats = await db.all("SELECT buts, passes, cartons_jaunes, carton_rouge, minutes_jouees FROM MatchStats WHERE joueur_id = ? AND created_at >= date('now', '-90 days')", [playerId]);
  if (matchStats.length > 0) {
    let totalButs = 0;
    let totalPasses = 0;
    let totalJaunes = 0;
    let totalRouge = 0;
    let totalMinutes = 0;
    for (const ms of matchStats) {
      totalButs += ms.buts || 0;
      totalPasses += ms.passes || 0;
      totalJaunes += ms.cartons_jaunes || 0;
      totalRouge += ms.carton_rouge || 0;
      totalMinutes += ms.minutes_jouees || 0;
    }

    if (totalButs > 0) {
      modTech += totalButs * 0.1;
      logs.push(`+${(totalButs * 0.1).toFixed(1)} Tech (Buts en match)`);
    }
    if (totalPasses > 0) {
      modTac += totalPasses * 0.1;
      logs.push(`+${(totalPasses * 0.1).toFixed(1)} Tac (Passes décisives)`);
    }
    if (totalMinutes > 90) {
      modPhy += 0.2;
      logs.push('+0.2 Phy (Volume de jeu)');
    }
    if (totalJaunes > 0) {
      modMen -= totalJaunes * 0.2;
      logs.push(`-${(totalJaunes * 0.2).toFixed(1)} Men (Cartons Jaunes)`);
    }
    if (totalRouge > 0) {
      modMen -= totalRouge * 0.5;
      logs.push(`-${(totalRouge * 0.5).toFixed(1)} Men (Carton Rouge)`);
    }
  }

  // 2. Video Tags
  const videoTags = await db.all("SELECT action_type, COUNT(*) as count FROM VideoTags WHERE joueur_id = ? AND created_at >= date('now', '-90 days') GROUP BY action_type", [playerId]);
  let positiveTags = 0;
  let negativeTags = 0;
  for (const vt of videoTags) {
    const act = vt.action_type.toLowerCase();
    if (act.includes('bonne') || act.includes('cadré') || act.includes('décisive')) {
      positiveTags += vt.count;
    } else if (act.includes('mauvaise') || act.includes('raté')) {
      negativeTags += vt.count;
    }
  }
  if (positiveTags > 0) {
    modTech += positiveTags * 0.05;
    modTac += positiveTags * 0.05;
    logs.push(`+${(positiveTags * 0.05).toFixed(1)} Tech/Tac (${positiveTags} actions vidéo positives)`);
  }
  if (negativeTags > 0) {
    modTech -= negativeTags * 0.02;
    modTac -= negativeTags * 0.02;
    logs.push(`-${(negativeTags * 0.02).toFixed(1)} Tech/Tac (${negativeTags} actions vidéo négatives)`);
  }

  // 3. Flash Forme
  const forme = await db.get("SELECT AVG(sleep_quality) as sleep, AVG(energy_level) as energy, AVG(pain_level) as pain, AVG(stress_level) as stress FROM FlashFormeLogs WHERE joueur_id = ? AND date >= date('now', '-30 days')", [playerId]);
  if (forme) {
    if (forme.sleep >= 4 && forme.energy >= 4) {
      modPhy += 0.3;
      logs.push('+0.3 Phy (Excellente récupération & énergie)');
    } else if (forme.sleep < 3 || forme.energy < 3) {
      modPhy -= 0.3;
      logs.push('-0.3 Phy (Déficit de sommeil/énergie)');
    }

    if (forme.pain >= 3) {
      modPhy -= 0.4;
      logs.push('-0.4 Phy (Douleurs récurrentes signalées)');
    }

    if (forme.stress >= 4) {
      modMen -= 0.3;
      logs.push('-0.3 Men (Niveau de stress élevé)');
    }
  }

  // 4. Présences (Retards / Absences)
  const presences = await db.all("SELECT statut, COUNT(*) as count FROM Presences WHERE joueur_id = ? GROUP BY statut", [playerId]);
  let absences = 0;
  let retards = 0;
  for (const p of presences) {
    if (p.statut === 'absent') absences = p.count;
    if (p.statut === 'retard') retards = p.count;
  }
  if (absences > 0) {
    modMen -= absences * 0.2;
    logs.push(`-${(absences * 0.2).toFixed(1)} Men (${absences} absences)`);
  }
  if (retards > 0) {
    modMen -= retards * 0.1;
    logs.push(`-${(retards * 0.1).toFixed(1)} Men (${retards} retards)`);
  }

  // 5. Indisponibilités
  const indispos = await db.all("SELECT type, COUNT(*) as count FROM Indisponibilites WHERE joueur_id = ? AND created_at >= date('now', '-90 days') GROUP BY type", [playerId]);
  for (const ind of indispos) {
    if (ind.type === 'blessure') {
      modPhy -= ind.count * 0.5;
      logs.push(`-${(ind.count * 0.5).toFixed(1)} Phy (${ind.count} blessure(s) récente(s))`);
    } else if (ind.type === 'suspension') {
      modMen -= ind.count * 0.5;
      logs.push(`-${(ind.count * 0.5).toFixed(1)} Men (${ind.count} suspension(s))`);
    }
  }

  // Calculate final
  const clamp = (val: number) => Math.max(1, Math.min(5, Number(val.toFixed(2))));
  const finalTech = clamp(baseTech + modTech);
  const finalTac = clamp(baseTac + modTac);
  const finalPhy = clamp(basePhy + modPhy);
  const finalMen = clamp(baseMen + modMen);

  let syntheseText = "";
  if (logs.length > 0) {
    syntheseText = "Impact algorithmique des données récentes (90 derniers jours) : " + logs.join(", ") + ".";
  } else {
    syntheseText = "Pas assez de données récentes (Matchs, Vidéo, Forme) pour générer une analyse algorithmique. Les notes affichées sont celles saisies manuellement par le staff.";
  }

  return {
    base: { tech: baseTech, tac: baseTac, phy: basePhy, men: baseMen },
    modifiers: { tech: modTech, tac: modTac, phy: modPhy, men: modMen },
    final: { tech: finalTech, tac: finalTac, phy: finalPhy, men: finalMen },
    synthese: syntheseText
  };
}

export async function uploadMatchVideoAction(formData: FormData) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction')) {
    return { error: "Non autorisé" };
  }

  const titre = formData.get('titre') as string;
  const evenement_id = formData.get('evenement_id') ? parseInt(formData.get('evenement_id') as string) : null;
  const file = formData.get('video') as File;

  if (!titre || !file || !file.name) {
    return { error: "Titre et fichier vidéo requis." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create uploads directory if it doesn't exist
    const { mkdir, writeFile } = await import('fs/promises');
    const path = await import('path');
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      console.log("Directory already exists or error", e);
    }

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const file_url = `/uploads/videos/${filename}`;

    const { getDb } = await import('./db');
    const db = await getDb();

    const result = await db.run(`
      INSERT INTO MatchVideos (evenement_id, titre, file_url)
      VALUES (?, ?, ?)
    `, [evenement_id, titre, file_url]);

    const { revalidatePath } = await import('next/cache');
    revalidatePath('/coach/video-analyse');

    return { success: true, videoId: result.lastID };
  } catch (error: any) {
    console.error("Error uploading video:", error);
    return { error: "Erreur lors du téléchargement de la vidéo." };
  }
}

export async function saveVideoTagAction(videoId: number, joueurId: number, timestamp: number, actionType: string) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction')) {
    return { error: "Non autorisé" };
  }

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    await db.run("BEGIN TRANSACTION");

    await db.run(`
      INSERT INTO VideoTags (video_id, joueur_id, timestamp, action_type)
      VALUES (?, ?, ?, ?)
    `, [videoId, joueurId, timestamp, actionType]);

    // Update player's notes based on the action
    const player = await db.get("SELECT aptitude_technique, aptitude_tactique, aptitude_physique, aptitude_mentale FROM Joueurs WHERE id = ?", [joueurId]);
    
    if (player) {
      let modTech = 0;
      let modTac = 0;
      let modPhy = 0;
      let modMen = 0;

      switch(actionType) {
        case 'Bonne passe': modTech += 0.1; modTac += 0.1; break;
        case 'Mauvaise passe': modTech -= 0.1; modTac -= 0.1; break;
        case 'Tir tenté': modTech += 0.1; modMen += 0.1; break;
        case 'Tir cadré': modTech += 0.2; modMen += 0.1; break;
        case 'Passe décisive': modTech += 0.3; modTac += 0.2; break;
        case 'Interception': modTac += 0.2; modPhy += 0.1; break;
        case 'Faute': modMen -= 0.1; modTac -= 0.1; break;
        case 'Perte de balle': modTech -= 0.1; modMen -= 0.1; break;
        case 'But': modTech += 0.5; modMen += 0.2; break;
      }

      const clamp = (val: number) => Math.max(1, Math.min(5, Number(val.toFixed(2))));
      const newTech = clamp(player.aptitude_technique + modTech);
      const newTac = clamp(player.aptitude_tactique + modTac);
      const newPhy = clamp(player.aptitude_physique + modPhy);
      const newMen = clamp(player.aptitude_mentale + modMen);

      await db.run(`
        UPDATE Joueurs 
        SET aptitude_technique = ?, aptitude_tactique = ?, aptitude_physique = ?, aptitude_mentale = ? 
        WHERE id = ?
      `, [newTech, newTac, newPhy, newMen, joueurId]);
    }

    await db.run("COMMIT");

    const { revalidatePath } = await import('next/cache');
    revalidatePath(`/coach/video-analyse/${videoId}`);
    revalidatePath(`/coach/joueur/${joueurId}`);

    return { success: true };
  } catch (error: any) {
    await db.run("ROLLBACK");
    console.error("Error saving video tag:", error);
    return { error: "Erreur lors de l'enregistrement du tag." };
  }
}

export async function getMatchVideosAction() {
  const session = await getSession();
  if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction')) return [];

  const { getDb } = await import('./db');
  const db = await getDb();
  
  const videos = await db.all(`
    SELECT mv.*, e.titre as event_titre, e.date as event_date, eq.nom as equipe_nom
    FROM MatchVideos mv
    LEFT JOIN Evenements e ON mv.evenement_id = e.id
    LEFT JOIN Equipes eq ON e.equipe_id = eq.id
    ORDER BY mv.created_at DESC
  `);
  
  return videos;
}

export async function getVideoByIdAction(videoId: number) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction')) return null;

  const { getDb } = await import('./db');
  const db = await getDb();
  
  const video = await db.get(`
    SELECT mv.*, e.titre as event_titre, e.date as event_date, e.equipe_id
    FROM MatchVideos mv
    LEFT JOIN Evenements e ON mv.evenement_id = e.id
    WHERE mv.id = ?
  `, [videoId]);
  
  return video;
}

export async function getVideoTagsAction(videoId: number) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction')) return [];

  const { getDb } = await import('./db');
  const db = await getDb();
  
  const tags = await db.all(`
    SELECT vt.*, j.nom, j.prenom, j.photo_url
    FROM VideoTags vt
    LEFT JOIN Joueurs j ON vt.joueur_id = j.id
    WHERE vt.video_id = ?
    ORDER BY vt.timestamp ASC
  `, [videoId]);
  
  return tags;
}

export async function deleteVideoTagAction(tagId: number) {
  const session = await getSession();
  if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction')) return { error: "Non autorisé" };

  const { getDb } = await import('./db');
  const db = await getDb();

  try {
    const tag = await db.get("SELECT video_id FROM VideoTags WHERE id = ?", [tagId]);
    if (tag) {
      await db.run("DELETE FROM VideoTags WHERE id = ?", [tagId]);
      
      const { revalidatePath } = await import('next/cache');
      revalidatePath(`/coach/video-analyse/${tag.video_id}`);
    }
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}


