import { Newspaper, Calendar, ArrowRight, Tag, Search } from "lucide-react";
import Link from "next/link";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import { getDb } from "@/lib/db";
import { CATEGORY_COLORS, formatDate, NEWS_ITEMS as FALLBACK_NEWS } from "@/lib/data/news";

const CATEGORIES = ["Tous", "Club", "Jeunes", "Féminines", "Seniors", "Partenaires"];

export default async function ActualitesPage() {
  const db = await getDb();
  const rawNews = await db.all(`
    SELECT id, titre, contenu, date, type
    FROM IntelligenceFeed
    ORDER BY date DESC
  `).catch(() => []);

  const dbNews = (rawNews || []).map((n) => ({
    id: n.id,
    titre: n.titre,
    extrait: n.contenu ? n.contenu.substring(0, 150) + "..." : "",
    date: n.date,
    categorie: n.type || "Club"
  }));

  const NEWS_ITEMS = dbNews.length > 0 ? dbNews : FALLBACK_NEWS;

  const featured = NEWS_ITEMS[0];
  const rest = NEWS_ITEMS.slice(1);

  return (
    <main className="min-h-screen bg-navy-deep text-white selection:bg-gold/30 pb-40 overflow-hidden relative">
      {/* ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-5%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[180px] opacity-40" />
        <div className="absolute bottom-[15%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">

        {/* ─── HEADER ─── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 pb-12 border-b border-white/5 relative">
          <HudCorners color="#d4af37" opacity={0.04} />
          <PageLabel
            section="COMMUNICATION"
            category="ACTUALITÉS DU CLUB"
            title="VIE DU CLUB"
            subtitle="Suivez toute l'actualité du Racing Club Bû Abondant : résultats, événements, recrutement et vie associative."
            icon="club"
            variant="gold"
          />
        </div>

        {NEWS_ITEMS.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
            <Newspaper className="mx-auto mb-6 text-white/20" size={48} />
            <h2 className="text-2xl font-black text-white/60 mb-2 uppercase tracking-widest">Aucune actualité</h2>
            <p className="text-white/40">Revenez plus tard pour suivre la vie du club.</p>
          </div>
        ) : (
          <>
            {/* ─── ARTICLE À LA UNE ─── */}
            <section className="mb-20">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/20" />
                <span className="text-[9px] font-black uppercase tracking-[0.45em] text-gold/60 px-3">À la une</span>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/20" />
              </div>

              <article className="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-gold/30 transition duration-500 shadow-2xl min-h-[420px] bg-navy-light/30">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-light via-navy to-navy-deep" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Badge à la une */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold text-navy-deep text-[9px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-navy-deep animate-pulse" />
                    À la une
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                  {featured.categorie && (
                    <span className={`inline-block px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border mb-5 ${(CATEGORY_COLORS as Record<string, string>)[featured.categorie] ?? "bg-white/10 text-white/60 border-white/20"}`}>
                      {featured.categorie}
                    </span>
                  )}

                  <h1 className="athletic-title text-3xl md:text-4xl italic text-white mb-4 leading-tight group-hover:text-gold transition-colors duration-300">
                    {featured.titre}
                  </h1>

                  {featured.extrait && (
                    <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-2xl">
                      {featured.extrait}
                    </p>
                  )}

                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-white/40 text-xs">
                      <Calendar size={12} />
                      <span>{formatDate(featured.date)}</span>
                    </div>
                    <Link
                      href={`/club/actualites/${featured.id}`}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gold text-navy-deep rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition shadow-[0_0_20px_rgba(212,175,55,0.3)]"
                    >
                      Lire l'article <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            </section>

            {/* ─── FILTRES PAR CATÉGORIE ─── */}
            <div className="flex flex-wrap gap-2 mb-12">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ${
                    cat === "Tous"
                      ? "bg-gold/20 text-gold border-gold/40"
                      : "bg-white/5 text-white/40 border-white/10 hover:border-gold/30 hover:text-gold/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* ─── GRILLE DES ARTICLES ─── */}
            {rest.length > 0 && (
              <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((item) => (
                    <article
                      key={item.id}
                      className="group glass-card border border-white/5 hover:border-gold/20 bg-white/[0.01] hover:bg-white/[0.03] rounded-2xl p-6 flex flex-col transition-all duration-500 hover:shadow-[0_0_30px_rgba(212,175,55,0.06)] cursor-pointer"
                    >
                      {/* Category */}
                      {item.categorie && (
                        <span className={`self-start inline-block px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border mb-4 ${(CATEGORY_COLORS as Record<string, string>)[item.categorie] ?? "bg-white/10 text-white/50 border-white/20"}`}>
                          {item.categorie}
                        </span>
                      )}

                      <h2 className="text-sm font-black uppercase tracking-wide text-white/80 group-hover:text-white leading-snug mb-3 flex-1 transition-colors">
                        {item.titre}
                      </h2>

                      {item.extrait && (
                        <p className="text-xs text-white/40 italic leading-relaxed mb-4 line-clamp-2">
                          {item.extrait}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-white/30 text-[9px]">
                          <Calendar size={10} />
                          <span>{formatDate(item.date)}</span>
                        </div>
                        <Link href={`/club/actualites/${item.id}`} className="text-[9px] font-black uppercase tracking-widest text-gold/40 group-hover:text-gold transition-colors flex items-center gap-1">
                          Lire <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

