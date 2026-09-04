'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Activity, Shield, Cpu, Network, Layers } from 'lucide-react';
import HudCorners from './HudCorners';

interface Node {
  id: string;
  label: string;
  icon: any;
  color: string;
  value: number;
  x: number;
  y: number;
}

const NODES: Node[] = [
  { id: 'tech', label: 'Tactique Core', icon: Shield, color: '#4ade80', value: 85, x: 20, y: 30 },
  { id: 'phys', label: 'Physique Engine', icon: Activity, color: '#fb7185', value: 72, x: 80, y: 25 },
  { id: 'ment', label: 'Neural Mental', icon: Brain, color: '#60a5fa', value: 91, x: 50, y: 15 },
  { id: 'eval', label: 'RAG Evaluation', icon: Target, color: '#c084fc', value: 78, x: 30, y: 70 },
  { id: 'agent', label: 'Agentic Synergy', icon: Cpu, color: '#fb923c', value: 65, x: 70, y: 75 },
];

const CONNECTIONS = [
  ['tech', 'ment'],
  ['ment', 'phys'],
  ['tech', 'eval'],
  ['eval', 'agent'],
  ['agent', 'phys'],
  ['ment', 'agent'],
];

export default function AuraCognitiveEngine({ player }: { player: any }) {
  // Update node values based on player stats if available
  const activeNodes = useMemo(() => {
    return NODES.map(node => {
      let val = node.value;
      if (node.id === 'tech') val = Math.round(player.aptitude_technique * 20);
      if (node.id === 'phys') val = Math.round(player.aptitude_physique * 20);
      if (node.id === 'ment') val = Math.round(player.aptitude_mentale * 20);
      if (node.id === 'eval') val = Math.round(player.aptitude_tactique * 20);
      return { ...node, value: val };
    });
  }, [player]);

  return (
    <div className="relative w-full aspect-video bg-navy-deep/20 border border-white/5 rounded-[3rem] overflow-hidden group">
      <HudCorners color="#d4af37" opacity={0.1} size={30} />
      
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* SVG Canvas for Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="connect-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="50%" stopColor="#d4af37" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {CONNECTIONS.map(([fromId, toId], idx) => {
          const from = activeNodes.find(n => n.id === fromId)!;
          const to = activeNodes.find(n => n.id === toId)!;
          return (
            <motion.line
              key={`${fromId}-${toId}`}
              x1={`${from.x}%`} y1={`${from.y}%`}
              x2={`${to.x}%`} y2={`${to.y}%`}
              stroke="url(#connect-grad)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: idx * 0.2, repeat: Infinity, repeatType: 'reverse', repeatDelay: 5 }}
            />
          );
        })}

        {/* Animated Particles on lines */}
        {CONNECTIONS.map(([fromId, toId], idx) => {
           const from = activeNodes.find(n => n.id === fromId)!;
           const to = activeNodes.find(n => n.id === toId)!;
           return (
             <motion.circle
               key={`p-${idx}`}
               r="2"
               fill="#d4af37"
               filter="url(#glow)"
               animate={{
                 cx: [`${from.x}%`, `${to.x}%`],
                 cy: [`${from.y}%`, `${to.y}%`],
                 opacity: [0, 1, 0]
               }}
               transition={{
                 duration: 3 + (idx % 2),
                 repeat: Infinity,
                 delay: idx * 0.5,
                 ease: "linear"
               }}
             />
           );
        })}
      </svg>

      {/* Nodes */}
      {activeNodes.map((node, idx) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 + 1 }}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-default flex flex-col items-center"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <div 
            className="w-16 h-16 rounded-2xl bg-navy-deep/80 border-2 backdrop-blur-xl flex items-center justify-center transition group/node hover:scale-110 shadow-2xl"
            style={{ borderColor: `${node.color}40`, boxShadow: `0 0 20px ${node.color}20` }}
          >
            <node.icon size={28} style={{ color: node.color }} className="group-hover/node:animate-pulse" />
            
            {/* Value Indicator Bubble */}
            <div className="absolute -top-3 -right-3 px-2 py-0.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[9px] font-black text-white">
              {node.value}%
            </div>
          </div>
          
          <div className="mt-3 text-center">
            <div className="text-[9px] font-black text-white uppercase tracking-widest italic drop-shadow-md">
              {node.label}
            </div>
            <div className="text-[7px] font-mono text-white/50 uppercase tracking-tighter">
              SYNC_STATUS: ACTIVE
            </div>
          </div>
        </motion.div>
      ))}

      {/* Header Info */}
      <div className="absolute top-8 left-10 z-20">
        <h3 className="text-2xl font-black italic uppercase text-white athletic-title athletic-skew tracking-tighter">
          Cognitive <span className="text-gold">Engine</span>
        </h3>
        <p className="text-[9px] font-mono text-white/60 uppercase tracking-[0.4em]">Integrated Intelligence Graph // v1.0.4-Elite</p>
      </div>

      {/* Stats Overlay Corner */}
      <div className="absolute bottom-8 right-10 z-20 bg-black/40 border border-white/10 backdrop-blur-xl p-5 rounded-3xl min-w-[200px]">
        <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
          <Layers size={14} className="text-gold" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest italic">System Metrics</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[9px] font-mono">
            <span className="text-white/50">DATA_LATENCY</span>
            <span className="text-pitch-green">0.4ms</span>
          </div>
          <div className="flex justify-between items-center text-[9px] font-mono">
            <span className="text-white/50">NEURAL_DENSITY</span>
            <span className="text-gold">4.21 nodes/px</span>
          </div>
          <div className="flex justify-between items-center text-[9px] font-mono">
            <span className="text-white/50">VAL_SYNC</span>
            <span className="text-blue-400">ENCRYPTED</span>
          </div>
        </div>
      </div>

      {/* Center Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <Activity size={200} className="text-white animate-pulse" />
      </div>
    </div>
  );
}
