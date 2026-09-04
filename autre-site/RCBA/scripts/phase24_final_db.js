const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'rcba.db');
const db = new sqlite3.Database(dbPath);

async function runStep(sql, msg) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`[SKIP] ${msg} (already exists)`);
          resolve();
        } else {
          console.error(`[ERROR] ${msg}:`, err.message);
          reject(err);
        }
      } else {
        console.log(`[SUCCESS] ${msg}`);
        resolve();
      }
    });
  });
}

async function migrateAndSeed() {
  try {
    // 1. Joueurs Table Migration (Mental Score)
    await runStep("ALTER TABLE Joueurs ADD COLUMN mental_score INTEGER DEFAULT 50", "Add mental_score to Joueurs");
    
    // 2. Resultats Table Migration
    await runStep("ALTER TABLE Resultats ADD COLUMN date TEXT", "Add date to Resultats");
    await runStep("ALTER TABLE Resultats ADD COLUMN adversaire TEXT", "Add adversaire to Resultats");
    await runStep("ALTER TABLE Resultats ADD COLUMN statut TEXT", "Add statut to Resultats");

    // 3. Staff Hierarchy Migration
    await runStep("ALTER TABLE Staff ADD COLUMN role_priority INTEGER DEFAULT 3", "Add role_priority to Staff");

    // 4. Hierarchy Override (Philippe > Pierre)
    await runStep("UPDATE Staff SET role_priority = 1 WHERE nom LIKE '%BARBIER%'", "Set Philippe Priority (1)");
    await runStep("UPDATE Staff SET role_priority = 2 WHERE nom LIKE '%MOMPO%'", "Set Pierre Priority (2)");

    // 5. Seeding Winners (High Mental Scores for some players)
    await runStep("UPDATE Joueurs SET mental_score = 95 WHERE nom LIKE '%BATT% %ELIAS%' OR nom LIKE '%LEPR% %EVAN%'", "Seed High Mental Score (Winners)");

    // 6. Seeding Results (March 2026)
    const results = [
      { equipe_id: 1, date: '29/03/2026', adversaire: 'RCBA vs AM.S. ANET', score: '0 - 2', statut: 'D' },
      { equipe_id: 1, date: '15/03/2026', adversaire: 'ENT. GALLARDON vs RCBA', score: '0 - 1', statut: 'V' },
      { equipe_id: 2, date: '29/03/2026', adversaire: 'RCBA vs CHATEAUNEUF', score: '2 - 2', statut: 'N' },
      { equipe_id: 3, date: '28/03/2026', adversaire: 'C.am. Montrichard vs RCBA', score: '2 - 5', statut: 'V' },
      { equipe_id: 3, date: '21/03/2026', adversaire: 'RCBA vs US VENDOME', score: '3 - 1', statut: 'V' },
      { equipe_id: 4, date: '21/03/2026', adversaire: 'RCBA vs ES DROUE', score: '3 - 2', statut: 'V' },
      { equipe_id: 5, date: '28/03/2026', adversaire: 'RCBA vs CHARTRES', score: '4 - 0', statut: 'V' },
      { equipe_id: 9, date: '28/03/2026', adversaire: 'U.S. CLOYES vs RCBA', score: '2 - 1', statut: 'D' },
      { equipe_id: 10, date: '29/03/2026', adversaire: 'RCBA vs DREUX AC', score: '2 - 4', statut: 'D' }
    ];

    await runStep("DELETE FROM Resultats", "Reset Resultats table");
    const stmt = db.prepare("INSERT INTO Resultats (equipe_id, date, adversaire, score, statut) VALUES (?, ?, ?, ?, ?)");
    for (const res of results) {
      stmt.run(res.equipe_id, res.date, res.adversaire, res.score, res.statut);
    }
    stmt.finalize();
    console.log("[SUCCESS] Resultats seeding complete.");

  } catch (err) {
    console.error("Migration/Seeding failed:", err);
  } finally {
    db.close();
  }
}

migrateAndSeed();
