# Scripa — Voice Documentation for Tradespeople

> Speak your job notes. Get a structured report in seconds.

A mobile-first voice documentation app built for field service tradespeople (HVAC, plumbing, electrical, heating engineers) and veterinarians. Powered by Claude AI.

## What it does

1. **Record or type** spoken job notes on site
2. **AI generates** a structured job report + client-ready summary (two output formats)
3. **Copy or export** — ready for your CRM, job management software, or email

Supports two verticals out of the box:
- 🔧 **Trades & HVAC** — job report + client summary
- 🐾 **Veterinary** — SOAP note + client letter

## Deploy in 5 minutes

### 1. Clone and install

```bash
git clone <your-repo-url>
cd scripa
npm install
```

### 2. Set your API key

```bash
cp .env.local.example .env.local
# Edit .env.local and add your Anthropic API key
# Get one at: https://console.anthropic.com
```

### 3. Run locally

```bash
npm run dev
# Open http://localhost:3000
```

### 4. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

When prompted, add your environment variable:
- `ANTHROPIC_API_KEY` = your key from console.anthropic.com

Or deploy via the Vercel dashboard:
1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import your repo
3. Add `ANTHROPIC_API_KEY` under Settings → Environment Variables
4. Deploy ✓

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Claude Sonnet** via Anthropic API
- **Web Speech API** for voice recording (mobile Chrome + desktop)
- **Vercel** for hosting

## The Scripa thesis

Same engine, different product per profession. The core insight: voice → structured document wins in any profession drowning in paperwork, but only sells if it's built 100% for one profession. Trades is the beachhead. Vets is vertical #2. Same codebase, different prompts, different UI vocabulary.

## Adding a new vertical

1. Add a new file in `/lib/yourvertical.ts` with examples and a prompt builder
2. Add a new tab in `app/page.tsx`
3. Add matching result types and render components

That's it. The engine is profession-agnostic.

---

Built as an MVP for Scripa. Max 2 hours. Fully AI-assisted.
