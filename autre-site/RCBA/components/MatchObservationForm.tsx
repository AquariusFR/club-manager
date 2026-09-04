 'use client';

 

 import { useState } from 'react';

 import { saveMatchObservation } from '@/lib/actions';

 import { Send, CheckCircle2, MessageSquare } from 'lucide-react';

 

 interface ScoreSliderProps {
   label: string;
   value: number;
   onChange: (val: number) => void;
 }

 const ScoreSlider = ({ label, value, onChange }: ScoreSliderProps) => (
   <div className="space-y-1">
    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-white/60">
     <span>{label}</span>
     <span className="text-gold italic">{value}/5</span>
    </div>
    <input 
     type="range" min="1" max="5" 
     value={value} 
     onChange={(e) => onChange(parseInt(e.target.value))}
     className="w-full accent-gold bg-white/5 rounded-lg h-1.5 appearance-none cursor-pointer"
    />
   </div>
 );

 interface MatchObservationFormProps {

  players: { id: number; nom: string; prenom: string; equipe_nom : string }[];

 }

 

 export default function MatchObservationForm({ players }: MatchObservationFormProps) {

  const [selectedPlayer, setSelectedPlayer] = useState<string>('');

  const [observation, setObservation] = useState('');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [scores, setScores] = useState({

   tech: 3, tact: 3, phys: 3, ment: 3

  });

 

  // Group players by Team (Squad Synergy Phase 32)

  const groupedPlayers = players.reduce((acc, p) => {

   const team = p.equipe_nom || 'Sans Équipe';

   if (!acc[team]) acc[team] = [];

   acc[team].push(p);

   return acc;

  }, {} as Record<string, typeof players>);

 

  const handleSubmit = async (e: React.FormEvent) => {

   e.preventDefault();

   if (!selectedPlayer || !observation) return;

 

   setStatus('loading');

   const formData = new FormData();

   formData.append('joueur_id', selectedPlayer);

   formData.append('observation', observation);

   formData.append('apt_technique', scores.tech.toString());

   formData.append('apt_tactique', scores.tact.toString());

   formData.append('apt_physique', scores.phys.toString());

   formData.append('apt_mentale', scores.ment.toString());

 

   const result = await saveMatchObservation(formData);

 

   if (result.success) {

    setStatus('success');

    setObservation('');

    setScores({ tech: 3, tact: 3, phys: 3, ment: 3 });

    setTimeout(() => setStatus('idle'), 3000);

   } else {

    setStatus('error');

   }

  };

 

  return (

   <section className="glass-card p-8 border-gold/20 bg-gradient-to-br from-navy to-gold/[0.03] relative overflow-hidden group">

    <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform">

     <MessageSquare size={80} className="text-gold" />

    </div>

 

    <div className="relative z-10">

     <h3 className="athletic-title text-xl mb-2">Scouting & <span className="text-gold">Observation</span></h3>

     <p className="text-[10px] font-black uppercase tracking-widest text-white/80 mb-8 italic">Observer n&apos;importe quel joueur du club</p>

 

     <form onSubmit={handleSubmit} className="space-y-6">

      <div className="space-y-2">

       <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 block ml-1">Sélectionner le joueur</label>

       <select 

        value={selectedPlayer}

        onChange={(e) => setSelectedPlayer(e.target.value)}

        className="w-full bg-navy-deep/80 border border-white/10 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-gold/50 focus:border-gold transition appearance-none text-white/80"

        required

       >

        <option value="">-- Choisir un joueur --</option>

        {Object.entries(groupedPlayers).map(([team, squad]) => (

         <optgroup key={team} label={team} className="bg-navy text-gold font-black uppercase text-[10px]">

          {squad.map(p => (

           <option key={p.id} value={p.id} className="text-white bg-navy-deep">{p.prenom} {p.nom}</option>

          ))}

         </optgroup>

        ))}

       </select>

      </div>

 

      <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
        <ScoreSlider label="Technique" value={scores.tech} onChange={(val) => setScores(prev => ({ ...prev, tech: val }))} />
        <ScoreSlider label="Tactique" value={scores.tact} onChange={(val) => setScores(prev => ({ ...prev, tact: val }))} />
        <ScoreSlider label="Physique" value={scores.phys} onChange={(val) => setScores(prev => ({ ...prev, phys: val }))} />
        <ScoreSlider label="Mental" value={scores.ment} onChange={(val) => setScores(prev => ({ ...prev, ment: val }))} />
      </div>

 

      <div className="space-y-2">

       <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 block ml-1">L&apos;œil du Coach (Note individuelle)</label>

       <textarea

        value={observation}

        onChange={(e) => setObservation(e.target.value)}

        placeholder="Ex: Excellent repli, mais manque d'agressivité sur le porteur..."

        className="w-full bg-navy-deep/80 border border-white/10 rounded-2xl p-5 text-sm font-bold min-h-[100px] focus:ring-2 focus:ring-gold/50 focus:border-gold transition text-white/90 placeholder:text-white/70 italic"

        required

       />

      </div>

 

      <button 

       type="submit"

       disabled={status === 'loading'}

       className={`w-full py-4 rounded-2xl font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 transition ${

        status === 'success' ? 'bg-pitch-green text-navy-deep' :

        status === 'loading' ? 'bg-gold/20 text-gold animate-pulse cursor-wait' :

        'bg-gold text-navy-deep hover:shadow-gold hover:scale-[1.02]'

       }`}

      >

       {status === 'success' ? (

        <> <CheckCircle2 size={18} /> Observation Enregistrée </>

       ) : (

        <> <Send size={18} /> Publier le conseil individuel </>

       )}

      </button>

     </form>

    </div>

   </section>

  );

 }

 
