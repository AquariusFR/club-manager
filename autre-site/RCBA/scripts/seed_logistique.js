const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function seed() {
  const dbPath = path.resolve(__dirname, '../../rcba.db');
  console.log('Seeding DB at:', dbPath);

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Seed Minibus Reservations
  await db.run(`INSERT INTO MinibusReservations (requester_name, entity, purpose, start_time, end_time, status) VALUES 
    ('Coach Sacha', 'RCBA', 'Match U18 à Bordeaux', '2026-05-10 08:00:00', '2026-05-10 18:00:00', 'APPROVED'),
    ('Jean Dupont', 'ASSO_B', 'Transport Matériel Tournoi', '2026-05-12 14:00:00', '2026-05-12 20:00:00', 'PENDING')
  `);

  // Seed Minibus Logs (for stats calculation)
  const currentMonth = new Date().toISOString().substring(0, 7);
  await db.run(`INSERT INTO MinibusLogs (driver_name, entity, mileage_start, mileage_end, fuel_cost, tolls_cost, notes, created_at) VALUES 
    ('Coach Sacha', 'RCBA', 45000, 45150, 45.50, 12.00, 'RAS', '${currentMonth}-01 10:00:00'),
    ('Jean Dupont', 'ASSO_B', 45150, 45220, 0, 5.50, 'Plein fait par Asso B', '${currentMonth}-05 09:00:00'),
    ('Coach Ben', 'RCBA', 45220, 45400, 55.00, 18.20, 'Déplacement Agen', '${currentMonth}-10 07:00:00')
  `);

  // Seed Minibus Expenses
  await db.run(`INSERT INTO MinibusExpenses (entity, type, amount, description, date) VALUES 
    ('RCBA', 'FUEL', 60.00, 'Plein minibus total', '${currentMonth}-15'),
    ('RCBA', 'MAINTENANCE', 150.00, 'Vidange annuelle', '${currentMonth}-12'),
    ('ASSO_B', 'FUEL', 30.00, 'Complément gazole', '${currentMonth}-18')
  `);

  // Seed Minibus Maintenance
  await db.run(`INSERT INTO MinibusMaintenance (type, due_date, description, status) VALUES 
    ('Contrôle Technique', '2026-06-15', 'Visite réglementaire', 'OK'),
    ('Pneumatiques', '2026-05-20', 'Usure train avant à surveiller', 'WARNING'),
    ('Révision Moteur', '2026-04-30', 'Urgent : Bruit suspect', 'CRITICAL')
  `);

  // Seed Carpooling
  await db.run(`INSERT INTO Carpooling (driver_name, start_location, departure_time, available_seats, status) VALUES 
    ('Marc L.', 'Gujan-Mestras - Centre', '08:30', 3, 'Active'),
    ('Sophie R.', 'La Teste - Gare', '07:45', 2, 'Active'),
    ('Pierre D.', 'Biganos - Mairie', '09:00', 4, 'Active')
  `);

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
