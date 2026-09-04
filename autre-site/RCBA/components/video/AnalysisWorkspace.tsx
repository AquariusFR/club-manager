'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Rewind, FastForward, Trash2 } from 'lucide-react';
import { saveVideoTagAction, deleteVideoTagAction } from '@/lib/actions';

interface Player {
  id: number;
  nom: string;
  prenom: string;
}

interface VideoTag {
  id: number;
  joueur_id: number | null;
  timestamp: number;
  action_type: string;
  joueur_nom?: string;
  joueur_prenom?: string;
}

interface AnalysisWorkspaceProps {
  videoId: string;
  videoUrl: string;
  joueurs: Player[];
  initialTags: VideoTag[];
}

const ACTION_TYPES = [
  { id: 'Bonne passe', label: 'Bonne passe', color: 'bg-pitch-green text-navy-deep' },
  { id: 'Mauvaise passe', label: 'Mauvaise passe', color: 'bg-red-500/80 text-white' },
  { id: 'Tir tenté', label: 'Tir tenté', color: 'bg-white/20 text-white' },
  { id: 'Tir cadré', label: 'Tir cadré', color: 'bg-gold text-navy-deep' },
  { id: 'Passe décisive', label: 'Passe décisive', color: 'bg-pitch-green text-navy-deep font-bold' },
  { id: 'Interception', label: 'Interception', color: 'bg-blue-500/80 text-white' },
  { id: 'Faute', label: 'Faute', color: 'bg-purple-500/80 text-white' },
  { id: 'Perte de balle', label: 'Perte de balle', color: 'bg-orange-500/80 text-white' },
];

export default function AnalysisWorkspace({ videoId, videoUrl, joueurs, initialTags }: AnalysisWorkspaceProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  
  const [tags, setTags] = useState<VideoTag[]>(initialTags);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | ''>('');
  const [isTagging, setIsTagging] = useState(false);

  // Video Controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackRate(speed);
    }
  };

  const seek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const jumpTo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      if (!isPlaying) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, []);

  // Tagging Logic
  const handleTag = async (actionType: string) => {
    if (!videoRef.current) return;
    if (!selectedPlayerId) {
      alert("Veuillez sélectionner un joueur avant de taguer une action.");
      return;
    }
    
    setIsTagging(true);
    const time = videoRef.current.currentTime;
    
    try {
      const res = await saveVideoTagAction(Number(videoId), Number(selectedPlayerId), time, actionType);

      if (res.success) {
        const player = joueurs.find(j => j.id === Number(selectedPlayerId));
        const newTag: VideoTag = {
          id: Date.now(), // temporary ID until refresh or if we need it
          joueur_id: Number(selectedPlayerId),
          timestamp: time,
          action_type: actionType,
          joueur_nom: player?.nom,
          joueur_prenom: player?.prenom,
        };
        // Insert and sort
        const newTags = [...tags, newTag].sort((a, b) => a.timestamp - b.timestamp);
        setTags(newTags);
      }
    } catch (error) {
      console.error('Error adding tag:', error);
    } finally {
      setIsTagging(false);
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    try {
      const res = await deleteVideoTagAction(tagId);
      if (res.success) {
        setTags(tags.filter(t => t.id !== tagId));
      }
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video Player Section */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-navy-deep/80 backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl relative overflow-hidden group">
          <video 
            ref={videoRef}
            src={videoUrl}
            className="w-full rounded-2xl bg-black"
            onClick={togglePlay}
          />
          
          {/* Custom Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-navy-deep/90 backdrop-blur-md border border-white/10 rounded-2xl p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-4">
              <button onClick={() => seek(-10)} className="text-white/70 hover:text-white transition-colors">
                <Rewind className="w-5 h-5" />
              </button>
              <button onClick={togglePlay} className="text-gold hover:text-white transition-colors">
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
              </button>
              <button onClick={() => seek(10)} className="text-white/70 hover:text-white transition-colors">
                <FastForward className="w-5 h-5" />
              </button>
              <span className="text-white font-mono text-sm ml-2">
                {formatTime(currentTime)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest mr-2">Vitesse</span>
              {[0.5, 1, 1.5, 2].map(speed => (
                <button 
                  key={speed}
                  onClick={() => changeSpeed(speed)}
                  className={`px-2 py-1 rounded text-xs font-bold transition-colors ${playbackRate === speed ? 'bg-gold text-navy-deep' : 'bg-white/10 text-white hover:bg-white/20'}`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tagging Panel Section */}
      <div className="space-y-6">
        <div className="bg-navy-deep/60 backdrop-blur-3xl border border-white/10 p-6 rounded-3xl">
          <h3 className="font-display font-black italic uppercase tracking-[0.1em] text-lg mb-4 text-gold">
            Taguer une Action
          </h3>
          
          <div className="mb-6">
            <label className="block text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mb-2">
              Joueur (Optionnel)
            </label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold/50 transition-colors appearance-none"
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="" className="bg-navy-deep text-white">Sélectionner un joueur...</option>
              {joueurs.map(j => (
                <option key={j.id} value={j.id} className="bg-navy-deep text-white">
                  {j.prenom} {j.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {ACTION_TYPES.map(action => (
              <button
                key={action.id}
                disabled={isTagging}
                onClick={() => handleTag(action.id)}
                className={`${action.color} py-3 px-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all disabled:opacity-50`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tags List */}
        <div className="bg-navy-deep/60 backdrop-blur-3xl border border-white/10 p-6 rounded-3xl max-h-[400px] overflow-y-auto">
          <h3 className="font-display font-black italic uppercase tracking-[0.1em] text-lg mb-4 text-white">
            Tags ({tags.length})
          </h3>
          
          <div className="space-y-2">
            {tags.length === 0 ? (
              <p className="text-white/40 text-sm italic">Aucun tag pour le moment.</p>
            ) : (
              tags.map(tag => {
                const actionDef = ACTION_TYPES.find(a => a.id === tag.action_type);
                return (
                  <div key={tag.id} className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors group">
                    <button 
                      onClick={() => jumpTo(tag.timestamp)}
                      className="flex-1 flex items-center gap-3 text-left"
                    >
                      <span className="font-mono text-gold text-sm font-bold bg-gold/10 px-2 py-1 rounded">
                        {formatTime(tag.timestamp)}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {actionDef?.label || tag.action_type}
                        </p>
                        {tag.joueur_nom && (
                          <p className="text-xs text-white/50">
                            {tag.joueur_prenom} {tag.joueur_nom}
                          </p>
                        )}
                      </div>
                    </button>
                    <button 
                      onClick={() => handleDeleteTag(tag.id)}
                      className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
