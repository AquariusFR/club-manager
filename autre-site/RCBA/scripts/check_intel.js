
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', 'rcba.db');
const db = new sqlite3.Database(dbPath);

console.log("Checking IntelligenceFeed table...");
db.all('SELECT * FROM IntelligenceFeed ORDER BY date DESC LIMIT 20', (err, rows) => {
    if (err) {
        console.error('Error fetching IntelligenceFeed:', err);
    } else {
        console.log(`Found ${rows.length} items in IntelligenceFeed.`);
        rows.forEach(row => {
            console.log(`[${row.date}] [${row.type}] [${row.gravite}] ${row.titre}`);
        });
    }
    db.close();
});
