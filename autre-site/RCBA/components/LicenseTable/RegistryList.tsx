import React from "react";
import { 
  Search, Filter, Users, Plus, Pencil, Mail, 
  RefreshCw, CheckCircle2, CreditCard, ShieldCheck, 
  AlertCircle, ArrowUpDown, Cpu, Fingerprint, Download, Zap, Euro 
} from 'lucide-react';
import MagneticWrapper from "../MagneticWrapper";
import { getLicensePrice } from "@/lib/utils";

interface RegistryListProps {
  search: string;
  updateURL: (key: string, value: string) => void;
  filter: string;
  searchParams: URLSearchParams;
  categories: string[];
  sessions: any[];
  setIsAddModalOpen: (val: boolean) => void;
  selectedIds: number[];
  handleSelectOne: (id: number) => void;
  openEditModal: (session: any) => void;
  handleSendReminder: (id: number) => void;
  sendingId: number | null;
  notifyCoachMissingDocumentsAction: (id: number) => Promise<{success?: boolean, error?: string}>;
  loading: number | null;
  setLoading: (id: number | null) => void;
  handleToggle: (id: number, field: 'paiement_effectue'|'documents_complets', currentValue: number) => void;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPending: boolean;
  setSelectedPlayerForOCR: (id: number) => void;
  setShowOCR: (val: boolean) => void;
  handleDownloadAttestation: (session: any) => void;
  handleValidateFull: (id: number) => void;
}

export function RegistryList({
  search, updateURL, filter, searchParams, categories, sessions,
  setIsAddModalOpen, selectedIds, handleSelectOne, openEditModal,
  handleSendReminder, sendingId, notifyCoachMissingDocumentsAction,
  loading, setLoading, handleToggle, handleSelectAll, isPending,
  setSelectedPlayerForOCR, setShowOCR, handleDownloadAttestation,
  handleValidateFull
}: RegistryListProps) {
  return (
    <>
      {/* ══════════════════════════════════════════
          REGISTRY INTERFACE
      ══════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row gap-8 items-center bg-white/[0.01] border border-white/5 p-4 rounded-3xl backdrop-blur-md">
        <div className="relative group flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-white/20 group-focus-within:text-gold transition group-focus-within:scale-110" />
          </div>
          <input 
            type="text" 
            placeholder="Interroger le registre par patronyme..." 
            className="block w-full bg-navy-deep/50 border border-white/10 rounded-2xl py-6 pl-20 pr-8 text-sm font-black text-white placeholder-white/20 outline-none focus:ring-[12px] focus:ring-gold/5 focus:border-gold/40 transition backdrop-blur-3xl shadow-inner uppercase tracking-wider italic"
            defaultValue={search}
            onChange={(e) => updateURL('q', e.target.value)}
            aria-label="Interroger le registre par patronyme"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 bg-navy-deep/50 border border-white/10 p-2 rounded-2xl backdrop-blur-3xl shadow-2xl w-full md:w-auto">
          <div className="flex items-center gap-6 px-6 py-4 bg-white/5 rounded-xl border border-white/5 hover:border-gold/30 transition group cursor-pointer w-full md:w-auto">
            <Filter size={18} className="text-gold group-hover:rotate-180 transition-transform duration-700" />
            <select 
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] text-white/50 outline-none cursor-pointer hover:text-white transition-colors py-2 italic appearance-none w-full"
              value={filter}
              onChange={(e) => updateURL('f', e.target.value)}
              aria-label="Filtrer par statut"
            >
              <option value="all" className="bg-navy-deep py-4">TOUS STATUTS</option>
              <option value="unpaid" className="bg-navy-deep py-4">IMPAYÉS (ROUGE)</option>
              <option value="incomplete" className="bg-navy-deep py-4">INCOMPLETS (ORANGE)</option>
              <option value="validated" className="bg-navy-deep py-4">VALIDÉS (VERT)</option>
            </select>
          </div>

          <div className="w-px h-6 bg-white/10 hidden lg:block" />

          <div className="flex items-center gap-6 px-6 py-4 bg-white/5 rounded-xl border border-white/5 hover:border-gold/30 transition group cursor-pointer w-full md:w-auto">
            <Users size={18} className="text-gold" />
            <select 
              className="bg-transparent border-none text-[10px] font-black uppercase tracking-[0.2em] text-white/50 outline-none cursor-pointer hover:text-white transition-colors py-2 italic appearance-none w-full"
              value={searchParams.get('cat') || 'all'}
              onChange={(e) => updateURL('cat', e.target.value)}
              aria-label="Filtrer par catégorie"
            >
              <option value="all" className="bg-navy-deep py-4">TOUTES CATÉGORIES</option>
              {(categories.length > 0 ? categories : Array.from(new Set(sessions.map(s => s.categorie))).sort()).map(cat => (
                <option key={cat} value={cat} className="bg-navy-deep py-4">{cat}</option>
              ))}
            </select>
          </div>

          <div className="w-px h-6 bg-white/10 hidden lg:block" />

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-gold text-navy-deep rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition shadow-lg shadow-gold/20 italic w-full md:w-auto"
          >
            <Plus size={14} /> Ajouter un joueur
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-card overflow-hidden border-white/10 bg-white/[0.01] shadow-3xl relative rounded-[3rem] backdrop-blur-2xl w-full mt-12">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        {/* MOBILE VIEW */}
        <div className="md:hidden flex flex-col divide-y divide-white/5">
          {sessions.map((s) => (
             <div key={`mob-${s.joueur_id}`} className="p-8 flex flex-col gap-8 relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-gold/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start relative z-10">
                   <div className="flex gap-4">
                     <input 
                       type="checkbox" 
                       className="w-5 h-5 mt-2 rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer shrink-0"
                       checked={selectedIds.includes(s.joueur_id)}
                       onChange={() => handleSelectOne(s.joueur_id)}
                       aria-label={`Sélectionner ${s.prenom} ${s.nom}`}
                     />
                     <div className="flex flex-col gap-3">
                       <span className="inline-flex px-4 py-1.5 rounded-lg bg-gold/5 border border-gold/10 text-[9px] font-black uppercase text-gold italic tracking-widest mb-2 w-max">
                        {s.equipe_nom}
                     </span>
                     <div className="text-3xl font-black text-white italic tracking-tight athletic-title athletic-skew leading-none">
                       {s.prenom} <span className="text-white/40">{s.nom}</span>
                     </div>
                     <div className="text-xs font-mono text-white/60 flex flex-col gap-2 mt-4">
                       {s.email && <span className="flex items-center gap-3"><span className="text-white/30">0xM •</span> <span className="text-white font-bold truncate max-w-[200px]">{s.email}</span></span>}
                       {s.telephone && <span className="flex items-center gap-3"><span className="text-white/30">0xT •</span> <span className="text-white font-bold">{s.telephone}</span></span>}
                     </div>
                   </div>
                   </div>
                   <div className="flex flex-col gap-2">
                     <button 
                       onClick={() => openEditModal(s)}
                       className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-blue-400 active:scale-95 transition hover:text-white hover:bg-blue-500 shadow-3xl backdrop-blur-3xl"
                       aria-label={`Modifier ${s.prenom} ${s.nom}`}
                     >
                       <Pencil size={20} />
                     </button>
                     {(s.paiement_effectue === 0 || s.documents_complets === 0) && (
                       <>
                         <button 
                           onClick={() => handleSendReminder(s.joueur_id)}
                           disabled={sendingId === s.joueur_id}
                           title="Relancer le joueur"
                           aria-label={`Relancer ${s.prenom} ${s.nom}`}
                           className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white/40 active:scale-95 transition hover:text-gold hover:border-gold/30 shadow-3xl backdrop-blur-3xl"
                         >
                           <Mail size={20} />
                         </button>
                         <button 
                           onClick={async () => {
                             setLoading(s.joueur_id);
                             const res = await notifyCoachMissingDocumentsAction(s.joueur_id);
                             if (res.success) alert(`Coach(s) notifié(s) avec succès !`);
                             else alert(res.error || "Erreur lors de la notification");
                             setLoading(null);
                           }}
                           disabled={loading === s.joueur_id}
                           title="Notifier le coach (dossier incomplet)"
                           aria-label={`Notifier le coach pour ${s.prenom} ${s.nom}`}
                           className="p-5 rounded-2xl bg-white/5 border border-white/10 text-white/40 active:scale-95 transition hover:text-rose-500 hover:border-rose-500/30 shadow-3xl backdrop-blur-3xl"
                         >
                           <Users size={20} />
                         </button>
                       </>
                     )}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 relative z-10">
                  <button 
                    onClick={() => handleToggle(s.joueur_id, 'paiement_effectue', s.paiement_effectue)}
                    disabled={loading === s.joueur_id}
                    className={`py-6 rounded-2xl border flex flex-col items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition active:scale-95 shadow-xl italic ${
                      s.paiement_effectue ? 'bg-pitch-green/10 border-pitch-green/20 text-pitch-green shadow-glow-green/10' : 'bg-gold/5 border-gold/10 text-gold shadow-glow/10'
                    }`}
                  >
                    {loading === s.joueur_id ? <RefreshCw size={16} className="animate-spin shadow-none" /> : 
                       s.paiement_effectue ? <><CheckCircle2 size={16} /> VALIDE</> : <><CreditCard size={16} /> ENCOURS</>}
                  </button>
                  <button 
                    onClick={() => handleToggle(s.joueur_id, 'documents_complets', s.documents_complets)}
                    disabled={loading === s.joueur_id}
                    className={`py-6 rounded-2xl border flex flex-col items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition active:scale-95 shadow-xl italic ${
                      s.documents_complets ? 'bg-pitch-green/10 border-pitch-green/20 text-pitch-green shadow-glow-green/10' : 'bg-white/5 border-white/10 text-white/20'
                    }`}
                  >
                    {loading === s.joueur_id ? <RefreshCw size={16} className="animate-spin shadow-none" /> : 
                       s.documents_complets ? <><ShieldCheck size={16} /> COMPLET</> : <><AlertCircle size={16} /> DOSSIER -</>}
                  </button>
                </div>
             </div>
          ))}
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden md:block overflow-x-auto relative">
          <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-3 py-4 w-12">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer"
                  checked={sessions.length > 0 && selectedIds.length === sessions.length}
                  onChange={handleSelectAll}
                  aria-label="Sélectionner tous les joueurs"
                />
              </th>
              <th className="px-3 py-4">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                  IDENTITE LICENCIE <ArrowUpDown size={12} className="opacity-50" />
                </div>
              </th>
              <th className="px-3 py-4">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                  CONTACT DATA
                </div>
              </th>
              <th className="px-3 py-4 text-center">
                <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                  STATUS FINANCE
                </div>
              </th>
              <th className="px-3 py-4 text-center">
                <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                  CONFORMITÉ
                </div>
              </th>
              <th className="px-3 py-4 text-right pr-6">
                <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">
                  OPS
                </div>
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y divide-white/5 transition-opacity duration-700 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
            {sessions.map((s) => (
              <tr key={s.joueur_id} className="hover:bg-white/[0.04] transition group relative">
                <td className="px-3 py-4">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50 cursor-pointer"
                    checked={selectedIds.includes(s.joueur_id)}
                    onChange={() => handleSelectOne(s.joueur_id)}
                    aria-label={`Sélectionner ${s.prenom} ${s.nom}`}
                  />
                </td>
                <td className="px-3 py-4 relative">
                  <div className={`absolute inset-y-0 left-0 w-1 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top ${
                    s.paiement_effectue === 0 ? 'bg-rose-500' : s.documents_complets === 0 ? 'bg-gold' : 'bg-pitch-green'
                  }`} />
                  <div className="flex flex-col gap-1.5 relative z-10 pl-3 w-full">
                    <div className={`text-xl font-black transition tracking-tight leading-none italic flex items-center gap-3 athletic-title athletic-skew ${
                      s.paiement_effectue === 0 ? 'text-rose-500' : s.documents_complets === 0 ? 'text-gold' : 'text-white group-hover:text-pitch-green'
                    }`}>
                      {s.photo_url && (
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
                          <img src={s.photo_url} alt="Photo" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        {s.prenom} <span className="text-white/40 group-hover:text-white transition-colors">{s.nom}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-white/30 uppercase tracking-[0.3em] italic leading-none group-hover:text-white/50 transition-colors">
                      {s.equipe_nom}
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <span className="font-mono text-[8px] opacity-40">NODE_0x{s.joueur_id.toString(16).padStart(4, '0')}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <span className={`flex items-center gap-1 font-black ${
                        s.paiement_effectue === 0 ? 'text-gold' : 'text-pitch-green opacity-50'
                      }`}>
                        <Euro size={9} />
                        {getLicensePrice(s.categorie)}€
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-col gap-1.5 text-xs font-mono text-white/60">
                    {s.num_licence && <div className="flex items-center gap-2"><span className="text-white/20 uppercase tracking-widest text-[9px] italic font-black">REG:</span> <span className="text-white/80 font-bold tracking-widest">{s.num_licence}</span></div>}
                    {s.email && <div className="flex items-center gap-2 group-hover:text-white transition-colors"><span className="text-white/20 uppercase tracking-widest text-[9px] italic font-black">MAIL:</span> <span className="truncate max-w-[150px] font-bold text-white" title={s.email}>{s.email}</span></div>}
                    {s.telephone && <div className="flex items-center gap-2 group-hover:text-white transition-colors"><span className="text-white/20 uppercase tracking-widest text-[9px] italic font-black">TEL:</span> <span className="font-bold text-white">{s.telephone}</span></div>}
                  </div>
                </td>
                <td className="px-3 py-4 text-center">
                  <MagneticWrapper>
                    <button 
                      onClick={() => handleToggle(s.joueur_id, 'paiement_effectue', s.paiement_effectue)}
                      disabled={loading === s.joueur_id}
                      className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border transition text-[9px] font-black uppercase tracking-[0.2em] italic active:scale-95 group/btn shadow-xl ${
                        s.paiement_effectue 
                          ? 'bg-pitch-green/10 border-pitch-green/30 text-pitch-green shadow-glow-green/5' 
                          : 'bg-gold/5 border-gold/20 text-gold hover:bg-pitch-green/10 hover:border-pitch-green/40 hover:text-pitch-green'
                      }`}
                    >
                      {loading === s.joueur_id ? (
                        <RefreshCw size={14} className="animate-spin opacity-50" />
                      ) : (
                        <>
                          {s.paiement_effectue ? (
                            <><CheckCircle2 size={16} className="shadow-glow-green" /> REGLE</>
                          ) : (
                            <><CreditCard size={16} className="group-hover/btn:scale-125 transition-transform duration-500" /> EN ATTENTE</>
                          )}
                        </>
                      )}
                    </button>
                  </MagneticWrapper>
                </td>
                <td className="px-3 py-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <MagneticWrapper>
                    <button 
                      onClick={() => handleToggle(s.joueur_id, 'documents_complets', s.documents_complets)}
                      disabled={loading === s.joueur_id}
                      className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl border transition text-[9px] font-black uppercase tracking-[0.2em] italic active:scale-95 group/btn2 shadow-xl ${
                        s.documents_complets 
                          ? 'bg-pitch-green/10 border-pitch-green/30 text-pitch-green shadow-glow-green/5' 
                          : 'bg-white/5 border-white/10 text-white/20 hover:bg-pitch-green/10 hover:border-pitch-green/40 hover:text-pitch-green hover:shadow-glow-green/5'
                      }`}
                    >
                      {loading === s.joueur_id ? (
                        <RefreshCw size={14} className="animate-spin opacity-50" />
                      ) : (
                        <>
                          {s.documents_complets ? (
                            <><ShieldCheck size={16} className="shadow-glow-green" /> CONFORME</>
                          ) : (
                            <><AlertCircle size={16} className="opacity-50" /> INCOMPLET</>
                          )}
                        </>
                      )}
                    </button>
                    </MagneticWrapper>
                    {s.documents_complets === 1 && (
                      <div className="flex items-center gap-2 opacity-30 group-hover:opacity-60 transition-opacity">
                        <Cpu size={12} className="text-pitch-green" />
                        <span className="text-[7px] font-black uppercase tracking-[0.3em] text-pitch-green italic">Encrypted Registry Sync</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-3 py-4 text-right pr-4">
                  <div className="flex justify-end gap-2">
                    <MagneticWrapper>
                      <button 
                        onClick={() => {
                          setSelectedPlayerForOCR(s.joueur_id);
                          setShowOCR(true);
                        }}
                        className="p-3 rounded-xl bg-gold/5 border border-gold/20 text-gold hover:bg-gold hover:text-navy-deep transition shadow-md group/ocr"
                        title="Scanner Certificat Médical (IA)"
                        aria-label={`Scanner certificat médical pour ${s.prenom} ${s.nom}`}
                      >
                        <Fingerprint size={16} className="group-hover/ocr:scale-110 transition-transform" />
                      </button>
                    </MagneticWrapper>

                    <MagneticWrapper>
                      <button 
                        onClick={() => openEditModal(s)}
                        className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition shadow-md group/edit"
                        title="Modifier la fiche joueur"
                        aria-label={`Modifier fiche joueur ${s.prenom} ${s.nom}`}
                      >
                        <Pencil size={16} className="group-hover/edit:scale-110 transition-transform" />
                      </button>
                    </MagneticWrapper>

                    <MagneticWrapper>
                      <button 
                        onClick={() => handleDownloadAttestation(s)}
                        className="p-3 rounded-xl bg-pitch-green/5 border border-pitch-green/20 text-pitch-green hover:bg-pitch-green hover:text-navy-deep transition shadow-md group/doc"
                        title="Générer Attestation de Licence"
                        aria-label={`Générer attestation de licence pour ${s.prenom} ${s.nom}`}
                      >
                        <Download size={16} className="group-hover/doc:translate-y-0.5 transition-transform" />
                      </button>
                    </MagneticWrapper>

                    {(s.paiement_effectue === 0 || s.documents_complets === 0) && (
                      <div className="flex items-center gap-2">
                        <MagneticWrapper>
                          <button 
                            onClick={() => handleValidateFull(s.joueur_id)}
                            disabled={loading === s.joueur_id}
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-pitch-green/10 border border-pitch-green/40 text-pitch-green hover:bg-pitch-green hover:text-navy-deep transition group/validate shadow-lg backdrop-blur-xl"
                            title="Validation Immédiate (Dossier + Paiement)"
                          >
                            {loading === s.joueur_id ? <RefreshCw size={16} className="animate-spin" /> : <Zap size={16} className="group-hover/validate:animate-bounce" />}
                          </button>
                        </MagneticWrapper>
                        
                        <MagneticWrapper>
                          <button 
                            onClick={() => handleSendReminder(s.joueur_id)}
                            disabled={sendingId === s.joueur_id}
                            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-gold hover:border-gold/40 hover:bg-gold/5 transition group/remind shadow-3xl backdrop-blur-3xl"
                            title="Lancer Protocole Relance"
                          >
                            {sendingId === s.joueur_id ? <RefreshCw size={16} className="animate-spin" /> : <Mail size={16} className="group-hover/remind:translate-x-0.5 group-hover/remind:-rotate-12 transition duration-500" />}
                          </button>
                        </MagneticWrapper>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {sessions.length === 0 && (
          <div className="py-60 flex flex-col items-center justify-center text-center relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent blur-[120px] rounded-full opacity-30" />
            <div className="w-32 h-32 rounded-[3.5rem] bg-white/[0.01] border border-white/10 flex items-center justify-center mb-10 shadow-3xl relative z-10">
              <Search size={48} className="text-white/20 animate-pulse" />
            </div>
            <h4 className="text-3xl font-black text-white/20 uppercase tracking-[1.2em] italic mb-6 relative z-10 athletic-title">PAS DE DONNEES</h4>
            <p className="text-[11px] text-white/30 font-black uppercase tracking-[0.5em] italic relative z-10 max-w-md leading-relaxed">
              Le protocole d'exploration a échoué. Aucun enregistrement n'a été identifié pour cet index de recherche.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[9px] font-black text-white/20 uppercase tracking-[0.6em] italic px-10 border-t border-white/5 pt-12 pb-8 group mt-8">
        <span className="group-hover:text-white transition-colors duration-1000">RCBA ADVANCED REGISTRY MANAGEMENT SYSTEM — v3.0 // 2026</span>
        <span className="flex items-center gap-6">
          <span className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-pitch-green shadow-glow-green animate-pulse" />
            <span className="text-pitch-green opacity-40 group-hover:opacity-100 transition-opacity duration-1000">ENCRYPTED LINK ACTIVE</span>
          </span>
          <span className="w-px h-4 bg-white/10" />
          <span className="group-hover:text-gold transition-colors duration-1000">NEURAL ARCHIVE 0x4F2A</span>
        </span>
      </div>
    </>
  );
}
