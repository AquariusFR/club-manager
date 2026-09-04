'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Type, Image as ImageIcon, Sparkles, AlertCircle, 
  Trash2, MousePointer2, Move, Plus, LayoutTemplate, X, Upload
} from 'lucide-react';
import { toPng } from 'html-to-image';

type ElementType = 'text' | 'image' | 'shape';

interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;
  content?: string; // For text: string content, for image: src URL
  color?: string; // For text color or shape fill
  fontSize?: number;
  fontWeight?: string;
  fontFamily?: string;
  fontStyle?: string;
  textTransform?: 'none' | 'uppercase' | 'lowercase';
  zIndex: number;
}

const DEFAULT_TEMPLATES = {
  match: [
    { id: 'bg', type: 'image', x: 0, y: 0, width: 1080, height: 1080, content: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop', zIndex: 0 },
    { id: 'overlay', type: 'shape', x: 0, y: 0, width: 1080, height: 1080, color: 'rgba(10, 17, 40, 0.7)', zIndex: 1 },
    { id: 'logo1', type: 'image', x: 64, y: 64, width: 150, height: 150, content: '/logo.png', zIndex: 2 },
    { id: 'badge', type: 'shape', x: 650, y: 80, width: 350, height: 60, color: '#FFD700', zIndex: 2 },
    { id: 'comp', type: 'text', x: 670, y: 92, content: 'CHAMPIONNAT DE FRANCE', color: '#0A1128', fontSize: 24, fontWeight: '900', fontStyle: 'italic', zIndex: 3 },
    { id: 'rcba', type: 'text', x: 64, y: 400, content: 'RCBA', color: '#FFFFFF', fontSize: 140, fontWeight: '900', fontStyle: 'italic', zIndex: 2 },
    { id: 'vs', type: 'text', x: 480, y: 440, content: 'VS', color: '#FFD700', fontSize: 80, fontWeight: '900', fontStyle: 'italic', zIndex: 2 },
    { id: 'opp', type: 'text', x: 650, y: 400, content: 'RC VANNES', color: '#FFFFFF', fontSize: 120, fontWeight: '900', fontStyle: 'italic', zIndex: 2 },
    { id: 'title', type: 'text', x: 64, y: 800, content: 'JOUR DE MATCH', color: '#FFD700', fontSize: 100, fontWeight: '900', fontStyle: 'italic', zIndex: 2 },
    { id: 'date', type: 'text', x: 64, y: 950, content: 'SAMEDI 24 JUIN • 20H00', color: '#FFFFFF', fontSize: 32, fontWeight: '700', zIndex: 2 },
  ] as CanvasElement[],
  result: [
    { id: 'bg', type: 'image', x: 0, y: 0, width: 1080, height: 1080, content: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop', zIndex: 0 },
    { id: 'overlay', type: 'shape', x: 0, y: 0, width: 1080, height: 1080, color: 'rgba(10, 17, 40, 0.8)', zIndex: 1 },
    { id: 'logo1', type: 'image', x: 465, y: 64, width: 150, height: 150, content: '/logo.png', zIndex: 2 },
    { id: 'title', type: 'text', x: 300, y: 250, content: 'RÉSULTAT FINAL', color: '#FFD700', fontSize: 80, fontWeight: '900', fontStyle: 'italic', zIndex: 2 },
    { id: 'score1', type: 'text', x: 200, y: 450, content: '24', color: '#FFD700', fontSize: 200, fontWeight: '900', zIndex: 2 },
    { id: 'dash', type: 'text', x: 480, y: 500, content: '-', color: '#FFFFFF', fontSize: 120, fontWeight: '900', zIndex: 2 },
    { id: 'score2', type: 'text', x: 650, y: 450, content: '12', color: '#FFFFFF', fontSize: 200, fontWeight: '900', zIndex: 2 },
    { id: 'opp', type: 'text', x: 650, y: 700, content: 'RC VANNES', color: '#FFFFFF', fontSize: 60, fontWeight: '900', fontStyle: 'italic', zIndex: 2 },
    { id: 'rcba', type: 'text', x: 180, y: 700, content: 'RCBA', color: '#FFD700', fontSize: 60, fontWeight: '900', fontStyle: 'italic', zIndex: 2 },
  ] as CanvasElement[]
};

export default function StudioPage() {
  const [elements, setElements] = useState<CanvasElement[]>(DEFAULT_TEMPLATES.match);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [canvasBg, setCanvasBg] = useState('#0A1128');
  const [canvasFormat, setCanvasFormat] = useState<'square' | 'portrait' | 'story'>('square');
  
  const dimensions = {
    square: { w: 1080, h: 1080, name: 'Carré (1080x1080)' },
    portrait: { w: 1080, h: 1350, name: 'Portrait (1080x1350)' },
    story: { w: 1080, h: 1920, name: 'Story (1080x1920)' }
  };
  const currentDim = dimensions[canvasFormat];
  
  const posterRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5555);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        // Adjust scale based on the container width and the canvas format
        setScale(entry.contentRect.width / currentDim.w);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // If clicking inside the canvas but not on an element, deselect
      // For simplicity, we just use the wrapper div onClick handler instead.
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addText = () => {
    const newEl: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100,
      content: 'Nouveau Texte',
      color: '#FFFFFF',
      fontSize: 80,
      fontWeight: '900',
      zIndex: elements.length + 1
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    const newEl: CanvasElement = {
      id: `img-${Date.now()}`,
      type: 'image',
      x: 100,
      y: 100,
      width: 400,
      height: 400,
      content: url,
      zIndex: elements.length + 1
    };
    setElements([...elements, newEl]);
    setSelectedId(newEl.id);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    setElements(els => els.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const bringForward = (id: string) => {
    setElements(els => {
      const highestZ = Math.max(...els.map(e => e.zIndex), 0);
      return els.map(el => el.id === id ? { ...el, zIndex: highestZ + 1 } : el);
    });
  };

  const sendBackward = (id: string) => {
    setElements(els => {
      const lowestZ = Math.min(...els.map(e => e.zIndex), 0);
      return els.map(el => el.id === id ? { ...el, zIndex: lowestZ - 1 } : el);
    });
  };

  const removeElement = (id: string) => {
    setElements(els => els.filter(e => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const exportPoster = useCallback(async () => {
    if (posterRef.current === null) return;
    setIsExporting(true);
    // Deselect before export so outlines disappear
    const currentSelected = selectedId;
    setSelectedId(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const dataUrl = await toPng(posterRef.current, { 
        quality: 1, 
        pixelRatio: 2,
        cacheBust: true,
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });
      const link = document.createElement('a');
      link.download = `rcba-affiche-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsExporting(false);
      setSelectedId(currentSelected);
    }
  }, [selectedId]);

  const selectedElement = elements.find(e => e.id === selectedId);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white athletic-title athletic-skew flex items-center gap-4">
            STUDIO <span className="text-gold">CRÉATIF</span>
          </h1>
          <p className="text-white/40 mt-2 font-medium">Glissez, déposez et modifiez tout à volonté !</p>
        </div>
        
        <button
          onClick={exportPoster}
          disabled={isExporting}
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gold text-navy-deep font-black uppercase italic tracking-wider hover:shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:-translate-y-1 transition duration-300 active:scale-[0.96] disabled:opacity-50"
        >
          {isExporting ? (
            <div className="w-5 h-5 border-2 border-navy-deep/20 border-t-navy-deep rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          <span>Télécharger (PNG)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Editor Controls (Left) */}
        <div className="lg:col-span-4 space-y-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />

          {!selectedElement ? (
            // GLOBAL SETTINGS
            <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 shadow-glass-luminous space-y-6 animate-in fade-in slide-in-from-left-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-white/40 italic flex items-center gap-2 mb-4">
                <LayoutTemplate className="w-4 h-4" />
                Paramètres Globaux
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <button onClick={addText} className="p-4 rounded-2xl border bg-white/[0.02] border-white/5 text-white hover:bg-white/[0.05] flex flex-col items-center gap-2 transition">
                  <Type className="w-6 h-6 text-gold" />
                  <span className="font-bold text-xs">Ajouter Texte</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="p-4 rounded-2xl border bg-white/[0.02] border-white/5 text-white hover:bg-white/[0.05] flex flex-col items-center gap-2 transition">
                  <ImageIcon className="w-6 h-6 text-gold" />
                  <span className="font-bold text-xs">Ajouter Image</span>
                </button>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-white/40 uppercase">Format du Cadrage</h3>
                <div className="flex flex-col gap-2">
                  {(Object.keys(dimensions) as Array<keyof typeof dimensions>).map(fmt => (
                    <button 
                      key={fmt}
                      onClick={() => setCanvasFormat(fmt)} 
                      className={`px-4 py-3 text-xs font-bold rounded-xl border transition-colors ${canvasFormat === fmt ? 'bg-gold text-navy-deep border-gold' : 'border-white/10 bg-white/5 hover:bg-white/10 text-white'}`}
                    >
                      {dimensions[fmt].name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <h3 className="text-xs font-bold text-white/40 uppercase">Modèles rapides</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => { setElements(DEFAULT_TEMPLATES.match); setSelectedId(null); }} className="px-4 py-3 text-xs font-bold rounded-xl border border-white/10 bg-white/5 hover:bg-gold hover:text-navy-deep transition-colors">
                    Jour de Match
                  </button>
                  <button onClick={() => { setElements(DEFAULT_TEMPLATES.result); setSelectedId(null); }} className="px-4 py-3 text-xs font-bold rounded-xl border border-white/10 bg-white/5 hover:bg-gold hover:text-navy-deep transition-colors">
                    Résultat
                  </button>
                </div>
              </div>

              {/* Quick Text Editor */}
              {elements.filter(e => e.type === 'text').length > 0 && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="text-xs font-bold text-gold flex items-center gap-2 uppercase tracking-widest">
                    <Type className="w-4 h-4" />
                    Textes Rapides
                  </h3>
                  <p className="text-xs text-white/40">Modifiez directement le texte de l'affiche ici :</p>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {elements.filter(e => e.type === 'text').map(el => (
                      <div key={`quick-${el.id}`} className="space-y-1">
                        <textarea 
                          value={el.content || ''}
                          onChange={(e) => updateElement(el.id, { content: e.target.value })}
                          onClick={() => setSelectedId(el.id)}
                          rows={2}
                          style={{ resize: 'vertical', minHeight: '50px' }}
                          className="w-full bg-navy-deep border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-gold/50 custom-scrollbar"
                          placeholder="Entrez votre texte (Entrée pour passer à la ligne)"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // ELEMENT PROPERTIES
            <div className="bg-white/[0.02] border border-gold/30 rounded-[2rem] p-6 shadow-[0_0_30px_rgba(255,215,0,0.05)] space-y-6 animate-in fade-in slide-in-from-left-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black uppercase tracking-widest text-gold italic flex items-center gap-2">
                  <MousePointer2 className="w-4 h-4" />
                  Élément Sélectionné
                </h2>
                <button onClick={() => setSelectedId(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedElement.type === 'text' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Texte</label>
                    <textarea 
                      value={selectedElement.content || ''} 
                      onChange={e => updateElement(selectedElement.id, { content: e.target.value })}
                      className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 min-h-[100px] resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Couleur</label>
                      <input 
                        type="color" 
                        value={selectedElement.color || '#FFFFFF'} 
                        onChange={e => updateElement(selectedElement.id, { color: e.target.value })}
                        className="w-full h-12 bg-navy-deep border border-white/10 rounded-xl px-2 py-1 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Taille</label>
                      <input 
                        type="number" 
                        value={selectedElement.fontSize || 40} 
                        onChange={e => updateElement(selectedElement.id, { fontSize: Number(e.target.value) })}
                        className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-3 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">Style</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateElement(selectedElement.id, { fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' })}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border ${selectedElement.fontStyle === 'italic' ? 'bg-gold text-navy-deep border-gold' : 'bg-white/5 border-white/10 text-white'}`}
                      >
                        Italique
                      </button>
                      <button 
                        onClick={() => updateElement(selectedElement.id, { fontWeight: selectedElement.fontWeight === '900' ? '400' : '900' })}
                        className={`flex-1 py-2 rounded-lg text-sm border ${selectedElement.fontWeight === '900' ? 'bg-gold text-navy-deep border-gold font-black' : 'bg-white/5 border-white/10 text-white font-normal'}`}
                      >
                        Gras
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedElement.type === 'image' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase">URL de l'image (ou Upload)</label>
                    <input 
                      type="text" 
                      value={selectedElement.content || ''} 
                      onChange={e => updateElement(selectedElement.id, { content: e.target.value })}
                      className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-3 text-white text-xs"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full mt-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" /> Importer un fichier
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Largeur (px)</label>
                      <input 
                        type="number" 
                        value={selectedElement.width || 200} 
                        onChange={e => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                        className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-3 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Hauteur (px)</label>
                      <input 
                        type="number" 
                        value={selectedElement.height || 200} 
                        onChange={e => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                        className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-3 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedElement.type === 'shape' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Couleur (Hex ou RGBA)</label>
                      <input 
                        type="text" 
                        value={selectedElement.color || '#FFFFFF'} 
                        onChange={e => updateElement(selectedElement.id, { color: e.target.value })}
                        className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-3 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Largeur</label>
                      <input 
                        type="number" 
                        value={selectedElement.width || 1080} 
                        onChange={e => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                        className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-3 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Hauteur</label>
                      <input 
                        type="number" 
                        value={selectedElement.height || 1080} 
                        onChange={e => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                        className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-3 text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Actions Communes */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <button 
                  onClick={() => bringForward(selectedElement.id)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Move className="w-4 h-4" /> Mettre au premier plan
                </button>
                <button 
                  onClick={() => sendBackward(selectedElement.id)}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Move className="w-4 h-4 rotate-180" /> Passer au plan en dessous
                </button>
                <button 
                  onClick={() => removeElement(selectedElement.id)}
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Supprimer l'élément
                </button>
              </div>
            </div>
          )}

          <div className="p-4 rounded-xl bg-gold/5 border border-gold/10 flex items-start gap-3 mt-6">
            <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <p className="text-sm text-gold/80 leading-relaxed">
              Cliquez sur n'importe quel texte ou logo sur l'affiche à droite pour le modifier. Vous pouvez les glisser-déposer avec votre souris !
            </p>
          </div>
        </div>

        {/* Live Preview / Canvas (Right) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-white/40 italic flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Zone de Création
            </h2>
            <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-white/60">{currentDim.w} x {currentDim.h}px</div>
          </div>

          <div className="bg-[#050814] border border-white/10 rounded-[2rem] p-4 lg:p-8 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Wrapper to scale the canvas down to fit the screen visually */}
            <div 
              ref={containerRef}
              className="w-full max-w-[600px] relative bg-checkerboard rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
              style={{ aspectRatio: `${currentDim.w} / ${currentDim.h}` }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedId(null);
              }}
            >
              <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: currentDim.w, height: currentDim.h }}>
                <div 
                  ref={posterRef}
                  className="absolute top-0 left-0 origin-top-left overflow-hidden"
                  style={{ 
                    width: currentDim.w, 
                    height: currentDim.h, 
                    backgroundColor: canvasBg 
                  }}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) setSelectedId(null);
                  }}
                >
                  {/* Render Elements */}
                {elements.sort((a, b) => a.zIndex - b.zIndex).map((el) => {
                  const isSelected = selectedId === el.id;
                  
                  return (
                    <motion.div
                      key={el.id}
                      drag
                      dragMomentum={false}
                      onDragEnd={(event, info) => {
                        updateElement(el.id, { 
                          x: el.x + info.offset.x, 
                          y: el.y + info.offset.y 
                        });
                      }}
                      onPointerDown={() => setSelectedId(el.id)}
                      style={{
                        position: 'absolute',
                        x: el.x,
                        y: el.y,
                        zIndex: el.zIndex,
                        cursor: 'grab'
                      }}
                      whileDrag={{ cursor: 'grabbing', scale: 1.02 }}
                      className={`
                        ${isSelected ? 'ring-4 ring-gold ring-offset-4 ring-offset-transparent outline-none' : ''}
                      `}
                    >
                      {el.type === 'text' && (
                        <div style={{
                          color: el.color,
                          fontSize: `${el.fontSize}px`,
                          fontWeight: el.fontWeight,
                          fontFamily: el.fontFamily || 'sans-serif',
                          fontStyle: el.fontStyle,
                          whiteSpace: 'pre-wrap',
                          lineHeight: 1.1
                        }}>
                          {el.content}
                        </div>
                      )}

                      {el.type === 'image' && el.content && (
                        <img 
                          src={el.content} 
                          alt="" 
                          style={{
                            width: `${el.width}px`,
                            height: `${el.height}px`,
                            objectFit: 'cover',
                            pointerEvents: 'none' // important for drag
                          }}
                        />
                      )}

                      {el.type === 'shape' && (
                        <div 
                          style={{
                            width: `${el.width}px`,
                            height: `${el.height}px`,
                            backgroundColor: el.color,
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
