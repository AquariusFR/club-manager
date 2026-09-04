'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Bus, 
  Calendar, 
  MapPin, 
  Settings, 
  AlertTriangle, 
  Fuel, 
  FileText,
  Plus,
  Users,
  ChevronRight,
  TrendingUp,
  History,
  X,
  CreditCard,
  Clock,
  Filter,
  Download,
  Trash2
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { LogbookForm } from './LogbookForm';
import { OCRScanner } from './OCRScanner';
import { ReservationForm } from './ReservationForm';
import { updateReservationStatus, exportLogisticsCSV, deleteReservation } from '@/lib/logistique-actions';
import { MetricCard, ReservationItem, TabButton, QuickActionButton, MiniStat, CalendarView } from './MinibusDashboardUI';

interface MinibusDashboardProps {
  stats: any[];
  maintenance: any[];
  reservations: any[];
  logs: any[];
}

export function MinibusDashboard({ stats, maintenance, reservations, logs }: MinibusDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'history' | 'maintenance'>('overview');
  const [activeModal, setActiveModal] = useState<'none' | 'reservation' | 'logbook' | 'expense'>('none');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  const rcbaStats = stats.find(s => s.entity === 'RCBA') || { total_km: 0, total_fuel: 0, total_tolls: 0 };
  const assoBStats = stats.find(s => s.entity === 'ASSO_B') || { total_km: 0, total_fuel: 0, total_tolls: 0 };
  const totalKm = (rcbaStats.total_km || 0) + (assoBStats.total_km || 0);
  
  const rcbaRatio = totalKm > 0 ? (rcbaStats.total_km / totalKm) * 100 : 50;

  const handleModalClose = () => setActiveModal('none');

  const filteredReservations = reservations.filter(res => 
    filterStatus === 'ALL' ? true : res.status === filterStatus
  );

  const totalLiters = (rcbaStats.total_liters || 0) + (assoBStats.total_liters || 0);
  const avgConsumption = totalKm > 0 ? (totalLiters / totalKm) * 100 : 0;

  const handleExport = async () => {
    const csv = await exportLogisticsCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Logistique_Minibus_${new Date().toISOString().substring(0, 7)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 p-6 bg-navy-deep/20 backdrop-blur-xl rounded-[2.5rem] border border-white/10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-display italic black uppercase tracking-[0.15em] text-white">
            Logistique <span className="text-gold">Minibus</span>
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 mt-1">
            Asset Tracking & Shared Resource Management
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
            icon={<TrendingUp size={16} />} 
            label="Vue d'ensemble" 
          />
          <TabButton 
            active={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')} 
            icon={<Calendar size={16} />} 
            label="Calendrier" 
          />
          <TabButton 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<History size={16} />} 
            label="Historique" 
          />
          <TabButton 
            active={activeTab === 'maintenance'} 
            onClick={() => setActiveTab('maintenance')} 
            icon={<Settings size={16} />} 
            label="Maintenance" 
          />
          <div className="w-px h-10 bg-white/10 mx-2 hidden md:block" />
          <button 
            onClick={() => setActiveModal('reservation')}
            className="flex items-center gap-2 px-6 py-3 bg-gold text-navy-deep font-bold rounded-2xl hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-gold/20"
          >
            <Plus size={18} />
            <span>Ajouter une réservation</span>
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-3 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition border border-white/10"
            title="Exporter les données du mois"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {activeModal !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-navy-deep/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg"
            >
              <button 
                onClick={handleModalClose}
                className="absolute -top-12 right-0 p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {activeModal === 'logbook' && <LogbookForm onSuccess={handleModalClose} />}
              {activeModal === 'expense' && <OCRScanner mode="expense" onClose={handleModalClose} />}
              {activeModal === 'reservation' && <ReservationForm onSuccess={handleModalClose} />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTab === 'overview' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              icon={<Bus className="text-gold" size={24} />}
              label="Total Kilométrage"
              value={`${totalKm} km`}
              subtext={`RCBA: ${rcbaStats.total_km} | Asso B: ${assoBStats.total_km}`}
            />
            <MetricCard 
              icon={<TrendingUp className="text-pitch-green" size={24} />}
              label="Répartition RCBA"
              value={`${rcbaRatio.toFixed(1)}%`}
              subtext="Base de refacturation"
              progress={rcbaRatio}
            />
            <MetricCard 
              icon={<Fuel className="text-orange-400" size={24} />}
              label="Consommation Moyenne"
              value={`${avgConsumption.toFixed(1)} L/100`}
              subtext={`${totalLiters.toFixed(1)} Litres consommés`}
            />
            <MetricCard 
              icon={<Fuel className="text-blue-400" size={24} />}
              label="Frais Consolidés"
              value={`${(rcbaStats.total_fuel + assoBStats.total_fuel + rcbaStats.total_tolls + assoBStats.total_tolls).toFixed(2)}€`}
              subtext="Carburant + Péages"
            />
            <MetricCard 
              icon={<AlertTriangle className={maintenance.some(m => m.status === 'CRITICAL') ? "text-red-500" : "text-pitch-green"} size={24} />}
              label="Statut Entretien"
              value={maintenance.length > 0 ? `${maintenance.length} Alertes` : "Opérationnel"}
              subtext="Vérification technique"
            />
          </div>

          {/* Detailed Quote-part / Accounting Section */}
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white uppercase tracking-widest">
                <CreditCard size={20} className="text-gold" />
                Calculateur de Quote-Part <span className="text-gold/40 text-sm font-normal ml-2">Inter-Associatif</span>
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Entité RCBA</span>
                  <span className="text-xl font-display italic black text-white">{(rcbaStats.total_fuel + rcbaStats.total_tolls + (rcbaStats.total_other || 0)).toFixed(2)}€</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-400" style={{ width: `${(rcbaStats.total_km / (totalKm || 1)) * 100}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <MiniStat label="KM" value={rcbaStats.total_km} />
                  <MiniStat label="Fuel" value={`${rcbaStats.total_fuel.toFixed(0)}€`} />
                  <MiniStat label="Péage" value={`${rcbaStats.total_tolls.toFixed(0)}€`} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-white/40 uppercase tracking-widest">Entité Association B</span>
                  <span className="text-xl font-display italic black text-white">{(assoBStats.total_fuel + assoBStats.total_tolls + (assoBStats.total_other || 0)).toFixed(2)}€</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-pitch-green" style={{ width: `${(assoBStats.total_km / (totalKm || 1)) * 100}%` }} />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <MiniStat label="KM" value={assoBStats.total_km} />
                  <MiniStat label="Fuel" value={`${assoBStats.total_fuel.toFixed(0)}€`} />
                  <MiniStat label="Péage" value={`${assoBStats.total_tolls.toFixed(0)}€`} />
                </div>
              </div>
            </div>
          </div>

          {/* Reservations & Maintenance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                  <Calendar size={20} className="text-gold" />
                  Planning des Réservations
                </h3>
                <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                  {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition",
                        filterStatus === status 
                          ? "bg-gold text-navy-deep shadow-lg shadow-gold/20" 
                          : "text-white/40 hover:text-white/60"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                {filteredReservations.length > 0 ? (
                  // Group by date
                  Object.entries(
                    filteredReservations.reduce((acc: any, res) => {
                      const date = new Date(res.start_time).toLocaleDateString();
                      if (!acc[date]) acc[date] = [];
                      acc[date].push(res);
                      return acc;
                    }, {})
                  ).map(([date, dayReservations]: [string, any]) => (
                    <div key={date} className="space-y-3">
                      <div className="flex items-center gap-4 px-2">
                        <div className="h-px flex-1 bg-white/5" />
                        <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em] italic">{date}</span>
                        <div className="h-px flex-1 bg-white/5" />
                      </div>
                      {dayReservations.map((res: any) => (
                        <ReservationItem key={res.id} reservation={res} onStatusUpdate={updateReservationStatus} onDelete={deleteReservation} />
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-white/40 italic">
                    Aucune réservation programmée
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
                <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-4">
                  <Settings size={20} className="text-gold" />
                  État du Parc
                </h3>
                <div className="space-y-4">
                  {maintenance.filter(m => m.status !== 'OK').length > 0 ? (
                    maintenance.filter(m => m.status !== 'OK').map((m) => (
                      <div key={m.id} className={clsx(
                        "p-4 rounded-2xl border flex gap-3",
                        m.status === 'CRITICAL' ? "bg-red-500/10 border-red-500/20" : "bg-gold/10 border-gold/20"
                      )}>
                        <AlertTriangle className={m.status === 'CRITICAL' ? "text-red-500" : "text-gold"} size={20} />
                        <div>
                          <p className="text-sm font-bold text-white">{m.type}</p>
                          <p className="text-sm text-white/60">Due : {m.due_date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-pitch-green/10 border border-pitch-green/20 flex gap-3">
                      <TrendingUp className="text-pitch-green shrink-0" size={20} />
                      <div>
                        <p className="text-sm font-bold text-white">Flotte Opérationnelle</p>
                        <p className="text-sm text-white/60">Aucune intervention urgente</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gold/10 to-transparent border border-gold/20 rounded-3xl p-6 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest text-sm">Actions Rapides</h3>
                <div className="grid grid-cols-2 gap-3">
                  <QuickActionButton onClick={() => setActiveModal('logbook')} icon={<FileText />} label="Saisir KM" />
                  <QuickActionButton onClick={() => setActiveModal('expense')} icon={<Fuel />} label="Ajout Frais" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CalendarView 
            reservations={reservations} 
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            onStatusUpdate={updateReservationStatus}
            onDelete={deleteReservation}
          />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <History className="text-gold" />
              Historique des Déplacements
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 border-b border-white/5">
                    <th className="pb-4 pl-4">Date</th>
                    <th className="pb-4">Conducteur</th>
                    <th className="pb-4">Entité</th>
                    <th className="pb-4 text-right">KM Début</th>
                    <th className="pb-4 text-right">KM Fin</th>
                    <th className="pb-4 text-right">Total</th>
                    <th className="pb-4 text-right">Coûts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map((log) => (
                    <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pl-4 text-sm text-white/60 font-medium">
                        {new Date(log.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-sm font-bold text-white">{log.driver_name}</td>
                      <td className="py-4">
                        <span className={clsx(
                          "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter border",
                          log.entity === 'RCBA' ? "text-blue-400 border-blue-400/20 bg-blue-400/10" : "text-pitch-green border-pitch-green/20 bg-pitch-green/10"
                        )}>
                          {log.entity}
                        </span>
                      </td>
                      <td className="py-4 text-right text-sm text-white/40">{log.mileage_start}</td>
                      <td className="py-4 text-right text-sm text-white/40">{log.mileage_end}</td>
                      <td className="py-4 text-right text-sm font-black text-white">{(log.mileage_end || 0) - log.mileage_start} km</td>
                      <td className="py-4 text-right text-sm font-black text-gold">
                        {((log.fuel_cost || 0) + (log.tolls_cost || 0)).toFixed(2)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'maintenance' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {maintenance.map((m) => (
              <div key={m.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
                <div className={clsx(
                  "absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10",
                  m.status === 'CRITICAL' ? "bg-red-500" : m.status === 'WARNING' ? "bg-gold" : "bg-pitch-green"
                )} />
                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      m.status === 'CRITICAL' ? "bg-red-500/20 text-red-500" : m.status === 'WARNING' ? "bg-gold/20 text-gold" : "bg-pitch-green/20 text-pitch-green"
                    )}>
                      <Settings size={20} />
                    </div>
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      m.status === 'CRITICAL' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : m.status === 'WARNING' ? "bg-gold text-navy-deep shadow-lg shadow-gold/20" : "bg-pitch-green text-navy-deep"
                    )}>
                      {m.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{m.type}</h4>
                    <p className="text-sm text-white/40 mt-1">{m.description}</p>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm text-white/40 uppercase font-bold tracking-widest">Échéance</span>
                    <span className="text-sm font-black text-white italic">{m.due_date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
