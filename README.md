# PocketDevs Proposal Generator

Upload a PDF brief → Claude (Opus 4.8) drafts a fully branded PocketDevs proposal with all 10
sections → edit inline → download as PDF. Build-free static site (no Node required).

## Run locally
```bash
cd ~/proposal-generator
python3 -m http.server 8000
```
Open http://localhost:8000

## Use it
1. **Settings** → paste your Anthropic API key (stored only in this browser's localStorage).
2. **Step 1** → drop a source PDF (client brief / notes / scope).
3. **Step 2** → fill in the confirmed details (client, project, cost in ₱, dates…). Blanks render
   as `[TBD]` — the AI never invents numbers.
4. **Generate** → review the live preview, click any text to edit, then **Download PDF**
   (choose "Save as PDF" in the print dialog).

Click **Load sample data** anytime to preview the template without using the API.

## The 10 sections
Executive Summary · Solutions Outline · Objectives · Full Scope of Work · Project Timeline ·
Project Cost · Milestones and Payment Terms · Payment Options · Post Launch Support · Terms and Services

## Branding
The PocketDevs wordmark lives at `assets/logo.svg` (an SVG recreation). To use the official asset,
replace that file — keep the name `logo.svg`, or update the `src` references in `index.html`/`app.js`.

Brand red, fonts, and spacing are CSS variables at the top of `styles.css`.

## Deploy to Vercel
It's static — no build step. Either:
- Drag the folder into a new Vercel project, or
- `vercel` from this directory (framework preset: **Other**, output dir: `.`).

Each visitor supplies their own API key (it is never embedded in the page), so the deployed site
is safe to share.

## Notes
- Calls `https://api.anthropic.com/v1/messages` directly from the browser using the
  `anthropic-dangerous-direct-browser-access` header. The key never leaves your machine except to
  reach Anthropic.
- Model: `claude-opus-4-8`, structured-output JSON schema, adaptive thinking, effort `high`.
