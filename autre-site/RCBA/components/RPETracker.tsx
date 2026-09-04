'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Smile, 
  Meh, 
  Frown, 
  Zap, 
  Battery, 
  Clock,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { saveRPEAction } from '@/lib/performance-actions';
import { cn } from '@/lib/utils';

export function RPETracker() {
  const [step, setStep] = useState(1);
  const [intensity, setIntensity] = useState(5);
  const [mood, setMood] = useState<'great' | 'okay' | 'tired'>('okay');
  const [fatigue, setFatigue] = useState(3);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await saveRPEAction({ intensity, mood, fatigue });
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "Une erreur est survenue.");
      }
    } catch (e) {
      setError("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-10 glass-card border-pitch-green/20 bg-pitch-green/5 text-center space-y-6"
      >
        <div className="w-20 h-20 rounded-full bg-pitch-green/20 flex items-center justify-center mx-auto shadow-glow-green/20">
          <CheckCircle2 className="text-pitch-green" size={40} />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display italic black uppercase tracking-widest text-white">Données Transmises</h3>
          <p className="text-sm text-white/60">Tes métriques ont été injectées dans la matrice de performance.</p>
        </div>
        <button 
          onClick={() => { setSubmitted(false); setStep(1); }}
          className="px-8 py-3 bg-pitch-green text-navy-deep font-black uppercase tracking-widest rounded-xl text-sm hover:scale-105 transition-transform"
        >
          Nouvelle Session
        </button>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-md glass-card border-white/10 bg-white/[0.02] backdrop-blur-3xl overflow-hidden shadow-2xl rounded-[2.5rem]">
      {/* Header */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-r from-pitch-green/5 via-transparent to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-pitch-green/20 flex items-center justify-center border border-pitch-green/30">
              <Activity className="text-pitch-green" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-display italic black uppercase tracking-widest text-white leading-none">RPE Tracker</h3>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30 mt-1">Protocole Performance 0x07</p>
            </div>
          </div>
          <div className="flex gap-1">
            {[1, 2, 3].map(s => (
              <div key={s} className={cn(
                "w-4 h-1 rounded-full transition duration-500",
                step >= s ? "bg-pitch-green shadow-glow-green" : "bg-white/10"
              )} />
            ))}
          </div>
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-2">
                <h4 className="text-sm font-black uppercase tracking-widest text-white/60 italic">Intensité de la Session</h4>
                <p className="text-4xl font-black text-white italic athletic-title athletic-skew">{intensity}/10</p>
              </div>

              <div className="relative pt-6">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={intensity} 
                  onChange={(e) => setIntensity(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pitch-green"
                />
                <div className="flex justify-between mt-4 text-[9px] font-black text-white/30 uppercase tracking-widest">
                  <span>Repos</span>
                  <span>Extrême</span>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                className="w-full py-4 bg-white/5 border border-white/10 hover:border-pitch-green/40 hover:bg-pitch-green/10 text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 group transition"
              >
                Suivant <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h4 className="text-sm font-black uppercase tracking-widest text-center text-white/60 italic">État Psychologique</h4>
              
              <div className="grid grid-cols-3 gap-4">
                {[
                  { id: 'great', icon: Smile, label: 'Optimal', color: 'text-pitch-green' },
                  { id: 'okay', icon: Meh, label: 'Normal', color: 'text-gold' },
                  { id: 'tired', icon: Frown, label: 'Épuisé', color: 'text-rose-500' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMood(m.id as any)}
                    className={cn(
                      "p-6 rounded-2xl border flex flex-col items-center gap-3 transition active:scale-95",
                      mood === m.id ? "bg-white/10 border-white/30 shadow-2xl" : "bg-white/[0.02] border-white/5 grayscale opacity-40"
                    )}
                  >
                    <m.icon className={cn(mood === m.id ? m.color : "text-white")} size={32} />
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/60">{m.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 bg-white/5 text-white/40 font-bold rounded-2xl">Retour</button>
                <button onClick={() => setStep(3)} className="flex-2 py-4 bg-pitch-green/10 border border-pitch-green/20 text-pitch-green font-black uppercase tracking-widest rounded-2xl flex-1">Suivant</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h4 className="text-sm font-black uppercase tracking-widest text-center text-white/60 italic">Niveau de Fatigue Musculaire</h4>
              
              <div className="flex items-center justify-between gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFatigue(lvl)}
                    className={cn(
                      "w-12 h-12 rounded-xl border flex items-center justify-center transition",
                      fatigue >= lvl ? "bg-rose-500/20 border-rose-500/40 text-rose-500 shadow-glow" : "bg-white/5 border-white/10 text-white/20"
                    )}
                  >
                    <Battery size={20} className={fatigue >= lvl ? "fill-current" : ""} />
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] text-white/40 italic text-center">
                Fatigue détectée: <span className={cn("font-bold", fatigue > 3 ? "text-rose-500" : "text-pitch-green")}>
                  {fatigue === 1 && "Récupération Totale"}
                  {fatigue === 2 && "Légère Tension"}
                  {fatigue === 3 && "Fatigue Normale"}
                  {fatigue === 4 && "Seuil de Risque"}
                  {fatigue === 5 && "Sur-entraînement"}
                </span>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-widest text-center">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)} 
                  disabled={loading}
                  className="flex-1 py-4 bg-white/5 text-white/40 font-bold rounded-2xl disabled:opacity-50"
                >
                  Retour
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={loading}
                  className="flex-2 py-4 bg-pitch-green text-navy-deep font-black uppercase tracking-widest rounded-2xl flex-1 shadow-glow-green/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-navy-deep/30 border-t-navy-deep rounded-full animate-spin" />
                  ) : "Finaliser"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
