import sqlite3 from 'sqlite3';

 import { open, Database } from 'sqlite';

 import path from 'path';

 

 let db: Database | null = null;

 

 export async function getDb() {

  if (db) return db;

  

  // The database is shared with the main site project

  const dbPath = path.resolve(process.cwd(), './rcba.db');

  

  db = await open({
   filename: dbPath,
   driver: sqlite3.Database
  });

  // Security & Performance Pragmas (First Principles)
  await db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = NORMAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;

    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      password_hash TEXT,
      role TEXT,
      staff_id INTEGER,
      player_id INTEGER
    );

    CREATE TABLE IF NOT EXISTS Equipes (
      id INTEGER PRIMARY KEY,
      nom TEXT NOT NULL,
      categorie TEXT
    );

    CREATE TABLE IF NOT EXISTS TeamStats (
      equipe_id INTEGER PRIMARY KEY,
      level TEXT,
      footeo_link TEXT,
      FOREIGN KEY (equipe_id) REFERENCES Equipes(id)
    );

    CREATE TABLE IF NOT EXISTS Resultats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipe_id INTEGER,
      date TEXT,
      adversaire TEXT,
      score TEXT,
      statut TEXT,
      FOREIGN KEY (equipe_id) REFERENCES Equipes(id)
    );

    CREATE TABLE IF NOT EXISTS Joueurs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prenom TEXT,
      equipe_id INTEGER,
      mental_score INTEGER DEFAULT 50,
      poste TEXT,
      statut TEXT,
      photo_url TEXT,
      date_naissance TEXT,
      nationalite TEXT,
      club_precedent_id INTEGER,
      aptitude_technique INTEGER DEFAULT 3,
      aptitude_tactique INTEGER DEFAULT 3,
      aptitude_physique INTEGER DEFAULT 3,
      aptitude_mentale INTEGER DEFAULT 3,
      telephone TEXT,
      categorie_actuelle TEXT,
      email TEXT,
      num_licence TEXT,
      adresse TEXT,
      numero_maillot INTEGER,
      FOREIGN KEY (equipe_id) REFERENCES Equipes(id),
      FOREIGN KEY (club_precedent_id) REFERENCES ClubsRef(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS UserLabProgress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      phase_id INTEGER NOT NULL,
      status TEXT CHECK(status IN ('LOCKED', 'UNLOCKED', 'COMPLETED')) DEFAULT 'LOCKED',
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, phase_id),
      FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS MinibusReservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requester_name TEXT NOT NULL,
      entity TEXT CHECK(entity IN ('RCBA', 'ASSO_B')) NOT NULL,
      purpose TEXT,
      destination TEXT,
      players_count INTEGER,
      category TEXT CHECK(category IN ('MATCH_OFFICIEL', 'ENTRAINEMENT', 'AUTRE')) DEFAULT 'AUTRE',
      start_time TIMESTAMP NOT NULL,
      end_time TIMESTAMP NOT NULL,
      status TEXT CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS MinibusLogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_id INTEGER,
      driver_name TEXT NOT NULL,
      entity TEXT CHECK(entity IN ('RCBA', 'ASSO_B')) NOT NULL,
      destination TEXT,
      mileage_start INTEGER NOT NULL,
      mileage_end INTEGER,
      fuel_liters REAL,
      fuel_cost REAL,
      tolls_cost REAL,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reservation_id) REFERENCES MinibusReservations(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS MinibusMaintenance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      due_date DATE NOT NULL,
      description TEXT,
      status TEXT CHECK(status IN ('OK', 'WARNING', 'CRITICAL')) DEFAULT 'OK'
    );

    CREATE TABLE IF NOT EXISTS MinibusExpenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity TEXT CHECK(entity IN ('RCBA', 'ASSO_B')) NOT NULL,
      type TEXT CHECK(type IN ('FUEL', 'TOLL', 'MAINTENANCE', 'OTHER')) NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      date DATE DEFAULT CURRENT_DATE,
      receipt_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS Carpooling (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driver_name TEXT NOT NULL,
      start_location TEXT NOT NULL,
      departure_time TEXT NOT NULL,
      available_seats INTEGER NOT NULL,
      status TEXT CHECK(status IN ('Active', 'Full', 'Cancelled')) DEFAULT 'Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS PlayerPerformanceLogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      joueur_id INTEGER NOT NULL,
      intensity INTEGER CHECK(intensity BETWEEN 1 AND 10),
      mood TEXT CHECK(mood IN ('great', 'okay', 'tired')),
      fatigue INTEGER CHECK(fatigue BETWEEN 1 AND 5),
      date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Evenements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipe_id INTEGER,
      titre TEXT,
      date TEXT,
      heure TEXT,
      lieu TEXT,
      adversaire TEXT,
      type TEXT CHECK(type IN ('match', 'entraînement', 'autre')),
      FOREIGN KEY (equipe_id) REFERENCES Equipes(id)
    );

    CREATE TABLE IF NOT EXISTS Convocations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evenement_id INTEGER,
      message TEXT,
      FOREIGN KEY (evenement_id) REFERENCES Evenements(id)
    );

    CREATE TABLE IF NOT EXISTS ConvocationResponses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      convocation_id INTEGER,
      joueur_id INTEGER,
      statut TEXT,
      besoin_covoiturage INTEGER DEFAULT 0,
      commentaire TEXT,
      UNIQUE(convocation_id, joueur_id),
      FOREIGN KEY (convocation_id) REFERENCES Convocations(id) ON DELETE CASCADE,
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Compositions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evenement_id INTEGER NOT NULL,
      formation TEXT,
      lineup_json TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (evenement_id) REFERENCES Evenements(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS MessagesRecrutement (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      nom TEXT,
      prenom TEXT,
      email TEXT,
      telephone TEXT,
      categorie TEXT,
      poste TEXT,
      experience TEXT,
      message TEXT,
      destinataire TEXT,
      lu INTEGER DEFAULT 0,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Presences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evenement_id INTEGER,
      joueur_id INTEGER,
      statut TEXT,
      FOREIGN KEY (evenement_id) REFERENCES Evenements(id),
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id)
    );

    CREATE TABLE IF NOT EXISTS Indisponibilites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      joueur_id INTEGER NOT NULL,
      type TEXT CHECK(type IN ('blessure', 'suspension', 'autre')),
      date_debut DATE,
      date_fin DATE,
      nb_matchs INTEGER,
      raison TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS MatchStats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      joueur_id INTEGER NOT NULL,
      evenement_id INTEGER NOT NULL,
      buts INTEGER DEFAULT 0,
      passes INTEGER DEFAULT 0,
      cartons_jaunes INTEGER DEFAULT 0,
      carton_rouge INTEGER DEFAULT 0,
      minutes_jouees INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id) ON DELETE CASCADE,
      FOREIGN KEY (evenement_id) REFERENCES Evenements(id) ON DELETE CASCADE,
      UNIQUE(joueur_id, evenement_id)
    );
    CREATE TABLE IF NOT EXISTS Licences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      joueur_id INTEGER,
      status_paiement TEXT,
      documents_complets INTEGER,
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id)
    );

    CREATE TABLE IF NOT EXISTS BuvetteStats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      match_id INTEGER,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      recette_totale REAL,
      depenses REAL,
      stocks_vides TEXT
    );

    CREATE TABLE IF NOT EXISTS Exercices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT,
      description TEXT,
      categorie TEXT,
      intensite INTEGER
    );

    CREATE TABLE IF NOT EXISTS EventExercises (
      evenement_id INTEGER,
      exercice_id INTEGER,
      FOREIGN KEY (evenement_id) REFERENCES Evenements(id),
      FOREIGN KEY (exercice_id) REFERENCES Exercices(id)
    );

    CREATE TABLE IF NOT EXISTS NotifsLog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      joueur_id INTEGER,
      type TEXT,
      message TEXT,
      statut TEXT,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS BuvetteStocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT,
      categorie TEXT DEFAULT 'Snack',
      quantite INTEGER,
      seuil_alerte INTEGER,
      derniere_maj TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS FlashFormeLogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      joueur_id INTEGER NOT NULL,
      sleep_quality INTEGER CHECK(sleep_quality BETWEEN 1 AND 5),
      energy_level INTEGER CHECK(energy_level BETWEEN 1 AND 5),
      pain_level INTEGER CHECK(pain_level BETWEEN 1 AND 5),
      pain_location TEXT,
      stress_level INTEGER CHECK(stress_level BETWEEN 1 AND 5),
      nutrition_hydration INTEGER CHECK(nutrition_hydration BETWEEN 1 AND 5),
      sdi_score REAL,
      date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS MatchNotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      joueur_id INTEGER NOT NULL,
      coach_id INTEGER NOT NULL,
      note_text TEXT,
      date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id) ON DELETE CASCADE,
      FOREIGN KEY (coach_id) REFERENCES Users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS Observations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      joueur_id INTEGER NOT NULL,
      coach_id INTEGER NOT NULL,
      match_id INTEGER,
      contenu TEXT,
      apt_technique INTEGER DEFAULT 3,
      apt_tactique INTEGER DEFAULT 3,
      apt_physique INTEGER DEFAULT 3,
      apt_mentale INTEGER DEFAULT 3,
      date DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id) ON DELETE CASCADE,
      FOREIGN KEY (coach_id) REFERENCES Users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS CoachSubstitutions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coach_id INTEGER NOT NULL,
      date DATE NOT NULL,
      reason TEXT,
      status TEXT CHECK(status IN ('PENDING', 'FILLED', 'CANCELLED')) DEFAULT 'PENDING',
      substitute_coach_id INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (coach_id) REFERENCES Users(id) ON DELETE CASCADE,
      FOREIGN KEY (substitute_coach_id) REFERENCES Users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS IntelligenceFeed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      source TEXT NOT NULL,
      titre TEXT NOT NULL,
      contenu TEXT NOT NULL,
      gravite TEXT CHECK(gravite IN ('info', 'warning', 'critical')) DEFAULT 'info',
      agent_key TEXT,
      metadata TEXT,
      lu INTEGER DEFAULT 0,
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      role TEXT,
      role_priority INTEGER DEFAULT 10,
      photo_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      email TEXT,
      equipe_id INTEGER,
      UNIQUE(nom, prenom)
    );

    -- Référentiel clubs openfootball (CC0 public domain)
    CREATE TABLE IF NOT EXISTS ClubsRef (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      annee_fondation INTEGER,
      stade TEXT,
      ville TEXT,
      region TEXT,
      pays TEXT DEFAULT 'France',
      aliases TEXT,
      source TEXT DEFAULT 'openfootball/clubs'
    );

    CREATE TABLE IF NOT EXISTS Classement (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipe_id INTEGER,
      position INTEGER,
      nom_equipe TEXT,
      points INTEGER,
      joues INTEGER,
      gagnes INTEGER,
      nuls INTEGER,
      perdus INTEGER,
      buts_pour INTEGER,
      buts_contre INTEGER,
      diff INTEGER,
      FOREIGN KEY (equipe_id) REFERENCES Equipes(id)
    );

    CREATE TABLE IF NOT EXISTS CalendrierMatchs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipe_id INTEGER,
      competition TEXT,
      journee TEXT,
      date TEXT,
      domicile TEXT,
      exterieur TEXT,
      score_domicile INTEGER,
      score_exterieur INTEGER,
      statut TEXT DEFAULT 'A_VENIR',
      FOREIGN KEY (equipe_id) REFERENCES Equipes(id)
    );

    CREATE INDEX IF NOT EXISTS idx_player_perf_date ON PlayerPerformanceLogs(joueur_id, date);
    CREATE INDEX IF NOT EXISTS idx_flash_forme_date ON FlashFormeLogs(joueur_id, date);
    CREATE INDEX IF NOT EXISTS idx_substitutions_date ON CoachSubstitutions(date);
    CREATE INDEX IF NOT EXISTS idx_intel_feed_date ON IntelligenceFeed(date);
    CREATE INDEX IF NOT EXISTS idx_staff_priority ON Staff(role_priority, nom);
    CREATE INDEX IF NOT EXISTS idx_clubsref_nom ON ClubsRef(nom);
    CREATE INDEX IF NOT EXISTS idx_joueurs_equipe ON Joueurs(equipe_id);
    CREATE INDEX IF NOT EXISTS idx_resultats_equipe ON Resultats(equipe_id);
    CREATE INDEX IF NOT EXISTS idx_convocations_evenement ON Convocations(evenement_id);
    CREATE INDEX IF NOT EXISTS idx_indisponibilites_joueur ON Indisponibilites(joueur_id);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_convocation_resp_unique ON ConvocationResponses(convocation_id, joueur_id);
    
    CREATE TABLE IF NOT EXISTS Messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      sender_role TEXT,
      receiver_type TEXT CHECK(receiver_type IN ('equipe', 'direction', 'joueur')) NOT NULL,
      target_id INTEGER,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS BoutiqueReservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      produit_id TEXT NOT NULL,
      produit_nom TEXT NOT NULL,
      taille TEXT NOT NULL,
      acheteur_nom TEXT NOT NULL,
      acheteur_email TEXT NOT NULL,
      statut TEXT DEFAULT 'En attente',
      date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS MatchVideos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evenement_id INTEGER,
      titre TEXT,
      file_url TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (evenement_id) REFERENCES Evenements(id)
    );

    CREATE TABLE IF NOT EXISTS VideoTags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      video_id INTEGER NOT NULL,
      joueur_id INTEGER,
      timestamp REAL NOT NULL,
      action_type TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (video_id) REFERENCES MatchVideos(id) ON DELETE CASCADE,
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id) ON DELETE SET NULL
    );
  `);

  // Migration de sécurité / résilience pour ajouter les colonnes si la table préexistait
  try {
    await db.exec(`ALTER TABLE ConvocationResponses ADD COLUMN besoin_covoiturage INTEGER DEFAULT 0;`);
  } catch {}
  try {
    await db.exec(`ALTER TABLE ConvocationResponses ADD COLUMN commentaire TEXT;`);
  } catch {}



  return db;
 }

 
