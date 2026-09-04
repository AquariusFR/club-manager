export interface PalmaresItem {
  id: number;
  titre: string;
  competition: string;
  saison: string;
  medaille: string;
}

interface PalmaresProps {
  items?: PalmaresItem[];
}

export default function Palmares({ items = [] }: PalmaresProps) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent rounded-3xl pointer-events-none" />
      <div className="text-center mb-14">
        <div className="label-overline mb-3">Histoire & Gloire</div>
        <h2 className="athletic-title text-4xl italic">PALMARÈS <span className="text-gold">RCBA</span></h2>
        <p className="text-white/50 text-sm mt-4 italic">Les grandes étapes qui font l'histoire du Racing Club Bû Abondant</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <div key={p.id} className="bg-navy border-4 border-navy-deep p-8 hover:border-gold hover:bg-navy-light transition duration-300 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#D4AF37] shadow-[6px_6px_0_0_#0a192f] group flex items-start gap-6 cursor-default transform -skew-x-2">
            <div className="text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 transform skew-x-2">{p.medaille}</div>
            <div className="transform skew-x-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-gold mb-2 bg-navy-deep inline-block px-2 py-1">{p.saison}</div>
              <h3 className="font-black text-white text-lg uppercase tracking-tight group-hover:text-gold transition-colors mb-1 athletic-title">{p.titre}</h3>
              <p className="text-[11px] text-white/70 italic font-bold tracking-wider">{p.competition}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
