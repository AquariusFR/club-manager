import PageLabel from "@/components/PageLabel";
import { getSession } from "@/lib/authentication";
import { Clock, MapPin, Calendar, Info, Users } from "lucide-react";
import clubData from "@/lib/data/club-info.json";

export default async function HorairesPage() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-navy-deep text-white selection:bg-gold/30">
      
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <PageLabel 
          section="Club" 
          category="Saison 2025/2026" 
          title="Horaires Entraînements" 
          subtitle="Retrouvez les créneaux d'entraînement pour toutes les catégories du RCBA. Les séances se déroulent sur nos deux sites : Bû et Abondant."
          icon="club"
        />

        <section className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="glass-card overflow-hidden border-white/5 bg-white/[0.01]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="px-8 py-6 text-[11px] font-black uppercase text-gold/60 italic tracking-[0.2em]">Catégorie</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase text-gold/60 italic tracking-[0.2em]">Jours</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase text-gold/60 italic tracking-[0.2em]">Horaires</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase text-gold/60 italic tracking-[0.2em]">Lieu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clubData.horaires.map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                           <Users size={20} />
                        </div>
                        <span className="text-xl font-black text-white italic athletic-title athletic-skew tracking-tight uppercase group-hover:text-gold transition-colors">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2 text-white/80 font-bold italic">
                        <Calendar size={16} className="text-gold/40" />
                        {item.days}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2 text-white font-black italic athletic-title tracking-wider">
                        <Clock size={16} className="text-gold/40" />
                        {item.time}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-2 text-white/70 italic font-medium">
                        <MapPin size={16} className="text-gold/40" />
                        {item.venue}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <section className="glass-card p-10 border-white/5 bg-white/[0.01] animate-in fade-in slide-in-from-left-4 duration-1000 delay-400">
            <h3 className="text-2xl font-black italic uppercase text-white mb-8 flex items-center gap-4">
              <MapPin size={24} className="text-gold" />
              Nos <span className="text-gold/60">Terrains</span>
            </h3>
            <div className="space-y-8">
              {clubData.venues.map((venue, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/30 transition">
                  <p className="text-sm font-black uppercase text-gold/60 mb-1 tracking-widest">{venue.type}</p>
                  <p className="text-xl font-black italic text-white uppercase mb-2">{venue.name}</p>
                  <p className="text-white/50 text-sm italic">{venue.address}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card p-10 border-gold/20 bg-gold/[0.02] animate-in fade-in slide-in-from-right-4 duration-1000 delay-600">
            <h3 className="text-2xl font-black italic uppercase text-gold mb-8 flex items-center gap-4">
               <Info size={24} />
               Consignes <span className="text-white/70">Importantes</span>
            </h3>
            <div className="space-y-6 text-white/60 text-lg italic leading-relaxed">
               <p>
                  Merci de vous présenter au moins **15 minutes avant** le début de la séance pour être prêt sur le terrain.
               </p>
               <p>
                  L'équipement complet du club est **obligatoire** (Pack équipement fourni lors de l'inscription).
               </p>
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mt-6">
                  <p className="text-sm font-black uppercase text-white/70 mb-2">En cas d'absence</p>
                  <p className="text-white font-bold italic">Prévenir impérativement votre coach via le portail ou le groupe WhatsApp de l'équipe.</p>
               </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
