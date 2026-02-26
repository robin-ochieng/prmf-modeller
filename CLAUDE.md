# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PRMF (Post-Retirement Medical Fund) Premium Rate Calculator — a full-stack web app for calculating medical insurance premiums based on age, benefit option, and family size. Built for Kenbright. Currency is KES (Kenyan Shillings).

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4, Framer Motion for animations
- **Forms:** React Hook Form + Zod validation
- **Database:** Supabase (PostgreSQL) with Row-Level Security
- **Testing:** Vitest + React Testing Library
- **Python scripts:** Data seeding and verification utilities
- **Deployment:** Vercel

## Commands

All frontend commands run from `frontend/`:

```bash
npm run dev           # Dev server on localhost:3000
npm run build         # Production build
npm run lint          # ESLint
npm test              # Vitest watch mode
npm run test:run      # Vitest single run
npm run test:coverage # Coverage report
```

Python (from project root, activate `.venv` first):
```bash
python scripts/seed_database.py    # Seed premium_rates from Rates.xlsx
python scripts/verify_database.py  # Verify database integrity
```

## Architecture

### Directory Layout

- `frontend/src/app/` — Next.js App Router pages and API routes
- `frontend/src/components/` — React components split into `ui/`, `calculator/`, `auth/`
- `frontend/src/contexts/` — React Context (AuthContext for Supabase auth state)
- `frontend/src/lib/` — Supabase client (`supabase.ts`), utilities (`utils.ts`)
- `frontend/src/types/` — Shared TypeScript types and constants
- `scripts/` — SQL schemas and Python database utilities
- `Rates.xlsx` — Source spreadsheet for premium rate data

### Path Alias

`@/*` maps to `frontend/src/*` (configured in tsconfig.json).

### API Routes

- **POST `/api/calculate`** — Core endpoint. Takes `{age, benefit_option, family_size}`, queries `premium_rates` table, returns premium amount. Optionally saves to `quote_history` if user is authenticated (Bearer token).
- **GET `/api/quotes`** — Returns authenticated user's quote history. Requires `Authorization: Bearer <token>`.

### Database Tables

- **`premium_rates`** — Lookup table keyed by `(age, family_size)`. Columns: `option_1` through `option_4` (KES amounts), `payment_type`. Public read via RLS.
- **`quote_history`** — User quote records with RLS restricting reads to own records.

### Business Rules

- Age 18–60 → `ANNUAL` payment type
- Age 61–90 → `LUMPSUM` (one-time) payment type
- Family sizes: `M` (principal only), `M+1` (principal + spouse)
- Benefit options: `option_1` through `option_4`

### Auth Flow

Supabase Auth via `AuthContext`. The `AuthModal` component handles sign-up/sign-in. API routes create per-request authenticated Supabase clients using the Bearer token from the request header to respect RLS policies.

### Component Patterns

- All page/form components are client components (`'use client'`).
- Components use barrel exports (`index.ts` files).
- UI components are in `components/ui/`, feature components in `components/calculator/` and `components/auth/`.
- Animations use Framer Motion with staggered delays.

## Environment Variables

Required in `frontend/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

Root `.env` (for Python scripts):
```
SUPABASE_URL=<supabase-project-url>
SUPABASE_SERVICE_KEY=<supabase-service-role-key>
```

## Conventions

- Commit messages use conventional commits: `feat:`, `fix:`, `chore:`, etc.
- Next.js config uses webpack (not Turbopack) and transpiles `framer-motion`.
- Premium amounts display as whole numbers (no decimals).
- The `supabase` export in `lib/supabase.ts` is the default anon client; API routes that need user context create a separate authenticated client per request.
