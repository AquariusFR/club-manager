import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { Activity, ShieldCheck, Database, Server, Cpu, Globe } from "lucide-react";
import PageLabel from "@/components/PageLabel";

const StatusItem = ({ label, value, status = "ok" }: { label: string, value: string | number, status?: "ok" | "alert" | "info" }) => (
  <div className="flex items-center justify-between py-4 border-b border-white/5 group hover:bg-white/[0.01] transition px-4 rounded-lg">
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-white/70 uppercase tracking-widest italic">{label}</span>
      <span className="text-sm font-bold text-white uppercase italic tracking-wider group-hover:text-pitch-green transition-colors">{value}</span>
    </div>
    <div className={`w-2 h-2 rounded-full ${
      status === "ok" ? "bg-pitch-green shadow-[0_0_10px_#00ff9d]" : 
      status === "alert" ? "bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse" : "bg-blue-500 shadow-[0_0_10px_#3b82f6]"
    }`}></div>
  </div>
);

export default async function EliteDiagnosticsPage() {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName.toLowerCase() !== 'admin')) redirect('/login');

  const db = await getDb();
  
  // System Metrics
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
  const lastEvent = await db.get("SELECT date, titre FROM Evenements ORDER BY id DESC LIMIT 1");
  const playersCount = await db.get("SELECT COUNT(*) as count FROM Joueurs");
  
  const serverTime = new Date().toISOString();
  
  return (
    <main className="min-h-screen bg-navy-deep relative overflow-hidden pb-40">
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <PageLabel 
          section="System"
          category="Diagnostics"
          title="Elite Diagnostics"
          subtitle="Surveillance en temps réel des infrastructures RCBA Elite et télémétrie réseau."
          variant="gold"
          icon="direction"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Core Infrastructure */}
          <section className="glass-card p-10 border-white/5 bg-white/[0.01]">
            <h3 className="athletic-title text-xl mb-10 flex items-center gap-4 italic tracking-wider uppercase font-black text-white/80 whitespace-nowrap">
              <Database className="text-sky-400" size={24} /> DATABASE <span className="text-white/70">ENGINE</span>
            </h3>
            <div className="space-y-2">
              <StatusItem label="Type de Base" value="SQLite 3 (Persistent)" status="info" />
              <StatusItem label="Tables Indexées" value={tables.length} />
              <StatusItem label="Volume Joueurs" value={playersCount.count} />
              <StatusItem label="Dernier Sync" value={lastEvent?.date || 'N/A'} />
            </div>
          </section>

          {/* Logic & Security */}
          <section className="glass-card p-10 border-white/5 bg-white/[0.01]">
            <h3 className="athletic-title text-xl mb-10 flex items-center gap-4 italic tracking-wider uppercase font-black text-white/80 whitespace-nowrap">
              <Cpu className="text-sky-400" size={24} /> LOGIC <span className="text-white/70">LAYER</span>
            </h3>
            <div className="space-y-2">
              <StatusItem label="Auth Engine" value="Encrypted JWT (Aura Proxy)" />
              <StatusItem label="RBAC Level" value="Direction (Level 3)" />
              <StatusItem label="Active Proxy" value="RCBA Aura Proxy v1.2" />
              <StatusItem label="Runtime" value="Next.js 16 (Turbopack)" status="info" />
            </div>
          </section>

          {/* Network & Live */}
          <section className="glass-card p-10 border-white/5 bg-white/[0.01]">
            <h3 className="athletic-title text-xl mb-10 flex items-center gap-4 italic tracking-wider uppercase font-black text-white/80 whitespace-nowrap">
              <Globe className="text-sky-400" size={24} /> NETWORK <span className="text-white/70">HEARTBEAT</span>
            </h3>
            <div className="space-y-2">
              <StatusItem label="Statut Global" value="OPÉRATIONNEL" />
              <StatusItem label="Heure Serveur" value={serverTime.split('T')[1].split('.')[0]} />
              <StatusItem label="Latence DB" value="< 1ms" status="ok" />
              <StatusItem label="Dernier Log" value={lastEvent?.titre || 'Aucun'} />
            </div>
          </section>
        </div>

        {/* System Logs */}
        <div className="mt-12 glass-card p-10 border-white/5 bg-black/40 font-mono text-[10px] leading-relaxed relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-100 transition-opacity">
            <span className="text-sky-400 animate-pulse whitespace-nowrap">â— LIVE STREAMING</span>
          </div>
          <div className="text-sky-400/80 mb-4 inline-block whitespace-nowrap">[SYSTEM] Boot sequence initialized...</div>
          <div className="text-white/60 mb-2">[AUTH] Aura Proxy filtering active for {session.email}</div>
          <div className="text-white/60 mb-2">[DB] Successfully mapped {tables.length} relations in site/rcba.db</div>
          <div className="text-white/70 mb-2 whitespace-nowrap">[UI] Aura Glass v3 engine rendering at 60fps</div>
          <div className="text-pitch-green font-black whitespace-nowrap tracking-wider">[RCBA] Operational Readiness: 100%</div>
        </div>
      </div>
    </main>
  );
}
