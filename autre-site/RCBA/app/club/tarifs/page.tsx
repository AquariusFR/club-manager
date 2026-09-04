import PageLabel from "@/components/PageLabel";
import Link from "next/link";
import { getSession } from "@/lib/authentication";
import { Euro, CreditCard, CheckCircle2, Info, Package } from "lucide-react";
import clubData from "@/lib/data/club-info.json";

export default async function TarifsPage() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-navy-deep text-white selection:bg-gold/30">
      
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <PageLabel 
          section="Club" 
          category="Adhésion" 
          title="Tarifs Licences" 
          subtitle="Consultez les tarifs d'adhésion pour la saison 2025/2026. Des solutions adaptées pour chaque catégorie d'âge."
          icon="tarifs"
        />


        <section className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="glass-card overflow-hidden border-white/5 bg-white/[0.01]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="px-8 py-6 text-[11px] font-black uppercase text-gold/60 italic tracking-[0.2em]">Catégorie</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase text-gold/60 italic tracking-[0.2em]">Tarif Annuel</th>
                  <th className="px-8 py-6 text-[11px] font-black uppercase text-gold/60 italic tracking-[0.2em] hidden md:table-cell">Équipement inclus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {clubData.cotisations.map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-8">
                      <span className="text-xl font-black text-white italic athletic-title athletic-skew tracking-tight uppercase group-hover:text-gold transition-colors">{item.category}</span>
                    </td>
                    <td className="px-8 py-8">
                      <span className="text-3xl font-black text-white italic athletic-title athletic-skew tracking-tight tabular-nums">{item.price}€</span>
                    </td>
                    <td className="px-8 py-8 text-white/80 text-sm italic font-medium hidden md:table-cell">
                       <div className="flex items-center gap-2">
                          <Package size={14} className="text-gold/40" />
                          {item.includes}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          <section className="glass-card p-10 border-white/5 bg-white/[0.01] flex flex-col justify-between animate-in fade-in slide-in-from-left-4 duration-1000 delay-400">
            <div>
              <h3 className="text-2xl font-black italic uppercase text-white mb-8 flex items-center gap-4">
                <CreditCard size={24} className="text-gold" />
                Modes de <span className="text-gold/60">Paiement</span>
              </h3>
              <div className="space-y-4">
                {clubData.payments.map((method, i) => (
                  <div key={i} className="flex items-center gap-4 text-base font-bold italic text-white/70 group">
                    <CheckCircle2 size={18} className="text-gold opacity-40 group-hover:opacity-100 transition-opacity" />
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="glass-card p-10 border-gold/20 bg-gold/[0.02] animate-in fade-in slide-in-from-right-4 duration-1000 delay-600">
            <h3 className="text-2xl font-black italic uppercase text-gold mb-8 flex items-center gap-4">
               <Info size={24} />
               Informations <span className="text-white/70">Pratiques</span>
            </h3>
            <div className="space-y-6 text-white/60 text-lg italic leading-relaxed">
               <p>
                  Les licences sont valables du 1er Juillet au 30 Juin. Le règlement peut être échelonné en **3 fois sans frais**.
               </p>
               <p>
                  <span className="text-gold font-bold">Réduction Famille :</span> Bénéficiez d'une remise pour toute inscription multiple au sein du même foyer fiscal.
               </p>
               <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mt-6">
                  <p className="text-sm font-black uppercase text-white/70 mb-2">Aide de l'État</p>
                  <p className="text-white font-bold italic">Le pass'Sport de 50€ est accepté par le club pour la saison en cours.</p>
               </div>
            </div>
          </section>
        </div>

        {/* ── RECUREMENT CTA ── */}
        <section className="mt-16 text-center py-12 px-6 rounded-3xl bg-gold/5 border border-gold/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition duration-700">
             <Package size={80} className="text-gold" />
          </div>
          <h4 className="text-2xl font-black italic uppercase text-white mb-3 tracking-tight">Prêt à rejoindre l'aventure RCBA ?</h4>
          <p className="text-white/60 text-sm italic max-w-xl mx-auto mb-8 leading-relaxed">
            Les inscriptions pour la saison 2025/2026 sont officiellement ouvertes. Remplissez notre formulaire en ligne et gagnez du temps sur vos démarches administratives.
          </p>
          <div className="inline-block transform -skew-x-6">
             <Link href="/rejoindre" className="px-8 py-4 bg-gold text-navy-deep font-black text-sm uppercase tracking-widest hover:scale-105 active:scale-95 transition inline-block">
                <span className="inline-block transform skew-x-6">S'inscrire en ligne</span>
             </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
