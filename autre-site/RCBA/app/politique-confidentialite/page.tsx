import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Politique de Confidentialité | RCBA — Racing Club Bû Abondant",
  description: "Politique de confidentialité et protection des données personnelles (RGPD) du Racing Club Bû Abondant (RCBA).",
};

export default async function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-navy-deep text-white flex flex-col font-sans">
      <main className="flex-grow pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Fil d'Ariane / Retour Accueil */}
        <div className="flex items-center gap-2 mb-8 text-xs font-black uppercase tracking-widest text-white/50">
          <Link href="/" className="hover:text-gold transition-colors flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
            ← Accueil
          </Link>
          <span>/</span>
          <span className="text-gold">Politique de Confidentialité</span>
        </div>

        <h1 className="athletic-title text-4xl md:text-5xl italic text-white mb-8 text-center uppercase tracking-tighter">
          POLITIQUE DE <span className="text-gold">CONFIDENTIALITÉ</span>
        </h1>
        
        <div className="bg-navy-light/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 space-y-8 shadow-2xl">
          
          <section>
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
              1. Introduction
            </h2>
            <div className="text-gray-300 space-y-2 leading-relaxed">
              <p>
                Le Racing Club Bû Abondant (RCBA) accorde une grande importance à la protection de vos données personnelles. La présente politique vise à vous informer de la manière dont nous collectons, utilisons et protégeons vos données dans le cadre de votre utilisation de notre plateforme.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
              2. Données Collectées
            </h2>
            <div className="text-gray-300 space-y-2 leading-relaxed">
              <p>Nous pouvons collecter les données suivantes :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Données d'identification :</strong> Nom, prénom, adresse, date de naissance.</li>
                <li><strong>Coordonnées :</strong> Adresse email, numéro de téléphone.</li>
                <li><strong>Données sportives :</strong> Équipe, statistiques, suivis de performance et présence.</li>
                <li><strong>Données de connexion :</strong> Logs de connexion au portail.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
              3. Finalités du Traitement
            </h2>
            <div className="text-gray-300 space-y-2 leading-relaxed">
              <p>Vos données sont traitées pour les finalités suivantes :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Gestion administrative des membres et des licences.</li>
                <li>Gestion sportive (convocations, suivi des présences, évaluations).</li>
                <li>Communication entre le club, les joueurs, et les parents.</li>
                <li>Sécurisation des accès aux portails dédiés (Direction, Coach, Parents).</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
              4. Durée de Conservation
            </h2>
            <div className="text-gray-300 space-y-2 leading-relaxed">
              <p>
                Vos données personnelles sont conservées pendant la durée strictement nécessaire à la gestion de la relation avec le club, augmentée des délais de prescription légale. À l'issue de votre adhésion, vos données sont supprimées ou anonymisées à des fins statistiques.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
              5. Sécurité des Données
            </h2>
            <div className="text-gray-300 space-y-2 leading-relaxed">
              <p>
                Le RCBA met en œuvre toutes les mesures techniques et organisationnelles appropriées pour assurer la sécurité, l'intégrité et la confidentialité de vos données, notamment par le chiffrement des mots de passe et le contrôle des accès stricts aux portails.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gold mb-4 flex items-center">
              6. Vos Droits
            </h2>
            <div className="text-gray-300 space-y-2 leading-relaxed">
              <p>
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données. Pour exercer ces droits, vous pouvez contacter le club à l'adresse suivante : <strong>contact@rcba.fr</strong>.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
