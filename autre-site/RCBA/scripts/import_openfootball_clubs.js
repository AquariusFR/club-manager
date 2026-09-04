/**
 * import_openfootball_clubs.js
 * 
 * Télécharge et parse les données de clubs français depuis openfootball/clubs
 * (licence CC0 - domaine public) et les insère dans la table ClubsRef de rcba.db.
 * 
 * Usage: node scripts/import_openfootball_clubs.js
 */

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const https = require('https');

const DB_PATH = path.resolve(__dirname, '../rcba.db');

// Fichiers openfootball à importer (Europe/France + quelques voisins)
const SOURCES = [
  {
    pays: 'France',
    url: 'https://raw.githubusercontent.com/openfootball/clubs/master/europe/france/fr.clubs.txt',
  },
  {
    pays: 'Angleterre',
    url: 'https://raw.githubusercontent.com/openfootball/clubs/master/europe/england/eng.clubs.txt',
  },
  {
    pays: 'Espagne',
    url: 'https://raw.githubusercontent.com/openfootball/clubs/master/europe/spain/es.clubs.txt',
  },
  {
    pays: 'Allemagne',
    url: 'https://raw.githubusercontent.com/openfootball/clubs/master/europe/germany/de.clubs.txt',
  },
];

/**
 * Télécharge le contenu d'une URL via HTTPS
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Parse le format texte openfootball.
 * Format : Nom du Club, [année,] [@ Stade,] Ville [› Région]
 *   | alias1
 *   | alias2
 * Les lignes commençant par = ou # ou vides sont ignorées.
 */
function parseClubsTxt(content, pays) {
  const clubs = [];
  const lines = content.split('\n');
  
  let currentClub = null;
  
  for (let raw of lines) {
    const line = raw.trimEnd();
    
    // Ignorer les lignes de section ou commentaires
    if (line.startsWith('=') || line.startsWith('#') || line.trim() === '') {
      if (currentClub) {
        clubs.push(currentClub);
        currentClub = null;
      }
      continue;
    }
    
    // Ligne d'alias (commence par |)
    if (line.trim().startsWith('|') && currentClub) {
      const alias = line.replace(/^\s*\|/, '').split('##')[0].trim();
      if (alias && !alias.startsWith('#')) {
        const existingAliases = currentClub.aliases ? JSON.parse(currentClub.aliases) : [];
        existingAliases.push(alias);
        currentClub.aliases = JSON.stringify(existingAliases);
      }
      continue;
    }
    
    // Nouvelle entrée de club (ligne sans indentation commençant par un nom)
    if (/^[A-ZÁÀÄÉÈÊËÎÏÔÙÛÜÇ]/.test(line.trim()) || /^\w/.test(line.trim())) {
      // Sauvegarder le club précédent
      if (currentClub) {
        clubs.push(currentClub);
      }
      
      currentClub = parseClubLine(line, pays);
    }
  }
  
  // Dernier club
  if (currentClub) clubs.push(currentClub);
  
  return clubs;
}

/**
 * Parse une ligne principale de club
 * Exemples :
 *   "Paris Saint-Germain, 1970, @ Parc des Princes, Paris › Île-de-France"
 *   "Olympique de Marseille, 1899,  @ Stade Vélodrome,  Marseille"
 *   "FC Nantes, 1943,  @ Stade de la Beaujoire-Louis Fonteneau,   Nantes"
 *   "Red Star FC,   Saint-Ouen › Île-de-France"
 */
function parseClubLine(line, pays) {
  // Supprimer commentaires en ligne
  const clean = line.split('##')[0].trimEnd();
  
  const club = {
    nom: '',
    annee_fondation: null,
    stade: null,
    ville: null,
    region: null,
    pays,
    aliases: null,
    source: 'openfootball/clubs',
  };
  
  // Extraire le stade si présent
  const stadeMatch = clean.match(/@\s*([^,]+)/);
  if (stadeMatch) {
    club.stade = stadeMatch[1].trim();
  }
  
  // Supprimer la partie stade pour simplifier le parsing
  const withoutStade = clean.replace(/@\s*[^,]+,\s*/, '');
  
  // Split par virgule pour extraire nom, année, ville
  const parts = withoutStade.split(',').map(p => p.trim()).filter(Boolean);
  
  if (parts.length >= 1) {
    club.nom = parts[0].trim();
  }
  
  // Chercher l'année (4 chiffres entre 1800 et 2024)
  for (const part of parts.slice(1)) {
    const anneeMatch = part.match(/\b(1[89]\d{2}|20[0-2]\d)\b/);
    if (anneeMatch) {
      club.annee_fondation = parseInt(anneeMatch[1]);
      break;
    }
  }
  
  // La dernière partie contient ville [› région]
  const lastPart = parts[parts.length - 1];
  if (lastPart && lastPart !== club.nom) {
    if (lastPart.includes('›')) {
      const villeRegion = lastPart.split('›');
      club.ville = villeRegion[0].trim();
      club.region = villeRegion[1]?.trim() || null;
    } else {
      // Vérifier que ce n'est pas une année
      if (!/^\d{4}$/.test(lastPart.trim())) {
        club.ville = lastPart.trim();
      }
    }
  }
  
  // Nettoyer le nom (supprimer les parenthèses résiduelles simples)
  club.nom = club.nom.replace(/\s*\([^)]*\)\s*$/, '').trim();
  
  return club;
}

async function main() {
  console.log('🚀 Import openfootball/clubs → rcba.db ClubsRef\n');
  
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  
  // S'assurer que la table existe (au cas où getDb() n'a pas encore été appelé)
  await db.exec(`
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
    CREATE INDEX IF NOT EXISTS idx_clubsref_nom ON ClubsRef(nom);
  `);
  
  // Vider la table avant réimport (idempotent)
  await db.run('DELETE FROM ClubsRef');
  console.log('🗑️  Table ClubsRef vidée\n');
  
  const stmt = await db.prepare(`
    INSERT INTO ClubsRef (nom, annee_fondation, stade, ville, region, pays, aliases, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  let totalInserted = 0;
  
  for (const source of SOURCES) {
    process.stdout.write(`📥 Téléchargement ${source.pays}... `);
    
    let content;
    try {
      content = await fetchUrl(source.url);
      console.log('✅');
    } catch (err) {
      console.log(`❌ Erreur: ${err.message}`);
      continue;
    }
    
    const clubs = parseClubsTxt(content, source.pays);
    console.log(`   📋 ${clubs.length} clubs parsés`);
    
    let inserted = 0;
    for (const club of clubs) {
      if (!club.nom || club.nom.length < 2) continue;
      
      try {
        await stmt.run(
          club.nom,
          club.annee_fondation,
          club.stade,
          club.ville,
          club.region,
          club.pays,
          club.aliases,
          club.source
        );
        inserted++;
      } catch (err) {
        // Ignorer les doublons silencieusement
        if (!err.message.includes('UNIQUE')) {
          console.warn(`   ⚠️  ${club.nom}: ${err.message}`);
        }
      }
    }
    
    console.log(`   ✅ ${inserted} clubs insérés\n`);
    totalInserted += inserted;
  }
  
  await stmt.finalize();
  
  // Vérification finale
  const count = await db.get('SELECT COUNT(*) as count FROM ClubsRef');
  console.log(`\n✅ Import terminé — ${count.count} clubs au total dans ClubsRef`);
  
  // Afficher quelques exemples
  const exemples = await db.all('SELECT nom, annee_fondation, ville, pays FROM ClubsRef WHERE pays = "France" LIMIT 8');
  console.log('\n📌 Exemples (France) :');
  exemples.forEach(c => {
    console.log(`   ${c.nom} (${c.annee_fondation || '?'}) — ${c.ville || '?'}`);
  });
  
  await db.close();
}

main().catch(err => {
  console.error('❌ Erreur fatale:', err);
  process.exit(1);
});
