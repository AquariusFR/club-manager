'use client';

import React, { useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Command, Zap } from 'lucide-react';
import AgentCommandCenter from './AgentCommandCenter';

interface PerformanceAgentWrapperProps {
  children: ReactNode;
}

export default function PerformanceAgentWrapper({ children }: PerformanceAgentWrapperProps) {
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);
  const [agentContext, setAgentContext] = useState('');
  const [agentKey, setAgentKey] = useState<string>('MARY');
  // Function to open agent center with context from outside
  const openWithContext = React.useCallback((context: string, key?: string) => {
    setAgentContext(context);
    if (key) setAgentKey(key);
    setIsAgentPanelOpen(true);
  }, []);

  React.useEffect(() => {
    (window as any).openPerformanceAgent = openWithContext;
    return () => {
      delete (window as any).openPerformanceAgent;
    };
  }, [openWithContext]);

  return (
    <>
      <div className="relative">
        {/* Floating Toggle Button (HUD Style) */}
        <div className="fixed bottom-10 right-10 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setAgentContext('Analyse globale de la performance athlétique du club.');
              setAgentKey('ALEX');
              setIsAgentPanelOpen(true);
            }}
            className="w-16 h-16 rounded-full bg-gold text-navy-deep flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] border-4 border-white/20 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
            <Command size={28} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
            
            {/* Label hint */}
            <div className="absolute right-20 bg-gold text-navy-deep px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/20 shadow-xl italic">
              LANCER AUDIT AGENTIQUE
            </div>
          </motion.button>
        </div>
        {children}
      </div>

      <AnimatePresence>
        {isAgentPanelOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAgentPanelOpen(false)}
              className="absolute inset-0 bg-navy-deep/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl h-full shadow-2xl"
            >
              <AgentCommandCenter 
                initialContext={agentContext}
                initialAgentKey={agentKey}
                onClose={() => setIsAgentPanelOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// Client component for the "Analyze" button to be used in widgets
export function AnalyzeWidgetButton({ context, label = "ANALYSER", agentKey }: { context: string, label?: string, agentKey?: string }) {
  return (
    <button 
      onClick={() => {
        if ((window as any).openPerformanceAgent) {
          (window as any).openPerformanceAgent(context, agentKey);
        }
      }}
      className="flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-lg text-[8px] font-black text-gold uppercase tracking-widest hover:bg-gold hover:text-navy-deep transition group/ana shadow-lg"
    >
      <Zap size={10} className="group-hover/ana:animate-pulse" />
      {label}
    </button>
  );
}
