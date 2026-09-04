import Image from "next/image";

export default function MajorEvents() {
  return (
    <section className="mt-32">
      <div className="text-center mb-14">
        <div className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest mb-4 border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.3)]">À la Une</div>
        <h2 className="athletic-title text-5xl italic drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">ÉVÉNEMENTS <span className="text-gold">MAJEURS</span></h2>
        <p className="text-white/60 text-lg mt-4 italic max-w-2xl mx-auto">
          Le RCBA est incroyablement fier de ses joueurs ! Retour en images sur les moments forts qui font vibrer le club. Continuez à porter haut nos couleurs, bravo à tous pour votre détermination et vos résultats exceptionnels !
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Victoire U13 - Tournoi Jouy */}
        <div className="glass-card glass-shine p-8 border border-gold/40 shadow-[0_0_50px_rgba(212,175,55,0.2)] rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/20 blur-[60px] rounded-full pointer-events-none" />
          
          <h3 className="athletic-title text-3xl italic text-white mb-2 text-center drop-shadow-md z-10">VICTOIRE U13</h3>
          <p className="text-gold font-bold uppercase tracking-widest text-sm mb-8 text-center z-10">Tournoi de Jouy</p>
          
          <div className="relative z-10 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 bg-black">
            <video 
              src="/videos/victoire-u13.mp4" 
              className="w-full h-full object-contain"
              autoPlay 
              loop 
              muted 
              playsInline
              controls
            ></video>
          </div>
          <div className="mt-6 text-center z-10">
            <p className="text-white/80 font-medium text-base leading-snug drop-shadow-md">
              Un immense bravo à nos U13 pour leur victoire éclatante et leur esprit d'équipe exemplaire. Vous êtes le futur du club, la relève est assurée ! 🏆
            </p>
          </div>
        </div>

        {/* Tournoi d'Ivry-la-Bataille */}
        <div className="glass-card glass-shine p-8 border border-white/10 shadow-2xl rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-gold/30 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] transition duration-500">
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none" />
          
          <h3 className="athletic-title text-3xl italic text-white mb-2 text-center drop-shadow-md z-10">TOURNOI D'IVRY</h3>
          <p className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-8 text-center z-10">La Bataille - Nos Jeunes</p>
          
          <div className="relative z-10 w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 group-hover:scale-[1.02] transition-transform duration-700 cursor-pointer">
            <Image 
              src="/actualites/tournoi-ivry.jpg" 
              alt="Tournoi d'Ivry-la-Bataille" 
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
              <p className="text-white font-medium text-lg leading-snug drop-shadow-md">
                Félicitations à nos jeunes pour leur superbe parcours au Tournoi d'Ivry-la-Bataille ! Votre combativité fait notre fierté. 👏
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
