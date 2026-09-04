'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  MapPin, 
  Users, 
  ChevronRight, 
  Search, 
  Plus,
  Compass
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createCarpoolingRoute } from '@/lib/logistique-actions';

interface CarpoolingManagerProps {
  initialRoutes: any[];
}

export function CarpoolingManager({ initialRoutes }: CarpoolingManagerProps) {
  const [activeTab, setActiveTab] = useState<'find' | 'offer'>('find');
  const [routes, setRoutes] = useState(initialRoutes);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRoutes = routes.filter(route => 
    route.driver_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.start_location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-4xl glass-card border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[2.5rem]">
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-r from-blue-500/5 via-transparent to-transparent flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <Compass className="text-blue-400" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-display italic font-black uppercase tracking-widest text-white">Logistique Déplacement</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Module Covoiturage Intelligente</p>
          </div>
        </div>

        <div className="flex bg-navy-deep/50 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveTab('find')}
            className={cn(
              "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition",
              activeTab === 'find' ? "bg-white/10 text-white shadow-xl" : "text-white/30 hover:text-white/60"
            )}
          >
            Chercher
          </button>
          <button 
            onClick={() => setActiveTab('offer')}
            className={cn(
              "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition",
              activeTab === 'offer' ? "bg-white/10 text-white shadow-xl" : "text-white/30 hover:text-white/60"
            )}
          >
            Proposer
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {activeTab === 'find' ? (
          <>
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-blue-400 transition-colors" size={20} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrer par quartier ou ville de départ..."
                className="w-full bg-navy-deep/50 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-sm text-white placeholder-white/20 outline-none focus:border-blue-500/50 transition italic font-bold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRoutes.map((route, i) => (
                <motion.div 
                  key={route.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                    <Car size={64} />
                  </div>

                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-black text-blue-400">
                          {route.driver_name?.[0] || 'D'}
                        </div>
                        <span className="text-sm font-bold text-white">{route.driver_name}</span>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                        route.status === 'Full' ? "bg-rose-500/20 text-rose-500" : "bg-pitch-green/20 text-pitch-green"
                      )}>
                        {route.status}
                      </span>
                    </div>
     
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        <MapPin size={16} className="text-blue-400" />
                        <span className="text-sm text-white/60">{route.start_location}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Users size={16} className="text-blue-400" />
                        <span className="text-sm text-white/60">{route.available_seats} places disponibles</span>
                      </div>
                    </div>

                    <button className="w-full mt-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-blue-400/30 text-white/60 hover:text-blue-400 font-black uppercase tracking-widest text-[9px] transition flex items-center justify-center gap-2">
                      Détails & Réservation <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}

              <button 
                onClick={() => setActiveTab('offer')}
                className="p-6 rounded-3xl border-2 border-dashed border-white/5 hover:border-blue-500/20 hover:bg-blue-500/5 transition flex flex-col items-center justify-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-blue-400 transition-colors">
                  <Plus size={24} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-white/60 transition-colors">Ajouter une route</span>
              </button>
            </div>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-xl mx-auto space-y-6 bg-white/5 p-8 rounded-[2rem] border border-white/10"
          >
            <h4 className="text-lg font-display italic font-black uppercase tracking-widest text-white text-center">Proposer un trajet</h4>
            <form action={async (formData) => {
              await createCarpoolingRoute(formData);
              setActiveTab('find');
            }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Conducteur</label>
                <input name="driver_name" required className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50" placeholder="Ex: Jean Dupont" />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Lieu de départ</label>
                <input name="start_location" required className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50" placeholder="Ex: Mairie de Bû, Stade d'Abondant, Dreux..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Heure de départ</label>
                  <input name="departure_time" type="time" required className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-1">Places</label>
                  <input name="available_seats" type="number" min="1" max="8" required className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50" defaultValue="3" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-500/20">
                Publier l&apos;annonce
              </button>
            </form>
          </motion.div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-white/[0.01] border-t border-white/5 flex justify-between items-center px-8">
        <span className="text-[8px] font-black text-white/20 uppercase tracking-widest italic">Node: Logistics_Carpool_v2</span>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
           <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest italic">Radar Zone Actif</span>
        </div>
      </div>
    </div>
  );
}
