import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = await getDb();
    const tags = await db.all(`
      SELECT vt.*, j.nom as joueur_nom, j.prenom as joueur_prenom 
      FROM VideoTags vt
      LEFT JOIN Joueurs j ON vt.joueur_id = j.id
      WHERE vt.video_id = ?
      ORDER BY vt.timestamp ASC
    `, [id]);
    
    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des tags.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { joueur_id, timestamp, action_type } = await req.json();
    
    if (timestamp === undefined || !action_type) {
       return NextResponse.json({ error: 'Timestamp et action_type sont requis.' }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO VideoTags (video_id, joueur_id, timestamp, action_type) VALUES (?, ?, ?, ?)',
      [id, joueur_id || null, timestamp, action_type]
    );
    
    return NextResponse.json({ success: true, tagId: result.lastID });
  } catch (error) {
    console.error('Error adding tag:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'ajout du tag.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // id here is video_id, but the URL could have ?tagId=X
  try {
    const url = new URL(req.url);
    const tagId = url.searchParams.get('tagId');

    if (!tagId) {
      return NextResponse.json({ error: 'tagId est requis.' }, { status: 400 });
    }

    const db = await getDb();
    await db.run('DELETE FROM VideoTags WHERE id = ? AND video_id = ?', [tagId, id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du tag.' }, { status: 500 });
  }
}
