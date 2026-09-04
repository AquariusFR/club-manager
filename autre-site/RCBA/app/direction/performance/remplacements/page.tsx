import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import PageLabel from "@/components/PageLabel";
import DashboardClientWrapper from "@/components/DashboardClientWrapper";
import { getCoachSubstitutions, getCoachesAction } from "@/lib/performance-actions";
import SubstitutionManagementClient from "@/components/SubstitutionManagementClient";

export default async function SubstitutionManagementPage() {
  const session = await getSession();
  if (!session || (session.roleName !== 'Direction' && session.roleName !== 'Développeur' && session.roleName.toLowerCase() !== 'admin')) {
    redirect('/login');
  }

  const substitutions = await getCoachSubstitutions();
  const coaches = await getCoachesAction();

  return (
    <DashboardClientWrapper>
      <div className="flex items-center justify-between mb-12">
        <Link href="/direction/performance" className="flex items-center gap-2 text-white/40 hover:text-gold transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Retour Performance</span>
        </Link>
      </div>

      <PageLabel 
        section="LOGISTIQUE STAFF"
        category="REMPLACEMENTS ÉDUCATEURS"
        title="GESTION DES ABSENCES"
        subtitle="Validation et assignation des remplaçants pour assurer la continuité des séances."
        icon="staff"
        variant="blue"
      />

      <SubstitutionManagementClient 
        substitutions={substitutions} 
        coaches={coaches} 
      />
    </DashboardClientWrapper>
  );
}
