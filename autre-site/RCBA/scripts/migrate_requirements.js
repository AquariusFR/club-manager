const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'rcba.db');
const db = new sqlite3.Database(dbPath);

const columns = [
  'gk_reflexes', 'gk_pied', 'gk_com', 'gk_detente',
  'def_duel', 'def_lecture', 'def_relance', 'def_marquage',
  'mid_vision', 'mid_volume', 'mid_recup', 'mid_transition',
  'fwd_finition', 'fwd_vitesse', 'fwd_appel', 'fwd_pressing'
];

db.serialize(() => {
  for (const col of columns) {
    db.run(`ALTER TABLE Joueurs ADD COLUMN ${col} INTEGER DEFAULT 3`, (err) => {
      if (err) {
        if (err.message.includes('duplicate column name')) {
          console.log(`Column ${col} already exists.`);
        } else {
          console.error(`Error adding ${col}:`, err.message);
        }
      } else {
        console.log(`Column ${col} added successfully.`);
      }
    });
  }
  
  // Seed with random values 3-5 for existing players
  db.run(`UPDATE Joueurs SET 
    gk_reflexes = ABS(RANDOM() % 3) + 3,
    gk_pied = ABS(RANDOM() % 3) + 3,
    gk_com = ABS(RANDOM() % 3) + 3,
    gk_detente = ABS(RANDOM() % 3) + 3,
    def_duel = ABS(RANDOM() % 3) + 3,
    def_lecture = ABS(RANDOM() % 3) + 3,
    def_relance = ABS(RANDOM() % 3) + 3,
    def_marquage = ABS(RANDOM() % 3) + 3,
    mid_vision = ABS(RANDOM() % 3) + 3,
    mid_volume = ABS(RANDOM() % 3) + 3,
    mid_recup = ABS(RANDOM() % 3) + 3,
    mid_transition = ABS(RANDOM() % 3) + 3,
    fwd_finition = ABS(RANDOM() % 3) + 3,
    fwd_vitesse = ABS(RANDOM() % 3) + 3,
    fwd_appel = ABS(RANDOM() % 3) + 3,
    fwd_pressing = ABS(RANDOM() % 3) + 3
  `);
});

db.close();
