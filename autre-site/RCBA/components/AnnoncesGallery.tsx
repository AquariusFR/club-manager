"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ZoomIn, X, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const annonces = [
  {
    src: "/annonces/annonce-4.jpg",
    alt: "Tournoi Futsal d'Hiver",
    link: "/club/contact"
  },
  {
    src: "/annonces/annonce-1.jpg",
    alt: "Stage Vacances Toussaint",
    link: "/club/contact"
  },
  {
    src: "/annonces/annonce-2.jpg",
    alt: "Inscriptions École de Foot",
    link: "/club/contact"
  },
  {
    src: "/annonces/annonce-3.jpg",
    alt: "Soirée des Partenaires",
    link: "/club/contact"
  }
];

export default function AnnoncesGallery() {
  const [selectedImage, setSelectedImage] = useState<typeof annonces[0] | null>(null);

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {annonces.map((annonce, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedImage(annonce)}
            className="group relative rounded-3xl overflow-hidden aspect-[4/5] border border-white/10 hover:border-gold/50 transition duration-500 shadow-2xl hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] bg-navy-light/50 cursor-pointer active:scale-[0.96]"
          >
            <Image 
              src={annonce.src} 
              alt={annonce.alt} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
              <span className="text-gold font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                Agrandir l'image <ZoomIn size={16} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition duration-300 active:scale-[0.90]"
            >
              <X size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh] md:h-[75vh]">
                <Image 
                  src={selectedImage.src} 
                  alt={selectedImage.alt} 
                  fill 
                  className="object-contain"
                />
              </div>
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                <h3 className="text-white font-bold text-xl">{selectedImage.alt}</h3>
                <Link 
                  href={selectedImage.link} 
                  className="px-6 py-3 bg-gold text-navy-deep font-black uppercase tracking-widest text-sm rounded-full hover:bg-white transition duration-300 active:scale-[0.96] flex items-center gap-2"
                  onClick={() => setSelectedImage(null)}
                >
                  Nous contacter <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
