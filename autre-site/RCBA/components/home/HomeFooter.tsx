"use client";

import Link from "next/link";
import { ChevronRight, MapPin, Mail, Phone, Share2, Camera, Video, ArrowUp, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut de page"
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-pitch-green border-4 border-navy-deep text-navy-deep flex items-center justify-center shadow-[4px_4px_0_0_#145014] hover:bg-white hover:translate-y-1 hover:translate-x-1 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <ArrowUp size={24} strokeWidth={3} />
    </button>
  );
}

const SOCIAL_LINKS = [
  { href: "https://www.facebook.com/RacingClubBuAbondant", label: "Facebook RCBA", icon: Share2 },
  { href: "https://rcba.footeo.com", label: "Footeo Officiel RCBA", icon: Trophy },
];

export default function HomeFooter() {
  return (
    <>
      <BackToTop />

      <footer className="mt-40 border-t-8 border-pitch-green bg-navy relative overflow-hidden">
        {/* Top decorative slash overlay */}
        <div className="absolute inset-0 slash-overlay opacity-50 pointer-events-none" />

        {/* ─── Main Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-8 md:px-12 pt-16 pb-12">

          {/* Col 1 — Club Identity */}
          <div className="sm:col-span-2 lg:col-span-1 relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <img src="/logo.png" alt="RCBA" className="w-12 h-12 object-contain" />
              <div>
                <div className="athletic-title text-2xl italic text-white">RCBA</div>
                <div className="text-[10px] font-black uppercase tracking-[0.35em] text-pitch-green">Racing Club Bû Abondant</div>
              </div>
            </div>

            <p className="text-white text-sm leading-relaxed font-black uppercase tracking-wider mb-6 border-l-4 border-pitch-green pl-4 italic">
              Né de la fusion en 2020, le RCBA cultive l'excellence sportive et les valeurs humaines sur chaque terrain.
            </p>

            {/* Social Icons */}
            <div className="flex gap-2.5">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 bg-white border-2 border-navy-deep flex items-center justify-center text-navy-deep hover:bg-pitch-green hover:translate-y-1 hover:translate-x-1 transition-all duration-300 shadow-[2px_2px_0_0_#145014]"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Contact */}
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.35em] text-gold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-gold/60 mt-0.5 shrink-0" />
                <span className="text-white/50 text-xs leading-relaxed">
                  Route de Bû, 28410 Bû &<br />28410 Abondant, Eure-et-Loir
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-gold/60 shrink-0" />
                <a href="mailto:582697@lcfoot.fr" className="text-white/50 text-xs hover:text-gold transition-colors">
                  582697@lcfoot.fr
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={14} className="text-gold/60 shrink-0" />
                <span className="text-white/50 text-xs">Sur demande via le portail</span>
              </li>
            </ul>
          </div>

          {/* Col 3 — Navigation Rapide */}
          <div>
            <h4 className="text-[9px] font-black uppercase tracking-[0.35em] text-white/40 mb-6">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: "Le Club", href: "/club/presentation" },
                { label: "Nos Équipes", href: "/equipes" },
                { label: "Rejoindre le Club", href: "/rejoindre" },
                { label: "Nos Partenaires", href: "/club/partenaires" },
                { label: "Tarifs & Adhésion", href: "/club/tarifs" },
                { label: "Boutique", href: "/boutique" },
              ].map(l => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-gold transition-colors flex items-center gap-2 group"
                  >
                    <ChevronRight size={10} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Accès Portail */}
          <div className="relative z-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.35em] text-white mb-6 bg-navy-deep inline-block px-2 py-1 transform -skew-x-6">Espace Membres</h4>

            {/* Login CTA */}
            <div className="bg-white border-4 border-navy-deep p-5 mb-6 shadow-[4px_4px_0_0_#145014] transform -skew-x-6">
              <p className="text-[10px] font-black uppercase tracking-wider text-navy-deep mb-4 italic leading-relaxed transform skew-x-6">
                Portail sécurisé réservé<br />aux membres du club.
              </p>
              <Link
                href="/login"
                className="block text-center bg-navy-deep text-white px-4 py-3 text-[12px] font-black uppercase tracking-widest hover:bg-pitch-green hover:text-navy-deep transition duration-300 athletic-title italic transform skew-x-6 border-2 border-navy-deep"
              >
                Se Connecter
              </Link>
            </div>

            {/* Labels */}
            <div className="flex gap-2">
              <img src="/label-espoir.png" alt="Label Jeunes" className="h-10 w-auto object-contain opacity-60 hover:opacity-100 transition" />
              <img src="/label-feminine.png" alt="Label Féminines" className="h-10 w-auto object-contain opacity-60 hover:opacity-100 transition" />
            </div>
          </div>
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="border-t border-white/5 px-8 md:px-12 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em]">
              © {new Date().getFullYear()} Racing Club Bû Abondant — Fondé en 2020
            </p>
            <div className="flex items-center gap-6">
              {[
                { label: "Mentions légales", href: "/mentions-legales" },
                { label: "Confidentialité", href: "/politique-confidentialite" },
                { label: "Contact", href: "/contact" },
              ].map(l => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="text-[8px] font-black uppercase tracking-widest text-white/25 hover:text-white/60 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

