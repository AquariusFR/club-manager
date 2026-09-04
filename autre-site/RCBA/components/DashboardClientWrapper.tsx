'use client';

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface DashboardClientWrapperProps {
  children: ReactNode;
}

export default function DashboardClientWrapper({ children }: DashboardClientWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
      className="relative"
    >
      {/* 🔮 Background HUD Ambience */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full animate-float opacity-50" />
      </div>
      
      {children}
    </motion.div>
  );
}

// 🟢 Motion Section for Staggered Entries
export function MotionSection({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

// 📡 Scanning Line Effect (Client-side)
export function ScanningLine() {
  return (
    <motion.div 
       animate={{ x: ['-100%', '100%'] }}
       transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
       className="w-1/2 h-full bg-gradient-to-r from-transparent via-gold/40 to-transparent"
    />
  );
}
