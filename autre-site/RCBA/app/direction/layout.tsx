import React from 'react';
import Sidebar from "@/components/Sidebar";
import { getSession } from "@/lib/authentication";
import { redirect } from 'next/navigation';

export default async function DirectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !['direction', 'développeur', 'admin', 'Admin'].includes(session.roleName.toLowerCase())) {
    redirect('/login?role=direction');
  }

  return (
    <div className="flex flex-1 overflow-x-hidden">
      <Sidebar role="Direction" userName={session.username} userRole={session.roleName} />
      <main className="flex-1 w-full min-w-0 p-4 md:p-6 lg:p-8 space-y-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
