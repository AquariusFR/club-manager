'use client';

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCcw, 
  ArrowRight,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { getDetailedIntelligenceLogAction, markIntelligenceAsReadAction, generateNewIntelligenceAction } from '@/lib/actions';

export default function IntelligenceAxis() {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadFeed() {
    setLoading(true);
    const data = await getDetailedIntelligenceLogAction(5);
    setFeed(data);
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await generateNewIntelligenceAction();
    await loadFeed();
    setRefreshing(false);
  }

  async function handleMarkRead(id: number) {
    await markIntelligenceAsReadAction(id);
    loadFeed();
  }

  useEffect(() => {
    let active = true;
    getDetailedIntelligenceLogAction(5).then(data => {
      if (active) {
        setFeed(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

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
    <section className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between px-4">
        <h3 className="athletic-title text-2xl flex items-center gap-5 italic text-white/90 uppercase">
          <Cpu className="text-gold animate-pulse" size={32} /> Pôle 0x01 <span className="text-gold/60 font-mono tracking-tighter">INTELLIGENCE</span>
        </h3>
        
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className={`p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-gold/10 hover:border-gold/40 transition group ${refreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCcw size={18} className="text-gold/60 group-hover:text-gold" />
        </button>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-32 w-full glass-card border-white/5 bg-white/[0.01] animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : feed.length > 0 ? (
          feed.map((item, i) => (
            <div 
              key={item.id} 
              className={`glass-card border-white/5 bg-white/[0.01] overflow-hidden group hover:bg-white/[0.03] transition relative ${item.lu === 0 ? 'before:absolute before:left-0 before:top-0 before:w-1.5 before:h-full before:bg-gold before:z-10 before:shadow-[0_0_20px_#d4af37]' : ''}`}
            >
              <div className="p-8">
                <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-4 xl:gap-0 mb-6">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-[0.3em] italic ${getSeverityStyles(item.gravite)}`}>
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">{item.source}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className="text-[10px] sm:text-base text-gold/90 border-l-2 border-gold/30 pl-3">Surveillance RCBA Elite — 0x01</span>
                    <span className="text-[9px] font-mono text-gold/60 bg-gold/5 px-2.5 py-1.5 rounded-lg border border-gold/10 italic">
                      {new Date(item.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {item.lu === 0 && (
                      <button 
                        onClick={() => handleMarkRead(item.id)}
                        className="text-[9px] font-black text-white/70 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2"
                      >
                        <Eye size={12} /> MARQUER LU
                      </button>
                    )}
                  </div>
                </div>

                <h4 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-gold transition-colors mb-3 leading-none italic">
                  {item.titre}
                </h4>
                
                <p className="text-sm text-white/60 font-medium leading-relaxed mb-6 group-hover:text-white/80 transition-colors">
                  {item.contenu}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <div className="w-8 h-1 bg-gold/20 rounded-full" />
                    <div className="w-16 h-1 bg-gold/10 rounded-full" />
                    <div className="w-4 h-1 bg-gold/5 rounded-full" />
                  </div>
                  <Link href="/direction/intelligence" className="flex items-center gap-3 text-[10px] font-black text-gold/80 hover:text-gold uppercase tracking-[0.3em] italic transition group/link">
                    Détails du Rapport <ArrowRight size={14} className="group-hover/link:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card border-white/5 bg-white/[0.01] p-20 text-center rounded-[3rem] border-dashed">
            <Activity className="mx-auto text-white/70 mb-6" size={48} />
            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.5em] italic">
              Aucune intelligence agentique détectée. Activez Sirchmunk pour lancer la reconnaissance.
            </p>
          </div>
        )}
      </div>

      <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/10 flex items-center justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-3 h-3 rounded-full bg-pitch-green animate-pulse shadow-[0_0_20px_rgba(0,255,100,0.6)]" />
          <div className="space-y-1">
            <span className="block text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Surveillance RCBA Elite Active</span>
            <span className="block text-[8px] font-mono text-white/70 uppercase tracking-widest">Protocole de reconnaissance agentique Sirchmunk</span>
          </div>
        </div>
        <div className="flex gap-4 relative z-10">
          <div className="w-8 h-2 bg-white/5 rounded-full" />
          <div className="w-12 h-2 bg-gold/40 rounded-full animate-pulse shadow-[0_0_10px_#d4af37]" />
        </div>
      </div>
    </section>
  );
}
