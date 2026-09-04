import { getDb } from "@/lib/db";
import { Users2, Trophy, Mail, ArrowLeft, ShieldCheck, Heart, Briefcase, Lock, Hexagon, Star } from "lucide-react";
import Link from "next/link";
import { getSession } from "@/lib/authentication";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import MagneticWrapper from "@/components/MagneticWrapper";
import ImageZoom from "@/components/ImageZoom";
import LeaderCard from "@/components/LeaderCard";

interface Member {
  id: number;
  nom: string;
  prenom: string;
  role: string;
  photo_url: string;
  role_priority: number;
}

async function getDirigeants(): Promise<Member[]> {
  const db = await getDb();
  return await db.all(`
    SELECT id, nom, prenom, role, MIN(role_priority) as role_priority, MAX(photo_url) as photo_url 
    FROM Staff 
    WHERE role_priority IN (1, 2, 5, 10) 
    AND (prenom != '' OR nom != '') 
    GROUP BY UPPER(TRIM(COALESCE(prenom, '') || ' ' || COALESCE(nom, '')))
    ORDER BY role_priority, 
    CASE 
      WHEN UPPER(nom) = 'WAROQUIER' THEN 1
      WHEN UPPER(nom) = 'GODET' THEN 2
      WHEN UPPER(nom) = 'VITY' THEN 3
      ELSE 4
    END,
    nom;
  `);
}

export default async function DirigeantsPage() {
  const session = await getSession();
  const allMembers = await getDirigeants();

  const categories: { category: string, code: string, icon: any, priority: number, theme: 'gold' | 'silver' | 'blue' }[] = [
    {
      category: "Le Bureau",
      code: "BUREAU EXÉCUTIF",
      icon: ShieldCheck,
      priority: 1,
      theme: "gold"
    },
    {
      category: "Conseil d'Administration",
      code: "CONSEIL D'ADMINISTRATION",
      icon: Briefcase,
      priority: 2,
      theme: "silver"
    },
    {
      category: "Les Dirigeants & Staff",
      code: "ENCADREMENT & STAFF",
      icon: Users2,
      priority: 10,
      theme: "blue"
    },
    {
      category: "Membres Honoraires",
      code: "MEMBRES HONORAIRES",
      icon: Heart,
      priority: 5,
      theme: "silver"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-gold/30 relative overflow-hidden">
      {/* ELECTRONIC ATMOSPHERE */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-24 pb-12 border-b border-white/5 relative">
          <HudCorners color="#d4af37" opacity={0.05} />
          <PageLabel 
            section="Club"
            category="Gouvernance"
            title="Le STAFF" 
            subtitle="Les visages de l'excellence et de l'engagement au service du Racing Club Bû Abondant." 
            icon="direction" 
            variant="gold"
          />
        </div>

        <main className="space-y-48 pb-32">
          {categories.map((group, gIdx) => {
            const members = allMembers.filter(m => m.role_priority === group.priority);
            if (members.length === 0) return null;
            
            return (
              <section key={gIdx} className="animate-in fade-in slide-in-from-bottom-12 duration-1000" style={{ animationDelay: `${gIdx * 200}ms` }}>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 relative">
                  <div className="space-y-4">
                    <div className="flex items-center gap-6">
                      <div className="p-4 rounded-3xl bg-gold/10 border border-gold/30 shadow-glass-gold">
                        <group.icon size={24} className="text-gold" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.6em] text-gold/60 mb-1">{group.code}</div>
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase text-white athletic-title athletic-skew tracking-tighter leading-[0.85]">
                          {group.category}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {members.map((member, mIdx) => (
                    <div key={mIdx} className="flex justify-center items-center h-full py-4">
                      <LeaderCard 
                        member={member} 
                        roleLabel={member.role} 
                        size="lg" 
                        isShiny={group.priority === 1} 
                        theme={group.theme}
                      />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </main>

        {/* Values Footer */}
        <section className="mt-40 p-12 rounded-[3rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-black italic text-white mb-6">Un Engagement Bénévole Total</h2>
            <p className="text-lg text-white/80 leading-relaxed font-body">
              Chaque membre de ce staff œuvre quotidiennement pour assurer la pérennité et le rayonnement du Racing Club Bû Abondant. Notre vision est claire : l&apos;excellence sportive dans un cadre familial et structuré.
            </p>
          </div>
          <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12 scale-150">
            <Trophy size={400} />
          </div>
        </section>
      </div>

      {/* Footer minimal */}
      <footer className="py-12 border-t border-white/5">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start opacity-50">
            <span className="text-white font-black italic tracking-widest uppercase">RCBA Direction</span>
            <span className="text-white/60 text-[9px] uppercase tracking-[0.3em] mt-1 font-body">Racing Club Bû Abondant — Fondé en 2020</span>
          </div>
          <div className="flex gap-12">
            <div className="flex items-center gap-3 text-white/70 hover:text-white transition-colors">
              <Mail className="w-4 h-4" />
              <span className="text-sm font-medium">contact@rcba.fr</span>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Lock className="w-4 h-4" />
              <span className="text-sm font-medium uppercase tracking-tighter">Accès Réservé</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
