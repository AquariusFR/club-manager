 import { 
  ShieldAlert, 
  UserCheck, 
  ChevronRight, 
  Award,
  Zap
 } from "lucide-react";

 import Link from "next/link";

 import { getSession } from "@/lib/authentication";

 import PageLabel from "@/components/PageLabel";

 import ImageZoom from "@/components/ImageZoom";

 

 export default async function ArbitresPage() {

  const session = await getSession();

  const arbitres = [

   { "name": "Leny WAROQUIER", "role": "Arbitre Officiel", "photo": "/images/staff/leny-waroquier.png" }

  ];

 

  return (

   <div className="min-h-screen bg-navy-deep text-white font-body pb-32 overflow-x-hidden">

    {/* Unified Top Navigation Bar */}


 

    <div className="container mx-auto px-6 py-12 relative z-10">

     <PageLabel 
      section="Club"
      category="Éthique & Respect"
      title="Nos Arbitres" 
      subtitle="Garant de l'intégrité du jeu et du fair-play. Le RCBA est fier de compter des officiels engagés dans le rayonnement de notre sport." 
      icon="direction"
     />

 

     {/* Arbitres Display */}

     <div className="flex justify-center">

      {arbitres.map((a, idx) => (

       <div key={idx} className="glass-card group p-4 border-gold/20 bg-gold/[0.02] hover:bg-gold/[0.05] transition hover:-translate-y-4 hover:shadow-gold duration-700 max-w-md w-full">

        <div className="relative aspect-square rounded-[3rem] overflow-hidden mb-10 shadow-2xl border-2 border-gold/10">

          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep to-transparent opacity-60 z-10" />

          <ImageZoom src={a.photo} alt={a.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />

          

          {/* Floating Badge */}

          <div className="absolute top-6 right-6 z-20 bg-gold text-navy-deep p-3 rounded-2xl shadow-2xl">

           <Award size={24} />

          </div>

        </div>

 

        <div className="text-center pb-10">

          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-gold mb-3">{a.role}</div>

          <h3 className="athletic-title text-3xl mb-6 tracking-tight group-hover:text-gold transition-colors">{a.name}</h3>

          

          <div className="flex justify-center gap-4">

           <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/70">

             <UserCheck size={14} className="text-gold" /> Certifié FFF

           </div>

           <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/70">

             <ShieldAlert size={14} className="text-gold" /> Fair-Play

           </div>

          </div>

        </div>

       </div>

      ))}

     </div>

 

     {/* Recruitment CTA */}

     <section className="mt-40 relative">

      <div className="glass-card p-12 md:p-20 border-white/5 bg-white/[0.01] overflow-hidden group">

        <div className="max-w-2xl relative z-10">

         <h2 className="athletic-title text-3xl md:text-5xl mb-6">Rejoignez le corps <span className="text-gold">Arbitral</span></h2>

         <p className="text-white/70 text-lg leading-relaxed font-light italic mb-10">

          Le club accompagne et forme de nouveaux arbitres chaque saison. Vous souhaitez vous lancer ? Le RCBA finance intégralement votre formation officielle FFF et assure votre suivi sur le terrain.

         </p>

         <Link href="/rejoindre" className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-gold hover:text-white transition-colors group/btn">

           Devenir arbitre officiel au RCBA <ChevronRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />

         </Link>

        </div>

        <Zap size={300} className="absolute -right-20 -bottom-20 text-white/[0.02] group-hover:scale-110 transition-transform duration-1000 rotate-12" />

      </div>

     </section>

    </div>

 

    <footer className="mt-40 pt-10 border-t border-white/5 text-center flex flex-col items-center gap-6">

     <p className="text-white/70 text-[9px] font-black uppercase tracking-[0.4em]">

      Corps Arbitral — Racing Club Bû Abondant — © 2026

     </p>

    </footer>

   </div>

  );

 }

 
