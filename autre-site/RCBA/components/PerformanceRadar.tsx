'use client';

import React from 'react';
import HudCorners from './HudCorners';
import { motion } from 'framer-motion';

interface PerformanceRadarProps {
  technique: number;
  tactique: number;
  physique: number;
  mental: number;
  size?: number;
}

export default function PerformanceRadar({ 
  technique, 
  tactique, 
  physique, 
  mental, 
  size = 280 
}: PerformanceRadarProps) {
  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const levels = [1, 2, 3, 4, 5];

  // Radar points calculation
  const getPoint = (val: number, angle: number) => {
    const r = (val / 5) * radius;
    const x = center + r * Math.cos(angle - Math.PI / 2);
    const y = center + r * Math.sin(angle - Math.PI / 2);
    return `${x},${y}`;
  };

  const points = [
    getPoint(technique, 0),
    getPoint(tactique, Math.PI / 2),
    getPoint(physique, Math.PI),
    getPoint(mental, (3 * Math.PI) / 2)
  ].join(' ');

  const labels = [
    { text: 'Technique', x: center, y: center - radius - 25, color: 'fill-gold' },
    { text: 'Tactique', x: center + radius + 35, y: center, color: 'fill-sky-400' },
    { text: 'Physique', x: center, y: center + radius + 30, color: 'fill-pitch-green' },
    { text: 'Mental', x: center - radius - 35, y: center, color: 'fill-rose-400' }
  ];

  return (
    <div className="relative flex items-center justify-center p-8 bg-white/[0.01] rounded-[2.5rem] border border-white/5 shadow-3xl overflow-hidden group hud-grain glass-edge-highlight">
      <HudCorners color="#d4af37" opacity={0.1} />
      
      {/* Background Holographic Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-pitch-green/5 opacity-40 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
      
      <svg width={size} height={size} className="relative z-10 drop-shadow-glow">
        {/* Radar Rings (Concentric HUD Rings) */}
        {levels.map(l => (
          <circle
            key={l}
            cx={center}
            cy={center}
            r={(l/5)*radius}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            strokeOpacity="0.05"
            strokeDasharray={l === 5 ? "0" : "4 4"}
          />
        ))}

        {/* Diagonal Axes */}
        <line x1={center - radius} y1={center - radius} x2={center + radius} y2={center + radius} stroke="white" strokeOpacity="0.03" strokeWidth="1" />
        <line x1={center + radius} y1={center - radius} x2={center - radius} y2={center + radius} stroke="white" strokeOpacity="0.03" strokeWidth="1" />

        {/* Major Axes */}
        <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="white" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="2 2" />
        <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="white" strokeOpacity="0.1" strokeWidth="1" strokeDasharray="2 2" />

        {/* Data Polygon */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          points={points}
          fill="url(#radarGradient)"
          fillOpacity="0.25"
          stroke="url(#strokeGradient)"
          strokeWidth="3"
          strokeLinejoin="round"
          filter="drop-shadow(0 0 10px rgba(212, 175, 55, 0.4))"
        />

        {/* Data Points (Glowing beads) */}
        {[technique, tactique, physique, mental].map((val, i) => {
          const p = getPoint(val, (i * Math.PI) / 2).split(',');
          return (
            <g key={i}>
              <circle
                cx={p[0]}
                cy={p[1]}
                r="6"
                className="fill-gold/20"
              />
              <circle
                cx={p[0]}
                cy={p[1]}
                r="3"
                className="fill-gold shadow-[0_0_15px_#d4af37]"
              />
            </g>
          );
        })}

        {/* Gradients */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* Labels Overlay */}
        {labels.map((l, i) => (
          <text
            key={i}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-[9px] font-black uppercase tracking-[0.2em] select-none ${l.color} opacity-60 group-hover:opacity-100 transition-opacity drop-shadow-glow italic`}
          >
            {l.text}
          </text>
        ))}
      </svg>
      
      {/* Central Indicator */}
      <div className="absolute inset-x-0 bottom-8 text-center">
        <div className="flex flex-col items-center gap-1">
          <div className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20 group-hover:text-gold/40 transition-colors duration-500 italic">
            TACTICAL ANALYSIS v4.0
          </div>
          <div className="w-12 h-[1px] bg-white/5 overflow-hidden">
            <motion.div 
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-gold/50"
            />
          </div>
        </div>
      </div>

      {/* Holographic Scanline (CSS version) */}
      <div className="absolute inset-x-0 h-10 bg-gold/5 blur-xl pointer-events-none animate-scanline opacity-20" />
    </div>
  );
}
