## 🧠 CodeIA Global Skills Auto-Loader
> **Avant de commencer une tâche**, utilisez votre outil `grep_search` pour chercher des mots-clés liés à la tâche dans `C:\CodeIA\MASTER_SKILLS_INDEX.md`. Si vous trouvez un skill pertinent, lisez son fichier `SKILL.md` avant d'agir. Ne lisez pas l'index entier.

## 🧠 Skills actifs — auto-chargés à chaque session

> Lire les SKILL.md correspondants avant d'agir sur les sujets listés.

| Skill | Chemin | Déclencheurs |
|---|---|---|
| **transitions-dev** | `.agents/skills/transitions-dev/SKILL.md` | animations, transitions CSS, dropdown, modal, badge, icon swap |
| **frontend-design** | `.agents/skills/frontend-design/SKILL.md` | design frontend, composants UI, layout |
| **make-interfaces-feel-better** | `.agents/skills/make-interfaces-feel-better/SKILL.md` | micro-interactions, polish, feel |
| **simplify** | `.agents/skills/simplify/SKILL.md` | simplification de code, refactor |
| **ui-ux-pro-max** | `.agents/skills/ui-ux-pro-max/SKILL.md` | UX avancé, expérience utilisateur |
| **skillspector** | `.agents/skills/skillspector/SKILL.md` | scan skill, sécurité skill, audit, vulnérabilité, NVIDIA |
| **npkill** | `.agents/skills/npkill/SKILL.md` | nettoyer node_modules, espace disque, npkill |
| **github-actions-course** | `.agents/skills/github-actions-course/SKILL.md` | GitHub Actions, CI/CD, workflow yaml, déploiement automatique |
| **openui** | `.agents/skills/openui/SKILL.md` | generative UI, streaming UI, AI interface, copilot, LLM render, OpenUI Lang |

---

1. Think Before Coding
Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.
2. Simplicity First
Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

5. Project-Specific Constraints (RCBA)
- Photos: NEVER use fake/generated/stock photos for people (players, staff). Only real photos.
- UI Stability: AVOID layout shifts on scroll or interactions. Ensure smooth, non-flickering menus.
- Accessibility: Ensure UI elements (logos, text) are LARGE and READABLE.
- Navigation: Always provide a clear way to return to the home page (Accueil) from sub-pages.
- Access Control: Portals (Coach, Parents, Direction) are strictly role-gated by the Direction.
