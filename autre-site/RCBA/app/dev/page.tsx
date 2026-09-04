import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { 
  Database, 
  Users2, 
  Activity, 
  Terminal, 
  Zap, 
  ShieldAlert, 
  Lock,
  ChevronRight,
  Monitor,
  HardDrive,
  Cpu,
  RefreshCw,
  LayoutDashboard,
  Brain
} from "lucide-react";
import Link from "next/link";
import { logout } from "@/lib/authentication";
import DataExplorer from "@/components/DataExplorer";
import PageLabel from "@/components/PageLabel";

async function logoutAction() {
  'use server'
  await logout();
  redirect('/login');
}

export default async function DevDashboard() {
  const session = await getSession();
  
  if (!session || (session.roleName !== 'Développeur' && session.roleName.toLowerCase() !== 'admin')) {
    redirect('/login');
  }

  const db = await getDb();
  
  // Real-time Database Stats
  const usersCount = (await db.get("SELECT COUNT(*) as count FROM Users")).count;
  const playersCount = (await db.get("SELECT COUNT(*) as count FROM Joueurs")).count;
  const staffCount = (await db.get("SELECT COUNT(*) as count FROM Staff")).count;
  const stats = [
    { label: "Utilisateurs", value: usersCount, icon: Users2, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Joueurs Elite", value: playersCount, icon: Activity, color: "text-gold", bg: "bg-gold/10" },
    { label: "Staff Technique", value: staffCount, icon: ShieldAlert, color: "text-pitch-green", bg: "bg-pitch-green/10" },
  ];

  const systemInfo = [
    { label: "Framework", value: "Next.js 15.1.0", icon: Cpu },
    { label: "Base de Données", value: "SQLite 3", icon: HardDrive },
    { label: "Design System", value: "Aura Glass v2", icon: LayoutDashboard },
    { label: "Node.js", value: "v20.10.x", icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-navy-deep text-white font-body relative overflow-hidden pb-20">
      {/* Dev-specific Tech Aura */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Dev Nav Bar */}
      <nav className="w-full border-b border-white/5 bg-navy-deep/50 backdrop-blur-3xl px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400 shadow-lg shadow-blue-500/10">
            <Terminal size={20} />
          </div>
          <div>
            <div className="athletic-title text-sm tracking-tight italic">RCBA <span className="text-blue-400">DEV PORTAL</span></div>
            <div className="text-[7px] font-black uppercase text-blue-400/40 tracking-wider font-body">Super-Admin — Mode Développement</div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10 hidden md:flex">
            <div className="w-2 h-2 rounded-full bg-pitch-green animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-wider text-pitch-green/80">Système Online</span>
          </div>
          <form action={logoutAction}>
            <button className="bg-rose-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-rose-600 transition shadow-xl shadow-rose-500/10 border border-rose-500/20">
              <Lock size={14} /> Déconnexion
            </button>
          </form>
        </div>
      </nav>

      <div className="container mx-auto px-8 py-16 relative z-10">
        <PageLabel 
          section="System"
          category="Super-Admin"
          title="Dev Dashboard"
          subtitle="Accès total aux structures de données du Racing Club Bû Abondant. Supervision technique et architecture."
          variant="gold"
          icon="direction"
        />

        {/* System Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((s, i) => (
            <div key={i} className="glass-card p-8 border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition group overflow-hidden relative">
              <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform ${s.color}`}>
                <s.icon size={120} />
              </div>
              <div className={`w-12 h-12 rounded-2xl ${s.bg} border border-white/10 flex items-center justify-center ${s.color} mb-6`}>
                <s.icon size={24} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-white/80 mb-2">{s.label}</div>
              <div className="athletic-title text-5xl text-white">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {/* Data Explorer (Main Tool) */}
          <div className="lg:col-span-2">
            <DataExplorer />
          </div>

          {/* System Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-10 border-blue-500/10 bg-blue-500/[0.02]">
              <h3 className="athletic-title text-xl mb-10 flex items-center gap-3">
                <Monitor className="text-blue-400" size={24} /> Environnement
              </h3>
              <div className="space-y-6">
                {systemInfo.map((info, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <info.icon size={18} className="text-white/80" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">{info.label}</span>
                    </div>
                    <span className="text-sm font-black text-blue-400">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-10 border-white/5 bg-white/[0.01] group">
              <div className="flex items-center justify-between mb-8">
                <h3 className="athletic-title text-sm uppercase opacity-40">Statut SQL</h3>
                <div className="w-2 h-2 rounded-full bg-pitch-green" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-white/80 mb-4">Database Path</div>
              <code className="block bg-navy-deep p-4 rounded-xl text-[9px] text-blue-400 border border-white/5 truncate">
                ./rcba.db
              </code>
              <button className="mt-8 w-full py-4 border border-blue-500/20 rounded-2xl text-[9px] font-black uppercase tracking-wider hover:bg-blue-500/10 transition flex items-center justify-center gap-3">
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" /> Refresh Schema
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions / Audit Logs Section */}
        <div className="glass-card p-10 border-white/5 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-12">
            <h3 className="athletic-title text-xl flex items-center gap-3">
              <LayoutDashboard className="text-blue-400" size={24} /> Aperçu <span className="text-blue-400">Portails</span>
            </h3>
            <div className="text-[9px] font-bold text-white/80 uppercase tracking-wider">Accès Super-Admin</div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link href="/direction" className="glass-card p-8 border-white/5 bg-navy-deep hover:shadow-gold transition group">
              <div className="flex items-center justify-between mb-4">
                <ShieldAlert className="text-pitch-green" size={24} />
                <ChevronRight className="text-white/70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm font-black uppercase tracking-wider text-white mb-1">Direction Club</div>
              <div className="text-[9px] font-bold text-white/60 uppercase tracking-wider">Portail Direction</div>
            </Link>
            
            <Link href="/coach" className="glass-card p-8 border-white/5 bg-navy-deep hover:shadow-gold transition group">
              <div className="flex items-center justify-between mb-4">
                <Zap className="text-gold" size={24} />
                <ChevronRight className="text-white/70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm font-black uppercase tracking-wider text-white mb-1">Staff Technique</div>
              <div className="text-[9px] font-bold text-white/60 uppercase tracking-wider">Portail Coach</div>
            </Link>

            <Link href="/parents" className="glass-card p-8 border-white/5 bg-navy-deep hover:shadow-gold transition group">
              <div className="flex items-center justify-between mb-4">
                <Users2 className="text-blue-400" size={24} />
                <ChevronRight className="text-white/70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm font-black uppercase tracking-wider text-white mb-1">Espace Parents</div>
              <div className="text-[9px] font-bold text-white/60 uppercase tracking-wider">Portail Familles</div>
            </Link>

            <Link href="/dev/ai-lab" className="glass-card p-8 border-gold/30 bg-gold/[0.03] hover:shadow-gold transition group overflow-hidden relative">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform text-gold">
                <Brain size={120} />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <Brain className="text-gold" size={24} />
                <ChevronRight className="text-white/70 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="text-sm font-black uppercase tracking-wider text-white mb-1 relative z-10">AI Engineering Lab</div>
              <div className="text-[9px] font-bold text-gold/60 uppercase tracking-wider relative z-10">Cursus Mastery & Matrix</div>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="text-[10px] font-black uppercase tracking-wider text-white/70 mb-6">Journal d'Audit Système</div>
            {[
              { action: "Connexion Super-Admin", user: session.email || "dev@rcba.fr", time: "A l'instant", status: "OK" },
              { action: "Migration Phase 27 Launch", user: "Model Agent", time: "2 min", status: "SUCCESS" },
              { action: "AI Lab Integration (v1.0)", user: "Antigravity", time: "5 min", status: "NEW" },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-blue-500/30 transition font-body text-[10px]">
                <div className="flex items-center gap-6">
                  <span className="font-black uppercase tracking-wider text-white/60">{log.action}</span>
                  <span className="text-white/80 italic">by {log.user}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-white/80">{log.time}</span>
                  <span className="px-3 py-1 bg-pitch-green/10 text-pitch-green rounded-lg font-black border border-pitch-green/20">{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
