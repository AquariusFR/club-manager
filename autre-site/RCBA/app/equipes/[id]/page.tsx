import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import { getPlayerSelectionMerit } from "@/lib/actions";
import ImageZoom from "@/components/ImageZoom";
import {
  Users2,
  ChevronLeft,
  MapPin,
  Trophy,
  Shield,
  Activity,
  Target,
  Phone,
  Star,
  Zap,
  TrendingUp,
  Crosshair,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import FormationVisualizer from "@/components/FormationVisualizer";
import PlayerPosterCard from "@/components/PlayerPosterCard";
import LeaderCard from "@/components/LeaderCard";
import PageLabel from "@/components/PageLabel";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Poste = "gk" | "def" | "mid" | "att" | "unknown";

function getPosteClass(poste: string): Poste {
  const p = (poste || "").toLowerCase();
  if (p.startsWith("g") || p.includes("garden") || p.includes("gardien")) return "gk";
  if (p.startsWith("d") || p.includes("défens") || p.includes("defens")) return "def";
  if (p.startsWith("m") || p.includes("milieu") || p.includes("mili")) return "mid";
  if (p.startsWith("a") || p.includes("attaq") || p.includes("avant")) return "att";
  return "unknown";
}

const posteConfig: Record<Poste, { label: string; shortLabel: string; color: string; bg: string; border: string; textColor: string }> = {
  gk:      { label: "Gardien",   shortLabel: "G", color: "text-gold",        bg: "bg-gold/10",        border: "border-gold/35",        textColor: "#D4AF37" },
  def:     { label: "Défenseur", shortLabel: "D", color: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/35",    textColor: "#60A5FA" },
  mid:     { label: "Milieu",    shortLabel: "M", color: "text-pitch-green", bg: "bg-pitch-green/10", border: "border-pitch-green/35", textColor: "#62CB72" },
  att:     { label: "Attaquant", shortLabel: "A", color: "text-rose-400",    bg: "bg-rose-400/10",    border: "border-rose-400/35",    textColor: "#F87171" },
  unknown: { label: "Joueur",    shortLabel: "?", color: "text-white/60",    bg: "bg-white/5",        border: "border-white/10",       textColor: "rgba(255,255,255,0.4)" },
};

const categoryStyles: Record<string, { accent: string; color: string; gradientFrom: string }> = {
  "Seniors & Vétérans": { accent: "#62CB72", color: "text-pitch-green", gradientFrom: "from-pitch-green/5" },
  "Jeunes (U12-U18)":   { accent: "#60A5FA", color: "text-blue-400",    gradientFrom: "from-blue-400/5" },
  "Féminines":          { accent: "#F472B6", color: "text-pink-400",     gradientFrom: "from-pink-400/5" },
  "École de Foot":      { accent: "#D4AF37", color: "text-gold",         gradientFrom: "from-gold/5" },
};

function getCategoryStyle(categorie: string) {
  return (
    categoryStyles[categorie] ||
    { accent: "#ffffff", color: "text-white/60", gradientFrom: "from-white/5" }
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const teamId = parseInt(id, 10);
  const db = await getDb();
  const team = await db.get("SELECT * FROM Equipes WHERE id = ?", [teamId]);
  if (!team) return { title: "Équipe introuvable | RCBA" };
  return {
    title: `${team.nom} | RCBA — Racing Club Bû Abondant`,
    description: `Découvrez l'effectif, le staff et les performances de l'équipe ${team.nom} du Racing Club Bû Abondant pour la saison 2025-2026.`,
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const db = await getDb();

  const teamId = parseInt(id, 10);
  if (isNaN(teamId)) notFound();
  
  const team = await db.get("SELECT * FROM Equipes WHERE id = ?", [teamId]);
  if (!team) notFound();

  // Execute queries sequentially to prevent SQLite locking (SQLITE_BUSY)
  const siblingTeams = await db.all(
    "SELECT id, nom FROM Equipes WHERE categorie = ? AND id != ? ORDER BY id ASC",
    [team.categorie, team.id]
  );
  const staffMembers = await db.all(
    "SELECT * FROM Staff WHERE equipe_id = ? ORDER BY role_priority ASC, nom ASC",
    [team.id]
  );
  const teamCatMatch = team.nom.match(/(U\\d+|S[eé]nior|V[eé]t[eé]ran|F[eé]minine)/i);
  const teamCatPrefix = teamCatMatch ? teamCatMatch[0].toUpperCase() : team.nom.toUpperCase();

  const rawPlayers = await db.all(
    `SELECT *,
      CASE 
        WHEN lower(poste) LIKE 'g%' THEN 1
        WHEN lower(poste) LIKE 'd%' THEN 2
        WHEN lower(poste) LIKE 'm%' THEN 3
        WHEN lower(poste) LIKE 'a%' THEN 4
        ELSE 5 
      END as poste_priority
    FROM Joueurs 
    WHERE equipe_id = ? OR UPPER(categorie_actuelle) LIKE ?
    ORDER BY poste_priority ASC, nom ASC`,
    [team.id, `${teamCatPrefix}%`]
  );
  const recentResults = await db.all(
    `SELECT *
     FROM Resultats
     WHERE equipe_id = ?
     ORDER BY date DESC
     LIMIT 5`,
    [team.id]
  );
  const classement = await db.all(
    `SELECT *
     FROM Classement
     WHERE equipe_id = ?
     ORDER BY position ASC`,
    [team.id]
  );
  const calendrier = await db.all(
    `SELECT *
     FROM CalendrierMatchs
     WHERE equipe_id = ?
     ORDER BY date ASC`,
    [team.id]
  );

  // Calculer les statistiques globales depuis le calendrier
  const stats = {
    joues: 0,
    victoires: 0,
    nuls: 0,
    defaites: 0,
    butsPour: 0,
    butsContre: 0,
    cleanSheets: 0,
    forme: [] as string[],
  };

  calendrier.forEach((match: any) => {
    if (match.statut === 'TERMINE') {
      stats.joues++;
      const isHome = match.domicile.includes("Bû") || match.domicile.includes("RC");
      const scorePour = isHome ? match.score_domicile : match.score_exterieur;
      const scoreContre = isHome ? match.score_exterieur : match.score_domicile;
      
      stats.butsPour += scorePour;
      stats.butsContre += scoreContre;
      
      let res = 'D';
      if (scorePour > scoreContre) { stats.victoires++; res = 'V'; }
      else if (scorePour === scoreContre) { stats.nuls++; res = 'N'; }
      else stats.defaites++;

      if (scoreContre === 0) stats.cleanSheets++;
      stats.forme.push(res);
    }
  });

  // Keep only the last 5 matches for form
  stats.forme = stats.forme.slice(-5);
  const avgAttaque = stats.joues > 0 ? (stats.butsPour / stats.joues).toFixed(1) : "0";
  const avgDefense = stats.joues > 0 ? (stats.butsContre / stats.joues).toFixed(1) : "0";

  const prenomCounts: Record<string, number> = {};
  const playersWithMerit = [];
  for (const p of rawPlayers) {
    const merit = await getPlayerSelectionMerit(p);
    playersWithMerit.push({ ...p, merit });
    if (p.prenom) {
      const lower = p.prenom.trim().toLowerCase();
      prenomCounts[lower] = (prenomCounts[lower] || 0) + 1;
    }
  }

  // Pre-calculate display names
  for (const p of playersWithMerit) {
    if (p.prenom) {
      const lower = p.prenom.trim().toLowerCase();
      if (prenomCounts[lower] > 1 && p.nom) {
        p.displayName = `${p.prenom} ${p.nom[0]}.`;
      } else {
        p.displayName = p.prenom;
      }
    } else {
      p.displayName = p.nom || "Inconnu";
    }
  }

  const gks    = playersWithMerit.filter((p: any) => getPosteClass(p.poste) === "gk");
  const defs   = playersWithMerit.filter((p: any) => getPosteClass(p.poste) === "def");
  const mids   = playersWithMerit.filter((p: any) => getPosteClass(p.poste) === "mid");
  const atts   = playersWithMerit.filter((p: any) => getPosteClass(p.poste) === "att");
  const others = playersWithMerit.filter((p: any) => getPosteClass(p.poste) === "unknown");

  const catStyle = getCategoryStyle(team.categorie);
  const totalPlayers = playersWithMerit.length;

  // Average merit
  const avgMerit =
    totalPlayers > 0
      ? Math.round(
          playersWithMerit.reduce((s: number, p: any) => s + (p.merit?.score || 0), 0) /
            totalPlayers
        )
      : 0;

  return (
    <main className="min-h-screen bg-navy-deep relative overflow-hidden selection:bg-gold/20">
      {/* Atmospheric background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[-20%] right-[-15%] w-[60%] h-[70%] rounded-full blur-[200px] opacity-30"
          style={{ background: catStyle.accent }}
        />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[50%] bg-pitch-green/5 rounded-full blur-[150px]" />
      </div>



      <div className="container mx-auto px-4 md:px-6 py-10 md:py-16 max-w-7xl relative z-10">
        <PageLabel 
          section="ÉQUIPES" 
          category="EFFECTIF & STAFF" 
          title={team.nom}
          subtitle={`Catégorie ${team.categorie}`}
          icon="club"
          variant="blue"
          showLogo={true}
        />

        {/* ── BREADCRUMB ── */}
        <div className="flex items-center gap-3 mb-10 flex-wrap">
          <Link
            href="/"
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/20 hover:border-gold hover:bg-gold/10 transition text-white/80 hover:text-white shadow-lg"
          >
            <ArrowLeft size={14} className="text-gold group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-black uppercase tracking-widest">Accueil du Club</span>
          </Link>
          <div className="text-white/20">/</div>
          <Link
            href="/equipes"
            className="group flex items-center gap-2 px-4 py-2 rounded-xl glass-card border border-white/8 hover:border-white/20 transition text-white/60 hover:text-white"
          >
            <span className="text-sm font-black uppercase tracking-widest">Toutes les équipes</span>
          </Link>
          {siblingTeams.length > 0 && (
            <>
              <div className="h-px w-6 bg-white/10" />
              <div className="flex gap-2 flex-wrap">
                {siblingTeams.map((t: any) => (
                  <Link
                    key={t.id}
                    href={`/equipes/${t.id}`}
                    className="px-3 py-1.5 rounded-lg glass-card border border-white/5 hover:border-white/15 text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-white/80 transition"
                  >
                    {t.nom}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ── TEAM HERO ── */}
        <div className="relative glass-card border border-white/5 p-8 md:p-12 mb-12 overflow-hidden">
          {/* Large faded team name background */}
          <div
            className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none overflow-hidden"
          >
            <div
              className="text-[12rem] font-black italic uppercase leading-none opacity-[0.03] select-none"
              style={{ color: catStyle.accent }}
            >
              {team.nom.split(" ").pop()}
            </div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Icon */}
            <div
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center border-2 shrink-0 shadow-2xl"
              style={{
                borderColor: `${catStyle.accent}40`,
                background: `${catStyle.accent}10`,
                boxShadow: `0 0 40px ${catStyle.accent}20`,
              }}
            >
              <Shield size={40} style={{ color: catStyle.accent }} />
            </div>

            <div className="flex-1">
              {/* Category badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[8px] font-black uppercase tracking-widest mb-4"
                style={{
                  borderColor: `${catStyle.accent}30`,
                  background: `${catStyle.accent}10`,
                  color: catStyle.accent,
                }}
              >
                <Activity size={10} />
                {team.categorie}
              </div>

              <h1 className="athletic-title text-4xl md:text-6xl italic uppercase mb-3">
                {team.nom.split(" ").slice(0, -1).join(" ")}{" "}
                <span style={{ color: catStyle.accent }}>
                  {team.nom.split(" ").slice(-1)}
                </span>
              </h1>

              {team.division && (
                <div
                  className="text-[10px] font-black uppercase tracking-[0.4em]"
                  style={{ color: catStyle.accent, opacity: 0.7 }}
                >
                  {team.division}
                </div>
              )}

              {/* Quick meta */}
              <div className="flex flex-wrap gap-4 mt-5">
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin size={12} className="text-white/30" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Bû & Abondant</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Users2 size={12} className="text-white/30" />
                  <span className="text-[9px] tabular-nums font-bold uppercase tracking-widest">
                    {totalPlayers} joueur{totalPlayers > 1 ? "s" : ""}
                  </span>
                </div>
                {staffMembers.length > 0 && (
                  <div className="flex items-center gap-2 text-white/60">
                    <Star size={12} className="text-white/30" />
                    <span className="text-[9px] tabular-nums font-bold uppercase tracking-widest">
                      {staffMembers.length} membre{staffMembers.length > 1 ? "s" : ""} staff
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Zap size={12} style={{ color: catStyle.accent, opacity: 0.7 }} />
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: catStyle.accent }}
                  >
                    Saison 2025-2026
                  </span>
                </div>
              </div>
            </div>

            {/* Stats bloc */}
            <div className="grid grid-cols-3 md:grid-cols-1 gap-3 shrink-0 md:min-w-[140px]">
              {[
                { label: "Joueurs",  val: totalPlayers, icon: Users2  },
                { label: "Staff",    val: staffMembers.length, icon: Shield   },
                { label: "Niveau",   val: `${avgMerit}%`, icon: TrendingUp },
              ].map((s, i) => (
                <div
                  key={i}
                  className="glass-card border border-white/5 p-4 text-center hover:border-white/10 transition"
                >
                  <s.icon size={14} className="mx-auto mb-1.5 text-white/30" />
                  <div
                    className="text-xl md:text-2xl tabular-nums font-black italic athletic-title"
                    style={{ color: catStyle.accent }}
                  >
                    {s.val}
                  </div>
                  <div className="text-[7px] font-black uppercase tracking-[0.3em] text-white/40 mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MAIN CONTENT GRID ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-8">

          {/* ── LEFT SIDEBAR ── */}
          <div className="space-y-6">

            {/* Formation Visualizer */}
            {totalPlayers > 0 ? (
              <div className="glass-card border border-white/5 p-6">
                <FormationVisualizer
                  players={playersWithMerit}
                  teamName={team.nom}
                  formation="4-3-3"
                />
              </div>
            ) : (
              <div className="glass-card border border-white/5 p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white/50 bg-white/5 border border-white/10">
                    <Target size={16} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Formation</div>
                </div>
                <div className="p-8 text-center text-white/30 text-[9px] font-black uppercase tracking-widest border border-white/5 border-dashed rounded-xl">
                  En attente de l'effectif (aucun joueur pour le moment)
                </div>
              </div>
            )}

            {/* Staff */}
            <div className="glass-card border border-white/5 p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Shield size={14} style={{ color: catStyle.accent }} />
                <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/60">Encadrement</div>
              </div>
              {staffMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {staffMembers.map((s: any) => (
                    <div key={s.id} className="w-full max-w-[220px] mx-auto">
                      <LeaderCard member={s} roleLabel={s.role} size="sm" isShiny={false} theme="blue" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-white/30 text-[9px] font-black uppercase tracking-widest border border-white/5 border-dashed rounded-xl">
                  Staff en cours de nomination
                </div>
              )}
            </div>

            {/* Performances Globales & Avancées */}
            <div className="glass-card border border-white/5 p-6 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={14} style={{ color: catStyle.accent }} />
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Analyse & Performances</div>
              </div>
              
              {stats.joues > 0 ? (
                <>
                  {/* Win rate bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold tabular-nums">
                      <span className="text-pitch-green">V: {stats.victoires}</span>
                      <span className="text-gold">N: {stats.nuls}</span>
                      <span className="text-rose-400">D: {stats.defaites}</span>
                    </div>
                    <div className="flex h-2 w-full rounded-full overflow-hidden bg-white/5">
                      <div style={{ width: `${(stats.victoires / stats.joues) * 100}%` }} className="bg-pitch-green h-full transition duration-1000" />
                      <div style={{ width: `${(stats.nuls / stats.joues) * 100}%` }} className="bg-gold h-full transition duration-1000" />
                      <div style={{ width: `${(stats.defaites / stats.joues) * 100}%` }} className="bg-rose-400 h-full transition duration-1000" />
                    </div>
                    <div className="text-center tabular-nums text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">
                      {Math.round((stats.victoires / stats.joues) * 100)}% de victoires
                    </div>
                  </div>

                  {/* Forme Récente */}
                  {stats.forme.length > 0 && (
                    <div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40 mb-2">Forme Récente</div>
                      <div className="flex items-center gap-2">
                        {stats.forme.map((res, i) => (
                          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${res === 'V' ? 'bg-pitch-green text-navy-deep' : res === 'N' ? 'bg-gold text-navy-deep' : 'bg-rose-500 text-white'}`}>
                            {res}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center hover:bg-white/[0.04] transition">
                      <div className="text-xl tabular-nums font-black text-white">{avgAttaque} <span className="text-[10px] text-white/40 font-normal">/m</span></div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40 mt-1">Moy. Attaque</div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center hover:bg-white/[0.04] transition">
                      <div className="text-xl tabular-nums font-black text-white">{avgDefense} <span className="text-[10px] text-white/40 font-normal">/m</span></div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40 mt-1">Moy. Défense</div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center hover:bg-white/[0.04] transition">
                      <div className="text-xl tabular-nums font-black" style={{ color: stats.butsPour - stats.butsContre > 0 ? '#62CB72' : stats.butsPour - stats.butsContre < 0 ? '#F87171' : 'white' }}>
                        {stats.butsPour - stats.butsContre > 0 ? `+${stats.butsPour - stats.butsContre}` : stats.butsPour - stats.butsContre}
                      </div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40 mt-1">Différence</div>
                    </div>
                    <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl text-center hover:bg-white/[0.04] transition">
                      <div className="text-xl tabular-nums font-black text-blue-400">{stats.cleanSheets}</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/40 mt-1">Clean Sheets</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-white/30 text-[9px] font-black uppercase tracking-widest border border-white/5 border-dashed rounded-xl">
                  Aucun match joué cette saison
                </div>
              )}
            </div>


            {/* Position breakdown */}
            {totalPlayers > 0 && (
              <div className="glass-card border border-white/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Crosshair size={14} style={{ color: catStyle.accent }} />
                  <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/60">Répartition</div>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label: "Gardiens",   count: gks.length,    color: "#D4AF37" },
                    { label: "Défenseurs", count: defs.length,   color: "#60A5FA" },
                    { label: "Milieux",    count: mids.length,   color: "#62CB72" },
                    { label: "Attaquants", count: atts.length,   color: "#F87171" },
                    ...(others.length > 0 ? [{ label: "Autres", count: others.length, color: "rgba(255,255,255,0.3)" }] : []),
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="text-[8px] font-black uppercase text-white/50 w-20 shrink-0">{item.label}</div>
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition duration-700"
                          style={{
                            width: `${(item.count / totalPlayers) * 100}%`,
                            background: item.color,
                          }}
                        />
                      </div>
                      <div
                        className="text-[9px] tabular-nums font-black w-5 text-right shrink-0"
                        style={{ color: item.color }}
                      >
                        {item.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: PLAYER GRID ── */}
          <div>
            {totalPlayers > 0 ? (
              <div className="space-y-8">
                {[
                  { players: gks,    poste: "gk"      as Poste },
                  { players: defs,   poste: "def"     as Poste },
                  { players: mids,   poste: "mid"     as Poste },
                  { players: atts,   poste: "att"     as Poste },
                  { players: others, poste: "unknown" as Poste },
                ]
                  .filter((g) => g.players.length > 0)
                  .map(({ players: group, poste }) => {
                    const cfg = posteConfig[poste];
                    return (
                      <div key={poste}>
                        {/* Position header */}
                        <div className="flex items-center gap-4 mb-4">
                          <div
                            className={`px-4 py-1.5 rounded-xl ${cfg.bg} border ${cfg.border} text-[8px] font-black uppercase tracking-[0.4em] ${cfg.color}`}
                          >
                            {cfg.label}s — {group.length}
                          </div>
                          <div className="h-px flex-1 bg-white/5" />
                        </div>

                        {/* Player cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 pt-4 pb-8 px-2">
                          {group.map((p: any, i: number) => (
                            <PlayerPosterCard
                              key={p.id}
                              player={p}
                              index={i}
                              displayName={p.displayName}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="glass-card border border-white/5 p-20 flex flex-col items-center justify-center text-center">
                <Users2 size={56} className="text-white/5 mb-5" />
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                  Effectif en cours de saisie
                </p>
                <p className="text-[9px] text-white/20 mt-2">
                  Les joueurs seront affichés ici prochainement.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            📊 CLASSEMENT — Full-width, large & readable
        ══════════════════════════════════════════════════════ */}
        {classement.length > 0 ? (
          <section className="mt-16">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-3 rounded-2xl border" style={{ background: `${catStyle.accent}15`, borderColor: `${catStyle.accent}30` }}>
                <Trophy size={24} style={{ color: catStyle.accent }} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40 mb-1">Compétition</div>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase text-white tracking-tighter">Classement <span style={{ color: catStyle.accent }}>&amp; Résultats</span></h2>
              </div>
            </div>
            
            <div className="glass-card border border-white/5 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40 w-16 text-center">Pos</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40">Équipe</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Pts</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">J</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-center hidden md:table-cell">G</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-center hidden md:table-cell">N</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-center hidden md:table-cell">P</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Diff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {classement.map((c: any, index: number) => {
                    const isRCBA = c.equipe?.includes("RCBA") || c.equipe?.includes("Bû") || c.equipe?.includes("BO");
                    return (
                      <tr 
                        key={c.id} 
                        className={`transition-colors ${isRCBA ? "bg-white/10" : "hover:bg-white/[0.02]"}`}
                      >
                        <td className="px-8 py-6 text-center">
                          <span className={`text-xl md:text-2xl font-black italic ${isRCBA ? 'text-white' : 'text-white/30'}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-bold text-lg md:text-xl athletic-title tracking-wider">
                          <span className={isRCBA ? "text-white" : "text-white/70"}>
                            {c.equipe}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`tabular-nums text-2xl md:text-3xl font-black ${
                            isRCBA ? "" : "text-white/90"
                          }`} style={{ color: isRCBA ? catStyle.accent : undefined }}>
                            {c.points}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center tabular-nums text-lg md:text-xl font-bold">{c.joues}</td>
                        <td className="px-8 py-6 text-center tabular-nums text-lg md:text-xl font-bold hidden md:table-cell text-pitch-green/80">{c.gagnes}</td>
                        <td className="px-8 py-6 text-center tabular-nums text-lg md:text-xl font-bold hidden md:table-cell text-gold/80">{c.nuls}</td>
                        <td className="px-8 py-6 text-center tabular-nums text-lg md:text-xl font-bold hidden md:table-cell text-rose-400/80">{c.perdus}</td>
                        <td className="px-8 py-6 text-center">
                          <span className={`font-black tabular-nums text-xl md:text-2xl ${
                            c.diff > 0 ? "text-pitch-green" : c.diff < 0 ? "text-rose-400" : "text-white/40"
                          }`}>
                            {c.diff > 0 ? `+${c.diff}` : c.diff}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="mt-16">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-3 rounded-2xl border" style={{ background: `${catStyle.accent}15`, borderColor: `${catStyle.accent}30` }}>
                <Trophy size={24} style={{ color: catStyle.accent }} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40 mb-1">Compétition</div>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase text-white tracking-tighter">Classement <span style={{ color: catStyle.accent }}>&amp; Résultats</span></h2>
              </div>
            </div>
            <div className="glass-card border border-white/5 p-12 md:p-20 flex flex-col items-center justify-center text-center">
              <Trophy size={56} className="text-white/5 mb-5" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                Saison non commencée
              </p>
              <p className="text-[9px] text-white/20 mt-2 max-w-md">
                Le classement n'est pas encore disponible pour cette équipe. Les résultats apparaîtront ici dès le début du championnat.
              </p>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════
            📅 CALENDRIER — Full-width, large & readable
        ══════════════════════════════════════════════════════ */}
        {calendrier.length > 0 ? (
          <section className="mt-16">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-3 rounded-2xl border" style={{ background: `${catStyle.accent}15`, borderColor: `${catStyle.accent}30` }}>
                <Activity size={24} style={{ color: catStyle.accent }} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40 mb-1">Championnat & Coupes</div>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase text-white tracking-tighter">Calendrier <span style={{ color: catStyle.accent }}>&amp; Résultats</span></h2>
              </div>
            </div>
            <div className="space-y-3">
              {calendrier.map((match: any) => {
                const isHome = match.domicile.includes("Bû") || match.domicile.includes("RC");
                const isWin = match.statut === 'TERMINE' && (
                  (isHome && match.score_domicile > match.score_exterieur) ||
                  (!isHome && match.score_exterieur > match.score_domicile)
                );
                const isDraw = match.statut === 'TERMINE' && match.score_domicile === match.score_exterieur;
                const isLoss = match.statut === 'TERMINE' && !isWin && !isDraw;
                const isUpcoming = match.statut !== 'TERMINE';

                let borderColor = "border-white/10";
                let resultLabel = "";
                let resultColor = "text-white/50 bg-white/5";
                if (isWin)   { borderColor = "border-pitch-green/25"; resultLabel = "V"; resultColor = "text-pitch-green bg-pitch-green/10"; }
                if (isDraw)  { borderColor = "border-gold/25"; resultLabel = "N"; resultColor = "text-gold bg-gold/10"; }
                if (isLoss)  { borderColor = "border-rose-400/25"; resultLabel = "D"; resultColor = "text-rose-400 bg-rose-400/10"; }
                if (isUpcoming) { borderColor = "border-blue-400/20"; resultLabel = "→"; resultColor = "text-blue-400 bg-blue-400/10"; }

                return (
                  <div
                    key={match.id}
                    className={`glass-card border ${borderColor} p-5 md:p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:bg-white/[0.02] transition`}
                  >
                    {/* Result badge */}
                    <div className={`shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl ${resultColor}`}>
                      {resultLabel}
                    </div>

                    {/* Match info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 bg-white/5 px-2 py-1 rounded">
                          {match.competition}
                        </span>
                        {match.journee && (
                          <span className="text-[10px] font-bold text-white/30">{match.journee}</span>
                        )}
                        <span className="text-[10px] text-white/30">
                          {new Date(match.date).toLocaleDateString("fr-FR", {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-2xl md:text-4xl font-black athletic-title">
                        <span className={isHome ? "text-white italic uppercase" : "text-white/60"}>{match.domicile}</span>
                        <span className="text-white/20 text-lg font-normal">vs</span>
                        <span className={!isHome ? "text-white italic uppercase" : "text-white/60"}>{match.exterieur}</span>
                      </div>
                    </div>

                    {/* Score */}
                    <div className={`shrink-0 text-center px-8 py-4 rounded-2xl font-black tracking-wider ${resultColor}`}>
                      {isUpcoming ? (
                        <div>
                          <div className="text-2xl md:text-3xl">
                            {new Date(match.date).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="text-[10px] uppercase tracking-widest opacity-70 mt-1">Coup d'envoi</div>
                        </div>
                      ) : (
                        <div className="text-4xl md:text-6xl tabular-nums">
                          {match.score_domicile} <span className="opacity-50 text-3xl">-</span> {match.score_exterieur}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="mt-16">
            <div className="flex items-center gap-5 mb-8">
              <div className="p-3 rounded-2xl border" style={{ background: `${catStyle.accent}15`, borderColor: `${catStyle.accent}30` }}>
                <Activity size={24} style={{ color: catStyle.accent }} />
              </div>
              <div>
                <div className="text-[9px] font-black uppercase tracking-[0.5em] text-white/40 mb-1">Championnat & Coupes</div>
                <h2 className="text-3xl md:text-4xl font-black italic uppercase text-white tracking-tighter">Calendrier <span style={{ color: catStyle.accent }}>&amp; Résultats</span></h2>
              </div>
            </div>
            <div className="glass-card border border-white/5 p-12 md:p-20 flex flex-col items-center justify-center text-center">
              <Activity size={56} className="text-white/5 mb-5" />
              <p className="text-[11px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                Calendrier non disponible
              </p>
              <p className="text-[9px] text-white/20 mt-2 max-w-md">
                Les prochains matchs et résultats seront affichés ici dès qu'ils seront communiqués.
              </p>
            </div>
          </section>
        )}

        {/* ── BOTTOM NAVIGATION ── */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
            >
              Accueil
            </Link>
            <div className="text-white/20">/</div>
            <Link
              href="/equipes"
              className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} />
              <span className="text-sm font-black uppercase tracking-widest">Retour aux équipes</span>
            </Link>
          </div>
          {siblingTeams.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {siblingTeams.slice(0, 4).map((t: any) => (
                <Link
                  key={t.id}
                  href={`/equipes/${t.id}`}
                  className="px-4 py-2 rounded-xl glass-card border border-white/8 hover:border-white/20 text-[9px] font-black uppercase tracking-wider text-white/50 hover:text-white transition"
                >
                  {t.nom}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
