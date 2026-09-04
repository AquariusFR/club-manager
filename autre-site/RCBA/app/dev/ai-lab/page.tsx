import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { 
  Terminal, 
  Cpu, 
  Brain, 
  ArrowLeft,
  Settings,
  Activity,
  Zap,
  Globe
} from "lucide-react";
import Link from "next/link";
import PageLabel from "@/components/PageLabel";
import AILabNavigator from "@/components/AILabNavigator";

export default async function AILabPage() {
  const session = await getSession();
  
  if (!session || (session.roleName !== 'Développeur' && session.roleName.toLowerCase() !== 'admin')) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-navy-deep text-white font-body relative overflow-hidden pb-20">
      {/* Background Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Lab Nav */}
      <nav className="w-full border-b border-white/5 bg-navy-deep/50 backdrop-blur-3xl px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link 
            href="/dev" 
            className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold/20 border border-gold/30 rounded-xl flex items-center justify-center text-gold shadow-lg shadow-gold-500/10">
              <Brain size={20} />
            </div>
            <div>
              <div className="athletic-title text-sm tracking-tight italic">RCBA <span className="text-gold uppercase">Intelligence Lab</span></div>
              <div className="text-[7px] font-black uppercase text-gold/40 tracking-wider font-body italic">AI Engineering from Scratch // First Principles</div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 hidden md:flex">
            <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-gold/80">Neural Engine Active</span>
          </div>
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-400 uppercase tracking-widest italic">
            Supervisé par Antigravity
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-3xl">
            <PageLabel 
              section="Intelligence"
              category="RCBA X Sirchmunk"
              title="AI Engineering Lab"
              subtitle="Programme intensif d'ingénierie IA : de la mathématique fondamentale aux systèmes multi-agents autonomes. Construire l'excellence à partir de zéro."
              variant="gold"
              icon="direction"
            />
          </div>
          
          <div className="flex gap-4">
            {[
              { label: "Status", val: "Operational", color: "text-pitch-green" },
              { label: "Matrix", val: "0x01", color: "text-blue-400" },
              { label: "Sourcing", val: "RAG-Anything", color: "text-gold" }
            ].map((s, i) => (
              <div key={i} className="glass-card px-6 py-4 border-white/5 bg-white/[0.02]">
                <div className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">{s.label}</div>
                <div className={`text-[10px] font-black uppercase tracking-widest ${s.color} italic`}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        <AILabNavigator />

        {/* Global Curriculum Map Section */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="athletic-title text-2xl italic mb-2 uppercase tracking-tight">Curriculum <span className="text-gold">Deep Mapping</span></h3>
              <p className="text-sm text-white/40 font-bold uppercase tracking-wider italic">Vue d'ensemble des 20 phases stratégiques</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black text-white/60">
              Total Lessons: <span className="text-gold">260+</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="glass-card p-6 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition group relative overflow-hidden">
                 <div className="text-[10px] font-black text-white/20 mb-3 group-hover:text-gold/40 transition-colors italic">0x{i.toString(16).padStart(2, '0')}</div>
                 <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                   <div className={`h-full bg-gold/20`} style={{ width: i < 6 ? '100%' : '5%' }} />
                 </div>
                 <div className="text-[9px] font-bold text-white/60 uppercase tracking-widest truncate">Phase {i}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Matrix Status Ticker (Footer Style) */}
      <div className="mt-40 w-full flex items-center gap-6 overflow-hidden border-t border-white/5 py-6 bg-navy-deep">
        <div className="flex items-center gap-2 shrink-0 pl-8">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-[10px] font-black text-gold uppercase tracking-widest italic leading-none">System Telemetry:</span>
        </div>
        <div className="flex gap-12 animate-scroll-x">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="text-[9px] font-mono text-white/30 uppercase whitespace-nowrap">
              AI_ENGINEERING_CORE :: STREAM_SYNC_0x{i} :: STATUS_OK :: LOAD_BALANCER_ACTIVE :: NEURAL_MATRIX_UP
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
