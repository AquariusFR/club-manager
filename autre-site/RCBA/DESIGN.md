# DESIGN.md - RCBA Expert

This design system defines the visual language for the **Racing Club Bû Abondant (RCBA)** Expert Portal. It is optimized for AI agent consumption to ensure pixel-perfect and consistent UI generation.

## 🧬 Brand Identity
The **RCBA Expert** identity is built on raw passion, energy, and ambitious amateur football.

- **Primary Motif**: Dynamic Athleticism / Match Day Energy.
- **Key Concepts**: Brutalism, Sharp Edges, High Contrast, Action.

## 🎨 Color Tokens (Pitch & Tech)

| Token | HSL / Hex | Usage |
| :--- | :--- | :--- |
| `navy-deep` | `#020617` | Main background, solid foundations. |
| `pitch-green`| `#62CB72` | Primary action color, vibrant energy, "Pitch" branding. |
| `gold` | `#D4AF37` | Trophies, secondary highlights, club heritage. |
| `white/20` | `rgba(255,255,255,0.2)` | Solid borders, stark contrast lines. |
| `white/60` | `rgba(255,255,255,0.6)` | Subtitles, secondary tracking text. |

## 🏗️ UI Architecture: Dynamic Brutalism

All containers must follow the **Dynamic Frame** pattern:
- **Background**: Solid colors (e.g., `bg-navy-deep` or `bg-navy`). Avoid heavy blur/glass unless necessary.
- **Borders**: Sharp, visible borders (`border-2 border-white/10`).
- **Shapes**: Sharp edges, no extreme rounding unless it's a specific badge. Use `skew` for dynamic forward motion.
- **Shadows**: Hard, offset drop-shadows (`brutal-shadow`) instead of soft, glowing halos.

## ✍️ Typography

- **Headings (Athletic)**: `font-display`, `black`, `italic`, `uppercase`, `tracking-[0.15em]`.
- **Subtitles (Technical)**: `text-[10px]`, `font-black`, `uppercase`, `tracking-[0.5em]`, `text-white/60`.
- **Body**: Clean sans-serif (Inter/Roboto), high legibility.

## 🧩 Core Components

### 1. AuraNavbar
- **Height**: `py-4` (Desktop).
- **Effect**: Solid background `bg-navy-deep`, stark bottom border `border-b-2 border-white/10`.
- **Brand Badge**: Sharp rectangle, solid background.

### 2. Metric Cards & Highlights
- **Style**: Sharp borders (`rounded-none` or `rounded-sm`), brutalist offset shadows. Diagonal background patterns (`brutal-bg`, `slash-overlay`) to show action.

## ✨ Animations & Transitions
- **Hover Transitions**: Snappy, quick transitions (`duration-200` or `duration-300`).
- **Interactions**: Hard translations (`translate-x-1`, `translate-y-1`) and solid border color changes.

---
*Generated for RCBA — CodeIA Design Systems*
