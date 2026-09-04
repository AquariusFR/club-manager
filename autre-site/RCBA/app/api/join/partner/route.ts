import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { nom, prenom, entreprise, email, telephone, typePartenariat, message } = data;

    if (!nom || !prenom || !entreprise || !email || !telephone) {
      return NextResponse.json({ error: 'Veuillez remplir les champs obligatoires.' }, { status: 400 });
    }

    const db = await getDb();
    
    // Le responsable des partenaires recevra ces messages
    // Par défaut on envoie à la direction
    const destinataire = 'direction@rcba.fr';

    await db.run(
      `INSERT INTO MessagesRecrutement (
        type, nom, prenom, email, telephone, message, destinataire, lu, date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, datetime('now'))`,
      ['partenaire', nom, prenom, email, telephone, `Entreprise: ${entreprise}\nType: ${typePartenariat || 'Non spécifié'}\nMessage: ${message || 'Aucun message'}`, destinataire]
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Erreur inscription partenaire:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    console.error('Erreur inscription partenaire (inconnue):', error);
    return NextResponse.json({ error: 'Erreur serveur interne.' }, { status: 500 });
  }
}
