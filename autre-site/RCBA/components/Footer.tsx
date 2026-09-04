import React from 'react';
import Link from 'next/link';
import { Shield, Users, Mail, MapPin, Phone } from 'lucide-react';

const FacebookIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-navy-deep border-t border-white/10 pt-16 pb-8 mt-auto z-40 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-gold/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Logo & Info */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link 
              href="/" 
              className="flex items-center gap-4 mb-6 group rounded-2xl focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
              aria-label="Accueil - Racing Club Bû Abondant"
            >
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center p-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-gold/40 transition duration-500">
                <img src="/logo.png" alt="RCBA - Racing Club Bû Abondant" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div>
                <h3 className="font-black text-2xl text-white italic uppercase tracking-tighter font-display leading-[0.8] group-hover:text-gold transition-colors">
                  BÛ <span className="text-gold">ABONDANT</span>
                </h3>
                <p className="text-[10px] font-black uppercase text-white/50 tracking-[0.3em] mt-2">
                  Racing Club Bû Abondant
                </p>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-sm">
              Club de football familial et formateur en Eure-et-Loir (28). Labellisé FFF Jeunes & Féminines, 17 équipes engagées de l&apos;école de foot aux Vétérans.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/RacingClubBuAbondant" target="_blank" rel="noreferrer" aria-label="Page Facebook officielle du RCBA" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none">
                <FacebookIcon size={18} />
              </a>
              <a href="https://rcba.footeo.com/" target="_blank" rel="noreferrer" aria-label="Site Footeo Officiel du RCBA" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition text-xs font-black focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none">
                FF
              </a>
            </div>
          </div>

          {/* Navigation - Le Club */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <Shield size={16} className="text-gold" /> Le Club
            </h4>
            <ul className="space-y-3">
              <li><Link href="/club/presentation" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">Présentation</Link></li>
              <li><Link href="/club/organigramme" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">Organigramme</Link></li>
              <li><Link href="/club/dirigeants" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">Les Dirigeants</Link></li>
              <li><Link href="/club/horaires" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">Horaires</Link></li>
              <li><Link href="/club/charte" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">La Charte</Link></li>
              <li><Link href="/club/reglement" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">Règlement</Link></li>
            </ul>
          </div>

          {/* Navigation - Équipes & Inscription */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <Users size={16} className="text-gold" /> Équipes & Inscription
            </h4>
            <ul className="space-y-3 mb-8">
              <li><Link href="/equipes/1" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">Séniors</Link></li>
              <li><Link href="/equipes/3" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">Jeunes</Link></li>
              <li><Link href="/equipes/9" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">Féminines</Link></li>
              <li><Link href="/equipes/17" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">École de Foot</Link></li>
            </ul>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-4">Adhésion</h4>
            <ul className="space-y-3">
              <li><Link href="/club/tarifs" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">Tarifs & Licences</Link></li>
              <li><Link href="/club/paiement" className="text-white/60 hover:text-gold text-sm transition-colors flex items-center gap-2 before:content-[''] before:w-1 before:h-1 before:bg-gold/50 before:rounded-full hover:before:bg-gold">Paiement</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <Mail size={16} className="text-gold" /> Contact & Stades
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold/70 shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">Stade Municipal de Bû<br />& Stade d&apos;Abondant (28410)</span>
              </li>
              <li className="flex items-center gap-3">
                <Shield size={18} className="text-gold/70 shrink-0" />
                <span className="text-white/60 text-sm">Affiliation FFF N° 582697</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-gold/70 shrink-0" />
                <span className="text-white/60 text-sm">582697@lcfoot.fr</span>
              </li>
            </ul>
            <div className="mt-8">
              <Link href="/boutique" className="inline-block w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-center text-white/80 font-black uppercase tracking-widest text-xs hover:bg-gold hover:text-navy-deep hover:border-gold transition duration-300">
                Boutique / Équipements
              </Link>
            </div>
            <div className="mt-4">
              <Link href="/club/partenaires" className="inline-block w-full py-3 px-4 bg-gold/10 border border-gold/30 rounded-xl text-center text-gold font-black uppercase tracking-widest text-xs hover:bg-gold hover:text-navy-deep transition duration-300">
                Nos Partenaires
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/40 text-xs font-medium">
            &copy; {currentYear} Racing Club Bû Abondant. Tous droits réservés.
          </div>
          <div className="flex space-x-6 text-xs font-medium">
            <Link href="/mentions-legales" className="text-white/40 hover:text-gold transition-colors">
              Mentions Légales
            </Link>
            <Link href="/politique-confidentialite" className="text-white/40 hover:text-gold transition-colors">
              Confidentialité
            </Link>
            <Link href="/club/contact" className="text-white/40 hover:text-gold transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
