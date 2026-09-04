'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Loader2, RefreshCw, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import PageLabel from '@/components/PageLabel';
import HudCorners from '@/components/HudCorners';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Reservation {
  id: number;
  produit_id: string;
  produit_nom: string;
  taille: string;
  acheteur_nom: string;
  acheteur_email: string;
  statut: string;
  date_reservation: string;
}

export default function BoutiqueAdminClient() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/direction/boutique');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch reservations');
      setReservations(data.reservations || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateStatus = async (id: number, statut: string) => {
    try {
      const res = await fetch('/api/direction/boutique', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, statut }),
      });
      if (!res.ok) throw new Error('Erreur de mise à jour');
      
      // Update local state
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, statut } : r)
      );
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <PageLabel section="Direction" category="Administration" title="Command NODE #0x01" variant="gold" icon="direction" />
          <h1 className="athletic-title text-4xl text-white mt-4 uppercase">Boutique</h1>
          <p className="text-white/60 font-medium max-w-xl mt-2">
            Gestion des réservations et des commandes de la boutique du club.
          </p>
        </div>
        <button 
          onClick={fetchReservations}
          className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-gold hover:text-navy-deep text-white font-black text-xs uppercase tracking-widest transition flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Rafraîchir
        </button>
      </div>

      <div className="relative glass-card border-white/10 bg-navy-deep/60 p-6 rounded-xl overflow-hidden">
        <HudCorners color="gold" />

        {error ? (
          <div className="flex flex-col items-center justify-center py-12 text-red-400">
            <AlertCircle size={32} className="mb-4" />
            <p className="font-bold">{error}</p>
          </div>
        ) : isLoading && reservations.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-gold" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-white/40">
            <ShoppingBag size={48} className="mb-4 opacity-50" />
            <p className="font-bold text-lg">Aucune réservation pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-black text-white/40 uppercase tracking-widest">
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Produit</th>
                  <th className="py-4 px-4 text-center">Taille</th>
                  <th className="py-4 px-4">Acheteur</th>
                  <th className="py-4 px-4">Statut</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={res.id} 
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm font-medium text-white/70">
                      {format(new Date(res.date_reservation), 'dd MMM yyyy, HH:mm', { locale: fr })}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white uppercase">{res.produit_nom}</div>
                      <div className="text-[10px] text-white/40 font-mono mt-1">ID: {res.produit_id}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2 py-1 bg-white/10 rounded font-bold text-xs text-white border border-white/10">
                        {res.taille}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-white">{res.acheteur_nom}</div>
                      <div className="text-xs text-white/50">{res.acheteur_email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        res.statut === 'En attente' ? 'bg-gold/10 text-gold border-gold/20' :
                        res.statut === 'Traité' ? 'bg-pitch-green/10 text-pitch-green border-pitch-green/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {res.statut === 'En attente' && <Clock size={12} />}
                        {res.statut === 'Traité' && <CheckCircle2 size={12} />}
                        {res.statut === 'Annulé' && <XCircle size={12} />}
                        {res.statut}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {res.statut === 'En attente' && (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => updateStatus(res.id, 'Traité')}
                            className="p-2 rounded bg-pitch-green/10 text-pitch-green border border-pitch-green/20 hover:bg-pitch-green hover:text-navy-deep transition"
                            title="Marquer comme traité"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                          <button 
                            onClick={() => updateStatus(res.id, 'Annulé')}
                            className="p-2 rounded bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition"
                            title="Annuler la réservation"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
