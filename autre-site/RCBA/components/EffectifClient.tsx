'use client';

import { useState, useMemo, Fragment } from 'react';
import { Search, Filter, Users, Activity, Shield, Target, ArrowUpDown, ChevronRight, LayoutGrid, Table2 } from 'lucide-react';
import HudCorners from './HudCorners';
import MagneticWrapper from './MagneticWrapper';
import { MotionSection } from './DashboardClientWrapper';
import Link from 'next/link';
import PlayerPosterCard from './PlayerPosterCard';

interface Player {
  id: number;
  nom: string;
  prenom: string;
  equipe_nom: string;
  poste: string;
  sdi_score: number;
  photo_url?: string;
  licence_status?: string;
  meritData: {
    score: number;
    status: string;
    color: string;
  };
  combatGrade?: {
    grade: string;
    color: string;
  };
  buts?: number;
  passes?: number;
  matchs_joues?: number;
  indisponibilite_type?: string;
}

interface EffectifClientProps {
  initialPlayers: Player[];
  teams: string[];
}

export default function EffectifClient({ initialPlayers, teams }: EffectifClientProps) {
  const [search, setSearch] = useState('');
  const [filterTeam, setFilterTeam] = useState('ALL');
  const [sortBy, setSortBy] = useState<'nom' | 'sdi' | 'merit'>('nom');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredPlayers = useMemo(() => {
    return initialPlayers
      .filter(p => {
        const matchesSearch = `${p.prenom} ${p.nom}`.toLowerCase().includes(search.toLowerCase());
        const matchesTeam = filterTeam === 'ALL' || p.equipe_nom === filterTeam;
        return matchesSearch && matchesTeam;
      })
      .sort((a, b) => {
        let valA, valB;
        if (sortBy === 'nom') {
          valA = a.nom;
          valB = b.nom;
        } else if (sortBy === 'sdi') {
          valA = a.sdi_score || 0;
          valB = b.sdi_score || 0;
        } else {
          valA = a.meritData.score;
          valB = b.meritData.score;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [initialPlayers, search, filterTeam, sortBy, sortOrder]);

  const positionsOrder = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant', 'Non défini'];

  const groupedPlayers = useMemo(() => {
    const groups: Record<string, Player[]> = {};
    filteredPlayers.forEach(p => {
      const poste = p.poste || 'Non défini';
      if (!groups[poste]) groups[poste] = [];
      groups[poste].push(p);
    });
    return groups;
  }, [filteredPlayers]);

  const toggleSort = (key: 'nom' | 'sdi' | 'merit') => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-10">
      {/* 🛠️ Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
         <div className="relative group w-full md:max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-gold transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="RECHERCHER UN JOUEUR..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-[11px] font-black uppercase tracking-[0.3em] focus:border-gold/50 focus:ring-4 focus:ring-gold/5 outline-none transition placeholder:text-white/20 text-white backdrop-blur-md italic hud-scanline"
            />
         </div>

         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative group">
              <select 
                value={filterTeam}
                onChange={(e) => setFilterTeam(e.target.value)}
                className="appearance-none bg-white/5 border border-white/10 rounded-2xl px-8 py-5 pr-12 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition italic outline-none cursor-pointer"
              >
                <option value="ALL">Toutes les équipes</option>
                {teams.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
            </div>

            <MagneticWrapper>
              <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 bg-gold text-navy-deep rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold-bright transition italic shadow-luminous">
                 <Users size={16} /> Nouveau Joueur
              </button>
            </MagneticWrapper>
         </div>

         {/* View toggle */}
         <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
           <button
             onClick={() => setViewMode('table')}
             className={`p-2.5 rounded-lg transition-all ${
               viewMode === 'table'
                 ? 'bg-gold text-navy-deep shadow-luminous'
                 : 'text-white/40 hover:text-white'
             }`}
             title="Vue tableau"
           >
             <Table2 size={16} />
           </button>
           <button
             onClick={() => setViewMode('cards')}
             className={`p-2.5 rounded-lg transition-all ${
               viewMode === 'cards'
                 ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                 : 'text-white/40 hover:text-white'
             }`}
             title="Vue cartes poster"
           >
             <LayoutGrid size={16} />
           </button>
         </div>
      </div>

      {/* === CARDS VIEW === */}
      {viewMode === 'cards' && (
        <MotionSection>
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-20 text-white/30 font-black uppercase tracking-widest text-sm">
              Aucun joueur trouvé
            </div>
          ) : (
            (() => {
              const prenomCounts: Record<string, number> = {};
              filteredPlayers.forEach(p => {
                if (p.prenom) {
                  const lower = p.prenom.trim().toLowerCase();
                  prenomCounts[lower] = (prenomCounts[lower] || 0) + 1;
                }
              });

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
                  {filteredPlayers.map((p, i) => {
                    let dName = p.prenom;
                    if (p.prenom) {
                      const lower = p.prenom.trim().toLowerCase();
                      if (prenomCounts[lower] > 1 && p.nom) {
                        dName = `${p.prenom} ${p.nom[0]}.`;
                      }
                    } else {
                      dName = p.nom || "JOUEUR";
                    }

                    return (
                      <Link key={p.id} href={`/coach/joueur/${p.id}`} className="block">
                        <PlayerPosterCard player={p} index={i} displayName={dName} />
                      </Link>
                    );
                  })}
                </div>
              );
            })()
          )}
        </MotionSection>
      )}

      {/* === TABLE VIEW === */}
      {viewMode === 'table' && (
        <div className="-mx-4 md:-mx-10 lg:-ml-10 glass-card-elevated border-white/5 bg-white/[0.01] rounded-2xl md:rounded-[3rem] overflow-hidden relative hud-scanline glass-edge-highlight w-full">
          <HudCorners color="#d4af37" opacity={0.1} size={40} />
          <div className="overflow-x-auto custom-scrollbar w-full">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-white/[0.03] border-b border-white/5">
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic">Grade</th>
                  <th 
                    className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic cursor-pointer hover:text-gold transition-colors"
                    onClick={() => toggleSort('nom')}
                  >
                    <div className="flex items-center gap-2">
                      Joueur <ArrowUpDown size={12} className="opacity-40" />
                    </div>
                  </th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic hidden xl:table-cell">Poste</th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic hidden xl:table-cell">Licence</th>
                  <th 
                    className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic text-center cursor-pointer hover:text-gold transition-colors"
                    onClick={() => toggleSort('sdi')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      SDI <ArrowUpDown size={12} className="opacity-40" />
                    </div>
                  </th>
                  <th 
                    className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic text-center cursor-pointer hover:text-gold transition-colors"
                    onClick={() => toggleSort('merit')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Mérite <ArrowUpDown size={12} className="opacity-40" />
                    </div>
                  </th>
                  <th 
                    className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic text-center cursor-pointer hover:text-gold transition-colors hidden lg:table-cell"
                  >
                    Matchs
                  </th>
                  <th 
                    className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic text-center cursor-pointer hover:text-gold transition-colors hidden lg:table-cell"
                  >
                    Buts / Passes
                  </th>
                  <th className="px-10 py-6 text-[10px] uppercase font-black tracking-[0.3em] text-gold/60 italic text-right">Fiche</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filteredPlayers.length > 0 ? (
                  positionsOrder.map(poste => {
                    const playersInPoste = groupedPlayers[poste] || [];
                    if (playersInPoste.length === 0) return null;
                    return (
                      <Fragment key={poste}>
                        <tr className="bg-white/[0.02] border-y border-white/5">
                          <td colSpan={9} className="px-10 py-4 text-[12px] font-black uppercase tracking-[0.4em] text-gold/80 italic shadow-inner">
                            <div className="flex items-center gap-3">
                              <Target size={14} className="text-gold/50" />
                              {poste} <span className="text-[9px] text-white/30 ml-2">({playersInPoste.length})</span>
                            </div>
                          </td>
                        </tr>
                        {playersInPoste.map((player) => {
                          const sdiColor = player.sdi_score > 70 ? 'text-pitch-green' : player.sdi_score > 40 ? 'text-orange-400' : 'text-red-500';
                          
                          return (
                            <tr key={player.id} className="group hover:bg-gold/[0.02] transition duration-500">
                              <td className="px-10 py-8">
                                <div className={`text-3xl ${player.combatGrade?.color || 'text-white/40'} font-black italic drop-shadow-glow group-hover:scale-110 transition-transform duration-500`}>
                                  {player.combatGrade?.grade || 'N/A'}
                                </div>
                              </td>
                              <td className="px-10 py-8">
                                <div className="flex items-center gap-6">
                                  <div className="w-14 h-14 rounded-2xl bg-navy-light border border-white/10 flex items-center justify-center text-gold font-black text-lg shadow-xl relative overflow-hidden group-hover:border-gold/30 transition">
                                    {player.photo_url && !player.photo_url.includes('ui-avatars.com') ? (
                                      <img src={player.photo_url.startsWith('http') || player.photo_url.startsWith('/') || player.photo_url.startsWith('data:') ? player.photo_url : `/images/profiles/${player.photo_url}`} alt={`${player.prenom} ${player.nom}`} className="w-full h-full object-cover" />
                                    ) : (
                                      <>
                                        {player.nom[0]}{player.prenom[0]}
                                      </>
                                    )}
                                    <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                                  <div>
                                    <div className="text-white font-black tracking-tight text-lg group-hover:text-gold transition-colors italic uppercase leading-none flex items-center gap-2">
                                      {player.prenom} {player.nom}
                                      {player.indisponibilite_type && (
                                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-500 border border-red-500/30 text-[8px] tracking-widest capitalize">
                                          {player.indisponibilite_type}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em] mt-2 italic flex items-center gap-2">
                                      <span className="w-2 h-[1px] bg-gold/30" />
                                      {player.equipe_nom}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-10 py-8 hidden xl:table-cell">
                                <div className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-white/60 uppercase tracking-widest italic w-fit">
                                  {player.poste || 'NON DÉFINI'}
                                </div>
                              </td>
                              <td className="px-10 py-8 hidden xl:table-cell">
                                <div className={`px-4 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest italic w-fit ${
                                  player.licence_status === 'Validée' ? 'bg-pitch-green/10 text-pitch-green border-pitch-green/20' : 
                                  player.licence_status === 'En attente' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                                  'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                  {player.licence_status || 'NON RENSEIGNÉE'}
                                </div>
                              </td>
                              <td className="px-10 py-8 text-center">
                                {player.sdi_score ? (
                                  <div className="flex flex-col items-center gap-1">
                                    <span className={`text-2xl font-black italic drop-shadow-glow ${sdiColor}`}>{player.sdi_score}</span>
                                    <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden">
                                      <div className={`h-full ${sdiColor.replace('text-', 'bg-')} transition`} style={{ width: `${player.sdi_score}%` }} />
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-white/20 font-black italic uppercase tracking-widest">N/A</span>
                                )}
                              </td>
                              <td className="px-10 py-8 text-center">
                                <div className="flex flex-col items-center">
                                  <span className="text-xl font-black text-white italic drop-shadow-glow">{player.meritData.score}%</span>
                                  <span className="text-[8px] text-white/40 uppercase tracking-tighter mt-1 italic">{player.meritData.status}</span>
                                </div>
                              </td>
                              <td className="px-10 py-8 text-center hidden lg:table-cell">
                                <span className="text-xl font-black text-white italic">{player.matchs_joues || 0}</span>
                              </td>
                              <td className="px-10 py-8 text-center hidden lg:table-cell">
                                <div className="flex items-center justify-center gap-3">
                                  <span className="text-lg font-black text-pitch-green italic">{player.buts || 0}</span>
                                  <span className="text-white/20">/</span>
                                  <span className="text-lg font-black text-blue-400 italic">{player.passes || 0}</span>
                                </div>
                              </td>
                              <td className="px-10 py-8 text-right">
                                <MagneticWrapper>
                                  <Link href={`/coach/joueur/${player.id}`} className="p-4 bg-white/5 hover:bg-gold/10 rounded-2xl border border-white/10 hover:border-gold/30 text-white/40 hover:text-gold transition shadow-xl group/btn active:scale-90 inline-block">
                                    <Target size={20} className="group-hover/btn:scale-110 transition-transform" />
                                  </Link>
                                </MagneticWrapper>
                              </td>
                            </tr>
                          );
                        })}
                      </Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-10 py-20 text-center">
                       <div className="flex flex-col items-center gap-4 opacity-20">
                          <Search size={40} />
                          <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Aucun joueur trouvé</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* 📊 Quick Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: 'Effectif Total', value: filteredPlayers.length, icon: <Users className="text-blue-400" />, sub: 'Joueurs actifs' },
           { label: 'Moyenne SDI', value: Math.round(filteredPlayers.reduce((acc, p) => acc + (p.sdi_score || 0), 0) / (filteredPlayers.length || 1)), icon: <Activity className="text-pitch-green" />, sub: 'État de forme' },
           { label: 'Grade Moyen', value: 'B+', icon: <Shield className="text-gold" />, sub: 'Performance collective' }
         ].map((stat, i) => (
           <MotionSection key={i} delay={i * 0.1}>
             <div className="glass-card-elevated p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01] flex items-center gap-6 relative overflow-hidden group hover:bg-white/[0.03] transition h-full">
                <div className="w-16 h-16 rounded-2xl bg-navy-light border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-700">
                  {stat.icon}
                </div>
                <div>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic mb-1">{stat.label}</div>
                  <div className="text-4xl font-black text-white italic uppercase tracking-tighter athletic-title drop-shadow-glow">{stat.value}</div>
                  <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mt-1 italic">{stat.sub}</div>
                </div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[50px] rounded-full -mr-12 -mt-12 group-hover:bg-gold/10 transition duration-700" />
             </div>
           </MotionSection>
         ))}
      </div>
    </div>
  );
}
