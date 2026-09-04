const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'rcba.db');
const db = new sqlite3.Database(dbPath);

async function run() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS Evenements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipe_id INTEGER,
      titre TEXT,
      date TEXT,
      heure TEXT,
      lieu TEXT,
      adversaire TEXT,
      type TEXT CHECK(type IN ('match', 'entraînement', 'autre')),
      FOREIGN KEY (equipe_id) REFERENCES Equipes(id)
    );`,
    `CREATE TABLE IF NOT EXISTS Convocations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evenement_id INTEGER,
      message TEXT,
      FOREIGN KEY (evenement_id) REFERENCES Evenements(id)
    );`,
    `CREATE TABLE IF NOT EXISTS ConvocationResponses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      convocation_id INTEGER,
      joueur_id INTEGER,
      statut TEXT,
      FOREIGN KEY (convocation_id) REFERENCES Convocations(id),
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id)
    );`,
    `CREATE TABLE IF NOT EXISTS Presences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      evenement_id INTEGER,
      joueur_id INTEGER,
      statut TEXT,
      FOREIGN KEY (evenement_id) REFERENCES Evenements(id),
      FOREIGN KEY (joueur_id) REFERENCES Joueurs(id)
    );`
  ];

  for (const q of queries) {
    await new Promise((resolve, reject) => {
      db.run(q, (err) => {
        if (err) {
          console.error("Error running query:", err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  
  console.log("Missing tables created successfully.");

  // Also patch lib/db.ts to include these tables so they persist in future setups
}

run().then(() => db.close()).catch(console.error);
