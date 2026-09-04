
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'rcba.db');
const db = new sqlite3.Database(dbPath);

console.log("Checking Staff table...");
db.all("SELECT * FROM Staff", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Staff:", rows);
});

console.log("Checking Equipes table...");
db.all("SELECT * FROM Equipes", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Equipes:", rows);
});

console.log("Checking Users table...");
db.all("SELECT * FROM Users", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Users:", rows);
});
