---
trigger: always_on
description: Chargement automatique des skills RCBA à chaque session agent
---

# 🧠 Skills Auto-Loader — RCBA

## Règle absolue

**Avant d'écrire du code ou de répondre à une tâche technique**, l'agent doit :

1. Identifier le(s) déclencheur(s) correspondant dans la table ci-dessous
2. Lire le SKILL.md associé avec `view_file`
3. Appliquer les patterns documentés dans le skill

---

## Table de dispatch des skills

| Déclencheurs (mots-clés dans la tâche) | Skill à charger | Chemin SKILL.md |
|---|---|---|
| animation, transition, CSS animate, dropdown, modal, badge, icon swap, card resize, page slide, panel reveal, number pop, text swap, success check, error shake, hover lift, avatar hover | **transitions-dev** | `.agents/skills/transitions-dev/SKILL.md` |
| design frontend, composant UI, layout, grid, Tailwind, couleurs, tokens, spacing | **frontend-design** | `.agents/skills/frontend-design/SKILL.md` |
| micro-interaction, hover effect, polish, feel, bouton, click feedback | **make-interfaces-feel-better** | `.agents/skills/make-interfaces-feel-better/SKILL.md` |
| simplifier, refactor, nettoyage, dette technique, trop complexe, réduire | **simplify** | `.agents/skills/simplify/SKILL.md` |
| UX, accessibilité, ARIA, keyboard, focus, expérience utilisateur, WCAG | **ui-ux-pro-max** | `.agents/skills/ui-ux-pro-max/SKILL.md` |
| scanner skill, sécurité skill, audit skill, vulnérabilité, prompt injection, skill safe, SkillSpector | **skillspector** | `.agents/skills/skillspector/SKILL.md` |
| node_modules, espace disque, nettoyer, supprimer dépendances, npkill, libérer espace, disk cleanup | **npkill** | `.agents/skills/npkill/SKILL.md` |
| GitHub Actions, CI/CD, workflow yml, pipeline, déploiement automatique, on push, secrets CI, matrix, act, OIDC, runner | **github-actions-course** | `.agents/skills/github-actions-course/SKILL.md` |
| generative UI, interface IA, streaming UI, copilot IA, LLM render, OpenUI, OpenUI Lang, chat IA, AI component, modèle génère UI | **openui** | `.agents/skills/openui/SKILL.md` |

---

## Procédure de chargement

```
POUR chaque tâche reçue :
  1. Lire la description de la tâche
  2. Chercher les mots-clés dans la colonne "Déclencheurs"
  3. SI correspondance trouvée :
       view_file(<chemin SKILL.md>)
       appliquer les patterns du skill
  4. SINON :
       procéder normalement
```

## Skills disponibles (8 au total)

```
.agents/skills/
├── transitions-dev/       → 12 transitions CSS (modal, dropdown, badge, page slide…)
├── frontend-design/       → Patterns Tailwind, composants, design system
├── make-interfaces-feel-better/ → Micro-interactions et polish UI
├── simplify/              → Refactoring minimaliste
├── ui-ux-pro-max/         → UX avancé, accessibilité
├── skillspector/          → Audit sécurité skills IA (NVIDIA, 64 patterns)
├── npkill/                → Nettoyage node_modules, libérer espace disque
└── github-actions-course/ → GitHub Actions CI/CD débutant → pro
```

## Nouveau skill installé ?

Ajouter une ligne dans cette table ET dans :
- `CLAUDE.md` (section Skills actifs)
- `AGENTS.md` (section skills-auto-load)  
- `skills.md` (registre officiel RCBA)
- `skills-lock.json` (hash de la source)
