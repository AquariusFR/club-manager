'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { assignSubstitutionAction, cancelSubstitutionAction } from '@/lib/performance-actions';
import { Check, UserPlus, AlertCircle, X, RotateCcw, Trash2, Users } from 'lucide-react';
import HudCorners from './HudCorners';

export default function SubstitutionManagementClient({ 
  substitutions, 
  coaches 
}: { 
  substitutions: any[], 
  coaches: any[] 
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<number | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Record<number, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'FILLED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAssign = async (subId: number) => {
    const coachId = selectedCoach[subId];
    if (!coachId) return;

    setLoading(subId);
    setError(null);
    setSuccess(null);

    const result = await assignSubstitutionAction(subId, parseInt(coachId));

    if (result.success) {
      setSuccess("Remplacement assigné avec succès ! Notification envoyée.");
      router.refresh();
      // Clear success after 3s
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error || "Une erreur est survenue.");
    }
    setLoading(null);
  };

  const handleCancel = async (subId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette demande ?")) return;

    setLoading(subId);
    setError(null);
    const result = await cancelSubstitutionAction(subId);

    if (result.success) {
      setSuccess("Demande annulée.");
      router.refresh();
      setTimeout(() => setSuccess(null), 3000);
    } else {
      setError(result.error || "Erreur lors de l'annulation.");
    }
    setLoading(null);
  };

  const handleReset = async (subId: number) => {
    // We already have the logic to show the select again by clearing selectedCoach[subId]
    setSelectedCoach(prev => ({ ...prev, [subId]: '' }));
  };

  const filteredSubstitutions = substitutions.filter(sub => {
    const matchesTab = activeTab === 'ALL' || sub.status === activeTab;
    const matchesSearch = 
      sub.prenom.toLowerCase().includes(searchQuery.toLowerCase()) || 
      sub.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.sub_prenom && sub.sub_prenom.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (sub.sub_nom && sub.sub_nom.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesTab && matchesSearch;
  });

  const stats = {
    total: substitutions.length,
    pending: substitutions.filter(s => s.status === 'PENDING').length,
    filled: substitutions.filter(s => s.status === 'FILLED').length,
    cancelled: substitutions.filter(s => s.status === 'CANCELLED').length
  };

  return (
    <div className="space-y-8">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-white', bg: 'bg-white/5' },
          { label: 'En Attente', value: stats.pending, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Confirmés', value: stats.filled, color: 'text-pitch-green', bg: 'bg-pitch-green/10' },
          { label: 'Annulés', value: stats.cancelled, color: 'text-slate-400', bg: 'bg-slate-500/10' }
        ].map((stat, i) => (
          <div key={i} className={`p-6 rounded-3xl border border-white/5 ${stat.bg} backdrop-blur-xl`}>
            <div className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40 mb-1 italic">{stat.label}</div>
            <div className={`text-2xl font-black italic athletic-title ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white/[0.02] p-4 rounded-[2.5rem] border border-white/5">
        <div className="flex gap-2 p-1 bg-navy-deep/50 rounded-2xl border border-white/5 overflow-x-auto w-full lg:w-auto">
          {['ALL', 'PENDING', 'FILLED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition italic whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'ALL' ? 'Tous' : tab === 'PENDING' ? 'En Attente' : tab === 'FILLED' ? 'Confirmés' : 'Annulés'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full lg:w-80 group">
            <input 
              type="text"
              placeholder="RECHERCHER UN ÉDUCATEUR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-navy-deep/50 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-white/20 outline-none focus:border-blue-500/50 transition italic"
            />
            <Users className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-500 transition-colors" size={16} />
          </div>

          {(searchQuery || activeTab !== 'ALL') && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveTab('ALL');
              }}
              className="p-3 bg-white/5 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition border border-white/5 flex items-center gap-2 group shrink-0"
              title="Réinitialiser les filtres"
            >
              <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden lg:block text-[9px] font-black uppercase tracking-widest italic">Reset</span>
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-bold animate-shake">
          <AlertCircle size={18} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto opacity-50 hover:opacity-100 transition-opacity">
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-pitch-green/20 border border-pitch-green/50 rounded-2xl flex items-center gap-3 text-pitch-green text-sm font-bold animate-pulse">
          <Check size={18} />
          {success}
        </div>
      )}

      <div className="grid gap-6">
        {filteredSubstitutions.length === 0 ? (
          <div className="glass-card p-20 text-center rounded-[3rem] border-white/5 opacity-40">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Aucun résultat trouvé pour cette sélection</span>
          </div>
        ) : (
          filteredSubstitutions.map((sub) => (
            <div 
              key={sub.id} 
              className={`glass-card-elevated overflow-hidden border-white/5 bg-white/[0.01] relative rounded-[2rem] p-8 transition duration-500 ${sub.status === 'CANCELLED' ? 'opacity-40 grayscale' : sub.status === 'FILLED' ? 'bg-pitch-green/[0.02]' : 'hover:bg-white/[0.03]'}`}
            >
              <HudCorners color={sub.status === 'FILLED' ? '#4ade80' : sub.status === 'CANCELLED' ? '#64748b' : '#3b82f6'} opacity={0.2} />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest italic ${
                      sub.status === 'FILLED' ? 'bg-pitch-green/20 text-pitch-green' : 
                      sub.status === 'CANCELLED' ? 'bg-slate-500/20 text-slate-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {sub.status === 'FILLED' ? 'Confirmé' : sub.status === 'CANCELLED' ? 'Annulé' : 'En Attente'}
                    </span>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">
                      Posté le {new Date(sub.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white italic uppercase tracking-tight athletic-title mb-2">
                    {sub.prenom} {sub.nom}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-gold mb-4">
                    <div className="w-8 h-px bg-gold/30" />
                    <span className="text-[12px] font-black uppercase italic tracking-widest">
                      Session du {new Date(sub.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </span>
                  </div>

                  <p className="text-sm text-white/60 italic leading-relaxed max-w-xl">
                    "{sub.reason || 'Aucune raison spécifiée'}"
                  </p>
                </div>

                <div className="flex flex-col lg:items-end gap-4 min-w-[280px]">
                  {sub.status === 'PENDING' ? (
                    <>
                      <div className="w-full relative group">
                        <select 
                          className="w-full bg-navy-deep/80 border border-white/10 rounded-xl py-4 pl-6 pr-12 text-[10px] font-black uppercase tracking-widest text-white appearance-none focus:border-blue-500 outline-none transition italic cursor-pointer"
                          value={selectedCoach[sub.id] || ''}
                          onChange={(e) => setSelectedCoach(prev => ({ ...prev, [sub.id]: e.target.value }))}
                        >
                          <option value="">Sélectionner un remplaçant</option>
                          {coaches
                            .filter(c => c.id !== sub.coach_id)
                            .map(coach => (
                              <option key={coach.id} value={coach.id}>
                                {coach.prenom} {coach.nom}
                              </option>
                            ))
                          }
                        </select>
                        <UserPlus className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-blue-400 transition-colors pointer-events-none" size={16} />
                      </div>

                      <button 
                        onClick={() => handleAssign(sub.id)}
                        disabled={!selectedCoach[sub.id] || loading === sub.id}
                        className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] italic transition flex items-center justify-center gap-3 ${
                          selectedCoach[sub.id] 
                            ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:scale-105' 
                            : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                        }`}
                      >
                        {loading === sub.id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Check size={16} />
                            Valider le remplacement
                          </>
                        )}
                      </button>
                    </>
                  ) : sub.status === 'FILLED' ? (
                    <div className="flex flex-col items-end gap-4 w-full">
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] text-white/40 uppercase tracking-widest mb-1 italic font-black">Remplaçant assigné</span>
                        <span className="text-sm font-black text-pitch-green uppercase italic tracking-tight athletic-title">
                          {sub.sub_prenom} {sub.sub_nom}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => setSelectedCoach(prev => ({ ...prev, [sub.id]: '' }))}
                        className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2 italic"
                      >
                        <RotateCcw size={12} />
                        Réinitialiser l'assignation
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-500 uppercase italic tracking-widest">Requête Annulée</span>
                    </div>
                  )}

                  {sub.status === 'PENDING' && (
                    <button 
                      onClick={() => handleCancel(sub.id)}
                      className="mt-2 text-[9px] font-black uppercase tracking-widest text-rose-500/60 hover:text-rose-500 transition-colors flex items-center gap-2 italic"
                    >
                      <Trash2 size={12} />
                      Supprimer la demande
                    </button>
                  )}
                </div>
              </div>
              
              {/* Overlay for reassignment if triggered */}
              {sub.status === 'FILLED' && selectedCoach[sub.id] === '' && (
                <div className="mt-8 pt-8 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
                   <div className="flex flex-col lg:flex-row gap-4 items-center">
                    <div className="flex-1 w-full relative group">
                      <select 
                        className="w-full bg-navy-deep/80 border border-white/10 rounded-xl py-4 pl-6 pr-12 text-[10px] font-black uppercase tracking-widest text-white appearance-none focus:border-blue-500 outline-none transition italic cursor-pointer"
                        value={selectedCoach[sub.id] || ''}
                        onChange={(e) => setSelectedCoach(prev => ({ ...prev, [sub.id]: e.target.value }))}
                      >
                        <option value="">Sélectionner un nouveau remplaçant</option>
                        {coaches
                          .filter(c => c.id !== sub.coach_id)
                          .map(coach => (
                            <option key={coach.id} value={coach.id}>
                              {coach.prenom} {coach.nom}
                            </option>
                          ))
                        }
                      </select>
                      <UserPlus className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-blue-400 transition-colors pointer-events-none" size={16} />
                    </div>
                    <div className="flex gap-2 w-full lg:w-auto">
                      <button 
                        onClick={() => handleAssign(sub.id)}
                        disabled={!selectedCoach[sub.id] || loading === sub.id}
                        className="flex-1 lg:px-8 py-4 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:scale-105 transition shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50"
                      >
                        Changer
                      </button>
                      <button 
                        onClick={() => setSelectedCoach(prev => {
                          const next = { ...prev };
                          delete next[sub.id];
                          return next;
                        })}
                        className="p-4 bg-white/5 text-white/40 rounded-xl hover:bg-white/10 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
