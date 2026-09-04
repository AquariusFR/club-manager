'use client';

import React from 'react';
import { Activity, Target, Zap, Shield, ChevronRight, Scan } from 'lucide-react';

interface ReconData {
  timestamp: string;
  target: string;
  status: string;
  findings: {
    standing: number;
    synergy_delta: number;
    scouted_players: number;
  };
}

export default function IntelligencePanel({ data }: { data?: ReconData }) {
  // Mock data if none provided
  const recon = data || {
    timestamp: new Date().toISOString(),
    target: "FFF_Seniors_Opponent",
    status: "ACTIVE",
    findings: {
      standing: 2,
      synergy_delta: +3.8,
      scouted_players: 18
    }
  };

  return (
    <div className="glass-card border-white/10 bg-navy-deep/40 p-8 relative overflow-hidden group min-h-[400px] backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
      {/* Tactical Scan Line Animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-pitch-green to-transparent animate-scan" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(0,255,100,0.03)_1px,transparent_1px)] bg-[length:100%_4px]" />
      </div>

      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-100 transition-opacity">
        <Scan size={50} className="text-pitch-green animate-pulse" />
      </div>

      <div className="flex items-center gap-4 mb-10 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-pitch-green/10 flex items-center justify-center text-pitch-green border border-pitch-green/20 shadow-[0_0_20px_rgba(0,255,100,0.2)]">
          <Target size={24} className="animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-pitch-green animate-ping" />
            <h3 className="athletic-title text-sm tracking-wider text-pitch-green uppercase italic leading-none">Sirchmunk Intelligence</h3>
          </div>
          <p className="text-[10px] font-black text-white/70 uppercase tracking-wider whitespace-nowrap">Pôle 0x01 — Axis Recon Tactical</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition flex flex-col gap-2">
          <div className="text-[9px] font-black text-white/60 uppercase tracking-wider italic">Target Priority</div>
          <div className="text-xl font-black text-white italic tracking-tighter leading-none">{recon.target}</div>
        </div>
        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 group-hover:border-white/10 transition flex flex-col gap-2">
          <div className="text-[9px] font-black text-white/60 uppercase tracking-wider italic">Synergy Delta</div>
          <div className={`text-2xl font-black italic tracking-tighter leading-none ${recon.findings.synergy_delta >= 0 ? 'text-pitch-green' : 'text-rose-400'}`}>
            {recon.findings.synergy_delta >= 0 ? '+' : ''}{recon.findings.synergy_delta}%
          </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between p-6 rounded-2xl bg-pitch-green/10 border border-pitch-green/20 glass-shine overflow-hidden">
          <div className="flex items-center gap-4">
            <Zap size={18} className="text-pitch-green animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-white/90 italic">Tactical Readiness</span>
          </div>
          <span className="text-sm font-black text-pitch-green italic drop-shadow-[0_0_10px_rgba(0,255,100,0.5)] whitespace-nowrap">OPTIMAL</span>
        </div>

        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.05] transition">
          <div className="flex items-center gap-4">
            <Shield size={18} className="text-white/70" />
            <span className="text-[11px] font-black uppercase tracking-wider text-white/60">Scouted Players</span>
          </div>
          <span className="text-sm font-black text-white italic">{recon.findings.scouted_players}</span>
        </div>
      </div>

      <button className="w-full mt-10 py-5 rounded-2xl border border-pitch-green/30 bg-pitch-green/10 text-pitch-green text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-3 hover:bg-pitch-green/20 hover:scale-[1.02] active:scale-[0.96] transition group/btn italic shadow-[0_10px_30px_rgba(0,0,0,0.4)] whitespace-nowrap">
        DÉPLOYER ANALYSE COMPLÈTE 
        <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
      </button>

      {/* Decorative ID */}
      <div className="absolute bottom-4 left-4 flex items-center gap-3 opacity-10 group-hover:opacity-30 transition-opacity pointer-events-none">
        <Activity size={12} className="text-white animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-wider text-white italic">
          RECON_NODE_0X01
        </span>
      </div>
      
      <style jsx>{`
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .animate-scan {
          animation: scan 6s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
