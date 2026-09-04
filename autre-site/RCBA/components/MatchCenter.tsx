'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Calendar, MapPin, Shield, Clock, ChevronRight } from 'lucide-react';

interface Match {
  id: number;
  equipe_nom: string;
  adversaire?: string;
  score?: string;
  statut?: string;
  date: string;
  domicile?: string;
  exterieur?: string;
  score_domicile?: number;
  score_exterieur?: number;
}

export default function MatchCenter({
  recentResults = [],
  upcomingMatches = []
}: {
  recentResults: Match[];
  upcomingMatches: Match[];
}) {
  const [activeTab, setActiveTab] = useState<'recents' | 'avenir'>('recents');

  const matchesToDisplay = activeTab === 'recents' ? recentResults : upcomingMatches;

  return (
    <div className="w-full max-w-6xl mx-auto mt-24 mb-16 relative z-10">
      <div className="text-center mb-12">
        <div className="label-overline mb-3">Live Score & Agendas</div>
        <h2 className="athletic-title text-4xl md:text-5xl italic">MATCH <span className="text-gold">CENTER</span></h2>
      </div>

      <div className="glass-card bg-navy-deep/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-3xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-pitch-green/5 pointer-events-none" />
        
        {/* Tabs */}
        <div className="flex items-center justify-center gap-4 mb-10 relative z-10">
          <button
            onClick={() => setActiveTab('recents')}
            className={`px-8 py-3 rounded-2xl font-black text-sm tracking-[0.2em] uppercase italic transition duration-500 active:scale-[0.96] ${
              activeTab === 'recents' 
                ? 'bg-gold text-navy-deep shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105' 
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            Derniers Résultats
          </button>
          <button
            onClick={() => setActiveTab('avenir')}
            className={`px-8 py-3 rounded-2xl font-black text-sm tracking-[0.2em] uppercase italic transition duration-500 active:scale-[0.96] ${
              activeTab === 'avenir' 
                ? 'bg-pitch-green text-navy-deep shadow-[0_0_20px_rgba(98,203,114,0.4)] scale-105' 
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
            }`}
          >
            Prochains Matchs
          </button>
        </div>

        {/* Content */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
            >
              {matchesToDisplay.length > 0 ? (
                matchesToDisplay.map((m, idx) => {
                  const isRecent = activeTab === 'recents';
                  const teamName = m.equipe_nom || 'RCBA';
                  const opponentName = m.adversaire || (m.domicile === 'RCBA' ? m.exterieur : m.domicile) || 'Adversaire';
                  const isHome = isRecent ? true : m.domicile === 'RCBA'; // Assuming RCBA is home if not specified in recent
                  const homeTeam = isHome ? teamName : opponentName;
                  const awayTeam = isHome ? opponentName : teamName;
                  
                  // Score logic
                  let homeScore = '-';
                  let awayScore = '-';
                  if (isRecent) {
                    if (m.score) {
                      const parts = m.score.split('-');
                      if (parts.length === 2) {
                        homeScore = isHome ? parts[0].trim() : parts[1].trim();
                        awayScore = isHome ? parts[1].trim() : parts[0].trim();
                      }
                    }
                  } else {
                    if (m.score_domicile !== null && m.score_domicile !== undefined) {
                      homeScore = String(m.score_domicile);
                    }
                    if (m.score_exterieur !== null && m.score_exterieur !== undefined) {
                      awayScore = String(m.score_exterieur);
                    }
                  }

                  // Win/Loss logic
                  let resultColor = 'text-white/40';
                  if (isRecent && homeScore !== '-' && awayScore !== '-') {
                    const h = parseInt(homeScore);
                    const a = parseInt(awayScore);
                    if (isHome) {
                      resultColor = h > a ? 'text-pitch-green' : h < a ? 'text-red-500' : 'text-gold';
                    } else {
                      resultColor = a > h ? 'text-pitch-green' : a < h ? 'text-red-500' : 'text-gold';
                    }
                  }

                  return (
                    <motion.div 
                      key={m.id || idx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                      className="group bg-white/[0.02] border border-white/5 hover:border-gold/30 hover:bg-white/[0.04] p-6 rounded-3xl transition duration-500 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/80">
                            {teamName}
                          </span>
                          <span className="text-[10px] uppercase text-gold/60 font-black tracking-widest italic flex items-center gap-1">
                            <Calendar size={10} /> {m.date}
                          </span>
                        </div>
                        {isRecent ? (
                          <div className={`text-[10px] font-black uppercase tracking-widest ${resultColor}`}>
                            Terminé
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-400">
                            <Clock size={10} /> À venir
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Home Team */}
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 mb-3 shadow-lg ${isHome ? 'bg-navy-deep border-gold text-gold' : 'bg-white/10 border-white/20 text-white/50'}`}>
                            {isHome ? <Shield size={24} /> : <div className="text-xl font-bold uppercase">{homeTeam.substring(0, 2)}</div>}
                          </div>
                          <span className="font-black text-sm uppercase tracking-wide text-center text-white/90 truncate w-full px-2">
                            {homeTeam}
                          </span>
                        </div>

                        {/* Score Board */}
                        <div className="flex-shrink-0 px-6">
                          <div className="flex items-center gap-3">
                            <span className={`text-4xl md:text-5xl font-display font-black tracking-tighter tabular-nums ${isRecent ? 'text-white drop-shadow-lg' : 'text-white/20'}`}>
                              {homeScore}
                            </span>
                            <span className="text-white/20 text-2xl font-light">-</span>
                            <span className={`text-4xl md:text-5xl font-display font-black tracking-tighter tabular-nums ${isRecent ? 'text-white drop-shadow-lg' : 'text-white/20'}`}>
                              {awayScore}
                            </span>
                          </div>
                        </div>

                        {/* Away Team */}
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 mb-3 shadow-lg ${!isHome ? 'bg-navy-deep border-gold text-gold' : 'bg-white/10 border-white/20 text-white/50'}`}>
                            {!isHome ? <Shield size={24} /> : <div className="text-xl font-bold uppercase">{awayTeam.substring(0, 2)}</div>}
                          </div>
                          <span className="font-black text-sm uppercase tracking-wide text-center text-white/90 truncate w-full px-2">
                            {awayTeam}
                          </span>
                        </div>
                      </div>

                      {/* Location or Details */}
                      <div className="mt-6 flex justify-center">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex items-center gap-1 group-hover:text-white/60 transition-colors">
                          <MapPin size={12} /> {isHome ? 'Stade Municipal Bû' : 'Extérieur'}
                        </div>
                      </div>

                      {/* Hover effect gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </motion.div>
                  );
                })
              ) : (
                <div className="col-span-2 py-20 flex flex-col items-center justify-center text-center opacity-50">
                  <Trophy size={48} className="mb-4 text-white/20" />
                  <p className="text-white/60 font-bold uppercase tracking-widest">Aucun match disponible pour le moment.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
