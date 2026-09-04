'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, 
  Terminal, 
  Activity, 
  Shield, 
  Zap, 
  Database, 
  Search, 
  AlertCircle,
  TrendingUp,
  Box,
  Layers,
  Power,
  ChevronRight,
  RefreshCcw,
  Maximize2,
  X
} from 'lucide-react';
import { getDetailedIntelligenceLogAction, triggerSpecificReconAction } from '@/lib/actions';
import HudCorners from './HudCorners';

interface LogEntry {
  id: number;
  type: string;
  source: string;
  titre: string;
  contenu: string;
  gravite: 'info' | 'warning' | 'critical';
  agent_key?: string;
  date: string;
}

const AGENT_ICONS: Record<string, any> = {
  MARY: TrendingUp,
  JOHN: Box,
  WINSTON: Database,
  QUINN: Shield,
  SARA: Zap,
  ALEX: Activity
};

export default function IntelligencePortal() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [scanId, setScanId] = useState('0000');
  const [loading, setLoading] = useState(true);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>(['System Boot Completed.', 'Aura Neural Link Established.', 'Sirchmunk Recon Expert Online.']);
  const [activeNodes, setActiveNodes] = useState({
    finance: { status: 'optimal', health: 98 },
    logistique: { status: 'stable', health: 85 },
    performance: { status: 'alert', health: 62 }
  });
  const [filterAgent, setFilterAgent] = useState<string | 'all'>('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [terminalHistory]);

  async function loadLogs() {
    setLoading(true);
    const data = await getDetailedIntelligenceLogAction(50);
    setLogs(data as LogEntry[]);
    setLoading(false);
  }

  useEffect(() => {
    let active = true;
    getDetailedIntelligenceLogAction(50).then(data => {
      if (active) {
        setLogs(data as LogEntry[]);
        setLoading(false);
        setScanId(Math.floor(Math.random() * 65535).toString(16).toUpperCase());
      }
    });
    const interval = setInterval(async () => {
      const data = await getDetailedIntelligenceLogAction(50);
      if (active) {
        setLogs(data as LogEntry[]);
      }
    }, 30000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const filteredLogs = filterAgent === 'all' 
    ? logs 
    : logs.filter(log => log.agent_key === filterAgent);

  const handleTerminalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim().toLowerCase();
    setTerminalHistory(prev => [...prev, `> ${terminalInput}`]);
    setTerminalInput('');

    if (cmd === 'clear') {
      setTerminalHistory([]);
      return;
    }

    if (cmd.startsWith('scan ')) {
      const sector = cmd.split(' ')[1];
      setTerminalHistory(prev => [...prev, `Initializing deep scan for: ${sector}...`]);
      
      const res = await triggerSpecificReconAction(sector.charAt(0).toUpperCase() + sector.slice(1) as any);
      if (res.success) {
        setTerminalHistory(prev => [...prev, `Scan completed. Findings archived in Intelligence Feed.`]);
        loadLogs();
      } else {
        setTerminalHistory(prev => [...prev, `Scan failed: ${res.error || 'Sector unknown'}`]);
      }
    } else if (cmd === 'help') {
      setTerminalHistory(prev => [...prev, 'Available Commands:', ' - scan [finance|physique|logistique|tactique]', ' - clear', ' - status', ' - filter [AGENT_KEY|all]', ' - reboot']);
    } else if (cmd.startsWith('filter ')) {
       const agent = cmd.split(' ')[1].toUpperCase();
       if (agent === 'ALL' || AGENT_ICONS[agent]) {
         setFilterAgent(agent === 'ALL' ? 'all' : agent);
         setTerminalHistory(prev => [...prev, `Filter applied: ${agent}`]);
       } else {
         setTerminalHistory(prev => [...prev, `Agent unknown: ${agent}`]);
       }
    } else if (cmd === 'status') {
       setTerminalHistory(prev => [...prev, `Finance: ${activeNodes.finance.status} (${activeNodes.finance.health}%)`, `Logistique: ${activeNodes.logistique.status} (${activeNodes.logistique.health}%)`, `Performance: ${activeNodes.performance.status} (${activeNodes.performance.health}%)`]);
    } else {
      setTerminalHistory(prev => [...prev, `Command not recognized: ${cmd}. Type 'help' for options.`]);
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep text-white p-6 font-mono selection:bg-gold selection:text-navy-deep overflow-hidden flex flex-col gap-6">
      {/* Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy-deep/80 backdrop-blur-xl"
            onClick={() => setSelectedLog(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-4xl max-h-[80vh] bg-white/[0.03] border border-white/10 rounded-[2rem] p-10 overflow-y-auto relative shadow-2xl no-scrollbar"
              onClick={e => e.stopPropagation()}
            >
              <HudCorners color="#d4af37" opacity={0.2} size={40} />
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl bg-white/5 ${
                    selectedLog.gravite === 'critical' ? 'text-rose-500' : 'text-gold'
                  }`}>
                    {selectedLog.agent_key ? React.createElement(AGENT_ICONS[selectedLog.agent_key], { size: 24 }) : <Layers size={24} />}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 italic">Intelligence Log :: 0x{selectedLog.id}</span>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">{selectedLog.titre}</h2>
                  </div>
                </div>
                <button onClick={() => setSelectedLog(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-8">
                <div className="flex flex-wrap gap-8 text-[10px] font-bold uppercase tracking-widest text-white/60">
                   <div className="flex items-center gap-2">
                     <span className="text-white/20">AGENT:</span>
                     <span className="text-gold italic">{selectedLog.agent_key || 'SYSTEM'}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-white/20">SOURCE:</span>
                     <span className="text-blue-400 italic">{selectedLog.source}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-white/20">DATE:</span>
                     <span className="text-white/80">{new Date(selectedLog.date).toLocaleString()}</span>
                   </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-2xl p-8 font-mono text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                  {selectedLog.contenu}
                </div>

                {(selectedLog as any).metadata && (
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.3em] italic flex items-center gap-4">
                       PARAMETERS & CONTEXT
                       <div className="h-px flex-1 bg-gold/20" />
                    </h4>
                    <pre className="bg-white/5 p-6 rounded-2xl text-[10px] text-white/40 overflow-x-auto border border-white/5 custom-scrollbar">
                      {(() => {
                        try {
                          return JSON.stringify(JSON.parse((selectedLog as any).metadata), null, 2);
                        } catch (e) {
                          return (selectedLog as any).metadata;
                        }
                      })()}
                    </pre>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ═══════════════════════════════════════
          HEADER STATUS BAR
      ═══════════════════════════════════════ */}
      <header className="flex items-center justify-between border border-white/10 bg-white/5 p-4 rounded-xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent animate-scanline" />
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Cpu className="text-gold animate-pulse" size={24} />
            <h1 className="text-xl font-black italic uppercase tracking-tighter">RCBA Intelligence Portal <span className="text-gold/60 text-sm ml-2">v3.0.1_BETA</span></h1>
          </div>
          
          <div className="h-8 w-[1px] bg-white/10" />
          
          <div className="flex items-center gap-4 text-[10px] text-white/50 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pitch-green animate-pulse" />
              SYSTEM_READY
            </div>
            <div className="flex items-center gap-2">
              <Search className="text-gold" size={12} />
              SCAN_ID::0x{scanId}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-[10px] font-bold text-white/70">
          <div className="flex flex-col items-end">
            <span className="text-gold/80 italic tracking-widest">COORDINATES::BU_ABONDANT_FR</span>
            <span>{new Date().toLocaleDateString('fr-FR')} {" // "} {new Date().toLocaleTimeString('fr-FR')}</span>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          MAIN HUD GRID
      ═══════════════════════════════════════ */}
      <main className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        
        {/* LEFT: MATRIX STREAM (LIVE LOG) */}
        <section className="col-span-3 flex flex-col gap-4 overflow-hidden h-full">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2 text-gold">
              <Layers size={14} /> Matrix Stream
            </h3>
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Feed::0x01</span>
          </div>

          {/* Agent Filter Tabs */}
          <div className="flex flex-wrap gap-2 px-2">
            <button 
              onClick={() => setFilterAgent('all')}
              className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition border ${
                filterAgent === 'all' 
                  ? 'bg-gold text-navy-deep border-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                  : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
              }`}
            >
              ALL
            </button>
            {Object.keys(AGENT_ICONS).map(key => (
              <button 
                key={key}
                onClick={() => setFilterAgent(key)}
                className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition border flex items-center gap-2 ${
                  filterAgent === key 
                    ? 'bg-gold text-navy-deep border-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
                    : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
          
          <div className="flex-1 border border-white/5 bg-white/[0.02] rounded-2xl overflow-y-auto p-4 custom-scrollbar relative">
             <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,0.05),transparent)]" />
             <div className="space-y-4 relative z-10">
                <AnimatePresence initial={false}>
                  {filteredLogs.map((log) => {
                    const AgentIcon = log.agent_key ? AGENT_ICONS[log.agent_key] : Layers;
                    return (
                      <motion.div 
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setSelectedLog(log)}
                        className={`p-4 rounded-xl border border-white/5 bg-white/[0.03] text-[10px] leading-relaxed group hover:bg-white/[0.08] hover:border-gold/30 cursor-pointer transition relative overflow-hidden`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                             <div className={`p-1 rounded bg-white/5 ${
                               log.gravite === 'critical' ? 'text-rose-500' :
                               log.gravite === 'warning' ? 'text-gold' :
                               'text-blue-400'
                             }`}>
                               <AgentIcon size={12} />
                             </div>
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                               log.gravite === 'critical' ? 'bg-rose-500/20 text-rose-500' :
                               log.gravite === 'warning' ? 'bg-gold/20 text-gold' :
                               'bg-blue-500/20 text-blue-400'
                             }`}>
                               {log.gravite}
                             </span>
                          </div>
                          <span className="text-[8px] text-white/30 font-mono italic">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <h4 className="font-bold text-white/90 mb-1 uppercase tracking-tight group-hover:text-gold transition-colors">{log.titre}</h4>
                        <p className="text-white/50 line-clamp-2">{log.contenu}</p>
                        {log.agent_key && (
                          <div className="mt-2 text-[7px] font-mono text-gold/30 uppercase tracking-[0.2em]">
                            SOURCE::AGENT_{log.agent_key}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
             </div>
          </div>
        </section>

        {/* CENTER: AURA SYNERGY MAP */}
        <section className="col-span-6 border border-white/10 bg-white/[0.01] rounded-3xl relative overflow-hidden flex flex-col p-8 group">
          <HudCorners color="#d4af37" opacity={0.15} size={60} />
          
          <div className="flex items-center justify-between relative z-10 mb-8">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white/90">Aura Synergy Map</h2>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.4em]">Node Connection Protocol // 0x01</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] text-pitch-green font-bold uppercase tracking-widest">
                <Activity size={14} className="animate-pulse" /> Live Analysis
              </div>
              <Maximize2 size={16} className="text-white/20 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            {/* Visual placeholder for the map logic */}
            <div className="w-96 h-96 rounded-full border-2 border-dashed border-white/5 relative flex items-center justify-center animate-[spin_60s_linear_infinite]">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gold shadow-[0_0_20px_#d4af37] animate-pulse" />
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_20px_#f43f5e]" />
               <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_20px_#60a5fa]" />
               <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-pitch-green shadow-[0_0_20px_#62cb72]" />
               
               <div className="w-72 h-72 rounded-full border border-white/10 flex items-center justify-center animate-[spin_40s_linear_reverse_infinite]">
                  <div className="w-48 h-48 rounded-full border border-white/20 flex items-center justify-center animate-[pulse_10s_ease-in-out_infinite]">
                     <Database size={48} className="text-gold/20 drop-shadow-glow" />
                  </div>
               </div>
            </div>

            {/* Central Node Info overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center space-y-2 relative z-20">
                  <span className="text-[10px] font-black text-gold/60 uppercase tracking-[0.5em]">Central Core</span>
                  <div className="text-5xl font-black italic tracking-tighter text-white">94%</div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Efficiency Index</span>
               </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-4 gap-4 relative z-10">
             {[
               { label: 'Tactical Bloom', value: '78%', color: 'text-pitch-green' },
               { label: 'Financial Drift', value: '-2.4%', color: 'text-rose-400' },
               { label: 'Logistics Sync', value: 'Locked', color: 'text-blue-400' },
               { label: 'Personnel Aura', value: 'High', color: 'text-gold' }
             ].map((stat, i) => (
               <div key={i} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col gap-1 text-center">
                 <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{stat.label}</span>
                 <span className={`text-sm font-black italic ${stat.color}`}>{stat.value}</span>
               </div>
             ))}
          </div>
        </section>

        {/* RIGHT: NODE STATUS (HEALTH INDICATORS) */}
        <section className="col-span-3 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
             <h3 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2 text-gold">
               <Activity size={14} /> Node Status
             </h3>
             
             <div className="space-y-4">
                {[
                  { id: 'finance', label: 'Financial Core', icon: TrendingUp, color: 'text-gold', health: activeNodes.finance.health, status: activeNodes.finance.status },
                  { id: 'logistique', label: 'Logistics Core', icon: Box, color: 'text-blue-400', health: activeNodes.logistique.health, status: activeNodes.logistique.status },
                  { id: 'performance', label: 'Performance Core', icon: Activity, color: 'text-rose-500', health: activeNodes.performance.health, status: activeNodes.performance.status }
                ].map((node) => (
                  <div key={node.id} className="glass-card p-6 border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white/5 ${node.color}`}>
                          <node.icon size={18} />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{node.label}</h4>
                          <p className="text-[8px] text-white/30 uppercase tracking-widest font-mono">Status::{node.status}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-black italic ${node.health > 80 ? 'text-pitch-green' : node.health > 60 ? 'text-gold' : 'text-rose-500'}`}>
                        {node.health}%
                      </span>
                    </div>
                    
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${node.health}%` }}
                        className={`h-full ${node.health > 80 ? 'bg-pitch-green' : node.health > 60 ? 'bg-gold' : 'bg-rose-500'}`} 
                       />
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
             <h3 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2 text-gold">
               <Shield size={14} /> Security Protocol
             </h3>
             <div className="flex-1 glass-card p-6 border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-pitch-green/30 flex items-center justify-center relative">
                   <Shield size={32} className="text-pitch-green animate-pulse" />
                   <div className="absolute inset-0 border-t-2 border-pitch-green rounded-full animate-spin" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">Auth_Tunnel_Active</h4>
                  <p className="text-[8px] text-white/30 uppercase tracking-widest mt-1">Encryption Mode::AES_256_GCM</p>
                </div>
                <button className="text-[9px] font-black text-gold/60 hover:text-gold uppercase tracking-widest border border-gold/20 px-4 py-2 rounded-lg transition hover:bg-gold/5 mt-2">
                  Rotate Keys
                </button>
             </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════
          FOOTER: SIRCHMUNK TERMINAL
      ═══════════════════════════════════════ */}
      <footer className="h-48 border border-gold/20 bg-black/40 rounded-2xl flex flex-col overflow-hidden relative group">
        <div className="bg-gold/10 px-4 py-2 flex items-center justify-between border-b border-gold/20">
           <div className="flex items-center gap-2 text-gold text-[10px] font-black uppercase tracking-[0.3em]">
             <Terminal size={14} /> Sirchmunk Terminal — 0x01
           </div>
           <div className="flex items-center gap-4 text-[8px] font-mono text-gold/40">
              <span>LOCAL_ADDR::127.0.0.1</span>
              <span className="flex items-center gap-1"><Power size={10} className="text-pitch-green" /> ONLINE</span>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 text-[10px] font-mono text-white/60 space-y-1 custom-scrollbar scroll-smooth">
           {terminalHistory.map((line, i) => (
             <div key={i} className="flex gap-4">
                <span className="text-white/20 shrink-0">[{i.toString().padStart(3, '0')}]</span>
                <span className={line.startsWith('>') ? 'text-gold' : ''}>{line}</span>
             </div>
           ))}
           <div ref={terminalEndRef} />
        </div>

        <form onSubmit={handleTerminalSubmit} className="p-4 flex items-center gap-4 bg-white/5 border-t border-white/10 group-focus-within:border-gold/30 transition">
           <ChevronRight size={16} className="text-gold" />
           <input 
             type="text"
             value={terminalInput}
             onChange={(e) => setTerminalInput(e.target.value)}
             placeholder="ENTER COMMAND (type 'help' for options)..."
             className="flex-1 bg-transparent border-none outline-none text-[10px] font-mono text-gold placeholder:text-gold/20 uppercase tracking-widest"
             autoFocus
           />
           <button type="submit" className="p-2 hover:bg-gold/10 rounded-lg text-gold/40 hover:text-gold transition">
             <Zap size={16} />
           </button>
        </form>
      </footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.4);
        }
        
        @keyframes scroll-x {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
        .animate-scroll-x {
          animation: scroll-x 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
