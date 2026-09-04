'use client';

import { useState } from 'react';
import { UserPlus, Check, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RecruitmentNotifsPanel({ messages }: { messages: any[] }) {
  const [notifs, setNotifs] = useState(messages);

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/join/read?id=${id}`, { method: 'POST' });
      if (res.ok) {
        setNotifs(prev => prev.filter(m => m.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (notifs.length === 0) return null;

  return (
    <div className="glass-card-elevated p-6 rounded-3xl border-gold/30 bg-navy-deep/50 relative overflow-hidden mb-8">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <UserPlus size={100} className="text-gold" />
      </div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/50 flex items-center justify-center text-gold animate-pulse">
          <MessageSquare size={18} />
        </div>
        <div>
          <h3 className="text-lg font-black italic text-white uppercase tracking-widest drop-shadow-glow">
            Nouvelles Demandes ({notifs.length})
          </h3>
          <p className="text-[10px] text-white/50 uppercase tracking-widest italic">Recrutement & Inscriptions</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <AnimatePresence>
          {notifs.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                    msg.type === 'joueur' ? 'bg-blue-500/20 text-blue-400' : 
                    msg.type === 'partenaire' ? 'bg-gold/20 text-gold' : 
                    msg.type === 'contact' ? 'bg-pitch-green/20 text-pitch-green' : 
                    'bg-pink-500/20 text-pink-400'
                  }`}>
                    {
                      msg.type === 'joueur' ? 'Nouveau Joueur' : 
                      msg.type === 'partenaire' ? 'Nouveau Partenaire' : 
                      msg.type === 'contact' ? 'Message de Contact' : 
                      'Candidature Staff'
                    }
                  </span>
                  <span className="text-[10px] text-white/40 italic">{new Date(msg.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <h4 className="font-bold text-white uppercase">{msg.prenom} {msg.nom}</h4>
                <p className="text-sm text-white/70 mt-1">
                  {
                    msg.type === 'joueur' ? `Catégorie: ${msg.categorie}` : 
                    msg.type === 'partenaire' ? `Partenariat` : 
                    msg.type === 'contact' ? `Sujet: ${msg.categorie}` : 
                    `Poste: ${msg.poste}`
                  }
                </p>
                <div className="text-xs text-white/50 mt-2 italic whitespace-pre-wrap">
                  " {msg.message || 'Aucun message'} "
                </div>
                <div className="text-[10px] text-white/40 mt-3 font-mono flex items-center gap-2">
                  <a href={`mailto:${msg.email}`} className="hover:text-gold transition-colors">{msg.email}</a> 
                  • 
                  <a href={`tel:${msg.telephone}`} className="hover:text-gold transition-colors">{msg.telephone}</a>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button 
                  onClick={() => markAsRead(msg.id)}
                  className="p-3 bg-pitch-green/10 text-pitch-green hover:bg-pitch-green/20 rounded-xl transition-colors border border-pitch-green/20 flex items-center gap-2 text-xs uppercase font-bold tracking-wider"
                >
                  <Check size={16} /> Traité
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
