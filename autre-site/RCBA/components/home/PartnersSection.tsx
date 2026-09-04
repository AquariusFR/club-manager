import Link from "next/link";
import { Trophy, Star, ExternalLink, Award } from "lucide-react";

interface Partner {
  name: string;
  img: string;
  tier?: "principal" | "major" | "equipementier" | "standard";
  website?: string;
}

const PARTNERS: Partner[] = [
  { name: "HIBLOT", img: "/images/Partenaires/HIBLOT.COM.png", tier: "principal" },
  { name: "Groupe CMA - Renault", img: "/images/Partenaires/Groupe CMA - Renault.png", tier: "major" },
  { name: "Crédit Agricole", img: "/images/Partenaires/Credit Agricole.png", tier: "major" },
  { name: "Fillon Technologies", img: "/images/Partenaires/Fillon Technologies.png", tier: "major" },
  { name: "Pro Green", img: "/images/Partenaires/Pro Green.png", tier: "equipementier" },
  { name: "Les 3S sport", img: "/images/Partenaires/Les 3S sport.png", tier: "equipementier" },
  { name: "Garage Auriau", img: "/images/Partenaires/Garage Auriau.png", tier: "standard" },
  { name: "Bar Tabac Bû", img: "/images/Partenaires/Bar Tabac Bu.png", tier: "standard" },
  { name: "Général d'Optique", img: "/images/Partenaires/Gunural duoptique - DREUX.png", tier: "standard" },
  { name: "SFA", img: "/images/Partenaires/SFA.png", tier: "standard" },
  { name: "Alf", img: "/images/Partenaires/Alf.png", tier: "standard" },
  { name: "OuPlateau", img: "/images/Partenaires/OuPlateau.png", tier: "standard" },
];

const principal = PARTNERS.filter(p => p.tier === "principal");
const majors = PARTNERS.filter(p => p.tier === "major");
const equipementiers = PARTNERS.filter(p => p.tier === "equipementier");
const standards = PARTNERS.filter(p => p.tier === "standard");

// Marquee combines all
const allForMarquee = [...PARTNERS, ...PARTNERS];

function PartnerCard({ partner, size = "md" }: { partner: Partner; size?: "lg" | "md" | "sm" }) {
  const sizeClasses = {
    lg: "h-36 w-full",
    md: "h-28 w-full",
    sm: "h-20 w-full",
  };

  return (
    <div className={`group glass-card bg-white/5 border border-white/10 hover:border-gold/40 hover:bg-white/10 flex items-center justify-center p-4 transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] rounded-2xl relative overflow-hidden ${sizeClasses[size]}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <img
        src={encodeURI(`${partner.img}?v=1`)}
        alt={partner.name}
        className="max-w-full max-h-full object-contain opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 relative z-10"
      />
    </div>
  );
}

export default function PartnersSection() {
  return (
    <section className="mt-32 relative">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-black uppercase tracking-[0.3em] mb-5 border border-gold/20">
          <Trophy size={12} />
          Soutiens
        </div>
        <h2 className="athletic-title text-4xl italic mb-4">
          NOS <span className="text-gold">PARTENAIRES</span>
        </h2>
        <p className="text-white/50 text-sm max-w-lg mx-auto italic">
          Ils nous font confiance et permettent au RCBA de grandir saison après saison.
        </p>
      </div>

      {/* ─── PARTENAIRE PRINCIPAL ─── */}
      {principal.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/20" />
            <div className="flex items-center gap-2 px-4 py-1 rounded-full border border-gold/30 bg-gold/5">
              <Star size={11} className="text-gold fill-gold" />
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-gold">Partenaire Principal</span>
              <Star size={11} className="text-gold fill-gold" />
            </div>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/20" />
          </div>

          <div className="flex justify-center">
            <div className="max-w-sm w-full relative">
              {/* Glow halo */}
              <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-3xl" />
              <div className="relative group glass-card border-2 border-gold/40 hover:border-gold/70 rounded-3xl p-10 flex flex-col items-center gap-4 transition-all duration-500 hover:shadow-[0_0_60px_rgba(212,175,55,0.2)] overflow-hidden bg-white/[0.03]">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent" />
                <img
                  src={encodeURI(`${principal[0].img}?v=1`)}
                  alt={principal[0].name}
                  className="max-h-24 max-w-full object-contain relative z-10 opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                />
                <div className="flex items-center gap-1.5 relative z-10">
                  <Award size={11} className="text-gold" />
                  <span className="text-[9px] font-black uppercase tracking-[0.35em] text-gold/70">Partenaire Titre</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── PARTENAIRES MAJEURS ─── */}
      {majors.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30 px-3">Partenaires Majeurs</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {majors.map((p) => (
              <PartnerCard key={p.name} partner={p} size="md" />
            ))}
          </div>
        </div>
      )}

      {/* ─── ÉQUIPEMENTIERS ─── */}
      {equipementiers.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30 px-3">Équipementiers Officiels</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {equipementiers.map((p) => (
              <PartnerCard key={p.name} partner={p} size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* ─── AUTRES PARTENAIRES ─── */}
      {standards.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30 px-3">Nos Partenaires</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {standards.map((p) => (
              <PartnerCard key={p.name} partner={p} size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* ─── MARQUEE (bannière défilante) ─── */}
      <div className="mt-12 py-10 border-y border-white/5 bg-white/[0.008] relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-transparent to-navy-deep z-10 pointer-events-none" />
        <div className="flex overflow-hidden select-none">
          <div className="flex gap-10 animate-marquee whitespace-nowrap items-center">
            {allForMarquee.map((p, i) => (
              <div key={i} className="h-16 w-36 glass-card bg-white/5 border-white/10 flex items-center justify-center p-2 hover:border-gold/40 hover:bg-white/15 transition duration-500 group shrink-0 rounded-xl">
                <img
                  src={encodeURI(`${p.img}?v=1`)}
                  alt={p.name}
                  className="max-w-full max-h-full object-contain opacity-50 group-hover:opacity-100 group-hover:scale-110 transition duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── CTA Devenir Partenaire ─── */}
      <div className="mt-10 text-center">
        <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl border border-white/10 bg-white/[0.02] glass-card">
          <p className="text-white/50 text-sm italic">
            Vous souhaitez soutenir le RCBA ?
          </p>
          <Link
            href="/club/partenaires"
            className="group flex items-center gap-2 px-7 py-3 bg-gold text-navy-deep rounded-xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-gold-bright transition duration-300 shadow-[0_0_30px_rgba(212,175,55,0.25)] athletic-title"
          >
            Devenir Partenaire
            <ExternalLink size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
