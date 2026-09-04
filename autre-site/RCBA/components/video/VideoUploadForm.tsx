'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Loader2, Video, CheckCircle2 } from 'lucide-react';
import { uploadMatchVideoAction } from '@/lib/actions';

export default function VideoUploadForm({ evenements }: { evenements: any[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [evenementId, setEvenementId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('idle');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('titre', title || file.name);
    if (evenementId) {
      formData.append('evenement_id', evenementId); // Matches the server action
    }

    try {
      const res = await uploadMatchVideoAction(formData);

      if (res.success) {
        setUploadStatus('success');
        setFile(null);
        setTitle('');
        setEvenementId('');
        router.refresh();
      } else {
        console.error(res.error);
        setUploadStatus('error');
      }
    } catch (error) {
      console.error(error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-navy-deep/60 backdrop-blur-3xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group">
      {/* Subtle shine effect from DESIGN.md */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center border border-gold/30">
           <Upload className="w-5 h-5 text-gold" />
        </div>
        <h2 className="font-display font-black italic uppercase tracking-[0.15em] text-xl">Uploader un Match</h2>
      </div>

      <form onSubmit={handleUpload} className="space-y-4 relative z-10">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-2">
            Titre de la vidéo (Optionnel)
          </label>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors"
            placeholder="Ex: Finale Coupe de France 2026..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-2">
            Lier à un événement (Optionnel)
          </label>
          <select
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors appearance-none"
            value={evenementId}
            onChange={(e) => setEvenementId(e.target.value)}
          >
            <option value="" className="bg-navy-deep text-white">Aucun événement</option>
            {evenements.map((evt) => (
              <option key={evt.id} value={evt.id} className="bg-navy-deep text-white">
                {evt.titre} - {evt.date}
              </option>
            ))}
          </select>
        </div>

        <div>
           <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-2">
            Fichier Vidéo (MP4, MOV)
          </label>
          <div className="relative">
            <input
              type="file"
              accept="video/mp4,video/quicktime"
              onChange={handleFileChange}
              className="hidden"
              id="video-upload"
            />
            <label 
              htmlFor="video-upload" 
              className="flex items-center justify-center w-full border-2 border-dashed border-white/20 rounded-xl px-4 py-8 cursor-pointer hover:border-gold/50 hover:bg-white/5 transition-all duration-300"
            >
              {file ? (
                <div className="flex flex-col items-center text-center">
                  <Video className="w-8 h-8 text-pitch-green mb-2" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-white/50 mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center text-white/50">
                  <Upload className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Cliquez pour sélectionner une vidéo</span>
                  <span className="text-xs mt-1 max-w-xs">Attention: Stockage local, limitez la taille (max recommandé 500Mo).</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!file || isUploading}
          className="w-full mt-4 flex items-center justify-center py-3 px-6 rounded-xl bg-gradient-to-r from-gold/80 to-gold text-navy-deep font-black uppercase tracking-widest text-sm hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Upload en cours...
            </>
          ) : (
            'Envoyer la vidéo'
          )}
        </button>

        {uploadStatus === 'success' && (
          <div className="mt-4 flex items-center gap-2 text-pitch-green p-3 bg-pitch-green/10 rounded-xl border border-pitch-green/20 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Vidéo uploadée avec succès !</span>
          </div>
        )}
        
        {uploadStatus === 'error' && (
          <div className="mt-4 flex items-center gap-2 text-red-500 p-3 bg-red-500/10 rounded-xl border border-red-500/20 animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-medium">Erreur lors de l'upload. Vérifiez la taille du fichier.</span>
          </div>
        )}
      </form>
    </div>
  );
}
