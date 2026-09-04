const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', 'rcba.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT * FROM Equipes', (err, rows) => {
    if (err) {
        console.error('Error fetching Equipes:', err);
        return;
    }
    console.log('Equipes:', JSON.stringify(rows, null, 2));
    
    db.all('SELECT * FROM Resultats ORDER BY Date DESC LIMIT 10', (err, rows) => {
        if (err) {
            console.error('Error fetching Resultats:', err);
            return;
        }
        console.log('Resultats:', JSON.stringify(rows, null, 2));
        db.close();
    });
});
