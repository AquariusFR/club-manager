import type { Metadata } from "next";
import { Outfit, Inter, Permanent_Marker } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import AuraNavbar from "@/components/AuraNavbar";
import GlobalTicker from "@/components/GlobalTicker";
import { getSession } from "@/lib/authentication";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-paint",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | RCBA — Racing Club Bû Abondant",
    default: "Racing Club Bû Abondant | Portail Officiel",
  },
  description: "Portail officiel du Racing Club Bû Abondant — Club de football amateur fondé en 2020. 17 équipes, 450 licenciés. Résultats, effectifs, espace membres.",
  keywords: ["RCBA", "Racing Club Bû Abondant", "football amateur", "Eure-et-Loir", "Bû", "Abondant", "District D3"],
  authors: [{ name: "Racing Club Bû Abondant" }],
  creator: "RCBA",
  metadataBase: new URL("https://rcba.fr"),
  manifest: "/manifest.json",
  openGraph: {
    title: "Racing Club Bû Abondant",
    description: "Club de football amateur fondé en 2020. 17 équipes, 450 licenciés. Excellence sportive et valeurs humaines.",
    siteName: "RCBA",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Racing Club Bû Abondant",
    description: "Club de football amateur — Eure-et-Loir — Saison 2025-2026",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${inter.variable} ${permanentMarker.variable} h-full antialiased tabular-nums`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "SportsClub",
                  "@id": "https://rcba.fr/#club",
                  "name": "Racing Club Bû Abondant",
                  "alternateName": "RCBA",
                  "url": "https://rcba.fr",
                  "logo": "https://rcba.fr/logo.png",
                  "image": "https://rcba.fr/stadium-bg.png",
                  "description": "Club de football amateur en Eure-et-Loir (28), fondé en 2020. 17 équipes, 450 licenciés, Label Jeunes FFF Bronze et Label Féminines FFF Bronze.",
                  "foundingDate": "2020",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Bû",
                    "postalCode": "28410",
                    "addressRegion": "Eure-et-Loir",
                    "addressCountry": "FR"
                  },
                  "sport": "Football",
                  "knowsLanguage": ["fr-FR"]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://rcba.fr/#website",
                  "url": "https://rcba.fr",
                  "name": "Racing Club Bû Abondant",
                  "description": "Portail officiel du Racing Club Bû Abondant (RCBA)",
                  "publisher": {
                    "@id": "https://rcba.fr/#club"
                  },
                  "inLanguage": "fr-FR"
                }
              ]
            })
          }}
        />
      </head>
      <body className={`min-h-full flex flex-col bg-navy-deep text-white relative selection:bg-pitch-green/30 selection:text-white`}>
        {/* Global Matrix Atmosphere */}
        <div className="fixed inset-0 pointer-events-none -z-50 overflow-hidden">
          {/* Global Scanline Sweep */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none hud-scanline" />
        </div>

        {/* Global Announcements */}
        <GlobalTicker />

        {/* Navbar commune à toutes les pages — portail inclus */}
        <AuraNavbar session={session} />

        {/* Corps principal — flex-1 pour que les portails avec sidebar puissent s'étirer */}
        <div className="flex flex-col flex-1 overflow-x-hidden">
          {children}
        </div>

        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
