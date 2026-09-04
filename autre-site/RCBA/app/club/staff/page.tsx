import { getSession } from "@/lib/authentication";
import { Users, Shield, Star, Briefcase, Hexagon, Activity } from "lucide-react";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import StaffSyncButton from "@/components/StaffSyncButton";
import MagneticWrapper from "@/components/MagneticWrapper";
import { getDb } from "@/lib/db";
import ImageZoom from "@/components/ImageZoom";


interface StaffMember {
  id: number;
  nom: string;
  prenom: string;
  role: string | null;
  role_priority: number;
  equipe_id: number | null;
  photo_url: string | null;
}

async function getStaff(): Promise<StaffMember[]> {
  const db = await getDb();
  return await db.all("SELECT * FROM Staff ORDER BY role_priority, nom;");
}

export default async function StaffPage() {
  const session = await getSession();
  const allStaff = await getStaff();
  const canSync = session?.roleName === 'Direction' || session?.roleName === 'Développeur';

  const categories = [
    { title: "Le Bureau",               priority: 1, icon: Shield,   desc: "Direction exécutive, pilotage administratif et garant des valeurs du RCBA.",                           code: "EXECUTIVE_NODE" },
    { title: "Conseil d'Administration", priority: 2, icon: Briefcase, desc: "Vision stratégique et gouvernance du club.",                                                          code: "STRATEGIC_BOARD" },
    { title: "Encadrement Technique",   priority: 3, icon: Activity,  desc: "Responsables sportifs, éducateurs et spécialistes de la performance athlétique.",                     code: "SPORTIF" },
    { title: "Pôles Opérationnels",     priority: 4, icon: Users,    desc: "Unités de soutien, communication et coordination des activités du club.",                             code: "APPUI" },
    { title: "Membres Honoraires",      priority: 5, icon: Star,     desc: "Ceux qui ont bâti l'histoire du club et continuent de l'accompagner.",                                code: "HERITAGE_LINK" },
  ];

  return (
    <main className="min-h-screen bg-navy-deep text-white selection:bg-gold/30 relative overflow-hidden pb-40">
      {/* ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>


      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 pb-12 border-b border-white/5 relative">
          <HudCorners color="#d4af37" opacity={0.05} />
          <PageLabel
            section="Organisation"
            category="Registre Officiel"
            title="L'Équipe Staff"
            subtitle="Découvrez les femmes et les hommes qui font vivre le RCBA au quotidien. Une structure unifiée au service du jeu."
            icon="staff"
            variant="gold"
          />
          {canSync && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="glass-card p-4 border-gold/20 bg-gold/5 flex flex-col gap-4">
                <div className="text-[9px] font-black uppercase tracking-widest text-gold/60 text-center italic">Admin Control Node</div>
                <StaffSyncButton />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-48">
          {categories.map((cat, idx) => {
            const members = allStaff.filter(s => s.role_priority === cat.priority);
            if (members.length === 0) return null;

            return (
              <section key={idx} className="animate-in fade-in slide-in-from-bottom-12 duration-1000" style={{ animationDelay: `${idx * 200}ms` }}>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 relative">
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <div className="p-4 rounded-3xl bg-gold/10 border border-gold/30 shadow-glass-gold">
                        <cat.icon size={24} className="text-gold" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.6em] text-gold/60 mb-1">{cat.code}</div>
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase text-white athletic-title athletic-skew tracking-tighter leading-[0.85]">
                          {cat.title}
                        </h2>
                      </div>
                    </div>
                    <p className="text-xl text-white/50 italic font-light max-w-2xl border-l-2 border-gold/20 pl-8 ml-4">
                      {cat.desc}
                    </p>
                  </div>
                </div>

                {/* MEMBER CARDS — photos 160px en couleur */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {members.map((member, i) => (
                    <MagneticWrapper key={i}>
                      <div className="glass-card p-10 border-white/5 bg-white/[0.01] hover:bg-gold/[0.03] hover:border-gold/30 transition duration-700 group relative overflow-hidden flex flex-col items-center text-center backdrop-blur-3xl h-full">
                        <HudCorners color="#d4af37" opacity={0.05} />

                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-20 transition duration-700 translate-x-4 group-hover:translate-x-0">
                          <Hexagon size={24} className="text-gold" />
                        </div>

                        {/* PHOTO — 160×160px couleur */}
                        <div className="w-40 h-40 rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center mb-10 group-hover:border-gold/50 group-hover:bg-gold/5 transition duration-700 relative overflow-hidden rotate-3 group-hover:rotate-0 shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          {member.photo_url && member.photo_url.trim() !== "" ? (
                            <ImageZoom
                              src={member.photo_url}
                              alt={`${member.prenom} ${member.nom}`}
                              className="w-full h-full object-cover relative z-10"
                            />
                          ) : (
                            <div className="flex flex-col items-center relative z-10">
                              <span className="text-4xl font-black text-white/30 italic athletic-title athletic-skew group-hover:text-gold group-hover:scale-110 transition duration-700">
                                {member.prenom ? member.prenom[0] : ""}
                                {member.nom ? member.nom[0] : "?"}
                              </span>
                              <div className="w-8 h-1 bg-white/10 mt-2 rounded-full group-hover:bg-gold/40 transition" />
                            </div>
                          )}
                        </div>

                        <div className="space-y-4 w-full">
                          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/80 italic border-y border-white/5 py-2 inline-block px-4">
                            {member.role || "Elite Member"}
                          </div>
                          <h4 className="text-4xl font-black text-white italic athletic-title athletic-skew tracking-tighter uppercase leading-[0.9] group-hover:text-gold transition duration-500">
                            {member.prenom} <br />
                            <span className="text-white/30 group-hover:text-white transition font-light not-italic tracking-normal lowercase first-letter:uppercase">{member.nom}</span>
                          </h4>
                        </div>

                        <div className="mt-auto pt-10 w-full flex items-center justify-between opacity-0 group-hover:opacity-100 transition duration-700 translate-y-4 group-hover:translate-y-0">
                          <div className="flex items-center gap-2 text-[8px] font-black uppercase text-white/30 tracking-[0.3em] italic">
                            <Shield size={10} className="text-gold/50" />
                            Auth: Active
                          </div>
                          <div className="w-8 h-px bg-white/10" />
                          <div className="text-[9px] font-mono text-gold/40">v4.0.0</div>
                        </div>
                      </div>
                    </MagneticWrapper>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* RECRUITMENT CTA */}
        <section className="mt-64 relative group">
          <div className="absolute inset-0 bg-gold/5 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="glass-card p-12 md:p-24 border-white/10 bg-white/[0.01] flex flex-col md:flex-row items-center gap-16 relative overflow-hidden backdrop-blur-2xl rounded-[4rem]">
            <HudCorners color="#d4af37" opacity={0.15} />
            <div className="relative">
              <div className="p-12 rounded-[4rem] bg-gold/5 border border-gold/30 text-gold shadow-glass-gold relative z-10">
                <Briefcase size={64} className="group-hover:rotate-12 transition-transform duration-700" />
              </div>
              <div className="absolute -inset-4 bg-gold/20 blur-3xl opacity-20 -z-10 group-hover:opacity-40 transition-opacity" />
            </div>
            <div className="relative z-10 flex-1 text-center md:text-left space-y-6">
              <div className="text-[10px] font-black uppercase tracking-[0.8em] text-gold/60">Career / Opportunities</div>
              <h3 className="text-5xl md:text-7xl font-black italic uppercase text-white athletic-title athletic-skew tracking-tighter leading-none">
                DÉPLOYEZ VOS <br /> <span className="text-gold">COMPÉTENCES</span>
              </h3>
              <p className="text-xl md:text-2xl text-white/60 italic leading-relaxed max-w-2xl font-light">
                Le RCBA est une architecture en constante expansion. Nous recherchons des experts de terrain pour renforcer nos unités techniques et administratives.
              </p>
              <div className="pt-6">
                <button className="shadow-gold px-12 py-5 rounded-2xl bg-gold/10 border border-gold/30 text-gold font-black text-sm uppercase tracking-[0.5em] hover:bg-gold hover:text-navy-deep transition">
                  Postuler au Système
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-40 border-t border-white/5 pt-20 pb-12 opacity-30">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-8 text-[9px] font-black uppercase tracking-[0.5em] text-white/40 italic">
            <span>RCBA Registry v4.0</span>
            <div className="w-px h-6 bg-white/10" />
            <span className="text-gold/40">Portail Sécurisé</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
