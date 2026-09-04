const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve('c:/CodeIA/RCBA/rcba.db');
const db = new sqlite3.Database(dbPath);

const staffDir = path.resolve('c:/CodeIA/RCBA/portal/public/images/staff');
const files = fs.existsSync(staffDir) ? fs.readdirSync(staffDir) : [];

const normalize = (str) => {
    if (!str) return "";
    return str.toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]/g, "");
};

db.all("SELECT id, nom, prenom FROM Staff", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }

    rows.forEach(row => {
        const normName = normalize(`${row.prenom}${row.nom}`);
        const normNameRev = normalize(`${row.nom}${row.prenom}`);
        
        let match = files.find(f => {
            const normFile = normalize(f.split('.')[0]);
            return normFile === normName || normFile === normNameRev || normFile.includes(normName) || normName.includes(normFile);
        });

        if (match) {
            const photoUrl = `/images/staff/${match}`;
            console.log(`Syncing ${row.prenom} ${row.nom} -> ${photoUrl}`);
            db.run("UPDATE Staff SET photo_url = ? WHERE id = ?", [photoUrl, row.id]);
        }
    });

    setTimeout(() => {
        db.close();
        console.log("Staff photos synchronization complete.");
    }, 2000);
});

