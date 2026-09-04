import React from 'react';
import { Mail, MapPin, Phone, Send, Clock, User, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <main>
      <div className="pt-32 pb-20 min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 relative">
            <div className="label-overline mb-3">Nous Joindre</div>
            <h1 className="athletic-title text-5xl md:text-6xl italic">NOUS <span className="text-gold">CONTACTER</span></h1>
          </div>

          <div className="grid md:grid-cols-5 gap-10">
            {/* Informations de Contact */}
            <div className="md:col-span-2 space-y-6">
              <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-gold/30 transition group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] -z-10 group-hover:bg-gold/10 transition" />
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Stade Municipal</h3>
                <p className="text-white/70 font-medium">
                  Rue du Stade<br/>
                  28410 Bû, France
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-gold/30 transition group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] -z-10 group-hover:bg-gold/10 transition" />
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Email</h3>
                <a href="mailto:contact@rcba.club" className="text-white/70 font-medium hover:text-gold transition-colors">
                  contact@rcba.club
                </a>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-gold/30 transition group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] -z-10 group-hover:bg-gold/10 transition" />
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Téléphone</h3>
                <p className="text-white/70 font-medium">
                  06 73 46 08 03
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-white/10 hover:border-gold/30 transition group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[50px] -z-10 group-hover:bg-gold/10 transition" />
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-white mb-2">Messenger</h3>
                <a href="https://www.facebook.com/racingclub.buabondant" target="_blank" rel="noopener noreferrer" className="text-white/70 font-medium hover:text-gold transition-colors">
                  Racing Club Bû Abondant
                </a>
              </div>
            </div>

            {/* Formulaire de Contact */}
            <div className="md:col-span-3">
              <div className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 relative overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent -z-10 pointer-events-none" />
                
                <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-8 flex items-center gap-3">
                  <MessageSquare className="text-gold" size={24} />
                  Envoyer un message
                </h2>

                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Nom complet</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                          <User size={18} />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Jean Dupont"
                          className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Adresse Email</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                          <Mail size={18} />
                        </div>
                        <input 
                          type="email" 
                          placeholder="jean@exemple.com"
                          className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Sujet</label>
                    <select className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition appearance-none cursor-pointer">
                      <option value="inscription">Renseignements Inscription</option>
                      <option value="partenariat">Devenir Partenaire / Sponsoring</option>
                      <option value="match">Organisation de Matchs</option>
                      <option value="autre">Autre demande</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Votre Message</label>
                    <textarea 
                      rows={5}
                      placeholder="Comment pouvons-nous vous aider ?"
                      className="w-full bg-navy-deep/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="button"
                    className="w-full bg-gold text-navy-deep font-black uppercase tracking-widest py-4 rounded-xl hover:bg-gold-bright transition-colors flex items-center justify-center gap-2"
                  >
                    Envoyer <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
