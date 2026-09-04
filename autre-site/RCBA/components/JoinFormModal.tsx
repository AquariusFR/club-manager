import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2 } from 'lucide-react';

interface JoinFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'player' | 'staff';
  title: string;
}

export default function JoinFormModal({ isOpen, onClose, type, title }: JoinFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    telephone: '',
    email: '',
    categorie: 'Séniors',
    poste: '',
    experience: '',
    message: '',
    typeCandidature: title
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const endpoint = type === 'player' ? '/api/join/player' : '/api/join/staff';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          setFormData({
            nom: '', prenom: '', dateNaissance: '', telephone: '', email: '', 
            categorie: 'Séniors', poste: '', experience: '', message: '', typeCandidature: title
          });
        }, 3000);
      } else {
        alert("Une erreur est survenue lors de l'envoi.");
      }
    } catch (error) {
      alert("Une erreur de connexion est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card bg-navy-deep border border-gold/20 rounded-3xl p-6 md:p-8 relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              aria-label="Fermer le formulaire"
            >
              <X size={24} />
            </button>

            <div className="mb-8">
              <h3 className="athletic-title text-2xl italic uppercase text-gold mb-2">
                {title}
              </h3>
              <p className="text-sm text-white/60 italic">
                Veuillez remplir ce formulaire de renseignement. {type === 'player' ? "Il sera transmis au coach concerné." : "Il sera transmis à la direction."}
              </p>
            </div>

            {isSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-4 text-green-400">
                  <Send size={32} />
                </div>
                <h4 className="text-xl font-bold mb-2">Demande envoyée !</h4>
                <p className="text-white/60 text-sm">Nous vous recontacterons très prochainement.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="join-nom" className="block text-xs uppercase tracking-wider text-white/50 mb-1">Nom *</label>
                    <input id="join-nom" required type="text" name="nom" value={formData.nom} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label htmlFor="join-prenom" className="block text-xs uppercase tracking-wider text-white/50 mb-1">Prénom *</label>
                    <input id="join-prenom" required type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors" placeholder="Votre prénom" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="join-email" className="block text-xs uppercase tracking-wider text-white/50 mb-1">Email *</label>
                    <input id="join-email" required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors" placeholder="votre@email.com" />
                  </div>
                  <div>
                    <label htmlFor="join-telephone" className="block text-xs uppercase tracking-wider text-white/50 mb-1">Téléphone *</label>
                    <input id="join-telephone" required type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors" placeholder="06 12 34 56 78" />
                  </div>
                </div>

                <div>
                  <label htmlFor="join-dateNaissance" className="block text-xs uppercase tracking-wider text-white/50 mb-1">Date de Naissance {type === 'player' && '*'}</label>
                  <input id="join-dateNaissance" required={type === 'player'} type="date" name="dateNaissance" value={formData.dateNaissance} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors text-white" />
                </div>

                {type === 'player' && (
                  <div>
                    <label htmlFor="join-categorie" className="block text-xs uppercase tracking-wider text-white/50 mb-1">Catégorie *</label>
                    <select id="join-categorie" required name="categorie" value={formData.categorie} onChange={handleChange} className="w-full bg-navy-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors text-white">
                      <option value="U6 / U7">U6 / U7 (2019-2020)</option>
                      <option value="U8 / U9">U8 / U9 (2017-2018)</option>
                      <option value="U10 / U11">U10 / U11 (2015-2016)</option>
                      <option value="U12 / U13">U12 / U13 (2013-2014)</option>
                      <option value="U14 / U15">U14 / U15 (2011-2012)</option>
                      <option value="U16 / U17 / U18">U16 / U17 / U18 (2008-2010)</option>
                      <option value="Séniors">Séniors (2007 et avant)</option>
                      <option value="Vétérans">Vétérans</option>
                      <option value="Pôle Féminin">Pôle Féminin</option>
                    </select>
                  </div>
                )}

                {type === 'staff' && (
                  <div>
                    <label htmlFor="join-poste" className="block text-xs uppercase tracking-wider text-white/50 mb-1">Poste souhaité</label>
                    <input id="join-poste" type="text" name="poste" value={formData.poste} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors" placeholder="Ex: Entraîneur adjoint, Délégué..." />
                  </div>
                )}

                <div>
                  <label htmlFor="join-experience" className="block text-xs uppercase tracking-wider text-white/50 mb-1">Expérience passée</label>
                  <textarea id="join-experience" name="experience" value={formData.experience} onChange={handleChange} rows={2} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors resize-none" placeholder="Clubs précédents, diplômes..."></textarea>
                </div>

                <div>
                  <label htmlFor="join-message" className="block text-xs uppercase tracking-wider text-white/50 mb-1">Message optionnel</label>
                  <textarea id="join-message" name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors resize-none" placeholder="Un petit mot pour nous..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 mt-4 rounded-xl bg-gold text-navy-deep font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.96] transition flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Envoi en cours...</>
                  ) : (
                    <><Send size={18} /> Envoyer la demande</>
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
