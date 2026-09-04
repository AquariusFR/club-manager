'use client';

import React, { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ROLES = [
  "Éducateur / Entraîneur",
  "Arbitre",
  "Bénévole (Buvette, Événements...)",
  "Dirigeant",
  "Autre"
];

interface StaffJoinFormProps {
  defaultRole?: string;
}

export default function StaffJoinForm({ defaultRole }: StaffJoinFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    role: ROLES[0],
    telephone: '',
    email: '',
    experience: '',
    motivations: ''
  });

  useEffect(() => {
    if (defaultRole) {
      const match = ROLES.find(r => r.includes(defaultRole));
      if (match) {
        setFormData(prev => ({ ...prev, role: match }));
      }
    }
  }, [defaultRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/join/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error("Erreur serveur");
      
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-8 text-center h-full">
        <CheckCircle2 className="w-16 h-16 text-pitch-green mb-4" />
        <h3 className="athletic-title text-2xl italic text-white mb-2">Candidature Envoyée !</h3>
        <p className="text-white/60">Merci pour ton engagement ! La direction a bien reçu ta demande pour rejoindre le club en tant que "{formData.role}". Nous te recontacterons très vite.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label htmlFor="sjf-prenom" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Prénom</label>
          <input id="sjf-prenom" required type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 outline-none transition-colors" placeholder="Zinédine" />
        </div>
        <div className="space-y-1">
          <label htmlFor="sjf-nom" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Nom</label>
          <input id="sjf-nom" required type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 outline-none transition-colors" placeholder="Zidane" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label htmlFor="sjf-role" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Rôle Souhaité</label>
          <select id="sjf-role" required name="role" value={formData.role} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 outline-none transition-colors appearance-none">
            {ROLES.map(role => <option key={role} value={role} className="bg-navy-black">{role}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label htmlFor="sjf-telephone" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Téléphone</label>
          <input id="sjf-telephone" required type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 outline-none transition-colors" placeholder="06 12 34 56 78" />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="sjf-email" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Email</label>
        <input id="sjf-email" required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 outline-none transition-colors" placeholder="email@exemple.com" />
      </div>

      <div className="space-y-1">
        <label htmlFor="sjf-experience" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Expériences ou Diplômes éventuels</label>
        <input id="sjf-experience" type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 outline-none transition-colors" placeholder="Ex: CFF1, Arbitre depuis 2 ans, Aucune..." />
      </div>

      <div className="space-y-1">
        <label htmlFor="sjf-motivations" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Pourquoi nous rejoindre ? (Motivations)</label>
        <textarea id="sjf-motivations" required name="motivations" value={formData.motivations} onChange={handleChange} rows={3} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/50 outline-none transition-colors resize-none" placeholder="Je souhaite m'investir pour..." />
      </div>

      {status === 'error' && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle size={16} />
          <span>Une erreur est survenue lors de l'envoi. Veuillez réessayer.</span>
        </div>
      )}

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="w-full py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-transform duration-200 hover:scale-[1.02] active:scale-[0.96] bg-blue-500 text-white disabled:opacity-50 disabled:hover:scale-100"
      >
        {status === 'loading' ? (
          <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</>
        ) : (
          <><Send size={18} /> Envoyer ma candidature</>
        )}
      </button>
    </form>
  );
}
