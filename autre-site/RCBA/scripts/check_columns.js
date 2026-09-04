const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('rcba.db');
db.all("PRAGMA table_info(Equipes)", (err, rows) => {
  console.log(rows);
});
db.all("PRAGMA table_info(Joueurs)", (err, rows) => {
  console.log(rows);
});
