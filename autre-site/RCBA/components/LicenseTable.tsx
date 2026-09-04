'use client';

import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Filter,
  RefreshCw,
  Mail,
  ShieldCheck,
  AlertCircle,
  Zap,
  Cpu,
  ArrowUpDown,
  CreditCard,
  Link as LinkIcon,
  Euro,
  Users,
  Trash2,
  Plus,
  X,
  Pencil
} from "lucide-react";
import { 
  updateLicenseStatusAction, 
  validateFullLicenseAction,
  bulkValidateFullLicenseAction,
  sendLicenseReminderAction, 
  sendBulkLicenseRemindersAction,
  updateLicenseDataFromOCRAction,
  addPlayerAction,
  deletePlayerAction,
  updatePlayerAction,
  notifyCoachMissingDocumentsAction
} from "@/lib/actions";
import { DocumentGenerator } from "@/lib/DocumentGenerator";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { getLicensePrice } from "@/lib/utils";
import MagneticWrapper from "./MagneticWrapper";
import MassActionButton from "./MassActionButton";
import HudCorners from "./HudCorners";
import { OCRScanner } from "./OCRScanner";
import { FileText, Download, Fingerprint } from 'lucide-react';
import { FinancialHub } from "./LicenseTable/FinancialHub";
import { LicenseModals } from "./LicenseTable/LicenseModals";
import { RegistryList } from "./LicenseTable/RegistryList";

interface LicenseEntry {
  joueur_id: number;
  prenom: string;
  nom: string;
  equipe_nom: string;
  categorie: string;
  photo_url?: string;
  paiement_effectue: number;
  documents_complets: number;
  etat_cotisation: string;
  email?: string;
  num_licence?: string;
  adresse?: string;
  telephone?: string;
  date_naissance?: string;
  equipe_id?: number;
  poste?: string;
}

interface Team {
  id: number;
  nom: string;
  categorie: string;
}

export default function LicenseTable({ 
  sessions, 
  categories = [], 
  teams = [] 
}: { 
  sessions: LicenseEntry[], 
  categories?: string[], 
  teams?: Team[] 
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get('q') || '';
  const filter = searchParams.get('f') || 'all';

  const [loading, setLoading] = useState<number | null>(null);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [showOCR, setShowOCR] = useState(false);
  const [selectedPlayerForOCR, setSelectedPlayerForOCR] = useState<number | null>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(sessions.map(s => s.joueur_id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Êtes-vous sûr de vouloir supprimer les ${selectedIds.length} joueurs sélectionnés ?`)) {
      setLoading(-1);
      try {
        await Promise.all(selectedIds.map(id => deletePlayerAction(id)));
        setSelectedIds([]);
        router.refresh();
      } catch (e: any) {
        alert("Une erreur est survenue lors de la suppression.");
      } finally {
        setLoading(null);
      }
    }
  };

  // Add Player State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addFormData, setAddFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    num_licence: '',
    adresse: '',
    categorie_actuelle: 'Seniors & Vétérans',
    equipe_id: '',
    date_naissance: '',
    mot_de_passe: '',
    poste: ''
  });

  // Edit Player State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editPlayerId, setEditPlayerId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    num_licence: '',
    adresse: '',
    categorie_actuelle: 'Seniors & Vétérans',
    equipe_id: '',
    date_naissance: '',
    mot_de_passe: '',
    poste: ''
  });

  const openEditModal = (player: LicenseEntry) => {
    setEditPlayerId(player.joueur_id);
    setEditFormData({
      nom: player.nom || '',
      prenom: player.prenom || '',
      email: player.email || '',
      telephone: player.telephone || '',
      num_licence: player.num_licence || '',
      adresse: player.adresse || '',
      categorie_actuelle: player.categorie || 'Seniors & Vétérans',
      equipe_id: player.equipe_id ? player.equipe_id.toString() : '',
      date_naissance: player.date_naissance || '',
      mot_de_passe: '',
      poste: player.poste || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlayerId) return;
    setEditLoading(true);
    try {
      const fd = new FormData();
      fd.append('nom', editFormData.nom);
      fd.append('prenom', editFormData.prenom);
      fd.append('email', editFormData.email);
      fd.append('telephone', editFormData.telephone);
      fd.append('num_licence', editFormData.num_licence);
      fd.append('adresse', editFormData.adresse);
      fd.append('categorie_actuelle', editFormData.categorie_actuelle);
      fd.append('equipe_id', editFormData.equipe_id);
      if (editFormData.date_naissance) fd.append('date_naissance', editFormData.date_naissance);
      if (editFormData.mot_de_passe) fd.append('mot_de_passe', editFormData.mot_de_passe);
      if (editFormData.poste) fd.append('poste', editFormData.poste);
      const photoInput = document.getElementById(`edit-photo-${editPlayerId}`) as HTMLInputElement;
      if (photoInput && photoInput.files && photoInput.files[0]) {
        fd.append('photo', photoInput.files[0]);
      }

      const result = await updatePlayerAction(editPlayerId, fd);
      if (result.success) {
        setIsEditModalOpen(false);
        router.refresh();
      } else {
        alert(result.error || "Une erreur est survenue");
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeletePlayer = async (id: number, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement le joueur ${name} ? Tous ses enregistrements associés (licences, convocations, présences, logs de performance) seront également supprimés.`)) {
      setLoading(id);
      try {
        const result = await deletePlayerAction(id);
        if (result.success) {
          router.refresh();
        } else {
          alert(result.error || "Une erreur est survenue");
        }
      } finally {
        setLoading(null);
      }
    }
  };

  const handleAddPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const fd = new FormData();
      fd.append('nom', addFormData.nom);
      fd.append('prenom', addFormData.prenom);
      fd.append('email', addFormData.email);
      fd.append('telephone', addFormData.telephone);
      fd.append('num_licence', addFormData.num_licence);
      fd.append('adresse', addFormData.adresse);
      fd.append('categorie_actuelle', addFormData.categorie_actuelle);
      fd.append('equipe_id', addFormData.equipe_id);
      if (addFormData.date_naissance) fd.append('date_naissance', addFormData.date_naissance);
      if (addFormData.mot_de_passe) fd.append('mot_de_passe', addFormData.mot_de_passe);
      if (addFormData.poste) fd.append('poste', addFormData.poste);
      const photoInput = document.getElementById('add-photo') as HTMLInputElement;
      if (photoInput && photoInput.files && photoInput.files[0]) {
        fd.append('photo', photoInput.files[0]);
      }

      const result = await addPlayerAction(fd);
      if (result.success) {
        setIsAddModalOpen(false);
        setAddFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          num_licence: '',
          adresse: '',
          categorie_actuelle: 'Seniors & Vétérans',
          equipe_id: '',
          date_naissance: '',
          mot_de_passe: '',
          poste: ''
        });
        router.refresh();
      } else {
        alert(result.error || "Une erreur est survenue");
      }
    } finally {
      setAddLoading(false);
    }
  };

  const handleOCRComplete = async (data: any) => {
    if (selectedPlayerForOCR) {
      setLoading(selectedPlayerForOCR);
      try {
        await updateLicenseDataFromOCRAction(selectedPlayerForOCR, data);
      } finally {
        setLoading(null);
        setSelectedPlayerForOCR(null);
      }
    }
  };

  const handleDownloadAttestation = (joueur: LicenseEntry) => {
    const html = DocumentGenerator.generateMembershipAttestation({
      playerName: `${joueur.prenom} ${joueur.nom}`,
      category: joueur.categorie,
      season: "2025/2026",
    });
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Attestation_${joueur.nom}_${joueur.prenom}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  };

  const handleToggle = async (id: number, field: 'paiement_effectue' | 'documents_complets', current: number) => {
    setLoading(id);
    try {
      await updateLicenseStatusAction(id, field, current === 0);
    } finally {
      setLoading(null);
    }
  };

  const handleValidateFull = async (id: number) => {
    setLoading(id);
    try {
      await validateFullLicenseAction(id);
    } finally {
      setLoading(null);
    }
  };

  const handleSendReminder = async (id: number) => {
    setSendingId(id);
    try {
      const result = await sendLicenseReminderAction(id);
      if (result.success) {
        // Handle success
      } else {
        alert(result.error);
      }
    } finally {
      setSendingId(null);
    }
  };

  const totalExpected = sessions.reduce((sum, s) => sum + getLicensePrice(s.categorie), 0);
  const collected = sessions.reduce((sum, s) => sum + (s.paiement_effectue === 1 ? getLicensePrice(s.categorie) : 0), 0);
  const missing = totalExpected - collected;
  const collectionRate = totalExpected > 0 ? Math.round((collected / totalExpected) * 100) : 0;
  const unpaidCount = sessions.filter(s => s.paiement_effectue === 0).length;

  return (
    <div className="space-y-12">
      {/* ══════════════════════════════════════════
          FINANCIAL INTELLIGENCE HUB
      ══════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════
          FINANCIAL INTELLIGENCE HUB
      ══════════════════════════════════════════ */}
      <FinancialHub 
        totalExpected={totalExpected}
        collectionRate={collectionRate}
        missing={missing}
        unpaidCount={unpaidCount}
        incompleteCount={sessions.filter(s => s.paiement_effectue === 1 && s.documents_complets === 0).length}
        selectedIds={selectedIds}
        loading={loading}
        handleBulkDelete={handleBulkDelete}
        setShowOCR={setShowOCR}
      />

      <LicenseModals 
        showOCR={showOCR}
        setShowOCR={setShowOCR}
        setSelectedPlayerForOCR={setSelectedPlayerForOCR}
        handleOCRComplete={handleOCRComplete}
        isAddModalOpen={isAddModalOpen}
        setIsAddModalOpen={setIsAddModalOpen}
        addLoading={addLoading}
        addFormData={addFormData}
        setAddFormData={setAddFormData}
        handleAddPlayer={handleAddPlayer}
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        editLoading={editLoading}
        editPlayerId={editPlayerId}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        handleEditPlayer={handleEditPlayer}
        teams={teams}
      />

      {/* ══════════════════════════════════════════
          REGISTRY INTERFACE
      ══════════════════════════════════════════ */}
      <RegistryList 
        search={search}
        updateURL={updateURL}
        filter={filter}
        searchParams={searchParams}
        categories={categories}
        sessions={sessions}
        setIsAddModalOpen={setIsAddModalOpen}
        selectedIds={selectedIds}
        handleSelectOne={handleSelectOne}
        openEditModal={openEditModal}
        handleSendReminder={handleSendReminder}
        sendingId={sendingId}
        notifyCoachMissingDocumentsAction={notifyCoachMissingDocumentsAction}
        loading={loading}
        setLoading={setLoading}
        handleToggle={handleToggle}
        handleSelectAll={handleSelectAll}
        isPending={isPending}
        setSelectedPlayerForOCR={setSelectedPlayerForOCR}
        setShowOCR={setShowOCR}
        handleDownloadAttestation={handleDownloadAttestation}
        handleValidateFull={handleValidateFull}
      />
    </div>
  );
}
