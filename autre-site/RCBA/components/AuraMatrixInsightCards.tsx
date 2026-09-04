import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Settings } from 'lucide-react';

interface IntelItem {
  id: number;
  type: string;
  source: string;
  titre: string;
  contenu: string;
  gravite: 'info' | 'warning' | 'critical';
  date: string;
}

interface AuraMatrixInsightCardsProps {
  filteredItems: IntelItem[];
  activeCategory?: { id: string; label: string; icon: any; color: string };
}

export default function AuraMatrixInsightCards({
  filteredItems,
  activeCategory
}: AuraMatrixInsightCardsProps) {
  return (
    <div className="w-full mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-50">
      <AnimatePresence mode="wait">
        {filteredItems.length > 0 ? (
          filteredItems.slice(0, 3).map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="glass-card p-10 border-white/10 bg-white/[0.01] hover:bg-white/[0.03] transition group relative overflow-hidden shadow-3xl hud-scanline"
            >
              <div className="absolute top-0 right-0 p-8">
                <ArrowUpRight size={20} className="text-white/20 group-hover:text-gold transition group-hover:rotate-12" />
              </div>
              
              <div className="flex items-center gap-4 mb-8">
                 <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: activeCategory?.color, boxShadow: `0 0 15px ${activeCategory?.color}` }} 
                 />
                 <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] italic italic-skew">Donnée {item.id.toString(16).padStart(4, '0')}</span>
              </div>

              <h4 className="text-3xl font-black text-white italic athletic-title athletic-skew tracking-tight uppercase group-hover:text-gold transition-colors leading-none mb-4">
                {item.titre}
              </h4>
              
              <p className="text-[15px] text-white/70 italic leading-relaxed mb-10 font-medium">
                 {item.contenu}
              </p>

              <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                <div className={`text-[9px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border transition ${
                  item.gravite === 'critical' ? 'text-rose-500 border-rose-500/30 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.1)]' :
                  item.gravite === 'warning' ? 'text-gold border-gold/30 bg-gold/5 shadow-[0_0_15px_rgba(212,175,55,0.1)]' :
                  'text-blue-400 border-blue-400/30 bg-blue-400/5 shadow-[0_0_15px_rgba(96,165,250,0.1)]'
                }`}>
                  Priorité::{item.gravite}
                </div>
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest italic">
                  {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-3 py-24 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-white/[0.01]">
            <div className="flex flex-col items-center gap-4">
              <Settings size={40} className="text-white/10 animate-spin-slow" />
              <p className="text-sm font-black uppercase tracking-[0.6em] text-white/30 italic">Aucune donnée d'intelligence disponible pour le moment</p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
