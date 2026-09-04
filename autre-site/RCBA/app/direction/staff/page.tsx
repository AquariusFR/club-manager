import React from 'react';
import { getStaffListAction } from "@/lib/actions";
import PageLabel from "@/components/PageLabel";
import HudCorners from "@/components/HudCorners";
import StaffManagementClient from "@/components/StaffManagementClient";
import { Cpu, Users2 } from "lucide-react";

export default async function StaffManagementPage() {
  const staff = await getStaffListAction();

  return (
    <div className="space-y-10 animate-in fade-in duration-700 relative">
      <HudCorners color="#d4af37" opacity={0.05} />
      
      {/* ══════════════════════════════════════════
          PAGE TITLE
      ══════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1.5 h-6 bg-gold rounded-full" />
            <PageLabel 
              section="Direction" 
              category="Administration" 
              title="Gestion Staff" 
              subtitle="PERSONNEL_GOVERNANCE_PROTOCOL 0x0A" 
              icon="staff" 
              variant="gold" 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter athletic-title athletic-skew leading-none">
            MATRICE DU <span className="text-gold">STAFF</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mt-3 flex items-center gap-2">
            <Cpu size={12} className="text-gold animate-spin-slow" />
            Active Governance Node: STAFF_MANAGER_v1.0
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-navy-deep/80 border border-white/10 rounded-xl px-5 py-3 flex items-center gap-4 backdrop-blur-md">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Total Staff</span>
              <span className="text-lg tabular-nums font-black text-gold italic athletic-title">{staff.length}</span>
            </div>
            <Users2 className="text-gold/60" size={20} />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MANAGEMENT INTERFACE
      ══════════════════════════════════════════ */}
      <StaffManagementClient initialStaff={staff} />

      <div className="mt-12 flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
         <Users2 size={40} className="text-white/10 mb-4" />
         <p className="text-[11px] font-black uppercase tracking-[0.6em] text-white/30 italic">Staff Governance Hub — Matrix Sync ACTIVE</p>
      </div>
    </div>
  );
}
