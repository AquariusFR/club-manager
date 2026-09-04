import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, ExternalLink } from "lucide-react";

const PRODUCTS = [
  {
    id: "maillot-dom",
    name: "Maillot Domicile RCBA 2025/26",
    price: "65.00 €",
    image: "/images/boutique/maillot-domicile.png",
    tag: "Officiel",
    description: "Maillot domicile Adidas de la saison 2025-2026",
  },
  {
    id: "veste-coach",
    name: "Veste Softshell Club",
    price: "85.00 €",
    image: "/images/boutique/veste-softshell.png",
    tag: "Premium",
    description: "Veste softshell technique aux couleurs du RCBA",
  },
  {
    id: "pack-training",
    name: "Pack Entraînement Joueur",
    price: "45.00 €",
    image: "/images/boutique/pack-training.png",
    tag: "Best Seller",
    description: "Pack complet pour l'entraînement au RCBA",
  },
];

/** Official Adidas team shop URL */
const BOUTIQUE_OFFICIELLE_URL =
  "https://www.adidasteam.com/fr-fr/clubshop/racing-club-bu-abondant/";

export default function BoutiqueTeaser() {
  return (
    <section className="mt-32 relative" aria-labelledby="boutique-title">
      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-2 mb-12 mt-16">
        <div className="flex items-center gap-4">
          <div className="h-2 w-16 bg-pitch-green transform -skew-x-12" aria-hidden="true" />
          <h2
            id="boutique-title"
            className="athletic-title text-3xl md:text-4xl italic text-white uppercase"
          >
            Portez Nos Couleurs
          </h2>
          <div className="h-2 w-16 bg-pitch-green transform -skew-x-12" aria-hidden="true" />
        </div>
        <p className="text-white/60 text-xs md:text-sm font-bold uppercase tracking-widest italic">
          Équipements officiels Adidas du Racing Club Bû Abondant
        </p>
      </div>

      {/* Product Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {PRODUCTS.map((product) => (
          <Link
            key={product.id}
            href={`/boutique?product=${product.id}`}
            aria-label={`Voir ${product.name} — ${product.price}`}
            className="group bg-white border-4 border-navy-deep p-6 transition-all duration-300 overflow-hidden relative brutal-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0_0_#0a192f]"
          >
            {/* Tag */}
            <div className="absolute top-4 right-4 z-10 transform -skew-x-6">
              <span className="px-3 py-1 bg-pitch-green text-navy-deep border-2 border-navy-deep text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_0_rgba(10,25,47,1)] block skew-x-6">
                {product.tag}
              </span>
            </div>

            {/* Product image */}
            <div className="relative h-64 mb-6 bg-navy/5 border-2 border-navy/10 group-hover:border-navy-deep transition-colors">
              <Image
                src={product.image}
                alt={product.description}
                fill
                sizes="(max-width: 768px) 90vw, 30vw"
                className="object-contain p-4 group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-500 drop-shadow-xl"
              />
            </div>

            {/* Product info */}
            <div className="flex justify-between items-end border-t-4 border-navy-deep pt-4">
              <div>
                <h3 className="athletic-title text-xl mb-1 text-navy-deep group-hover:text-pitch-green transition-colors uppercase leading-tight">
                  {product.name}
                </h3>
                <p className="text-navy font-black tracking-wider text-xl bg-pitch-green/20 inline-block px-2 mt-2">
                  {product.price}
                </p>
              </div>
              <div
                className="shrink-0 w-12 h-12 bg-navy-deep border-2 border-navy-deep flex items-center justify-center text-white group-hover:bg-pitch-green group-hover:text-navy-deep shadow-[4px_4px_0_0_rgba(10,25,47,1)] group-hover:shadow-[2px_2px_0_0_rgba(10,25,47,1)] transition-all duration-300 transform -skew-x-6"
                aria-hidden="true"
              >
                <ShoppingBag size={20} className="transform skew-x-6" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {/* Internal boutique */}
        <Link
          href="/boutique"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-pitch-green text-navy-deep border-4 border-navy-deep text-sm font-black uppercase tracking-[0.2em] transition-all brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#0a192f] transform -skew-x-6"
        >
          <span className="transform skew-x-6 flex items-center gap-3">
            Accéder à la Boutique{" "}
            <ArrowRight size={18} className="text-navy-deep group-hover:translate-x-2 transition-transform" aria-hidden="true" />
          </span>
        </Link>

        {/* External Adidas link */}
        <a
          href={BOUTIQUE_OFFICIELLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Boutique officielle Adidas RCBA (nouvelle fenêtre)"
          className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-navy-deep border-4 border-navy-deep text-sm font-black uppercase tracking-[0.2em] transition-all brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#0a192f] transform -skew-x-6"
        >
          <span className="transform skew-x-6 flex items-center gap-3">
            Boutique Adidas Officielle{" "}
            <ExternalLink size={16} className="text-navy/50 group-hover:text-pitch-green transition-colors" aria-hidden="true" />
          </span>
        </a>
      </div>
    </section>
  );
}
