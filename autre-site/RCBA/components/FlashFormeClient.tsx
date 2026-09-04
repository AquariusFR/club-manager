"use client";

import { useState } from "react";
import { submitFlashForme } from "@/lib/performance-actions";
import { Activity, Brain, Battery, Utensils, ActivitySquare, CheckCircle2 } from "lucide-react";
import MagneticWrapper from "@/components/MagneticWrapper";
import HudCorners from "@/components/HudCorners";

const ZONES = [
  "Cheville G.", "Cheville D.",
  "Genou G.", "Genou D.",
  "Cuisse G.", "Cuisse D.",
  "Dos/Lombaire", "Pubis",
  "Autre"
];

export default function FlashFormeClient() {
  const [sleep, setSleep] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [pain, setPain] = useState(3);
  const [stress, setStress] = useState(3);
  const [nutrition, setNutrition] = useState(3);
  const [painLocation, setPainLocation] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successScore, setSuccessScore] = useState<number | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await submitFlashForme({
      sleep_quality: sleep,
      energy_level: energy,
      pain_level: pain,
      pain_location: pain < 3 ? painLocation : undefined,
      stress_level: stress,
      nutrition_hydration: nutrition
    });
    
    if (result.success && result.sdi_score) {
      setSuccessScore(result.sdi_score);
    }
    setIsSubmitting(false);
  };

  if (successScore !== null) {
    return (
      <div className="glass-card-elevated p-12 text-center relative overflow-hidden rounded-[3rem] border-pitch-green/20 bg-pitch-green/[0.03]">
        <HudCorners color="#4ade80" opacity={0.3} size={40} />
        <div className="w-24 h-24 rounded-full bg-pitch-green/10 border border-pitch-green/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(74,222,128,0.2)]">
          <CheckCircle2 size={48} className="text-pitch-green drop-shadow-glow" />
        </div>
        <h2 className="athletic-title text-4xl mb-4 italic text-white uppercase drop-shadow-glow">Données Enregistrées</h2>
        <p className="text-white/60 mb-8 uppercase tracking-widest text-sm italic">Score de Disponibilité Immédiate :</p>
        <div className="text-6xl font-black italic text-pitch-green drop-shadow-glow">
          {successScore}<span className="text-2xl text-pitch-green/50">%</span>
        </div>
      </div>
    );
  }

  const renderSlider = (label: string, value: number, setter: (v: number) => void, minLabel: string, maxLabel: string, icon: any) => (
    <div className="glass-card-elevated p-8 rounded-3xl border-white/5 bg-white/[0.01] space-y-6 relative group glass-edge-highlight">
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-pitch-green/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-white/5 rounded-xl text-pitch-green">{icon}</div>
        <h3 className="text-lg font-black uppercase italic tracking-widest text-white drop-shadow-glow">{label}</h3>
      </div>
      
      <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-white/40 italic">
        <span className={value <= 2 ? "text-red-400" : ""}>{minLabel}</span>
        <div className="text-2xl text-white font-black">{value}</div>
        <span className={value >= 4 ? "text-pitch-green" : ""}>{maxLabel}</span>
      </div>
      
      <input 
        type="range" 
        min="1" max="5" 
        value={value} 
        onChange={e => setter(Number(e.target.value))} 
        className="w-full accent-pitch-green h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );

  return (
    <div className="space-y-8">
      {renderSlider("Qualité du Sommeil", sleep, setSleep, "Mauvais/Inexistant", "Réparateur/Profond", <ActivitySquare size={24} />)}
      {renderSlider("Niveau d'Énergie", energy, setEnergy, "Épuisé", "Explosif", <Battery size={24} />)}
      {renderSlider("Douleurs Musculaires", pain, setPain, "Douleurs Vives", "Aucune Gêne", <Activity size={24} />)}
      
      {pain < 3 && (
        <div className="glass-card-elevated p-8 rounded-3xl border-orange-500/20 bg-orange-500/[0.03] space-y-6 relative animate-in fade-in zoom-in-95 duration-500">
          <HudCorners color="#f97316" opacity={0.3} size={20} />
          <h3 className="text-sm font-black uppercase italic tracking-widest text-orange-500 drop-shadow-glow">Où as-tu mal ?</h3>
          <div className="flex flex-wrap gap-3">
            {ZONES.map(zone => (
              <button 
                key={zone}
                onClick={() => setPainLocation(zone)}
                className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-widest italic transition border ${painLocation === zone ? 'bg-orange-500 text-navy-deep border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-white/5 text-white/60 border-white/10 hover:border-orange-500/50 hover:text-orange-500'}`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>
      )}

      {renderSlider("Niveau de Sérénité (Stress)", stress, setStress, "Très Stressé", "Totalement Serein", <Brain size={24} />)}
      {renderSlider("Appétit & Hydratation", nutrition, setNutrition, "Pas mangé/bu", "Parfait", <Utensils size={24} />)}

      <div className="pt-8">
        <MagneticWrapper>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || (pain < 3 && !painLocation)}
            className="w-full py-6 bg-pitch-green text-navy-deep rounded-2xl text-[12px] font-black uppercase tracking-[0.4em] hover:bg-gold hover:text-navy-deep active:scale-95 transition shadow-[0_0_40px_rgba(74,222,128,0.2)] italic border border-pitch-green/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "TRANSMISSION..." : "SOUMETTRE MON FLASH FORME"}
          </button>
        </MagneticWrapper>
      </div>
    </div>
  );
}
