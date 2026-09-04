import React from 'react';
import { getSession } from '@/lib/authentication';
import { getDb } from '@/lib/db';
import { respondToConvocation } from '@/lib/actions';
import PageLabel from '@/components/PageLabel';
import { CalendarDays, MapPin, Clock, Info, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import MagneticWrapper from '@/components/MagneticWrapper';

export default async function ConvocationDetails({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || (!session.playerId && session.roleName !== 'Direction' && session.roleName.toLowerCase() !== 'admin')) {
    return <div className="p-8 text-white">Accès refusé</div>;
  }

  const db = await getDb();
  
  const convocation = await db.get(`
    SELECT c.id as convocation_id, e.titre, e.date, e.heure, e.lieu, e.type, e.adversaire, cr.statut, cr.besoin_covoiturage, cr.commentaire
    FROM ConvocationResponses cr
    JOIN Convocations c ON cr.convocation_id = c.id
    JOIN Evenements e ON c.evenement_id = e.id
    WHERE cr.convocation_id = ? AND cr.joueur_id = ?
  `, [params.id, session.playerId]);

  if (!convocation) {
    return (
      <div className="min-h-screen bg-navy-deep text-white flex flex-col p-8 pt-24 items-center justify-center">
        <h1 className="text-2xl font-black italic text-red-500 uppercase">Convocation Introuvable</h1>
        <Link href="/parents/convocations" className="mt-4 text-orange-400 underline">Retour aux convocations</Link>
      </div>
    );
  }

  // Map to CONFIRME, DECLINE, INCERTAIN for the form defaults
  let currentStatus = 'INCERTAIN';
  if (convocation.statut === 'présent') currentStatus = 'CONFIRME';
  if (convocation.statut === 'absent') currentStatus = 'DECLINE';

  return (
    <div className="min-h-screen bg-navy-deep text-white flex flex-col font-sans p-8 pt-24">
      <div className="max-w-4xl mx-auto w-full space-y-8">
        <Link href="/parents/convocations" className="text-white/50 hover:text-orange-400 transition-colors uppercase tracking-widest text-[10px] font-black italic mb-8 block">
          &larr; Retour aux convocations
        </Link>

        <PageLabel 
          section="Événement"
          category={convocation.type}
          title={convocation.titre}
          subtitle={`Gérez votre présence pour cet événement.`}
          icon="staff"
          variant="purple"
        />

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Infos de l'événement */}
          <div className="glass-card-elevated p-8 rounded-3xl border-white/5 bg-white/[0.02] space-y-6">
            <h3 className="text-xl font-black italic uppercase tracking-wider text-orange-400 mb-6 drop-shadow-glow">Détails de l'événement</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <CalendarDays size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Date</div>
                  <div className="font-bold text-lg">{new Date(convocation.date).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Heure</div>
                  <div className="font-bold text-lg">{convocation.heure}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Lieu</div>
                  <div className="font-bold text-lg">{convocation.lieu}</div>
                </div>
              </div>

              {convocation.adversaire && (
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <Info size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">Adversaire</div>
                    <div className="font-bold text-lg">{convocation.adversaire}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Formulaire de réponse */}
          <div className="glass-card-elevated p-8 rounded-3xl border-white/5 bg-white/[0.02] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
            <h3 className="text-xl font-black italic uppercase tracking-wider text-white mb-6 drop-shadow-glow">Votre Réponse</h3>

            <form action={async (formData) => { "use server"; await respondToConvocation(formData); }} className="space-y-8">
              <input type="hidden" name="convocation_id" value={convocation.convocation_id} />
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest italic block">Statut de présence</label>
                <div className="grid grid-cols-1 gap-3">
                  <label className="relative cursor-pointer group">
                    <input type="radio" name="status" value="CONFIRME" defaultChecked={currentStatus === 'CONFIRME'} className="peer sr-only" />
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 peer-checked:bg-pitch-green/20 peer-checked:border-pitch-green/50 transition hover:bg-white/10">
                      <div className="w-10 h-10 rounded-xl bg-pitch-green/20 flex items-center justify-center text-pitch-green">
                        <CheckCircle size={20} />
                      </div>
                      <span className="font-bold text-white uppercase italic tracking-widest">Présent</span>
                    </div>
                  </label>

                  <label className="relative cursor-pointer group">
                    <input type="radio" name="status" value="DECLINE" defaultChecked={currentStatus === 'DECLINE'} className="peer sr-only" />
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 peer-checked:bg-red-500/20 peer-checked:border-red-500/50 transition hover:bg-white/10">
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500">
                        <XCircle size={20} />
                      </div>
                      <span className="font-bold text-white uppercase italic tracking-widest">Absent</span>
                    </div>
                  </label>

                  <label className="relative cursor-pointer group">
                    <input type="radio" name="status" value="INCERTAIN" defaultChecked={currentStatus === 'INCERTAIN'} className="peer sr-only" />
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 peer-checked:bg-orange-500/20 peer-checked:border-orange-500/50 transition hover:bg-white/10">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                        <HelpCircle size={20} />
                      </div>
                      <span className="font-bold text-white uppercase italic tracking-widest">Incertain</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" name="need_carpool" defaultChecked={convocation.besoin_covoiturage === 1} className="peer appearance-none w-6 h-6 border-2 border-white/20 rounded-lg bg-white/5 checked:bg-orange-500 checked:border-orange-500 transition-colors cursor-pointer" />
                    <CheckCircle size={16} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">J'ai besoin d'un covoiturage</span>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest italic block">Commentaire (optionnel)</label>
                <textarea 
                  name="comment"
                  defaultValue={convocation.commentaire || ''}
                  rows={3}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition resize-none"
                  placeholder="Une précision à apporter au coach ?"
                ></textarea>
              </div>

              <MagneticWrapper>
                <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] hover:bg-orange-600 active:scale-95 transition shadow-[0_0_20px_rgba(249,115,22,0.3)] italic">
                  Enregistrer ma réponse
                </button>
              </MagneticWrapper>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
