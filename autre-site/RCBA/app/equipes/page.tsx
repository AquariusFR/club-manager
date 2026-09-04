import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import {
  Users2,
  ShieldCheck,
  Activity,
  Trophy,
  Shield,
  ChevronRight,
  Star,
  Zap,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import PageLabel from "@/components/PageLabel";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Effectifs 2025-2026 | RCBA — Racing Club Bû Abondant",
  description:
    "Découvrez les équipes et effectifs officiels du Racing Club Bû Abondant pour la saison 2025-2026. De l'École de Football aux Séniors.",
};

const categories = [
  {
    id: "seniors",
    db_match: "Seniors & Vétérans",
    name: "Séniors & Vétérans",
    icon: ShieldCheck,
    accent: "#62CB72",
    color: "text-pitch-green",
    border: "border-pitch-green/20",
    glow: "pitch-green",
  },
  {
    id: "jeunes",
    db_match: "Jeunes (U12-U18)",
    name: "Jeunes (U12-U18)",
    icon: Activity,
    accent: "#60A5FA",
    color: "text-blue-400",
    border: "border-blue-400/20",
    glow: "blue-400",
  },
  {
    id: "feminines",
    db_match: "Féminines",
    name: "Pôle Féminin",
    icon: Users2,
    accent: "#F472B6",
    color: "text-pink-400",
    border: "border-pink-400/20",
    glow: "pink-400",
  },
  {
    id: "ecole",
    db_match: "École de Foot",
    name: "École de Football",
    icon: Star,
    accent: "#D4AF37",
    color: "text-gold",
    border: "border-gold/20",
    glow: "gold",
  },
];

export default async function PublicTeamsPage() {
  const session = await getSession();
  const db = await getDb();

  const teams = await db.all("SELECT * FROM Equipes ORDER BY id ASC");
  const allStaff = await db.all("SELECT * FROM Staff ORDER BY role_priority ASC, nom ASC");
  const playerCounts = await db.all("SELECT equipe_id, COUNT(*) as count FROM Joueurs GROUP BY equipe_id");

  const staffByTeam: Record<number, any[]> = {};
  allStaff.forEach((s: any) => {
    if (!staffByTeam[s.equipe_id]) staffByTeam[s.equipe_id] = [];
    staffByTeam[s.equipe_id].push(s);
  });

  const playerMap: Record<number, number> = {};
  playerCounts.forEach((p: any) => { playerMap[p.equipe_id] = p.count; });

  const totalPlayers = playerCounts.reduce((s: number, p: any) => s + p.count, 0);
  const totalTeams = teams.length;
  const totalStaff = allStaff.length;

  return (
    <main className="min-h-screen bg-navy-deep relative selection:bg-gold/20">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none -z-50">
        <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[60%] bg-gold/4 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[50%] bg-pitch-green/5 rounded-full blur-[150px]" />
      </div>


      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-7xl relative z-10">

        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/"
            className="group flex items-center gap-2 px-3 py-2 rounded-xl glass-card border border-white/8 hover:border-white/20 transition text-white/60 hover:text-white"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Accueil</span>
          </Link>
        </div>

        <PageLabel
          section="EFFECTIFS"
          category="UNITÉ TECHNIQUE"
          title="EFFECTIFS 2025 - 2026"
          subtitle="Toutes les équipes du Racing Club Bû Abondant. Cliquez sur une équipe pour découvrir son effectif complet, son staff et ses statistiques."
          icon="equipes"
          showLogo={true}
        />

        {/* Global Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { val: totalTeams,   label: "Équipes", icon: Trophy,   color: "text-gold",        border: "border-gold/20" },
            { val: totalPlayers, label: "Joueurs", icon: Users2,   color: "text-pitch-green", border: "border-pitch-green/20" },
            { val: totalStaff,   label: "Staff",   icon: Shield,   color: "text-blue-400",    border: "border-blue-400/20" },
          ].map((s, i) => (
            <div
              key={i}
              className={`reveal-card glass-card p-5 md:p-6 border ${s.border} flex flex-col items-center text-center group`}
            >
              <s.icon size={18} className={`${s.color} mb-2 opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className={`text-2xl md:text-3xl tabular-nums font-black italic athletic-title ${s.color}`}>{s.val}</div>
              <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* â•â• CATEGORIES â•â• */}
        <div className="space-y-20">
          {categories.map((cat) => {
            const catTeams = teams.filter((t: any) => t.categorie === cat.db_match);
            if (catTeams.length === 0) return null;

            return (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                {/* Category Header */}
                <div className="flex items-center gap-5 mb-8">
                  <div
                    className="p-3.5 rounded-2xl border shadow-xl"
                    style={{
                      background: `${cat.accent}10`,
                      borderColor: `${cat.accent}30`,
                      boxShadow: `0 0 30px ${cat.accent}15`,
                    }}
                  >
                    <cat.icon size={24} style={{ color: cat.accent }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="athletic-title text-2xl md:text-3xl italic uppercase">{cat.name}</h2>
                    <div className="text-[8px] font-black uppercase tracking-[0.5em] text-white/40 mt-1">
                      {catTeams.length} équipe{catTeams.length > 1 ? "s" : ""} · Saison 2025-2026
                    </div>
                  </div>
                  <div className="hidden md:block h-px flex-1 max-w-48 bg-white/5" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {catTeams.map((team: any) => {
                    const pCount = playerMap[team.id] || 0;
                    const teamStaff = staffByTeam[team.id] || [];

                    return (
                      <Link
                        key={team.id}
                        href={`/equipes/${team.id}`}
                        className="group relative glass-card border border-white/5 p-6 overflow-hidden transition duration-300 hover:border-white/15 hover:-translate-y-1 hover:shadow-2xl active:scale-95 active:shadow-none flex flex-col"
                        style={{
                          ["--hover-glow" as any]: cat.accent,
                        }}
                      >
                        {/* Hover glow effect */}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          style={{
                            background: `radial-gradient(ellipse at top right, ${cat.accent}08, transparent 70%)`,
                          }}
                        />

                        {/* Top: Division badge + arrow */}
                        <div className="flex items-start justify-between mb-5 relative z-10">
                          <div
                            className="px-2.5 py-1 rounded-lg text-[7px] font-black uppercase tracking-widest border"
                            style={{
                              color: cat.accent,
                              borderColor: `${cat.accent}30`,
                              background: `${cat.accent}10`,
                            }}
                          >
                            {team.division || cat.name}
                          </div>
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center border opacity-0 group-hover:opacity-100 transition duration-300 group-hover:translate-x-0 translate-x-2"
                            style={{
                              borderColor: `${cat.accent}40`,
                              background: `${cat.accent}10`,
                            }}
                          >
                            <ChevronRight size={13} style={{ color: cat.accent }} />
                          </div>
                        </div>

                        {/* Team shield icon */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center border mb-4 transition duration-300 group-hover:shadow-lg relative z-10"
                          style={{
                            borderColor: `${cat.accent}25`,
                            background: `${cat.accent}08`,
                            boxShadow: `0 0 0 0 ${cat.accent}00`,
                          }}
                        >
                          <Shield size={22} style={{ color: cat.accent, opacity: 0.8 }} />
                        </div>

                        {/* Team name */}
                        <h3 className="athletic-title text-xl italic uppercase mb-1 leading-tight relative z-10">
                          {team.nom.split(" ").slice(0, -1).join(" ")}{" "}
                          <span style={{ color: cat.accent }}>{team.nom.split(" ").slice(-1)}</span>
                        </h3>

                        {/* Staff section */}
                        {teamStaff.length > 0 && (
                          <div className="mt-4 flex flex-col gap-2.5 relative z-10">
                            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Encadrement</div>
                            {teamStaff.slice(0, 2).map((s: any) => (
                              <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
                                {s.photo_url ? (
                                  <img 
                                    src={s.photo_url} 
                                    alt={s.nom} 
                                    className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0 shadow-md"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/60 shrink-0">
                                    {s.prenom?.[0]}{s.nom?.[0]}
                                  </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[11px] font-bold text-white/90 truncate">{s.prenom} {s.nom}</span>
                                  <span className="text-[8px] font-black uppercase text-white/50 truncate tracking-wider" style={{ color: s.role_priority === 1 ? cat.accent : undefined }}>{s.role}</span>
                                </div>
                              </div>
                            ))}
                            {teamStaff.length > 2 && (
                              <div className="text-[9px] font-bold text-white/40 pl-2">
                                + {teamStaff.length - 2} membre{teamStaff.length > 3 ? "s" : ""}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Spacer */}
                        <div className="flex-1 min-h-[1rem]" />

                        {/* Bottom stats */}
                        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5 relative z-10">
                          <div className="flex items-center gap-1.5 text-white/40">
                            <Users2 size={10} />
                            <span className="text-[8px] tabular-nums font-black uppercase tracking-wider">
                              {pCount} joueur{pCount > 1 ? "s" : ""}
                            </span>
                          </div>
                          {teamStaff.length > 0 && (
                            <div className="flex items-center gap-1.5 text-white/30">
                              <Shield size={10} />
                              <span className="text-[8px] tabular-nums font-black uppercase tracking-wider">
                                {teamStaff.length} staff
                              </span>
                            </div>
                          )}
                          <div
                            className="ml-auto text-[7px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: cat.accent }}
                          >
                            Voir →
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {/* â”€â”€ AUTO-CATCH: Catégories inconnues â”€â”€ */}
          {(() => {
            const known = categories.map((c) => c.db_match);
            const unmapped = teams.filter((t: any) => !known.includes(t.categorie));
            if (unmapped.length === 0) return null;

            return (
              <section id="autres" className="scroll-mt-24">
                <div className="flex items-center gap-5 mb-8">
                  <div className="p-3.5 rounded-2xl border border-white/10 bg-white/5">
                    <Shield size={24} className="text-white/30" />
                  </div>
                  <div>
                    <h2 className="athletic-title text-2xl italic uppercase">Autres Sections</h2>
                    <div className="text-[8px] font-black uppercase tracking-[0.5em] text-white/40 mt-1">
                      {unmapped.length} équipe{unmapped.length > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {unmapped.map((team: any) => {
                    const pCount = playerMap[team.id] || 0;
                    const teamStaff = staffByTeam[team.id] || [];

                    return (
                      <Link
                        key={team.id}
                        href={`/equipes/${team.id}`}
                        className="group glass-card border border-white/5 p-6 hover:border-white/15 hover:-translate-y-1 transition duration-300 flex flex-col"
                      >
                        <div className="text-[7px] font-black uppercase tracking-widest text-white/30 mb-4 border border-white/10 px-2.5 py-1 rounded-lg w-fit">
                          {team.categorie}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                          <Shield size={22} className="text-white/30" />
                        </div>
                        <h3 className="athletic-title text-xl italic uppercase mb-1">{team.nom}</h3>
                        
                        {/* Staff section */}
                        {teamStaff.length > 0 && (
                          <div className="mt-4 flex flex-col gap-2.5">
                            <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Encadrement</div>
                            {teamStaff.slice(0, 2).map((s: any) => (
                              <div key={s.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.03] border border-white/5">
                                {s.photo_url ? (
                                  <img 
                                    src={s.photo_url} 
                                    alt={s.nom} 
                                    className="w-9 h-9 rounded-full object-cover border border-white/10 shrink-0"
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-white/60 shrink-0">
                                    {s.prenom?.[0]}{s.nom?.[0]}
                                  </div>
                                )}
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[11px] font-bold text-white/90 truncate">{s.prenom} {s.nom}</span>
                                  <span className="text-[8px] font-black uppercase text-white/50 truncate tracking-wider">{s.role}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex-1 min-h-[1rem]" />
                        
                        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5 text-white/30">
                          <Users2 size={10} />
                          <span className="text-[8px] tabular-nums font-black">{pCount} joueur{pCount > 1 ? "s" : ""}</span>
                          {teamStaff.length > 0 && (
                            <>
                              <Shield size={10} className="ml-2" />
                              <span className="text-[8px] tabular-nums font-black">{teamStaff.length} staff</span>
                            </>
                          )}
                          <span className="ml-auto text-[7px] font-black uppercase opacity-0 group-hover:opacity-60 transition-opacity">
                            Voir →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })()}
        </div>
      </div>
    </main>
  );
}
