'use client';

import React, { useEffect, useRef, useState } from 'react';
import Stats from 'stats.js';

interface PerformanceMonitorProps {
  className?: string;
  show?: boolean;
}

export default function PerformanceMonitor({ className = '', show = true }: PerformanceMonitorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<Stats | null>(null);

  useEffect(() => {
    if (!show || !containerRef.current) return;

    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    
    // Style the stats panel to match Aura Glass aesthetic
    const dom = stats.dom;
    dom.style.position = 'relative';
    dom.style.opacity = '0.8';
    dom.style.borderRadius = '0.5rem';
    dom.style.overflow = 'hidden';
    dom.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.1)';
    
    containerRef.current.appendChild(dom);
    statsRef.current = stats;

    let frameId: number;
    const update = () => {
      stats.update();
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(frameId);
      if (statsRef.current && containerRef.current) {
        containerRef.current.removeChild(statsRef.current.dom);
      }
    };
  }, [show]);

  if (!show) return null;

  return (
    <div 
      ref={containerRef} 
      className={`bg-navy-deep/80 backdrop-blur-xl border border-white/10 rounded-xl p-2 flex flex-col gap-1 items-center ${className}`}
      style={{ width: 'fit-content' }}
    >
      <div className="text-[7px] font-black uppercase tracking-widest text-gold opacity-50 mb-1">Telemetry x01</div>
    </div>
  );
}
