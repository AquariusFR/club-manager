'use client';

import React, { useState } from 'react';
import { 
  Users2, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  UserPlus, 
  Cpu, 
  Check, 
  X,
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  Settings,
  ShieldCheck,
  Star
} from "lucide-react";
import { addStaffAction, updateStaffAction, deleteStaffAction, syncStaffFromSqlAction } from "@/lib/actions";
import HudCorners from "@/components/HudCorners";
import ImageZoom from "./ImageZoom";

interface StaffMember {
  id: number;
  nom: string;
  prenom: string;
  role: string;
  role_priority: number;
  photo_url?: string;
}

interface StaffManagementClientProps {
  initialStaff: StaffMember[];
}

export default function StaffManagementClient({ initialStaff }: StaffManagementClientProps) {
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    role: "",
    role_priority: 10,
    photo_url: ""
  });

  const filteredStaff = staff.filter(s => 
    `${s.prenom} ${s.nom}`.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({ nom: "", prenom: "", role: "", role_priority: 10, photo_url: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (member: StaffMember) => {
    setEditingMember(member);
    setFormData({ 
      nom: member.nom, 
      prenom: member.prenom, 
      role: member.role, 
      role_priority: member.role_priority, 
      photo_url: member.photo_url || "" 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let res;

    if (editingMember) {
      res = await updateStaffAction(editingMember.id, formData);
    } else {
      res = await addStaffAction(formData);
    }

    if (res.success) {
      setStatusMsg({ type: 'success', text: editingMember ? "Membre mis à jour" : "Membre ajouté" });
      setIsModalOpen(false);
      // We could re-fetch or rely on revalidatePath, but for better UX we refresh local state
      // In a real app, window.location.reload() or router.refresh() would be used
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setStatusMsg({ type: 'error', text: res.error || "Une erreur est survenue" });
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) return;
    
    setLoading(true);
    const res = await deleteStaffAction(id);
    if (res.success) {
      setStaff(staff.filter(s => s.id !== id));
      setStatusMsg({ type: 'success', text: "Membre supprimé" });
    } else {
      setStatusMsg({ type: 'error', text: res.error || "Erreur lors de la suppression" });
    }
    setLoading(false);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleReset = async () => {
    if (!confirm("Voulez-vous synchroniser les membres par défaut ? Cela mettra à jour les rôles existants.")) return;
    
    setLoading(true);
    const res = await syncStaffFromSqlAction();
    if (res.success) {
      setStatusMsg({ type: 'success', text: "Base synchronisée avec succès" });
      setTimeout(() => window.location.reload(), 1000);
    } else {
      setStatusMsg({ type: 'error', text: res.error || "Erreur de synchronisation" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 relative">
      {/* ══════════════════════════════════════════
          ACTIONS BAR
      ══════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] backdrop-blur-xl">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="RECHERCHER DANS L'EFFECTIF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-navy-deep/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition athletic-title"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={handleReset}
            disabled={loading}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:bg-white/10 hover:text-white transition italic athletic-title"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Reset Defaults
          </button>
          
          <button 
            onClick={openAddModal}
            className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 bg-gold text-navy-deep rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition shadow-lg shadow-gold/20 italic athletic-title"
          >
            <UserPlus size={16} />
            Ajouter Membre
          </button>
        </div>
      </div>

      {/* Status Messages */}
      {statusMsg && (
        <div className={`p-4 rounded-2xl border flex items-center gap-4 animate-in slide-in-from-top duration-500 ${
          statusMsg.type === 'success' ? 'bg-pitch-green/10 border-pitch-green/30 text-pitch-green' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
        }`}>
          {statusMsg.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
          <span className="text-sm font-black uppercase tracking-widest italic athletic-title">{statusMsg.text}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════
          STAFF GRID
      ══════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStaff.map((member) => (
          <div 
            key={member.id}
            className="glass-card group p-0 bg-white/[0.01] border-white/5 rounded-[2rem] overflow-hidden relative hover:border-gold/30 hover:bg-white/[0.03] transition duration-700"
          >
            <HudCorners color="#d4af37" opacity={0.1} />
            
            {/* Header / Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <button 
                onClick={() => openEditModal(member)}
                className="p-2 bg-navy-deep/80 border border-white/10 rounded-lg text-white/40 hover:text-gold hover:border-gold/30 transition"
              >
                <Edit2 size={14} />
              </button>
              <button 
                onClick={() => handleDelete(member.id)}
                className="p-2 bg-navy-deep/80 border border-white/10 rounded-lg text-white/40 hover:text-rose-500 hover:border-rose-500/30 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Profile Content */}
            <div className="p-8 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-3xl bg-navy-deep border-2 border-white/5 overflow-hidden group-hover:border-gold/50 transition duration-700 p-1">
                  <div className="w-full h-full rounded-2xl bg-white/5 flex items-center justify-center overflow-hidden">
                    {member.photo_url ? (
                      <ImageZoom src={member.photo_url} alt={member.nom} className="w-full h-full object-cover" />
                    ) : (
                      <Users2 size={32} className="text-white/10 group-hover:text-gold/20 transition-colors" />
                    )}
                  </div>
                </div>
                {member.role_priority === 1 && (
                  <div className="absolute -bottom-2 -right-2 bg-gold text-navy-deep p-1.5 rounded-lg shadow-lg">
                    <Star size={12} fill="currentColor" />
                  </div>
                )}
              </div>

              <h3 className="text-lg font-black text-white italic athletic-title uppercase tracking-tighter athletic-skew leading-none mb-2">
                {member.prenom} <span className="text-gold group-hover:text-white transition-colors">{member.nom}</span>
              </h3>
              
              <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{member.role}</span>
              </div>

              <div className="w-full grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2 flex flex-col items-center">
                  <span className="text-[7px] font-black uppercase text-white/20 tracking-widest mb-1 italic">Node ID</span>
                  <span className="text-[10px] font-black text-white/40 italic">#0{member.id}</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2 flex flex-col items-center">
                  <span className="text-[7px] font-black uppercase text-white/20 tracking-widest mb-1 italic">Catégorie</span>
                  <span className="text-[10px] font-black text-white/40 italic">
                    {member.role_priority === 1 ? "LE BUREAU" : 
                     member.role_priority === 2 ? "CONSEIL D'ADMIN" :
                     member.role_priority === 3 ? "ENCADREMENT" :
                     member.role_priority === 4 ? "OPÉRATIONNEL" :
                     member.role_priority === 5 ? "HONORAIRE" : "STAFF"}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Bar */}
            <div className={`h-1 w-full transition duration-700 ${
              member.role_priority === 1 ? 'bg-gold' : 'bg-white/5 group-hover:bg-gold/30'
            }`} />
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          MODAL (Add/Edit)
      ══════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy-deep/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-navy-deep border border-white/10 w-full max-w-xl rounded-[3rem] overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
            <HudCorners color="#d4af37" opacity={0.2} />
            
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                    {editingMember ? <Edit2 size={24} /> : <UserPlus size={24} />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white italic athletic-title uppercase tracking-tighter athletic-skew leading-none">
                      {editingMember ? "MODIFIER" : "NOUVEAU"} <span className="text-gold">MEMBRE</span>
                    </h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mt-1 italic">Staff Governance Protocol v1.0</p>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 text-white/20 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 italic ml-2">Prénom</label>
                    <input 
                      required
                      type="text" 
                      value={formData.prenom}
                      onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                      placeholder="EX: JEAN"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-gold/50 transition athletic-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 italic ml-2">Nom</label>
                    <input 
                      required
                      type="text" 
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                      placeholder="EX: DUPONT"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-gold/50 transition athletic-title"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/40 italic ml-2">Rôle / Fonction</label>
                  <input 
                    required
                    type="text" 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    placeholder="EX: COACH U15 / TRÉSORIER"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-gold/50 transition athletic-title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 italic ml-2">Priorité d'affichage</label>
                    <select 
                      value={formData.role_priority}
                      onChange={(e) => setFormData({...formData, role_priority: parseInt(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-gold/50 transition athletic-title appearance-none"
                    >
                      <option value={1} className="bg-navy-deep text-white">1 - LE BUREAU</option>
                      <option value={2} className="bg-navy-deep text-white">2 - CONSEIL D'ADMINISTRATION</option>
                      <option value={3} className="bg-navy-deep text-white">3 - ENCADREMENT TECHNIQUE</option>
                      <option value={4} className="bg-navy-deep text-white">4 - PÔLES OPÉRATIONNELS</option>
                      <option value={5} className="bg-navy-deep text-white">5 - MEMBRES HONORAIRES</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 italic ml-2">URL Photo (Optionnel)</label>
                    <input 
                      type="text" 
                      value={formData.photo_url}
                      onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                      placeholder="HTTPS://..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-medium focus:outline-none focus:border-gold/50 transition"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gold text-navy-deep font-black uppercase tracking-widest py-5 rounded-[1.5rem] mt-4 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition shadow-xl shadow-gold/20 athletic-title italic"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : (editingMember ? <Check size={18} /> : <Plus size={18} />)}
                  {editingMember ? "VALIDER LES MODIFICATIONS" : "ENREGISTRER LE NOUVEAU MEMBRE"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
