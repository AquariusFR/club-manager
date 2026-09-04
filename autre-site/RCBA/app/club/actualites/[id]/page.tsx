import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import { getDb } from "@/lib/db";
import { CATEGORY_COLORS, formatDate } from "@/lib/data/news";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const articleId = parseInt(resolvedParams.id, 10);
  
  const db = await getDb();
  const rawArticle = await db.get(`
    SELECT id, titre, contenu, date, type
    FROM IntelligenceFeed
    WHERE id = ?
  `, [articleId]);

  if (!rawArticle) {
    notFound();
  }

  const article = {
    id: rawArticle.id,
    titre: rawArticle.titre,
    contenu: rawArticle.contenu,
    date: rawArticle.date,
    categorie: rawArticle.type || "Club"
  };

  return (
    <main className="min-h-screen bg-navy-deep text-white selection:bg-gold/30 pb-40 overflow-hidden relative">
      {/* ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] right-[-5%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[180px] opacity-40" />
        <div className="absolute bottom-[15%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 md:py-32 relative z-10">
        {/* RETOUR */}
        <div className="mb-12">
          <Link
            href="/club/actualites"
            className="inline-flex items-center gap-2 text-white/50 hover:text-gold transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Retour aux actualités
          </Link>
        </div>

        {/* EN-TÊTE DE L'ARTICLE */}
        <header className="mb-16 relative">
          <HudCorners color="#d4af37" opacity={0.1} />
          <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-navy-light/50 to-transparent" />
            
            <div className="relative z-10">
              {article.categorie && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border mb-6 ${(CATEGORY_COLORS as Record<string, string>)[article.categorie] ?? "bg-white/10 text-white/60 border-white/20"}`}>
                  <Tag size={10} /> {article.categorie}
                </span>
              )}
              
              <h1 className="athletic-title text-3xl md:text-5xl italic text-white mb-6 leading-tight">
                {article.titre}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/40 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gold/60" />
                  <span>{formatDate(article.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={14} className="text-gold/60" />
                  <span>Rédaction RCBA</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENU DE L'ARTICLE */}
        <article className="prose prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:italic prose-a:text-gold hover:prose-a:text-amber-400">
          {article.contenu.split('\n').filter((p: string) => p.trim() !== '').map((paragraph: string, index: number) => (
            <p key={index} className={index === 0 ? "text-xl text-white/80 leading-relaxed font-light mb-8" : "text-white/60 leading-relaxed mb-6"}>
              {paragraph}
            </p>
          ))}

          <div className="my-12 p-6 rounded-2xl bg-gold/5 border border-gold/20 flex flex-col items-center text-center">
            <h3 className="text-gold font-black uppercase tracking-widest text-sm mb-3">Rejoignez l'aventure</h3>
            <p className="text-white/70 text-sm mb-6 max-w-md">
              Envie de participer à la vie du club ? Que vous soyez joueur, bénévole ou partenaire, le RCBA vous accueille à bras ouverts.
            </p>
            <Link
              href="/rejoindre"
              className="px-6 py-3 bg-gold text-navy-deep rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400 transition"
            >
              Découvrir comment nous rejoindre
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
