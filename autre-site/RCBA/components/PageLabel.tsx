import Image from "next/image";
import { Shield, Trophy, Activity, Users, Euro, FileText, MapPin, LayoutDashboard, UserCheck, TrendingUp, Zap, Cpu } from "lucide-react";

interface PageLabelProps {
  section: string;
  category: string;
  title: string;
  subtitle?: React.ReactNode;
  icon?: "club" | "equipes" | "inscription" | "staff" | "tarifs" | "docs" | "stade" | "dashboard" | "parent" | "direction" | "live" | "tactical" | "coach" | "activity";
  variant?: "gold" | "green" | "purple" | "blue";
  showLogo?: boolean;
}

const iconMap = {
  club: Shield,

  equipes: Activity,
  inscription: FileText,
  staff: Users,
  tarifs: Euro,
  docs: FileText,
  stade: MapPin,
  dashboard: LayoutDashboard,
  parent: UserCheck,
  direction: TrendingUp,
  live: Zap,
  tactical: Cpu,
  coach: Zap,
  activity: Activity
};

const variantStyles = {
  gold: {
    bg: "bg-gold/10",
    border: "border-gold/20",
    text: "text-gold",
    glow: "shadow-[0_0_15px_rgba(212,175,55,0.3)]",
    line: "from-gold",
    title: "text-gold"
  },
  green: {
    bg: "bg-pitch-green/10",
    border: "border-pitch-green/20",
    text: "text-pitch-green",
    glow: "shadow-[0_0_15px_rgba(0,255,65,0.3)]",
    line: "from-pitch-green",
    title: "text-pitch-green"
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    text: "text-purple-400",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    line: "from-purple-500",
    title: "text-purple-400"
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    line: "from-blue-500",
    title: "text-blue-400"
  }
};

export default function PageLabel({ 
  section, 
  category, 
  title, 
  subtitle, 
  icon,
  variant = "gold",
  showLogo = false,
}: PageLabelProps) {
  const Icon = icon ? iconMap[icon] : Shield;
  const styles = variantStyles[variant];

  // Helper to render colored title
  const renderTitle = () => {
    const words = title.split(' ');
    // Handle titles with odd/even words to alternate colors
    return words.map((word, i) => (
      <span key={i} className={i % 2 === 1 ? styles.title : "text-white"}>
        {word}{' '}
      </span>
    ));
  };

  return (
    <header className="mb-16 md:mb-24 animate-in fade-in slide-in-from-top-4 duration-1000">
      {/* Premium Badge Label */}
      <div className="flex items-center gap-6 mb-10 group/label">
        <div className={`flex items-center gap-4 px-5 py-2 rounded-full ${styles.bg} border ${styles.border} backdrop-blur-xl ${styles.glow} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
          <Icon size={16} className={`${styles.text} animate-pulse shadow-gold`} />
          <div className="flex flex-col">
            <span className={`text-[8px] font-black uppercase tracking-[0.5em] ${styles.text} opacity-50 italic leading-none mb-1`}>
              {section} / {category}
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/40 italic">Saison 2025-2026 • <span className="text-white/70">Club Officiel</span></span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {[1,2,3].map(i => (
            <div key={i} className={`h-1 w-8 rounded-full ${i === 1 ? 'bg-gold animate-pulse' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {/* Optional RCBA Logo between badge and title */}
      {showLogo && (
        <div className="mb-8 flex items-center gap-6">
          <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
            <Image
              src="/logo.png"
              alt="RCBA Logo"
              fill
              className="object-contain drop-shadow-[0_0_12px_rgba(212,175,55,0.3)]"
            />
          </div>
          <div className={`h-px flex-1 max-w-32 bg-gradient-to-r ${styles.line} to-transparent`} />
        </div>
      )}

      {/* Main Athletic Title */}
      <h1 className="text-5xl md:text-7xl lg:text-9xl font-black italic uppercase tracking-tighter athletic-title athletic-skew leading-[0.8] mb-10 text-white drop-shadow-2xl">
        {renderTitle()}
      </h1>


      {/* Description / Subtitle */}
      {subtitle && (
        <div className={`max-w-2xl border-l-[3px] ${variant === 'gold' ? 'border-gold' : variant === 'green' ? 'border-pitch-green' : variant === 'purple' ? 'border-purple-500' : 'border-blue-500'} pl-10 mt-12 bg-white/[0.01] py-4 rounded-r-3xl`}>
          <p className="text-xl md:text-2xl text-white italic leading-tight font-black uppercase tracking-tight athletic-title athletic-skew pr-6">
            <span className="text-gold/60 mr-2">{">"}</span> {subtitle}
          </p>
        </div>
      )}

      {/* Decorative segment line */}
      <div className="mt-16 flex items-center gap-2">
        <div className={`w-32 h-1.5 bg-gradient-to-r ${styles.line} to-transparent rounded-full shadow-glow`} />
        <div className="w-2 h-2 rounded-full bg-white/20" />
        <div className="w-2 h-2 rounded-full bg-white/10" />
      </div>
    </header>
  );
}
