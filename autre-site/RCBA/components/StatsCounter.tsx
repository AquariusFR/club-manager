'use client';

import { useEffect, useRef, useState } from 'react';
import { Trophy, History, Handshake, Users2, Star, Activity, Zap } from 'lucide-react';

interface Stat {
  label: string;
  val: number;
  icon: 'trophy' | 'history' | 'handshake' | 'users' | 'star' | 'activity' | 'zap';
  color: 'gold' | 'blue' | 'green' | 'purple';
  sub?: string;
}

const colorMap = {
  gold:   { iconText: 'text-navy-deep', iconBg: 'bg-gold',        border: 'border-navy-deep' },
  blue:   { iconText: 'text-white',     iconBg: 'bg-blue-600',    border: 'border-navy-deep' },
  green:  { iconText: 'text-navy-deep', iconBg: 'bg-pitch-green', border: 'border-navy-deep' },
  purple: { iconText: 'text-white',     iconBg: 'bg-purple-600',  border: 'border-navy-deep' },
};

const iconMap = {
  trophy:    Trophy,
  history:   History,
  handshake: Handshake,
  users:     Users2,
  star:      Star,
  activity:  Activity,
  zap:       Zap,
};

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const startVal = 0;

    function step(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(startVal + (target - startVal) * eased));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration, start]);
  
  return count;
}

function StatCard({ stat, delay }: { stat: Stat; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(stat.val, 1800, visible);
  const colors = colorMap[stat.color];
  const Icon = iconMap[stat.icon];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-card bg-white border-4 border-navy-deep p-6 md:p-8 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-2 hover:-translate-x-2 shadow-[8px_8px_0_0_rgba(10,25,47,1)] hover:shadow-[12px_12px_0_0_rgba(10,25,47,1)]`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-none ${colors.iconBg} border-4 ${colors.border} flex items-center justify-center ${colors.iconText} mb-5 group-hover:scale-110 transition duration-300 transform -skew-x-6`}>
        <Icon size={26} className="transform skew-x-6" />
      </div>

      {/* Number */}
      <div className="text-4xl md:text-5xl font-black leading-none mb-2 athletic-title italic tabular-nums text-navy-deep">
        {count}
        {stat.label === 'Licenciés' && <span className="text-2xl">+</span>}
      </div>

      {/* Label */}
      <div className="bg-navy-deep text-white px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] transition-colors leading-relaxed transform -skew-x-6 mt-1">
        <span className="block transform skew-x-6">{stat.label}</span>
      </div>

      {/* Sub label */}
      {stat.sub && (
        <div className="text-[9px] font-black uppercase tracking-widest text-navy-deep/60 mt-3 italic">
          {stat.sub}
        </div>
      )}
    </div>
  );
}

export default function StatsCounter({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <StatCard key={i} stat={stat} delay={i * 80} />
      ))}
    </div>
  );
}
