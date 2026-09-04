import Image from "next/image";
import { Star, Flame, TrendingUp, Calendar } from "lucide-react";

export interface LegendData {
  prenom?: string;
  nom?: string;
  photo_url?: string;
  poste?: string;
  equipe_nom?: string;
}

interface Props {
  legend: LegendData | null;
}

/** Generate a contextual quote from player data without hardcoding a name */
function buildQuote(legend: LegendData): string {
  const poste = legend.poste?.toLowerCase() ?? "";
  const equipe = legend.equipe_nom ?? "l'équipe";
  const prenom = legend.prenom ?? "Ce joueur";

  if (poste.includes("gardien") || poste.includes("gk")) {
    return `${prenom} assure une présence remarquable dans les buts. Son calme, sa lecture du jeu et ses arrêts décisifs ont été précieux pour ${equipe} ce mois-ci.`;
  }
  if (poste.includes("défenseur") || poste.includes("def") || poste.includes("latéral")) {
    return `${prenom} incarne la solidité et la combativité défensive. Sa rigueur et son engagement physique ont été des atouts déterminants pour ${equipe}.`;
  }
  if (poste.includes("milieu") || poste.includes("mid")) {
    return `${prenom} a été le métronome de ${equipe}. Sa vision du jeu, sa régularité et son investissement à l'entraînement reflètent les valeurs du RCBA.`;
  }
  if (poste.includes("attaquant") || poste.includes("avant") || poste.includes("att")) {
    return `${prenom} a brillé devant le but et porté ${equipe} par son efficacité et sa combativité. Un leader offensif exemplaire ce mois-ci.`;
  }
  // Generic fallback
  return `${prenom} s'est illustré par son engagement, son esprit d'équipe et ses performances remarquables avec ${equipe}. Un exemple des valeurs du Racing Club Bû Abondant.`;
}

export default function LegendOfTheMonth({ legend }: Props) {
  if (!legend) return null;

  const quote = buildQuote(legend);
  const hasPhoto = !!legend.photo_url;
  const fullName = [legend.prenom, legend.nom].filter(Boolean).join(" ");

  return (
    <section className="mt-32 relative w-full max-w-5xl mx-auto" aria-labelledby="legend-title">
      {/* Section Header */}
      <div className="flex items-center justify-center gap-4 mb-14">
        <div className="h-2 w-16 bg-gold transform -skew-x-12" />
        <div className="text-center">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-2">
            Mise à l'honneur
          </div>
          <h2
            id="legend-title"
            className="athletic-title text-4xl italic text-white uppercase"
            style={{ textShadow: "4px 4px 0 rgba(212,175,55,0.4)" }}
          >
            LÉGENDE DU <span className="text-gold">MOIS</span>
          </h2>
        </div>
        <div className="h-2 w-16 bg-gold transform -skew-x-12" />
      </div>

      <div className="bg-navy border-4 border-gold shadow-[8px_8px_0_0_#D4AF37] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0_0_#D4AF37] transition-all duration-300 overflow-hidden relative group">
        <div className="grid md:grid-cols-5 gap-0">
          {/* ── Photo Area ── */}
          <div className="md:col-span-2 relative min-h-[300px] bg-navy-deep border-r-4 border-gold">
            <div className="absolute inset-0 bg-navy-deep/20 z-10 hidden md:block" />

            {hasPhoto ? (
              <Image
                src={
                  legend.photo_url!.startsWith("http") || legend.photo_url!.startsWith("/")
                    ? legend.photo_url!
                    : `/images/joueurs/${legend.photo_url}`
                }
                alt={`Photo de ${fullName}`}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover grayscale group-hover:grayscale-0 transition duration-500"
              />
            ) : (
              <div className="w-full h-full bg-navy flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                <Flame
                  size={64}
                  className="text-gold mb-4 relative z-20 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]"
                  aria-hidden="true"
                />
                <span className="text-white/40 text-xs font-black uppercase tracking-widest relative z-20">
                  Photo à venir
                </span>
              </div>
            )}

            {/* Name overlay */}
            <div className="w-full h-full absolute inset-0 flex flex-col items-center justify-end p-6 text-center pointer-events-none z-20">
              <div className="w-full flex flex-col items-center bg-navy-deep/90 border-2 border-gold p-4 transform -skew-x-6 shadow-[4px_4px_0_0_rgba(212,175,55,0.5)]">
                <h3 className="athletic-title text-3xl md:text-4xl italic text-white uppercase transform skew-x-6 leading-none">
                  {legend.prenom || ""} <br />
                  <span className="text-gold">{legend.nom || ""}</span>
                </h3>
                <div className="text-[10px] font-black uppercase tracking-widest text-navy-deep mt-2 transform skew-x-6 bg-gold px-3 py-1 border-2 border-navy-deep shadow-[2px_2px_0_0_#020617]">
                  {legend.poste || "Joueur"} • {legend.equipe_nom || "RCBA"}
                </div>
              </div>
            </div>
          </div>

          {/* ── Content Area ── */}
          <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center relative z-20 bg-navy-deep">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-2 bg-gold transform -skew-x-12"></div>
              <h3 className="font-black text-2xl uppercase tracking-tight text-white">
                Le moteur de <span className="text-gold">{legend.equipe_nom || "l'équipe"}</span>
              </h3>
            </div>

            {/* Dynamic quote */}
            <blockquote
              className="text-white font-medium text-lg leading-relaxed mb-8 relative bg-white/5 border-l-4 border-gold p-6 transform -skew-x-2"
              cite="#"
            >
              <div className="transform skew-x-2 italic">
                &ldquo;{quote}&rdquo;
              </div>
            </blockquote>

            {/* Honest stats — no fake numbers */}
            <div className="grid grid-cols-3 gap-4 border-t-4 border-gold/30 pt-6">
              <div className="bg-navy border-2 border-gold/30 p-3 transform -skew-x-6">
                <div className="transform skew-x-6 text-center">
                  <Star size={18} className="text-gold mx-auto mb-1" aria-hidden="true" />
                  <div className="text-[9px] font-black uppercase tracking-widest text-gold mb-1">Honneur</div>
                  <div className="athletic-title text-xl text-white">⭐⭐⭐</div>
                  <div className="text-[9px] text-white/60 font-black uppercase">du Mois</div>
                </div>
              </div>
              <div className="bg-navy border-2 border-gold/30 p-3 transform -skew-x-6">
                <div className="transform skew-x-6 text-center">
                  <TrendingUp size={18} className="text-gold mx-auto mb-1" aria-hidden="true" />
                  <div className="text-[9px] font-black uppercase tracking-widest text-gold mb-1">Progression</div>
                  <div className="athletic-title text-xl text-white">↑ Top</div>
                  <div className="text-[9px] text-white/60 font-black uppercase">Performances</div>
                </div>
              </div>
              <div className="bg-navy border-2 border-pitch-green p-3 transform -skew-x-6 shadow-[2px_2px_0_0_#62CB72]">
                <div className="transform skew-x-6 text-center">
                  <Calendar size={18} className="text-pitch-green mx-auto mb-1" aria-hidden="true" />
                  <div className="text-[9px] font-black uppercase tracking-widest text-pitch-green mb-1">Fidélité</div>
                  <div className="athletic-title text-xl text-white">MVP</div>
                  <div className="text-[9px] text-white/60 font-black uppercase">Élu par l'équipe</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
