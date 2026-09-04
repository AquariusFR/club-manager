'use client'

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, Target, Activity, ChevronRight, Binary } from 'lucide-react';
import { getDetailedIntelligenceLogAction } from '@/lib/actions';

interface IntelligenceItem {
  id: number;
  type: string;
  source: string;
  titre: string;
  contenu: string;
  gravite: 'info' | 'warning' | 'critical';
  date: string;
}

export default function IntelligencePulse() {
  const [feed, setFeed] = useState<IntelligenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadFeed() {
      const data = await getDetailedIntelligenceLogAction(5);
      setFeed(data as IntelligenceItem[]);
      setLoading(false);
    }
    loadFeed();
    
    const interval = setInterval(loadFeed, 30000); // Pulse every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (feed.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % feed.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [feed]);

  if (loading || feed.length === 0) return null;

  const current = feed[currentIndex];

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tactique': return <Shield size={16} />;
      case 'scouting': return <Target size={16} />;
      case 'physique': return <Activity size={16} />;
      default: return <Zap size={16} />;
    }
  };

  const getGraviteColor = (gravite: string) => {
    switch (gravite) {
      case 'critical': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      case 'warning': return 'text-gold bg-gold/10 border-gold/30';
      default: return 'text-sirchmunk bg-sirchmunk/10 border-sirchmunk/30';
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-12 relative">
      {/* Decorative HUD Elements */}
      <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-sirchmunk/20 rounded-tl-2xl pointer-events-none" />
      <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-sirchmunk/20 rounded-br-2xl pointer-events-none" />
      
      <div className="glass-hologram p-6 rounded-2xl relative overflow-hidden group">
        {/* Scanline Effect - Toned down for readability */}
        <div className="absolute inset-0 bg-sirchmunk/5 opacity-10 pointer-events-none overflow-hidden">
          <div className="w-full h-1 bg-sirchmunk/30 blur-[2px] animate-[hud-scanline_10s_linear_infinite]" />
        </div>

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sirchmunk/20 flex items-center justify-center text-sirchmunk animate-pulse">
              <Binary size={18} />
            </div>
            <div>
              <div className="text-sm font-black uppercase tracking-[0.2em] text-sirchmunk/80">System intelligence</div>
              <div className="text-sm font-black uppercase tracking-widest text-white italic">Sirchmunk Recon Alpha</div>
            </div>
          </div>
          <div className="text-sm font-black text-white/80 uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md shadow-xl">
             Active Link // 0xAF2
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="relative z-10"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl border ${getGraviteColor(current.gravite)} shadow-lg`}>
                {getIcon(current.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-black uppercase tracking-[0.1em] px-2 py-1 rounded border ${getGraviteColor(current.gravite)}`}>
                    {current.type}
                  </span>
                  <span className="text-sm text-white/80 font-mono font-bold">
                    {new Date(current.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white mb-2 group-hover:text-sirchmunk transition-colors leading-tight">
                  {current.titre}
                </h3>
                <p className="text-white/85 text-base leading-relaxed mb-4 line-clamp-3 italic font-medium drop-shadow-sm">
                  "{current.contenu}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {feed.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1 rounded-full transition duration-500 ${i === currentIndex ? 'w-6 bg-sirchmunk' : 'w-2 bg-white/10'}`} 
                      />
                    ))}
                  </div>
                  <button className="text-sirchmunk text-sm font-black uppercase tracking-[0.1em] flex items-center gap-1.5 hover:gap-3 transition opacity-80 hover:opacity-100 bg-sirchmunk/5 px-3 py-2 rounded-lg border border-sirchmunk/20 hover:bg-sirchmunk/10">
                    Détails Protocol <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* HUD Data Stream (Visual only) */}
        <div className="absolute right-[-20px] top-[20%] opacity-5 rotate-90 pointer-events-none text-[8px] font-mono text-sirchmunk">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i}>0x{((i * 0xabcde) % 0xffffff).toString(16).toUpperCase().padStart(6, '0')} FETCH_INTEL_STREAM</div>
          ))}
        </div>
      </div>
      
      {/* Pulse Beacon */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
        <div className="w-px h-12 bg-gradient-to-t from-sirchmunk/40 to-transparent" />
        <div className="w-2 h-2 rounded-full bg-sirchmunk animate-ping" />
        <div className="w-px h-12 bg-gradient-to-b from-sirchmunk/40 to-transparent" />
      </div>
    </div>
  );
}
