import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users,
  TrendingUp,
  MapPin,
  Clock,
  X,
  Trash2,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';

export function MetricCard({ icon, label, value, subtext, progress }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white/5 border border-white/10 rounded-3xl p-5 backdrop-blur-md relative overflow-hidden group"
    >
      <div className="relative z-10">
        <div className="mb-3">{icon}</div>
        <p className="text-sm font-bold text-white/40 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-black text-white mt-1">{value}</p>
        <p className="text-[10px] text-white/60 mt-1">{subtext}</p>
      </div>
      
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gold"
          />
        </div>
      )}

      {/* Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  );
}

export function ReservationItem({ reservation, onStatusUpdate, onDelete }: { reservation: any, onStatusUpdate: (id: number, status: string) => Promise<void>, onDelete: (id: number) => Promise<void> }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isRCBA = reservation.entity === 'RCBA';
  const colorClass = isRCBA ? "text-blue-400 border-blue-400/20 bg-blue-400/10" : "text-pitch-green border-pitch-green/20 bg-pitch-green/10";
  
  const categoryLabels: Record<string, string> = {
    'MATCH_OFFICIEL': 'Match Officiel',
    'ENTRAINEMENT': 'Entraînement',
    'AUTRE': 'Autre'
  };

  const statusColors: Record<string, string> = {
    'PENDING': 'bg-gold/20 text-gold border-gold/30',
    'APPROVED': 'bg-pitch-green/20 text-pitch-green border-pitch-green/30',
    'REJECTED': 'bg-rose-500/20 text-rose-500 border-rose-500/30'
  };

  const handleStatusChange = async (status: string) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(reservation.id, status);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Voulez-vous vraiment annuler/supprimer cette réservation ?')) {
      setIsUpdating(true);
      try {
        await onDelete(reservation.id);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className={clsx(
      "group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition gap-4",
      isUpdating && "opacity-50 pointer-events-none animate-pulse"
    )}>
      <div className="flex items-center gap-4">
        <div className={clsx(
          "w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-lg", 
          colorClass,
          reservation.category === 'MATCH_OFFICIEL' && "ring-2 ring-gold/20 animate-pulse-slow"
        )}>
          {reservation.category === 'MATCH_OFFICIEL' ? <TrendingUp size={24} /> : <Users size={24} />}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-white uppercase tracking-tight">{reservation.purpose || 'Déplacement'}</p>
            <span className={clsx("text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest", statusColors[reservation.status] || 'border-white/10 text-white/40')}>
              {reservation.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className={clsx("text-[10px] font-bold uppercase tracking-tighter", isRCBA ? "text-blue-400" : "text-pitch-green")}>
              {reservation.entity}
            </span>
            <span className="text-[10px] text-white/40 flex items-center gap-1">
              <MapPin size={10} className="text-gold" />
              {reservation.destination || 'N/A'}
            </span>
            <span className="text-[10px] text-white/40 flex items-center gap-1">
              <Users size={10} className="text-gold" />
              {reservation.players_count || 0} Joueurs
            </span>
            <span className="text-[10px] text-white/40 flex items-center gap-1">
              <Clock size={10} className="text-gold" />
              {new Date(reservation.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        {reservation.status === 'PENDING' && (
          <div className="flex gap-2">
            <button 
              onClick={() => handleStatusChange('APPROVED')}
              disabled={isUpdating}
              className="p-2 rounded-lg bg-pitch-green/10 text-pitch-green border border-pitch-green/20 hover:bg-pitch-green hover:text-navy-deep transition disabled:opacity-50"
              title="Approuver"
            >
              <TrendingUp size={16} />
            </button>
            <button 
              onClick={() => handleStatusChange('REJECTED')}
              disabled={isUpdating}
              className="p-2 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition disabled:opacity-50"
              title="Refuser"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <button
          onClick={handleDelete}
          disabled={isUpdating}
          className="p-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition disabled:opacity-50"
          title="Annuler la réservation"
        >
          <Trash2 size={16} />
        </button>
        <div className="text-right hidden md:block ml-2">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Requester</p>
          <p className="text-sm font-bold text-white italic">{reservation.requester_name}</p>
        </div>
      </div>
    </div>
  );
}

export function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition border",
        active 
          ? "bg-gold/10 border-gold/30 text-gold shadow-lg shadow-gold/5" 
          : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export function QuickActionButton({ icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-gold/10 hover:border-gold/30 transition group"
    >
      <div className="text-white group-hover:text-gold transition-colors">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{label}</span>
    </button>
  );
}

export function MiniStat({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-white/5 border border-white/5 rounded-xl p-3 text-center">
      <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-black text-white">{value}</p>
    </div>
  );
}

export function CalendarView({ reservations, filterStatus, setFilterStatus, onStatusUpdate, onDelete }: any) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  // Adjust so Monday is first day of week (0 index)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const filteredReservations = reservations.filter((res: any) => 
    filterStatus === 'ALL' ? true : res.status === filterStatus
  );

  const getReservationsForDay = (day: number) => {
    return filteredReservations.filter((res: any) => {
      const resDate = new Date(res.start_time);
      return resDate.getDate() === day && 
             resDate.getMonth() === currentDate.getMonth() && 
             resDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="flex items-center gap-2 text-xl font-bold text-white">
          <Calendar size={24} className="text-gold" />
          Calendrier des Réservations
        </h3>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10 hidden sm:flex">
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

          <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/10">
            <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">&lt;</button>
            <span className="text-sm font-bold text-white uppercase tracking-widest min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">&gt;</button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="min-w-[600px] grid grid-cols-7 gap-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center text-[10px] font-black uppercase tracking-widest text-white/40 pb-2 border-b border-white/10">
              {day}
            </div>
          ))}
          
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[120px] rounded-xl bg-white/[0.02]" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayRes = getReservationsForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

            return (
              <div key={day} className={clsx(
                "min-h-[120px] rounded-xl border p-2 flex flex-col gap-1 overflow-hidden transition",
                isToday ? "border-gold/50 bg-gold/5" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05]"
              )}>
                <span className={clsx(
                  "text-xs font-bold self-end mb-1",
                  isToday ? "text-gold" : "text-white/40"
                )}>{day}</span>
                <div className="flex-1 overflow-y-auto space-y-1 scrollbar-hide pr-1">
                  {dayRes.map((res: any, idx: number) => {
                    const isRCBA = res.entity === 'RCBA';
                    return (
                      <div key={idx} className={clsx(
                        "text-[9px] font-bold p-1.5 rounded border flex flex-col gap-0.5 relative group",
                        isRCBA ? "bg-blue-400/10 border-blue-400/20 text-blue-400" : "bg-pitch-green/10 border-pitch-green/20 text-pitch-green",
                        res.status === 'PENDING' && "opacity-70 border-dashed",
                        res.status === 'REJECTED' && "opacity-50 grayscale line-through"
                      )} title={`${res.entity} - ${res.purpose} (${res.status})`}>
                        <span className="truncate">{new Date(res.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span className="truncate opacity-80">{res.entity} - {res.purpose}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
