'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Loader2, CheckCircle2, Shield } from 'lucide-react';

import { UserSession } from '@/lib/authentication';

interface BoutiqueReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: string;
  };
  session?: UserSession | null;
}

export default function BoutiqueReservationModal({ isOpen, onClose, product, session }: BoutiqueReservationModalProps) {
  const [taille, setTaille] = useState('');
  const [nom, setNom] = useState(session?.username || '');
  const [email, setEmail] = useState(session?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('Vous devez être connecté pour réserver un article.');
      return;
    }
    if (!taille) {
      setError('Veuillez sélectionner une taille.');
      return;
    }
    if (!nom || !email) {
      setError('Veuillez remplir vos coordonnées.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/boutique/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produit_id: product.id,
          produit_nom: product.name,
          taille,
          acheteur_nom: nom,
          acheteur_email: email,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la réservation');
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy-deep/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-navy-deep border border-gold/20 p-6 rounded-xl shadow-glass-luminous overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/50 via-gold to-gold/50" />

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <CheckCircle2 size={64} className="text-pitch-green mb-4" />
                </motion.div>
                <h3 className="athletic-title text-2xl text-white mb-2 uppercase">Réservation Confirmée !</h3>
                <p className="text-white/70">Merci {nom}, votre réservation a bien été enregistrée. Nous vous contacterons prochainement.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="athletic-title text-xl text-white uppercase italic tracking-tight">{product.name}</h2>
                    <p className="text-gold font-bold">{product.price}</p>
                  </div>
                  <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {!session ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                    <Shield size={48} className="text-gold/50 mb-2" />
                    <h3 className="athletic-title text-xl text-white uppercase">Accès Restreint</h3>
                    <p className="text-white/70">Vous devez être connecté avec votre compte pour pouvoir réserver du matériel officiel du club.</p>
                    <a href="/login" className="px-6 py-3 mt-4 rounded-lg bg-gold hover:bg-gold/90 text-navy-deep font-black text-sm uppercase tracking-widest transition flex items-center justify-center gap-2">
                      Se connecter
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg text-center font-bold">
                        {error}
                      </div>
                    )}
                    
                    {/* Taille Selection */}
                    <div>
                      <label className="block text-xs font-black text-white/50 uppercase tracking-widest mb-3">Taille souhaitée</label>
                      <div className="grid grid-cols-3 gap-2">
                        {sizes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setTaille(s)}
                            className={`py-2 rounded border font-bold text-sm transition-all duration-200 ${
                              taille === s 
                                ? 'bg-gold border-gold text-navy-deep scale-105 shadow-lg' 
                                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Coordonnées */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-black text-white/50 uppercase tracking-widest mb-1.5">Nom complet</label>
                        <input 
                          type="text"
                          value={nom}
                          onChange={(e) => setNom(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all"
                          placeholder="Ex: Jean Dupont"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-white/50 uppercase tracking-widest mb-1.5">Email</label>
                        <input 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all"
                          placeholder="Ex: jean.dupont@email.com"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 rounded-lg bg-gold hover:bg-gold/90 text-navy-deep font-black text-sm uppercase tracking-widest transition flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                          Confirmer la réservation
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
