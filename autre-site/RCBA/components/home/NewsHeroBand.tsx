"use client";

import Link from "next/link";
import { Calendar, ChevronRight, Newspaper, ArrowRight, Tag } from "lucide-react";

interface NewsItem {
  id: number;
  titre: string;
  date: string;
  categorie?: string;
  image_url?: string;
  extrait?: string;
  slug?: string;
}

interface NewsHeroBandProps {
  news?: NewsItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Seniors: "bg-gold/20 text-gold border-gold/30",
  Club: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  Jeunes: "bg-pitch-green/20 text-pitch-green border-pitch-green/30",
  Féminines: "bg-pink-500/20 text-pink-300 border-pink-400/30",
  Partenaires: "bg-purple-500/20 text-purple-300 border-purple-400/30",
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/** Empty state component shown when no news items are available */
function NewsEmptyState() {
  return (
    <section className="mt-28 w-full" aria-label="Actualités du club">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Newspaper size={15} className="text-gold" aria-hidden="true" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-gold/70">Actualités</span>
          </div>
          <h2 className="athletic-title text-4xl italic">
            LA VIE <span className="text-gold">DU CLUB</span>
          </h2>
        </div>
      </div>

      <div className="relative border-4 border-navy-deep bg-navy p-12 md:p-20 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 slash-overlay opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-navy-deep border-4 border-gold flex items-center justify-center mb-8 transform -skew-x-6 shadow-[6px_6px_0_0_#D4AF37]">
            <Newspaper size={36} className="text-gold transform skew-x-6" aria-hidden="true" />
          </div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gold mb-3">
            Actualités à venir
          </div>
          <p className="text-white/60 text-sm font-bold uppercase tracking-wide max-w-md mb-8">
            Les actualités du club seront publiées prochainement. Restez connectés !
          </p>
          <Link
            href="/club/actualites"
            className="flex items-center gap-2 px-6 py-3 bg-gold text-navy-deep text-[10px] font-black uppercase tracking-widest border-2 border-navy-deep shadow-[4px_4px_0_0_#0a192f] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#0a192f] transition-all transform -skew-x-6"
          >
            <span className="transform skew-x-6 flex items-center gap-2">
              Voir les actus <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function NewsHeroBand({ news }: NewsHeroBandProps) {
  const items = news || [];
  if (items.length === 0) return <NewsEmptyState />;

  const featured = items[0];
  const sideNews = items.slice(1, 5);

  return (
    <section className="mt-28 w-full">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Newspaper size={15} className="text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-gold/70">Actualités</span>
          </div>
          <h2 className="athletic-title text-4xl italic">
            LA VIE <span className="text-gold">DU CLUB</span>
          </h2>
        </div>
        <Link
          href="/club/actualites"
          className="hidden sm:flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-white/50 hover:text-gold transition-colors group"
        >
          Toutes les actus
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ─── Featured Article (2/3 width) ─── */}
        {featured && (
          <div className="lg:col-span-2">
            <article className="group relative overflow-hidden border-4 border-navy-deep hover:border-pitch-green transition duration-500 brutal-shadow h-full min-h-[420px] bg-navy-light/30 transform -skew-x-2">
              {/* Background Image */}
              {featured.image_url ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${featured.image_url})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-navy-light via-navy to-navy-deep" />
              )}
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              
              {/* Badge "À LA UNE" */}
              <div className="absolute top-5 left-5 z-20">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold text-navy-deep text-[10px] font-black uppercase tracking-[0.3em] border-2 border-navy-deep shadow-[4px_4px_0_0_#0a192f] transform skew-x-2">
                  À la une
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-8">
                {/* Category */}
                {featured.categorie && (
                  <span className={`inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 mb-4 transform skew-x-2 ${CATEGORY_COLORS[featured.categorie] || "bg-navy text-white border-navy-deep shadow-[2px_2px_0_0_#0a192f]"}`}>
                    {featured.categorie}
                  </span>
                )}
                
                <h3 className="athletic-title text-2xl sm:text-3xl italic text-white mb-3 leading-tight group-hover:text-gold transition-colors duration-300 drop-shadow-lg">
                  {featured.titre}
                </h3>
                
                {featured.extrait && (
                  <p className="text-white/70 text-sm leading-relaxed mb-5 max-w-xl line-clamp-2">
                    {featured.extrait}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <Calendar size={12} />
                    <span className="font-medium">{formatDate(featured.date)}</span>
                  </div>
                  <Link
                    href={`/club/actualites/${featured.id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-pitch-green text-navy-deep text-[10px] font-black uppercase tracking-widest border-2 border-navy-deep shadow-[4px_4px_0_0_#0a192f] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#0a192f] transition-all transform skew-x-2"
                  >
                    Lire l'article
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        )}

        {/* ─── News Sidebar (1/3 width) ─── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1 px-1">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-[9px] font-black uppercase tracking-[0.35em] text-white/30 shrink-0">Dernières actus</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          {sideNews.map((item, idx) => (
            <Link
              key={item.id}
              href={`/club/actualites/${item.id}`}
              className="group flex items-start gap-4 p-4 border-2 border-navy-deep hover:border-pitch-green bg-navy hover:bg-navy-light transition duration-300 cursor-pointer shadow-[4px_4px_0_0_#0a192f] transform -skew-x-2"
            >
              {/* Number */}
              <div className="shrink-0 w-8 h-8 bg-navy border-2 border-navy-deep group-hover:border-pitch-green group-hover:bg-pitch-green/20 flex items-center justify-center transition duration-300 transform skew-x-2">
                <span className="text-xs font-black text-white/50 group-hover:text-pitch-green transition-colors">
                  {String(idx + 2).padStart(2, "0")}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Category badge */}
                {item.categorie && (
                  <span className={`inline-block px-2 py-0.5 text-[8px] font-black uppercase tracking-widest border-2 mb-1.5 transform skew-x-2 ${CATEGORY_COLORS[item.categorie] || "bg-navy text-white/70 border-navy-deep"}`}>
                    {item.categorie}
                  </span>
                )}
                <h4 className="text-[11px] font-black uppercase tracking-wide text-white/80 group-hover:text-white leading-snug mb-1.5 line-clamp-2 transition-colors">
                  {item.titre}
                </h4>
                <div className="flex items-center gap-1.5 text-white/30 text-[9px]">
                  <Calendar size={9} />
                  <span>{formatDate(item.date)}</span>
                </div>
              </div>

              <ChevronRight
                size={14}
                className="shrink-0 text-white/20 group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-300"
              />
            </Link>
          ))}

          {/* CTA Mobile */}
          <Link
            href="/club/actualites"
            className="mt-2 flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/10 hover:border-gold/30 text-[10px] font-black uppercase tracking-[0.25em] text-white/40 hover:text-gold transition-colors group sm:hidden"
          >
            Toutes les actus
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
