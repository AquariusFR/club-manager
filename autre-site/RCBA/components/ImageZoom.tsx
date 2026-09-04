'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, X } from 'lucide-react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  wrapperClassName?: string;
  style?: React.CSSProperties;
}

export default function ImageZoom({ src, alt, className, wrapperClassName, style }: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Close lightbox on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={`relative group/zoom cursor-pointer overflow-hidden ${wrapperClassName || 'w-full h-full'}`}
        role="button"
        aria-label={`Agrandir la photo de ${alt}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <img 
          src={src} 
          alt={alt} 
          className={className} 
          style={style}
        />
        {/* Hover overlay with zoom icon */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/zoom:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-20">
          <div className="w-10 h-10 rounded-full bg-navy-deep/90 border border-white/20 flex items-center justify-center text-white/80 transform scale-75 group-hover/zoom:scale-100 transition-transform duration-300 shadow-xl">
            <ZoomIn size={18} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          >
            {/* Backdrop click target */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 cursor-zoom-out"
            />

            {/* Lightbox container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-[2rem] border border-white/10 bg-[#070d19]/90 backdrop-blur-2xl shadow-3xl flex flex-col justify-center items-center z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="w-full flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050b14]/50 relative z-20">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 italic">Aperçu Officiel</span>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition cursor-pointer"
                  aria-label="Fermer l'aperçu"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Photo Box */}
              <div className="p-4 md:p-8 flex justify-center items-center overflow-auto max-h-[75vh]">
                <img 
                  src={src} 
                  alt={alt} 
                  className="w-full h-auto max-h-[65vh] object-contain rounded-xl shadow-2xl border border-white/5"
                />
              </div>

              {/* Bottom Tag */}
              <div className="w-full py-4 border-t border-white/5 bg-[#050b14]/50 text-center text-[10px] font-black uppercase tracking-widest text-gold italic">
                {alt}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
