const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'rcba.db');
const db = new sqlite3.Database(dbPath);
const staffImagesDir = path.join(__dirname, '..', 'public', 'images', 'staff');

function normalize(str) {
  if (!str) return "";
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

async function run() {
  return new Promise((resolve, reject) => {
    // 1. Reset Joueurs to NULL
    db.run("UPDATE Joueurs SET photo_url = NULL", (err) => {
      if (err) return reject(err);
      console.log("Joueurs photos reset to NULL (fallback to initials).");
      
      // 2. Process Staff
      const files = fs.readdirSync(staffImagesDir);
      
      db.all("SELECT id, nom, prenom FROM Staff", (err, staffList) => {
        if (err) return reject(err);
        
        let completed = 0;
        if (staffList.length === 0) return resolve();

        staffList.forEach(member => {
          const normNom = normalize(member.nom);
          const normPrenom = normalize(member.prenom);
          
          let matchedFile = null;
          for (const file of files) {
            const normFile = normalize(file.split('.')[0]);
            // check if file name contains both first and last name
            if (normFile.includes(normNom) && normFile.includes(normPrenom)) {
              matchedFile = file;
              break;
            }
          }

          // Special edge cases or partial matches if needed, but exact matches usually work.
          // Let's try just last name if not found for certain people.
          if (!matchedFile) {
            for (const file of files) {
              const normFile = normalize(file.split('.')[0]);
              if (normFile === normNom || normFile === normPrenom) {
                 // matchedFile = file;
                 // maybe too risky to match just one if names are common
              }
            }
          }

          const photoUrl = matchedFile ? `/images/staff/${matchedFile}` : null;
          
          db.run("UPDATE Staff SET photo_url = ? WHERE id = ?", [photoUrl, member.id], (err) => {
            if (err) console.error(err);
            else console.log(`Staff ${member.prenom} ${member.nom} -> ${photoUrl}`);
            
            completed++;
            if (completed === staffList.length) resolve();
          });
        });
      });
    });
  });
}

run().then(() => db.close()).catch(console.error);
