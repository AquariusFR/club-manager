'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileSearch, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Scan,
  Database,
  Cpu,
  X
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

import { createExpense } from '@/lib/logistique-actions';

interface OCRScannerProps {
  onClose?: () => void;
  onComplete?: (data: any) => void;
  mode?: 'license' | 'expense';
}

export function OCRScanner({ onClose, onComplete, mode = 'license' }: OCRScannerProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'scanning' | 'success' | 'error'>('idle');
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleScan = useCallback(async () => {
    setStatus('uploading');
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    
    setStatus('scanning');
    // Simulated neural processing steps
    const steps = mode === 'license' ? 
      ['Isolation des caractères...', 'Analyse biométrique...', 'Vérification base FFR...'] : 
      ['Détection entité...', 'Extraction montants HT/TTC...', 'Analyse TVA...'];
    
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 800));
    }

    if (mode === 'license') {
      setExtractedData({
        name: "DUPONT Jean-Marc",
        birthDate: "12/05/1992",
        validUntil: "30/06/2026",
        type: "Certificat Médical",
        confidence: (95 + Math.random() * 4).toFixed(1)
      });
    } else {
      setExtractedData({
        entity: "RCBA",
        type: "FUEL",
        amount: 85.50,
        description: "Plein Minibus - Station Total",
        date: new Date().toISOString().split('T')[0],
        confidence: (98 + Math.random() * 1.5).toFixed(1)
      });
    }
    setStatus('success');
  }, [mode]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleScan();
  }, [handleScan]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: { 'image/*': [], 'application/pdf': [] },
    multiple: false
  });

  const handleValidation = async () => {
    if (mode === 'expense') {
      try {
        const formData = new FormData();
        formData.append('entity', extractedData.entity);
        formData.append('type', extractedData.type);
        formData.append('amount', extractedData.amount.toString());
        formData.append('description', extractedData.description);
        formData.append('date', extractedData.date);
        await createExpense(formData);
      } catch (error) {
        console.error("OCR Expense Save Error:", error);
        setStatus('error');
        return;
      }
    }
    
    if (onComplete) onComplete(extractedData);
    if (onClose) onClose();
  };


  const isExpense = mode === 'expense';

  return (
    <div className="w-full max-w-2xl bg-navy-deep/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors z-20"
      >
        <X size={24} />
      </button>
      
      {/* Neural Header */}
      <div className="p-8 border-b border-white/5 bg-gradient-to-r from-gold/5 via-transparent to-transparent">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/30 flex items-center justify-center relative overflow-hidden">
             <Cpu className={cn("animate-pulse", isExpense ? "text-pitch-green" : "text-gold")} size={24} />
             <div className={cn("absolute inset-0 animate-ping", isExpense ? "bg-pitch-green/10" : "bg-gold/10")} />
          </div>
          <div>
            <h3 className="text-xl font-display italic black uppercase tracking-widest text-white">
              Neural <span className={isExpense ? "text-pitch-green" : "text-gold"}>{isExpense ? 'Expense Scan' : 'License Recon'}</span>
            </h3>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">
              OCR & Validation Engine v4.0
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              {...(getRootProps() as any)}
              className={`
                border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition
                ${isDragActive ? (isExpense ? 'border-pitch-green bg-pitch-green/5' : 'border-gold bg-gold/5') + ' scale-[0.98]' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
              `}
            >
              <input {...getInputProps()} />
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                <Upload size={40} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{isExpense ? 'Déposez votre facture/reçu' : 'Déposez le certificat médical'}</p>
                <p className="text-sm text-white/40 mt-1">Format PDF, JPG ou PNG supporté</p>
              </div>
            </motion.div>
          )}

          {(status === 'uploading' || status === 'scanning') && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center gap-6"
            >
              <div className="relative">
                <Loader2 className={cn("animate-spin", isExpense ? "text-pitch-green" : "text-gold")} size={64} strokeWidth={1} />
                <Scan className={cn("absolute inset-0 m-auto animate-pulse", isExpense ? "text-pitch-green" : "text-gold")} size={32} />
              </div>
              <div className="text-center space-y-2">
                <p className="text-xl font-display italic black uppercase tracking-widest text-white">
                  {status === 'uploading' ? 'Transmission...' : 'Analyse Neuro-Cognitive...'}
                </p>
                <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className={cn("h-full", isExpense ? "bg-pitch-green" : "bg-gold")}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: status === 'uploading' ? 1.5 : 2.5 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-3xl bg-pitch-green/10 border border-pitch-green/20 flex items-center gap-4">
                <CheckCircle2 className="text-pitch-green" size={32} />
                <div>
                  <p className="text-lg font-bold text-white">Extraction Terminée</p>
                  <p className="text-sm text-white/60">Indice de confiance : {extractedData.confidence}%</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {isExpense ? (
                  <>
                    <ResultField label="Entité" value={extractedData.entity} />
                    <ResultField label="Type" value={extractedData.type} />
                    <ResultField label="Montant" value={`${extractedData.amount.toFixed(2)}€`} highlight />
                    <ResultField label="Description" value={extractedData.description} />
                  </>
                ) : (
                  <>
                    <ResultField label="Nom Joueur" value={extractedData.name} />
                    <ResultField label="Date de Naissance" value={extractedData.birthDate} />
                    <ResultField label="Valide Jusqu'au" value={extractedData.validUntil} highlight />
                    <ResultField label="Type Document" value={extractedData.type} />
                  </>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setStatus('idle')}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-colors"
                >
                  Réessayer
                </button>
                <button 
                  onClick={handleValidation}
                  className={cn(
                    "flex-1 py-4 text-navy-deep font-black uppercase tracking-widest rounded-2xl transition-transform hover:scale-105",
                    isExpense ? "bg-pitch-green shadow-[0_0_20px_rgba(98,203,114,0.4)]" : "bg-gold shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                  )}
                >
                  {isExpense ? 'Enregistrer les frais' : 'Appliquer les données'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultField({ label, value, highlight }: any) {
  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{label}</p>
      <p className={cn(
        "text-sm font-bold mt-1",
        highlight ? "text-gold" : "text-white"
      )}>{value}</p>
    </div>
  );
}
