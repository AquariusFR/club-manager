import React from 'react';
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/authentication";
import { redirect } from 'next/navigation';

export default async function CoachLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Security check: allow Coach and Direction roles, and Développeur for preview
  if (!session || !['coach', 'direction', 'développeur', 'admin', 'Admin'].includes(session.roleName.toLowerCase())) {
    redirect('/login?role=coach');
  }

  return (
    <div className="flex flex-1 overflow-x-hidden">
      <Sidebar role="Coach" userName={session.username} userRole={session.roleName} />
      <main className="flex-1 w-full min-w-0 p-10 space-y-12 overflow-y-auto custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
