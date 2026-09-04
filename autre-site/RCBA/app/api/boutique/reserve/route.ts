import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { produit_id, produit_nom, taille, acheteur_nom, acheteur_email } = data;

    if (!produit_id || !produit_nom || !taille || !acheteur_nom || !acheteur_email) {
      return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
    }

    const db = await getDb();
    
    // Assure que la table existe (au cas où getDb n'aurait pas encore run l'init complètement)
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

    const result = await db.run(
      `INSERT INTO BoutiqueReservations (produit_id, produit_nom, taille, acheteur_nom, acheteur_email)
       VALUES (?, ?, ?, ?, ?)`,
      [produit_id, produit_nom, taille, acheteur_nom, acheteur_email]
    );

    return NextResponse.json({ success: true, id: result.lastID });
  } catch (error) {
    console.error('Erreur lors de la réservation boutique:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
