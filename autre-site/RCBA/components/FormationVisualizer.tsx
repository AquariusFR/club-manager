'use client';

import { useMemo } from 'react';
import { Shield, Target } from 'lucide-react';

interface Player {
  id: number;
  nom: string;
  prenom: string;
  poste: string;
  numero: string;
}

interface FormationVisualizerProps {
  players: Player[];
  teamName: string;
  formation?: string; // e.g. "4-3-3"
}

export default function FormationVisualizer({ players, teamName, formation = "4-3-3" }: FormationVisualizerProps) {
  // Helper to categorize players accurately based on the same logic used in the parent
  const categorized = useMemo(() => {
    const getPosteClass = (p: string) => {
      const l = (p || '').toLowerCase();
      if (l.startsWith('g') || l.includes('garden') || l.includes('gardien')) return 'gk';
      if (l.startsWith('d') || l.includes('defens')) return 'def';
      if (l.startsWith('m') || l.includes('milieu')) return 'mid';
      if (l.startsWith('a') || l.includes('attaq') || l.includes('avant')) return 'att';
      return 'unknown';
    };

    const grouped = {
      gk: [] as Player[],
      def: [] as Player[],
      mid: [] as Player[],
      att: [] as Player[]
    };

    players.forEach(p => {
      const cat = getPosteClass(p.poste);
      if (cat !== 'unknown' && grouped[cat]) {
        grouped[cat].push(p);
      }
    });

    return grouped;
  }, [players]);

  // We want to just show up to 11 players for the graphic, prioritizing those with numbers.
  const selectStarters = (group: Player[], count: number) => {
    return [...group].sort((a, b) => {
      if (a.numero && !b.numero) return -1;
      if (!a.numero && b.numero) return 1;
      return 0;
    }).slice(0, count);
  };

  // Parse formation
  const parts = formation.split('-').map(Number);
  const defCount = parts[0] || 4;
  const midCount = parts[1] || 3;
  const attCount = parts[2] || 3;

  const starters = {
    gk: selectStarters(categorized.gk, 1),
    def: selectStarters(categorized.def, defCount),
    mid: selectStarters(categorized.mid, midCount),
    att: selectStarters(categorized.att, attCount),
  };

  // Utility to map a group of players into horizontal positions centered
  const renderRow = (group: Player[], topPercent: number, rowColor: string) => {
    if (group.length === 0) return null;
    const spacing = 100 / (group.length + 1);

    return group.map((p, i) => {
      const leftPercent = spacing * (i + 1);
      // add slight arching for defenders/attackers to look more like a real formation
      const archOffset = Math.abs(i - (group.length - 1) / 2) * 5; 
      const adjustedTop = topPercent + (topPercent > 50 ? archOffset : -archOffset);
      
      return (
        <div 
          key={p.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
          style={{ top: `${adjustedTop}%`, left: `${leftPercent}%` }}
        >
          <div 
            className="w-6 h-6 md:w-7 md:h-7 rounded-sm border flex items-center justify-center text-[10px] font-black italic shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-125 group-hover:z-10"
            style={{ 
              backgroundColor: `${rowColor}15`, 
              borderColor: `${rowColor}60`, 
              color: rowColor,
              backdropFilter: 'blur(2px)'
            }}
          >
            {p.numero || '?'}
          </div>
          <div className="mt-1 opacity-0 group-hover:opacity-100 absolute top-full transition-opacity bg-navy-deep/90 border border-white/10 px-2 py-0.5 rounded text-[8px] font-black uppercase text-white whitespace-nowrap z-20 shadow-xl pointer-events-none">
            {(p as any).displayName || `${p.prenom.charAt(0)}. ${p.nom}`}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col relative group">
      
      {/* Visualizer header */}
      <div className="flex items-center gap-3 mb-4 px-2">
        <Target size={14} className="text-pitch-green" />
        <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/80">Formation Probable</div>
        <div className="ml-auto px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black text-white italic">
          {formation}
        </div>
      </div>

      {/* The Pitch */}
      <div className="relative aspect-[4/5] bg-[#0c2415] rounded-xl overflow-hidden border border-white/10 shadow-[inner_0_0_50px_rgba(0,0,0,0.8)]">
        {/* Grass pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '100% 12.5%' // creates horizontal pitch stripes
        }} />

        {/* Pitch Lines */}
        <div className="absolute inset-4 border opacity-30 border-white" /> {/* Outer touchline */}
        <div className="absolute top-1/2 left-4 right-4 h-px bg-white opacity-30" /> {/* Halfway line */}
        
        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white opacity-30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white opacity-50 rounded-full" />
        
        {/* Penalty Areas */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/5 h-1/6 border border-b-0 border-white opacity-30" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/4 h-[8%] border border-b-0 border-white opacity-30" />
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-1 h-1 bg-white opacity-50 rounded-full" />
        <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-12 h-6 border-t border-white opacity-30 rounded-t-full" /> {/* D */}

        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2/5 h-1/6 border border-t-0 border-white opacity-30" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/4 h-[8%] border border-t-0 border-white opacity-30" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-1 h-1 bg-white opacity-50 rounded-full" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-12 h-6 border-b border-white opacity-30 rounded-b-full" /> {/* D */}

        {/* Render Players */}
        {renderRow(starters.gk,  85, '#D4AF37')} {/* Gold */}
        {renderRow(starters.def, 68, '#60A5FA')} {/* Blue */}
        {renderRow(starters.mid, 45, '#62CB72')} {/* Green */}
        {renderRow(starters.att, 20, '#F87171')} {/* Red */}

      </div>

      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-pitch-green/20 blur-[60px] pointer-events-none -z-10" />
    </div>
  );
}
