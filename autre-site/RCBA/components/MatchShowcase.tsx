"use client";

import React, { useState } from "react";
import Link from "next/link";
import * as motion from "framer-motion/client";
import { Calendar, MapPin, Trophy, Clock, ChevronRight, Activity, Shield } from "lucide-react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface Match {
  id: number;
  date: string;
  heure: string;
  equipe_nom: string;
  adversaire: string;
  lieu: string;
  statut?: string;
  score_equipe?: number;
  score_adversaire?: number;
}

interface MatchShowcaseProps {
  upcomingMatches: Match[];
  recentResults: Match[];
}

export default function MatchShowcase({ upcomingMatches, recentResults }: MatchShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "recent">("upcoming");

  const matchesToShow = activeTab === "upcoming" ? upcomingMatches : recentResults;
  const mainMatch = matchesToShow[0];
  const otherMatches = matchesToShow.slice(1, 4);

  return (
    <section className="w-full max-w-6xl mx-auto mt-24 mb-16 px-4">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Activity size={16} className="text-pitch-green animate-pulse" />
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-pitch-green">Terrain & Compétition</div>
          </div>
          <h2 className="athletic-title text-4xl italic drop-shadow-md">
            L'ACTUALITÉ <span className="text-gold">SPORTIVE</span>
          </h2>
        </div>
        
        {/* Toggle Tabs */}
        <div className="flex bg-navy border-4 border-navy-deep shadow-[4px_4px_0_0_rgba(10,25,47,1)] relative overflow-hidden transform -skew-x-6">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`relative z-10 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "upcoming" ? "text-navy-deep bg-pitch-green" : "text-white hover:bg-white/10"
            }`}
          >
            <span className="block transform skew-x-6">À Venir</span>
          </button>
          <button
            onClick={() => setActiveTab("recent")}
            className={`relative z-10 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === "recent" ? "text-navy-deep bg-pitch-green" : "text-white hover:bg-white/10"
            }`}
          >
            <span className="block transform skew-x-6">Derniers Résultats</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Featured Match */}
        {mainMatch ? (
          <div className="lg:col-span-7 group bg-navy border-4 border-pitch-green p-8 md:p-12 relative overflow-hidden shadow-[12px_12px_0_0_#145014] hover:translate-y-1 hover:translate-x-1 hover:shadow-[8px_8px_0_0_#145014] transition-all">
            <div className="absolute inset-0 bg-navy-deep/20 slash-overlay pointer-events-none" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <span className="bg-white border-2 border-navy-deep px-4 py-2 text-[10px] font-black uppercase tracking-widest text-navy-deep shadow-[2px_2px_0_0_rgba(10,25,47,1)] transform -skew-x-6">
                <span className="block transform skew-x-6">{mainMatch.equipe_nom}</span>
              </span>
              <span className="flex items-center gap-2 text-pitch-green text-xs font-black uppercase tracking-wider bg-navy-deep px-3 py-1 border border-pitch-green">
                <Calendar size={14} />
                {format(parseISO(mainMatch.date), "EEEE d MMMM yyyy", { locale: fr })}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 md:gap-8 relative z-10 my-10">
              {/* Home Team */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-white border-4 border-navy-deep flex items-center justify-center p-4 mb-4 shadow-[4px_4px_0_0_rgba(10,25,47,1)]">
                  <img src="/logo.png" alt="RCBA" className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300" />
                </div>
                <h3 className="athletic-title text-xl md:text-2xl text-center text-white bg-navy-deep px-3 py-1">RCBA</h3>
              </div>

              {/* VS or Score */}
              <div className="flex flex-col items-center justify-center px-4">
                {activeTab === "recent" && mainMatch.score_equipe !== undefined ? (
                  <div className="flex items-center gap-3 md:gap-6 tabular-nums">
                    <span className={`athletic-title text-4xl md:text-6xl ${mainMatch.score_equipe > (mainMatch.score_adversaire || 0) ? "text-pitch-green" : "text-white"}`}>{mainMatch.score_equipe}</span>
                    <span className="text-white/50 text-3xl">-</span>
                    <span className={`athletic-title text-4xl md:text-6xl ${mainMatch.score_adversaire && mainMatch.score_adversaire > (mainMatch.score_equipe || 0) ? "text-pitch-green" : "text-white"}`}>{mainMatch.score_adversaire}</span>
                  </div>
                ) : (
                  <div className="athletic-title text-3xl md:text-5xl italic text-white/50">VS</div>
                )}
                
                {activeTab === "upcoming" && (
                  <div className="mt-4 flex items-center gap-2 bg-navy-deep border-2 border-pitch-green px-4 py-1.5 text-pitch-green font-mono text-sm font-black transform -skew-x-6">
                    <Clock size={14} className="transform skew-x-6" />
                    <span className="transform skew-x-6">{mainMatch.heure || "À définir"}</span>
                  </div>
                )}
              </div>

              {/* Away Team */}
              <div className="flex flex-col items-center flex-1">
                <div className="w-20 h-20 md:w-28 md:h-28 bg-navy-deep border-4 border-white flex items-center justify-center p-4 mb-4 shadow-[4px_4px_0_0_#fff]">
                  <Shield size={40} className="text-white" />
                </div>
                <h3 className="athletic-title text-xl md:text-2xl text-center text-white bg-navy-deep px-3 py-1">{mainMatch.adversaire}</h3>
              </div>
            </div>

            <div className="flex justify-center relative z-10 pt-6 border-t-4 border-pitch-green border-dashed">
              <div className="flex items-center gap-3 text-white text-sm font-bold uppercase bg-navy-deep px-4 py-2 border-2 border-navy-deep shadow-[2px_2px_0_0_rgba(10,25,47,1)]">
                <MapPin size={16} className="text-pitch-green" />
                {mainMatch.lieu === 'DOMICILE' ? 'Stade de Bû / Abondant' : 'À l\'extérieur'}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-navy border-4 border-navy-deep flex items-center justify-center p-12">
            <p className="text-white font-bold uppercase tracking-widest">Aucun match {activeTab === "upcoming" ? "à venir" : "récent"} pour le moment.</p>
          </div>
        )}

        {/* Other Matches List */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white border-4 border-navy-deep p-6 h-full flex flex-col brutal-shadow">
            <h3 className="text-sm font-black uppercase tracking-widest text-navy mb-6 flex items-center gap-3 border-b-4 border-navy-deep pb-2">
              <Trophy size={18} className="text-pitch-green" /> 
              Autres rencontres
            </h3>
            
            <div className="flex flex-col gap-4 flex-1">
              {otherMatches.length > 0 ? (
                otherMatches.map((match) => (
                  <div key={match.id} className="group relative overflow-hidden bg-navy-light/10 hover:bg-navy-deep border-2 border-navy-deep hover:border-pitch-green p-4 transition-all cursor-pointer flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2 border-b-2 border-navy-deep/20 pb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-navy-deep group-hover:text-white bg-pitch-green px-2">{match.equipe_nom}</span>
                        <span className="text-xs font-bold text-navy group-hover:text-pitch-green">{format(parseISO(match.date), "dd/MM", { locale: fr })}</span>
                      </div>
                      
                      <div className="flex justify-between items-center gap-4">
                        <span className="text-navy-deep group-hover:text-white font-black uppercase text-sm truncate flex-1">
                          {match.lieu === 'DOMICILE' ? 'RCBA' : match.adversaire}
                        </span>
                        
                        {activeTab === "recent" && match.score_equipe !== undefined ? (
                          <div className="flex gap-2 items-center font-black tabular-nums bg-navy-deep text-white px-2 py-1">
                            <span className={match.lieu === 'DOMICILE' ? 'text-pitch-green' : 'text-white'}>
                              {match.lieu === 'DOMICILE' ? match.score_equipe : match.score_adversaire}
                            </span>
                            <span className="text-white/50">-</span>
                            <span className={match.lieu === 'EXTERIEUR' ? 'text-pitch-green' : 'text-white'}>
                              {match.lieu === 'EXTERIEUR' ? match.score_equipe : match.score_adversaire}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-mono font-bold text-white bg-navy px-2 py-1 border border-navy-deep">
                            {match.heure || "À déf."}
                          </span>
                        )}
                        
                        <span className="text-navy-deep group-hover:text-white font-black uppercase text-sm truncate flex-1 text-right">
                          {match.lieu === 'EXTERIEUR' ? 'RCBA' : match.adversaire}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-navy/50 font-bold uppercase text-sm py-10">
                  <Activity size={32} className="mb-4 opacity-50" />
                  Pas d'autres matchs à afficher.
                </div>
              )}
            </div>
            
            <Link 
              href="/club/actualites" 
              className="mt-6 w-full py-4 bg-navy text-white hover:bg-navy-deep border-4 border-navy-deep font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group shadow-[4px_4px_0_0_#145014] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#145014]"
            >
              Voir toutes les rencontres <ChevronRight size={18} className="text-pitch-green group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
