import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import PageLabel from "@/components/PageLabel";

import { 
  Dumbbell, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Brain,
  Zap,
  Shield,
  Save,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

export default async function NewTrainingSessionPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const db = await getDb();
  // Fetch teams coached by current user
  const teams = await db.all("SELECT id, nom FROM Equipes ORDER BY nom ASC");

  return (
    <main className="min-h-screen bg-navy-deep relative overflow-hidden">

      <div className="container mx-auto px-6 py-12 relative z-10">
        <header className="mb-16">
          <Link href="/coach/training" className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors mb-8 group">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Retour à la liste
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <PageLabel 
              section="Staff"
              category="Planification"
              title="Nouvelle Session"
              subtitle="Programmation tactique et déploiement d'une nouvelle unité d'entraînement."
              variant="green"
              icon="coach"
            />
            
            <button className="px-10 py-5 bg-gold text-navy-deep athletic-title text-sm italic rounded-xl hover:bg-gold-bright transition flex items-center gap-3 group shadow-[0_0_40px_rgba(212,175,55,0.2)]">
              <Save size={18} />
              Finaliser le Plan
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-10">
            {/* Core Config */}
            <div className="glass-card p-10 border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/80 mb-10 italic">
                <Zap size={18} className="text-gold" /> Configuration <span className="text-gold">Primaire</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/70 px-2 flex items-center gap-2">
                    <Clock size={12} className="text-gold" /> Date & Heure
                  </label>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-4 text-[11px] font-medium text-white focus:border-gold outline-none transition uppercase tracking-widest"
                  />
                </div>
                
                <div className="space-y-4">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/70 px-2 flex items-center gap-2">
                    <Shield size={12} className="text-gold" /> Sélection de l'Équipe
                  </label>
                  <select className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-4 text-[11px] font-medium text-white focus:border-gold outline-none transition uppercase tracking-widest appearance-none cursor-pointer">
                    <option value="">-- Choisir une équipe --</option>
                    {teams.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.nom}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/70 px-2 flex items-center gap-2">
                    <MapPin size={12} className="text-gold" /> Lieu de la séance
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      defaultValue="Stade de Bû Abondant"
                      className="w-full bg-navy-deep border border-white/10 rounded-xl px-4 py-4 text-[11px] font-medium text-white focus:border-gold outline-none transition uppercase tracking-widest"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-gold/40 tracking-[0.2em] uppercase">DOMICILE</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Block Design */}
            <div className="glass-card p-10 border-white/5 bg-white/[0.01]">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-white/80 italic">
                  <Brain size={18} className="text-gold" /> Structure du <span className="text-gold">Bloc</span>
                </div>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-white/60 hover:text-gold transition">Ajouter Transition</button>
              </div>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center group hover:border-gold/30 transition cursor-pointer">
                  <div className="flex flex-col items-center gap-4 py-12 opacity-40 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Zap size={20} className="text-gold" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] italic">Initier un Bloc d'Entrainement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Strategy Panel */}
          <div className="space-y-10">
            <div className="glass-card p-10 border-white/5 bg-white/[0.02] bg-gradient-to-br from-white/[0.01] to-gold/[0.03]">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/80 mb-8 italic">
                <FileText size={16} className="text-gold" /> Focus <span className="text-gold">Stratégique</span>
              </div>
              <textarea 
                className="w-full h-48 bg-navy-deep border border-white/10 rounded-xl p-4 text-[10px] text-white/70 focus:border-gold outline-none transition font-light italic"
                placeholder="Objectifs de la séance, thématiques tactiques..."
              ></textarea>
              <div className="mt-6 flex items-center gap-3 p-4 rounded-xl bg-gold/5 border border-gold/10">
                <CheckCircle2 size={16} className="text-gold shrink-0" />
                <span className="text-[9px] font-black text-gold/80 uppercase tracking-widest leading-relaxed italic">RCBA Elite synchronisera ce blueprint avec les convocations mobiles automatiquement.</span>
              </div>
            </div>

            <div className="glass-card p-10 border-white/5 bg-white/[0.01]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 mb-6 italic">Protocoles <span className="text-gold">Safety</span></h3>
              <div className="space-y-4">
                {['Vérification matériel (Plots, Chasubles)', 'Présence Trousse Médicale', 'Hydratation Optimale'].map((p: string) => (
                  <div key={p} className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-4 h-4 rounded border border-white/10 bg-white/5 group-hover:border-gold/50 transition-colors"></div>
                    <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest transition-colors group-hover:text-white/60 italic">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <footer className="mt-40 border-t border-white/5 pt-20 pb-12 opacity-40">
        <div className="container mx-auto px-6 text-center">
          <div className="athletic-title text-xl text-white mb-4 italic opacity-50">Racing Club Bû Abondant</div>
          <div className="text-[8px] font-black uppercase tracking-[0.6em] text-white/60 italic">RCBA TRAINING BLUEPRINT v2.1.0</div>
        </div>
      </footer>
    </main>
  );
}