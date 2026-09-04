'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShoppingBag, Sparkles, Info } from 'lucide-react';
import Image from 'next/image';
import BoutiqueReservationModal from './BoutiqueReservationModal';

import { UserSession } from '@/lib/authentication';

interface ProductProps {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  tag?: string;
  specs: string[];
}

interface BoutiqueProductCardProps {
  product: ProductProps;
  session?: UserSession | null;
}

export default function BoutiqueProductCard({ product, session }: BoutiqueProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Magnetic rotation effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer"
    >
      <div 
        className="relative glass-card border-white/10 overflow-hidden bg-navy-deep/60 p-1 transition duration-500 group-hover:border-gold/30 group-hover:shadow-glass-luminous"
        style={{ transform: "translateZ(50px)" }}
      >
        {/* Product Image Container */}
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-white/5">
          <Image 
            src={product.image} 
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Badge */}
          {product.tag && (
            <div className="absolute top-4 left-4 z-10">
              <div className="px-3 py-1 rounded-full bg-gold/90 text-navy-deep text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
                <Sparkles size={10} /> {product.tag}
              </div>
            </div>
          )}

          {/* Combat Grade Metadata */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent opacity-60" />
          
          <div className="absolute bottom-4 left-4 right-4 z-10 translate-y-2 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
             <div className="flex flex-wrap gap-1.5">
               {product.specs.map((spec, i) => (
                 <span key={i} className="text-[8px] font-bold px-2 py-0.5 rounded bg-white/10 border border-white/5 text-white/80 uppercase">
                   {spec}
                 </span>
               ))}
             </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex flex-col gap-2 mb-2">
            <div className="flex items-center justify-between">
               <span className="text-[10px] font-black text-gold/60 uppercase tracking-widest">{product.category}</span>
               <span className="text-sm font-black text-navy-deep bg-pitch-green px-2 py-0.5">{product.price}</span>
            </div>
            <div className="flex items-center">
               <span className="text-[9px] font-black uppercase text-red-600 bg-red-100 px-1.5 py-0.5 border border-red-200">Stock Limité</span>
            </div>
          </div>
          <h3 className="athletic-title text-xl italic uppercase tracking-tight text-white mb-6 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-3 mt-auto">
             <button 
               onClick={() => setIsModalOpen(true)}
               className="flex-1 py-3 bg-white text-navy-deep border-2 border-navy-deep hover:bg-pitch-green transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-[2px_2px_0_0_#d4af37] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transform -skew-x-6 group/btn"
             >
               <span className="transform skew-x-6 flex items-center gap-2">
                 <ShoppingBag size={14} className="group-hover/btn:scale-110 transition-transform" />
                 Je commande
               </span>
             </button>
             <button className="w-12 h-12 shrink-0 bg-navy-deep border-2 border-gold flex items-center justify-center text-gold hover:bg-gold hover:text-navy-deep transition-all transform -skew-x-6 shadow-[2px_2px_0_0_rgba(255,255,255,0.1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
                <Info size={18} className="transform skew-x-6" />
             </button>
          </div>
        </div>

        {/* HUD Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold/0 group-hover:border-gold/40 transition-colors duration-500" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/40 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold/0 group-hover:border-gold/40 transition-colors duration-500" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold/0 group-hover:border-gold/40 transition-colors duration-500" />
      </div>

      <BoutiqueReservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{ id: product.id, name: product.name, price: product.price }}
        session={session}
      />
    </motion.div>
  );
}
