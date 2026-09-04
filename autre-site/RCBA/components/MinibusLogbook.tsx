'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  User, 
  MapPin, 
  Fuel, 
  CreditCard,
  Calendar,
  History
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MinibusLogbook({ logs }: { logs: any[] }) {
  return (
    <div className="w-full glass-card border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[2.5rem]">
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-r from-gold/5 via-transparent to-transparent flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/20 flex items-center justify-center border border-gold/30">
            <History className="text-gold" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display italic black uppercase tracking-widest text-white">Registre de Route</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Historique Kilométrique & Frais</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Date</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Conducteur</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Parcours (KM)</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Carburant</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Péages</th>
              <th className="px-8 py-6 text-right pr-12 text-[10px] font-black uppercase tracking-[0.3em] text-white/30 italic">Entité</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log, i) => (
              <motion.tr 
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-white/[0.04] transition group"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-gold opacity-50" />
                    <span className="text-sm font-bold text-white/80">{new Date(log.created_at).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <User size={14} className="text-white/20" />
                    <span className="text-sm font-bold text-white">{log.driver_name}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white italic athletic-title athletic-skew">{log.mileage_end - log.mileage_start} KM</span>
                    <span className="text-[9px] text-white/20 uppercase tracking-widest">{log.mileage_start} ➔ {log.mileage_end}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                     <Fuel size={14} className="text-blue-400" />
                     <span className="text-sm font-bold text-white">{log.fuel_cost || 0}€</span>
                   </div>
                </td>
                <td className="px-8 py-6">
                   <div className="flex items-center gap-2">
                     <CreditCard size={14} className="text-purple-400" />
                     <span className="text-sm font-bold text-white">{log.tolls_cost || 0}€</span>
                   </div>
                </td>
                <td className="px-8 py-6 text-right pr-12">
                   <span className={cn(
                     "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                     log.entity === 'RCBA' ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-pitch-green/10 border-pitch-green/20 text-pitch-green"
                   )}>
                     {log.entity}
                   </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-sm text-white/20 italic font-black uppercase tracking-[0.5em]">Aucun enregistrement identifié</p>
          </div>
        )}
      </div>
    </div>
  );
}
