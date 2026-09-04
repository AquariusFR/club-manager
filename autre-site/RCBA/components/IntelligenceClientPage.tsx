'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  RefreshCcw, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  ChevronDown,
  Brain,
  Zap,
  Target,
  Command
} from 'lucide-react';
import { markIntelligenceAsReadAction, markAllIntelligenceAsReadAction, generateNewIntelligenceAction, getDetailedIntelligenceLogAction, getDetailedReconReportAction } from '@/lib/actions';
import HudCorners from './HudCorners';
import AgentCommandCenter from './AgentCommandCenter';
import { motion, AnimatePresence } from 'framer-motion';

interface IntelligenceClientPageProps {
  initialFeed: any[];
}

export default function IntelligenceClientPage({ initialFeed }: IntelligenceClientPageProps) {
  const [feed, setFeed] = useState(initialFeed);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);
  const [agentContext, setAgentContext] = useState('');

  const filters = [
    { id: 'all', label: 'TOUS LES VECTEURS', icon: Activity },
    { id: 'Tactique', label: 'TACTIQUE', icon: Target },
    { id: 'Physique', label: 'PHYSIQUE', icon: Zap },
    { id: 'Logistique', label: 'LOGISTIQUE', icon: Activity },
    { id: 'Scouting', label: 'SCOUTING', icon: Brain },
    { id: 'Mental', label: 'MENTAL', icon: Activity },
  ];

  const filteredFeed = feed.filter(item => {
    const matchesSearch = item.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.contenu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  async function handleRefresh() {
    setIsRefreshing(true);
    await generateNewIntelligenceAction();
    const newFeed = await getDetailedIntelligenceLogAction(50);
    setFeed(newFeed);
    setIsRefreshing(false);
  }

  async function handleMarkRead(id: number) {
    await markIntelligenceAsReadAction(id);
    setFeed(feed.map(f => f.id === id ? { ...f, lu: 1 } : f));
  }

  async function handleMarkAllRead() {
    await markAllIntelligenceAsReadAction();
    setFeed(feed.map(f => ({ ...f, lu: 1 })));
  }

  async function handleViewDetails(id: number) {
    setIsDetailLoading(true);
    const result = await getDetailedReconReportAction(id);
    if (result && !('error' in result)) {
      setSelectedItem(result);
    }
    setIsDetailLoading(false);
  }

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-rose-500 border-rose-500/20 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]';
      case 'warning':
        return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
      default:
        return 'text-pitch-green border-pitch-green/20 bg-pitch-green/5';
    }
  };

  return (
    <div className="space-y-12">
      {/* ══════════════════════════════════════════
          RECON CONTROL PANEL
      ══════════════════════════════════════════ */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 glass-card p-8 border-white/5 bg-white/[0.01] relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl hud-scanline">
          <HudCorners opacity={0.1} />
          
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gold/40" size={20} />
            <input 
              type="text" 
              placeholder="RECHERCHER DANS LA MATRICE D'INTELLIGENCE..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white placeholder:text-white/20 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-gold/30 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest italic transition hover:bg-white/10 active:scale-95 shadow-xl"
            >
              <ShieldCheck size={16} className="text-gold" />
              TOUT MARQUER LU
            </button>
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center justify-center gap-4 px-10 py-5 bg-gold text-navy-deep rounded-2xl font-black text-sm uppercase tracking-[0.2em] italic transition hover:bg-gold-bright hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none group shadow-xl ${isRefreshing ? 'animate-pulse' : ''}`}
            >
              <RefreshCcw size={18} className={`${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
              {isRefreshing ? 'SYNCHRONISATION...' : 'LANCER RECONNAISSANCE'}
            </button>
          </div>
        </div>

        <div className="glass-card p-8 border-gold/10 bg-gold/[0.01] flex flex-col justify-center items-center text-center relative overflow-hidden group shadow-2xl">
          <HudCorners color="#d4af37" opacity={0.1} />
          <div className="text-[9px] font-black text-gold/60 uppercase tracking-[0.4em] mb-2 italic">STATUS AGENTIQUE</div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-pitch-green animate-pulse shadow-glow" />
            <span className="text-xl font-black text-white italic athletic-title athletic-skew tracking-tight">SIRCHMUNK ACTIVE</span>
          </div>
          <button 
            onClick={() => {
              setAgentContext('');
              setIsAgentPanelOpen(true);
            }}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black text-white uppercase tracking-widest hover:bg-gold hover:text-navy-deep transition shadow-lg group/btn"
          >
            <Command size={14} className="text-gold group-hover/btn:text-navy-deep group-hover/btn:animate-spin" />
            COMMAND CENTER
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VECTOR FILTERS
      ══════════════════════════════════════════ */}
      <section className="flex flex-wrap items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-[2.5rem] shadow-xl overflow-x-auto no-scrollbar">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition whitespace-nowrap border ${
              activeFilter === filter.id 
                ? 'bg-gold text-navy-deep border-gold shadow-gold' 
                : 'bg-white/[0.03] text-white/40 border-white/10 hover:border-gold/30 hover:text-white/60'
            }`}
          >
            <filter.icon size={14} />
            {filter.label}
          </button>
        ))}
      </section>

      {/* ══════════════════════════════════════════
          INTELLIGENCE FEED
      ══════════════════════════════════════════ */}
      <section className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredFeed.length > 0 ? (
            filteredFeed.map((item, i) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                key={item.id} 
                className={`glass-card border-white/5 bg-white/[0.01] overflow-hidden group hover:bg-white/[0.03] transition relative ${item.lu === 0 ? 'before:absolute before:left-0 before:top-0 before:w-1.5 before:h-full before:bg-gold before:z-10 before:shadow-[0_0_20px_#d4af37]' : ''}`}
              >
                <div className="p-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className={`text-[9px] font-black px-4 py-2 rounded-xl border uppercase tracking-[0.3em] italic ${getSeverityStyles(item.gravite)}`}>
                        {item.type}
                      </span>
                      <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl">
                        <Cpu size={12} className="text-gold/60" />
                        <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">{item.source}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em] italic">VECTEUR IDENTIFIÉ LE</span>
                        <span className="text-[10px] font-black text-gold italic uppercase tracking-widest">
                          {new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} — {new Date(item.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      
                      {item.lu === 0 && (
                        <button 
                          onClick={() => handleMarkRead(item.id)}
                          className="p-3 bg-gold/10 border border-gold/20 rounded-xl text-gold hover:bg-gold hover:text-navy-deep transition group/eye"
                        >
                          <Eye size={20} className="group-hover/eye:scale-110 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 space-y-4">
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-gold transition-colors italic leading-none athletic-title athletic-skew">
                        {item.titre}
                      </h4>
                      <p className="text-lg text-white/50 font-medium leading-relaxed group-hover:text-white/80 transition-colors">
                        {item.contenu}
                      </p>
                    </div>

                    <div className="lg:w-80 flex flex-col gap-4">
                      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex flex-col items-center justify-center text-center group/side overflow-hidden relative">
                         <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover/side:opacity-100 transition-opacity" />
                         <span className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2 italic relative z-10">INDICE DE GRAVITÉ</span>
                         <div className={`text-4xl font-black italic relative z-10 athletic-title athletic-skew ${
                           item.gravite === 'critical' ? 'text-rose-500' : 
                           item.gravite === 'warning' ? 'text-amber-500' : 
                           'text-pitch-green'
                         }`}>
                           {item.gravite === 'critical' ? '0xFF' : item.gravite === 'warning' ? '0xAA' : '0x00'}
                         </div>
                      </div>
                      
                      <button 
                        onClick={() => handleViewDetails(item.id)}
                        className="flex items-center justify-between w-full p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:bg-gold/10 hover:border-gold/40 transition group/more"
                      >
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] italic group-hover/more:text-gold transition-colors">VOIR LE RAPPORT COMPLET</span>
                        <ArrowRight size={16} className="text-gold group-hover/more:translate-x-2 transition-transform" />
                      </button>

                      <button 
                        onClick={() => {
                          setAgentContext(`Rapport d'Intelligence: ${item.titre}\nContenu: ${item.contenu}\nType: ${item.type}\nSévérité: ${item.gravite}`);
                          setIsAgentPanelOpen(true);
                        }}
                        className="flex items-center justify-between w-full p-6 bg-gold/10 border border-gold/20 rounded-[2rem] hover:bg-gold hover:text-navy-deep transition group/analyze"
                      >
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">ANALYSER AVEC L'IA</span>
                        <Zap size={16} className="text-gold group-hover/analyze:text-navy-deep transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* HUD scanline effect for critical */}
                {item.gravite === 'critical' && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                    <div className="w-full h-1 bg-rose-500 animate-scanline" />
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card border-white/5 bg-white/[0.01] p-32 text-center rounded-[4rem] border-dashed"
            >
              <Brain className="mx-auto text-white/20 mb-8" size={80} />
              <h3 className="text-2xl font-black text-white/40 uppercase tracking-[0.5em] italic mb-4">MATRICE VIDE</h3>
              <p className="text-sm text-white/20 font-medium uppercase tracking-[0.2em]">
                Aucun vecteur d'intelligence ne correspond à vos paramètres de recherche.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ══════════════════════════════════════════
          AGENT COMMAND CENTER OVERLAY
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {isAgentPanelOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAgentPanelOpen(false)}
              className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl h-full shadow-2xl"
            >
              <AgentCommandCenter 
                initialContext={agentContext}
                onClose={() => setIsAgentPanelOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ══════════════════════════════════════════
          DETAIL OVERLAY
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-navy-deep/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl glass-card border-white/10 bg-white/[0.02] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <HudCorners opacity={0.2} color="#d4af37" />
              
              <div className="p-12 space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black px-4 py-2 rounded-xl border uppercase tracking-[0.3em] italic ${getSeverityStyles(selectedItem.gravite)}`}>
                        {selectedItem.type}
                      </span>
                      <span className="text-[10px] font-mono text-gold/60 uppercase tracking-widest">{selectedItem.source}</span>
                    </div>
                    <h2 className="text-5xl font-black text-white uppercase italic leading-none athletic-title athletic-skew tracking-tighter">
                      RAPPORT: {selectedItem.titre}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition"
                  >
                    <ChevronDown size={24} className="rotate-90" />
                  </button>
                </div>

                <div className="p-8 bg-white/[0.03] border border-white/5 rounded-3xl">
                  <p className="text-xl text-white/80 font-medium leading-relaxed italic">
                    "{selectedItem.contenu}"
                  </p>
                </div>

                {selectedItem.details && (
                  <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-gold uppercase tracking-[0.5em] italic flex items-center gap-4">
                      <div className="h-px flex-1 bg-gold/20" />
                      DONNÉES BRUTES EXTRAITES (MIRRORING)
                      <div className="h-px flex-1 bg-gold/20" />
                    </h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedItem.details.map((detail: any, idx: number) => (
                        <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center group/item hover:bg-white/5 transition">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-white uppercase tracking-widest">
                              {detail.nom || (detail.prenom ? `${detail.prenom} ${detail.nom}` : null) || detail.coach_name || detail.type}
                            </span>
                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-tighter">
                              {detail.quantite !== undefined ? `STOCK: ${detail.quantite}/${detail.seuil_alerte}` : 
                               detail.certificat_medical_date ? `EXPIRATION CERTIFICAT: ${detail.certificat_medical_date}` :
                               detail.reason ? `SUBSTITUTION: ${detail.reason}` : 
                               detail.status && detail.due_date ? `MAINTENANCE: ${detail.status} - ÉCHÉANCE: ${detail.due_date}` :
                               detail.sdi_score !== undefined ? `INDICE SDI: ${detail.sdi_score.toFixed(1)} — DOULEUR: ${detail.pain_level}/5 (${detail.pain_location || 'N/A'})` : ''}
                            </span>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            (detail.quantite === 0 || detail.status === 'CRITICAL' || (detail.sdi_score !== undefined && detail.sdi_score < 2)) 
                              ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' 
                              : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                          }`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-8 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Brain size={20} className="text-gold" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">AGENT RESPONSABLE</span>
                      <span className="text-[10px] font-black text-white uppercase tracking-widest italic">SIRCHMUNK RECON v1.0</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setSelectedItem(null)}
                      className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest italic transition hover:bg-white/10"
                    >
                      FERMER
                    </button>
                    {selectedItem.lu === 0 && (
                      <button 
                        onClick={() => {
                          handleMarkRead(selectedItem.id);
                          setSelectedItem(null);
                        }}
                        className="px-10 py-5 bg-gold text-navy-deep rounded-2xl font-black text-sm uppercase tracking-widest italic transition hover:bg-gold-bright"
                      >
                        MARQUER COMME TRAITÉ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
