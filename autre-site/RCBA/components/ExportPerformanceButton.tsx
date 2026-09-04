'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface ExportPerformanceButtonProps {
  data: any[];
}

export default function ExportPerformanceButton({ data }: ExportPerformanceButtonProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    const headers = ["ID", "Prenom", "Nom", "Equipe", "Intensité Moyenne", "Fatigue Moyenne", "Logs", "Mood"];
    const rows = data.map(p => [
      p.id,
      p.prenom,
      p.nom,
      p.equipe_nom,
      p.avg_intensity?.toFixed(2) || '0',
      p.avg_fatigue?.toFixed(2) || '0',
      p.log_count,
      p.latest_mood || 'N/A'
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `RCBA_Performance_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={exportToCSV}
      className="flex items-center gap-2 px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-2xl transition group"
    >
      <Download size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
      <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Exporter CSV</span>
    </button>
  );
}
