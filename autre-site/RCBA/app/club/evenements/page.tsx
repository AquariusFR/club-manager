import { getSession } from "@/lib/authentication";
import PageLabel from "@/components/PageLabel";
import MajorEvents from "@/components/home/MajorEvents";
import AnnoncesGallery from "@/components/AnnoncesGallery";

export default async function EvenementsPage() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-navy-deep text-white selection:bg-gold/30 pb-40">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <PageLabel 
          section="Le Club" 
          category="Vie du Club" 
          title="Événements" 
          subtitle="Tournois, stages, soirées club : retrouvez tous les événements majeurs de la saison."
          icon="club"
          variant="gold"
        />

        <div className="mt-24">
          <MajorEvents />
        </div>

        <div className="mt-32">
          <div className="text-center mb-14">
            <div className="label-overline mb-3">À la Une</div>
            <h2 className="athletic-title text-4xl italic">ANNONCES <span className="text-gold">CLUB</span></h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto">Retrouvez les dernières affiches et communications officielles du RCBA.</p>
          </div>
          <AnnoncesGallery />
        </div>
      </div>
    </main>
  );
}
