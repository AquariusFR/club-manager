'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HudCorners from './HudCorners';

interface TrendPoint {
  day: string;
  avg_intensity: number;
  avg_fatigue: number;
}

interface PerformanceTrendsChartProps {
  data: TrendPoint[];
  title?: string;
  variant?: 'gold' | 'green' | 'blue' | 'pitch';
  labels?: { intensity: string; fatigue?: string };
}

export default function PerformanceTrendsChart({ 
  data, 
  title = "FLUX DE PERFORMANCE (RPE)", 
  variant = 'gold',
  labels = { intensity: 'Intensité', fatigue: 'Fatigue' }
}: PerformanceTrendsChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  const width = 600;
  const height = 200;
  const padding = 40;

  if (!data || data.length < 2) {
    return (
      <div className="glass-card p-12 flex flex-col items-center justify-center min-h-[200px] border-white/5 bg-white/[0.01]">
        <HudCorners opacity={0.05} />
        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Data Insuffisante pour Visualisation</span>
      </div>
    );
  }

  // Calculate scales
  const maxIntensity = 10;
  const maxFatigue = 5;
  
  const getX = (index: number) => padding + (index / (data.length - 1)) * (width - 2 * padding);
  const getYIntensity = (val: number) => height - padding - (val / maxIntensity) * (height - 2 * padding);
  const getYFatigue = (val: number) => height - padding - (val / maxFatigue) * (height - 2 * padding);

  const intensityPoints = data.map((d, i) => `${getX(i)},${getYIntensity(d.avg_intensity)}`).join(' ');
  const fatiguePoints = data.map((d, i) => `${getX(i)},${getYFatigue(d.avg_fatigue)}`).join(' ');

  const colors: Record<string, any> = {
    gold: { stroke: '#d4af37', glow: 'rgba(212, 175, 55, 0.4)', text: 'text-gold' },
    green: { stroke: '#62CB72', glow: 'rgba(98, 203, 114, 0.4)', text: 'text-pitch-green' },
    blue: { stroke: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)', text: 'text-blue-400' },
    pitch: { stroke: '#10b981', glow: 'rgba(16, 185, 129, 0.4)', text: 'text-pitch-green' }
  };

  const activeColor = colors[variant] || colors.gold;

  return (
    <div className="glass-card p-10 border-white/5 bg-white/[0.01] relative overflow-hidden group hud-scanline shadow-2xl rounded-[2.5rem]">
      <HudCorners color={activeColor.stroke} opacity={0.1} />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-6 rounded-full bg-gradient-to-b from-${variant === 'pitch' ? 'pitch-green' : variant === 'gold' ? 'gold' : variant === 'green' ? 'pitch-green' : 'blue-500'} to-transparent`} />
          <h4 className={`text-[10px] font-black uppercase tracking-[0.5em] ${activeColor.text} italic`}>{title}</h4>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${variant === 'pitch' ? 'bg-pitch-green' : 'bg-pitch-green'} shadow-glow`} />
            <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{labels.intensity}</span>
          </div>
          {labels.fatigue && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 shadow-glow" />
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{labels.fatigue}</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative h-[200px] w-full cursor-crosshair">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-full drop-shadow-2xl overflow-visible"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          {/* Invisible rectangles for better hover interaction */}
          {data.map((_, i) => (
            <rect
              key={`hover-${i}`}
              x={getX(i) - (width / data.length) / 2}
              y={0}
              width={width / data.length}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHoveredPoint(i)}
              className="pointer-events-all"
            />
          ))}

          {/* Grid Lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line 
              key={i} 
              x1={padding} 
              y1={padding + (i / 4) * (height - 2 * padding)} 
              x2={width - padding} 
              y2={padding + (i / 4) * (height - 2 * padding)} 
              stroke="white" 
              strokeOpacity="0.03" 
              strokeWidth="1" 
            />
          ))}

          {/* Active Day Indicator Line */}
          <AnimatePresence>
            {hoveredPoint !== null && (
              <motion.line
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                x1={getX(hoveredPoint)}
                y1={padding}
                x2={getX(hoveredPoint)}
                y2={height - padding}
                stroke={activeColor.stroke}
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
              />
            )}
          </AnimatePresence>

          {/* Intensity Line */}
          <motion.polyline
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            points={intensityPoints}
            fill="none"
            stroke="#62CB72"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="drop-shadow(0 0 8px rgba(98, 203, 114, 0.4))"
          />

          {/* Fatigue Line */}
          {labels.fatigue && data.some(d => d.avg_fatigue > 0) && (
            <motion.polyline
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              points={fatiguePoints}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="4 4"
              filter="drop-shadow(0 0 5px rgba(244, 63, 94, 0.3))"
            />
          )}

          {/* Data Nodes */}
          {data.map((d, i) => (
            <g key={i}>
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: hoveredPoint === i ? 1.5 : 1 }}
                transition={{ duration: 0.2 }}
                cx={getX(i)}
                cy={getYIntensity(d.avg_intensity)}
                r="4"
                className={`${hoveredPoint === i ? 'fill-white' : 'fill-pitch-green'} shadow-glow pointer-events-none`}
              />
              {labels.fatigue && data.some(d => d.avg_fatigue > 0) && (
                <motion.circle
                  initial={{ scale: 0 }}
                  animate={{ scale: hoveredPoint === i ? 1.5 : 1 }}
                  transition={{ duration: 0.2 }}
                  cx={getX(i)}
                  cy={getYFatigue(d.avg_fatigue)}
                  r="3"
                  className={`${hoveredPoint === i ? 'fill-white' : 'fill-rose-500'} shadow-glow pointer-events-none`}
                />
              )}
              
              {/* Date Labels (only first, middle, last or hovered) */}
              {(i === 0 || i === Math.floor(data.length / 2) || i === data.length - 1 || hoveredPoint === i) && (
                <text
                  x={getX(i)}
                  y={height - 15}
                  textAnchor="middle"
                  className={`text-[8px] font-black uppercase tracking-widest italic transition duration-300 ${hoveredPoint === i ? activeColor.text + ' opacity-100 scale-110' : 'fill-white/20'}`}
                >
                  {new Date(d.day).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Tooltip HTML Overlay */}
        <AnimatePresence>
          {hoveredPoint !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="absolute pointer-events-none z-50 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[120px]"
              style={{
                left: getX(hoveredPoint) > width / 2 ? getX(hoveredPoint) / width * 100 + '%' : (getX(hoveredPoint) / width * 100) + '%',
                top: '10%',
                transform: getX(hoveredPoint) > width / 2 ? 'translateX(-110%)' : 'translateX(10%)'
              }}
            >
              <div className="text-[9px] font-black text-white/40 uppercase mb-2 border-b border-white/5 pb-2">
                {new Date(data[hoveredPoint].day).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-4">
                  <span className={`text-[10px] font-bold ${activeColor.text} uppercase`}>{labels.intensity}</span>
                  <span className="text-sm font-black text-white">
                    {variant === 'pitch' 
                      ? `${Math.round(data[hoveredPoint].avg_intensity * 10)}%` 
                      : data[hoveredPoint].avg_intensity.toFixed(1)}
                  </span>
                </div>
                {labels.fatigue && data[hoveredPoint].avg_fatigue > 0 && (
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[10px] font-bold text-rose-500 uppercase">{labels.fatigue}</span>
                    <span className="text-sm font-black text-white">{data[hoveredPoint].avg_fatigue.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              {/* Subtle accent corner */}
              <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-${variant === 'gold' ? 'gold' : variant === 'green' ? 'pitch-green' : 'blue-500'}/50 rounded-tr-xl`} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6 opacity-30">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white italic">Système de Monitoring Athlétique 0x06</span>
        </div>
        <span className="text-[7px] font-black uppercase tracking-[0.4em] text-white italic">Live Data Sync: OK</span>
      </div>
    </div>
  );
}
