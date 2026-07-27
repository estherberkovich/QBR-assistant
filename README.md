# QBR Assistant

Turns raw, unstructured meeting notes into a formal quarterly business review (QBR) summary — built for account managers and CSMs managing a portfolio across multiple sectors.

## What it does

- Covers three fictional sector portfolios: **Fintech/Payments**, **SaaS Product**, and **Enterprise IT/ITSM**, each with realistic accounts and metrics.
- Takes messy, real-world meeting notes and structures them into: executive summary, wins, risks & watch-outs, recommended next steps, and a renewal/expansion outlook.
- Includes a working **add-account form** with persistent storage, to demonstrate a full create/read/delete flow rather than a static demo.

## Why structure the notes instead of generating them

The notes are real input — either typed live or pasted from a transcript. The AI's job is purely to structure and synthesize, not invent facts. This mirrors the actual bottleneck for CSMs: industry research shows CSMs spend a large share of their time on low-value synthesis work — this tool targets exactly that gap.

## Tech

- React + Vite
- Anthropic Claude API for live QBR generation
- No backend — account data is fictional; custom accounts are stored client-side for demo purposes

## Notes on live features outside Claude.ai

- **AI generation**: the "Generate QBR summary" button calls the Anthropic API directly. This works inside Claude.ai (which proxies the request). In a standalone deployment, the pre-loaded example accounts fall back to a pre-written example output, clearly labeled. Custom accounts or edited notes will show a message directing you to try it inside Claude.ai.
- **Persistent storage**: the "Add account" form uses a storage API available inside Claude.ai artifacts. In a standalone deployment, new accounts will still work within the current session but won't persist after a page reload.

## Run locally

```bash
npm install
npm run dev
```

---

*All account names, companies, and figures in this project are fictional, created for portfolio demonstration purposes.*
