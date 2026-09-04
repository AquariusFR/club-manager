'use client';

import { useState } from 'react';
import { Target, Save, Users, Search, RefreshCw, Plus } from 'lucide-react';
import MagneticWrapper from './MagneticWrapper';

interface Player {
  id: number;
  nom: string;
  prenom: string;
  poste: string;
  sdi_score?: number;
  meritData?: {
    score: number;
  };
}

interface LineupBuilderProps {
  players: Player[];
  matches: any[];
}

export default function LineupBuilder({ players, matches }: LineupBuilderProps) {
  const [selectedMatch, setSelectedMatch] = useState(matches[0]?.id || null);
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState<Record<string, number | null>>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const formations = {
    '4-3-3': [
      { id: 'GK', label: 'Gardien', top: '85%', left: '50%' },
      { id: 'LB', label: 'Arg', top: '65%', left: '15%' },
      { id: 'CB1', label: 'DCg', top: '70%', left: '35%' },
      { id: 'CB2', label: 'DCd', top: '70%', left: '65%' },
      { id: 'RB', label: 'Ard', top: '65%', left: '85%' },
      { id: 'CM1', label: 'Mg', top: '45%', left: '30%' },
      { id: 'CM2', label: 'Mc', top: '50%', left: '50%' },
      { id: 'CM3', label: 'Md', top: '45%', left: '70%' },
      { id: 'LW', label: 'Aig', top: '20%', left: '20%' },
      { id: 'ST', label: 'Bu', top: '15%', left: '50%' },
      { id: 'RW', label: 'Aid', top: '20%', left: '80%' },
    ],
    '4-4-2': [
      { id: 'GK', label: 'Gardien', top: '85%', left: '50%' },
      { id: 'LB', label: 'Arg', top: '65%', left: '15%' },
      { id: 'CB1', label: 'DCg', top: '70%', left: '35%' },
      { id: 'CB2', label: 'DCd', top: '70%', left: '65%' },
      { id: 'RB', label: 'Ard', top: '65%', left: '85%' },
      { id: 'LM', label: 'Mg', top: '40%', left: '15%' },
      { id: 'CM1', label: 'MCg', top: '45%', left: '35%' },
      { id: 'CM2', label: 'MCd', top: '45%', left: '65%' },
      { id: 'RM', label: 'Md', top: '40%', left: '85%' },
      { id: 'ST1', label: 'Bug', top: '15%', left: '35%' },
      { id: 'ST2', label: 'Bud', top: '15%', left: '65%' },
    ]
  };

  const currentFormation = formations[formation as keyof typeof formations];

  const handleSlotClick = (slotId: string) => {
    setSelectedSlot(slotId === selectedSlot ? null : slotId);
  };

  const assignPlayer = (playerId: number) => {
    if (selectedSlot) {
      // If player is already in another slot, swap or remove
      const newLineup = { ...lineup };
      Object.keys(newLineup).forEach(key => {
        if (newLineup[key] === playerId) {
          newLineup[key] = null;
        }
      });
      newLineup[selectedSlot] = playerId;
      setLineup(newLineup);
      setSelectedSlot(null);
    }
  };

  const removePlayer = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLineup = { ...lineup };
    newLineup[slotId] = null;
    setLineup(newLineup);
  };

  const getPlayerDetails = (id: number | null) => {
    if (!id) return null;
    return players.find(p => p.id === id);
  };

  return (
    <div className="grid lg:grid-cols-12 gap-12">
      {/* Settings & Player List */}
      <div className="lg:col-span-4 space-y-8">
        <div className="glass-card-elevated p-8 border-white/5 bg-navy-deep/40 rounded-[2rem]">
          <h3 className="athletic-title text-xl text-white italic drop-shadow-glow mb-6">Paramètres</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest italic mb-2 block">Match</label>
              <select 
                value={selectedMatch || ''} 
                onChange={(e) => setSelectedMatch(parseInt(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-gold"
              >
                {matches.map(m => (
                  <option key={m.id} value={m.id}>{new Date(m.date).toLocaleDateString('fr-FR')} - {m.adversaire}</option>
                ))}
                {matches.length === 0 && <option value="">Aucun match à venir</option>}
              </select>
            </div>
            
            <div>
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest italic mb-2 block">Formation</label>
              <select 
                value={formation} 
                onChange={(e) => {
                  setFormation(e.target.value);
                  setLineup({}); // reset lineup on formation change
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-bold outline-none focus:border-gold"
              >
                {Object.keys(formations).map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {selectedSlot && (
          <div className="glass-card-elevated p-8 border-gold/20 bg-gold/5 rounded-[2rem] animate-in fade-in slide-in-from-top-4">
            <h3 className="athletic-title text-xl text-gold italic drop-shadow-glow mb-4">Sélectionner pour le poste</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {players.map(p => {
                const isSelected = Object.values(lineup).includes(p.id);
                if (isSelected) return null; // Hide already selected players
                
                return (
                  <button 
                    key={p.id}
                    onClick={() => assignPlayer(p.id)}
                    className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/40 transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-black text-white uppercase italic">{p.prenom} {p.nom}</div>
                      <div className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{p.poste || 'INCONNU'}</div>
                    </div>
                    {p.sdi_score && (
                      <div className={`text-xs font-black italic ${p.sdi_score > 70 ? 'text-pitch-green' : p.sdi_score > 40 ? 'text-orange-400' : 'text-red-500'}`}>
                        SDI: {p.sdi_score}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pitch Area */}
      <div className="lg:col-span-8">
        <div className="glass-card-elevated border-white/5 bg-navy-deep/60 rounded-[3rem] p-8 relative overflow-hidden flex flex-col items-center">
          <div className="w-full max-w-[600px] aspect-[2/3] bg-pitch-green/10 border-2 border-white/20 rounded-xl relative shadow-2xl overflow-hidden pitch-bg">
            {/* Pitch Lines */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/20 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-0 left-1/2 w-64 h-32 border-2 border-t-0 border-white/20 -translate-x-1/2" />
            <div className="absolute top-0 left-1/2 w-32 h-12 border-2 border-t-0 border-white/20 -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-64 h-32 border-2 border-b-0 border-white/20 -translate-x-1/2" />
            <div className="absolute bottom-0 left-1/2 w-32 h-12 border-2 border-b-0 border-white/20 -translate-x-1/2" />

            {/* Render Slots */}
            {currentFormation.map((slot) => {
              const player = getPlayerDetails(lineup[slot.id]);
              const isActive = selectedSlot === slot.id;

              return (
                <div 
                  key={slot.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 cursor-pointer transition-transform duration-300"
                  style={{ top: slot.top, left: slot.left }}
                  onClick={() => handleSlotClick(slot.id)}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-[10px] shadow-xl border-2 transition duration-300 ${isActive ? 'bg-gold text-navy-deep border-white scale-125 z-20' : player ? 'bg-navy-deep text-white border-gold z-10' : 'bg-white/10 text-white/50 border-white/20 border-dashed hover:bg-white/20'}`}>
                    {player ? `${player.prenom[0]}${player.nom[0]}` : <Plus size={16} />}
                  </div>
                  <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-lg ${player ? 'bg-navy-deep/80 text-white border border-white/10' : 'bg-black/50 text-white/50'}`}>
                    {player ? player.nom : slot.label}
                  </div>
                  {player && isActive && (
                    <button 
                      onClick={(e) => removePlayer(slot.id, e)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] hover:scale-110"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end w-full">
            <MagneticWrapper>
              <button 
                onClick={async () => {
                  if (!selectedMatch) return alert("Veuillez sélectionner un match");
                  const { saveCompositionAction } = await import('@/lib/actions');
                  const res = await saveCompositionAction(selectedMatch, formation, lineup);
                  if (res.success) {
                    alert("Composition sauvegardée avec succès !");
                  } else {
                    alert("Erreur: " + res.error);
                  }
                }}
                className="bg-gold text-navy-deep px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition shadow-xl shadow-gold/20 flex items-center gap-3"
              >
                <Save size={16} /> SAUVEGARDER COMPOSITION
              </button>
            </MagneticWrapper>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .pitch-bg {
          background-image: repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 80px);
        }
      `}</style>
    </div>
  );
}

