const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const https = require('https');
const path = require('path');

const db = new sqlite3.Database('rcba.db');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
};

db.serialize(() => {
  db.all("SELECT id, photo_url FROM Staff WHERE photo_url IS NOT NULL AND photo_url != '' AND photo_url LIKE 'http%'", async (err, rows) => {
    if (err) throw err;
    console.log(`Found ${rows.length} staff with external photos.`);
    
    for (const row of rows) {
      try {
        const ext = path.extname(new URL(row.photo_url).pathname) || '.jpg';
        const filename = `staff_${row.id}${ext}`;
        const filepath = path.join(__dirname, 'public', 'images', 'staff', filename);
        const relativeUrl = `/images/staff/${filename}`;
        
        fs.mkdirSync(path.join(__dirname, 'public', 'images', 'staff'), { recursive: true });
        
        console.log(`Downloading ${row.photo_url} to ${filepath}`);
        await downloadImage(row.photo_url, filepath);
        
        db.run("UPDATE Staff SET photo_url = ? WHERE id = ?", [relativeUrl, row.id], (updateErr) => {
          if (updateErr) console.error(`Error updating DB for id ${row.id}:`, updateErr);
          else console.log(`Updated DB for id ${row.id} to ${relativeUrl}`);
        });
      } catch (e) {
        console.error(`Error processing staff ${row.id} (${row.photo_url}):`, e.message);
      }
    }
  });
});
