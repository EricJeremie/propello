# Propello Brand Book

## Brand Overview

**Propello** is a proposal generator for professional services teams. The name combines "proposal" and "propel" — the idea of moving deals forward. The brand is confident, clean, and technical without being cold.

---

## Logo

The Propello mark is a blue circle containing a document icon with an upward arrow — representing proposals going out and deals moving up.

### Files
- `assets/logo.svg` — horizontal lockup (icon + wordmark), use at height 24–40px
- `assets/favicon.svg` — icon only, use for favicons and app icons

### Usage rules
- Always use the SVG files; never stretch or recolor the logo
- Minimum clear space: equal to the height of the "P" on all sides
- On dark backgrounds, use white version (invert the icon fill to white, keep circle fill)
- Do not place the logo on busy backgrounds without a white backdrop

---

## Color Palette

### Primary colors

| Name | Hex | Usage |
|---|---|---|
| Propello Blue | `#1A56B0` | Primary actions, links, active states, logo mark |
| Propello Navy | `#0F2D6B` | Dark text on light, headings in docs |
| Propello Sky | `#3B82F6` | Hover states, gradients, secondary accents |
| Propello Light | `#60A5FA` | Arrow in logo mark, light accents |

### Tints & backgrounds

| Name | Hex | Usage |
|---|---|---|
| Blue Tint | `#EFF6FF` | Hover backgrounds, selected states, tint fills |
| Blue Border | `#BFDBFE` | Hover borders, selected card borders |
| Page BG | `#edeff2` | App background |
| Card BG | `#ffffff` | Cards, panels |
| Subtle BG | `#f6f7f9` | Input backgrounds, subtle fills |

### Semantic colors (do not change)

| Name | Hex | Usage |
|---|---|---|
| Success | `#10b981` | Approved status, success toasts |
| Warning | `#f59e0b` | Review/pending status |
| Error | `#ef4444` | Error states |
| Text | `#14161a` | Body text |
| Text Muted | `#5b636f` | Labels, secondary copy |
| Border | `#e6e8ec` | Dividers, card borders |

### CSS variables (in `styles.css`)

```css
--rausch: #1A56B0;        /* primary blue — buttons, active nav, focus rings */
--rausch-hover: #1545A0;  /* darker blue on hover */
--rausch-tint: #EFF6FF;   /* light blue tint for hover/selected backgrounds */
```

> **Note for Codex:** The codebase uses `--rausch` as the primary color variable name for historical reasons. Treat `--rausch` as Propello Blue (`#1A56B0`) throughout.

---

## Typography

### UI font
**Inter** — the primary typeface for all app UI.

```css
font-family: 'Inter', -apple-system, system-ui, sans-serif;
```

### Document / proposal font
**Inter** for body. Headings use weight 800 with `letter-spacing: -0.02em`.

### Type scale

| Role | Size | Weight |
|---|---|---|
| Page title | 1.75rem | 800 |
| Card title | 0.875rem | 600 |
| Body | 0.875rem | 400 |
| Label | 0.75rem | 500 |
| Caption / meta | 0.72rem | 400 |
| Badge / eyebrow | 0.625rem | 700 |

### Proposal document type scale

| Role | Size | Weight |
|---|---|---|
| Proposal title | 2.5rem | 800 |
| Section number | 1rem | 800 |
| Section title | 1rem | 700, uppercase |
| Body | 11pt | 400 |
| Table header | 0.75rem | 400, uppercase |

---

## Spacing & Shape

- **Border radius:** `12px` default (cards, modals) · `8px` inputs/buttons · `6px` small elements · `999px` pills/badges
- **Base spacing unit:** `0.25rem` (4px) — use multiples
- **Card shadow:** `0 1px 2px rgb(20 22 26 / 0.04), 0 8px 24px rgb(20 22 26 / 0.06)`
- **Sidebar width:** 240px (collapsed: 68px)
- **Appbar height:** 64px (mobile: 56px)

---

## Components

### Buttons

```
Primary:  bg #1A56B0, text white — hover bg #1545A0
Ghost:    transparent, border #e6e8ec — hover bg #f6f7f9
```

- Padding: `0.625rem 1rem` · font-size: `0.875rem` · weight: 600 · radius: 8px

### Inputs

- Border: `#e6e8ec` · focus border: `#1A56B0` (Propello Blue)
- Radius: 8px · padding: `0.625rem 0.875rem`

### Active / selected states

All active states (nav items, tabs, selected cards) use:
- Text: `#1A56B0`
- Background: `#EFF6FF`
- Border (where applicable): `#BFDBFE`

### Status badges

| Status | Text color | Background |
|---|---|---|
| Draft | `#475569` | `#e2e8f0` |
| Review | `#92400e` | `#fef3c7` |
| Approved | `#047857` | `#d1fae5` |

---

## Voice & Tone

- **Direct.** Short sentences. No filler.
- **Professional but not corporate.** We write like a smart colleague, not a press release.
- **Action-oriented.** Use verbs. "Generate proposal" not "Proposal generation."
- **Philippine context.** Pricing in PHP. Payment methods include BPI and GCash.

### Sample copy

- ✅ "Draft a proposal in under a minute."
- ✅ "Your answers go straight to Propello."
- ❌ "Leverage our AI-powered platform to synergize your workflow."

---

## Document Footer

All generated proposals and invoices end with:

```
Propello  |  Confidential  |  www.propello.app
```

---

## Signatory defaults

- Title: `Chief Executive Officer, Propello`
- Company: `Propello`

---

## Tech stack (for Codex context)

- Plain HTML / CSS / JS — no framework
- Supabase for auth and document storage
- Vercel for hosting
- AI generation via Anthropic API (Claude)
- CSS design tokens in `styles.css` `:root`
- Primary color variable: `--rausch` → `#1A56B0`
