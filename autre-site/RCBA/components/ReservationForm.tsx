'use client';

import React from 'react';
import { Calendar, User, FileText, Send, Clock, MapPin } from 'lucide-react';
import { createReservation } from '@/lib/logistique-actions';

interface ReservationFormProps {
  onSuccess?: () => void;
}

export function ReservationForm({ onSuccess }: ReservationFormProps) {
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    if (startTime && endTime && new Date(endTime) <= new Date(startTime)) {
      setError("La date de fin doit être postérieure à la date de début.");
      return;
    }
    setError(null);
    await createReservation(formData);
    if (onSuccess) onSuccess();
    setStartTime('');
    setEndTime('');
  };

  return (
    <div className="bg-navy-deep/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl max-w-lg w-full">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center">
          <Calendar className="text-gold" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-display italic black uppercase tracking-widest text-white">
            Réserver <span className="text-gold">Minibus</span>
          </h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
            Planification des déplacements
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
            label="Demandeur" 
            name="requester_name" 
            placeholder="Nom du Coach" 
            icon={<User size={16} />}
            required
          />
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Catégorie</label>
            <select 
              name="category"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 transition-colors"
              required
            >
              <option value="MATCH_OFFICIEL">Match Officiel</option>
              <option value="ENTRAINEMENT">Entraînement</option>
              <option value="AUTRE">Autre Déplacement</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          <InputGroup 
            label="Nbr Joueurs" 
            name="players_count" 
            type="number"
            placeholder="0" 
            icon={<User size={16} />}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputGroup 
            label="Motif" 
            name="purpose" 
            placeholder="Ex: Match vs Marmande" 
            icon={<FileText size={16} />}
            required
          />
          <InputGroup 
            label="Destination" 
            name="destination" 
            placeholder="Ex: Marmande" 
            icon={<MapPin size={16} />}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputGroup 
            label="Début" 
            name="start_time" 
            type="datetime-local" 
            icon={<Clock size={16} />}
            required
            value={startTime}
            onChange={(e: any) => setStartTime(e.target.value)}
          />
          <InputGroup 
            label="Fin" 
            name="end_time" 
            type="datetime-local" 
            icon={<Clock size={16} />}
            required
            value={endTime}
            onChange={(e: any) => setEndTime(e.target.value)}
          />
        </div>

        <button 
          type="submit"
          disabled={Boolean(startTime && endTime && new Date(endTime) <= new Date(startTime))}
          className="w-full py-4 bg-gold hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed text-navy-deep font-black uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 group"
        >
          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          Envoyer la demande
        </button>
      </form>
    </div>
  );
}

function InputGroup({ label, name, type = "text", placeholder, icon, required, value, onChange }: any) {
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
