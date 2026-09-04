import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, RefreshCcw } from 'lucide-react';
import HudCorners from './HudCorners';

interface IntelItem {
  id: number;
  type: string;
  source: string;
  titre: string;
  contenu: string;
  gravite: 'info' | 'warning' | 'critical';
  date: string;
}

interface AuraMatrixArchivesModalProps {
  showLogs: boolean;
  setShowLogs: (show: boolean) => void;
  logItems: IntelItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  logFilter: string;
  setLogFilter: (filter: string) => void;
  CATEGORIES: Array<{ id: string; label: string; icon: any; color: string }>;
}

export default function AuraMatrixArchivesModal({
  showLogs,
  setShowLogs,
  logItems,
  searchQuery,
  setSearchQuery,
  logFilter,
  setLogFilter,
  CATEGORIES
}: AuraMatrixArchivesModalProps) {
  const filteredLogs = logItems.filter(log => {
    const matchesSearch = log.titre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         log.contenu.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = logFilter === 'all' || log.type === logFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AnimatePresence>
      {showLogs && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-navy-deep/95 backdrop-blur-2xl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-5xl h-full md:h-[85vh] bg-navy-light/40 border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col shadow-2xl relative"
          >
            <HudCorners color="#d4af37" opacity={0.3} size={30} />
            
            <div className="p-6 md:p-8 border-b border-white/5 space-y-6 shrink-0 bg-navy-deep/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="text-gold" size={24} />
                  <h3 className="text-2xl font-black italic uppercase text-white athletic-title athletic-skew tracking-tight">Archives <span className="text-gold">Aura</span></h3>
                </div>
                <button 
                  onClick={() => setShowLogs(false)}
                  className="p-3 rounded-full hover:bg-white/10 transition text-white/40 hover:text-white"
                >
                  <RefreshCcw size={20} className="rotate-45" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                  <input 
                    type="text"
                    placeholder="RECHERCHER DANS LES ARCHIVES..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 transition uppercase"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                  <button 
                    onClick={() => setLogFilter('all')}
                    className={`px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest italic transition whitespace-nowrap ${logFilter === 'all' ? 'bg-gold text-navy-deep' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    Tous les domaines
                  </button>
                  {CATEGORIES.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setLogFilter(cat.id)}
                      className={`px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest italic transition whitespace-nowrap flex items-center gap-2 ${logFilter === cat.id ? 'bg-white/10 border-gold/50 text-gold' : 'bg-white/5 text-white/40 hover:bg-white/10 border-transparent'} border`}
                      style={{ color: logFilter === cat.id ? cat.color : undefined }}
                    >
                      <cat.icon size={12} />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar bg-navy-deep/20">
              <div className="space-y-4">
                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                  <div key={log.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-start justify-between gap-4 group hover:bg-white/[0.04] transition">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded border" style={{ color: CATEGORIES.find(c => c.id === log.type)?.color, borderColor: `${CATEGORIES.find(c => c.id === log.type)?.color}30`, backgroundColor: `${CATEGORIES.find(c => c.id === log.type)?.color}05` }}>
                          {log.type}
                        </span>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded border ${
                          log.gravite === 'critical' ? 'text-rose-500 border-rose-500/30 bg-rose-500/5' :
                          log.gravite === 'warning' ? 'text-gold border-gold/30 bg-gold/5' :
                          'text-blue-400 border-blue-400/30 bg-blue-400/5'
                        }`}>
                          {log.gravite}
                        </span>
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-tighter">REF::{log.id.toString(16).padStart(4, '0')}</span>
                        <span className="text-[10px] font-mono text-white/30 uppercase">:: {new Date(log.date).toLocaleString()}</span>
                      </div>
                      <h4 className="text-lg font-black text-white italic uppercase athletic-title athletic-skew tracking-wide group-hover:text-gold transition-colors">{log.titre}</h4>
                      <p className="text-sm text-white/50 italic leading-relaxed">{log.contenu}</p>
                    </div>
                    <div className="text-left md:text-right shrink-0">
                       <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] italic">{log.source}</span>
                    </div>
                  </div>
                )) : (
                  <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                    <p className="text-sm font-black uppercase tracking-[0.5em] text-white/20 italic">Aucune archive ne correspond à la recherche</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
