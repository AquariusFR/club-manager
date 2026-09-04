"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Download, Calendar } from "lucide-react";

export function PerformanceTrendsChart({ data, title, variant }: { data: any[]; title: string; variant?: string }) {
  const maxVal = 10; // Max RPE is 10
  
  return (
    <div className={`glass-card p-8 relative overflow-hidden ${variant === 'blue' ? 'border-blue-500/20 bg-blue-500/[0.02]' : 'border-gold/20 bg-gold/[0.02]'} rounded-[2rem]`}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-white text-lg font-black uppercase tracking-tighter italic">{title}</h3>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Charge vs Fatigue (Tendances Athlétiques)</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Intensité</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-white/20"></div>
            <span className="text-[8px] font-black text-white/60 uppercase tracking-widest">Fatigue</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between gap-1 lg:gap-3 px-2">
        {data.length > 0 ? data.map((d, i) => {
          const intensityHeight = (d.avg_intensity || 0) * 10; // %
          const fatigueHeight = (d.avg_fatigue || 0) * 10; // %
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center group relative">
              <div className="w-full h-64 bg-white/[0.03] rounded-t-lg relative overflow-hidden">
                {/* Fatigue Bar (Background) */}
                <div 
                  className="absolute bottom-0 w-full bg-white/5 border-t border-white/10 transition duration-700 delay-[i*50ms]" 
                  style={{ height: `${fatigueHeight}%` }}
                ></div>
                
                {/* Intensity Bar (Foreground) */}
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600/40 to-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)] border-t border-blue-400/50 transition duration-1000 group-hover:from-blue-500/60 transition" 
                  style={{ height: `${intensityHeight}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-white/40 animate-pulse"></div>
                </div>
              </div>
              
              {/* Day Label */}
              <span className="text-[7px] font-black text-white/20 uppercase tracking-tighter mt-3 group-hover:text-blue-400 transition-colors">
                {new Date(d.day).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </span>
              
              {/* Tooltip on hover */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap">
                 <p className="text-[9px] font-black text-blue-400 uppercase italic">I: {d.avg_intensity?.toFixed(1)} | F: {d.avg_fatigue?.toFixed(1)}</p>
              </div>
            </div>
          );
        }) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/5 rounded-3xl">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
              <Calendar size={24} className="text-white/20" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Flux de données interrompu</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ExportPerformanceButton({ data }: { data: any[] }) {
  const handleExport = () => {
    // Simple CSV export logic stub
    const headers = ["ID", "Prenom", "Nom", "Equipe", "Intensite Avg", "Fatigue Avg", "Logs"];
    const rows = data.map(p => [p.id, p.prenom, p.nom, p.equipe_nom, p.avg_intensity, p.avg_fatigue, p.log_count]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "performance_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-bold uppercase tracking-widest transition-colors"
    >
      <Download size={14} />
      <span>Export CSV</span>
    </button>
  );
}

export function PerformanceRangeSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentDays = searchParams.get('days') || '14';

  const handleChange = (days: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('days', days);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:border-blue-500/30 transition group">
      <Calendar size={14} className="text-blue-400 group-hover:scale-110 transition-transform" />
      <select 
        value={currentDays}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent text-[10px] font-black uppercase tracking-widest text-white outline-none cursor-pointer pr-2 italic"
      >
        <option value="7" className="bg-slate-900">7 JOURS</option>
        <option value="14" className="bg-slate-900">14 JOURS</option>
        <option value="30" className="bg-slate-900">30 JOURS</option>
        <option value="90" className="bg-slate-900">90 JOURS</option>
      </select>
    </div>
  );
}
