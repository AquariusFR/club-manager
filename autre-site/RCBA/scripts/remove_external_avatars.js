const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('rcba.db');

db.serialize(() => {
  db.run("UPDATE Joueurs SET photo_url = NULL WHERE photo_url LIKE '%ui-avatars.com%';", function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Row(s) updated in Joueurs: ${this.changes}`);
    }
  });

  db.run("UPDATE Staff SET photo_url = NULL WHERE photo_url LIKE '%ui-avatars.com%';", function(err) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`Row(s) updated in Staff: ${this.changes}`);
    }
  });
});

db.close();
