'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Cpu, CheckCircle2, AlertTriangle, RefreshCw, Layers, Zap, Eye } from 'lucide-react';

interface ExtractionResult {
  licensed_name: string;
  license_number: string;
  expiry_date: string;
  confidence: number;
  anomalies: string[];
}

export default function SmartExtractionPanel() {
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'analyzing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    setPhase('scanning');
    setProgress(0);
  };

  useEffect(() => {
    if (phase === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setPhase('analyzing');
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
    
    if (phase === 'analyzing') {
      const timer = setTimeout(() => setPhase('completed'), 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const mockResult: ExtractionResult = {
    licensed_name: "MARCUS DUVAL",
    license_number: "2024-F42-998",
    expiry_date: "2026-06-30",
    confidence: 0.98,
    anomalies: []
  };

  return (
    <div className="glass-card p-10 relative overflow-hidden group shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-white/10 bg-navy-deep/40 backdrop-blur-3xl">
      {/* Background Decorative Element */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gold/10 blur-[100px] rounded-full group-hover:bg-gold/20 transition duration-1000" />
      
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <Cpu size={28} className={phase !== 'idle' ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h3 className="athletic-title text-lg tracking-[0.1em] text-gold italic">Scanner Numérique Licence FFF</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Module de Contrôle Administratif</p>
          </div>
        </div>
        
        {phase === 'completed' && (
          <div className="badge-gold border-gold/40 text-gold scale-110">
            LICENCE VÉRIFIÉE
          </div>
        )}
      </div>

      {phase === 'idle' && (
        <div className="py-16 flex flex-col items-center gap-8 border-2 border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01] group/drop hover:bg-gold/[0.02] hover:border-gold/20 transition cursor-pointer" onClick={startScan}>
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-white/80 group-hover/drop:text-gold transition-colors">
            <FileText size={48} />
          </div>
          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-[0.3em] text-white/70 mb-2">Déposer une Licence ou Justificatif</p>
            <p className="text-[9px] text-white/80 font-bold uppercase tracking-widest italic">Extraction et vérification automatique des données</p>
          </div>
        </div>
      )}

      {(phase === 'scanning' || phase === 'analyzing') && (
        <div className="py-20 flex flex-col gap-10">
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/70 italic">
                {phase === 'scanning' ? 'Lecture optique en cours...' : 'Contrôle des informations administratives...'}
              </span>
              <span className="text-xl font-display font-black text-gold italic">{phase === 'scanning' ? `${progress}%` : 'ANALYSE'}</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[1px]">
              <div 
                className="h-full bg-gradient-to-r from-gold/40 via-gold to-white rounded-full transition duration-300 shadow-[0_0_20px_rgba(212,175,55,0.5)]" 
                style={{ width: `${phase === 'scanning' ? progress : 100}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-center gap-12 text-white/80">
            <Layers size={32} className={`animate-pulse ${phase === 'analyzing' ? 'text-gold' : ''}`} />
            <RefreshCw size={32} className="animate-spin" />
            <Zap size={32} className={`animate-pulse ${phase === 'analyzing' ? 'text-gold' : ''}`} />
          </div>
        </div>
      )}

      {phase === 'completed' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Titulaire Extrait</span>
              <span className="text-lg font-black text-white italic tracking-tighter">{mockResult.licensed_name}</span>
            </div>
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Numéro Licence</span>
              <span className="text-lg font-black text-gold italic tracking-tighter">{mockResult.license_number}</span>
            </div>
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Date d&apos;Expiration</span>
              <span className="text-lg font-black text-white italic tracking-tighter">{mockResult.expiry_date}</span>
            </div>
            <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col gap-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Indice de Confiance</span>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-pitch-green" style={{ width: '98%' }} />
                </div>
                <span className="text-sm font-black text-pitch-green italic">98%</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-5 rounded-2xl bg-gold text-navy-deep font-black text-sm italic uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.96] transition flex items-center justify-center gap-3">
              <CheckCircle2 size={18} />
              Valider Dossier
            </button>
            <button 
              onClick={() => setPhase('idle')}
              className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Security Decorative ID */}
      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6 opacity-20">
        <div className="flex items-center gap-3">
          <Eye size={12} className="text-white" />
          <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white">Agentic Scan Active</span>
        </div>
        <span className="text-[8px] font-mono text-white/60">NODE_EXTRACTOR_0X01_BETA</span>
      </div>
    </div>
  );
}
