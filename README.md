# EVENTOS — Event Business OS (Concept Demo)

A premium B2B SaaS **concept website and interactive product demo** for an event-business software pitch (catering, décor, wedding planning and event management).

> **EVENTOS is a fictional demonstration brand.** It is not the prospective client's company name, and nothing here represents a real product, customer, metric or person. All demo data is fictional and lives only in the visitor's browser.

## What's inside

| Route | What it is |
| --- | --- |
| `/` | Marketing homepage with an interactive WebGL (React Three Fiber) hero, problem story, audiences, modules, live quotation teaser, benefits, how-it-works, FAQ and CTA |
| `/solutions` | The four illustrative modules — Admin Dashboard, Staff Dashboard, Manager App, Customer App — each with interface previews and deep links into the demo |
| `/demo` | A working fictional SaaS workspace: overview, calendar, events + details drawer, menu builder, quotation calculator, team & tasks, customer app, guest feedback, notifications, reset |
| `/book-demo` | Validated demo-request form (simulated submission — nothing is sent) |
| `/about`, `/contact`, `/faq`, `/disclaimer` | Supporting pages with clearly marked placeholders |

### Real vs. simulated

| Works for real | Simulated / illustrative |
| --- | --- |
| All navigation, routes, menus, tabs, drawers, modals | All clients, events, dishes, prices, staff, feedback (fictional seed data) |
| Quotation & menu arithmetic (unit-tested) | Form submissions — validated, but **not sent anywhere** |
| Form validation (unit-tested) | "Mark as sent", notifications — local state only |
| Demo state saved in the visitor's browser (`localStorage`) + reset | Tax rate (18%) and prices are placeholders |
| 3D hero with 2D fallback and reduced-motion support | No backend, CRM, email, payments or authentication |

## Replacing the concept content

Everything brand-related is centralised:

- **`src/config/site.ts`** — brand name, tagline, navigation, CTAs, contact placeholders, industries, modules, concept-demo switch (`isConceptDemo`).
- **`src/content/faq.ts`** — FAQ copy.
- **`src/lib/demo/seed.ts`, `src/lib/demo/catalog.ts`** — demo sample data (events, staff, dishes, prices).
- **`src/lib/teaser-quote.ts`** — homepage calculator sample prices.
- **`src/components/hero/panel-textures.ts`** — the software panels drawn in the 3D hero.
- **`src/components/layout/logo.tsx`, `src/app/icon.svg`** — logo mark and favicon.

Items needing client input are shown on-site with a **"To be confirmed"** tag.

## Tech

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · Three.js / React Three Fiber / drei · Lucide icons. No paid services, APIs or environment variables are required.

## Scripts

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npm run typecheck
npm run test:unit    # quotation, teaser and validation maths
npm run build
npm run test:e2e     # Playwright, against `next start` on :3100 (run after build)
```

## Deploying to Vercel

1. Go to <https://vercel.com/new> and import `hadiya-art/weddemo`.
2. Framework preset: **Next.js** (auto-detected). No environment variables needed.
3. Optional: set `NEXT_PUBLIC_SITE_URL` to the final URL for social-preview metadata.

Pages are marked `noindex` while `isConceptDemo` is `true`.
