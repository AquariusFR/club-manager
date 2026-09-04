import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    
    // Assure que la table existe
    await db.exec(`
      CREATE TABLE IF NOT EXISTS BoutiqueReservations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produit_id TEXT NOT NULL,
        produit_nom TEXT NOT NULL,
        taille TEXT NOT NULL,
        acheteur_nom TEXT NOT NULL,
        acheteur_email TEXT NOT NULL,
        statut TEXT DEFAULT 'En attente',
        date_reservation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const reservations = await db.all(
      `SELECT * FROM BoutiqueReservations ORDER BY date_reservation DESC`
    );
    return NextResponse.json({ success: true, reservations });
  } catch (error) {
    console.error('Erreur GET reservations boutique:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, statut } = data;

    if (!id || !statut) {
      return NextResponse.json({ error: 'ID ou statut manquant' }, { status: 400 });
    }

    const db = await getDb();
    await db.run(
      `UPDATE BoutiqueReservations SET statut = ? WHERE id = ?`,
      [statut, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur PATCH reservations boutique:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
