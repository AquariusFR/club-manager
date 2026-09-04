import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('video') as File | null;
    const evenementId = formData.get('evenementId') as string | null;
    const title = formData.get('titre') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier vidéo fourni.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Sanitize filename and add timestamp to avoid collisions
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads/videos');
    const filePath = path.join(uploadDir, filename);

    // Write file to public/uploads/videos
    await writeFile(filePath, buffer);
    const fileUrl = `/uploads/videos/${filename}`;

    const db = await getDb();
    const result = await db.run(
      'INSERT INTO MatchVideos (evenement_id, titre, file_url) VALUES (?, ?, ?)',
      [evenementId || null, title || file.name, fileUrl]
    );

    return NextResponse.json({ success: true, videoId: result.lastID, fileUrl });
  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json({ error: 'Erreur lors de l\'upload de la vidéo.' }, { status: 500 });
  }
}
