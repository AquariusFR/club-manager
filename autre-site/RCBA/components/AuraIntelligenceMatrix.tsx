'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Target, 
  Activity, 
  Zap, 
  Brain, 
  Settings, 
  Cpu, 
  Database,
  ArrowUpRight,
  RefreshCcw
} from 'lucide-react';
import { getDetailedIntelligenceLogAction } from '@/lib/actions';
import HudCorners from './HudCorners';
import AuraMatrixArchivesModal from './AuraMatrixArchivesModal';
import AuraMatrixInsightCards from './AuraMatrixInsightCards';
import dynamic from 'next/dynamic';

const MatrixDiscoveryRenderer = dynamic(() => import('./MatrixDiscoveryRenderer'), { ssr: false });

interface IntelItem {
  id: number;
  type: string;
  source: string;
  titre: string;
  contenu: string;
  gravite: 'info' | 'warning' | 'critical';
  date: string;
}

const CATEGORIES = [
  { id: 'Tactique', label: 'Tactique', icon: Shield, color: '#4ade80' }, // Green
  { id: 'Scouting', label: 'Scouting', icon: Target, color: '#c084fc' }, // Purple
  { id: 'Physique', label: 'Physique', icon: Activity, color: '#fb7185' }, // Rose/Pink
  { id: 'Mental', label: 'Mental', icon: Brain, color: '#60a5fa' }, // Blue
  { id: 'Logistique', label: 'Logistique', icon: Settings, color: '#fb923c' } // Orange
];

interface AuraIntelligenceMatrixProps {
  players?: any[];
  attendanceRate?: number;
  financialHealth?: number;
  licenseValidity?: number;
  tacticalVolume?: number;
}

export default function AuraIntelligenceMatrix({ 
  players = [], 
  attendanceRate = 0, 
  financialHealth = 0, 
  licenseValidity = 0, 
  tacticalVolume = 0 
}: AuraIntelligenceMatrixProps) {
  const [items, setItems] = useState<IntelItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>('Tactique');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logItems, setLogItems] = useState<IntelItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [logFilter, setLogFilter] = useState('all');

  async function loadData() {
    setLoading(true);
    const data = await getDetailedIntelligenceLogAction(30);
    setItems(data as IntelItem[]);
    setLoading(false);
  }

  async function triggerManualScan() {
    setScanning(true);
    const { generateNewIntelligenceAction } = await import('@/lib/actions');
    const res = await generateNewIntelligenceAction();
    if (res.success) {
      await loadData();
    }
    setScanning(false);
  }

  async function openLogs() {
    setShowLogs(true);
    // getDetailedIntelligenceLogAction with higher limit
    const data = await getDetailedIntelligenceLogAction(150);
    setLogItems(data as IntelItem[]);
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredItems = items.filter(item => item.type === activeTab);
  const activeCategory = CATEGORIES.find(c => c.id === activeTab);

  // Modal filtering
  const filteredLogs = logItems.filter(log => {
    const matchesSearch = log.titre.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         log.contenu.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = logFilter === 'all' || log.type === logFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative w-full max-w-6xl mx-auto py-12 px-4 min-h-[700px] flex flex-col items-center">
      {/* HUD Framing */}
      <HudCorners color="#d4af37" opacity={0.2} size={40} />
      
      {/* Control Header */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 mb-16 relative z-20">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 text-gold animate-pulse">
            <Cpu size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black italic uppercase text-white athletic-title athletic-skew tracking-tight">Aura <span className="text-gold">Intelligence</span></h2>
            <p className="text-sm font-mono text-white/70 uppercase tracking-[0.3em]">Assistant IA // Analyse & Stratégie</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={triggerManualScan}
            disabled={scanning}
            className="px-6 py-3 rounded-xl bg-gold/10 border border-gold/20 text-gold hover:bg-gold/20 transition flex items-center gap-2 group relative overflow-hidden"
          >
            {scanning ? (
              <RefreshCcw size={16} className="animate-spin" />
            ) : (
              <Zap size={16} className="group-hover:scale-125 transition-transform" />
            )}
            <span className="text-[10px] font-black uppercase tracking-widest italic">{scanning ? 'Analyse en cours...' : 'Analyse Manuelle'}</span>
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>

          <button 
            onClick={openLogs}
            className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/40 hover:bg-gold/10 transition group flex items-center gap-2"
          >
            <Database size={16} className="text-white/40 group-hover:text-gold" />
            <span className="text-[10px] font-black uppercase text-white tracking-widest italic">Archives</span>
          </button>
          
          <button 
            onClick={loadData}
            className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-gold/40 hover:bg-gold/10 transition group"
          >
            <RefreshCcw size={20} className={`text-white/70 group-hover:text-gold ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Historical Logs Modal */}
      <AuraMatrixArchivesModal
        showLogs={showLogs}
        setShowLogs={setShowLogs}
        logItems={logItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        logFilter={logFilter}
        setLogFilter={setLogFilter}
        CATEGORIES={CATEGORIES}
      />

      {/* Central Matrix Visualization */}
      <div className="relative w-full aspect-square md:aspect-video flex items-center justify-center">
        {/* Neural Discovery Engine (PixiJS v8 Layer) */}
        <MatrixDiscoveryRenderer 
          nodes={CATEGORIES.map((cat, i) => {
            const angle = (i / CATEGORIES.length) * Math.PI * 2;
            return {
              id: cat.id,
              x: 50 + Math.cos(angle) * 42,
              y: 50 + Math.sin(angle) * 42,
              color: cat.color
            };
          })}
          activeNodeId={activeTab}
        />

        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
              <stop offset="50%" stopColor="#d4af37" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* We'll draw lines from center to nodes */}
          {CATEGORIES.map((cat, i) => {
            const angle = (i / CATEGORIES.length) * Math.PI * 2;
            const x2 = (50 + Math.cos(angle) * 35).toFixed(4);
            const y2 = (50 + Math.sin(angle) * 35).toFixed(4);
            return (
              <motion.line
                key={cat.id}
                x1="50%" y1="50%"
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="url(#line-grad)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: i * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Central Core */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-30 w-40 h-40 rounded-full flex items-center justify-center bg-navy-deep/80 backdrop-blur-2xl border-2 border-gold/40 shadow-glass-luminous"
        >
          {/* Layered Orbitals */}
          <div className="absolute inset-0 rounded-full border-[0.5px] border-gold/20 animate-[ping_4s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-[1px] border-dashed border-gold/30 animate-[spin_15s_linear_infinite]" />
          <div className="absolute inset-6 rounded-full border-[2px] border-dotted border-white/5 animate-[spin_20s_linear_reverse_infinite]" />
          <div className="absolute inset-10 rounded-full border-[1px] border-gold/10 animate-[pulse_5s_ease-in-out_infinite]" />
          
          <Database size={48} className="text-gold drop-shadow-glow" />
          
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-black text-gold uppercase tracking-[0.4em] italic drop-shadow-glow">
            MOTEUR AURA 0x01
          </div>
        </motion.div>

        {/* Outer Circular Nodes */}
        {CATEGORIES.map((cat, i) => {
          const angle = (i / CATEGORIES.length) * Math.PI * 2;
          const dist = 42; // distance from center in %
          const categoryItems = items.filter(item => item.type === cat.id);
          const hasCritical = categoryItems.some(item => item.gravite === 'critical');
          const hasWarning = categoryItems.some(item => item.gravite === 'warning');

          return (
            <motion.button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: `${Math.cos(angle) * dist}%`, 
                y: `${Math.sin(angle) * dist}%` 
              }}
              whileHover={{ scale: 1.1 }}
              className={`absolute z-40 p-5 rounded-[2.5rem] border-2 transition flex flex-col items-center gap-3 backdrop-blur-3xl shadow-glass relative group/node ${
                activeTab === cat.id 
                  ? 'bg-white/10 border-white shadow-glass-luminous' 
                  : 'bg-navy-deep/60 border-white/10 opacity-70 hover:opacity-100 hover:bg-white/5'
              }`}
              style={{ borderColor: activeTab === cat.id ? cat.color : (hasCritical ? '#f43f5e' : (hasWarning ? '#fbbf24' : 'rgba(255,255,255,0.1)')) }}
            >
              {/* Critical/Warning Pulse */}
              {(hasCritical || hasWarning) && (
                <div className={`absolute inset-0 rounded-[2.5rem] animate-ping opacity-20 ${hasCritical ? 'bg-rose-500' : 'bg-gold'}`} />
              )}

              <div 
                className="p-3.5 rounded-2xl shadow-inner relative overflow-hidden"
                style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
              >
                <cat.icon size={28} className="drop-shadow-glow" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45 transform -translate-x-1/2 translate-y-1/2 group-hover/node:translate-x-full transition-transform duration-700" />
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-black uppercase text-white tracking-[0.3em] italic athletic-title athletic-skew">{cat.label}</span>
                {categoryItems.length > 0 && (
                  <span className="text-[8px] font-mono text-white/40 mt-1 uppercase">[{categoryItems.length} Données]</span>
                )}
              </div>
              
              {activeTab === cat.id && (
                <motion.div 
                  layoutId="active-node-ring"
                  className="absolute -inset-2 rounded-[3rem] border border-white/20 animate-pulse" 
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Floating Insight Cards (Peripheral) */}
      <AuraMatrixInsightCards 
        filteredItems={filteredItems}
        activeCategory={activeCategory}
      />

      {/* Matrix Status Ticker */}
      <div className="mt-16 w-full flex items-center gap-6 overflow-hidden border-y border-white/5 py-4 bg-white/[0.01]">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-[10px] font-black text-gold uppercase tracking-widest italic">Flux de données:</span>
        </div>
        <div className="flex gap-12 animate-scroll-x">
          {items.slice(0, 5).map((item, i) => (
            <span key={i} className="text-[9px] font-mono text-white/60 uppercase whitespace-nowrap">
              {item.type} :: {item.titre} :: AT_CLOCK_{new Date(item.date).getTime()} :: SUCCESS_LINK
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
