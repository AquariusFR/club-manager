import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const partners = [
  { name: "HIBLOT", img: "/images/Partenaires/HIBLOT.COM.png" },
  { name: "Garage Auriau", img: "/images/Partenaires/Garage Auriau.png" },
  { name: "Bar Tabac Bû", img: "/images/Partenaires/Bar Tabac Bu.png" },
  { name: "Crédit Agricole", img: "/images/Partenaires/Credit Agricole.png" },
  { name: "Fillon Technologies", img: "/images/Partenaires/Fillon Technologies.png" },
  { name: "Groupe CMA - Renault", img: "/images/Partenaires/Groupe CMA - Renault.png" },
  { name: "Générale d'Optique Dreux", img: "/images/Partenaires/Gunural duoptique - DREUX.png" },
  { name: "Les 3S Sport", img: "/images/Partenaires/Les 3S sport.png" },
  { name: "Pro Green", img: "/images/Partenaires/Pro Green.png" },
  { name: "SFA", img: "/images/Partenaires/SFA.png" },
  { name: "ALF", img: "/images/Partenaires/Alf.png" },
  { name: "O'Plateau", img: "/images/Partenaires/OuPlateau.png" },
];

// Duplicate for seamless infinite marquee
const allPartners = [...partners, ...partners];

export default function PartnersMarquee() {
  return (
    <section
      className="mt-32 py-20 border-y-4 border-navy-deep bg-navy relative overflow-hidden"
      aria-label="Nos partenaires officiels"
    >
      <div className="absolute inset-0 slash-overlay opacity-50 pointer-events-none" />

      {/* Section Header */}
      <div className="text-center mb-14 relative z-20 flex flex-col items-center">
        <div className="bg-navy-deep text-white px-4 py-1 border-2 border-pitch-green text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0_0_#145014] transform -skew-x-6 mb-4">
          <span className="block transform skew-x-6">Soutiens</span>
        </div>
        <h2 className="athletic-title text-4xl italic text-white">
          NOS PARTENAIRES <span className="text-pitch-green bg-navy-deep px-2">OFFICIELS</span>
        </h2>
      </div>

      {/* Marquee — next/image optimized */}
      <div
        className="flex overflow-hidden select-none mb-14 relative z-20"
        aria-hidden="true"
      >
        <div className="flex gap-12 animate-marquee hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] whitespace-nowrap items-center">
          {allPartners.map((p, i) => (
            <div
              key={i}
              className="h-24 w-48 bg-white border-4 border-navy-deep flex flex-col items-center justify-center p-3 transition-all duration-300 group shrink-0 shadow-[4px_4px_0_0_rgba(10,25,47,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_rgba(10,25,47,1)]"
              title={p.name}
            >
              <div className="relative w-full h-full">
                <Image
                  src={p.img}
                  alt={`Logo ${p.name}`}
                  fill
                  sizes="192px"
                  className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500 p-1"
                  unoptimized={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-20">
        <Link
          href="/club/partenaires"
          className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-pitch-green text-navy-deep border-4 border-navy-deep font-black uppercase tracking-widest transition-all brutal-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_#020617] transform -skew-x-6 group"
        >
          <span className="transform skew-x-6 flex items-center gap-2">
            Associer Votre Image <ArrowRight size={18} className="text-navy-deep group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>
        <Link
          href="/club/partenaires"
          className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white text-navy-deep border-4 border-navy-deep font-black uppercase tracking-widest transition-all brutal-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0_0_#020617] transform -skew-x-6 group"
        >
          <span className="transform skew-x-6 flex items-center gap-2">Nos Partenaires</span>
        </Link>
      </div>
    </section>
  );
}
