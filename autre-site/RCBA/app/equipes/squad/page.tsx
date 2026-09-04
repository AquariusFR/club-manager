import { getDb } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Target, Shield, Zap, Users } from "lucide-react";
import type { Metadata } from "next";
import TeamPlayerCard from "@/components/TeamPlayerCard";
import { getPlayerSelectionMerit } from "@/lib/actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Effectif | Racing Club Bû Abondant",
  description: "Découvrez l'effectif complet du RCBA — Gardiens, Défenseurs, Milieux et Attaquants. Le trombinoscope officiel du Racing Club Bû Abondant.",
};

type Poste = "gk" | "def" | "mid" | "att" | "unknown";

const posteConfig: Record<Poste, { label: string; shortLabel: string; color: string; bg: string; border: string; textColor: string }> = {
  gk:      { label: "Gardien",   shortLabel: "G", color: "text-gold",        bg: "bg-gold/10",        border: "border-gold/35",        textColor: "#D4AF37" },
  def:     { label: "Défenseur", shortLabel: "D", color: "text-blue-400",    bg: "bg-blue-400/10",    border: "border-blue-400/35",    textColor: "#60A5FA" },
  mid:     { label: "Milieu",    shortLabel: "M", color: "text-pitch-green", bg: "bg-pitch-green/10", border: "border-pitch-green/35", textColor: "#62CB72" },
  att:     { label: "Attaquant", shortLabel: "A", color: "text-rose-400",    bg: "bg-rose-400/10",    border: "border-rose-400/35",    textColor: "#F87171" },
  unknown: { label: "Joueur",    shortLabel: "?", color: "text-white/60",    bg: "bg-white/5",        border: "border-white/10",       textColor: "rgba(255,255,255,0.4)" },
};

const POSTES = [
  { key: "GAR",   label: "Gardiens de But", icon: Shield,  color: "text-gold",        border: "border-gold/30",         bg: "bg-gold/10", posteKey: "gk" as Poste },
  { key: "DEF",   label: "Défenseurs",      icon: Shield,  color: "text-blue-400",    border: "border-blue-400/30",     bg: "bg-blue-400/10", posteKey: "def" as Poste },
  { key: "MIL",   label: "Milieux",         icon: Zap,     color: "text-pitch-green", border: "border-pitch-green/30",  bg: "bg-pitch-green/10", posteKey: "mid" as Poste },
  { key: "ATT",   label: "Attaquants",      icon: Target,  color: "text-rose-400",    border: "border-rose-500/30",     bg: "bg-rose-500/10", posteKey: "att" as Poste },
];

export default async function SquadPage() {
  const db = await getDb();

  const players = await db.all(`
    SELECT j.*, e.nom as equipe_nom
    FROM Joueurs j
    LEFT JOIN Equipes e ON j.equipe_id = e.id
    ORDER BY j.poste ASC, j.nom ASC
  `).catch(() => [] as any[]);

  const playersWithMerit: any[] = [];
  for (const p of players) {
    const merit = await getPlayerSelectionMerit(p);
    playersWithMerit.push({ ...p, merit });
  }

  // Pre-calculate display names
  const prenomCounts: Record<string, number> = {};
  for (const p of playersWithMerit) {
    if (p.prenom) {
      const lower = p.prenom.trim().toLowerCase();
      prenomCounts[lower] = (prenomCounts[lower] || 0) + 1;
    }
  }
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

  const playersByPoste = POSTES.map(poste => ({
    ...poste,
    players: playersWithMerit.filter((p: any) => {
      const pos = (p.poste || '').toLowerCase();
      if (poste.key === 'GAR') return pos.startsWith('g');
      if (poste.key === 'DEF') return pos.startsWith('d');
      if (poste.key === 'MIL') return pos.startsWith('m');
      if (poste.key === 'ATT') return pos.startsWith('a');
      return false;
    })
  }));

  const totalPlayers = playersWithMerit.length;

  return (
    <div className="min-h-screen bg-navy-deep text-white font-body">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep via-navy-deep to-navy-deep/80 pointer-events-none" />
        <div className="absolute top-[-15%] left-[-12%] w-[55%] h-[55%] bg-gold/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-8%] right-[-8%] w-[45%] h-[50%] bg-pitch-green/4 rounded-full blur-[140px]" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors text-sm font-black uppercase tracking-widest mb-12">
            <ArrowLeft size={14} />
            Accueil
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 mb-8">
              <Users size={12} className="text-gold" />
              Saison 2025-2026 · {totalPlayers} Joueurs
            </div>
            <h1 className="athletic-title text-[clamp(2.5rem,6vw,6rem)] italic leading-none mb-6">
              EFFECTIF <span className="text-gold">RCBA</span>
            </h1>
            <p className="text-white/50 text-sm italic max-w-xl mx-auto">
              Le trombinoscope officiel du Racing Club Bû Abondant — l'élite qui défend nos couleurs chaque week-end.
            </p>
          </div>
        </div>
      </div>

      {/* Squads by position */}
      <div className="max-w-7xl mx-auto px-6 pb-24 space-y-20">
        {playersByPoste.map(group => (
          <section key={group.key}>
            <div className="flex items-center gap-4 mb-10">
              <div className={`w-10 h-10 rounded-2xl ${group.bg} border ${group.border} flex items-center justify-center ${group.color}`}>
                <group.icon size={18} />
              </div>
              <div>
                <h2 className={`athletic-title text-2xl italic ${group.color}`}>{group.label}</h2>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{group.players.length} joueur{group.players.length !== 1 ? 's' : ''}</p>
              </div>
              <div className={`flex-1 h-px bg-gradient-to-r ${group.color.replace('text-', 'from-').replace('400', '400/20').replace('green', 'green/20').replace('rose-400', 'rose-400/20').replace('gold', 'gold/20')} to-transparent ml-4`} />
            </div>

            {group.players.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 pt-4 pb-8">
                {group.players.map((player: any, index: number) => (
                  <TeamPlayerCard
                    key={player.id}
                    player={player}
                    cfg={posteConfig[group.posteKey]}
                    poste={group.posteKey}
                    index={index}
                    displayName={player.displayName}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 border border-white/5 text-center text-white/30 text-sm italic">
                Aucun joueur enregistré pour ce poste.
              </div>
            )}
          </section>
        ))}

        {players.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚽</div>
            <p className="text-white/40 text-sm italic">L'effectif n'a pas encore été renseigné.</p>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/5 py-12 text-center">
        <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-gold transition-colors inline-flex items-center gap-2">
          <ArrowLeft size={12} />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
