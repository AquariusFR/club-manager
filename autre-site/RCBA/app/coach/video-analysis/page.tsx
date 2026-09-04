import { getDb } from '@/lib/db';
import Link from 'next/link';
import { PlayCircle, Calendar, Film } from 'lucide-react';
import VideoUploadForm from '@/components/video/VideoUploadForm';

export const dynamic = 'force-dynamic';

export default async function VideoAnalysisPage() {
  const db = await getDb();
  
  // Fetch videos with event details
  const videos = await db.all(`
    SELECT mv.*, e.titre as evenement_titre, e.date as evenement_date 
    FROM MatchVideos mv
    LEFT JOIN Evenements e ON mv.evenement_id = e.id
    ORDER BY mv.created_at DESC
  `);

  // Fetch recent events for the upload form
  const evenements = await db.all(`
    SELECT id, titre, date 
    FROM Evenements 
    WHERE type = 'match' OR type = 'entraînement'
    ORDER BY date DESC 
    LIMIT 20
  `);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-2 duration-500">
      <header className="mb-8">
        <h1 className="font-display font-black italic uppercase tracking-[0.15em] text-4xl mb-2">
          Analyse <span className="text-gold">Vidéo</span>
        </h1>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">
          Uploadez et analysez les performances
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne Gauche : Upload */}
        <div className="lg:col-span-1">
          <VideoUploadForm evenements={evenements} />
        </div>

        {/* Colonne Droite : Liste des vidéos */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display font-black italic uppercase tracking-[0.1em] text-xl mb-4 flex items-center gap-2">
            <Film className="w-5 h-5 text-gold" />
            Vidéos Disponibles
          </h2>
          
          {videos.length === 0 ? (
            <div className="bg-navy-deep/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 text-center">
              <Film className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50 font-medium">Aucune vidéo n'a été uploadée pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.map((video) => (
                <Link 
                  href={`/coach/video-analysis/${video.id}`}
                  key={video.id}
                  className="bg-navy-deep/60 backdrop-blur-3xl border border-white/10 rounded-3xl p-5 hover:border-gold/50 hover:bg-white/5 transition-all duration-300 group block relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="flex justify-between items-start mb-3 relative z-10">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/10 group-hover:border-gold/30 group-hover:bg-gold/10 transition-colors">
                      <PlayCircle className="w-6 h-6 text-white/70 group-hover:text-gold transition-colors" />
                    </div>
                    <span className="text-xs text-white/40">
                      {new Date(video.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-gold transition-colors">
                      {video.titre || 'Vidéo sans titre'}
                    </h3>
                    {video.evenement_titre && (
                      <p className="text-xs text-white/60 flex items-center gap-1 mt-2">
                        <Calendar className="w-3 h-3" />
                        {video.evenement_titre} ({video.evenement_date})
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
