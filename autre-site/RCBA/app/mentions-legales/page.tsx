import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Mentions Légales | RCBA — Racing Club Bû Abondant",
  description: "Mentions légales du site officiel du Racing Club Bû Abondant (RCBA). Édition, hébergement et propriété intellectuelle.",
};

export default async function MentionsLegales() {
  return (
    <div className="min-h-screen bg-navy-deep text-white flex flex-col font-sans">
      <main className="flex-grow pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Fil d'Ariane / Retour Accueil */}
        <div className="flex items-center gap-2 mb-8 text-xs font-black uppercase tracking-widest text-white/50">
          <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            ← Accueil
          </Link>
          <span>/</span>
          <span className="text-gold">Mentions Légales</span>
        </div>

        <h1 className="athletic-title text-4xl md:text-5xl italic text-white mb-8 text-center uppercase tracking-tighter">
          MENTIONS <span className="text-gold">LÉGALES</span>
        </h1>
        
        <div className="bg-navy-light/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 space-y-8 shadow-2xl">
          
          <section>
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
              1. Éditeur du Site
            </h2>
            <div className="text-gray-300 space-y-2 leading-relaxed">
              <p><strong>Nom de l'association :</strong> Racing Club Bû Abondant (RCBA)</p>
              <p><strong>Statut :</strong> Association loi 1901 — Fondée en 2020</p>
              <p><strong>Communes :</strong> Bû & Abondant (Eure-et-Loir - 28)</p>
              <p><strong>Email :</strong> contact@rcba.fr</p>
              <p><strong>Directeur de la publication :</strong> Le Bureau Directeur du RCBA</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
              2. Hébergement
            </h2>
            <div className="text-gray-300 space-y-2 leading-relaxed">
              <p>Ce site est hébergé par une infrastructure cloud sécurisée.</p>
              <p><strong>Site Officiel :</strong> https://rcba.fr</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
              3. Propriété Intellectuelle
            </h2>
            <div className="text-gray-300 space-y-2 leading-relaxed">
              <p>
                L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les logos officiels et photographies du club.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans autorisation préalable.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
              4. Données Personnelles & RGPD
            </h2>
            <div className="text-gray-300 space-y-2 leading-relaxed">
              <p>
                Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données.
              </p>
              <p>
                Pour exercer ces droits, veuillez consulter notre <Link href="/politique-confidentialite" className="text-gold hover:underline transition-colors">Politique de Confidentialité</Link> ou nous contacter à contact@rcba.fr.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
