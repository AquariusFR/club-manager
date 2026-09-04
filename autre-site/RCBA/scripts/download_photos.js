const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const dbPath = path.join(__dirname, '../rcba.db');
const publicImagesDir = path.join(__dirname, '../public/images/profiles');

if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith('http')) return resolve(false);
    
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(true));
      } else {
        res.resume();
        resolve(false);
      }
    }).on('error', reject);
  });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(err.message);
    process.exit(1);
  }
});

async function processTable(tableName) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT id, photo_url FROM ${tableName} WHERE photo_url LIKE 'http%'`, async (err, rows) => {
      if (err) return reject(err);
      
      for (const row of rows) {
        const ext = path.extname(new URL(row.photo_url).pathname) || '.jpg';
        const filename = `${tableName.toLowerCase()}_${row.id}${ext}`;
        const filepath = path.join(publicImagesDir, filename);
        
        console.log(`Downloading ${row.photo_url} to ${filename}...`);
        try {
          const success = await downloadImage(row.photo_url, filepath);
          if (success) {
            const localUrl = `/images/profiles/${filename}`;
            await new Promise((res, rej) => {
              db.run(`UPDATE ${tableName} SET photo_url = ? WHERE id = ?`, [localUrl, row.id], (err) => {
                if (err) rej(err);
                else res();
              });
            });
            console.log(`Updated ${tableName} ${row.id} to ${localUrl}`);
          }
        } catch (e) {
          console.error(`Failed to download ${row.photo_url}`, e);
        }
      }
      resolve();
    });
  });
}

async function main() {
  await processTable('Staff');
  await processTable('Joueurs');
  db.close();
  console.log('Done!');
}

main();
