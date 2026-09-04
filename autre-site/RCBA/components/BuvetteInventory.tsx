'use client';

import React, { useState, useOptimistic, startTransition } from 'react';
import { 
  Package, 
  Plus, 
  Minus, 
  AlertCircle, 
  RefreshCw,
  Search,
  Box,
  LayoutGrid,
  Save,
  X,
  History,
  ArrowUpRight,
  ArrowDownRight,
  WifiOff,
  Cpu,
  Trophy,
  Activity,
  ArrowRight
} from "lucide-react";
import { updateBuvetteStockAction, batchUpdateBuvetteStockAction, getBuvetteTransactionsAction, addBuvetteStockAction } from "@/lib/actions";
import MagneticWrapper from "./MagneticWrapper";
import HudCorners from "./HudCorners";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

interface StockItem {
  id: number;
  nom: string;
  quantite: number;
  seuil_alerte: number;
  categorie: string;
  derniere_maj: string;
}

const PRICING_MOCK: Record<string, number> = {
  "Demi Pression": 3.0,
  "Pinte Pression": 5.0,
  "Bière Bouteille": 4.0,
  "Hot Dog": 4.0,
  "Frites": 3.0,
  "Chips": 2.0,
  "Coca-Cola": 2.5,
  "Eau Plate": 1.5,
  "Café": 1.5,
  "Croque Monsieur": 4.5,
  "Jus d'Orange": 2.5
};

const getPrice = (nom: string, categorie: string) => {
  if (PRICING_MOCK[nom]) return PRICING_MOCK[nom];
  const cat = categorie.toLowerCase();
  if (cat.includes('bière') || cat.includes('alcool')) return 4.0;
  if (cat.includes('snack') || cat.includes('food')) return 3.5;
  if (cat.includes('soft') || cat.includes('boisson')) return 2.5;
  return 2.0;
};

export default function BuvetteInventory({ initialStocks }: { initialStocks: StockItem[] }) {
  const [stocks, setStocks] = useState(initialStocks);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'batch' | 'history' | 'add'>('grid');
  const [batchDeltas, setBatchDeltas] = useState<Record<number, number>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'alert' | string>('all');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [syncError, setSyncError] = useState(false);
  
  const [optimisticStocks, addOptimisticStock] = useOptimistic(
    stocks,
    (state, update: { id: number, delta: number } | { type: 'batch', deltas: Record<number, number> }) => {
      if ('type' in update && update.type === 'batch') {
        return state.map(item => ({
          ...item,
          quantite: Math.max(0, item.quantite + (update.deltas[item.id] || 0))
        }));
      }
      if ('id' in update) {
        return state.map(item => 
          item.id === update.id 
            ? { ...item, quantite: Math.max(0, item.quantite + update.delta) }
            : item
        );
      }
      return state;
    }
  );
  
  const categories = Array.from(new Set(stocks.map(s => s.categorie)));

  useEffect(() => {
    if (viewMode === 'history') {
      getBuvetteTransactionsAction().then(res => {
        if (res.success && res.data) {
          setTransactions(res.data);
        }
      });
    }
  }, [viewMode]);

  const handleAdjust = async (id: number, delta: number) => {
    startTransition(() => {
      addOptimisticStock({ id, delta });
    });
    
    try {
      const result = await updateBuvetteStockAction(id, delta);
      if (result.success) {
        setSyncError(false);
        setStocks(prev => prev.map(item => 
          item.id === id ? { ...item, quantite: Math.max(0, item.quantite + delta) } : item
        ));
      } else {
        setSyncError(true);
      }
    } catch (e) {
      setSyncError(true);
    }
  };

  const handleBatchDelta = (id: number, delta: number) => {
    setBatchDeltas(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + delta
    }));
  };

  const saveBatch = async () => {
    setIsSaving(true);
    startTransition(() => {
      addOptimisticStock({ type: 'batch', deltas: batchDeltas });
    });
    
    try {
      const result = await batchUpdateBuvetteStockAction(batchDeltas);
      if (result.success) {
        setStocks(prev => prev.map(item => ({
          ...item,
          quantite: Math.max(0, item.quantite + (batchDeltas[item.id] || 0))
        })));
        setBatchDeltas({});
        setViewMode('grid');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStocks = optimisticStocks.filter(s => {
    const matchesSearch = s.nom.toLowerCase().includes(search.toLowerCase()) || 
                          s.categorie.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'alert' && s.quantite <= s.seuil_alerte) ||
                         s.categorie === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const totalCapital = optimisticStocks.reduce((acc, s) => acc + (s.quantite * getPrice(s.nom, s.categorie)), 0);
  const lostRevenue = optimisticStocks.reduce((acc, s) => {
    if (s.quantite < s.seuil_alerte) return acc + ((s.seuil_alerte - s.quantite) * getPrice(s.nom, s.categorie));
    return acc;
  }, 0);

  return (
    <div className="space-y-12">
      {/* 🏙️ CONTROL STRIP - ELITE */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 pb-10 border-b border-white/5 relative">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-gold/5 border border-gold/20 flex items-center justify-center text-gold shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-gold/10 scale-0 group-hover:scale-150 transition-transform duration-700 rounded-full" />
            <Box size={28} className="relative z-10" />
          </div>
          <div className="space-y-1">
            <h3 className="athletic-title text-3xl uppercase italic tracking-tighter text-white font-black">
              INVENTAIRE <span className="text-gold">LOGISTIQUE</span>
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-pitch-green shadow-glow animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 italic">Global Supply Monitoring <span className="text-pitch-green">0x82_ACTIVE</span></span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group w-full sm:w-80">
            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" />
            <input 
              type="text" 
              placeholder="FILTRER PAR ASSET..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-[0.2em] focus:border-gold/30 focus:bg-white/[0.04] outline-none transition placeholder:text-white/20 text-white hud-scanline"
            />
          </div>
          
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-3xl shadow-3xl">
            {[
              { mode: 'grid' as const, icon: LayoutGrid, label: 'VENTE' },
              { mode: 'batch' as const, icon: RefreshCw, label: 'RENTRER STOCK' },
              { mode: 'add' as const, icon: Plus, label: 'NOUVEL ASSET' },
              { mode: 'history' as const, icon: History, label: 'HISTORIQUE' }
            ].map((btn) => (
              <MagneticWrapper key={btn.mode}>
                <button 
                  onClick={() => setViewMode(btn.mode)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl transition duration-500 ${viewMode === btn.mode ? 'bg-gold/10 text-gold shadow-glow-gold border border-gold/20' : 'text-white/30 hover:text-white/60'}`}
                >
                  <btn.icon size={18} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{btn.label}</span>
                </button>
              </MagneticWrapper>
            ))}
          </div>
        </div>
      </div>

      {/* 📊 TELEMETRY MODULES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "CAPITAL IMMOBILISÉ", value: totalCapital.toFixed(2), unit: "€", icon: Box, color: "text-white" },
          { title: "PERTE PRÉDICTIVE", value: lostRevenue > 0 ? `-${lostRevenue.toFixed(2)}` : "0.00", unit: "€", icon: AlertCircle, color: lostRevenue > 0 ? "text-rose-500" : "text-white/40" },
          { title: "SANTÉ RÉSEAU", value: "FLUX OPTIMAL", unit: "", icon: WifiOff, color: "text-pitch-green", status: true },
          { title: "VALEUR DERBY", value: "x1.4", unit: "COEFF", icon: Trophy, color: "text-gold" }
        ].map((mod, i) => (
          <div key={i} className="glass-card p-8 border-white/5 bg-white/[0.01] rounded-3xl relative overflow-hidden group shadow-2xl backdrop-blur-md hud-scanline">
            <HudCorners color="#d4af37" opacity={0.05} />
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
               <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(212,175,55,0.1)_3px,transparent_3px)] bg-[length:100%_4px] animate-scan" />
            </div>
            <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-10 scale-150 transition-opacity">
              <mod.icon size={64} />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-1 h-3 rounded-full ${mod.color.replace('text-', 'bg-')}`} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 italic">{mod.title}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`athletic-title athletic-skew text-3xl font-black italic tracking-tighter ${mod.color} drop-shadow-glow`}>{mod.value}</span>
                <span className={`text-[10px] font-black uppercase italic ${mod.color} opacity-40`}>{mod.unit}</span>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-white/20 transition duration-700" />
          </div>
        ))}
      </div>

      {/* ⚡ VIEWPORT RENDERING */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          >
            {filteredStocks.map((item, idx) => {
              const isLow = item.quantite <= item.seuil_alerte;
              const isCritical = item.quantite === 0;
              const targetMax = Math.max(item.quantite, item.seuil_alerte * 2, 20);
              const percentage = Math.min(100, Math.max(0, (item.quantite / targetMax) * 100));
              const radius = 28;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (percentage / 100) * circumference;

              return (
                <div 
                  key={item.id}
                  className={`glass-card group relative p-10 border-white/5 bg-white/[0.01] rounded-[2.5rem] hover:bg-white/[0.025] transition duration-700 overflow-hidden shadow-3xl hud-scanline hud-grain ${
                    isCritical ? 'ring-1 ring-rose-500/20 bg-rose-500/[0.02]' : isLow ? 'ring-1 ring-amber-500/10' : ''
                  }`}
                >
                  <HudCorners color={isCritical ? '#f43f5e' : isLow ? '#f59e0b' : '#d4af37'} opacity={isCritical ? 0.3 : 0.1} />
                  
                  {isCritical && (
                    <div className="absolute inset-0 bg-rose-500/[0.02] animate-pulse pointer-events-none" />
                  )}
                  
                  {/* Item Header */}
                  <div className="flex justify-between items-start mb-12">
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 mb-2">
                        <Activity size={12} className={isLow ? "text-rose-500 animate-pulse" : "text-pitch-green"} />
                        <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic">{item.categorie}</span>
                      </div>
                      <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none group-hover:text-gold transition duration-500 group-hover:translate-x-2">
                        {item.nom}
                      </h3>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                       <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic group-hover:text-gold/40 transition-colors">Asset ID 0x{item.id}</span>
                       {isLow && (
                         <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 shadow-2xl ${isCritical ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 animate-pulse' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                           {isCritical ? 'RUPTURE' : 'ALERTE STOCK'}
                         </div>
                       )}
                    </div>
                  </div>

                  {/* Visualization Card */}
                  <div className="relative z-10 bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 mb-10 group-hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div className="relative w-20 h-20 flex items-center justify-center group-hover:scale-110 transition-transform duration-1000">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="40" cy="40" r={radius} className="fill-none stroke-white/5 stroke-[6]" />
                            <circle 
                              cx="40" cy="40" r={radius} 
                              className="fill-none stroke-[6] transition duration-1000 ease-out animate-pulse"
                              style={{ 
                                strokeDasharray: circumference, 
                                strokeDashoffset: offset,
                                stroke: isCritical ? '#f43f5e' : isLow ? '#f59e0b' : '#34d399',
                                strokeLinecap: 'round',
                                filter: `drop-shadow(0 0 8px ${isCritical ? '#f43f5ebb' : isLow ? '#f59e0bbb' : '#34d399bb'})`
                              }} 
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center athletic-title italic">
                            <span className={`text-base font-black drop-shadow-glow ${isCritical ? 'text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : isLow ? 'text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-white'}`}>{Math.round(percentage)}%</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic mb-1 block">VALEUR INVENTAIRE</span>
                          <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-black athletic-title athletic-skew tracking-tighter leading-none drop-shadow-glow ${isCritical ? 'text-rose-500' : isLow ? 'text-amber-500' : 'text-white'}`}>
                              {(item.quantite * getPrice(item.nom, item.categorie)).toFixed(2)}
                            </span>
                            <span className="text-sm font-black text-gold italic">€</span>
                          </div>
                          <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.1em] italic">
                             STOCK: {item.quantite} UNITS @ {getPrice(item.nom, item.categorie).toFixed(2)}€
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <MagneticWrapper>
                          <button 
                            onClick={() => handleAdjust(item.id, 1)}
                            className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:bg-gold hover:text-navy-deep hover:border-gold hover:shadow-glow transition active:scale-90"
                          >
                            <Plus size={24} />
                          </button>
                        </MagneticWrapper>
                        <MagneticWrapper>
                          <button 
                            onClick={() => handleAdjust(item.id, -1)}
                            disabled={item.quantite === 0}
                            className="w-14 h-14 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/40 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 transition active:scale-90 disabled:opacity-10"
                          >
                            <Minus size={24} />
                          </button>
                        </MagneticWrapper>
                      </div>
                    </div>
                  </div>

                  {/* Footer Stats */}
                  <div className="flex items-center justify-between pt-8 border-t border-white/5 group/footer">
                    <div className="flex items-center gap-3">
                      <Cpu size={14} className="text-white/20 group-hover:text-gold transition-colors" />
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic group-hover:text-white/40 transition-colors">
                        THRESHOLD: {item.seuil_alerte}
                      </span>
                    </div>
                    <button className="flex items-center gap-3 text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-gold transition group-hover/footer:translate-x-3 duration-500 italic">
                       {isLow ? "RESTOCK REQUIS" : "MONITOR PHASE"} <ArrowRight size={14} className="opacity-0 group-hover/footer:opacity-100 transition" />
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : viewMode === 'batch' ? (
          <motion.div 
            key="batch"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card border-white/10 bg-white/[0.01] rounded-[2.5rem] overflow-hidden shadow-3xl relative backdrop-blur-3xl"
          >
            <HudCorners color="#d4af37" opacity={0.1} />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic">ASSET RESOURCE</th>
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic text-center">CURRENT</th>
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic text-center">BATCH ADJUSTMENT</th>
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic text-center">P&L DELTA</th>
                    <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/40 italic text-center">PROJECTED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.02]">
                  {filteredStocks.map((item) => {
                    const delta = batchDeltas[item.id] || 0;
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.015] transition group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                             <div className="w-1.5 h-1.5 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                             <div>
                               <span className="text-base font-black text-white italic group-hover:text-gold transition-colors">{item.nom}</span>
                               <div className="text-[10px] text-white/20 uppercase tracking-widest mt-1 font-bold">{item.categorie}</div>
                             </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-center text-xl athletic-title text-white/30 italic">{item.quantite}</td>
                        <td className="px-10 py-8">
                          <div className="flex items-center justify-center gap-6">
                            <button 
                              onClick={() => handleBatchDelta(item.id, -1)}
                              className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-white/30 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/20 transition active:scale-95"
                            >
                              <Minus size={18} />
                            </button>
                            <div className={`w-20 text-center athletic-title text-4xl athletic-skew ${delta > 0 ? 'text-pitch-green' : delta < 0 ? 'text-amber-500' : 'text-white/10'}`}>
                              {delta === 0 ? "0" : delta > 0 ? `+${delta}` : delta}
                            </div>
                            <button 
                              onClick={() => handleBatchDelta(item.id, 1)}
                              className="w-12 h-12 rounded-2xl border border-white/5 bg-white/5 flex items-center justify-center text-white/30 hover:bg-pitch-green/20 hover:text-pitch-green hover:border-pitch-green/20 transition active:scale-95"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-center">
                          {delta !== 0 ? (
                            <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl font-black athletic-title athletic-skew text-lg tracking-widest ${delta < 0 ? 'bg-pitch-green/5 text-pitch-green border border-pitch-green/10' : 'bg-rose-500/5 text-rose-500 border border-rose-500/10'}`}>
                              {delta < 0 ? '+' : '-'}{Math.abs(delta * getPrice(item.nom, item.categorie)).toFixed(2)}€
                            </div>
                          ) : (
                            <span className="text-white/10 text-[9px] font-black uppercase tracking-widest italic">-- REPOS --</span>
                          )}
                        </td>
                        <td className="px-10 py-8 text-center">
                          <span className={`athletic-title text-3xl italic ${delta !== 0 ? 'text-gold drop-shadow-glow' : 'text-white/10'}`}>
                            {Math.max(0, item.quantite + delta)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-12 bg-white/[0.03] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col gap-4">
                <div className="text-[11px] font-black uppercase text-white/30 tracking-[0.4em] italic flex items-center gap-4">
                  <div className="w-10 h-px bg-white/10" />
                  STAGING MODULE ACTIVE
                  <div className="w-10 h-px bg-white/10" />
                </div>
                {Object.keys(batchDeltas).length > 0 && (() => {
                  const totalPnl = Object.entries(batchDeltas).reduce((acc, [id, d]) => {
                    const it = stocks.find(s => s.id === parseInt(id));
                    return acc + (it ? -d * getPrice(it.nom, it.categorie) : 0);
                  }, 0);
                  return (
                    <div className={`text-4xl font-black athletic-title athletic-skew tracking-tighter ${totalPnl >= 0 ? 'text-pitch-green' : 'text-rose-500'} italic`}>
                      NET P&L PROJECTED: JOURNALIER {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}€
                    </div>
                  );
                })()}
              </div>
              <div className="flex items-center gap-6">
                <MagneticWrapper>
                  <button 
                    onClick={() => { setBatchDeltas({}); setViewMode('grid'); }}
                    className="flex items-center gap-4 px-10 py-5 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:bg-white/5 hover:text-white transition italic"
                  >
                    <X size={18} /> RESET STAGE
                  </button>
                </MagneticWrapper>
                <MagneticWrapper>
                  <button 
                    onClick={saveBatch}
                    disabled={isSaving || Object.keys(batchDeltas).length === 0}
                    className="flex items-center gap-4 px-12 py-5 rounded-2xl bg-gold text-navy-deep text-[11px] font-black uppercase tracking-[0.2em] shadow-glow-gold hover:scale-105 active:scale-95 transition disabled:opacity-20 italic whitespace-nowrap"
                  >
                    {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                    VALIDER MANIFESTE UNITAIRE
                  </button>
                </MagneticWrapper>
              </div>
            </div>
          </motion.div>
        ) : viewMode === 'history' ? (
          <motion.div 
            key="history"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border-white/10 bg-white/[0.01] rounded-[2.5rem] p-12 overflow-hidden shadow-3xl relative"
          >
            <HudCorners color="#d4af37" opacity={0.1} />
            <div className="flex items-center justify-between mb-12">
               <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter flex items-center gap-5">
                 <History className="text-gold" size={28} /> REGISTRE DES FLUX RÉGIE
               </h3>
               <div className="flex items-center gap-4 text-[9px] font-black text-white/20 tracking-widest uppercase italic">
                 <div className="w-2 h-2 rounded-full bg-pitch-green shadow-glow" />
                 LIVE FEED ACTIVE
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase font-black tracking-[0.4em] text-white/40 bg-white/5">
                    <th className="py-6 px-8 rounded-tl-3xl">VECTOR ID</th>
                    <th className="py-6 px-8">RESOURCE</th>
                    <th className="py-6 px-8">DELTA UNIT</th>
                    <th className="py-6 px-8">REVENUE FLUX</th>
                    <th className="py-6 px-8">VALIDATOR</th>
                    <th className="py-6 px-8 rounded-tr-3xl text-right">TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {transactions.length > 0 ? transactions.map((t, i) => (
                    <tr key={i} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                      <td className="py-6 px-8 font-black text-white/20 italic group-hover:text-gold/40 transition-colors">0x{t.id.toString(16).toUpperCase()}</td>
                      <td className="py-6 px-8 text-white font-black italic uppercase tracking-tight">{t.nom}</td>
                      <td className="py-6 px-8">
                        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic ${t.delta > 0 ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-white/5 text-white/40 border border-white/5'}`}>
                          {t.delta > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {t.delta > 0 ? '+' : ''}{t.delta} UNITS
                        </div>
                      </td>
                      <td className="py-6 px-8 font-black italic">
                        {(() => {
                          const flow = -t.delta * getPrice(t.nom, "Snack");
                          return (
                            <div className={`text-xl font-black athletic-title athletic-skew tracking-wider ${flow >= 0 ? 'text-pitch-green' : 'text-rose-500'}`}>
                              {flow >= 0 ? '+' : ''}{flow.toFixed(2)}€
                            </div>
                          );
                        })()}
                      </td>
                      <td className="py-6 px-8">
                         <div className="flex items-center gap-4 group/user cursor-default">
                           <div className="w-8 h-8 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold text-[10px] font-black shadow-2xl group-hover/user:scale-110 transition-transform">
                             {t.user.charAt(0).toUpperCase()}
                           </div>
                           <span className="text-[11px] font-black text-white/80 uppercase tracking-widest">{t.user}</span>
                         </div>
                      </td>
                      <td className="py-6 px-8 text-right text-white/20 text-[10px] font-black uppercase tracking-widest italic">
                        {new Date(t.created_at + 'Z').toLocaleString('fr-FR', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="py-24 text-center">
                        <div className="space-y-4 opacity-20">
                          <History size={48} className="mx-auto" />
                          <p className="text-[12px] font-black uppercase tracking-[0.6em] italic">REGISTRE VIDE — AUCUN FLUX DÉTECTÉ</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : viewMode === 'add' ? (
          <motion.div 
            key="add"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card max-w-2xl mx-auto border-white/10 bg-white/[0.01] rounded-[2.5rem] p-12 overflow-hidden shadow-3xl relative"
          >
            <HudCorners color="#d4af37" opacity={0.1} />
            <div className="flex items-center justify-between mb-12">
               <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter flex items-center gap-5">
                 <Plus className="text-gold" size={28} /> INITIER NOUVEL ASSET
               </h3>
               <div className="flex items-center gap-4 text-[9px] font-black text-white/20 tracking-widest uppercase italic">
                 <div className="w-2 h-2 rounded-full bg-pitch-green shadow-glow" />
                 CREATION MODE ACTIVE
               </div>
            </div>

            <form action={async (formData) => {
              const nom = formData.get('nom') as string;
              const categorie = formData.get('categorie') as string;
              const quantite = parseInt(formData.get('quantite') as string) || 0;
              const seuil_alerte = parseInt(formData.get('seuil_alerte') as string) || 10;
              
              if (nom && categorie) {
                const res = await addBuvetteStockAction(nom, categorie, quantite, seuil_alerte);
                if (res.success) {
                  // After adding, we could just reload or go back to grid
                  window.location.reload();
                } else {
                  alert(res.error || "Erreur lors de la création.");
                }
              }
            }} className="space-y-8 relative z-10">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">DÉSIGNATION DE L'ASSET (NOM)</label>
                <input required type="text" name="nom" placeholder="Ex: Gobelet RCBA" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:border-gold outline-none hud-scanline" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">CATÉGORIE / TYPE</label>
                <input required type="text" name="categorie" placeholder="Ex: Snack, Boisson, Matériel..." className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 focus:border-gold outline-none hud-scanline" />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">QUANTITÉ INITIALE</label>
                  <input required type="number" min="0" name="quantite" defaultValue="0" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white text-xl athletic-title placeholder:text-white/20 focus:border-gold outline-none hud-scanline" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">SEUIL D'ALERTE (MINIMUM)</label>
                  <input required type="number" min="0" name="seuil_alerte" defaultValue="10" className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-white text-xl athletic-title placeholder:text-white/20 focus:border-gold outline-none hud-scanline" />
                </div>
              </div>

              <div className="pt-8">
                <MagneticWrapper>
                  <button type="submit" className="w-full flex items-center justify-center gap-4 px-12 py-5 rounded-2xl bg-gold text-navy-deep text-[11px] font-black uppercase tracking-[0.2em] shadow-glow-gold hover:scale-[1.02] active:scale-95 transition italic">
                    <Save size={18} /> CONFIRMER L'AJOUT
                  </button>
                </MagneticWrapper>
              </div>

            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
      
      {filteredStocks.length === 0 && viewMode === 'grid' && (
        <div className="p-40 text-center glass-card border-dashed border-white/10 bg-white/[0.01] rounded-[4rem] group relative overflow-hidden backdrop-blur-3xl animate-in zoom-in-95 duration-1000">
           <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent pointer-events-none" />
           <div className="relative z-10 space-y-8">
            <Package size={80} className="mx-auto text-white/5 mb-8 animate-pulse group-hover:scale-125 transition-transform duration-1000" />
            <div className="space-y-3">
              <p className="text-[16px] font-black uppercase text-white tracking-[0.8em] italic">RAYON VIDE</p>
              <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.4em] italic italic">Aucun asset RCBA ne correspond aux paramètres de recherche</p>
            </div>
            <MagneticWrapper>
              <button 
                onClick={() => {setSearch(''); setActiveFilter('all');}}
                className="mt-8 px-12 py-4 rounded-3xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-white/60 hover:bg-gold hover:text-navy-deep hover:border-gold transition"
              >
                RÉINITIALISER FILTRES
              </button>
            </MagneticWrapper>
          </div>
        </div>
      )}

      {/* 🔮 Logistics Flux Status Bar */}
      <div className="pt-20">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 opacity-40 hover:opacity-100 transition-opacity duration-700">
           <div className="flex items-center gap-6">
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white italic">Active Node: <span className="text-gold">BUVETTE_01</span></span>
              <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white italic">Uptime: <span className="text-pitch-green">99.9%</span></span>
           </div>
           <div className="flex-1 max-w-md h-[1px] bg-white/5 relative overflow-hidden">
              <motion.div 
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-1/4 h-full bg-gold/40"
              />
           </div>
           <div className="text-[8px] font-black uppercase tracking-[0.5em] text-white/40 italic">RCBA Intelligence Division © 2024</div>
        </div>
      </div>
    </div>
  );
}
