const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../rcba.db');
const db = new sqlite3.Database(dbPath);

const staffData = [
  // BUREAU / DIRECTION (Role priority 1)
  { nom: 'WAROQUIER', prenom: 'Marc', role: 'Président', photo_url: 'https://s3.static-footeo.com/uploads/rcba/executives/marc-waroquier__sl3ql0.jpg', role_priority: 1, telephone: '06.69.68.84.96' },
  { nom: 'GODET', prenom: 'Vincent', role: 'Secrétaire général', photo_url: 'https://s2.static-footeo.com/uploads/rcba/executives/vincent-godet__sl3ql2.jpg', role_priority: 1, telephone: '06.08.24.33.64' },
  { nom: 'VITY', prenom: 'Matthieu', role: 'Vice président', photo_url: 'https://s3.static-footeo.com/uploads/rcba/executives/matthieu-vity__qvgoyb.jpg', role_priority: 1, telephone: '06.73.46.08.03' },
  
  // COMITE DIRECTEUR / POLES (Role priority 2)
  { nom: 'VITY', prenom: 'Ghislaine', role: 'Responsable administratif', photo_url: '', role_priority: 2 },
  { nom: 'HIBLOT', prenom: 'Nicolas', role: 'Responsable communication', photo_url: '', role_priority: 2 },
  { nom: 'AMELINE', prenom: 'Vanessa', role: 'Membre du conseil d\'administration', photo_url: '', role_priority: 2 },
  { nom: 'DESSIRIER', prenom: 'Vanessa', role: 'Responsable sponsoring', photo_url: '', role_priority: 2 },
  
  // POLE COMMUNICATION (Role priority 3)
  { nom: 'COIPEAU', prenom: 'Sabine', role: 'Membre Pôle communication', photo_url: '', role_priority: 3 },
  { nom: 'RACLOT', prenom: 'Florence', role: 'Membre Pôle communication', photo_url: '', role_priority: 3 },
  { nom: 'GUILLAUMIN', prenom: 'Sébastien', role: 'Membre Pôle communication', photo_url: '', role_priority: 3 },

  // SPORTIF / TECHNIQUE (Role priority 10)
  { nom: 'LE CORRE', prenom: 'Quentin', role: 'Responsable animation & technique', photo_url: 'https://s2.static-footeo.com/uploads/rcba/executives/quentin-le-corre__rivjzr.jpg', role_priority: 10 },
  { nom: 'BARBIER', prenom: 'Philippe', role: 'Responsable technique foot à 11', photo_url: 'https://s3.static-footeo.com/uploads/rcba/executives/philippe-barbier__sl567r.jpg', role_priority: 10 },
  { nom: 'CAVADASKI', prenom: 'Yannick', role: 'Responsable technique foot féminin', photo_url: '', role_priority: 10 },
  { nom: 'BOURDIN', prenom: 'Maël', role: 'Apprentissage BMF', photo_url: '', role_priority: 11 },
  { nom: 'HARACHE', prenom: 'Benjamin', role: 'Entraineur & Service Civique', photo_url: '', role_priority: 11 },
  { nom: 'VANDIER', prenom: 'Didier', role: 'Entraineur', photo_url: 'https://s3.static-footeo.com/uploads/rcba/executives/didier-vandier__sl56hi.jpg', role_priority: 12 },
  
  // ADJOINTS (Role priority 15)
  { nom: 'PENNETIER', prenom: 'Sylvain', role: 'Entraineur adjoint', photo_url: 'https://s2.static-footeo.com/uploads/rcba/executives/sylvain-pennetier__rgpzbj.png', role_priority: 15 },
  { nom: 'JUSTIN', prenom: 'Agnès', role: 'Entraineure adjoint', photo_url: 'https://s2.static-footeo.com/uploads/rcba/executives/agnes-justin__rgpzhg.jpg', role_priority: 15 },
  { nom: 'Nam CHIEV', prenom: 'Kan', role: 'Entraineur adjoint', photo_url: 'https://s2.static-footeo.com/uploads/rcba/executives/kan-nam-chiev__rgpzbu.jpg', role_priority: 15 },
  { nom: 'CARRASQUEIRA', prenom: 'Michel', role: 'Entraineur adjoint', photo_url: 'https://s3.static-footeo.com/uploads/rcba/executives/michel-carrasqueira__rgpzi7.jpg', role_priority: 15 },
  { nom: 'MOMPO', prenom: 'Pierre', role: 'Entraineur adjoint', photo_url: 'https://s3.static-footeo.com/uploads/rcba/executives/pierre-mompo__rgpzif.jpg', role_priority: 15 },
  { nom: 'DUBOST', prenom: 'Laurent', role: 'Entraineur adjoint', photo_url: 'https://s2.static-footeo.com/uploads/rcba/executives/laurent-dubost__rggs3n.jpg', role_priority: 15 },
  { nom: 'MARIE LUCE', prenom: 'Laurent', role: 'Entraineur adjoint', photo_url: 'https://s2.static-footeo.com/uploads/rcba/executives/laurent-marie-luce__rggs9g.jpg', role_priority: 15 },
  { nom: 'DESSIRIER-GIROUDOT', prenom: 'Mickael', role: 'Entraineur des gardiens', photo_url: 'https://s2.static-footeo.com/750/uploads/rcba/executives/mickael-dessirier-giroudot__rivhse.jpg', role_priority: 15 },
  { nom: 'NOBRE', prenom: 'Frédéric', role: 'Entraineur adjoint', photo_url: 'https://s1.static-footeo.com/750/uploads/rcba/executives/frederic__rivn5g.jpg', role_priority: 15 },
  { nom: 'VAUTELIN', prenom: 'Guillaume', role: 'Dirigeant', photo_url: 'https://s1.static-footeo.com/uploads/rcba/executives/guillaume-vautelin__rgpzlx.jpg', role_priority: 15 },

  // AUTRES MEMBRES / STAFF (Role priority 20+)
  { nom: 'GONZALES', prenom: 'Franck', role: 'Entraineur adjoint', photo_url: '', role_priority: 20 },
  { nom: 'BERGER', prenom: 'Guillaume', role: 'Entraineur', photo_url: '', role_priority: 20 },
  { nom: 'BERGER', prenom: 'Romain', role: 'Entraineur adjoint', photo_url: '', role_priority: 20 },
  { nom: 'MASSON', prenom: 'Mikaël', role: 'Dirigeant', photo_url: '', role_priority: 20 },
  { nom: 'GAUTHIER', prenom: 'Romain', role: 'Educateur', photo_url: '', role_priority: 20 },
  { nom: 'BARBE', prenom: 'Alyx', role: 'Educateur', photo_url: '', role_priority: 20 },
  { nom: 'PETACCIA', prenom: 'Sébastien', role: 'Educateur', photo_url: '', role_priority: 20 },
  { nom: 'BALLAND', prenom: 'Alexis', role: 'Educateur', photo_url: '', role_priority: 20 },
  { nom: 'DEJOUR', prenom: 'Dylan', role: 'Educateur', photo_url: '', role_priority: 20 },
  { nom: 'BELASKRI', prenom: 'Mehdi', role: 'Educateur', photo_url: '', role_priority: 20 },
  
  // MEMBRES AVEC PHOTOS LOCALES (Non listés précédemment)
  { nom: 'BOUTIGNY', prenom: 'Cécile', role: 'Bénévole', photo_url: '', role_priority: 30 },
  { nom: 'PLU', prenom: 'David', role: 'Bénévole', photo_url: '', role_priority: 30 },
  { nom: 'ROUCHARD', prenom: 'Fabrice', role: 'Bénévole', photo_url: '', role_priority: 30 },
  { nom: 'MARGUERITAT', prenom: 'Grégory', role: 'Bénévole', photo_url: '', role_priority: 30 },
  { nom: 'WAROQUIER', prenom: 'Jean-Claude', role: 'Bénévole', photo_url: '', role_priority: 30 },
  { nom: 'WAROQUIER', prenom: 'Lény', role: 'Educateur', photo_url: '', role_priority: 20 },
  { nom: 'LEGENDRE', prenom: 'Pascal', role: 'Bénévole', photo_url: '', role_priority: 30 },
  { nom: 'BARBOU', prenom: 'Sébastien', role: 'Educateur', photo_url: '', role_priority: 20 },
  { nom: 'MOUTAULT', prenom: 'Sébastien', role: 'Educateur', photo_url: '', role_priority: 20 },
  { nom: 'JOUBERT', prenom: 'Stéphane', role: 'Educateur', photo_url: '', role_priority: 20 }
];

const fs = require('fs');
const staffDir = path.resolve(__dirname, '../public/images/staff');
const files = fs.existsSync(staffDir) ? fs.readdirSync(staffDir) : [];

const normalize = (str) => {
  if (!str) return "";
  return str.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "");
};

db.serialize(() => {
  // Clear existing entries to avoid duplicates during this manual sync
  db.run("DELETE FROM Staff");
  
  const stmt = db.prepare("INSERT INTO Staff (nom, prenom, role, photo_url, role_priority, telephone) VALUES (?, ?, ?, ?, ?, ?)");
  
  staffData.forEach(s => {
    let photoUrl = s.photo_url;
    
    // Check if local photo exists
    const normName = normalize(`${s.prenom}${s.nom}`);
    const normNameRev = normalize(`${s.nom}${s.prenom}`);
    
    const localMatch = files.find(f => {
      const normFile = normalize(f.split('.')[0]);
      return normFile === normName || normFile === normNameRev || normFile.includes(normName) || normName.includes(normFile);
    });
    
    if (localMatch) {
      photoUrl = `/images/staff/${localMatch}`;
      console.log(`Local match found for ${s.prenom} ${s.nom}: ${photoUrl}`);
    }
    
    stmt.run(s.nom, s.prenom || '', s.role, photoUrl, s.role_priority, s.telephone || '');
  });
  
  stmt.finalize();
  console.log(`Database updated with ${staffData.length} members for Organigramme 2025-2026.`);
});

db.close();


