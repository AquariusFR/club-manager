"use client";

import React, { useState } from "react";
import { ArrowUpRight, Shield } from "lucide-react";

const POSTE_LABELS: Record<string, { label: string; keyword: string }> = {
  gardien: { label: "Gardien", keyword: "GARDIEN" },
  defenseur: { label: "Défenseur", keyword: "DISCIPLINE" },
  milieu: { label: "Milieu", keyword: "VISION" },
  attaquant: { label: "Attaquant", keyword: "FOCUS" },
};

function detectPoste(poste?: string): { label: string; keyword: string } {
  if (!poste) return { label: "Joueur", keyword: "FORCE" };
  const p = poste.toLowerCase();
  if (p.includes("gard") || p === "gk") return POSTE_LABELS.gardien;
  if (p.includes("def") || p.includes("arr")) return POSTE_LABELS.defenseur;
  if (p.includes("mil") || p.includes("mid")) return POSTE_LABELS.milieu;
  if (p.includes("att") || p.includes("avan") || p.includes("aile")) return POSTE_LABELS.attaquant;
  return { label: poste, keyword: "IMPACT" };
}

interface PlayerPosterCardProps {
  player: {
    id?: number;
    prenom?: string;
    nom?: string;
    poste?: string;
    numero?: number | string;
    photo_url?: string;
    equipe_nom?: string;
    aptitude_technique?: number;
    aptitude_physique?: number;
    aptitude_tactique?: number;
    aptitude_mentale?: number;
  };
  index?: number;
  displayName?: string;
}

// Generate static barcode to avoid Math.random during render (ESLint purity)
const STATIC_BARS = Array.from({ length: 38 }, (_, i) => {
  const seed = (i * 137) % 251;
  const rnd = seed / 251;
  return {
    x: i * 5.2,
    width: rnd > 0.5 ? 2 : 1.2,
    height: 20 + Math.floor(((seed * 7) % 251 / 251) * 8),
  };
});

// Generates a fake barcode-like SVG pattern
function Barcode() {
  const bars = STATIC_BARS;
  return (
    <svg width="200" height="32" viewBox="0 0 200 32" className="opacity-80">
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y={32 - b.height} width={b.width} height={b.height} fill="white" />
      ))}
    </svg>
  );
}

export default function PlayerPosterCard({ player: p, index = 0, displayName }: PlayerPosterCardProps) {
  const [hovered, setHovered] = useState(false);
  const { label: posteLabel, keyword } = detectPoste(p.poste);

  // Vertical keyword letters (removed visually)
  const keywordLetters = keyword.split("");

  const hasPhoto =
    p.photo_url && !p.photo_url.includes("ui-avatars.com");

  const score = Math.round(
    ((p.aptitude_technique || 0) +
      (p.aptitude_physique || 0) +
      (p.aptitude_tactique || 0) +
      (p.aptitude_mentale || 0)) *
      5
  );

  return (
    <div
      className="relative overflow-hidden select-none group"
      style={{
        width: "280px",
        aspectRatio: "280/400",
        fontFamily: "var(--font-display, 'Outfit', sans-serif)",
        animationDelay: `${index * 60}ms`,
      }}
    >
      {/* === BASE: Dark grungy background === */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 30% 50%, #1a0808 0%, #0a0a0a 60%, #000 100%)",
        }}
      />

      {/* Noise/grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
          opacity: 0.7,
        }}
      />

      {/* Grunge horizontal scratches */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.015) 3px, rgba(255,255,255,0.015) 4px)",
        }}
      />

      {/* === RED VERTICAL STRIPE (right side) === */}
      <div
        className="absolute right-0 top-0 bottom-0"
        style={{
          width: "72px",
          background: "linear-gradient(180deg, #101f69 0%, #0b154a 50%, #152780 100%)",
          clipPath: "polygon(12px 0%, 100% 0%, 100% 100%, 0% 100%)",
          boxShadow: "-8px 0 40px rgba(16, 31, 105, 0.6)",
        }}
      >
        {/* Blue stripe grunge texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 8px)",
          }}
        />
        {/* Paint drip effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 20%, transparent 40%)",
          }}
        />
      </div>

      {/* Navy accent top bar */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "3px", background: "#101f69", boxShadow: "0 2px 20px rgba(16, 31, 105, 0.8)" }}
      />

      {/* === PLAYER PHOTO or silhouette === */}
      <div className="absolute inset-0" style={{ right: "72px" }}>
        {hasPhoto ? (
          <img
            src={
              p.photo_url!.startsWith("http") ||
              p.photo_url!.startsWith("/") ||
              p.photo_url!.startsWith("data:")
                ? p.photo_url!
                : `/images/profiles/${p.photo_url}`
            }
            alt={`${p.prenom} ${p.nom}`}
            className="w-full h-full object-cover object-center"
            style={{
              filter: "contrast(1.1) brightness(0.95) saturate(1.1)",
              maskImage:
                "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0) 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 70%, rgba(0,0,0,0) 100%)",
            }}
          />
        ) : (
          /* Silhouette placeholder */
          <div className="w-full h-full flex items-end justify-center pb-8 opacity-25">
            <svg viewBox="0 0 120 200" width="120" fill="white">
              {/* Head */}
              <ellipse cx="60" cy="28" rx="22" ry="26" />
              {/* Body */}
              <path d="M35 60 Q20 90 18 140 L102 140 Q100 90 85 60 Q72 50 60 52 Q48 50 35 60Z" />
              {/* Legs */}
              <path d="M38 138 Q32 170 30 200 L50 200 Q55 170 60 150 Q65 170 70 200 L90 200 Q88 170 82 138Z" />
            </svg>
          </div>
        )}
        {/* Dark vignette over photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />
      </div>



      {/* === POSTE LABEL horizontal (right stripe) === */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          right: 0,
          width: "72px",
          top: 0,
          bottom: 0,
          zIndex: 25,
        }}
      >
        <span
          className="font-black uppercase text-white"
          style={{ 
            fontSize: "28px", 
            letterSpacing: "8px", 
            opacity: 0.35, 
            transform: "rotate(90deg)",
            whiteSpace: "nowrap"
          }}
        >
          {posteLabel.toUpperCase()}
        </span>
      </div>

      {/* === LARGE PLAYER NAME on right stripe === */}
      <div
        className="absolute"
        style={{
          right: "4px",
          bottom: "18%",
          width: "64px",
          zIndex: 25,
          transform: "rotate(90deg)",
          transformOrigin: "bottom right",
          whiteSpace: "nowrap",
        }}
      >
        <span
          className="font-black uppercase text-white"
          style={{ fontSize: "10px", letterSpacing: "2px", opacity: 0.8 }}
        >
          #{p.numero || "—"}
        </span>
      </div>

      {/* === TOP LEFT: Club Logo + Name === */}
      <div className="absolute top-4 left-4 flex items-center gap-2.5 z-30">
        <div className="w-8 h-8 bg-white/10 border border-[#101f69] rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg shadow-[#101f69]/40">
          <img src="/logo.png" alt="RCBA" className="w-5 h-5 object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-white text-[10px] leading-none tracking-widest uppercase">
            RCBA
          </span>
          {p.equipe_nom && (
            <span className="text-white/50 text-[8px] leading-none mt-0.5 tracking-wider uppercase">
              {p.equipe_nom}
            </span>
          )}
        </div>
      </div>

      {/* === SCORE badge top right (on red) === */}
      {score > 0 && (
        <div
          className="absolute top-4 flex flex-col items-center"
          style={{ right: "10px", zIndex: 30 }}
        >
          <span
            className="font-black text-white leading-none tabular-nums"
            style={{ fontSize: "24px", textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
          >
            {score}
          </span>
          <span className="text-white/60 font-black uppercase tracking-widest" style={{ fontSize: "6px" }}>
            GÉN
          </span>
        </div>
      )}

      {/* === BOTTOM SECTION === */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-4 pb-3">
        {/* Player name block */}
        <div className="flex flex-col mb-3">
          <span
            className="font-black uppercase text-white leading-none"
            style={{
              fontSize: "clamp(20px, 5vw, 26px)",
              letterSpacing: "-0.5px",
              textShadow: "0 4px 20px rgba(0,0,0,0.9)",
              maxWidth: "180px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {displayName || p.prenom || p.nom || "JOUEUR"}
          </span>
        </div>

        {/* Bottom row removed completely to save space */}
      </div>

      {/* === HUD corners glow === */}
      {/* Top-left */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[#101f69]/80" />
      {/* Bottom-left */}
      <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[#101f69]/80" />

      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background:
            "radial-gradient(ellipse 60% 40% at 30% 50%, rgba(16, 31, 105, 0.15) 0%, transparent 80%)",
          boxShadow: "inset 0 0 60px rgba(16, 31, 105, 0.2)",
        }}
      />
    </div>
  );
}
