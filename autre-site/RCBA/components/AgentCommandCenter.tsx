'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  User, 
  Send, 
  X, 
  ChevronRight, 
  Bot, 
  Sparkles,
  Command,
  Loader2,
  Trash2
} from 'lucide-react';
import { AGENTS } from '@/lib/agents';
import { runAgentAction, saveAnalysisToFeedAction } from '@/lib/actions';
import HudCorners from './HudCorners';

interface AgentCommandCenterProps {
  initialContext?: string;
  initialAgentKey?: string;
  onClose?: () => void;
}

export default function AgentCommandCenter({ 
  initialContext = '', 
  initialAgentKey = 'MARY',
  onClose 
}: AgentCommandCenterProps) {
  const [selectedAgentKey, setSelectedAgentKey] = useState<string>(initialAgentKey);
  const [userContext, setUserContext] = useState(initialContext);
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<{agent: string, command: string, result: string, timestamp: Date}[]>([]);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentResult, isRunning]);

  const selectedAgent = (AGENTS as any)[selectedAgentKey];

  async function handleRunCommand(commandId: string, commandLabel: string) {
    if (isRunning) return;
    
    setIsRunning(true);
    setCurrentResult(null);
    
    try {
      const result = await runAgentAction(selectedAgentKey, commandId, userContext);
      
      if ('error' in result) {
        setCurrentResult(`[ERREUR SYSTÈME]: ${result.error}`);
      } else {
        const newEntry = {
          agent: selectedAgent.name,
          command: commandLabel,
          result: result.result,
          timestamp: new Date()
        };
        setHistory(prev => [newEntry, ...prev]);
        setCurrentResult(result.result);
        if (result.autoArchived) {
          setSaveSuccess(true);
        }
      }
    } catch (err) {
      setCurrentResult(`[FATAL ERROR]: Échec de la communication avec la Matrice.`);
    } finally {
      setIsRunning(false);
      setSaveSuccess(false);
    }
  }

  async function handleSaveToFeed() {
    if (!currentResult || isSaving) return;
    
    setIsSaving(true);
    try {
      const result = await saveAnalysisToFeedAction({
        type: selectedAgentKey === 'ALEX' ? 'Physique' : 'Tactique',
        source: `Agent IA: ${selectedAgent.name}`,
        titre: `Analyse Agentique: ${selectedAgent.name}`,
        contenu: currentResult,
        gravite: 'info',
        agent_key: selectedAgentKey
      });
      
      if ('success' in result) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save to feed", err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-full bg-navy-deep/95 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
      <HudCorners opacity={0.1} />
      
      {/* Header */}
      <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <Command size={24} className="text-gold animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter athletic-title athletic-skew">AGENT COMMAND CENTER</h3>
            <p className="text-[9px] font-mono text-white/40 uppercase tracking-[0.3em]">Operational Intelligence Matrix v2.0</p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition hover:rotate-90"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">
        {/* Agent Selection */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.5em] italic flex items-center gap-4">
            SÉLECTION DE L'AGENT
            <div className="h-px flex-1 bg-gold/20" />
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(AGENTS).map(([key, agent]) => (
              <button
                key={key}
                onClick={() => setSelectedAgentKey(key)}
                className={`p-4 rounded-2xl border transition flex flex-col items-center gap-2 text-center group ${
                  selectedAgentKey === key 
                    ? 'bg-gold border-gold text-navy-deep shadow-[0_0_20px_rgba(212,175,55,0.3)]' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-gold/40 hover:bg-white/10'
                }`}
              >
                <User size={18} className={selectedAgentKey === key ? 'text-navy-deep' : 'text-gold/60 group-hover:text-gold'} />
                <span className="text-[9px] font-black uppercase tracking-widest italic leading-tight">
                  {agent.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Selected Agent Persona */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedAgentKey}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Bot size={80} className="text-white" />
            </div>
            <h5 className="text-gold font-black italic uppercase tracking-widest text-sm mb-2">PERSONA: {selectedAgent.name}</h5>
            <p className="text-sm text-white/70 italic leading-relaxed relative z-10">{selectedAgent.persona}</p>
          </motion.div>
        </AnimatePresence>

        {/* User Context Area */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic flex items-center gap-4">
            CONTEXTE SUPPLÉMENTAIRE / DONNÉES
            <div className="h-px flex-1 bg-white/10" />
          </h4>
          <div className="relative group">
            <textarea
              value={userContext}
              onChange={(e) => setUserContext(e.target.value)}
              placeholder="Injectez ici des données de match, des rapports de scouts ou des problématiques spécifiques..."
              className="w-full h-32 bg-navy-deep border border-white/10 rounded-3xl p-6 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-gold/30 transition resize-none shadow-inner"
            />
            <div className="absolute bottom-4 right-6 flex items-center gap-3">
              {userContext && (
                <button 
                  onClick={() => setUserContext('')}
                  className="p-2 text-white/20 hover:text-rose-500 transition-colors"
                  title="Effacer le contexte"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <Sparkles size={16} className="text-gold/40" />
            </div>
          </div>
        </section>

        {/* Commands Grid */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-gold uppercase tracking-[0.5em] italic flex items-center gap-4">
            COMMANDES OPÉRATIONNELLES
            <div className="h-px flex-1 bg-gold/20" />
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {selectedAgent.commands.map((cmd: any) => (
              <button
                key={cmd.id}
                onClick={() => handleRunCommand(cmd.id, cmd.label)}
                disabled={isRunning}
                className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-gold/10 hover:border-gold/40 transition group disabled:opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-gold group-hover:text-navy-deep transition">
                    <ChevronRight size={18} />
                  </div>
                  <span className="text-sm font-black text-white uppercase tracking-widest italic group-hover:text-gold transition-colors">
                    {cmd.label}
                  </span>
                </div>
                <Send size={16} className="text-white/20 group-hover:text-gold group-hover:translate-x-1 transition" />
              </button>
            ))}
          </div>
        </section>

        {/* Result Terminal */}
        {(isRunning || currentResult) && (
          <section className="space-y-4 pt-4">
            <h4 className="text-[10px] font-black text-pitch-green uppercase tracking-[0.5em] italic flex items-center gap-4">
              FLUX D'INTELLIGENCE EN DIRECT
              <div className="h-px flex-1 bg-pitch-green/20" />
            </h4>
            <div className="bg-black/40 border border-pitch-green/20 rounded-3xl p-8 font-mono relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-pitch-green/[0.02] pointer-events-none" />
              <div className="flex items-center gap-3 mb-6 border-b border-pitch-green/10 pb-4">
                <Terminal size={14} className="text-pitch-green" />
                <span className="text-[10px] text-pitch-green/60 uppercase tracking-widest">root@rcba-matrix:~/output</span>
                {isRunning && <Loader2 size={14} className="text-pitch-green animate-spin ml-auto" />}
              </div>
              
              <div className="text-sm text-pitch-green/90 leading-relaxed whitespace-pre-wrap min-h-[100px]">
                {isRunning ? (
                  <div className="flex flex-col gap-2">
                    <span className="animate-pulse">_ SÉQUENÇAGE DES DONNÉES EN COURS...</span>
                    <span className="text-[10px] opacity-50">Appel de l'agent {selectedAgent.name}...</span>
                  </div>
                ) : (
                  currentResult
                )}
              </div>
              
              {!isRunning && currentResult && !currentResult.startsWith('[ERREUR') && (
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleSaveToFeed}
                    disabled={isSaving || saveSuccess}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${
                      saveSuccess 
                        ? 'bg-pitch-green text-navy-deep' 
                        : 'bg-pitch-green/10 text-pitch-green border border-pitch-green/20 hover:bg-pitch-green hover:text-navy-deep'
                    }`}
                  >
                    {isSaving ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : saveSuccess ? (
                      <Sparkles size={12} />
                    ) : (
                      <Send size={12} />
                    )}
                    {saveSuccess ? 'SAUVEGARDÉ DANS LA MATRICE' : 'ARCHIVER DANS LE FLUX'}
                  </button>
                </div>
              )}
              
              <div ref={terminalEndRef} />
            </div>
          </section>
        )}

        {/* History */}
        {history.length > 0 && (
          <section className="space-y-4 pt-8">
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] italic flex items-center gap-4">
              ARCHIVES RÉCENTES
              <div className="h-px flex-1 bg-white/10" />
            </h4>
            <div className="space-y-4">
              {history.map((entry, idx) => (
                <div 
                  key={idx} 
                  className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-3 cursor-pointer hover:bg-white/[0.04] transition"
                  onClick={() => setCurrentResult(entry.result)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-gold uppercase tracking-widest">{entry.agent}</span>
                    <span className="text-[8px] font-mono text-white/20">{entry.timestamp.toLocaleTimeString()}</span>
                  </div>
                  <span className="text-sm font-black text-white uppercase italic tracking-widest leading-tight">{entry.command}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
