import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDb();
    const videos = await db.all(`
      SELECT mv.*, e.titre as evenement_titre, e.date as evenement_date 
      FROM MatchVideos mv
      LEFT JOIN Evenements e ON mv.evenement_id = e.id
      ORDER BY mv.created_at DESC
    `);
    
    return NextResponse.json({ videos });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des vidéos.' }, { status: 500 });
  }
}
