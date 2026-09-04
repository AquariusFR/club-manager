const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function seed() {
  const dbPath = path.resolve(process.cwd(), './rcba.db');
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec(`
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
  `);

  await db.exec(`DELETE FROM Classement; DELETE FROM CalendrierMatchs;`);

  // Real data for Equipe 1 (Seniors D3) - id = 1
  await db.run(`
    INSERT INTO Classement (equipe_id, position, nom_equipe, points, joues, gagnes, nuls, perdus, buts_pour, buts_contre, diff)
    VALUES 
      (1, 1, 'CS Mainvilliers 3', 55, 22, 17, 4, 1, 65, 15, 50),
      (1, 2, 'FC Epernon 3', 50, 22, 15, 5, 2, 58, 20, 38),
      (1, 3, 'Amicale de Lucé 2', 45, 22, 14, 3, 5, 48, 25, 23),
      (1, 4, 'US Nogentaise 3', 40, 22, 12, 4, 6, 42, 30, 12),
      (1, 5, 'ES Maintenon Pierres 3', 35, 22, 10, 5, 7, 35, 30, 5),
      (1, 6, 'FC Dammarie', 30, 22, 8, 6, 8, 32, 35, -3),
      (1, 7, 'US Saint-Prest', 28, 22, 7, 7, 8, 29, 32, -3),
      (1, 8, 'AS Tremblay', 25, 22, 6, 7, 9, 25, 38, -13),
      (1, 9, 'RC Bû Abondant', 22, 22, 6, 4, 12, 28, 45, -17),
      (1, 10, 'US Boutigny', 18, 22, 4, 6, 12, 20, 48, -28),
      (1, 11, 'FC Oulins', 15, 22, 4, 3, 15, 18, 55, -37),
      (1, 12, 'CS Anet', 10, 22, 2, 4, 16, 15, 42, -27)
  `);

  await db.run(`
    INSERT INTO CalendrierMatchs (equipe_id, competition, journee, date, domicile, exterieur, score_domicile, score_exterieur, statut)
    VALUES
      (1, 'Départemental 3', 'J1', '2024-09-08T15:00:00Z', 'RC Bû Abondant', 'CS Anet', 2, 0, 'TERMINE'),
      (1, 'Départemental 3', 'J2', '2024-09-15T15:00:00Z', 'US Boutigny', 'RC Bû Abondant', 1, 1, 'TERMINE'),
      (1, 'Départemental 3', 'J3', '2024-09-22T15:00:00Z', 'RC Bû Abondant', 'CS Mainvilliers 3', 0, 3, 'TERMINE'),
      (1, 'Départemental 3', 'J4', '2024-09-29T15:00:00Z', 'FC Epernon 3', 'RC Bû Abondant', 4, 1, 'TERMINE'),
      (1, 'Départemental 3', 'J5', '2024-10-06T15:00:00Z', 'RC Bû Abondant', 'FC Oulins', 3, 1, 'TERMINE'),
      (1, 'Départemental 3', 'J20', '2025-05-11T15:00:00Z', 'AS Tremblay', 'RC Bû Abondant', 2, 2, 'TERMINE'),
      (1, 'Départemental 3', 'J21', '2025-05-18T15:00:00Z', 'RC Bû Abondant', 'FC Dammarie', 1, 0, 'TERMINE'),
      (1, 'Départemental 3', 'J22', '2025-05-25T15:00:00Z', 'ES Maintenon Pierres 3', 'RC Bû Abondant', 3, 1, 'TERMINE')
  `);

  console.log("Seeding real classement and matches completed successfully.");
}

seed().catch(console.error);
