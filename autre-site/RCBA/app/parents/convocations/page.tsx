import React from 'react';
import { getSession } from '@/lib/authentication';
import { getDb } from '@/lib/db';
import Link from 'next/link';
import PageLabel from '@/components/PageLabel';
import { CalendarDays, MapPin, Clock, ChevronRight } from 'lucide-react';
import MagneticWrapper from '@/components/MagneticWrapper';

export default async function ParentsConvocations() {
  const session = await getSession();
  if (!session || (!session.playerId && session.roleName !== 'Direction' && session.roleName.toLowerCase() !== 'admin')) {
    return <div className="p-8 text-white">Accès refusé</div>;
  }

  const db = await getDb();
  
  const convocations = await db.all(`
    SELECT c.id as convocation_id, e.titre, e.date, e.heure, e.lieu, e.type, cr.statut
    FROM ConvocationResponses cr
    JOIN Convocations c ON cr.convocation_id = c.id
    JOIN Evenements e ON c.evenement_id = e.id
    WHERE cr.joueur_id = ?
    ORDER BY e.date DESC
  `, [session.playerId]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'présent': return 'bg-pitch-green text-navy-deep';
      case 'absent': return 'bg-red-500 text-white';
      default: return 'bg-orange-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep text-white flex flex-col font-sans p-8 pt-24">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        <PageLabel 
          section="Joueur"
          category="Convocations"
          title="Mes Convocations"
          subtitle="Gérez votre présence aux matchs et entraînements."
          icon="staff"
          variant="gold"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {convocations.length === 0 ? (
            <div className="col-span-full text-center text-white/50 py-12">
              Aucune convocation trouvée.
            </div>
          ) : (
            convocations.map((conv: any) => (
              <Link key={conv.convocation_id} href={`/parents/convocations/${conv.convocation_id}`}>
                <div className="glass-card-elevated p-6 rounded-3xl border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition cursor-pointer group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1 italic">
                        {conv.type}
                      </div>
                      <h3 className="text-xl font-black italic uppercase tracking-wider">{conv.titre}</h3>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest italic ${getStatusColor(conv.statut)}`}>
                      {conv.statut || 'En Attente'}
                    </div>
                  </div>

                  <div className="space-y-2 mt-auto text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-orange-400/70" />
                      <span>{new Date(conv.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-orange-400/70" />
                      <span>{conv.heure}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-orange-400/70" />
                      <span className="truncate">{conv.lieu}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <MagneticWrapper>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors border border-white/10">
                        <ChevronRight size={18} />
                      </div>
                    </MagneticWrapper>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
