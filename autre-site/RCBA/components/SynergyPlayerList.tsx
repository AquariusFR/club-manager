 'use client';

 

 import React, { useState, useEffect } from 'react';

 import { Search, AlertTriangle, CheckCircle2, TrendingUp, Users2, ShieldAlert } from 'lucide-react';

 

 interface PlayerWithMerit {

  id: number;

  nom: string;

  prenom: string;

  poste: string;

  equipe_nom: string;

  merit: {

   merit: number;

   status: string;

   isTopPerformer: boolean;

  };

 }

 

 interface SynergyPlayerListProps {

  players: PlayerWithMerit[];

  selectedDate: string;

 }

 

 export default function SynergyPlayerList({ players, selectedDate }: SynergyPlayerListProps) {

  const [searchTerm, setSearchTerm] = useState('');

  const [conflicts, setConflicts] = useState<Record<number, any>>({});

  const [isLoading, setIsLoading] = useState(false);

 

  // Filter players based on search

  const filteredPlayers = players.filter(p => 

   `${p.prenom} ${p.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||

   p.equipe_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||

   p.poste.toLowerCase().includes(searchTerm.toLowerCase())

  );

 

  // Effect to check conflicts when the date changes

  useEffect(() => {

   if (!selectedDate) {

    setConflicts({});

    return;

   }

 

   const checkConflicts = async () => {

    setIsLoading(true);

    try {

     const response = await fetch(`/api/coaches/conflicts date=${selectedDate}`);

     if (response.ok) {

      const data = await response.json();

      setConflicts(data); // Expecting { [playerId]: { title: 'Match X', equipe: 'Team Y' } }

     }

    } catch (e) {

     console.error("Conflict check failed", e);

    } finally {

     setIsLoading(false);

    }

   };

 

   const timer = setTimeout(checkConflicts, 500); // Debounce

   return () => clearTimeout(timer);

  }, [selectedDate]);

 

  return (

   <div className="space-y-6">

    {/* Search Bar */}

    <div className="relative group">

     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 group-hover:text-gold transition-colors" size={18} />

     <input 

      type="text" 

      placeholder="Rechercher un talent (Seniors, U18, Vétérans...)"

      className="w-full bg-navy border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white font-medium outline-none focus:border-gold/30 transition shadow-2xl"

      value={searchTerm}

      onChange={(e) => setSearchTerm(e.target.value)}

     />

    </div>

 

    {/* Stats Counter */}

    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/60 px-2">

     <div className="flex items-center gap-2">

      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />

      {filteredPlayers.length} Joueurs Disponibles

     </div>

     {Object.keys(conflicts).length > 0 && (

      <div className="flex items-center gap-2 text-rose-400">

       <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />

       {Object.keys(conflicts).length} Conflits Détectés

      </div>

     )}

    </div>

 

    {/* Grid of Players */}

    <div className="grid md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">

     {filteredPlayers.map((p) => {

      const conflict = conflicts[p.id];

      const isSelected = false; // logic would be handled by common form state if needed

 

      return (

       <label 

        key={p.id} 

        className={`relative glass-card p-4 border transition cursor-pointer group hover:scale-[1.02] active:scale-[0.96] ${

         conflict 

           ? 'border-rose-500/30 bg-rose-500/[0.02] hover:bg-rose-500/[0.05]' 

           : 'border-white/5 bg-white/[0.02] hover:border-gold/30'

        }`}

       >

        <div className="flex items-start justify-between">

         <div className="flex gap-4">

          <div className="relative">

           <input 

            type="checkbox" 

            name="players" 

            value={p.id} 

            className="w-6 h-6 rounded-lg bg-navy border-white/10 text-gold focus:ring-gold transition cursor-pointer"

           />

           {conflict && (

            <div className="absolute -top-2 -right-2 text-rose-500 bg-navy rounded-full p-0.5">

             <ShieldAlert size={14} fill="currentColor" className="text-navy" />

            </div>

           )}

          </div>

          

          <div className="space-y-1">

           <div className="text-sm font-bold text-white group-hover:text-gold transition-colors flex items-center gap-2">

            {p.prenom} {p.nom}

            {p.merit.isTopPerformer && (

             <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_rgba(214,158,46,0.5)]" />

            )}

           </div>

           <div className="text-[10px] font-black uppercase tracking-wider flex items-center gap-2">

            <span className="text-white/60">{p.equipe_nom}</span>

            <span className="w-1 h-3 bg-white/20 rounded-full" />

            <span className={p.merit.isTopPerformer ? 'text-gold' : 'text-blue-400/70'}>

             {p.poste}

            </span>

           </div>

          </div>

         </div>

 

         <div className="text-right">

          <div className={`text-sm font-black ${p.merit.isTopPerformer ? 'text-gold' : 'text-white/70'}`}>

           {p.merit.merit}%

          </div>

          <div className="text-[8px] font-black uppercase tracking-tighter text-foreground/50">

           Synergy Index

          </div>

         </div>

        </div>

 

        {/* Conflict Detail Overlay */}

        {conflict && (

         <div className="mt-3 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center gap-2 animate-in fade-in zoom-in duration-300">

          <AlertTriangle size={12} className="text-rose-400" />

          <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wide">

           Déjà convoqué : {conflict.titre} ({conflict.equipe_nom})

          </span>

         </div>

        )}

 

        {/* Merit Bar */}

        <div className="mt-4 flex gap-1 items-end h-1 overflow-hidden rounded-full bg-white/5">

         <div 

          className={`h-full transition duration-1000 ${p.merit.isTopPerformer ? 'bg-gold shadow-[0_0_10px_#d69e2e]' : 'bg-blue-500'}`}

          style={{ width: `${p.merit.merit}%` }}

         />

        </div>

       </label>

      );

     })}

    </div>

   </div>

  );

 }

 
