'use client'

import React from 'react'

interface RadarData {
  label: string;
  value: number; // 1 to 5
  max: number;
}

interface RadarSeries {
  label: string;
  data: RadarData[];
  color: string;
}

interface RadarChartProps {
  series: RadarSeries[];
  size?: number;
}

export default function RadarChart({ series, size = 300 }: RadarChartProps) {
  if (!series || series.length === 0 || !series[0].data) return null;

  const center = size / 2;
  const radius = (size / 2) * 0.8;
  const labels = series[0].data.map(d => d.label) || [];
  const angleStep = (Math.PI * 2) / labels.length;

  // Background webs
  const webs = [0.2, 0.4, 0.6, 0.8, 1.0].map((v, i) => {
    const webPoints = labels.map((_, j) => {
      const r = v * radius;
      const angle = j * angleStep - Math.PI / 2;
      return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
    }).join(" ");
    return <polygon key={i} points={webPoints} className="fill-none stroke-white/20 stroke-[1]" />;
  });

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grids */}
        {webs}
        {labels.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line 
              key={i} 
              x1={center} 
              y1={center} 
              x2={center + radius * Math.cos(angle)} 
              y2={center + radius * Math.sin(angle)} 
              className="stroke-white/10 stroke-[1]" 
            />
          );
        })}

        {/* Data Shapes */}
        {series.map((s, idx) => {
          const points = s.data.map((d, i) => {
            const r = (d.value / d.max) * radius;
            const angle = i * angleStep - Math.PI / 2;
            return {
              x: center + r * Math.cos(angle),
              y: center + r * Math.sin(angle)
            };
          });
          const polygonPath = points.map(p => `${p.x},${p.y}`).join(" ");

          return (
            <g key={idx}>
              <polygon 
                points={polygonPath} 
                className="fill-current opacity-20 pointer-events-none"
                style={{ color: s.color }}
              />
              <polygon 
                points={polygonPath} 
                className="fill-none stroke-[2]" 
                style={{ stroke: s.color, filter: `drop-shadow(0 0 3px ${s.color})` }}
              />
              {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" style={{ fill: s.color }} />
              ))}
            </g>
          );
        })}

        {/* Labels (Outer) */}
        {labels.map((label, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const labelX = center + (radius + 25) * Math.cos(angle);
          const labelY = center + (radius + 25) * Math.sin(angle);
          return (
            <text 
              key={i} 
              x={labelX} 
              y={labelY} 
              className="fill-white/60 text-[10px] font-black uppercase tracking-widest italic"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
