'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Settings,
  Plus,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MinibusMaintenance({ items }: { items: any[] }) {
  return (
    <div className="w-full glass-card border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[2.5rem]">
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-r from-rose-500/5 via-transparent to-transparent flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
            <Settings className="text-rose-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display italic black uppercase tracking-widest text-white">Maintenance Préventive</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Vérifications Techniques & Conformité</p>
          </div>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-6 rounded-3xl border flex gap-6 relative overflow-hidden group transition",
              item.status === 'CRITICAL' ? "bg-rose-500/10 border-rose-500/20" : 
              item.status === 'WARNING' ? "bg-gold/10 border-gold/20" : 
              "bg-pitch-green/10 border-pitch-green/20"
            )}
          >
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border",
              item.status === 'CRITICAL' ? "bg-rose-500/20 border-rose-500/30 text-rose-500" : 
              item.status === 'WARNING' ? "bg-gold/20 border-gold/30 text-gold" : 
              "bg-pitch-green/20 border-pitch-green/30 text-pitch-green"
            )}>
              {item.status === 'CRITICAL' ? <AlertTriangle size={28} /> : 
               item.status === 'WARNING' ? <Clock size={28} /> : 
               <ShieldCheck size={28} />}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h4 className="text-lg font-bold text-white">{item.type}</h4>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                  item.status === 'CRITICAL' ? "bg-rose-500 text-white shadow-glow-rose" : 
                  item.status === 'WARNING' ? "bg-gold text-navy-deep shadow-glow" : 
                  "bg-pitch-green text-navy-deep shadow-glow-green"
                )}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">{item.description}</p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-[9px] font-black text-white/40 uppercase tracking-widest">
                  <Calendar size={12} /> Échéance: <span className="text-white/60">{new Date(item.due_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <button className="absolute right-6 bottom-6 p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition">
              <ChevronRight size={20} />
            </button>
          </motion.div>
        ))}

        <button className="p-6 rounded-3xl border-2 border-dashed border-white/5 hover:border-gold/20 hover:bg-gold/5 transition flex flex-col items-center justify-center gap-4 group">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-gold transition-colors">
              <Plus size={24} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors">Programmer Entretien</span>
        </button>
      </div>

      <div className="p-8 border-t border-white/5 bg-navy-deep/40">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-2 h-2 rounded-full bg-pitch-green animate-pulse" />
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 italic">Checklist Avant Départ</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Pression Pneus', 'Niveau Huile', 'Plein AdBlue', 'Éclairage'].map((check) => (
            <div key={check} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
              <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center">
                <div className="w-2 h-2 bg-pitch-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{check}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
