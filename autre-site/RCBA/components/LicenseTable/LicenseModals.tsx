import React from 'react';
import { XCircle, X, Euro } from "lucide-react";
import { OCRScanner } from "../OCRScanner";
import { getLicensePrice } from "@/lib/utils";

// Standardized categories aligned with club-info.json cotisations
const STANDARD_CATEGORIES = [
  { label: "U6 / U7",         value: "U7",  group: "Jeunes" },
  { label: "U8 / U9",         value: "U9",  group: "Jeunes" },
  { label: "U10 / U11",       value: "U11", group: "Jeunes" },
  { label: "U12 / U13",       value: "U13", group: "Jeunes" },
  { label: "U14 / U15",       value: "U15", group: "Jeunes" },
  { label: "U16 / U17 / U18", value: "U18", group: "Jeunes" },
  { label: "Séniors",         value: "Sénior", group: "Adultes" },
  { label: "Vétérans",        value: "Vétéran", group: "Adultes" },
  { label: "Pôle Féminin",    value: "Sénior Féminin", group: "Adultes" },
  { label: "Dirigeant / Staff", value: "Dirigeant", group: "Administration" },
];

function CategorySelect({ id, value, onChange }: { id: string; value: string; onChange: (val: string) => void }) {
  const price = getLicensePrice(value);
  return (
    <div className="space-y-2">
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 appearance-none"
        >
          <option value="">Sélectionner une catégorie</option>
          {["Jeunes", "Adultes", "Administration"].map(group => (
            <optgroup key={group} label={group}>
              {STANDARD_CATEGORIES.filter(c => c.group === group).map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      {value && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/10 border border-gold/20">
          <Euro size={12} className="text-gold" />
          <span className="text-[10px] font-black text-gold uppercase tracking-widest">
            Cotisation : {price}€/an
          </span>
        </div>
      )}
    </div>
  );
}

interface Team {
  id: number;
  nom: string;
  categorie: string;
}

interface LicenseModalsProps {
  showOCR: boolean;
  setShowOCR: (val: boolean) => void;
  setSelectedPlayerForOCR: (id: number | null) => void;
  handleOCRComplete: (data: any) => Promise<void>;
  
  isAddModalOpen: boolean;
  setIsAddModalOpen: (val: boolean) => void;
  addLoading: boolean;
  addFormData: any;
  setAddFormData: (val: any) => void;
  handleAddPlayer: (e: React.FormEvent) => Promise<void>;
  
  isEditModalOpen: boolean;
  setIsEditModalOpen: (val: boolean) => void;
  editLoading: boolean;
  editPlayerId: number | null;
  editFormData: any;
  setEditFormData: (val: any) => void;
  handleEditPlayer: (e: React.FormEvent) => Promise<void>;
  
  teams: Team[];
}

export function LicenseModals({
  showOCR,
  setShowOCR,
  setSelectedPlayerForOCR,
  handleOCRComplete,
  isAddModalOpen,
  setIsAddModalOpen,
  addLoading,
  addFormData,
  setAddFormData,
  handleAddPlayer,
  isEditModalOpen,
  setIsEditModalOpen,
  editLoading,
  editPlayerId,
  editFormData,
  setEditFormData,
  handleEditPlayer,
  teams
}: LicenseModalsProps) {
  return (
    <>
      {/* OCR Modal Overlay */}
      {showOCR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy-deep/80 backdrop-blur-xl animate-in fade-in duration-500" role="dialog" aria-modal="true" aria-labelledby="ocr-modal-title">
           <div className="relative w-full max-w-2xl">
              <button 
                onClick={() => {
                  setShowOCR(false);
                  setSelectedPlayerForOCR(null);
                }}
                className="absolute -top-16 right-0 p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-rose-500 hover:border-rose-500 transition active:scale-90"
                aria-label="Fermer le scanner OCR"
              >
                <XCircle size={32} />
              </button>
              <OCRScanner 
                mode="license" 
                onComplete={handleOCRComplete} 
                onClose={() => {
                  setShowOCR(false);
                  setSelectedPlayerForOCR(null);
                }} 
              />
           </div>
        </div>
      )}

      {/* Add Player Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy-deep/80 backdrop-blur-xl animate-in fade-in duration-500" role="dialog" aria-modal="true" aria-labelledby="add-modal-title">
           <div className="relative w-full max-w-2xl bg-navy-deep border border-white/10 rounded-[2rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-rose-500 hover:border-rose-500 transition active:scale-90"
                aria-label="Fermer le formulaire d'ajout"
              >
                <X size={20} />
              </button>
              <h2 id="add-modal-title" className="text-2xl font-black text-white uppercase tracking-widest italic mb-8">Informations de la Licence</h2>
              <form onSubmit={handleAddPlayer} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="add-nom" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Nom</label>
                    <input id="add-nom" required type="text" value={addFormData.nom} onChange={e => setAddFormData({...addFormData, nom: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="add-prenom" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Prénom</label>
                    <input id="add-prenom" required type="text" value={addFormData.prenom} onChange={e => setAddFormData({...addFormData, prenom: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="add-num-licence" className="text-[10px] font-black text-white/50 uppercase tracking-widest">N° de Licence</label>
                    <input id="add-num-licence" type="text" value={addFormData.num_licence} onChange={e => setAddFormData({...addFormData, num_licence: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="add-email" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Identifiant (Email)</label>
                    <input id="add-email" type="email" value={addFormData.email} onChange={e => setAddFormData({...addFormData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="add-telephone" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Téléphone</label>
                    <input id="add-telephone" type="text" value={addFormData.telephone} onChange={e => setAddFormData({...addFormData, telephone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="add-date-naissance" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Date de naissance</label>
                    <input id="add-date-naissance" type="date" value={addFormData.date_naissance} onChange={e => setAddFormData({...addFormData, date_naissance: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 [color-scheme:dark]" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="add-categorie" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Catégorie & Cotisation</label>
                    <CategorySelect
                      id="add-categorie"
                      value={addFormData.categorie_actuelle}
                      onChange={val => setAddFormData({...addFormData, categorie_actuelle: val})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="add-equipe" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Équipe</label>
                    <select id="add-equipe" required value={addFormData.equipe_id} onChange={e => setAddFormData({...addFormData, equipe_id: e.target.value})} className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50">
                      <option value="">Sélectionner une équipe</option>
                      {teams?.map((t: Team) => <option key={t.id} value={t.id}>{t.nom}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="add-poste" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Poste</label>
                    <select id="add-poste" value={addFormData.poste} onChange={e => setAddFormData({...addFormData, poste: e.target.value})} className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50">
                      <option value="">Non défini</option>
                      <option value="gk">Gardien (GK)</option>
                      <option value="def">Défenseur (DEF)</option>
                      <option value="mid">Milieu (MID)</option>
                      <option value="att">Attaquant (ATT)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="add-mot-de-passe" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Mot de passe (Portail)</label>
                    <input id="add-mot-de-passe" type="password" value={addFormData.mot_de_passe} onChange={e => setAddFormData({...addFormData, mot_de_passe: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="add-photo" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Photo (Optionnel)</label>
                    <input id="add-photo" type="file" accept="image/*" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="add-adresse" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Adresse complète</label>
                  <textarea id="add-adresse" value={addFormData.adresse} onChange={e => setAddFormData({...addFormData, adresse: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 min-h-[100px]" />
                </div>
                <button 
                  type="submit" 
                  disabled={addLoading}
                  className="w-full py-4 rounded-xl bg-gold border border-gold/40 text-navy-deep font-black text-[12px] uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 mt-4"
                >
                  {addLoading ? 'Enregistrement...' : 'Sauvegarder dans le Fichier Joueur'}
                </button>
              </form>
           </div>
        </div>
      )}

      {/* Edit Player Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy-deep/80 backdrop-blur-xl animate-in fade-in duration-500" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
           <div className="relative w-full max-w-2xl bg-navy-deep border border-white/10 rounded-[2rem] shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-rose-500 hover:border-rose-500 transition active:scale-90"
                aria-label="Fermer le formulaire de modification"
              >
                <X size={20} />
              </button>
              <h2 id="edit-modal-title" className="text-2xl font-black text-white uppercase tracking-widest italic mb-8">Modifier la Licence</h2>
              <form onSubmit={handleEditPlayer} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="edit-nom" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Nom</label>
                    <input id="edit-nom" required type="text" value={editFormData.nom} onChange={e => setEditFormData({...editFormData, nom: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-prenom" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Prénom</label>
                    <input id="edit-prenom" required type="text" value={editFormData.prenom} onChange={e => setEditFormData({...editFormData, prenom: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-num-licence" className="text-[10px] font-black text-white/50 uppercase tracking-widest">N° de Licence</label>
                    <input id="edit-num-licence" type="text" value={editFormData.num_licence} onChange={e => setEditFormData({...editFormData, num_licence: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-email" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Identifiant (Email)</label>
                    <input id="edit-email" type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-telephone" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Téléphone</label>
                    <input id="edit-telephone" type="text" value={editFormData.telephone} onChange={e => setEditFormData({...editFormData, telephone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-date-naissance" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Date de naissance</label>
                    <input id="edit-date-naissance" type="date" value={editFormData.date_naissance} onChange={e => setEditFormData({...editFormData, date_naissance: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 [color-scheme:dark]" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-categorie" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Catégorie & Cotisation</label>
                    <CategorySelect
                      id="edit-categorie"
                      value={editFormData.categorie_actuelle}
                      onChange={val => setEditFormData({...editFormData, categorie_actuelle: val})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-equipe" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Équipe</label>
                    <select id="edit-equipe" required value={editFormData.equipe_id} onChange={e => setEditFormData({...editFormData, equipe_id: e.target.value})} className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50">
                      <option value="">Sélectionner une équipe</option>
                      {teams?.map((t: Team) => <option key={t.id} value={t.id}>{t.nom}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="edit-poste" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Poste</label>
                    <select id="edit-poste" value={editFormData.poste} onChange={e => setEditFormData({...editFormData, poste: e.target.value})} className="w-full bg-[#0a1128] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50">
                      <option value="">Non défini</option>
                      <option value="gk">Gardien (GK)</option>
                      <option value="def">Défenseur (DEF)</option>
                      <option value="mid">Milieu (MID)</option>
                      <option value="att">Attaquant (ATT)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`edit-mot-de-passe-${editPlayerId}`} className="text-[10px] font-black text-white/50 uppercase tracking-widest">Nouveau mot de passe (Laisser vide si inchangé)</label>
                    <input id={`edit-mot-de-passe-${editPlayerId}`} type="password" value={editFormData.mot_de_passe} onChange={e => setEditFormData({...editFormData, mot_de_passe: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor={`edit-photo-${editPlayerId}`} className="text-[10px] font-black text-white/50 uppercase tracking-widest">Photo (Optionnel)</label>
                    <input id={`edit-photo-${editPlayerId}`} type="file" accept="image/*" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-adresse" className="text-[10px] font-black text-white/50 uppercase tracking-widest">Adresse complète</label>
                  <textarea id="edit-adresse" value={editFormData.adresse} onChange={e => setEditFormData({...editFormData, adresse: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-gold/50 min-h-[100px]" />
                </div>
                <button 
                  type="submit" 
                  disabled={editLoading}
                  className="w-full py-4 rounded-xl bg-gold border border-gold/40 text-navy-deep font-black text-[12px] uppercase tracking-widest hover:scale-[1.02] transition-transform active:scale-95 mt-4"
                >
                  {editLoading ? 'Enregistrement...' : 'Sauvegarder les modifications'}
                </button>
              </form>
           </div>
        </div>
      )}
    </>
  );
}
