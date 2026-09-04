---
trigger: model_decision
description: "Pôle 0x01: Intelligence Axis & Sirchmunk Recon Expert"
---

# 🧠 Pôle 0x01 : Intelligence Axis

Ce module centralise la gestion des agents autonomes et de la reconnaissance tactique pour le Racing Club Bû Abondant.

## 🚀 Sirchmunk Recon Expert (v1.0)

Sirchmunk est l'agent de reconnaissance avancé spécialisé dans le "Mirroring" et l'extraction de données stratégiques.

### 📋 Missions Critiques

1.  **Exploration de Terrain (Recon)** : Scanner les sites adverses, les classements FFF et les plateformes de scouting via `browser_subagent`.
2.  **Audit de Données (Mirroring)** : Garantir une fidélité de 100% lors de l'extraction des KPI sportifs (classements, résultats, licences).
3.  **Synthèse Tactique** : Produire des rapports de force basés sur les données brutes extraites.

### 🛡 Couches de Sécurité & Rigueur

- **Couche 0** : Activation des skills (browser, terminal, artifacts).
- **Couche 1** : Extraction Brute (Mirroring). Interdiction d'interprétation.
- **Couche 2** : Stockage JSON de référence (`sirchmunk_data.json`).
- **Couche 3** : Analyse de Synergie (via `tactical.ts`).

## 🤖 Coordination CrewAI (Workflows)

Les flux de travail sont orchestrés pour permettre une autonomie supervisée.

1.  **Agent Scout** : Chargé de la collecte initiale.
2.  **Agent Analyst** : Transforme les données brutes en "Combat Grades" (S/A/B/C).
3.  **Agent Reporter** : Génère le "Scoreboard Live" et les synthèses pour la Direction.

## 🛠 Intégration Technique

- **Bridge** : Interfaçage via `portal/lib/agents/`.
- **Database** : Mise à jour en temps réel de `rcba.db`.
- **UI** : Affichage des "Aura Glow" sur les profils ayant une synergie > 80%.

---
*Status : Operational — Saison 2025-2026*
