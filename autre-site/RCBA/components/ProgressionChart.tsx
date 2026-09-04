import { Activity } from "lucide-react";

/**
 * RCBA Progression Chart
 * Lightweight SVG line chart for performance tracking
 */

interface DataPoint {
  date: string;
  tech: number;
  tact: number;
  phys: number;
  ment: number;
}

export default function ProgressionChart({ data }: { data: DataPoint[] }) {
  if (!data || data.length < 2) return (
    <div className="h-48 flex items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
      <div className="flex flex-col items-center gap-4 opacity-50">
        <Activity size={32} />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-center px-6">Intelligence de Données Insuffisante</p>
      </div>
    </div>
  );

  const width = 600;
  const height = 240;
  const padding = 40;
  const pointsCount = data.length;
  
  const getX = (i: number) => padding + (i * (width - 2 * padding) / (pointsCount - 1));
  const getY = (val: number) => height - padding - ((val - 1) * (height - 2 * padding) / 4);

  const categories = [
    { key: 'tech' as keyof DataPoint, color: '#d4af37', label: 'Technique' },
    { key: 'tact' as keyof DataPoint, color: '#38bdf8', label: 'Tactique' },
    { key: 'phys' as keyof DataPoint, color: '#00FF41', label: 'Physique' },
    { key: 'ment' as keyof DataPoint, color: '#fb7185', label: 'Mental' }
  ];

  return (
    <div className="glass-card p-10 border-white/5 bg-white/[0.01] relative overflow-hidden group">
      {/* Background Patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 relative z-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60 mb-2 italic flex items-center gap-3">
            <span className="w-8 h-px bg-gold/50"></span> RCBA ANALYTICS
          </h3>
          <p className="athletic-title text-2xl text-white italic">ÉVOLUTION DES <span className="text-gold">SENSORS</span></p>
        </div>
        <div className="flex flex-wrap gap-4 bg-white/[0.03] p-3 rounded-2xl border border-white/5 backdrop-blur-md">
          {categories.map(c => (
            <div key={c.key} className="flex items-center gap-2 px-2">
              <div className="w-1.5 h-1.5 rounded-full shadow-gold shadow-[0_0_8px_currentColor]" style={{ backgroundColor: c.color, color: c.color }} />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/80 italic group-hover:text-white/80 transition-colors">{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden select-none">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {categories.map(cat => (
              <linearGradient key={`grad-${cat.key}`} id={`grad-${cat.key}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={cat.color} stopOpacity="0" />
                <stop offset="20%" stopColor={cat.color} stopOpacity="0.8" />
                <stop offset="80%" stopColor={cat.color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={cat.color} stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid Lines */}
          {[1,2,3,4,5].map(v => (
            <g key={v}>
              <line 
                x1={padding} y1={getY(v)} x2={width - padding} y2={getY(v)} 
                stroke="white" strokeOpacity="0.05" strokeWidth="1"
              />
              <text x={padding - 15} y={getY(v) + 3} fill="white" fillOpacity="0.2" fontSize="7" fontWeight="900" textAnchor="end" className="italic">{v}</text>
            </g>
          ))}

          {/* Vertical Time Markers */}
          {data.map((_, i) => (
            <line 
              key={`v-${i}`}
              x1={getX(i)} y1={padding} x2={getX(i)} y2={height - padding}
              stroke="white" strokeOpacity="0.1" strokeWidth="1"
            />
          ))}

          {/* Paths */}
          {categories.map(cat => {
            const pathPoints = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(Number(p[cat.key]))}`).join(' ');
            return (
              <g key={cat.key} className="transition-opacity duration-500 group-hover:opacity-100 opacity-60">
                <path 
                  d={pathPoints} 
                  fill="none" 
                  stroke={cat.color} 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  filter="url(#glow)"
                  className="animate-in fade-in slide-in-from-left duration-1000"
                />
                <path 
                  d={pathPoints} 
                  fill="none" 
                  stroke={`url(#grad-${cat.key})`} 
                  strokeWidth="10" 
                  strokeLinecap="round" 
                  strokeOpacity="0.1"
                />
                {data.map((p, i) => (
                  <g key={i} className="cursor-help group/point">
                    <circle 
                      cx={getX(i)} cy={getY(Number(p[cat.key]))} 
                      r="6" fill={cat.color} fillOpacity="0" 
                      className="transition hover:fill-opacity-20"
                    />
                    <circle 
                      cx={getX(i)} cy={getY(Number(p[cat.key]))} 
                      r="3" fill="#01051a" stroke={cat.color} strokeWidth="2" 
                      className="transition-transform group-hover/point:scale-150 duration-300"
                    />
                  </g>
                ))}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between mt-10 px-4 pt-6 border-t border-white/5 bg-white/[0.01] rounded-b-3xl">
        <div className="flex flex-col">
          <span className="text-[8px] font-black text-white/80 uppercase tracking-widest mb-1 italic">Dossier Initial</span>
          <span className="text-[10px] font-bold text-gold uppercase tracking-tight italic">{new Date(data[0].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[8px] font-black text-white/80 uppercase tracking-widest mb-1 italic">Version Actuelle</span>
          <span className="text-[10px] font-bold text-pitch-green uppercase tracking-tight italic">{new Date(data[data.length-1].date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
