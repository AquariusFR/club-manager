const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'rcba.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run("BEGIN TRANSACTION");

  db.run(`
    CREATE TABLE Users_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      password_hash TEXT,
      role TEXT,
      staff_id INTEGER,
      player_id INTEGER
    );
  `);

  db.run(`INSERT INTO Users_new SELECT * FROM Users;`);
  db.run(`DROP TABLE Users;`);
  db.run(`ALTER TABLE Users_new RENAME TO Users;`);

  db.run("COMMIT", (err) => {
    if (err) {
      console.error("Migration failed:", err);
    } else {
      console.log("Migration successful: Removed UNIQUE constraint from Users.email");
    }
    db.close();
  });
});
