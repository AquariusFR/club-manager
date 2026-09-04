'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Send, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import PageLabel from '@/components/PageLabel';
import HudCorners from '@/components/HudCorners';
import MagneticWrapper from '@/components/MagneticWrapper';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: 'Demande de renseignement',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          sujet: 'Demande de renseignement',
          message: ''
        });
        setTimeout(() => setIsSuccess(false), 4000);
      } else {
        alert("Une erreur est survenue lors de l'envoi de votre message.");
      }
    } catch (error) {
      alert("Une erreur de connexion est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-navy-deep text-white selection:bg-gold/30 relative overflow-hidden pb-40">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[180px] opacity-40 animate-pulse duration-[10000ms]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10 space-y-24">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 -mb-16 text-xs text-white/50">
          <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Accueil
          </Link>
          <span>/</span>
          <span className="text-gold font-medium">Contact</span>
        </div>

        {/* Header section */}
        <PageLabel 
          section="CONTACT" 
          category="COMMUNICATION" 
          title="NOUS CONTACTER" 
          subtitle="N'hésitez pas à nous envoyer un message pour toute question, demande de partenariat ou renseignement sur les inscriptions."
          icon="club"
          variant="gold"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-16">
          
          {/* LEFT: Info Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="glass-card p-8 md:p-10 border-white/5 bg-white/[0.01] relative overflow-hidden group backdrop-blur-3xl rounded-[2.5rem]">
              <HudCorners color="#d4af37" opacity={0.1} />
              <div className="absolute -bottom-10 -right-10 opacity-[0.02] group-hover:opacity-5 group-hover:scale-110 transition duration-1000">
                <Globe size={200} className="text-gold" />
              </div>
              
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gold mb-10">Coordonnées du Club</h3>
              
              <div className="grid gap-10">
                {[
                  { icon: MapPin, label: "Adresse du Club", val: "Rue du Stade, 28410 Bû", sub: "Complexe Sportif Municipal & Stade d'Abondant", color: "text-gold" },
                  { icon: Phone, label: "Permanence Club", val: "Permanence aux Stades", sub: "Mercredi & Samedi lors des entraînements", color: "text-blue-400" },
                  { icon: Mail, label: "Adresse E-mail Officielle", val: "582697@lcfoot.fr", sub: "Courriel officiel FFF & Secrétariat", color: "text-pitch-green" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group/item">
                    <div className={`p-3 bg-white/5 rounded-xl border border-white/10 group-hover/item:border-current transition ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-0.5">{item.label}</h4>
                      <p className="text-lg font-bold italic text-white athletic-title athletic-skew tracking-tight group-hover/item:text-gold transition-colors">{item.val}</p>
                      <p className="text-xs text-white/40 italic font-light">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[8px] font-black uppercase text-white/20 tracking-widest italic">
                  <CheckCircle2 size={10} className="text-pitch-green" />
                  Secrétariat RCBA
                </div>
                <div className="text-[9px] font-mono text-gold/30">Bû & Abondant (28)</div>
              </div>
            </div>

            <div className="flex items-center gap-5 p-6 rounded-2xl bg-white/[0.01] border border-white/5 shadow-inner">
              <div className="w-10 h-10 rounded-xl bg-pitch-green/10 flex items-center justify-center text-pitch-green border border-pitch-green/20 shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-xs text-white/50 leading-relaxed font-medium">
                Votre message sera directement acheminé vers le tableau de bord de notre équipe administrative pour un traitement rapide et centralisé.
              </p>
            </div>
          </div>

          {/* RIGHT: Contact Form (7 cols) */}
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
            <div className="glass-card p-8 md:p-10 border-white/5 bg-white/[0.01] relative rounded-[2.5rem] backdrop-blur-3xl">
              <HudCorners color="#d4af37" opacity={0.1} />
              
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gold mb-8">Envoyer un message</h3>

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-pitch-green/10 border border-pitch-green/40 flex items-center justify-center text-pitch-green">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="text-xl font-bold text-white uppercase tracking-wider">Message envoyé !</h4>
                  <p className="text-white/60 text-sm italic max-w-sm">
                    Votre message a été transmis avec succès au secrétariat du club. Nous vous répondrons très prochainement.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-nom" className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 italic">Nom *</label>
                      <input 
                        id="contact-nom" 
                        required 
                        type="text" 
                        name="nom" 
                        value={formData.nom} 
                        onChange={handleChange} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors text-white" 
                        placeholder="Votre nom" 
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-prenom" className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 italic">Prénom *</label>
                      <input 
                        id="contact-prenom" 
                        required 
                        type="text" 
                        name="prenom" 
                        value={formData.prenom} 
                        onChange={handleChange} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors text-white" 
                        placeholder="Votre prénom" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contact-email" className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 italic">Email *</label>
                      <input 
                        id="contact-email" 
                        required 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors text-white" 
                        placeholder="votre@email.com" 
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-telephone" className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 italic">Téléphone</label>
                      <input 
                        id="contact-telephone" 
                        type="tel" 
                        name="telephone" 
                        value={formData.telephone} 
                        onChange={handleChange} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors text-white" 
                        placeholder="06 12 34 56 78" 
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-sujet" className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 italic">Sujet *</label>
                    <select 
                      id="contact-sujet" 
                      required 
                      name="sujet" 
                      value={formData.sujet} 
                      onChange={handleChange} 
                      className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors text-white"
                    >
                      <option value="Demande de renseignement">Demande de renseignement</option>
                      <option value="Inscription / Licence">Inscriptions &amp; Licences</option>
                      <option value="Partenariat / Sponsoring">Partenariat &amp; Sponsoring</option>
                      <option value="Autre demande">Autre demande</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 italic">Message *</label>
                    <textarea 
                      id="contact-message" 
                      required 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      rows={5} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition-colors resize-none text-white" 
                      placeholder="Comment pouvons-nous vous aider ?" 
                    />
                  </div>

                  <MagneticWrapper>
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-gold text-navy-deep font-black text-xs md:text-sm uppercase tracking-widest hover:scale-[1.01] active:scale-[0.98] transition flex items-center justify-center gap-2 transform active:scale-96"
                    >
                      {isSubmitting ? (
                        <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</>
                      ) : (
                        <><Send size={16} /> Envoyer le message</>
                      )}
                    </button>
                  </MagneticWrapper>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* FOOTER DECORATION */}
      <footer className="mt-40 border-t border-white/5 pt-16 pb-12 opacity-40">
         <div className="container mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-8 text-[9px] font-black uppercase tracking-[0.5em] text-white/20 italic">
               <span>Racing Club Bû Abondant</span>
               <div className="w-px h-6 bg-white/10" />
               <span className="text-gold/40">Secrétariat Actif</span>
            </div>
         </div>
      </footer>
    </main>
  );
}
