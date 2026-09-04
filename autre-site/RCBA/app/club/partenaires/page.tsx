import { Award, Globe, Cpu, Trophy, Star, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/authentication";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import PartnerModalTrigger from "@/components/PartnerModalTrigger";
import fs from "fs";
import path from "path";

interface Partner {
  name: string;
  tag: string;
  desc?: string;
  logo: string;
  link?: string;
  featured?: boolean;
  tier?: "principal" | "major" | "standard";
}
export default async function PartenairesPage() {
  const session = await getSession();

  const clubInfoPath = path.join(process.cwd(), "lib", "data", "club-info.json");
  const clubData = JSON.parse(fs.readFileSync(clubInfoPath, "utf8"));
  const partners: Partner[] = clubData.partners;

  return (
    <main className="min-h-screen bg-navy-deep text-white selection:bg-gold/30 pb-40 overflow-hidden relative">
      {/* ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[180px] opacity-40" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">

        {/* Fil d'Ariane / Retour Accueil */}
        <div className="flex items-center gap-2 mb-8 text-xs font-black uppercase tracking-widest text-white/50">
          <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            ← Accueil
          </Link>
          <span>/</span>
          <span className="text-gold">Partenaires</span>
        </div>

        {/* ─── HEADER ─── */}
        <div className="flex flex-col items-center text-center justify-center gap-6 mb-24 pb-16 border-b border-white/5 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gold/10 blur-[120px] pointer-events-none" />
          <HudCorners color="#d4af37" opacity={0.15} />
          <PageLabel
            section="STRUCTURE"
            category="PARTENARIAT & SPONSORING"
            title=""
            subtitle=""
            icon="club"
            variant="gold"
          />
          <h1 className="athletic-title text-5xl md:text-7xl italic text-white mt-4 tracking-tighter drop-shadow-glow">
            NOS <span className="text-gold">PARTENAIRES</span>
          </h1>
          <p className="text-white/60 max-w-2xl text-base md:text-lg italic font-medium mt-4">
            Ils nous font confiance et contribuent chaque jour à l'essor du Racing Club Bû Abondant. Un écosystème local solidaire et engagé vers la victoire.
          </p>
        </div>

        {/* ─── TOUS LES PARTENAIRES ─── */}
        {partners.length > 0 && (
          <section className="mb-32">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {partners.map((p, i) => (
                <div key={i} className="group relative glass-card border border-white/10 hover:border-gold/50 bg-white/[0.02] hover:bg-navy-light/60 rounded-[1.5rem] p-8 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_20px_50px_rgba(212,175,55,0.1)] hover:-translate-y-2 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-full h-40 flex items-center justify-center mb-6 p-6 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-colors duration-500 relative z-10">
                    <img
                      src={encodeURI(`${p.logo}?v=1`)}
                      alt={p.name}
                      className="max-w-full max-h-full object-contain opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 drop-shadow-lg"
                    />
                  </div>
                  <div className="relative z-10 w-full flex flex-col flex-1">
                    <div className="text-[9px] font-black uppercase tracking-[0.4em] text-gold/70 mb-2">{p.tag}</div>
                    <h3 className="text-xl font-black italic uppercase text-white athletic-title tracking-tight group-hover:text-gold transition-colors">{p.name}</h3>
                    {p.desc && <p className="text-sm text-white/50 italic leading-relaxed mt-3 flex-1">{p.desc}</p>}
                    
                    {p.link && (
                      <Link
                        href={p.link}
                        target="_blank"
                        className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-navy-deep hover:bg-gold hover:border-gold transition-all"
                      >
                        Visiter le site <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Tile Devenir Partenaire */}
            <div id="contact" className="mt-16 flex justify-center">
              <div className="w-full max-w-2xl">
                <PartnerModalTrigger />
              </div>
            </div>
          </section>
        )}

        {/* ─── RETOUR SUR INVESTISSEMENT B2B ─── */}
        <section className="relative py-24 border-y-4 border-gold bg-gold/5 mt-16 px-8 lg:px-16 transform -skew-y-2 brutal-shadow">
          <div className="transform skew-y-2">
            <div className="text-center mb-16">
              <h2 className="athletic-title text-4xl md:text-5xl italic text-white uppercase drop-shadow-glow">
                MAXIMISEZ VOTRE <span className="text-gold bg-navy-deep px-2">R.O.I.</span>
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto mt-6 text-lg italic">
                Devenir partenaire du RCBA n'est pas qu'un don, c'est un investissement stratégique dans un réseau local puissant, captif et engagé.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              {[
                { icon: Award, title: "AUDIENCE CAPTIVE", desc: "Touchez directement +500 familles de Bû et Abondant. Un public local, fidèle et attaché aux valeurs du club." },
                { icon: Globe, title: "RÉSEAU D'AFFAIRES", desc: "Intégrez le cercle des partenaires. Multipliez les opportunités B2B lors de nos événements VIP." },
                { icon: Cpu, title: "PRÉSENCE OMNICANAL", desc: "Votre marque sur nos maillots, le stade, et avec des dizaines de milliers d'impressions sur nos réseaux sociaux." },
              ].map((feat, i) => (
                <div key={i} className="group p-8 border-4 border-gold bg-navy-deep transition-all duration-300 hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0_0_#D4AF37]">
                  <div className="w-16 h-16 bg-gold text-navy-deep border-2 border-navy-deep flex items-center justify-center mb-6 transform -skew-x-6 shadow-[4px_4px_0_0_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform">
                    <feat.icon size={32} className="transform skew-x-6" />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-widest text-white italic mb-4">{feat.title}</h4>
                  <p className="text-sm text-white/60 italic leading-relaxed font-medium">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

