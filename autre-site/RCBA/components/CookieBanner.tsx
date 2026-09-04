'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('rcba_cookie_consent');
    if (!consent) {
      setTimeout(() => setShowBanner(true), 0);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('rcba_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('rcba_cookie_consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-navy-light border-t border-orange-light/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-gray-300 text-sm sm:text-base flex-1">
          <p>
            En poursuivant votre navigation sur ce site, vous acceptez l'utilisation de cookies pour vous proposer des services et offres adaptés à vos centres d'intérêts et réaliser des statistiques de visites. 
            <Link href="/politique-confidentialite" className="text-orange-light hover:text-orange-dark ml-2 underline">
              En savoir plus
            </Link>
          </p>
        </div>
        <div className="flex flex-row gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={declineCookies}
            className="flex-1 sm:flex-none px-4 py-2 border border-white/20 text-white rounded hover:bg-white/10 transition-colors text-sm font-medium"
          >
            Refuser
          </button>
          <button
            onClick={acceptCookies}
            className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-orange-light to-orange-dark text-white rounded hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(255,165,0,0.4)] text-sm font-medium"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
