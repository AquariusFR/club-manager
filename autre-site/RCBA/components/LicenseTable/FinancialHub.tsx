import React from 'react';
import { Euro, Trash2, Cpu } from "lucide-react";
import HudCorners from "../HudCorners";
import MassActionButton from "../MassActionButton";
import { sendBulkLicenseRemindersAction } from "@/lib/actions";

interface FinancialHubProps {
  totalExpected: number;
  collectionRate: number;
  missing: number;
  unpaidCount: number;
  incompleteCount: number;
  selectedIds: number[];
  loading: number | null;
  handleBulkDelete: () => void;
  setShowOCR: (val: boolean) => void;
}

export function FinancialHub({
  totalExpected,
  collectionRate,
  missing,
  unpaidCount,
  incompleteCount,
  selectedIds,
  loading,
  handleBulkDelete,
  setShowOCR
}: FinancialHubProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative">
      <div className="glass-card bg-white/[0.01] border-white/5 p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl backdrop-blur-xl border-t-white/10 transition hover:bg-white/[0.03]">
        <HudCorners color="#d4af37" opacity={0.1} />
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition duration-700" />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4 italic">Capital Attendu</h3>
            <div className="flex items-baseline gap-3">
              <span className="athletic-title text-5xl text-white athletic-skew tracking-tight">{totalExpected.toLocaleString('fr-FR')}</span>
              <span className="text-gold font-black text-xl">€</span>
            </div>
          </div>
          <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mt-6 flex items-center gap-2 border-t border-white/5 pt-4">
            <Euro size={12} className="text-gold/50" /> Tarifs : 50€ (Dirigeant) · 140€ (U6-U9) · 150€ (U10-U13) · 160€ (U15-U18) · 180€ (Senior/Vét.)
          </div>
        </div>
      </div>

      <div className="glass-card bg-white/[0.01] border-white/5 p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl backdrop-blur-xl border-t-white/10 transition hover:bg-white/[0.03]">
        <HudCorners color="#00ff64" opacity={0.1} />
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-pitch-green/10 rounded-full blur-3xl group-hover:bg-pitch-green/20 transition duration-700" />
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pitch-green mb-4 italic">Performance Recouvrement</h3>
            <div className="flex items-baseline gap-3">
              <span className="athletic-title text-5xl text-pitch-green athletic-skew tracking-tight">{collectionRate}</span>
              <span className="text-pitch-green/50 text-2xl font-black">%</span>
            </div>
          </div>
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">Ratio de Liquidation</span>
              <span className="text-[8px] font-black text-pitch-green uppercase tracking-widest leading-none">{collectionRate}%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 shadow-inner p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-pitch-green/50 to-pitch-green rounded-full transition duration-1000 ease-out shadow-glow-green" 
                style={{ width: `${collectionRate}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card bg-white/[0.01] border-white/5 p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl backdrop-blur-xl border-t-white/10 transition hover:bg-white/[0.03]">
        <HudCorners color="#ef4444" opacity={0.1} />
        <div className="absolute -right-12 -top-12 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:bg-rose-500/20 transition duration-700" />
        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-rose-400 mb-4 italic">Régularisations Requises</h3>
              <div className="flex items-baseline gap-3">
                <span className="athletic-title text-5xl text-rose-500 athletic-skew tracking-tight">{missing.toLocaleString('fr-FR')}</span>
                <span className="text-rose-500/50 font-black text-xl">€</span>
              </div>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] font-black text-gold uppercase tracking-widest italic">{incompleteCount} Dossiers</span>
              <span className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none">Incomplets</span>
            </div>
          </div>
          <div className="relative z-20 flex flex-col gap-3">
            <MassActionButton 
              label="RELANCER LES IMPAYÉS" 
              description={`Cette action initiera une séquence de rappel par email à l'attention des ${unpaidCount} licenciés en retard de paiement.`}
              action={() => sendBulkLicenseRemindersAction('unpaid')} 
            />
            <MassActionButton 
              label="RELANCER LES DOSSIERS INCOMPLETS" 
              description={`Cette action contactera les ${incompleteCount} licenciés ayant réglé mais dont le dossier est incomplet.`}
              action={() => sendBulkLicenseRemindersAction('incomplete')} 
            />
            {selectedIds.length > 0 && (
              <button 
                onClick={handleBulkDelete}
                disabled={loading === -1}
                className="w-full py-4 rounded-xl bg-rose-500 border border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.2)] text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-600 transition active:scale-95 flex items-center justify-center gap-3"
              >
                <Trash2 size={14} /> SUPPRIMER ({selectedIds.length}) SÉLECTION(S)
              </button>
            )}

            <button 
              onClick={() => setShowOCR(true)}
              className="w-full py-4 rounded-xl bg-gold/10 border border-gold/40 text-gold shadow-[0_0_20px_rgba(212,175,55,0.1)] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gold hover:text-navy-deep transition active:scale-95 flex items-center justify-center gap-3"
            >
              <Cpu size={14} /> NEURAL SCANNER (IA)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
