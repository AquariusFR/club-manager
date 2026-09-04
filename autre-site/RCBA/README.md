# RCBA Expert Portal 🛡️⚽

Bienvenue sur le portail expert du **Racing Club Bû Abondant (RCBA)**. Cette plateforme moderne est dédiée à la gestion sportive, administrative et tactique du club.

## 🚀 Fonctionnalités Clés

- **Pilotage Global** (Direction) : Suivi des licences, trésorerie (buvette), et KPIs de performance.
- **Roster Elite** (Public/Coach) : Consultation des effectifs synchronisés en temps réel avec Footeo.
- **Intelligence Axis & Aura Elite** : Modules de monitoring tactique et d'analyse de performance.
- **Espace Membre** : Portails dédiés pour les parents, joueurs et coachs.

## 🛠️ Stack Technique

- **Framework** : Next.js 15+ (App Router)
- **Styling** : Tailwind CSS (Design System "Aura Glass v2")
- **Base de données** : SQLite (Architecture locale `site/rcba.db`)
- **Branding** : Athletic Prestige, Glassmorphism, Pitch Green & Gold.

## 🏁 Installation & Démarrage

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Démarrer le serveur de développement** :
   ```bash
   npm run dev
   ```

3. **Synchroniser les données Footeo** :
   ```bash
   node scripts/sync_rcba_technical_data.js
   ```

4. **Accès** : Ouvrez [http://localhost:3000](http://localhost:3000).

## 🧬 Design System
Consultez [DESIGN.md](./DESIGN.md) pour plus de détails sur la charte graphique et les tokens "Aura Glass".

---
© 2026 Racing Club Bû Abondant - Portail Expert.
