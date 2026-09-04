const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'rcba.db');
const scrapedDataPath = path.join(__dirname, '..', 'scraped_data.json');

let scrapedData = { leaders: [], teams: [], recent_results: [] };
if (fs.existsSync(scrapedDataPath)) {
  try {
    scrapedData = JSON.parse(fs.readFileSync(scrapedDataPath, 'utf8'));
    console.log("Loaded scraped data from scraped_data.json");
  } catch (e) {
    console.error("Error parsing scraped_data.json:", e);
  }
}

const db = new sqlite3.Database(dbPath);

const hardcodedTeams = [
  { id: 1,  nom: 'Senior (D3)',      cat: 'Seniors & Vétérans', level: 'District 3 - Poule B', link: 'https://rcba.footeo.com/saison-2025-2026/d3/equipe-r-c-b-a-senior.html' },
  { id: 10, nom: 'Vétéran (D1)',     cat: 'Seniors & Vétérans', level: 'District 1 - Poule A', link: 'https://rcba.footeo.com/saison-2025-2026/d1/equipe-r-c-b-a-veteran.html' },
  { id: 12, nom: 'Vétéran (D3)',     cat: 'Seniors & Vétérans', level: 'District 3 - Poule A', link: 'https://rcba.footeo.com/saison-2025-2026/d3/equipe-r-c-b-a-veteran-1.html' },
  { id: 3,  nom: 'U18 (R2)',         cat: 'Jeunes (U12-U18)',   level: 'R2 - Poule B',         link: 'https://rcba.footeo.com/saison-2025-2026/r2/equipe-r-c-b-a-u18-1.html' },
  { id: 11, nom: 'U18 (D1)',         cat: 'Jeunes (U12-U18)',   level: 'District 1 - Poule B', link: 'https://rcba.footeo.com/saison-2025-2026/d1/equipe-r-c-b-a-u18.html' },
  { id: 4,  nom: 'U15 (D2)',         cat: 'Jeunes (U12-U18)',   level: 'District 2 - Poule B', link: 'https://rcba.footeo.com/saison-2025-2026/d2/equipe-r-c-b-a-u15.html' },
  { id: 9,  nom: 'U15 Féminines',    cat: 'Féminines',          level: 'Eure-et-Loir',         link: 'https://rcba.footeo.com/saison-2025-2026/eure-et-loir/equipe-r-c-b-a-u15f.html' },
  { id: 13, nom: 'U13 (D2)',         cat: 'Jeunes (U12-U18)',   level: 'District 2 - Poule A', link: 'https://rcba.footeo.com/saison-2025-2026/d2/equipe-r-c-b-a-u13.html' },
  { id: 14, nom: 'U13 (D3)',         cat: 'Jeunes (U12-U18)',   level: 'District 3 - Poule A', link: 'https://rcba.footeo.com/saison-2025-2026/d3/equipe-r-c-b-a-u13-1.html' },
  { id: 18, nom: 'U12 (D1)',         cat: 'Jeunes (U12-U18)',   level: 'District 1 - Poule A', link: 'https://rcba.footeo.com/saison-2025-2026/d1/equipe-r-c-b-a-u12.html' },
  { id: 6,  nom: 'U11 (Niveau 2)',   cat: 'École de Foot',      level: 'Niveau 2',             link: 'https://rcba.footeo.com/saison-2025-2026/niveau-2/equipe-r-c-b-a-u11.html' },
  { id: 15, nom: 'U11 (Niveau 3-1)', cat: 'École de Foot',      level: 'Niveau 3',             link: 'https://rcba.footeo.com/saison-2025-2026/niveau-3/equipe-r-c-b-a-u11-1.html' },
  { id: 16, nom: 'U11 (Niveau 3-2)', cat: 'École de Foot',      level: 'Niveau 3',             link: 'https://rcba.footeo.com/saison-2025-2026/niveau-3/equipe-r-c-b-a-u11-2.html' },
  { id: 17, nom: 'U10 (Niveau 1)',   cat: 'École de Foot',      level: 'Niveau 1',             link: 'https://rcba.footeo.com/saison-2025-2026/niveau-1/equipe-r-c-b-a-u10.html' },
  { id: 7,  nom: 'U9 (Niveau 1)',    cat: 'École de Foot',      level: 'Niveau 1',             link: 'https://rcba.footeo.com/saison-2025-2026/niveau-1/equipe-r-c-b-a-u9.html' },
  { id: 19, nom: 'U9 (Niveau 2)',    cat: 'École de Foot',      level: 'Niveau 2',             link: 'https://rcba.footeo.com/saison-2025-2026/niveau-2/equipe-r-c-b-a-u9-1.html' },
  { id: 8,  nom: 'U7 (+ Baby)',      cat: 'École de Foot',      level: 'Plateau',              link: 'https://rcba.footeo.com/saison-2025-2026/plateau/equipe-r-c-b-a-u7-baby.html' }
];

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function sync() {
  console.log("Starting RCBA Technical Data Sync...");

  // 1. Sync Teams
  for (const team of hardcodedTeams) {
    console.log(`Processing team: ${team.nom}...`);

    await run(`
      INSERT INTO Equipes (id, nom, categorie) 
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET nom = excluded.nom, categorie = excluded.categorie
    `, [team.id, team.nom, team.cat]);

    await run(`
      INSERT INTO TeamStats (equipe_id, level, footeo_link)
      VALUES (?, ?, ?)
      ON CONFLICT(equipe_id) DO UPDATE SET 
        level = excluded.level,
        footeo_link = excluded.footeo_link
    `, [team.id, team.level, team.link]);
  }

  // 2. Sync Staff (Leaders)
  console.log("Syncing Club Leaders...");
  await run("DELETE FROM Staff WHERE equipe_id IS NULL"); // Clean up global leaders
  for (const leader of scrapedData.leaders) {
    let priority = 10;
    const roleLower = leader.role.toLowerCase();
    
    if (roleLower.includes("président") || 
        roleLower.includes("secrétaire") || 
        roleLower.includes("trésorier") || 
        roleLower.includes("responsable administratif")) {
      priority = 1; // Bureau
    } else if (roleLower.includes("conseil d'administration") || 
               roleLower.includes("sponsoring") || 
               roleLower.includes("communication") || 
               roleLower.includes("animation")) {
      priority = 2; // CA
    } else if (roleLower.includes("honoraire")) {
      priority = 5; // Honoraires
    }

    await run(`
      INSERT INTO Staff (nom, prenom, role, photo_url, role_priority) 
      VALUES (?, '', ?, ?, ?)
    `, [leader.name, leader.role, leader.image || null, priority]);
  }

  // 3. Sync Recent Results
  console.log("Syncing Recent Results...");
  await run("DELETE FROM Resultats");
  for (const res of scrapedData.recent_results) {
    // Find equipe_id by matching name
    let equipeId = 1; // Default to Senior
    const categoryPart = res.equipe.split(' - ')[1]; // e.g., "Senior", "U18"
    if (categoryPart) {
      const teamMatch = hardcodedTeams.find(t => t.nom.toLowerCase().includes(categoryPart.toLowerCase()));
      if (teamMatch) equipeId = teamMatch.id;
    }

    await run(`
      INSERT INTO Resultats (equipe_id, date, adversaire, score, statut) 
      VALUES (?, ?, ?, ?, ?)
    `, [equipeId, res.date, res.adversaire, res.score, res.statut]);
  }

  console.log("RCBA Sync SUCCESSFUL.");
  db.close();
}

sync().catch(err => {
  console.error("Sync FAILED:", err);
  if (db) db.close();
});

