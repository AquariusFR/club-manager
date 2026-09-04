import { redirect } from "next/navigation";
import { getSession } from "@/lib/authentication";

export default async function JoueurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || (session.roleName !== 'Joueur' && session.roleName !== 'Direction' && session.roleName.toLowerCase() !== 'admin')) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black text-white font-body">
      {/* Cinematic Overlays */}
      <div className="fixed inset-0 bg-[#020617]/90 pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[url('/noise.svg')] opacity-20 contrast-150 brightness-150 pointer-events-none mix-blend-overlay z-0" />
      <div className="fixed top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-500/50 to-transparent z-0" />
      
      <div className="relative z-10">
        <header className="border-b border-white/5 bg-white/[0.02] backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-2">
                <img src="/logo.png" alt="RCBA" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl athletic-title italic text-white uppercase tracking-wider">RCBA <span className="text-sky-400">Joueur</span></h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 italic">Portail Personnel</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-xs font-bold text-white/70">{session.email}</span>
              <form action="/api/auth/logout" method="POST">
                <button type="submit" className="text-[10px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 transition-colors">Déconnexion</button>
              </form>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
