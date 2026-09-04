const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'rcba.db');
const db = new sqlite3.Database(dbPath);

async function run() {
  return new Promise((resolve, reject) => {
    db.run("UPDATE Joueurs SET photo_url = 'https://ui-avatars.com/api/?name=' || replace(prenom, ' ', '+') || '+' || replace(nom, ' ', '+') || '&background=random&color=fff' WHERE photo_url IS NULL OR photo_url = '' OR photo_url LIKE '%pravatar%'", (err) => {
      if (err) console.error("Erreur mise à jour photos joueurs:", err);
      else console.log("Photos joueurs mises à jour");
      
      db.run("UPDATE Staff SET photo_url = 'https://ui-avatars.com/api/?name=' || replace(prenom, ' ', '+') || '+' || replace(nom, ' ', '+') || '&background=random&color=fff' WHERE photo_url IS NULL OR photo_url = '' OR photo_url LIKE '%pravatar%'", (err2) => {
        if (err2) return reject(err2);
        console.log("Photos du staff mises à jour.");
        resolve();
      });
    });
  });
}

run().then(() => db.close()).catch(console.error);
