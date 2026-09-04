'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  "U6 / U7",
  "U8 / U9",
  "U10 / U11",
  "U12 / U13",
  "U14 / U15",
  "U16 / U17 / U18",
  "Séniors",
  "Vétérans",
  "Pôle Féminin"
];

export default function PlayerJoinForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    categorie: CATEGORIES[0],
    telephone: '',
    email: '',
    experience: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/join/player', {
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
        <h3 className="athletic-title text-2xl italic text-white mb-2">Demande Envoyée !</h3>
        <p className="text-white/60">Merci pour ton intérêt ! Le coach de la catégorie {formData.categorie} a été notifié et reviendra vers toi (ou tes parents) très vite pour te proposer un essai.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label htmlFor="pjf-prenom" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Prénom</label>
          <input id="pjf-prenom" required type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-colors" placeholder="Kylian" />
        </div>
        <div className="space-y-1">
          <label htmlFor="pjf-nom" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Nom</label>
          <input id="pjf-nom" required type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-colors" placeholder="Mbappé" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label htmlFor="pjf-dateNaissance" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Date de Naissance</label>
          <input id="pjf-dateNaissance" required type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-colors" />
        </div>
        <div className="space-y-1">
          <label htmlFor="pjf-categorie" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Catégorie Souhaitée</label>
          <div className="relative">
            <select id="pjf-categorie" required name="categorie" value={formData.categorie} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-colors appearance-none">
              {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-navy-black">{cat}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-1">
          <label htmlFor="pjf-telephone" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Téléphone (Parents si mineur)</label>
          <input id="pjf-telephone" required type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-colors" placeholder="06 12 34 56 78" />
        </div>
        <div className="space-y-1">
          <label htmlFor="pjf-email" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Email</label>
          <input id="pjf-email" required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-colors" placeholder="email@exemple.com" />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="pjf-experience" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Expérience / Club Précédent</label>
        <input id="pjf-experience" type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-colors" placeholder="Ex: Joueur au FC Dreux depuis 3 ans..." />
      </div>

      <div className="space-y-1">
        <label htmlFor="pjf-message" className="text-xs font-bold uppercase tracking-widest text-white/50 pl-1">Message optionnel</label>
        <textarea id="pjf-message" name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:ring-1 focus:ring-gold/50 outline-none transition-colors resize-none" placeholder="Quelque chose à ajouter ?" />
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
        className="w-full py-4 rounded-xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest transition-transform duration-200 hover:scale-[1.02] active:scale-[0.96] bg-gold text-navy-deep disabled:opacity-50 disabled:hover:scale-100"
      >
        {status === 'loading' ? (
          <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</>
        ) : (
          <><Send size={18} /> Demander un essai</>
        )}
      </button>
    </form>
  );
}
