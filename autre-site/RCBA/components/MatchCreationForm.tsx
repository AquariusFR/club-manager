 'use client';

 

 import React, { useState } from 'react';

 import { 

  Calendar, 

  MapPin, 

  Trophy, 

  PlusCircle, 

  ChevronRight, 

  TrendingUp, 

  Star, 

  Activity 

 } from "lucide-react";

 import SynergyPlayerList from "./SynergyPlayerList";

 

 interface MatchCreationFormProps {

  players: any[];

  createEventAction: (formData: FormData) => Promise<any>;

 }

 

 export default function MatchCreationForm({ players, createEventAction }: MatchCreationFormProps) {

  const [date, setDate] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

 

  async function handleSubmit(formData: FormData) {

   setIsSubmitting(true);

   const result = await createEventAction(formData);

   if (result .error) {

    alert(result.error);

    setIsSubmitting(false);

   } else {

    window.location.href = '/coaches/events';

   }

  }

 

  return (

   <form action={handleSubmit} className="grid lg:grid-cols-3 gap-8">

    {/* Main Form Area */}

    <div className="lg:col-span-2 space-y-8">

     <section className="glass-card p-8 border-gold/10 bg-white/5 relative overflow-hidden">

      <div className="absolute top-0 right-0 p-8 opacity-5">

       <Trophy size={100} className="text-gold" />

      </div>

      

      <div className="relative z-10 grid md:grid-cols-2 gap-6">

       <h3 className="athletic-title text-xl text-white col-span-full border-b border-white/5 pb-4 mb-2 flex items-center gap-2">

        <Calendar className="text-gold" size={20} /> Détails du Match

       </h3>

 

       <div className="space-y-2 col-span-full">

        <label className="text-[10px] font-black uppercase tracking-wider text-foreground/60 ml-1 whitespace-nowrap">Titre de la Convocation</label>

        <input 

         type="text" 

         name="titre" 

         placeholder="Ex: Match Championnat R2 - J12" 

         required

         className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-gold/50 transition shadow-inner" 

        />

       </div>

 

       <div className="space-y-2">

        <label className="text-[10px] font-black uppercase tracking-wider text-foreground/60 ml-1 whitespace-nowrap">Type d'Évènement</label>

        <select name="type" className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-gold/50 transition appearance-none cursor-pointer shadow-inner">

         <option value="Match">Match Officiel</option>

         <option value="Amical">Amical</option>

         <option value="Entrainement">Entrainement</option>

         <option value="Tournoi">Tournoi</option>

        </select>

       </div>

 

       <div className="space-y-2">

        <label className="text-[10px] font-black uppercase tracking-wider text-foreground/60 ml-1 whitespace-nowrap">Adversaire</label>

        <div className="relative">

         <Trophy size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80" />

         <input type="text" name="adversaire" placeholder="Ex: FC Nantes" className="w-full bg-navy border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white font-bold outline-none focus:border-gold/50 transition shadow-inner" />

        </div>

       </div>

 

       <div className="space-y-2">

        <label className="text-[10px] font-black uppercase tracking-wider text-foreground/60 ml-1 whitespace-nowrap">Lieu</label>

        <div className="relative">

         <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80" />

         <input type="text" name="lieu" placeholder="Ex: Complexe Bù" className="w-full bg-navy border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white font-bold outline-none focus:border-gold/50 transition shadow-inner" />

        </div>

       </div>

 

       <div className="space-y-2">

        <label className="text-[10px] font-black uppercase tracking-wider text-foreground/60 ml-1 whitespace-nowrap">Date & Heure</label>

        <input 

         type="datetime-local" 

         name="date" 

         value={date}

         onChange={(e) => setDate(e.target.value)}

         required

         className="w-full bg-navy border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-gold/50 transition shadow-inner" 

        />

       </div>

 

       {/* Injected Equipe ID from first player's squad as default if not specified */}

       <input type="hidden" name="equipe_id" value={players[0] .equipe_id || ''} />

 

      </div>

     </section>

 

     {/* Selection List - Client-Side Interactive */}

     <section className="glass-card border-white/5 overflow-hidden">

      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">

       <h3 className="athletic-title text-sm tracking-wider uppercase flex items-center gap-2 whitespace-nowrap">

        <Activity className="text-blue-400" size={18} /> Squad <span className="text-blue-400">Synergy</span>

       </h3>

       <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black uppercase tracking-wider text-blue-400 whitespace-nowrap">

        Cross-Selection Active

       </div>

      </div>

      

      <div className="p-6">

       <SynergyPlayerList players={players} selectedDate={date} />

      </div>

     </section>

    </div>

 

    {/* Action Sidebar */}

    <div className="space-y-6">

     <section className="glass-card p-8 border-gold/20 bg-gradient-to-br from-gold/10 to-transparent relative overflow-hidden group">

      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition duration-700" />

      

      <h3 className="athletic-title text-sm mb-6 flex items-center gap-2 text-gold">

       <TrendingUp size={16} /> Rapport Stratégique

      </h3>

      

      <div className="space-y-6 text-sm text-foreground/60 leading-relaxed mb-8 border-l border-gold/10 pl-6 relative">

       <div className="absolute top-0 left-0 w-1.5 h-1.5 -ml-[3px] rounded-full bg-gold animate-ping" />

       <p className="italic">

        "Le moteur Synergy analyse les scores FFF en temps réel. La sélection priorise l'équilibre entre les catégories Seniors et U18."

       </p>

       <p className="flex items-start gap-2">

        <Star size={12} className="text-gold shrink-0 mt-0.5" />

        <span>Conflits détectés selon l'agenda du club.</span>

       </p>

      </div>

 

      <button 

       type="submit" 

       disabled={isSubmitting}

       className="w-full bg-gold hover:bg-gold-light text-navy-deep font-black py-4 rounded-xl shadow-2xl shadow-gold/20 transition flex items-center justify-center gap-3 uppercase text-sm tracking-wider group/btn disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"

      >

       {isSubmitting ? (

        <Activity size={20} className="animate-spin" />

       ) : (

        <PlusCircle size={20} className="group-hover/btn:rotate-90 transition-transform duration-500" />

       )}

       {isSubmitting ? "Publication..." : "Publier Convocation"}

       {!isSubmitting && <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />}

      </button>

     </section>

 

     <section className="glass-card p-6 border-white/5 bg-white/5 text-center">

      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-white/60">

       <Activity size={20} />

      </div>

      <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground/60 mb-2 whitespace-nowrap">Notification Automatique</h4>

      <p className="text-[10px] text-foreground/50 leading-relaxed max-w-[200px] mx-auto">

       Une fois publiée, chaque joueur recevra une alerte ainsi qu'un e-mail de confirmation.

      </p>

     </section>

    </div>

   </form>

  );

 }

 
