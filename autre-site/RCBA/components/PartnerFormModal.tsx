'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Handshake } from 'lucide-react';

export default function PartnerFormModal({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    entreprise: '',
    email: '',
    telephone: '',
    typePartenariat: 'Sponsoring d\'équipement',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/join/partner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error('Erreur');
      
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setFormData({ nom: '', prenom: '', entreprise: '', email: '', telephone: '', typePartenariat: '', message: '' });
      }, 3000);
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-deep/90 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-navy-light/95 border border-gold/30 rounded-3xl p-8 max-w-lg w-full relative shadow-[0_0_50px_rgba(212,175,55,0.15)]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                <Handshake size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black italic uppercase text-white tracking-widest drop-shadow-glow">
                  Devenir Partenaire
                </h2>
                <p className="text-[10px] text-white/60 uppercase tracking-widest italic">
                  Soutenez le football local &amp; la jeunesse de Bû &amp; Abondant
                </p>
              </div>
            </div>

            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="py-12 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-pitch-green/20 border border-pitch-green flex items-center justify-center mx-auto mb-6">
                  <Handshake className="text-pitch-green w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Demande Envoyée</h3>
                <p className="text-white/60">Notre responsable des partenariats vous contactera très prochainement.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="partner-prenom" className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Prénom</label>
                    <input
                      id="partner-prenom"
                      type="text"
                      required
                      value={formData.prenom}
                      onChange={e => setFormData({...formData, prenom: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="partner-nom" className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Nom</label>
                    <input
                      id="partner-nom"
                      type="text"
                      required
                      value={formData.nom}
                      onChange={e => setFormData({...formData, nom: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="partner-entreprise" className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Entreprise</label>
                    <input
                      id="partner-entreprise"
                      type="text"
                      required
                      value={formData.entreprise}
                      onChange={e => setFormData({...formData, entreprise: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="partner-type" className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Type de partenariat</label>
                    <select
                      id="partner-type"
                      value={formData.typePartenariat}
                      onChange={e => setFormData({...formData, typePartenariat: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition appearance-none"
                    >
                      <option className="bg-navy-deep" value="Sponsoring d'équipement">Sponsoring d'équipement</option>
                      <option className="bg-navy-deep" value="Visibilité stade/digital">Visibilité stade/digital</option>
                      <option className="bg-navy-deep" value="Mécénat financier">Mécénat financier</option>
                      <option className="bg-navy-deep" value="Événementiel">Événementiel</option>
                      <option className="bg-navy-deep" value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="partner-email" className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Email</label>
                    <input
                      id="partner-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition"
                      placeholder="email@entreprise.fr"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="partner-telephone" className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Téléphone</label>
                    <input
                      id="partner-telephone"
                      type="tel"
                      required
                      value={formData.telephone}
                      onChange={e => setFormData({...formData, telephone: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="partner-message" className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Message (Optionnel)</label>
                  <textarea
                    id="partner-message"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition min-h-[100px] resize-none"
                    placeholder="Précisez votre projet de partenariat..."
                  />
                </div>

                {status === 'error' && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold text-center">
                    Une erreur est survenue. Veuillez réessayer.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-gold text-navy-deep rounded-xl font-black uppercase tracking-widest italic hover:scale-[1.02] active:scale-[0.96] transition disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
                >
                  {status === 'loading' ? (
                    <><Loader2 size={18} className="animate-spin" /> Envoi...</>
                  ) : (
                    'Envoyer la demande'
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
