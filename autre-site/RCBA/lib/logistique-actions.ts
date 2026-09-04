'use server';

import { getDb } from './db';
import { revalidatePath } from 'next/cache';

interface LogStat {
  entity: string;
  total_km: number;
  total_liters: number;
  log_fuel: number;
  log_tolls: number;
}

interface ExpenseStat {
  entity: string;
  exp_fuel: number;
  exp_tolls: number;
  exp_other: number;
}

interface LogEntry {
  created_at: string;
  entity: string;
  driver_name: string;
  destination: string | null;
  mileage_start: number;
  mileage_end: number | null;
  fuel_liters: number | null;
  fuel_cost: number | null;
  tolls_cost: number | null;
}

export async function getMinibusStats() {
  const db = await getDb();
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  // Aggregate from Logs
  const logStats = await db.all(`
    SELECT 
      entity, 
      SUM(COALESCE(mileage_end, mileage_start) - mileage_start) as total_km,
      SUM(COALESCE(fuel_liters, 0)) as total_liters,
      SUM(COALESCE(fuel_cost, 0)) as log_fuel,
      SUM(COALESCE(tolls_cost, 0)) as log_tolls
    FROM MinibusLogs
    WHERE strftime('%Y-%m', created_at) = ?
    GROUP BY entity
  `, [currentMonth]);

  // Aggregate from Expenses
  const expenseStats = await db.all(`
    SELECT 
      entity,
      SUM(CASE WHEN type = 'FUEL' THEN COALESCE(amount, 0) ELSE 0 END) as exp_fuel,
      SUM(CASE WHEN type = 'TOLL' THEN COALESCE(amount, 0) ELSE 0 END) as exp_tolls,
      SUM(CASE WHEN type = 'MAINTENANCE' OR type = 'OTHER' THEN COALESCE(amount, 0) ELSE 0 END) as exp_other
    FROM MinibusExpenses
    WHERE strftime('%Y-%m', date) = ?
    GROUP BY entity
  `, [currentMonth]);

  // Combine
  const entities = ['RCBA', 'ASSO_B'];
  return entities.map(entity => {
    const l = (logStats as LogStat[]).find((s: LogStat) => s.entity === entity) || { total_km: 0, total_liters: 0, log_fuel: 0, log_tolls: 0 };
    const e = (expenseStats as ExpenseStat[]).find((s: ExpenseStat) => s.entity === entity) || { exp_fuel: 0, exp_tolls: 0, exp_other: 0 };
    return {
      entity,
      total_km: Number(l.total_km) || 0,
      total_liters: Number(l.total_liters) || 0,
      total_fuel: (Number(l.log_fuel) || 0) + (Number(e.exp_fuel) || 0),
      total_tolls: (Number(l.log_tolls) || 0) + (Number(e.exp_tolls) || 0),
      total_other: Number(e.exp_other) || 0
    };
  });
}

export async function createExpense(formData: FormData) {
  const db = await getDb();
  
  const entity = formData.get('entity') as string;
  const type = formData.get('type') as string;
  const amountStr = formData.get('amount') as string;
  const amount = parseFloat(amountStr);
  const description = formData.get('description') as string;
  const date = formData.get('date') as string || new Date().toISOString().split('T')[0];

  if (isNaN(amount) || amount <= 0) {
    throw new Error("Montant invalide. Le montant doit être supérieur à zéro.");
  }

  await db.run(`
    INSERT INTO MinibusExpenses (entity, type, amount, description, date)
    VALUES (?, ?, ?, ?, ?)
  `, [entity, type, amount, description, date]);

  revalidatePath('/direction/logistique');
}

export async function getUpcomingMaintenance() {
  const db = await getDb();
  return await db.all(`
    SELECT * FROM MinibusMaintenance 
    WHERE status != 'OK' OR due_date <= date('now', '+30 days')
    ORDER BY due_date ASC
  `);
}

export async function getRecentReservations() {
  const db = await getDb();
  return await db.all(`
    SELECT * FROM MinibusReservations
    ORDER BY start_time DESC
    LIMIT 20
  `);
}

export async function getRecentLogs() {
  const db = await getDb();
  return await db.all(`
    SELECT * FROM MinibusLogs
    ORDER BY created_at DESC
    LIMIT 20
  `);
}

export async function createLogEntry(formData: FormData) {
  const db = await getDb();
  
  const driver = formData.get('driver') as string;
  const entity = formData.get('entity') as string;
  const destination = formData.get('destination') as string;
  const start = parseInt(formData.get('mileage_start') as string);
  const end = parseInt(formData.get('mileage_end') as string);
  const liters = parseFloat(formData.get('fuel_liters') as string || '0');
  const fuel = parseFloat(formData.get('fuel_cost') as string || '0');
  const tolls = parseFloat(formData.get('tolls_cost') as string || '0');
  const notes = formData.get('notes') as string;

  if (end < start) {
    throw new Error("Le kilométrage d'arrivée ne peut pas être inférieur au kilométrage de départ.");
  }

  await db.run(`
    INSERT INTO MinibusLogs (driver_name, entity, destination, mileage_start, mileage_end, fuel_liters, fuel_cost, tolls_cost, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [driver, entity, destination, start, end, liters, fuel, tolls, notes]);

  revalidatePath('/direction/logistique');
}

export async function getCarpoolingRoutes() {
  const db = await getDb();
  return await db.all(`
    SELECT * FROM Carpooling 
    WHERE status != 'Cancelled'
    ORDER BY departure_time ASC
  `);
}

export async function createCarpoolingRoute(formData: FormData) {
  const db = await getDb();
  
  const driver = formData.get('driver_name') as string;
  const from = formData.get('start_location') as string;
  const time = formData.get('departure_time') as string;
  const seats = parseInt(formData.get('available_seats') as string);

  await db.run(`
    INSERT INTO Carpooling (driver_name, start_location, departure_time, available_seats)
    VALUES (?, ?, ?, ?)
  `, [driver, from, time, seats]);

  revalidatePath('/direction/logistique');
}

export async function updateMaintenanceStatus(id: number, status: string) {
  const db = await getDb();
  await db.run(`UPDATE MinibusMaintenance SET status = ? WHERE id = ?`, [status, id]);
  revalidatePath('/direction/logistique');
}

export async function createReservation(formData: FormData) {
  const db = await getDb();
  
  const name = formData.get('requester_name') as string;
  const entity = formData.get('entity') as string;
  const purpose = formData.get('purpose') as string;
  const destination = formData.get('destination') as string;
  const players_count = parseInt(formData.get('players_count') as string || '0');
  const category = formData.get('category') as string || 'AUTRE';
  const start = formData.get('start_time') as string;
  const end = formData.get('end_time') as string;

  if (new Date(end) <= new Date(start)) {
    throw new Error("La date de fin doit être postérieure à la date de début.");
  }

  await db.run(`
    INSERT INTO MinibusReservations (requester_name, entity, purpose, destination, players_count, category, start_time, end_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [name, entity, purpose, destination, players_count, category, start, end]);

  revalidatePath('/direction/logistique');
}

export async function updateReservationStatus(id: number, status: string) {
  const db = await getDb();
  await db.run('UPDATE MinibusReservations SET status = ? WHERE id = ?', [status, id]);
  revalidatePath('/direction/logistique');
}

export async function exportLogisticsCSV() {
  const db = await getDb();
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  const logs = await db.all(`
    SELECT created_at, entity, driver_name, destination, mileage_start, mileage_end, fuel_liters, fuel_cost, tolls_cost
    FROM MinibusLogs
    WHERE strftime('%Y-%m', created_at) = ?
    ORDER BY created_at ASC
  `, [currentMonth]);

  const headers = ["Date", "Entité", "Conducteur", "Destination", "KM Départ", "KM Fin", "Total KM", "Litres", "Coût Carburant", "Péages"];
  const rows = (logs as LogEntry[]).map((log: LogEntry) => [
    new Date(log.created_at).toLocaleDateString(),
    log.entity,
    log.driver_name,
    log.destination || "",
    log.mileage_start,
    log.mileage_end || log.mileage_start,
    (log.mileage_end || log.mileage_start) - log.mileage_start,
    log.fuel_liters || 0,
    log.fuel_cost || 0,
    log.tolls_cost || 0
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row: (string | number)[]) => row.join(","))
  ].join("\n");

  return csvContent;
}

export async function deleteReservation(id: number) {
  const db = await getDb();
  await db.run('DELETE FROM MinibusReservations WHERE id = ?', [id]);
  revalidatePath('/direction/logistique');
}
