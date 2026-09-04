import React from 'react';
import { getLicenseSessionsAction, getAllCategoriesAction, getAllTeamsAction } from '@/lib/actions';
import LicenseTable from '@/components/LicenseTable';
import PageLabel from "@/components/PageLabel";
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Zap,
  LayoutDashboard,
  Cpu,
  Database
} from 'lucide-react';
import Link from 'next/link';
import HudCorners from '@/components/HudCorners';
import MagneticWrapper from '@/components/MagneticWrapper';

export default async function DirectionLicencesPage({ searchParams }: { searchParams: Promise<{ q?: string; f?: string; cat?: string }> }) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const f = resolvedParams.f || "all";
  const cat = resolvedParams.cat || "all";
  const sessions = await getLicenseSessionsAction(q, f, cat);
  const categories = await getAllCategoriesAction();
  const teams = await getAllTeamsAction();

  return (
    <div className="min-h-screen bg-navy-deep text-white space-y-12 relative pb-32">
      {/* ══════════════════════════════════════════
          ATMOSPHERIC CORE
      ══════════════════════════════════════════ */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gold/5 blur-[250px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-pitch-green/5 blur-[200px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      {/* Header Section */}
      <header className="relative space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-12 border-b border-white/5 relative">
          <HudCorners color="#d4af37" opacity={0.05} />
          <div className="space-y-4">
            <PageLabel 
              section="ADMINISTRATION"
              category="ADHÉSIONS & LICENCIÉS"
              title="GESTION DES LICENCES"
              subtitle="Contrôle et suivi des dossiers d'adhésion, règlements de cotisation et conformité FFF du club."
              variant="gold"
              icon="direction"
            />
          </div>

          <div className="flex items-center gap-10">
            <div className="glass-card px-10 py-6 border-white/10 bg-white/[0.02] flex items-center gap-12 backdrop-blur-3xl shadow-3xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex flex-col relative z-10">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-2">Total Inscrits</span>
                <span className="text-4xl font-black text-white athletic-title athletic-skew leading-none">{sessions.length}</span>
              </div>
              <div className="w-px h-12 bg-white/10 relative z-10" />
              <div className="flex flex-col relative z-10">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-2">Statut Inscriptions</span>
                <span className="text-[10px] font-black text-pitch-green uppercase tracking-[0.3em] italic flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-pitch-green shadow-glow animate-pulse" />
                  OUVERTES
                </span>
              </div>
            </div>
            
            <MagneticWrapper>
              <Link href="/direction/dashboard">
                <button className="bg-white/5 hover:bg-gold border border-white/10 p-6 rounded-[2rem] transition active:scale-95 group shadow-2xl hover:text-navy-deep">
                  <LayoutDashboard size={28} className="transition group-hover:rotate-12" />
                </button>
              </Link>
            </MagneticWrapper>
          </div>
        </div>

        {/* Global KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: 'À Percevoir', value: `${sessions.filter((s: any) => s.paiement_effectue === 0).length}`, icon: Zap, color: 'text-rose-400', bg: 'bg-rose-500/5', border: 'border-rose-500/20' },
            { label: 'Dossiers Incomplets', value: `${sessions.filter((s: any) => s.documents_complets === 0).length}`, icon: FileText, color: 'text-gold', bg: 'bg-gold/5', border: 'border-gold/20' },
            { label: 'Affiliation Club', value: 'FFF #582697', icon: Database, color: 'text-blue-400', bg: 'bg-blue-400/5', border: 'border-blue-400/20' },
            { label: 'Contrôle FFF', value: 'Conforme', icon: ShieldCheck, color: 'text-pitch-green', bg: 'bg-pitch-green/5', border: 'border-pitch-green/20' }
          ].map((kpi, i) => (
            <div key={i} className={`glass-card p-8 border-white/5 bg-white/[0.01] rounded-3xl backdrop-blur-md hover:bg-white/[0.03] transition group relative overflow-hidden flex items-center justify-between shadow-2xl ${kpi.border}`}>
              <div className="space-y-4 relative z-10">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic block">{kpi.label}</span>
                <span className={`text-4xl tabular-nums font-black italic block athletic-title athletic-skew tracking-tight ${kpi.color} drop-shadow-2xl group-hover:translate-x-2 transition-transform duration-700`}>{kpi.value}</span>
              </div>
              <kpi.icon size={48} className={`opacity-[0.03] group-hover:opacity-20 group-hover:scale-125 transition duration-1000 relative z-10 ${kpi.color} -rotate-12`} />
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-1000 blur-[60px] ${kpi.bg}`} />
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/30 transition duration-700" />
            </div>
          ))}
        </div>
      </header>

      {/* Table Section */}
      <main className="relative animate-in fade-in slide-in-from-bottom-12 duration-1000">
         <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-black text-gold/10 uppercase tracking-[1em] italic select-none">REGISTRE OFFICIEL DES LICENCES RCBA</div>
         <LicenseTable sessions={sessions} categories={categories} teams={teams} />
      </main>
    </div>
  );
}
