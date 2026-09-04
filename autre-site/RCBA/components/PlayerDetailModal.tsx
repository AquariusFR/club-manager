'use client';

import { X, Activity, Heart, AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import PerformanceTrendsChart from './PerformanceTrendsChart';
import HudCorners from './HudCorners';
import { useState, useEffect } from 'react';

interface PlayerDetailModalProps {
  isOpen: boolean;
  player: {
    id: number;
    prenom: string;
    nom: string;
    equipe_nom: string;
  } | null;
  trends: any[];
  wellnessHistory?: any[];
}

export default function PlayerDetailModal({ isOpen, player, trends, wellnessHistory = [] }: PlayerDetailModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') as 'performance' | 'health') || 'performance';

  if (!player) return null;

  const onClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('playerDetail');
    params.delete('tab');
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Format SDI data for the chart
  const sdiTrends = wellnessHistory.map(w => ({
    day: w.date,
    avg_intensity: (w.sdi_score || 0) / 10, // Scale 0-100 to 0-10 for the stub chart
    avg_fatigue: 0 
  })).reverse();

  const avgIntensity = (trends.reduce((acc, curr) => acc + curr.avg_intensity, 0) / (trends.length || 1)).toFixed(1);
  const avgFatigue = (trends.reduce((acc, curr) => acc + curr.avg_fatigue, 0) / (trends.length || 1)).toFixed(1);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-card w-full max-w-6xl bg-slate-900/95 border-white/10 relative overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
          >
            <HudCorners opacity={0.1} />
            
            {/* Header */}
            <div className="p-6 lg:p-8 border-b border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex flex-col text-center lg:text-left">
                <h2 className="athletic-title athletic-skew text-3xl lg:text-4xl text-white uppercase tracking-tighter italic">
                  ANALYSE <span className="text-blue-500">{player.prenom} {player.nom}</span>
                </h2>
                <div className="flex items-center justify-center lg:justify-start gap-3 mt-1">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] italic">
                    {player.equipe_nom} • PROFIL ATHLÉTIQUE
                  </span>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="flex bg-white/5 p-1 rounded-full border border-white/10 shadow-inner">
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('tab', 'performance');
                    router.push(`?${params.toString()}`, { scroll: false });
                  }}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition flex items-center gap-2 ${activeTab === 'performance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-white/40 hover:text-white'}`}
                >
                  <Activity size={14} /> Performance
                </button>
                <button
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set('tab', 'health');
                    router.push(`?${params.toString()}`, { scroll: false });
                  }}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition flex items-center gap-2 ${activeTab === 'health' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-white/40 hover:text-white'}`}
                >
                  <Heart size={14} /> Santé
                </button>
              </div>
              
              <button 
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-500 rounded-full transition group hidden lg:block"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>
            
            {/* Content Area */}
            <div className="p-6 lg:p-8 overflow-y-auto custom-scrollbar flex-1 relative z-10">
              {activeTab === 'performance' ? (
                <div className="grid gap-8">
                  <div className="overflow-hidden rounded-3xl">
                    <PerformanceTrendsChart 
                      data={trends} 
                      title="HISTORIQUE DE CHARGE (RPE)" 
                      variant="gold" 
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <StatCard label="INTENSITÉ MOYENNE" value={avgIntensity} color="text-white" />
                    <StatCard label="FATIGUE MOYENNE" value={avgFatigue} color="text-gold" />
                    <StatCard label="LOGS RPE" value={trends.length} unit="jours" color="text-blue-400" />
                  </div>
                </div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left Column: SDI Chart and Stats */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="overflow-hidden rounded-3xl">
                      <PerformanceTrendsChart 
                        data={sdiTrends} 
                        title="TENDANCE BIOMÉTRIQUE (SDI %)" 
                        variant="pitch" 
                        labels={{ intensity: 'Score SDI' }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <SmallStatCard label="SLEEP" value={wellnessHistory[0]?.sleep_quality || '--'} max={5} />
                      <SmallStatCard label="ENERGY" value={wellnessHistory[0]?.energy_level || '--'} max={5} />
                      <SmallStatCard label="STRESS" value={wellnessHistory[0]?.stress_level || '--'} max={5} />
                      <SmallStatCard label="SDI SCORE" value={wellnessHistory[0] ? Math.round(wellnessHistory[0].sdi_score) : '--'} max={100} color="text-pitch-green" />
                    </div>
                  </div>
                  
                  {/* Right Column: Pain Alerts List */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic mb-2">DERNIÈRES ALERTES DOULEURS</h3>
                    <div className="space-y-3">
                      {wellnessHistory.filter(w => (w.pain_level || 0) >= 3).slice(0, 8).map((w, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 transition cursor-default"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl ${w.pain_level >= 4 ? 'bg-rose-500/20 text-rose-500' : 'bg-orange-500/20 text-orange-500'}`}>
                              <AlertCircle size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest italic">{w.pain_location || 'Général'}</span>
                              <span className="text-[10px] text-white/40 font-bold uppercase tracking-tight">
                                {new Date(w.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          </div>
                          <div className={`text-xl font-black italic athletic-title ${w.pain_level >= 4 ? 'text-rose-500' : 'text-orange-400'}`}>
                            LVL {w.pain_level}
                          </div>
                        </motion.div>
                      ))}
                      {wellnessHistory.filter(w => (w.pain_level || 0) >= 3).length === 0 && (
                        <div className="p-12 rounded-3xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center opacity-40">
                          <Heart size={32} className="mb-3 text-pitch-green" />
                          <span className="text-[10px] font-black uppercase tracking-widest italic text-center">Aucune alerte de douleur<br/>signalée récemment</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Status Bar */}
            <div className="p-4 bg-white/5 border-t border-white/10 flex items-center justify-between px-8">
               <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] italic">RCBA PERFORMANCE ANALYTICS ENGINE v2.1</span>
               <div className="flex items-center gap-4 opacity-30">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                 <span className="text-[9px] font-bold text-white uppercase tracking-widest italic">Live Data Sync</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function StatCard({ label, value, unit = '', color }: { label: string; value: string | number; unit?: string; color: string }) {
  return (
    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 text-center relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-2 italic">{label}</span>
      <div className={`text-4xl font-black athletic-title italic ${color}`}>
        {value} {unit && <span className="text-sm uppercase opacity-40 ml-1">{unit}</span>}
      </div>
      <HudCorners opacity={0.05} />
    </div>
  );
}

function SmallStatCard({ label, value, max, color = 'text-white' }: { label: string; value: number | string; max: number; color?: string }) {
  return (
    <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center justify-center group hover:bg-white/10 transition">
      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-2 italic">{label}</span>
      <div className={`text-2xl font-black athletic-title italic ${color}`}>
        {value}<span className="text-[10px] opacity-20 ml-1 italic">/{max}</span>
      </div>
    </div>
  );
}
