'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bus, MapPin, Fuel, FileText, Send } from 'lucide-react';
import { createLogEntry } from '@/lib/logistique-actions';

interface LogbookFormProps {
  onSuccess?: () => void;
}

export function LogbookForm({ onSuccess }: LogbookFormProps) {
  const [startKm, setStartKm] = React.useState<number>(0);
  const [endKm, setEndKm] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    if (endKm < startKm) {
      setError("Le kilométrage d'arrivée doit être supérieur ou égal au départ.");
      return;
    }
    setError(null);
    await createLogEntry(formData);
    if (onSuccess) onSuccess();
    // Reset state
    setStartKm(0);
    setEndKm(0);
  };

  return (
    <div className="bg-navy-deep/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl max-w-lg w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center">
          <Bus className="text-gold" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-display italic black uppercase tracking-widest text-white">
            Nouveau <span className="text-gold">Trajet</span>
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Enregistrement du carnet de bord
          </p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm font-bold animate-pulse">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <InputGroup 
            label="Conducteur" 
            name="driver" 
            placeholder="Nom complet" 
            icon={<FileText size={16} />}
            required
          />
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Entité</label>
            <select 
              name="entity"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors"
              required
            >
              <option value="RCBA">RCBA</option>
              <option value="ASSO_B">Association B</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputGroup 
            label="KM Départ" 
            name="mileage_start" 
            type="number" 
            placeholder="0" 
            icon={<MapPin size={16} />}
            required
            value={startKm}
            onChange={(e: any) => setStartKm(Number(e.target.value))}
          />
          <InputGroup 
            label="KM Arrivée" 
            name="mileage_end" 
            type="number" 
            placeholder="0" 
            icon={<MapPin size={16} />}
            required
            value={endKm}
            onChange={(e: any) => setEndKm(Number(e.target.value))}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <InputGroup 
            label="Carburant (€)" 
            name="fuel_cost" 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            icon={<Fuel size={16} />}
          />
          <InputGroup 
            label="Litres (L)" 
            name="fuel_liters" 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            icon={<Bus size={16} />}
          />
          <InputGroup 
            label="Péages (€)" 
            name="tolls_cost" 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            icon={<FileText size={16} />}
          />
        </div>

        <InputGroup 
          label="Destination" 
          name="destination" 
          placeholder="Ex: Bordeaux (Match U16)" 
          icon={<MapPin size={16} />}
          required
        />

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Notes Complémentaires</label>
          <textarea 
            name="notes"
            rows={2}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors resize-none"
            placeholder="Incidents, niveau de carburant, etc."
          />
        </div>

        <button 
          type="submit"
          disabled={endKm < startKm && endKm !== 0}
          className="w-full py-4 bg-gold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-navy-deep font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 group"
        >
          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          Valider le trajet
        </button>
      </form>

    </div>
  );
}

function InputGroup({ label, name, type = "text", placeholder, icon, required, step, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">
          {icon}
        </div>
        <input 
          type={type}
          name={name}
          step={step}
          required={required}
          value={value}
          onChange={onChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/10"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
