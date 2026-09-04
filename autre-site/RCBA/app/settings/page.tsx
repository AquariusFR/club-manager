import React from 'react';
import { getSession } from "@/lib/authentication";
import { redirect } from "next/navigation";
import { Settings, Shield, Bell, Key } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default async function SettingsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex flex-1 overflow-x-hidden">
      <Sidebar role={session.roleName} userName={session.username} />
      
      <main className="flex-1 w-full min-w-0 p-10 space-y-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                <Settings className="text-gold w-6 h-6" />
              </div>
              <div>
                <h1 className="text-4xl font-black italic tracking-tighter athletic-title athletic-skew">PARAMÈTRES</h1>
                <p className="text-white/60">Gérez vos préférences et la sécurité de votre compte.</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Card */}
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="w-6 h-6 text-gold" />
                <h2 className="text-xl font-bold italic">Profil & Sécurité</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Nom d&apos;utilisateur</label>
                  <p className="text-lg">{session.username}</p>
                </div>
                <div>
                  <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Rôle d&apos;accès</label>
                  <p className="text-lg text-gold">{session.roleName}</p>
                </div>
                <button className="mt-4 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-sm font-bold flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Modifier le mot de passe
                </button>
              </div>
            </div>

            {/* Preferences Card */}
            <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-md">
              <div className="flex items-center gap-4 mb-6">
                <Bell className="w-6 h-6 text-pitch-green" />
                <h2 className="text-xl font-bold italic">Notifications</h2>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Emails système</h3>
                    <p className="text-sm text-white/50">Recevoir des alertes de sécurité</p>
                  </div>
                  <div className="w-12 h-6 bg-gold rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-navy-deep rounded-full shadow-sm" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold">Mises à jour du club</h3>
                    <p className="text-sm text-white/50">Newsletters et événements</p>
                  </div>
                  <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-[1.5rem] bg-gold/5 border border-gold/10 text-center">
            <p className="text-gold/80 italic text-sm">
              Module de paramètres en cours de développement. D&apos;autres options seront bientôt disponibles.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
