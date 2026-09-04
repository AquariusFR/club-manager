import { redirect } from "next/navigation";
import PageLabel from "@/components/PageLabel";
import DashboardClientWrapper from "@/components/DashboardClientWrapper";
import FlashFormeClient from "@/components/FlashFormeClient";
import { getSession } from "@/lib/authentication";


export default async function FlashFormePage() {
  const session = await getSession();
  
  if (!session) redirect('/login');

  return (
    <DashboardClientWrapper>
      <div className="space-y-12 pb-20 hud-grain">
        <PageLabel 
          section="Joueur"
          category="Santé & Forme"
          title="Flash Forme"
          subtitle="Suivi de ton état athlétique et bien-être général."
          icon="activity"
          variant="green"
        />

        <div className="max-w-3xl mx-auto">
          <FlashFormeClient />
        </div>
      </div>
    </DashboardClientWrapper>
  );
}
