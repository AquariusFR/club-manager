"use client";

import { useState } from "react";
import { Timer, BrainCircuit, Swords } from "lucide-react";
import MagneticWrapper from "@/components/MagneticWrapper";

export default function CoachDashboardTabs({ 
  presseView, 
  formateurView,
  tactiqueView 
}: { 
  presseView: React.ReactNode, 
  formateurView: React.ReactNode,
  tactiqueView: React.ReactNode
}) {
  const [mode, setMode] = useState<'presse' | 'formateur' | 'tactique'>('presse');

  return (
    <div className="space-y-8">
      {/* TABS */}
      <div className="flex items-center gap-4 bg-white/[0.02] p-2 rounded-3xl border border-white/5 w-fit relative z-20">
        <MagneticWrapper>
          <button 
            onClick={() => setMode('presse')}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition ${mode === 'presse' ? 'bg-pitch-green text-navy-deep font-black shadow-[0_0_20px_rgba(74,222,128,0.3)]' : 'text-white/60 hover:text-white'}`}
          >
            <Timer size={20} className={mode === 'presse' ? 'text-navy-deep' : 'text-pitch-green'} />
            <span className="uppercase tracking-widest text-[11px] italic">Coach Pressé</span>
          </button>
        </MagneticWrapper>
        <MagneticWrapper>
          <button 
            onClick={() => setMode('formateur')}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition ${mode === 'formateur' ? 'bg-blue-500 text-white font-black shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-white/60 hover:text-white'}`}
          >
            <BrainCircuit size={20} className={mode === 'formateur' ? 'text-white' : 'text-blue-500'} />
            <span className="uppercase tracking-widest text-[11px] italic">Coach Formateur</span>
          </button>
        </MagneticWrapper>
        <MagneticWrapper>
          <button 
            onClick={() => setMode('tactique')}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition ${mode === 'tactique' ? 'bg-amber-500 text-white font-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'text-white/60 hover:text-white'}`}
          >
            <Swords size={20} className={mode === 'tactique' ? 'text-white' : 'text-amber-500'} />
            <span className="uppercase tracking-widest text-[11px] italic">Tactique</span>
          </button>
        </MagneticWrapper>
      </div>

      {/* VIEWS */}
      <div className="transition duration-500">
        {mode === 'presse' ? presseView : mode === 'formateur' ? formateurView : tactiqueView}
      </div>
    </div>
  );
}
