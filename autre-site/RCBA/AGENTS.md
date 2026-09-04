<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:skills-auto-load -->
## 🧠 Skills — chargement automatique

Avant toute action, l'agent DOIT lire les SKILL.md déclenchés par le contexte de la tâche.

| Skill | SKILL.md | Déclencheurs |
|---|---|---|
| **transitions-dev** | `.agents/skills/transitions-dev/SKILL.md` | CSS animation, transition, dropdown, modal, badge, icon swap, card resize, page slide |
| **frontend-design** | `.agents/skills/frontend-design/SKILL.md` | design frontend, composants UI, layout, Tailwind |
| **make-interfaces-feel-better** | `.agents/skills/make-interfaces-feel-better/SKILL.md` | micro-interactions, polish UI, hover effects |
| **simplify** | `.agents/skills/simplify/SKILL.md` | refactor, simplification, dette technique |
| **ui-ux-pro-max** | `.agents/skills/ui-ux-pro-max/SKILL.md` | UX avancé, accessibilité, expérience utilisateur |
| **skillspector** | `.agents/skills/skillspector/SKILL.md` | audit skill, scan sécurité, vulnérabilité agent, NVIDIA SkillSpector |
| **npkill** | `.agents/skills/npkill/SKILL.md` | nettoyer node_modules, libérer espace disque, npkill |
| **github-actions-course** | `.agents/skills/github-actions-course/SKILL.md` | GitHub Actions, CI/CD, workflow YAML, pipeline, déploiement automatique |
| **openui** | `.agents/skills/openui/SKILL.md` | generative UI, interface IA, streaming UI, copilot, LLM render, OpenUI Lang, chat IA |

### Règle d'activation

```
SI la tâche implique [déclencheur] → lire le SKILL.md correspondant AVANT d'écrire du code
```
<!-- END:skills-auto-load -->

