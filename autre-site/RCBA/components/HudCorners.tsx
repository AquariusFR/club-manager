'use client';

import { motion } from 'framer-motion';

interface HudCornersProps {
  color?: string;
  size?: number;
  thickness?: number;
  className?: string;
  delay?: number;
  opacity?: number;
}

export default function HudCorners({ 
  color = '#d4af37', 
  size = 20, 
  thickness = 1, 
  className = '', 
  delay = 0,
  opacity = 0.5
}: HudCornersProps) {
  const lineStyle = { 
    width: size, 
    height: size, 
    borderColor: color, 
    opacity: 0.8,
    filter: `drop-shadow(0 0 5px ${color})` 
  };

  return (
    <div className={`absolute inset-0 pointer-events-none p-1 ${className}`} style={{ opacity }}>
      {/* Top Left */}
      <motion.div 
        initial={{ opacity: 0, x: -10, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay, duration: 0.8 }}
        className="absolute top-0 left-0 border-t border-l rounded-tl-sm"
        style={lineStyle}
      />
      
      {/* Top Right */}
      <motion.div 
        initial={{ opacity: 0, x: 10, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: delay + 0.1, duration: 0.8 }}
        className="absolute top-0 right-0 border-t border-r rounded-tr-sm"
        style={lineStyle}
      />
      
      {/* Bottom Left */}
      <motion.div 
        initial={{ opacity: 0, x: -10, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: delay + 0.2, duration: 0.8 }}
        className="absolute bottom-0 left-0 border-b border-l rounded-bl-sm"
        style={lineStyle}
      />
      
      {/* Bottom Right */}
      <motion.div 
        initial={{ opacity: 0, x: 10, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: delay + 0.3, duration: 0.8 }}
        className="absolute bottom-0 right-0 border-b border-r rounded-br-sm"
        style={lineStyle}
      />
      
      {/* Secondary micro-accents */}
      <div className="absolute top-0 left-[25%] w-4 h-[1px] bg-white/10" />
      <div className="absolute top-[25%] left-0 w-[1px] h-4 bg-white/10" />
      <div className="absolute top-0 right-[25%] w-4 h-[1px] bg-white/10" />
      <div className="absolute top-[25%] right-0 w-[1px] h-4 bg-white/10" />
    </div>
  );
}
