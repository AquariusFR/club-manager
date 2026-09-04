'use client'

import { useState } from 'react';
import { Check, X, Clock, Save, User, MapPin, Calendar, Info } from 'lucide-react';
import { updateAttendanceAction } from '@/lib/actions';

interface Player {
  id: number;
  nom: string;
  prenom: string;
  status: string;
  poste: string;
  serieux: number; // Rebranded to Technique
  ponctualite: number; // Rebranded to Physique
  performance: number; // Rebranded to Engagement
}

export default function AttendanceGrid({ 
  eventId, 
  initialPlayers 
}: { 
  eventId: number; 
  initialPlayers: Player[] 
}) {
  const [attendance, setAttendance] = useState<Record<number, any>>(
    Object.fromEntries(initialPlayers.map(p => [
      p.id, 
      { 
        status: (p.status || 'EN_ATTENTE').toUpperCase(),
        serieux: p.serieux || 3,
        ponctualite: p.ponctualite || 3,
        performance: p.performance || 3
      }
    ]))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleToggle = (playerId: number, status: string) => {
    setAttendance(prev => ({ 
      ...prev, 
      [playerId]: { ...prev[playerId], status } 
    }));
  };

  const handleRatingChange = (playerId: number, field: string, value: number) => {
    setAttendance(prev => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value }
    }));
  };

  const saveAttendance = async () => {
    setIsSaving(true);
    setMessage('');
    
    // Map status back to the names expected by the DB action
    // PRESENT -> présent, ABSENT -> absent, RETARD -> retard
    const res = await updateAttendanceAction(eventId, attendance);
    if (res.success) {
      setMessage('Présences enregistrées avec succès.');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Erreur lors de l\'enregistrement.');
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-700">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <h3 className="athletic-title text-2xl italic text-white/60 uppercase tracking-tight">LIVE <span className="text-white">TRACKER</span></h3>
          </div>
          <span className="text-[10px] bg-white/5 border border-white/10 px-3 py-1 rounded-full text-white/60 font-black uppercase tracking-wider w-fit">{initialPlayers.length} Joueurs en session</span>
        </div>
        
        <button 
          onClick={saveAttendance}
          disabled={isSaving}
          className={`group flex items-center gap-4 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-wider transition whitespace-nowrap ${isSaving ? 'bg-white/5 text-white/80' : 'bg-gold text-navy-deep hover:shadow-gold active:scale-95 shadow-xl shadow-gold/5'}`}
        >
          {isSaving ? 'Synchronisation...' : 'Enregistrer présences'}
          <Save size={16} className={isSaving ? 'animate-spin' : ''} />
        </button>
      </div>

      {message && (
        <div className="p-4 bg-pitch-green/10 border border-pitch-green/20 text-pitch-green text-[10px] font-black uppercase tracking-wider text-center rounded-xl animate-in fade-in zoom-in italic">
          {message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialPlayers.map(player => (
          <div key={player.id} className="glass-card p-6 border-white/5 bg-white/[0.01] flex flex-col gap-6 group hover:bg-white/[0.02] transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-sm border border-white/5 text-white/60 group-hover:border-gold/30 transition">
                  {player.prenom[0]}{player.nom[0]}
                </div>
                <div>
                  <div className="text-sm font-black text-white uppercase tracking-tight leading-none">{player.prenom} {player.nom}</div>
                  <div className="text-[8px] text-white/80 font-bold uppercase tracking-wider mt-1 whitespace-nowrap">{player.poste}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <StatusButton 
                active={attendance[player.id].status === 'PRÉSENT'} 
                onClick={() => handleToggle(player.id, 'PRÉSENT')}
                icon={<Check size={14} />}
                label="Présent"
                color="pitch-green"
              />
              <StatusButton 
                active={attendance[player.id].status === 'RETARD'} 
                onClick={() => handleToggle(player.id, 'RETARD')}
                icon={<Clock size={14} />}
                label="Retard"
                color="gold"
              />
              <StatusButton 
                active={attendance[player.id].status === 'ABSENT'} 
                onClick={() => handleToggle(player.id, 'ABSENT')}
                icon={<X size={14} />}
                label="Absent"
                color="rose"
              />
            </div>

            {/* Evaluation Metrics */}
            <div className={`space-y-5 pt-4 border-t border-white/5 transition duration-500 ${attendance[player.id].status === 'ABSENT' ? 'opacity-20 pointer-events-none grayscale' : 'opacity-100'}`}>
               <EvaluationSlider 
                  label="Technique" 
                  value={attendance[player.id].serieux} 
                  onChange={(v: number) => handleRatingChange(player.id, 'serieux', v)} 
                  color="text-blue-400"
               />
               <EvaluationSlider 
                  label="Physique" 
                  value={attendance[player.id].ponctualite} 
                  onChange={(v: number) => handleRatingChange(player.id, 'ponctualite', v)} 
                  color="text-gold"
               />
               <EvaluationSlider 
                  label="Engagement" 
                  value={attendance[player.id].performance} 
                  onChange={(v: number) => handleRatingChange(player.id, 'performance', v)} 
                  color="text-pitch-green"
               />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EvaluationSlider({ label, value, onChange, color }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[8px] font-black uppercase tracking-widest text-white/60 italic">{label}</span>
        <span className={`text-[10px] font-black ${color} drop-shadow-glow`}>{value}/5</span>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`h-3 flex-1 rounded-sm transition relative ${i <= value ? `${color.replace('text-', 'bg-')} shadow-gold` : 'bg-white/5 hover:bg-white/10'}`}
          >
            {/* Extended touch area for mobile */}
            <span className="absolute -inset-2 block" />
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusButton({ active, onClick, icon, label, color }: any) {
  const themes: any = {
    'pitch-green': active ? 'bg-pitch-green/20 border-pitch-green/40 text-pitch-green' : 'bg-white/5 border-white/5 text-white/70 hover:border-pitch-green/20',
    gold: active ? 'bg-gold/20 border-gold/40 text-gold' : 'bg-white/5 border-white/5 text-white/70 hover:border-gold/20',
    rose: active ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' : 'bg-white/5 border-white/5 text-white/70 hover:border-rose-500/20',
  };

  return (
    <button 
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition ${themes[color]}`}
    >
      {icon}
      <span className="text-[7px] font-black uppercase tracking-wider whitespace-nowrap">{label}</span>
    </button>
  );
}
