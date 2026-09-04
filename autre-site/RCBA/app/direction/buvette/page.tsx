import { getDb } from "@/lib/db";
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { 
  Coffee, 
  TrendingUp, 
  Package, 
  ShoppingCart,
  AlertTriangle,
  History,
  Beer,
  Pizza,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowRight,
  Activity,
  Cpu
} from "lucide-react";
import Link from "next/link";
import PageLabel from "@/components/PageLabel";
import BuvetteInventory from "@/components/BuvetteInventory";
import HudCorners from "@/components/HudCorners";
import MagneticWrapper from "@/components/MagneticWrapper";

// Local Component - Elite Refactor
const StatCard = ({ title, value, detail, icon: Icon, color, trend }: any) => (
  <div className="glass-card p-8 border-white/5 bg-white/[0.01] rounded-3xl backdrop-blur-md hover:bg-white/[0.03] transition group relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[160px]">
    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-20 group-hover:scale-125 group-hover:-rotate-6 transition duration-1000">
      <Icon size={96} className={color} />
    </div>
    <div className="space-y-4 relative z-10">
      <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-2 block">{title}</span>
      <div className="flex items-baseline gap-4">
        <span className="athletic-title athletic-skew tabular-nums text-5xl font-black text-white tracking-tight leading-none drop-shadow-2xl">{value}</span>
        {trend && (
          <span className={`flex items-center text-[10px] font-black px-3 py-1 rounded-full bg-white/5 border border-white/5 ${trend > 0 ? 'text-pitch-green border-pitch-green/20' : 'text-rose-400 border-rose-400/20'}`}>
            {trend > 0 ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 italic flex items-center justify-between border-t border-white/5 pt-4 group-hover:text-white/50 transition-colors">
       {detail}
       <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition -translate-x-2 group-hover:translate-x-0" />
    </div>
    
    <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/30 transition duration-700" />
  </div>
);

export default async function BuvetteManagementPage() {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName.toLowerCase() !== 'admin')) {
    redirect('/login');
  }

  const db = await getDb();

  // 1. Data Fetching
  const inventory = await db.all("SELECT * FROM BuvetteStocks ORDER BY quantite ASC");
  const recentSales = await db.all("SELECT * FROM BuvetteStats ORDER BY date DESC LIMIT 5");
  const financialData = await db.get("SELECT SUM(recette_totale) as total_recette, SUM(depenses) as total_depenses, AVG(recette_totale) as avg_recette FROM BuvetteStats");
  
  // 2. Intelligence Logic
  const criticalItems = inventory.filter((item: any) => item.quantite <= (item.seuil_alerte || 20));
  const avgConsumption = financialData?.avg_recette || 3.40;

  return (
    <main className="min-h-screen bg-navy-deep text-white p-6 lg:p-12 space-y-16 relative overflow-hidden pb-32">
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          ATMOSPHERIC CORE
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-gold/5 blur-[250px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-pitch-green/5 blur-[200px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      

      <div className="relative z-10 space-y-16">
        <header className="relative space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-12 border-b border-white/5 relative">
            <HudCorners color="#d4af37" opacity={0.05} />
            <div className="space-y-4">
              <PageLabel 
                section="DIRECTION"
                category="LOGISTIQUE"
                title="REGIE BUVETTE"
                subtitle="Optimisation des flux de restauration. Monitoring des stocks critiques et analyse de performance match-day."
                variant="gold"
                icon="direction"
              />
            </div>

            <div className="flex flex-col xl:flex-row items-end xl:items-center gap-6 xl:gap-10">
              <div className="hidden md:flex glass-card px-8 py-5 border-white/10 bg-white/[0.02] items-center gap-8 backdrop-blur-3xl shadow-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col relative z-10">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-2">Systems Status</span>
                  <span className="text-[10px] font-black text-pitch-green uppercase tracking-[0.3em] italic flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-pitch-green shadow-glow animate-pulse" />
                    OPERATIONNEL
                  </span>
                </div>
                <div className="w-px h-12 bg-white/10 relative z-10" />
                <div className="flex flex-col relative z-10">
                  <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] italic mb-2">Last Sync</span>
                  <span className="text-[11px] font-black text-white athletic-title athletic-skew tracking-wider">0x00A1 - 42s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top KPI Grid - Elite Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard 
              title="Recettes Totales" 
              value={`${financialData?.total_recette || 0} €`} 
              detail={`NET: ${(financialData?.total_recette - financialData?.total_depenses || 0).toFixed(2)} €`} 
              icon={ShoppingCart} 
              color="text-pitch-green"
              trend={+12.4}
            />
            <StatCard 
              title="Volume Consommation" 
              value={`${avgConsumption.toFixed(2)} €`} 
              detail="Ratio par spectateur" 
              icon={Activity} 
              color="text-blue-400"
            />
            <StatCard 
              title="Alerte Stocks" 
              value={criticalItems.length} 
              detail="Articles sous seuil 20" 
              icon={AlertTriangle} 
              color="text-rose-400"
            />
            <StatCard 
              title="Chaîne Appro" 
              value="14 AVR" 
              detail="Commande Grossiste #8" 
              icon={Package} 
              color="text-gold"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {/* Main Inventory Board */}
          <div className="lg:col-span-2 space-y-12">
            <div className="relative">
              <div className="absolute -top-6 left-10 text-[9px] font-black text-gold/10 uppercase tracking-[1em] italic select-none">INVENTORY REGISTRY</div>
              <BuvetteInventory initialStocks={inventory} />
            </div>
          </div>

          {/* Right Sidebar - Recent Sales */}
          <div className="space-y-12">
            <div className="glass-card p-10 border-white/10 bg-white/[0.01] relative overflow-hidden group shadow-3xl backdrop-blur-2xl rounded-[2.5rem]">
               <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              <div className="flex items-center justify-between mb-12 relative z-10">
                <h3 className="text-sm font-black uppercase tracking-widest text-white/90 flex items-center gap-4 italic font-black">
                  <History size={20} className="text-pitch-green shadow-glow-green" /> 
                  FLUX <span className="text-pitch-green font-black">VENTES</span>
                </h3>
                <Link href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-gold transition">PROTOCOLE ARCHIVE</Link>
              </div>
              <div className="space-y-6 relative z-10">
                {recentSales.map((sale: any, i: number) => (
                  <div key={sale.id} className="flex items-center justify-between group/sale p-6 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/[0.03] transition relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1 bg-padding-green scale-y-0 group-hover/sale:scale-y-100 transition-transform origin-top" />
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/40 group-hover/sale:text-pitch-green group-hover/sale:border-pitch-green/40 transition">
                        <ShoppingCart size={18} />
                      </div>
                      <div>
                        <div className="text-[11px] font-black text-white uppercase tracking-tight italic group-hover/sale:text-gold transition-colors">Match Day Cycle</div>
                        <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest mt-1 group-hover/sale:text-white/60 transition-colors uppercase">{sale.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="athletic-title tabular-nums athletic-skew text-xl text-pitch-green italic group-hover/sale:scale-110 transition-transform duration-500 origin-right"><span>+{sale.recette_totale} €</span></div>
                      <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-1">NODE_OK</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 pt-10 border-t border-white/5 relative z-10">
                <div className="glass-card p-8 border-white/10 bg-white/[0.01] bg-gradient-to-br from-white/[0.01] to-pitch-green/[0.03] rounded-2xl">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/80 mb-4 italic flex items-center gap-3">
                    <Cpu size={14} className="text-pitch-green" /> SUPPORT <span className="text-pitch-green">REGIE</span>
                  </h3>
                  <p className="text-[10px] leading-relaxed text-white/40 mb-8 italic font-light">En cas de discordance entre le stock physique et le terminal, veuillez contacter le responsable matériel Immédiatement.</p>
                  <MagneticWrapper>
                    <button className="w-full py-5 text-[9px] font-black cursor-not-allowed uppercase tracking-widest bg-white/5 border border-white/10 rounded-xl text-white/30 italic hover:text-white/50 active:scale-95 transition shadow-xl">
                      OUVRIR TICKET APPRO
                    </button>
                  </MagneticWrapper>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Branding Footer - Elite Style */}
      <footer className="mt-40 border-t border-white/5 pt-20 pb-12 opacity-80 group">
        <div className="container mx-auto px-6 text-center">
          <div className="athletic-title text-2xl text-white/20 mb-6 italic group-hover:text-gold transition duration-1000 select-none">RACING CLUB BU ABONDANT</div>
          <div className="flex items-center justify-center gap-6 text-[9px] font-black uppercase tracking-[0.6em] text-white/20 italic">
            <span>RCBA OPERATIONAL INTERFACE — v4.0.0</span>
            <div className="w-px h-4 bg-white/10" />
            <span className="group-hover:text-gold transition-colors duration-1000 uppercase font-black tracking-[0.8em]">Elite Protocol Protocol: ACTIVE</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
