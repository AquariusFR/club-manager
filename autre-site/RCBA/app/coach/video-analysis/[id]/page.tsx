import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import AnalysisWorkspace from '@/components/video/AnalysisWorkspace';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function VideoDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();

  const video = await db.get(`
    SELECT mv.*, e.titre as evenement_titre 
    FROM MatchVideos mv
    LEFT JOIN Evenements e ON mv.evenement_id = e.id
    WHERE mv.id = ?
  `, [id]);

  if (!video) {
    notFound();
  }

  // Fetch players for tagging
  const joueurs = await db.all(`
    SELECT id, nom, prenom 
    FROM Joueurs 
    ORDER BY nom ASC
  `);

  // Fetch existing tags
  const tags = await db.all(`
    SELECT vt.*, j.nom as joueur_nom, j.prenom as joueur_prenom 
    FROM VideoTags vt
    LEFT JOIN Joueurs j ON vt.joueur_id = j.id
    WHERE vt.video_id = ?
    ORDER BY vt.timestamp ASC
  `, [id]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between bg-navy-deep/60 backdrop-blur-3xl border border-white/10 rounded-2xl p-4">
        <div>
          <h1 className="font-display font-black italic uppercase tracking-[0.1em] text-2xl text-white flex items-center gap-3">
            <Link href="/coach/video-analysis" className="text-white/40 hover:text-gold transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            {video.titre || 'Vidéo sans titre'}
          </h1>
          {video.evenement_titre && (
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mt-1 ml-9">
              {video.evenement_titre}
            </p>
          )}
        </div>
      </header>

      <AnalysisWorkspace 
        videoId={id}
        videoUrl={video.file_url}
        joueurs={joueurs}
        initialTags={tags}
      />
    </div>
  );
}
