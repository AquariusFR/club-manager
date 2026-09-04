'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Cpu, 
  Database, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  PlayCircle,
  Layout,
  Lock,
  Loader2
} from 'lucide-react';
import { AI_ENGINEERING_CURRICULUM, CoursePhase } from '@/lib/ai-data';
import { getLabProgress, updatePhaseStatus } from '@/lib/actions/lab-actions';

type PhaseStatus = 'LOCKED' | 'UNLOCKED' | 'COMPLETED';

export default function AILabNavigator() {
  const [selectedPhase, setSelectedPhase] = useState<CoursePhase>(AI_ENGINEERING_CURRICULUM[0]);
  const [progressMap, setProgressMap] = useState<Record<number, PhaseStatus>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function init() {
      const data = await getLabProgress();
      const map: Record<number, PhaseStatus> = { 0: 'UNLOCKED' }; // Phase 0 is always at least unlocked
      data.forEach((p: any) => {
        map[p.phase_id] = p.status;
      });
      setProgressMap(map);
      setIsLoading(false);
    }
    init();
  }, []);

  const handleToggle = async (id: number) => {
    const currentStatus = progressMap[id] || (id === 0 ? 'UNLOCKED' : 'LOCKED');
    const newStatus = currentStatus === 'COMPLETED' ? 'UNLOCKED' : 'COMPLETED';
    
    // Optimistic update
    setProgressMap(prev => ({ ...prev, [id]: newStatus }));
    
    startTransition(async () => {
      await updatePhaseStatus(id, newStatus);
      const data = await getLabProgress();
      const map: Record<number, PhaseStatus> = { 0: 'UNLOCKED' }; 
      data.forEach((p: any) => {
        map[p.phase_id] = p.status;
      });
      setProgressMap(map);
    });
  };

  const getStatusIcon = (id: number) => {
    const status = progressMap[id] || (id === 0 ? 'UNLOCKED' : 'LOCKED');
    if (status === 'COMPLETED') return <CheckCircle2 size={14} className="text-pitch-green" />;
    if (status === 'LOCKED') return <Lock size={14} className="text-white/20" />;
    return <Circle size={14} className="text-gold/60" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="text-gold animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar: Phase List */}
      <div className="lg:col-span-4 space-y-4 max-h-[700px] overflow-y-auto pr-4 custom-scrollbar">
        {AI_ENGINEERING_CURRICULUM.map((phase) => {
          const isSelected = selectedPhase.id === phase.id;
          const status = progressMap[phase.id] || (phase.id === 0 ? 'UNLOCKED' : 'LOCKED');
          const isLocked = status === 'LOCKED';
          
          return (
            <button
              key={phase.id}
              disabled={isLocked}
              onClick={() => setSelectedPhase(phase)}
              className={`w-full text-left p-6 rounded-2xl border transition relative group overflow-hidden ${
                isSelected
                  ? 'bg-gold/10 border-gold/40 shadow-glass-luminous'
                  : isLocked 
                    ? 'bg-white/[0.02] border-white/5 opacity-40 cursor-not-allowed'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Phase {phase.id.toString().padStart(2, '0')}</span>
                {getStatusIcon(phase.id)}
              </div>
              <h3 className={`athletic-title text-sm italic uppercase tracking-wider ${
                isSelected ? 'text-gold' : 'text-white'
              }`}>
                {phase.title} {isLocked && <span className="ml-2 opacity-50">🔒</span>}
              </h3>
              <div className="mt-4 flex items-center gap-3">
                 <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/60">
                   {phase.category}
                 </span>
                 <span className="text-[9px] font-bold text-gold/60">{phase.lessons} Lessons</span>
              </div>
              
              {isSelected && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gold"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content: Phase Detail */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPhase.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-10 min-h-[600px] border-gold/20 bg-gold/[0.02]"
          >
            <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-gold/20 border border-gold/30 flex items-center justify-center text-gold shadow-glass-luminous">
                  {selectedPhase.category === 'Fundamentals' && <Database size={32} />}
                  {selectedPhase.category === 'Deep Learning' && <Brain size={32} />}
                  {selectedPhase.category === 'LLM' && <Zap size={32} />}
                  {selectedPhase.category === 'Agents' && <Cpu size={32} />}
                  {selectedPhase.category === 'Production' && <Layout size={32} />}
                </div>
                <div>
                  <div className="label-overline mb-1 text-gold/70">Intelligence Lab // Phase {selectedPhase.id}</div>
                  <h2 className="athletic-title text-4xl italic uppercase tracking-tight">{selectedPhase.title}</h2>
                </div>
              </div>
              
              <button
                onClick={() => handleToggle(selectedPhase.id)}
                disabled={isPending}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-black text-[10px] uppercase tracking-widest transition ${
                  progressMap[selectedPhase.id] === 'COMPLETED'
                    ? 'bg-pitch-green/20 border-pitch-green/40 text-pitch-green'
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-gold/10 hover:border-gold/30 hover:text-gold'
                } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
              >
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : progressMap[selectedPhase.id] === 'COMPLETED' ? (
                  <><CheckCircle2 size={16} /> Completed</>
                ) : (
                  <><Circle size={16} /> Mark as Complete</>
                )}
              </button>
            </div>

            <p className="text-xl italic text-white/70 leading-relaxed mb-12 max-w-3xl">
              {selectedPhase.description}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card p-8 border-white/5 bg-navy-deep/40">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gold mb-6">Skills to Master</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPhase.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/80">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8 border-white/5 bg-navy-deep/40">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gold mb-6">Quick Actions</h4>
                <div className="space-y-3">
                  <button className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:shadow-gold flex items-center justify-between group">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Start Lesson 1.0</span>
                    <PlayCircle size={16} className="text-white/40 group-hover:text-gold transition-colors" />
                  </button>
                  <button className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 hover:shadow-gold flex items-center justify-between group">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Download Resources</span>
                    <Layout size={16} className="text-white/40 group-hover:text-gold transition-colors" />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-16 pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Lab Progression</span>
                <span className="text-[10px] font-black text-gold italic">{selectedPhase.lessons} Lessons Active</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: progressMap[selectedPhase.id] === 'COMPLETED' ? '100%' : '5%' }}
                  className="h-full bg-gradient-to-r from-gold/40 to-gold"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

