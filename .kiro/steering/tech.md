# Tech Stack

## Core

- **Framework:** Vue 3 — Composition API, always `<script setup>`.
- **Build tool:** Vite 8 (route- and template-level code-splitting).
- **Language:** JavaScript only — no TypeScript. Use `.js` and `.vue` files. Document content shapes with JSDoc typedefs (`src/types/content.js`), not TS types.
- **Package manager:** npm (not pnpm).
- **Node hosting:** Vercel (auto-deploys from `main`).

## Libraries

- **Routing:** Vue Router — history mode. Routes: `/`, `/projects/:id`, catch-all 404.
- **State:** Pinia — `content.store.js`, `template.store.js`, `theme.store.js`.
- **Styling:** Plain CSS + CSS custom properties. No Tailwind. Components reference design tokens via `var(--color-accent)` etc. — never hardcoded hex values or font names.
- **Validation:** Zod — content schema validation and contact form fields. (No vee-validate.)
- **SEO/head:** @unhead/vue — per-route title, description, OG, Twitter card, JSON-LD.
- **Composition utilities:** @vueuse/core (`useStorage`, `usePreferredReducedMotion`, etc.).
- **Icons:** No icon library installed. Brand icons from `https://cdn.simpleicons.org/<slug>`; generic/flag icons from `https://api.iconify.design/<set>:<icon>.svg`. Icons degrade gracefully if the CDN is unavailable.
- **Contact form:** Web3Forms (client-only, no backend). Submit as `FormData` — never `application/json` (JSON triggers a CORS preflight that Cloudflare blocks).

## Quality Tooling

- **Lint:** ESLint + oxlint — `npm run lint`.
- **Format:** Prettier — `npm run format`.
- **Unit/component tests:** Vitest + @vue/test-utils.
- **E2E tests:** Playwright (needs a running dev server; use a real browser, not headless, to test Web3Forms since Cloudflare blocks headless requests).

## Common Commands

```bash
npm install              # install dependencies
npm run dev              # start Vite dev server (run manually; do not launch from the agent)
npm run build            # production build
npm run preview          # preview the production build
npm run lint             # ESLint + oxlint
npm run format           # Prettier
npm run test:unit:run    # run unit/component tests once (no watch mode)
npm run test:e2e         # Playwright e2e (requires running dev server)
```

> Prefer single-shot test runs (`test:unit:run`) over watch mode.

## Environment Variables

Copy `.env.example` to `.env` (git-ignored — never commit `.env`).

- `VITE_DEFAULT_TEMPLATE` (optional) — default template slug, defaults to `minimal`.
- `VITE_WEB3FORMS_KEY` (needed for live email) — without it, form submissions are simulated in dev.

> `VITE_` variables are embedded in the client bundle and are publicly visible. Never put private keys or database passwords in `VITE_` variables. Web3Forms keys are designed to be public.
