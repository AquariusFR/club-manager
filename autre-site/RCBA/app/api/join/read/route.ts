import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/authentication';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const allowedRoles = ['coach', 'direction', 'développeur', 'developpeur', 'admin'];
    if (!session || !allowedRoles.includes(session.roleName.toLowerCase())) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    }

    const db = await getDb();
    
    // Pour un coach, vérifier s'il a le droit de lire ce message (optionnel mais recommandé, ou on fait confiance au session.email)
    
    await db.run('UPDATE MessagesRecrutement SET lu = 1 WHERE id = ?', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
