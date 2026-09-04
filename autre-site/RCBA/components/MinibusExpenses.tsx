'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, 
  Upload, 
  Euro, 
  FileText, 
  Camera, 
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

export function MinibusExpenses({ logs }: { logs: any[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const totalExpenses = logs.reduce((acc, log) => acc + (log.fuel_cost || 0) + (log.tolls_cost || 0), 0);

  const onDrop = useCallback(() => {
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 2000);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="w-full glass-card border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[2.5rem]">
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-500/5 via-transparent to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Euro className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display italic black uppercase tracking-widest text-white">Gestion des Frais</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Consolidation Budgétaire & Justificatifs</p>
          </div>
        </div>
        
        <div className="glass-card px-8 py-4 bg-white/5 border-white/10 flex items-baseline gap-3">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Total Consolidé</span>
          <span className="text-3xl font-black text-white italic athletic-title athletic-skew">{totalExpenses.toFixed(2)}</span>
          <span className="text-blue-400 font-bold">€</span>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Receipt Upload Zone */}
        <div className="lg:col-span-1 space-y-6">
          <div 
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-6 cursor-pointer transition h-[350px]",
              isUploading ? "border-blue-500 bg-blue-500/5" : "border-white/10 hover:border-blue-500/30 hover:bg-white/5"
            )}
          >
            <input {...getInputProps()} />
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20">
              {isUploading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}><Upload size={40} /></motion.div> : <Camera size={40} />}
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-bold text-white">Scanner un Reçu</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed">Déposez votre justificatif ou cliquez pour capturer</p>
            </div>
          </div>
          
          <div className="p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-4">
             <div className="flex items-center gap-3">
               <AlertCircle className="text-blue-400" size={18} />
               <p className="text-[10px] font-black uppercase tracking-widest text-white/60 italic">Protocole de Remboursement</p>
             </div>
             <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-wider">Toute dépense doit être accompagnée d'une photo nette du ticket. Le remboursement sera validé après synchronisation du logbook.</p>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="lg:col-span-2">
          <div className="bg-navy-deep/40 rounded-[2rem] border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 italic">Derniers Justificatifs</h4>
            </div>
            <div className="divide-y divide-white/5">
              {logs.filter(l => l.fuel_cost > 0 || l.tolls_cost > 0).map((log) => (
                <div key={`exp-${log.id}`} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{log.driver_name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-white/30 font-mono uppercase">{new Date(log.created_at).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest italic">{log.fuel_cost > 0 ? 'CARBURANT' : 'PÉAGE'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xl font-black text-white italic athletic-title athletic-skew">{(log.fuel_cost + log.tolls_cost).toFixed(2)}€</p>
                      <p className="text-[9px] text-pitch-green font-black uppercase tracking-widest italic flex items-center justify-end gap-2">
                        <CheckCircle2 size={10} /> VALIDÉ
                      </p>
                    </div>
                    <button className="p-3 rounded-lg text-white/10 hover:text-rose-500 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
