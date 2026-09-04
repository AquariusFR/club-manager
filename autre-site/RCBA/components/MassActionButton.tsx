"use client";

import { useState, useRef } from "react";
import { Send, AlertTriangle, X, Check, Loader2 } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MassActionButtonProps {
  label: string;
  action: () => Promise<{ success: boolean; count: number; error: string }>;
  description: string;
}

export default function MassActionButton({ label, action, description }: MassActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<{ count: number; error: string } | null>(null);
  
  // Magnetic Effect Logic
  const ref = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    mouseX.set((e.clientX - centerX) * 0.3);
    mouseY.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleExecute = async () => {
    setIsPending(true);
    try {
      const res = await action();
      setResult({ count: res.count, error: res.error });
      if (res.success) {
        setTimeout(() => {
          setIsOpen(false);
          setResult(null);
        }, 3000);
      }
    } catch (e: any) {
      console.error(e);
      setResult({ count: 0, error: "Erreur lors de l'exécution du protocole." });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <motion.button 
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x, y }}
        onClick={() => setIsOpen(true)}
        className="w-full py-5 bg-gold text-navy-deep font-black text-[10px] uppercase tracking-wider rounded-2xl hover:bg-gold-light hover:shadow-2xl active:scale-95 transition shadow-xl shadow-gold/10 flex items-center justify-center gap-3 group/btn italic relative overflow-hidden whitespace-nowrap"
      >
        <Send size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
        {label}
      </motion.button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy-deep/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="glass-card max-w-md w-full p-10 border-gold/20 bg-white/[0.02] relative overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.15)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gold/10 overflow-hidden">
              {isPending && (
                <motion.div 
                  className="h-full bg-gold shadow-[0_0_15px_#d4af37]"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              )}
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 rounded-3xl bg-gold/10 flex items-center justify-center text-gold mb-8 mx-auto border border-gold/20 shadow-2xl shadow-gold/5">
              {isPending ? (
                <Loader2 size={40} className="animate-spin" />
              ) : (
                <AlertTriangle size={40} className="animate-pulse" />
              )}
            </div>

            <h3 className="athletic-title text-3xl text-white italic text-center mb-4">CONFIRMER <span className="text-gold">L'ACTION</span></h3>
            <p className="text-center text-white/70 text-[11px] leading-relaxed mb-10 px-4 uppercase tracking-tighter">
              {description || "Cette action va déclencher une communication massive vers l'ensemble des destinataires concernés."}
            </p>

            {result?.error && (
              <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-[10px] font-bold text-center uppercase tracking-widest">
                {result.error}
              </div>
            )}

            <div className="flex gap-4">
              <button 
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="flex-1 py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-wider text-white/60 hover:bg-white/5 transition whitespace-nowrap"
              >
                Annuler
              </button>
              <button 
                disabled={isPending || (result !== null && result.count > 0)}
                onClick={handleExecute}
                className={`flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-wider transition flex items-center justify-center gap-2 whitespace-nowrap ${
                  result?.count ? 'bg-pitch-green text-navy-deep' : 'bg-gold text-navy-deep'
                }`}
              >
                {isPending ? (
                  "TRAITEMENT..."
                ) : result?.count ? (
                  <><Check size={16} /> {result.count} ENVOYÉS</>
                ) : (
                  "LANCER LE PROTOCOLE"
                )}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <span className="text-[7px] font-black uppercase tracking-wider text-white/70 italic">RCBA SECURE BROADCAST v2.5</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
