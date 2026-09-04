import { 
  Users2, 
  ShieldCheck, 
  Building2, 
  LucideIcon, 
  LayoutDashboard, 
  Target, 
  Calendar, 
  TrendingUp, 
  ShieldAlert, 
  FileText, 
  Beer, 
  Heart,
  Cpu,
  Share2,
  Palette,
  ShoppingBag
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

export interface PortalConfig {
  role: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  border: string;
  bg: string;
  dot: string;
  accent: string;
  node: string;
  defaultUsername: string;
  navItems: NavItem[];
}

export const PORTALS: Record<string, PortalConfig> = {
  parents: {
    role: "parents",
    label: "Portail Joueur ou Parent",
    desc: "Suivi Équipe & Convocations",
    icon: Users2,
    color: "text-sky-400",
    border: "border-sky-400/20 hover:border-sky-400/50",
    bg: "bg-sky-500/10",
    dot: "bg-sky-400",
    accent: "sky-500",
    node: "Espace Adhérents & Familles",
    defaultUsername: "parent",
    navItems: [
      { name: 'Espace Famille', href: '/parents/dashboard', icon: Heart },
      { name: 'Rapports Matchs', href: '/parents/reports', icon: FileText },
      { name: 'Calendrier', href: '/parents/calendar', icon: Calendar },
    ]
  },
  coach: {
    role: "coach",
    label: "Portail Coach & Éducateur",
    desc: "Gestion Sportive & Entraînements",
    icon: ShieldCheck,
    color: "text-pitch-green",
    border: "border-pitch-green/20 hover:border-pitch-green/50",
    bg: "bg-pitch-green/10",
    dot: "bg-pitch-green",
    accent: "pitch-green",
    node: "Encadrement Sportif & Équipes",
    defaultUsername: "coach",
    navItems: [
      { name: 'Tableau de Bord', href: '/coach/dashboard', icon: LayoutDashboard },
      { name: 'Séquences', href: '/coach/training', icon: Target },
      { name: 'Convocations', href: '/coach/convocations', icon: Calendar },
      { name: 'Effectif', href: '/coach/players', icon: Users2 },
    ]
  },
  direction: {
    role: "direction",
    label: "Portail Direction",
    desc: "Administration & Pilotage Global",
    icon: Building2,
    color: "text-gold",
    border: "border-gold/20 hover:border-gold/50",
    bg: "bg-gold/10",
    dot: "bg-gold",
    accent: "gold",
    node: "Comité de Direction RCBA",
    defaultUsername: "admin",
    navItems: [
      { name: 'Portail Direction', href: '/direction/dashboard', icon: TrendingUp },
      { name: 'Gestion Licences', href: '/direction/licences', icon: ShieldAlert },
      { name: 'Gestion Staff', href: '/direction/staff', icon: Users2 },
      { name: 'Finances & Buvette', href: '/direction/buvette', icon: Beer },
      { name: 'Logistique & Équipements', href: '/direction/logistique', icon: Cpu },
      { name: 'Réseaux Sociaux', href: '/direction/social', icon: Share2 },
      { name: 'Boutique', href: '/direction/boutique', icon: ShoppingBag },
      { name: 'Studio Créatif', href: '/direction/studio', icon: Palette },
    ]
  },
};

export const PORTAL_LIST = Object.values(PORTALS);
