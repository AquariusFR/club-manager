import React from 'react';
import { MinibusDashboard } from '@/components/MinibusDashboard';
import { 
  getMinibusStats, 
  getUpcomingMaintenance, 
  getRecentReservations,
  getCarpoolingRoutes,
  getRecentLogs
} from '@/lib/logistique-actions';
import PageLabel from "@/components/PageLabel";
import HudCorners from '@/components/HudCorners';
import { Truck, Calendar, CreditCard } from 'lucide-react';
import { CarpoolingManager } from '@/components/CarpoolingManager';

export default async function LogistiquePage() {
  const stats = await getMinibusStats();
  const maintenance = await getUpcomingMaintenance();
  const reservations = await getRecentReservations();
  const carpoolingRoutes = await getCarpoolingRoutes();
  const logs = await getRecentLogs();

  return (
    <div className="min-h-screen bg-navy-deep text-white p-6 lg:p-12 space-y-12 relative overflow-x-hidden pb-32">
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
              section="LOGISTIQUE"
              category="ASSET MANAGEMENT"
              title="MINIBUS & DÉPLACEMENTS"
              subtitle="Optimisation des ressources partagées. Suivi kilométrique, maintenance préventive et gestion des coûts inter-associatifs."
              variant="gold"
              icon="stade"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="glass-card px-10 py-6 border-white/10 bg-white/[0.02] flex items-center gap-8 backdrop-blur-3xl shadow-3xl">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-1">Status Parc</span>
                <span className="text-xl font-black text-pitch-green italic uppercase">OPÉRATIONNEL</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-1">Alertes Actives</span>
                <span className="text-xl tabular-nums font-black text-rose-500 italic uppercase">{maintenance.filter((m: any) => m.status === 'CRITICAL').length} CRITIQUE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative animate-in fade-in slide-in-from-bottom-12 duration-1000 space-y-12">
        <MinibusDashboard 
          stats={stats}
          maintenance={maintenance}
          reservations={reservations}
          logs={logs}
        />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <CarpoolingManager initialRoutes={carpoolingRoutes} />
          {/* RPE Tracker or other logistics tools */}
          <div className="space-y-8">
            <h3 className="text-xl font-display italic black uppercase tracking-widest text-white px-4 border-l-2 border-gold">Performance & Feedback</h3>
            <div className="glass-card p-2 rounded-[2.5rem] border-white/5 bg-white/[0.01]">
              {/* Note: In a real app, we might want to fetch player sessions here */}
              <div className="p-8 text-center text-white/20 italic text-sm">
                Sélectionnez une session pour activer le RPE Tracker.
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[9px] font-black text-white/20 uppercase tracking-[0.6em] italic px-10 border-t border-white/5 pt-12 pb-8">
        <span>RCBA LOGISTICS PROTOCOL — v1.0 // SHARED ASSET ENGINE</span>
        <span className="flex items-center gap-6">
          <span className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-gold shadow-glow animate-pulse" />
            <span>SYNC ACTIVE</span>
          </span>
        </span>
      </div>
    </div>
  );
}
