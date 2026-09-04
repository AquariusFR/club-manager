const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'rcba.db');
const db = new sqlite3.Database(dbPath);
const imagesDir = path.join(__dirname, '..', 'public', 'images', 'staff');

const files = fs.readdirSync(imagesDir);

function normalize(str) {
  if (!str) return '';
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-').trim();
}

const fileMap = {};
files.forEach(f => {
  const nameWithoutExt = path.parse(f).name;
  fileMap[normalize(nameWithoutExt)] = f; // normalized mapping
  fileMap[nameWithoutExt.toLowerCase()] = f; // lowercase mapping
});

function updateTable(tableName) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, prenom, nom FROM ${tableName}`, [], (err, rows) => {
      if (err) {
        // Table might not exist, skip
        console.log(`Table ${tableName} skipped.`);
        return resolve();
      }

      let updates = 0;
      rows.forEach(row => {
        let fullName1 = '';
        if (row.prenom && row.nom) {
          fullName1 = `${row.prenom}-${row.nom}`;
        } else if (row.nom) {
          fullName1 = row.nom; // fallback
        }
        
        let fullName2 = '';
        if (row.prenom && row.nom) {
          fullName2 = `${row.prenom} ${row.nom}`;
        } else if (row.nom) {
          fullName2 = row.nom;
        }

        const norm1 = normalize(fullName1);
        const norm2 = normalize(fullName2);
        
        let matchedFile = fileMap[norm1] || fileMap[norm2] || fileMap[normalize(row.prenom)] || fileMap[normalize(row.nom)];
        
        // More robust fallback: if the filename contains BOTH prenom and nom (if prenom exists)
        if (!matchedFile && row.prenom && row.nom) {
          const nprenom = normalize(row.prenom);
          const nnom = normalize(row.nom);
          matchedFile = files.find(f => {
            const nf = normalize(path.parse(f).name);
            return nf.includes(nprenom) && nf.includes(nnom);
          });
        }

        // If nom contains both firstname and lastname (e.g. "Ghislaine VITY")
        if (!matchedFile && row.nom && !row.prenom) {
           const parts = row.nom.split(' ');
           if (parts.length >= 2) {
             const p1 = normalize(parts[0]);
             const p2 = normalize(parts.slice(1).join(' '));
             matchedFile = files.find(f => {
                const nf = normalize(path.parse(f).name);
                return nf.includes(p1) && nf.includes(p2);
             });
           }
        }

        if (matchedFile) {
          const photoUrl = `/images/staff/${matchedFile}`;
          db.run(`UPDATE ${tableName} SET photo_url = ? WHERE id = ?`, [photoUrl, row.id]);
          updates++;
        }
      });
      console.log(`Updated ${updates} rows in ${tableName}.`);
      resolve();
    });
  });
}

async function run() {
  await updateTable('Staff');
  await updateTable('Joueurs');
  await updateTable('Dirigeants');
  console.log("Done");
  db.close();
}

run();
