import Link from "next/link";
import { Shield, Target, Zap, ChevronRight } from "lucide-react";

export default function ThreePillars() {
  const pillars = [
    {
      icon: Shield,
      title: "Valeurs",
      color: "text-gold",
      bg: "bg-gold/10",
      border: "border-gold/20",
      body: "Respect, solidarité, fair-play. Le RCBA construit des champions sur et en dehors du terrain depuis 2020.",
      href: "/club/presentation"
    },
    {
      icon: Target,
      title: "Excellence",
      color: "text-pitch-green",
      bg: "bg-pitch-green/10",
      border: "border-pitch-green/20",
      body: "17 équipes, de l'École de Football aux Vétérans. Un programme complet pour tous les âges et tous les niveaux.",
      href: "/equipes"
    },
    {
      icon: Zap,
      title: "Innovation",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
      body: "Portail digital, suivi des performances, gestion des licences. Le RCBA de demain se construit aujourd'hui.",
      href: "/marketing"
    },
  ];

  return (
    <section className="mt-32 grid md:grid-cols-3 gap-8">
      {pillars.map((pillar, i) => (
        <Link 
          key={i}
          href={pillar.href}
          className={`group glass-card glass-shine p-10 border ${pillar.border} hover:-translate-y-1 active:scale-[0.96] hover:shadow-2xl transition duration-300 relative overflow-hidden`}
        >
          <div className={`w-14 h-14 rounded-2xl ${pillar.bg} border ${pillar.border} flex items-center justify-center ${pillar.color} mb-6 group-hover:scale-110 transition-transform`}>
            <pillar.icon size={26} />
          </div>
          <h3 className="athletic-title text-2xl italic mb-4 group-hover:text-white transition-colors">{pillar.title}</h3>
          <p className="text-white/80 text-sm leading-relaxed group-hover:text-white/70 transition-colors mb-6">{pillar.body}</p>
          <div className={`flex items-center gap-2 ${pillar.color} text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition translate-x-[-10px] group-hover:translate-x-0`}>
            Découvrir <ChevronRight size={14} />
          </div>
        </Link>
      ))}
    </section>
  );
}
