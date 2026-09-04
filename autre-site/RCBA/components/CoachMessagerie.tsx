"use client";

import { useState } from "react";
import { Send, MessageSquare, ShieldAlert } from "lucide-react";
import MagneticWrapper from "./MagneticWrapper";
import { sendCoachMessage } from "@/lib/actions";

export default function CoachMessagerie({ coachTeams }: { coachTeams: any[] }) {
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("DIRECTION");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("message", message);
    formData.append("target", target);

    try {
      const result = await sendCoachMessage(formData);
      if (result.success) {
        setSuccess(true);
        setMessage("");
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(result.error || "Erreur lors de l'envoi du message.");
      }
    } catch (e) {
      alert("Erreur inattendue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card-elevated p-8 rounded-[3rem] border-white/5 bg-white/[0.01] relative overflow-hidden hud-scanline glass-edge-highlight">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black italic text-white uppercase tracking-[0.2em] drop-shadow-glow flex items-center gap-3">
          <MessageSquare className="text-blue-500" size={24} />
          Messagerie Rapide
        </h3>
        <ShieldAlert size={24} className="text-white/20" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2 block italic">
            Destinataire
          </label>
          <select 
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-blue-500/50 outline-none transition italic font-bold tracking-widest"
          >
            <option value="DIRECTION" className="bg-navy-deep">Direction Sportive</option>
            {coachTeams.map((t) => (
              <option key={t.equipe_id} value={`EQUIPE_${t.equipe_id}`} className="bg-navy-deep">
                Mon Équipe (ID: {t.equipe_id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-2 block italic">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre message ici..."
            rows={4}
            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-blue-500/50 outline-none transition italic placeholder:text-white/20 resize-none custom-scrollbar"
          />
        </div>

        <div className="flex justify-between items-center">
          <span className={`text-xs font-bold uppercase tracking-widest italic transition-opacity ${success ? 'text-pitch-green opacity-100' : 'opacity-0'}`}>
            Message envoyé ✓
          </span>
          <MagneticWrapper>
            <button 
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-400 active:scale-95 transition shadow-[0_0_20px_rgba(59,130,246,0.3)] italic disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? "Envoi..." : "Envoyer"}
              <Send size={14} />
            </button>
          </MagneticWrapper>
        </div>
      </form>
    </div>
  );
}
