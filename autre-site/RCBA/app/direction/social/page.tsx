'use client'

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, Send, AlertCircle, X, Sparkles, CheckCircle } from 'lucide-react';

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export default function SocialMediaPage() {
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState({ facebook: true, instagram: false });
  const [image, setImage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePlatform = (platform: 'facebook' | 'instagram') => {
    setPlatforms(prev => ({ ...prev, [platform]: !prev[platform] }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const getBase64FromBlobUrl = async (blobUrl: string): Promise<string> => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);
    
    try {
      let imageBase64 = undefined;
      let imageUrl = undefined;
      
      if (image) {
        if (image.startsWith('blob:')) {
          imageBase64 = await getBase64FromBlobUrl(image);
        } else if (image.startsWith('data:')) {
          imageBase64 = image;
        } else {
          imageUrl = image;
        }
      }

      const response = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platforms,
          content,
          imageBase64,
          imageUrl
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        const fbErr = data.results?.facebook?.error;
        const igErr = data.results?.instagram?.error;
        setError(data.error || [fbErr ? `Facebook: ${fbErr}` : null, igErr ? `Instagram: ${igErr}` : null].filter(Boolean).join(' | '));
      } else {
        setPublished(true);
        setTimeout(() => setPublished(false), 3000);
        setContent('');
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white athletic-title athletic-skew flex items-center gap-4">
            DIFFUSION <span className="text-gold">RÉSEAUX</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium">Publiez du contenu sur les plateformes du club</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COMPOSER PANEL */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-glass-luminous relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] pointer-events-none group-hover:bg-gold/10 transition-colors duration-1000" />
            
            <div className="relative z-10 space-y-8">
              
              {/* Platforms */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-white/40 italic">Plateformes</label>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => togglePlatform('facebook')}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition duration-300 active:scale-[0.96] ${
                      platforms.facebook 
                        ? 'bg-[#1877F2]/10 border-[#1877F2]/30 text-[#1877F2] shadow-[0_0_20px_rgba(24,119,242,0.15)]' 
                        : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/[0.05]'
                    }`}
                  >
                    <FacebookIcon className="w-5 h-5" />
                    <span className="font-bold">Facebook</span>
                    {platforms.facebook && <CheckCircle className="w-4 h-4 ml-2" />}
                  </button>
                  
                  <button 
                    onClick={() => togglePlatform('instagram')}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition duration-300 active:scale-[0.96] ${
                      platforms.instagram 
                        ? 'bg-[#E1306C]/10 border-[#E1306C]/30 text-[#E1306C] shadow-[0_0_20px_rgba(225,48,108,0.15)]' 
                        : 'bg-white/[0.02] border-white/5 text-white/40 hover:bg-white/[0.05]'
                    }`}
                  >
                    <InstagramIcon className="w-5 h-5" />
                    <span className="font-bold">Instagram</span>
                    {platforms.instagram && <CheckCircle className="w-4 h-4 ml-2" />}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-white/40 italic">Message</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Que souhaitez-vous partager avec les supporters ?"
                  className="w-full bg-navy-deep/50 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition min-h-[160px] resize-none"
                />
              </div>

              {/* Media Upload */}
              <div className="space-y-4">
                <label className="text-xs font-black uppercase tracking-widest text-white/40 italic">Média</label>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange} 
                />

                <AnimatePresence mode="popLayout">
                  {!image ? (
                    <motion.div
                      initial={false}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                      className="border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-gold/30 hover:bg-gold/5 transition cursor-pointer flex flex-col items-center justify-center gap-4 group"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold/10 transition duration-500">
                        <ImagePlus className="w-8 h-8 text-white/40 group-hover:text-gold transition-colors" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-white group-hover:text-gold transition-colors">Cliquez pour ajouter une image</p>
                        <p className="text-sm text-white/30 mt-1">L'image sera postée sur les réseaux</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                      className="relative rounded-2xl overflow-hidden group border border-white/5"
                    >
                      <img src={image} alt="Upload preview" className="w-full h-64 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button 
                          onClick={() => {
                            setImage(null);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center hover:scale-110 transition-transform active:scale-[0.96] shadow-xl"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-500 leading-relaxed font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <AlertCircle className="w-4 h-4" />
                  <span>Publication immédiate via API Meta</span>
                </div>
                
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || (!platforms.facebook && !platforms.instagram) || (!content && !image)}
                  className={`
                    relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase italic tracking-wider transition duration-300 active:scale-[0.96]
                    ${isPublishing || (!platforms.facebook && !platforms.instagram) || (!content && !image)
                      ? 'bg-white/5 text-white/20 cursor-not-allowed'
                      : 'bg-gold text-navy-deep hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:-translate-y-1'
                    }
                  `}
                >
                  {isPublishing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-navy-deep/20 border-t-navy-deep rounded-full animate-spin" />
                      <span>Publication...</span>
                    </>
                  ) : published ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Publié !</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Publier</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-white/40 italic flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            Aperçu en direct
          </h2>

          <div className="sticky top-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {platforms.facebook && (
                <motion.div
                  initial={false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  className="bg-[#1877F2]/5 border border-[#1877F2]/20 rounded-2xl overflow-hidden shadow-glass"
                >
                  <div className="p-4 flex items-center gap-3 border-b border-[#1877F2]/10 bg-white/[0.02]">
                    <div className="w-10 h-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center text-[#1877F2]">
                      <FacebookIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">RCBA Officiel</p>
                      <p className="text-xs text-white/40">À l'instant • 🌎</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-white/90 text-sm whitespace-pre-wrap">{content || "Votre message apparaîtra ici..."}</p>
                  </div>
                  {image && (
                    <div className="w-full h-48 border-t border-white/5 relative">
                      <div className="absolute inset-0 bg-black/20" />
                      <img src={image} alt="Post media" className="w-full h-full object-cover" />
                    </div>
                  )}
                </motion.div>
              )}

              {platforms.instagram && (
                <motion.div
                  initial={false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                  className="bg-[#E1306C]/5 border border-[#E1306C]/20 rounded-2xl overflow-hidden shadow-glass"
                >
                  <div className="p-4 flex items-center gap-3 border-b border-[#E1306C]/10 bg-white/[0.02]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F56040] to-[#833AB4] p-[2px]">
                      <div className="w-full h-full bg-navy-deep rounded-full border-2 border-navy-deep overflow-hidden flex items-center justify-center">
                        <img src="/logo.png" alt="RCBA" className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">rcba_officiel</p>
                      <p className="text-xs text-white/40">Bû &amp; Abondant (28)</p>
                    </div>
                  </div>
                  {image ? (
                    <div className="w-full aspect-square border-y border-white/5 bg-navy-deep/50 relative">
                      <div className="absolute inset-0 bg-black/10" />
                      <img src={image} alt="Post media" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-full aspect-square border-y border-white/5 bg-navy-deep/50 flex flex-col items-center justify-center gap-2">
                      <ImagePlus className="w-8 h-8 text-white/20" />
                      <span className="text-xs text-white/30">L'image est requise pour Instagram</span>
                    </div>
                  )}
                  <div className="p-4">
                    <p className="text-white/90 text-sm whitespace-pre-wrap">
                      <span className="font-bold mr-2">rcba_officiel</span>
                      {content || "Votre légende apparaîtra ici..."}
                    </p>
                  </div>
                </motion.div>
              )}

              {!platforms.facebook && !platforms.instagram && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 text-white/30 h-64 border-dashed"
                >
                  <Send className="w-12 h-12 opacity-50" />
                  <p className="text-sm font-medium">Sélectionnez une plateforme pour voir l'aperçu</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
