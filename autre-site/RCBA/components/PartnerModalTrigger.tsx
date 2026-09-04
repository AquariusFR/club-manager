'use client';

import { useState } from 'react';
import { Handshake } from 'lucide-react';
import PartnerFormModal from './PartnerFormModal';

export default function PartnerModalTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="group p-8 border-2 border-gold bg-navy-deep hover:bg-navy-light transition-colors duration-300 relative overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer brutal-shadow rounded-none"
      >
        <div className="w-16 h-16 border-2 border-gold bg-navy-light flex items-center justify-center text-gold mb-6 group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[4px_4px_0_0_#D4AF37] transition-all rounded-none">
            <Handshake size={32} />
        </div>
        <h5 className="text-xl font-black italic uppercase text-white athletic-title athletic-skew mb-4">REJOINDRE LE CERCLE</h5>
        <p className="text-[10px] text-white/40 italic uppercase tracking-widest mb-6 leading-relaxed">
            Déployez votre marque au sein du RCBA
        </p>
        <div className="text-[9px] font-black uppercase tracking-widest bg-gold text-navy-deep px-6 py-3 rounded-none border-2 border-gold transition-all hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0_0_#D4AF37] hover:shadow-none">
            Devenir Partenaire
        </div>
      </div>

      <PartnerFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
