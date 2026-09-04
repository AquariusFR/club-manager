import Link from "next/link";
import { 
  Users2, 
  ShieldCheck, 
  ChevronRight, 
  Trophy, 
  TrendingUp,
  Activity,
  History,
  Handshake,
  Lock,
  Star,
  Shield,
  MapPin,
  Calendar,
  ChevronDown,
  Flame,
  Target,
  Zap
} from "lucide-react";
import Image from "next/image";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import StatsCounter from "@/components/StatsCounter";
import IntelligencePulse from "@/components/IntelligencePulse";
import Hero from "@/components/home/Hero";
import PartnersMarquee from "@/components/home/PartnersMarquee";
import BoutiqueTeaser from "@/components/home/BoutiqueTeaser";
import HomeFooter from "@/components/home/HomeFooter";
import RecruitmentBanner from "@/components/RecruitmentBanner";
import MatchShowcase from "@/components/MatchShowcase";
import FacebookFeed from "@/components/home/FacebookFeed";
import NewsHeroBand from "@/components/home/NewsHeroBand";
import LegendOfTheMonth from "@/components/home/LegendOfTheMonth";
import Palmares from "@/components/home/Palmares";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import * as motion from "framer-motion/client";

export const metadata: Metadata = {
  title: "Racing Club Bû Abondant | Portail Officiel RCBA",
  description: "Bienvenue sur le portail officiel du Racing Club Bû Abondant — Club fondé en 2020, 17 équipes, 450 licenciés. Résultats, effectifs et espace membres.",
  openGraph: {
    title: "Racing Club Bû Abondant — RCBA",
    description: "Club de football amateur fondé en 2020. 17 équipes, 450 licenciés. L'excellence sportive et les valeurs humaines.",
    type: "website",
    locale: "fr_FR",
  },
};

export default async function PortalLanding() {
  const db = await getDb();
  const session = await getSession();
  
  if (session) {
    if (session.roleName.toLowerCase() === 'admin') redirect('/direction/dashboard');
    if (session.roleName === 'Développeur') redirect('/dev');
    if (session.roleName === 'Direction') redirect('/direction/dashboard');
    if (session.roleName === 'Coach') redirect('/coach/dashboard');
    if (session.roleName === 'Parent' || session.roleName === 'Joueur') redirect('/parents/dashboard');
  }
  
  const yearsHistory = new Date().getFullYear() - 2020;

  // Fetch stats sequentially to avoid SQLite locking
  const playerCount = await db.get<{ count: number }>("SELECT COUNT(*) as count FROM Joueurs").catch(() => ({ count: 450 }));
  
  const recentResults = await db.all<import("@/lib/types").Resultat[]>(`
    SELECT r.*, e.nom as equipe_nom
    FROM Resultats r
    LEFT JOIN Equipes e ON r.equipe_id = e.id
    ORDER BY r.id DESC
    LIMIT 8
  `).catch(() => []);

  const upcomingMatches = await db.all<import("@/lib/types").CalendrierMatch[]>(`
    SELECT c.*, e.nom as equipe_nom
    FROM CalendrierMatchs c
    LEFT JOIN Equipes e ON c.equipe_id = e.id
    WHERE c.statut = 'A_VENIR'
    ORDER BY c.date ASC
    LIMIT 8
  `).catch(() => []);

  // Use any[] since teams.json structure isn't strictly defined yet
  const teamsData = await import("@/data/teams.json").then(m => m.default).catch(() => [] as any[]);
  const topTeams = teamsData.filter((t: any) => 
    ['senior', 'u18', 'veteran', 'u15'].includes(t.id)
  );

  // Real data for News
  const realNews = await db.all<any>(`
    SELECT id, titre, date, type as categorie, contenu as extrait, source as image_url 
    FROM IntelligenceFeed 
    WHERE type IN ('news', 'actualite', 'info') 
    ORDER BY date DESC LIMIT 5
  `).catch(() => []);

  // Real data for Legend
  let realLegend = await db.get<any>(`
    SELECT j.prenom, j.nom, j.photo_url, j.poste, e.nom as equipe_nom
    FROM Joueurs j
    LEFT JOIN Equipes e ON j.equipe_id = e.id
    WHERE j.photo_url IS NOT NULL
    ORDER BY RANDOM() LIMIT 1
  `).catch(() => null);

  if (!realLegend) {
    realLegend = await db.get<any>(`
      SELECT j.prenom, j.nom, j.photo_url, j.poste, e.nom as equipe_nom
      FROM Joueurs j
      LEFT JOIN Equipes e ON j.equipe_id = e.id
      ORDER BY RANDOM() LIMIT 1
    `).catch(() => null);
  }

  return (
    <div className="flex-1 flex flex-col items-center bg-transparent relative font-body text-white">

      <Hero yearsHistory={yearsHistory} />

      <section className="w-full max-w-7xl z-10 px-6 pb-16 md:pb-24 flex-1 relative flex flex-col items-center">

        <StatsCounter 
          stats={[
            { label: "Équipes",           val: 17,          icon: "trophy",   color: "gold" },
            { label: "Années d'Histoire", val: yearsHistory, icon: "history",  color: "blue",  sub: "Fusionné 2020" },
            { label: "Partenaires",       val: 12,          icon: "handshake",color: "green" },
            { label: "Licenciés",         val: playerCount?.count || 450, icon: "users", color: "purple" },
          ]}
        />

        <FacebookFeed />

        <MatchShowcase 
          upcomingMatches={upcomingMatches.map(m => {
            const dateObj = new Date(m.date);
            const isHome = m.domicile?.includes('Bû') || m.domicile?.includes('RCBA');
            return {
              id: m.id,
              date: m.date,
              heure: !isNaN(dateObj.getTime()) ? dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '15:00',
              equipe_nom: m.equipe_nom || 'Séniors A',
              adversaire: isHome ? m.exterieur : m.domicile,
              lieu: isHome ? 'Domicile' : 'Extérieur',
              statut: m.statut
            };
          })} 
          recentResults={recentResults.map(r => {
            const scoreParts = r.score ? r.score.split('-') : [];
            // Extract time from date string if available, otherwise show em-dash
            const dateObj = new Date(r.date);
            const heureExtracted = !isNaN(dateObj.getTime())
              ? dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
              : '—';
            return {
              id: r.id,
              date: r.date,
              heure: heureExtracted,
              equipe_nom: r.equipe_nom || 'Séniors A',
              adversaire: r.adversaire,
              lieu: '—',
              statut: r.statut,
              score_equipe: scoreParts.length === 2 ? parseInt(scoreParts[0], 10) : undefined,
              score_adversaire: scoreParts.length === 2 ? parseInt(scoreParts[1], 10) : undefined
            };
          })} 
        />

        <NewsHeroBand news={realNews} />
        
        <LegendOfTheMonth legend={realLegend || null} />

        <Palmares 
          items={[
            { id: 1, titre: "Label Jeunes FFF", competition: "Fédération Française de Football", saison: "2023 - 2026", medaille: "🥉" },
            { id: 2, titre: "Label Féminines FFF", competition: "Fédération Française de Football", saison: "2023 - 2026", medaille: "🥉" },
            { id: 3, titre: "Accession en R2 Ligue", competition: "U18 — Championnat District D1", saison: "2024 - 2025", medaille: "🏆" },
            { id: 4, titre: "Accession en D3 District", competition: "Seniors — Championnat District D4", saison: "2023 - 2024", medaille: "🏆" },
          ]} 
        />

        <BoutiqueTeaser />
        <PartnersMarquee />

        {/* ════════════════════════════════════════════════════════════════════════
            🛡️ PREMIUM FOOTER
        ════════════════════════════════════════════════════════════════════════ */}
        <HomeFooter />
      </section>
    </div>
  );
}
