'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import PerformanceMonitor from './PerformanceMonitor';

interface Point { x: number; y: number; }
interface Node { id: string; x: number; y: number; color: string; }

interface MatrixDiscoveryRendererProps {
  nodes: Node[];
  activeNodeId?: string;
  discoveryPaths?: string[];
}

const DISCOVERY_PATHS = [
  '/api/v1/scouting',
  '/neural/synapse/0x0A',
  '/tactical/vector/grid',
  '/auth/pulse/check',
  '/buvette/flux/delta',
  '/direction/authorization',
  '/scouting/prospect/U15',
  '/neural/core/initialize',
  '/system/integrity/high',
  '/vector/velocity/max',
];

const MAX_PARTICLES_HIGH = 80;   
const MAX_PARTICLES_LOW  = 20;
const RAIN_COUNT        = 40;    

export default function MatrixDiscoveryRenderer({
  nodes,
  activeNodeId,
  discoveryPaths = DISCOVERY_PATHS,
}: MatrixDiscoveryRendererProps) {
  const [maxParticles, setMaxParticles] = useState(MAX_PARTICLES_HIGH);
  const [showPerf, setShowPerf] = useState(false);
  
  const containerRef   = useRef<HTMLDivElement>(null);
  const appRef         = useRef<PIXI.Application | null>(null);
  const particlesRef   = useRef<any[]>([]);
  const rainRef        = useRef<any[]>([]);
  // Live refs so the ticker reads current values without triggering re-init
  const activeNodeRef  = useRef<string | undefined>(activeNodeId);
  const nodesRef       = useRef<Node[]>(nodes);

  // ── Keep live refs in sync (no effect re-run, no canvas rebuild) ──
  useEffect(() => { activeNodeRef.current = activeNodeId; }, [activeNodeId]);
  useEffect(() => { nodesRef.current = nodes; }, [nodes]);

  // ── One-time canvas initialization ───────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    let isMounted = true;
    let onMouseMove: ((e: MouseEvent) => void) | null = null;
    let onMouseLeave: (() => void) | null = null;

    const initPixi = async () => {
      const app = new PIXI.Application();
      await app.init({
        resizeTo: containerRef.current!,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        // Prefer WebGPU if available, fall back to WebGL
        preference: 'webgpu',
      });

      if (!isMounted) {
        app.destroy(true, { children: true });
        return;
      }

      appRef.current = app;
      containerRef.current!.appendChild(app.canvas);

      // ── Containers ──
      const rainContainer    = new PIXI.Container();
      const synapseContainer = new PIXI.Container();
      app.stage.addChild(rainContainer);
      app.stage.addChild(synapseContainer);

      // ── Matrix Rain (Path Discovery) — static pool ──
      const textStyle = new PIXI.TextStyle({
        fontFamily: 'monospace',
        fontSize: 10,
        fill: '#d4af37',
        fontWeight: '900',
        align: 'left',
      });

      const createRainDrop = () => {
        const path  = discoveryPaths[Math.floor(Math.random() * discoveryPaths.length)];
        const text  = new PIXI.Text({ text: path, style: textStyle });
        text.x      = Math.random() * app.screen.width;
        text.y      = -100 - Math.random() * 500;
        text.alpha  = 0.08 + Math.random() * 0.18;
        (text as any).speed = 0.8 + Math.random() * 1.8;
        rainContainer.addChild(text);
        return text;
      };

      for (let i = 0; i < RAIN_COUNT; i++) {
        rainRef.current.push(createRainDrop());
      }

      // ── Shared particle texture (generated once) ──
      const gfx = new PIXI.Graphics().circle(0, 0, 1.5).fill({ color: 0xd4af37, alpha: 0.8 });
      const particleTexture = app.renderer.generateTexture(gfx);
      gfx.destroy();

      const createParticle = (origin: Point, target: Point, color: string) => {
        const p    = new PIXI.Sprite(particleTexture);
        p.anchor.set(0.5);
        p.tint     = color as any;
        p.x        = origin.x;
        p.y        = origin.y;
        (p as any).targetX   = target.x;
        (p as any).targetY   = target.y;
        (p as any).originX   = origin.x;
        (p as any).originY   = origin.y;
        (p as any).progress  = 0;
        (p as any).speed     = 0.008 + Math.random() * 0.016;
        synapseContainer.addChild(p);
        return p;
      };

      // ── Mouse Glow (interaction layer) ──
      const glowGfx  = new PIXI.Graphics().circle(0, 0, 40).fill({ color: 0xd4af37, alpha: 0.12 });
      const mouseGlow = new PIXI.Sprite(app.renderer.generateTexture(glowGfx));
      glowGfx.destroy();
      mouseGlow.anchor.set(0.5);
      mouseGlow.blendMode = 'add' as any;
      mouseGlow.visible   = false;
      app.stage.addChild(mouseGlow);

      onMouseMove = (event: MouseEvent) => {
        if (!containerRef.current) return;
        const rect   = containerRef.current.getBoundingClientRect();
        mouseGlow.x  = event.clientX - rect.left;
        mouseGlow.y  = event.clientY - rect.top;
        mouseGlow.visible = true;
      };
      onMouseLeave = () => { mouseGlow.visible = false; };

      // Attach to container (not window) to avoid global leak
      containerRef.current!.addEventListener('mousemove', onMouseMove);
      containerRef.current!.addEventListener('mouseleave', onMouseLeave);

      // ── Ticker ──
      app.ticker.add(() => {
        const t = Date.now();
        const fps = app.ticker.FPS;

        // Dynamic Quality Adjustment (Low Power Fallback)
        if (fps < 50) {
          setMaxParticles(MAX_PARTICLES_LOW);
        } else if (fps > 58) {
          setMaxParticles(MAX_PARTICLES_HIGH);
        }

        // Mouse glow pulse
        if (mouseGlow.visible) {
          mouseGlow.alpha = 0.25 + Math.sin(t / 220) * 0.08;
          mouseGlow.scale.set(1 + Math.sin(t / 520) * 0.06);
        }

        // Rain scroll
        rainRef.current.forEach((drop) => {
          drop.y += drop.speed;
          if (drop.y > (appRef.current?.screen.height ?? 800) + 100) {
            drop.y = -100 - Math.random() * 200;
            drop.x = Math.random() * (appRef.current?.screen.width ?? 1200);
            // Refresh the path text
            drop.text = discoveryPaths[Math.floor(Math.random() * discoveryPaths.length)];
          }
        });

        // Spawn particles — only if under the cap
        const currentActiveId = activeNodeRef.current;
        const currentNodes    = nodesRef.current;
        if (
          currentActiveId &&
          particlesRef.current.length < maxParticles &&
          Math.random() > 0.93
        ) {
          const node = currentNodes.find(n => n.id === currentActiveId);
          if (node) {
            const w = appRef.current?.screen.width  ?? 800;
            const h = appRef.current?.screen.height ?? 600;
            particlesRef.current.push(
              createParticle(
                { x: w / 2, y: h / 2 },
                { x: (node.x / 100) * w, y: (node.y / 100) * h },
                node.color,
              )
            );
          }
        }

        // Advance & recycle particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.progress += p.speed;

          const dx = p.targetX - p.originX;
          const dy = p.targetY - p.originY;
          p.x      = p.originX + dx * p.progress;
          p.y      = p.originY + dy * p.progress;
          p.alpha  = 1 - p.progress;
          p.scale.set(0.4 + p.progress * 0.6);

          if (p.progress >= 1) {
            synapseContainer.removeChild(p);
            particlesRef.current.splice(i, 1);
          }
        }
      });
    };

    initPixi();

    return () => {
      isMounted = false;

      // Remove listeners before destroying
      if (containerRef.current && onMouseMove)  containerRef.current.removeEventListener('mousemove',  onMouseMove);
      if (containerRef.current && onMouseLeave) containerRef.current.removeEventListener('mouseleave', onMouseLeave);

      // Drain refs
      rainRef.current     = [];
      particlesRef.current = [];

      if (appRef.current) {
        appRef.current.destroy(true, { children: true, texture: true });
        appRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // ← intentionally empty: canvas is initialized once; activeNodeId updates via ref

  return (
    <div className="absolute inset-0 z-0 pointer-events-auto opacity-40 mix-blend-screen" aria-hidden="true">
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Dev Toggle for Performance HUD */}
      <div className="absolute top-4 right-4 z-50 flex flex-col items-end gap-2">
        <button 
          onClick={() => setShowPerf(!showPerf)}
          className="px-2 py-1 bg-navy-deep/40 backdrop-blur-md border border-white/10 rounded text-[8px] font-black uppercase tracking-widest text-white/40 hover:text-gold hover:border-gold/30 transition"
        >
          {showPerf ? 'Hide Perf' : 'Show Perf'}
        </button>
        <PerformanceMonitor show={showPerf} className="scale-75 origin-top-right" />
      </div>
    </div>
  );
}
