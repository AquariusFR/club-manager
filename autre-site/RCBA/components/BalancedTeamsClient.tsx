"use client";

import { useState, useMemo } from "react";
import { Users, ArrowRightLeft, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MagneticWrapper from "./MagneticWrapper";

interface PlayerWithMerit {
  id: number;
  nom: string;
  prenom: string;
  poste: string;
  meritData: {
    score: number;
    status: string;
  };
}

export default function BalancedTeamsClient({ players }: { players: PlayerWithMerit[] }) {
  const [teamA, setTeamA] = useState<PlayerWithMerit[]>([]);
  const [teamB, setTeamB] = useState<PlayerWithMerit[]>([]);
  const [shuffling, setShuffling] = useState(false);

  const generateBalancedTeams = () => {
    setShuffling(true);
    
    // Sort by merit score
    const sorted = [...players].sort((a, b) => b.meritData.score - a.meritData.score);
    
    const a: PlayerWithMerit[] = [];
    const b: PlayerWithMerit[] = [];
    
    // Snake distribution
    sorted.forEach((player, index) => {
      // Index: 0, 1, 2, 3, 4, 5...
      // Pattern: A, B, B, A, A, B, B, A...
      const cycle = Math.floor(index / 2) % 2;
      const isEven = index % 2 === 0;
      
      if (cycle === 0) {
        if (isEven) a.push(player);
        else b.push(player);
      } else {
        if (isEven) b.push(player);
        else a.push(player);
      }
    });
    
    setTimeout(() => {
      setTeamA(a);
      setTeamB(b);
      setShuffling(false);
    }, 600);
  };

  const swapPlayer = (playerId: number, from: 'A' | 'B') => {
    if (from === 'A') {
      const player = teamA.find(p => p.id === playerId);
      if (player) {
        setTeamA(teamA.filter(p => p.id !== playerId));
        setTeamB([...teamB, player]);
      }
    } else {
      const player = teamB.find(p => p.id === playerId);
      if (player) {
        setTeamB(teamB.filter(p => p.id !== playerId));
        setTeamA([...teamA, player]);
      }
    }
  };

  const teamAScore = useMemo(() => 
    teamA.reduce((acc, p) => acc + p.meritData.score, 0) / (teamA.length || 1), 
  [teamA]);
  
  const teamBScore = useMemo(() => 
    teamB.reduce((acc, p) => acc + p.meritData.score, 0) / (teamB.length || 1), 
  [teamB]);

  const balanceGap = Math.abs(teamAScore - teamBScore).toFixed(1);

  if (teamA.length === 0 && teamB.length === 0 && !shuffling) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
        <Users size={48} className="text-white/10 mb-6" />
        <h3 className="text-xl font-bold text-white mb-2 italic uppercase tracking-widest">Équilibrage Tactique</h3>
        <p className="text-white/40 text-sm mb-8 text-center max-w-md uppercase tracking-wider italic">
          Générez deux équipes équilibrées basées sur les performances actuelles, le SDI et le mérite des joueurs.
        </p>
        <MagneticWrapper>
          <button 
            onClick={generateBalancedTeams}
            className="flex items-center gap-3 px-10 py-5 bg-pitch-green text-navy-deep rounded-2xl font-black uppercase tracking-[0.3em] italic hover:scale-105 transition-transform"
          >
            <RefreshCw size={20} className={shuffling ? "animate-spin" : ""} />
            Générer les Équipes
          </button>
        </MagneticWrapper>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* HEADER STATS */}
      <div className="flex flex-wrap justify-center gap-4">
        <div className="px-6 py-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-pitch-green flex items-center justify-center text-navy-deep text-[10px] font-black italic">A</div>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-black italic">B</div>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="text-[10px] font-black uppercase tracking-widest italic text-white/40">
            Écart d&apos;équilibre: <span className={parseFloat(balanceGap) < 5 ? "text-pitch-green" : "text-orange-400"}>{balanceGap}%</span>
          </div>
        </div>
        
        <MagneticWrapper>
          <button 
            onClick={generateBalancedTeams}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 transition"
          >
            <RefreshCw size={14} className={shuffling ? "animate-spin" : ""} />
            Régénérer
          </button>
        </MagneticWrapper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* TEAM A */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-4">
            <div>
              <h4 className="text-pitch-green font-black italic uppercase tracking-[0.2em] text-sm">Équipe Verte</h4>
              <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Puissance: {teamAScore.toFixed(0)}%</p>
            </div>
            <span className="text-white/10 text-4xl font-black italic tracking-tighter">A</span>
          </div>

          <div className="space-y-2 bg-pitch-green/[0.03] p-4 rounded-[2rem] border border-pitch-green/10 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {teamA.map((player) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-pitch-green/20 border border-pitch-green/30 flex items-center justify-center text-pitch-green font-black italic text-sm">
                      {player.prenom[0]}{player.nom[0]}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm uppercase italic tracking-tight">{player.prenom} {player.nom}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">{player.poste}</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-pitch-green/60 italic">{player.meritData.score}%</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => swapPlayer(player.id, 'A')}
                    className="p-2 text-white/10 group-hover:text-pitch-green transition-colors"
                    title="Envoyer vers équipe B"
                  >
                    <ArrowRightLeft size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* TEAM B */}
        <div className="space-y-4">
          <div className="flex justify-between items-end px-4">
            <div>
              <h4 className="text-blue-400 font-black italic uppercase tracking-[0.2em] text-sm">Équipe Bleue</h4>
              <p className="text-white/20 text-[10px] uppercase tracking-widest font-bold">Puissance: {teamBScore.toFixed(0)}%</p>
            </div>
            <span className="text-white/10 text-4xl font-black italic tracking-tighter">B</span>
          </div>

          <div className="space-y-2 bg-blue-400/[0.03] p-4 rounded-[2rem] border border-blue-400/10 min-h-[400px]">
            <AnimatePresence mode="popLayout">
              {teamB.map((player) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.06] transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-400/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-black italic text-sm">
                      {player.prenom[0]}{player.nom[0]}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm uppercase italic tracking-tight">{player.prenom} {player.nom}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30 italic">{player.poste}</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-400/60 italic">{player.meritData.score}%</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => swapPlayer(player.id, 'B')}
                    className="p-2 text-white/10 group-hover:text-blue-400 transition-colors"
                    title="Envoyer vers équipe A"
                  >
                    <ArrowRightLeft size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
