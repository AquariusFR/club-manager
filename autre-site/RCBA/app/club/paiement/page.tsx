import PageLabel from "@/components/PageLabel";
import { getSession } from "@/lib/authentication";
import { CreditCard, CheckCircle2, ShieldCheck, Wallet, Landmark, HelpCircle } from "lucide-react";
import clubData from "@/lib/data/club-info.json";

export default async function PaiementPage() {
  const session = await getSession();

  const detailedMethods = [
    {
      title: "Paiement en ligne",
      desc: "La méthode la plus simple et rapide via notre plateforme HelloAsso.",
      icon: <CreditCard size={24} />,
      status: "Recommandé",
      color: "text-blue-400",
      link: "https://www.helloasso.com/beta/associations/racing-club-bu-abondant/adhesions/licence-saison-2026-2027",
      linkText: "Payer sur HelloAsso"
    },
    {
      title: "Chèques Bancaires",
      desc: "Règlement à l'ordre du RCBA. Possibilité de paiement en 3 fois sans frais.",
      icon: <Landmark size={24} />,
      status: "Accepté",
      color: "text-gold"
    },
    {
      title: "Espèces",
      desc: "À remettre directement aux dirigeants lors des permanences au club.",
      icon: <Wallet size={24} />,
      status: "Accepté",
      color: "text-green-400"
    },
    {
      title: "Aides de l'État",
      desc: "Pass'Sport de 50€ accepté pour la saison 2025/2026.",
      icon: <ShieldCheck size={24} />,
      status: "Éligible",
      color: "text-purple-400"
    }
  ];

  return (
    <main className="min-h-screen bg-navy-deep text-white selection:bg-gold/30">
      
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <PageLabel 
          section="Inscription" 
          category="Finances" 
          title="Moyens de Paiement" 
          subtitle="Découvrez toutes les solutions de règlement acceptées par le RCBA pour votre licence."
          icon="tarifs"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          {detailedMethods.map((method, i) => (
            <div key={i} className="glass-card p-8 border-white/5 bg-white/[0.01] hover:border-gold/30 transition group flex flex-col">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${method.color} group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                  {method.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/10 bg-white/5 ${method.color === 'text-gold' ? 'text-gold border-gold/20' : ''}`}>
                  {method.status}
                </span>
              </div>
              <h3 className="text-xl font-black italic uppercase text-white mb-3 tracking-tight athletic-title">{method.title}</h3>
              <p className="text-white/60 text-sm italic leading-relaxed mb-6 flex-grow">{method.desc}</p>
              
              {method.link && (
                <a 
                  href={method.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-black italic uppercase tracking-wider rounded-xl transition-colors w-full sm:w-auto"
                >
                  {method.linkText}
                </a>
              )}
            </div>
          ))}
        </div>

        <section className="glass-card p-10 border-gold/20 bg-gold/[0.02] mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <h3 className="text-2xl font-black italic uppercase text-gold mb-6 flex items-center gap-4">
                 <ShieldCheck size={24} />
                 Paiement Sécurisé
              </h3>
              <p className="text-white/60 text-lg italic leading-relaxed mb-6">
                Le RCBA s'engage à sécuriser vos transactions. Pour tout paiement en ligne, nous utilisons des passerelles de paiement certifiées conformes aux normes de sécurité bancaire.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest italic text-white/40">
                  <CheckCircle2 size={12} className="text-gold" /> SSL Encrypted
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest italic text-white/40">
                  <CheckCircle2 size={12} className="text-gold" /> 3D Secure
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest italic text-white/40">
                  <CheckCircle2 size={12} className="text-gold" /> RGPD Compliant
                </div>
              </div>
            </div>
            <div className="w-full md:w-64 aspect-square rounded-[2rem] border border-gold/20 bg-white/5 flex items-center justify-center p-8 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gold/5 blur-3xl group-hover:bg-gold/10 transition duration-700" />
               <CreditCard size={100} className="text-gold/20 group-hover:text-gold/40 transition duration-700 group-hover:scale-110" />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
           <div className="glass-card p-8 border-white/5 bg-white/[0.01]">
              <div className="text-gold mb-4"><HelpCircle size={24} /></div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2 italic">Besoin d'aide ?</h4>
              <p className="text-white/40 text-sm italic">Notre trésorière est disponible pour toute question relative au règlement de votre licence.</p>
           </div>
           <div className="glass-card p-8 border-white/5 bg-white/[0.01]">
              <div className="text-gold mb-4"><CheckCircle2 size={24} /></div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2 italic">Rappel Échéances</h4>
              <p className="text-white/40 text-sm italic">Les règlements par chèques (3x) sont encaissés en Octobre, Novembre et Décembre.</p>
           </div>
           <div className="glass-card p-8 border-white/5 bg-white/[0.01]">
              <div className="text-gold mb-4"><Landmark size={24} /></div>
              <h4 className="text-sm font-black uppercase tracking-widest text-white mb-2 italic">Autres Aides</h4>
              <p className="text-white/40 text-sm italic">Coupons Sport et Chèques Vacances ANCV sont acceptés sans frais supplémentaires.</p>
           </div>
        </section>
      </div>
    </main>
  );
}
