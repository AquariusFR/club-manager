"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toggleKillSwitchAction, getKillSwitchStatusAction } from "@/lib/actions";
import HudCorners from "./HudCorners";

export default function KillSwitchButton() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await getKillSwitchStatusAction();
        setEnabled(res?.enabled ?? false);
      } catch (e) {
        console.error("Failed to fetch kill switch status:", e);
        setEnabled(false);
      }
    }
    checkStatus();
  }, []);

  const handleToggle = async () => {
    if (enabled === null) return;
    setIsPending(true);
    try {
      const res = await toggleKillSwitchAction(!enabled);
      if (res.enabled !== undefined) {
        setEnabled(res.enabled);
      }
    } catch (e) {
      console.error("Kill switch toggle failed:", e);
    } finally {
      setIsPending(false);
    }
  };

  if (enabled === null) return (
    <div className="glass-card p-6 border-white/5 bg-white/[0.01] flex items-center justify-between opacity-50">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5">
          <Loader2 className="animate-spin text-white/80" />
        </div>
        <div className="text-sm font-black text-white/80 uppercase tracking-tight">INITIALISATION...</div>
      </div>
    </div>
  );

  return (
    <div className="glass-card p-6 border-white/5 bg-white/[0.01] flex items-center justify-between group overflow-hidden relative shadow-glass-luminous">
      <HudCorners color={enabled ? "#f43f5e" : "#d4af37"} opacity={0.1} />
      
      {/* ⚠️ Industrial Background Stripes */}
      <div className="absolute inset-x-0 -top-12 h-20 opacity-[0.03] rotate-3 pointer-events-none">
        <div className="w-[200%] h-full bg-[repeating-linear-gradient(45deg,#000,#000_10px,#d4af37_10px,#d4af37_20px)] animate-shimmer" />
      </div>

      <AnimatePresence mode="wait">
        {enabled && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-rose-500/10 animate-pulse pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center gap-6 z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition duration-700 relative overflow-hidden ${
          enabled 
            ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] scale-110' 
            : 'bg-white/5 border-white/10 text-white/40 group-hover:text-gold group-hover:border-gold/30'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : enabled ? (
            <ShieldAlert size={32} className="shadow-gold" />
          ) : (
            <ShieldCheck size={32} />
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/40 animate-ping" />
            <h4 className={`text-[10px] font-black uppercase tracking-[0.5em] italic ${enabled ? 'text-rose-500' : 'text-white/40'}`}>
              CRITICAL_NODE_0xEE
            </h4>
          </div>
          <div className="text-xl font-black text-white uppercase tracking-tighter athletic-title athletic-skew italic">
            {enabled ? (
              <span className="text-rose-500 animate-pulse">FORCE STOP ACTIVE</span>
            ) : (
              <span className="opacity-80">SYSTEM NOMINAL</span>
            )}
          </div>
        </div>
      </div>

      <button
        disabled={isPending}
        onClick={handleToggle}
        className={`z-10 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition duration-500 relative overflow-hidden group/btn ${
          enabled 
            ? 'bg-pitch-green text-navy-deep shadow-glass-green' 
            : 'bg-white/5 text-white/40 border border-white/10 hover:bg-rose-500 hover:text-white hover:border-rose-500 shadow-2xl'
        }`}
      >
        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12" />
        <span className="relative z-10 italic">
          {isPending ? 'SYNC_IN_PROGRESS...' : enabled ? 'RESTORE DATA FLOW' : 'INITIATE TERMINATION'}
        </span>
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
}
