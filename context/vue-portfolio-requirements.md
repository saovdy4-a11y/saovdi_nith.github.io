# Vue.js Dynamic Portfolio — Software Requirements Specification

> **Project:** Personal Portfolio Website
> **Stack:** Vue 3 + Vite + JavaScript (no TypeScript)
> **Document type:** Software Requirements Specification (SRS) — updated to reflect the as-built implementation
> **Defining principle:** Content and presentation are fully decoupled. Swapping the entire visual template should never require touching content, data, or business logic.
> **Live site:** https://my-portfolio-seven-jade.vercel.app/
> **Repository:** https://github.com/Vibaksanna/My_Portfolio

## What changed from the original draft

The original SRS recommended TypeScript, pnpm, Tailwind CSS, and `vite-ssg`. During implementation these were intentionally replaced:

| Original SRS     | As built                              | Reason                                            |
| ---------------- | ------------------------------------- | ------------------------------------------------- |
| TypeScript       | **JavaScript**                        | Explicit developer preference                     |
| pnpm             | **npm**                               | pnpm not installed on dev machine                 |
| Tailwind CSS     | **Plain CSS + CSS custom properties** | Cleaner for the token-swapping model              |
| `vite-ssg` (SSG) | **Plain SPA**                         | Deferred; SEO meta tags in place via @unhead/vue  |
| `vee-validate`   | **Zod only**                          | Zod alone covers both form and content validation |

All other architectural decisions (three-layer separation, template registry, design tokens, composable content access) are implemented exactly as specified.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Goals & Success Criteria](#2-goals--success-criteria)
3. [Actual Tech Stack (as built)](#3-actual-tech-stack-as-built)
4. [System Architecture](#4-system-architecture)
5. [The Dynamic Template System (Core Requirement)](#5-the-dynamic-template-system-core-requirement)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Content & Data Schema](#8-content--data-schema)
9. [Project Folder Structure](#9-project-folder-structure)
10. [Integrations & APIs](#10-integrations--apis)
11. [Environment Variables](#11-environment-variables)
12. [Testing Strategy](#12-testing-strategy)
13. [Extended Ideas / Stretch Features](#13-extended-ideas--stretch-features)
14. [Development Roadmap](#14-development-roadmap)
15. [Acceptance Criteria](#15-acceptance-criteria)
16. [Deployment & CI/CD](#16-deployment--cicd)
17. [Risks & Mitigations](#17-risks--mitigations)
18. [Appendix — Installed Packages](#18-appendix--installed-packages)

---

## 1. Introduction

### 1.1 Purpose

This document specifies the requirements for a personal portfolio website built with Vue.js. Its defining architectural goal is a **config-driven, multi-template system**: the same portfolio content can be rendered through entirely different visual templates by changing a single value, and new templates can be added by a developer without modifying core logic, shared components, or content files.

### 1.2 Project Overview

The product is a Vue 3 single-page application presenting a developer's portfolio: hero, about, skills, experience, projects, and contact. Visual presentation is abstracted into swappable "templates," each a self-contained package of components and design tokens that consume a shared, template-agnostic content schema.

### 1.3 Scope

**In scope:** the portfolio site itself (hero, about, skills, projects, experience, contact, resume download), the template/theme engine, the content schema and data layer, and contact form delivery via Web3Forms.

**Out of scope (unless explicitly extended later):** user authentication, e-commerce, a full CMS build, blog, analytics, i18n, testimonials, education section (deferred to later phases).

### 1.4 Target Users

- **Primary:** the portfolio owner (content author) and site visitors — recruiters, clients, collaborators.
- **Secondary:** other developers who fork or reuse the template system. The template abstraction is designed for genuine reusability.

---

## 2. Goals & Success Criteria

- One content source produces multiple visual outcomes: switching templates is a config change, never a content rewrite.
- Lighthouse Performance, Accessibility, SEO, and Best Practices scores ≥ 90 on every shipped template.
- A mid-level Vue developer can add a new template in under a day without touching shared/core code.
- Fully responsive (360px, 768px, 1024px, 1440px+) and WCAG 2.1 AA accessible across all templates.
- First Contentful Paint under 2 seconds on a simulated 4G connection.

---

## 3. Actual Tech Stack (as built)

| Layer                 | Choice                                    | Notes                                                                   |
| --------------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| Framework             | Vue 3 (Composition API, `<script setup>`) | All components use `<script setup>`                                     |
| Build tool            | Vite 8                                    | Route- and template-level code-splitting                                |
| Language              | **JavaScript** (no TypeScript)            | `.js` and `.vue` files only; JSDoc typedefs for content shapes          |
| Routing               | Vue Router                                | History mode; `/`, `/projects/:id`, catch-all 404                       |
| State                 | Pinia                                     | `content.store.js`, `template.store.js`, `theme.store.js`               |
| Styling               | **Plain CSS + CSS custom properties**     | Design tokens as CSS variables per template; no Tailwind                |
| Validation            | **Zod**                                   | Content schema validation + contact form field validation               |
| SEO/head              | @unhead/vue                               | Per-route title, description, OG, Twitter card, JSON-LD                 |
| Composition utilities | @vueuse/core                              | `useStorage`, `usePreferredReducedMotion`, etc.                         |
| Package manager       | **npm**                                   | pnpm not used                                                           |
| Hosting               | **Vercel** (free tier)                    | Auto-deploys from `main` branch                                         |
| Testing               | Vitest + @vue/test-utils + Playwright     | 36 unit/component tests; e2e available                                  |
| Quality               | ESLint (+ oxlint) + Prettier              | Enforced via `npm run lint` and `npm run format`                        |
| Contact form          | **Web3Forms**                             | Client-only, no backend; `VITE_WEB3FORMS_KEY` env var                   |
| Icons                 | **Simple Icons CDN** + Iconify API        | `cdn.simpleicons.org/<slug>` for brand icons; no icon library installed |

---

## 4. System Architecture

### 4.1 Architectural Layers

Three layers that never reach into each other's concerns:

1. **Content Layer** — `src/content/` — plain JSON only. Describes the person, their work, and their history. Contains no styling or layout information. All files are validated against Zod schemas at runtime (via `useContent`).
2. **Template Layer** — `src/templates/<slug>/` — self-contained visual skins (components + design tokens + a manifest). Templates consume the shared content shape via `useContent()` and own no data.
3. **Application Shell** — `src/router/`, `src/stores/`, `src/composables/` — routing, state, SEO head, and the glue resolving which template is active.

Neither content nor templates import from each other directly. The shell hands content to the active template via composables.

### 4.2 High-Level Diagram

```
Content Layer          Application Shell          Template Layer
─────────────          ─────────────────          ──────────────
profile.json  ──┐      useContent()               templateRegistry
projects.json ──┤  →   useTemplate()    →  →  →   minimal/Template.vue
skills.json   ──┤      useTheme()                 creative/Template.vue
experience.json─┘      useSeo()                   terminal/Template.vue
seo.json               Pinia stores
```

---

## 5. The Dynamic Template System (Core Requirement)

### 5.1 Concept

A **template** is a self-contained folder under `src/templates/<slug>/` containing its own section components, design tokens, and a manifest file. Templates are _visual skins_ — they receive the same content shape regardless of which is active and render it however their design calls for.

### 5.2 Template Registry (`src/templates/index.js`)

Maps template slugs to lazy-loaded imports so unused templates are never downloaded:

```js
// src/templates/index.js
export const templateRegistry = {
  minimal: () => import('./minimal/Template.vue'),
  // add new templates here — zero other file changes needed
}
```

### 5.3 Template Manifest (`src/templates/<slug>/manifest.js`)

```js
export default {
  slug: 'minimal',
  name: 'Minimal',
  description: 'Clean, typography-first layout.',
  supportedSections: ['hero', 'about', 'skills', 'experience', 'projects', 'contact'],
  signatureElement: 'Animated thin underline beneath section headings',
}
```

### 5.4 Theme Tokens (`src/templates/<slug>/theme.json`)

Two token sets — `light` and `dark` — applied as inline CSS variables on the template root:

```json
{
  "tokens": {
    "light": { "--color-bg": "#ffffff", "--color-accent": "#6366f1", ... },
    "dark":  { "--color-bg": "#0f0f10", "--color-accent": "#818cf8", ... }
  }
}
```

Components reference `var(--color-accent)` — never hardcoded hex values or font names.

### 5.5 Content/Template Contract (`src/types/content.js`)

Documented with JSDoc typedefs (JavaScript project — no TypeScript):

```js
/**
 * @typedef {Object} PortfolioContent
 * @property {Profile} profile
 * @property {Project[]} projects
 * @property {Skill[]} skills
 * @property {ExperienceItem[]} experience
 * @property {SeoData} seo
 */
```

Zod schemas in `src/content/schema.js` enforce the shape at runtime. A malformed content file throws a readable error with the exact failing field.

### 5.6 Template Resolution Order

1. URL query `?template=<slug>` — enables live demo links.
2. Persisted user preference (Pinia + `useStorage`).
3. Build-time `VITE_DEFAULT_TEMPLATE` env var.
4. Hard fallback: `minimal`.

### 5.7 Fallback Rendering

If a manifest omits a section, the shell skips it cleanly — content is never lost, just not rendered by that template.

---

## 6. Functional Requirements

| ID    | Section                | Requirement                                                                                                      | Priority | Status                     |
| ----- | ---------------------- | ---------------------------------------------------------------------------------------------------------------- | -------- | -------------------------- |
| FR-1  | Hero                   | Display name, role, tagline, avatar(s), and CTAs from `profile.json`. Auto-swap multiple photos with a crossfade | Must     | ✅ Done                    |
| FR-2  | About                  | Render bio, location, email, and social links from the content layer                                             | Must     | ✅ Done                    |
| FR-3  | Skills                 | Skills grouped by category with proficiency bars and per-skill brand icons from Simple Icons / Iconify CDN       | Must     | ✅ Done                    |
| FR-4  | Experience             | Work history with company, role, dates, and achievement bullets                                                  | Must     | ✅ Done                    |
| FR-5  | Education              | Education history                                                                                                | Should   | ⏳ Deferred                |
| FR-6  | Projects Gallery       | Projects with tag filter, featured-first sorting, responsive grid                                                | Must     | ✅ Done                    |
| FR-7  | Project Detail         | Dedicated `/projects/:id` route with full description and links                                                  | Should   | ✅ Done                    |
| FR-8  | Testimonials           | Rotating testimonials                                                                                            | Could    | ⏳ Deferred                |
| FR-9  | Blog                   | Markdown-driven articles                                                                                         | Could    | ⏳ Deferred                |
| FR-10 | Resume                 | Downloadable PDF resume                                                                                          | Should   | ✅ Done (PDF in `public/`) |
| FR-11 | Contact                | Validated form (name, email, message), honeypot spam protection, Web3Forms delivery                              | Must     | ✅ Done                    |
| FR-12 | Navigation             | Sticky responsive nav with mobile hamburger menu, section anchor links                                           | Must     | ✅ Done                    |
| FR-13 | Theme Switcher         | Dark/light/system color-mode toggle, persisted via `useStorage`                                                  | Must     | ✅ Done                    |
| FR-14 | Template Switcher      | Runtime live-switch between registered templates                                                                 | Must     | ✅ Done                    |
| FR-15 | i18n                   | Multi-language support                                                                                           | Could    | ⏳ Deferred                |
| FR-16 | Content Source Adapter | All content access through `useContent()` composable only                                                        | Should   | ✅ Done                    |
| FR-17 | Analytics              | Pluggable analytics                                                                                              | Should   | ⏳ Deferred                |
| FR-18 | SEO Metadata           | Per-route title, description, canonical URL, OG, Twitter Card, Person JSON-LD                                    | Must     | ✅ Done                    |
| FR-19 | Error Handling         | Custom 404 page and graceful content-load fallback                                                               | Must     | ✅ Done                    |

---

## 7. Non-Functional Requirements

| Category             | Requirement                                                                                          | Status                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Performance          | Lighthouse ≥ 90; route- and template-level code-splitting; lazy images; FCP < 2s                     | Build passes; Lighthouse run needed                   |
| Accessibility        | WCAG 2.1 AA; semantic landmarks; keyboard operable; focus states; `prefers-reduced-motion` respected | DOM/label/role checks pass; full manual audit pending |
| SEO                  | Per-route metadata via @unhead/vue; Person JSON-LD; canonical URL                                    | ✅ (plain SPA — no SSG yet)                           |
| Responsiveness       | Mobile-first; 360px, 768px, 1024px, 1440px+                                                          | ✅ Fixed nav wrap issue for mobile                    |
| Browser Support      | Latest 2 versions of Chrome, Firefox, Safari, Edge                                                   | Not formally tested                                   |
| Security             | Form input validated; honeypot; secrets in env vars never committed                                  | ✅                                                    |
| Maintainability      | ESLint + oxlint + Prettier; 36 unit tests                                                            | ✅                                                    |
| Template Scalability | Adding a template = new folder + one registry line, zero edits to shared code                        | ✅ Enforced by architecture                           |

---

## 8. Content & Data Schema

All files live in `src/content/`. Edit these files to update your portfolio content. All fields are validated against Zod schemas in `src/content/schema.js` — an invalid value gives a readable error.

### 8.1 `profile.json`

```json
{
  "name": "Your Name",
  "role": "Your Job Title",
  "tagline": "A one-line pitch.",
  "avatar": "/profile1.jpg",
  "avatars": ["/profile1.jpg", "/profile2.jpg"],
  "location": "City, Country",
  "email": "you@example.com",
  "resumeUrl": "/your-resume.pdf",
  "availability": "Open to opportunities",
  "bio": "Longer bio for the About section.",
  "socials": [
    { "label": "GitHub", "url": "https://github.com/you", "handle": "@you" },
    { "label": "LinkedIn", "url": "https://linkedin.com/in/you", "handle": "in/you" }
  ]
}
```

> **`avatars`** (new field): array of image paths under `public/`. If present, the Hero auto-swaps between them with a crossfade every 4 seconds. Respects `prefers-reduced-motion`.

### 8.2 `projects.json` (array)

```json
[
  {
    "id": "my-project",
    "title": "My Project",
    "summary": "One-line summary for the card.",
    "description": "Full case-study text for the detail page.",
    "tags": ["Vue.js", "Laravel"],
    "coverImage": "/assets/projects/cover.jpg",
    "liveUrl": "https://example.com",
    "repoUrl": "https://github.com/you/project",
    "featured": true,
    "date": "2025-09-01"
  }
]
```

### 8.3 `skills.json` (array)

```json
[
  {
    "id": "vue",
    "name": "Vue.js",
    "category": "Frameworks & Tools",
    "proficiency": 85,
    "icon": "https://cdn.simpleicons.org/vuedotjs"
  }
]
```

> **`icon`** (new field): URL to an SVG icon shown next to the skill name. Use `https://cdn.simpleicons.org/<slug>` for brand icons (see [simpleicons.org](https://simpleicons.org) for slugs), or `https://api.iconify.design/<set>:<icon>.svg` for flags and generic icons. Leave empty string `""` to show no icon.

### 8.4 `experience.json` (array)

```json
[
  {
    "id": "company-slug",
    "company": "Company Name",
    "role": "Your Role",
    "startDate": "2025-07-01",
    "endDate": "2025-09-30",
    "summary": "One-line summary.",
    "bullets": ["Achievement one.", "Achievement two."]
  }
]
```

> Leave `endDate` as `""` for current positions.

### 8.5 `seo.json`

```json
{
  "title": "Your Name — Your Role",
  "description": "Short site description for search engines.",
  "ogImage": "/profile1.jpg",
  "twitterHandle": "@yourhandle",
  "siteUrl": "https://your-site.vercel.app"
}
```

> Update `siteUrl` to your real domain — it is used for canonical URLs and Open Graph tags.

---

## 9. Project Folder Structure

```text
My_Portfolio/
├── public/
│   ├── profile1.jpg            ← profile photos (referenced by profile.json avatars)
│   ├── profile2.jpg
│   └── YourName-CV.pdf         ← resume (referenced by profile.json resumeUrl)
├── src/
│   ├── main.js                 ← wires Vue app, Pinia, Router, @unhead/vue
│   ├── App.vue                 ← AppNav + RouterView + footer
│   ├── router/index.js         ← /, /projects/:id, 404
│   ├── stores/
│   │   ├── content.store.js
│   │   ├── template.store.js
│   │   └── theme.store.js
│   ├── content/                ← EDIT THESE to update your portfolio
│   │   ├── profile.json
│   │   ├── projects.json
│   │   ├── skills.json
│   │   ├── experience.json
│   │   ├── seo.json
│   │   └── schema.js           ← Zod validation schemas
│   ├── templates/
│   │   ├── index.js            ← registry: slug → lazy import
│   │   └── minimal/            ← first (and currently only) template
│   │       ├── Template.vue
│   │       ├── manifest.js
│   │       ├── theme.json      ← light/dark token sets
│   │       └── sections/
│   │           ├── Hero.vue
│   │           ├── About.vue
│   │           ├── Skills.vue
│   │           ├── Experience.vue
│   │           ├── Projects.vue
│   │           └── Contact.vue
│   ├── components/
│   │   ├── shared/             ← template-agnostic (never import template names here)
│   │   │   ├── AppNav.vue
│   │   │   ├── ThemeSwitcher.vue
│   │   │   ├── TemplateSwitcher.vue
│   │   │   └── ContactForm.vue
│   │   └── ui/                 ← base atoms
│   │       ├── BaseButton.vue
│   │       ├── BaseCard.vue
│   │       └── BaseBadge.vue
│   ├── composables/
│   │   ├── useContent.js       ← ONLY way to read content in templates/components
│   │   ├── useTemplate.js      ← resolves active template slug
│   │   ├── useTheme.js         ← dark/light/system mode
│   │   ├── useSeo.js           ← per-route head/meta via @unhead/vue
│   │   └── useContactForm.js   ← form validation + Web3Forms delivery
│   ├── views/
│   │   ├── HomeView.vue
│   │   ├── ProjectDetailView.vue
│   │   └── NotFoundView.vue
│   ├── styles/
│   │   ├── base.css            ← reset, focus-visible, .container, .sr-only
│   │   └── tokens.css          ← global token fallbacks
│   └── types/content.js        ← JSDoc typedefs for PortfolioContent shape
├── context/
│   └── vue-portfolio-requirements.md   ← this file
├── .env                        ← local secrets (git-ignored)
├── .env.example                ← template — copy to .env and fill in
├── vercel.json                 ← Vercel build config + SPA rewrite rule
├── vite.config.js
├── jsconfig.json
├── eslint.config.js
├── playwright.config.js
├── vitest.config.js
└── package.json
```

---

## 10. Integrations & APIs

### Contact Form — Web3Forms

The contact form posts to Web3Forms (https://web3forms.com) — a free client-only form service. No backend needed.

**How it works:**

- Form data is submitted as `FormData` (not JSON). **Important:** sending `Content-Type: application/json` triggers a CORS preflight that Web3Forms/Cloudflare blocks. Always use `FormData` for the fetch call.
- On submit: validates with Zod → checks honeypot → POSTs to `https://api.web3forms.com/submit` → shows success/error state.
- If `VITE_WEB3FORMS_KEY` is not set, the form simulates success in dev (nothing is sent, a log appears in the browser console).

**Setup:**

1. Register at web3forms.com with your email to get a free Access Key.
2. Add it to `.env`: `VITE_WEB3FORMS_KEY=your-key-here`
3. Add the same key to Vercel → Settings → Environment Variables, then redeploy.

### Skill Icons — Simple Icons CDN / Iconify

Skill icons are loaded at runtime from public CDNs — no icon library is installed:

- Brand icons: `https://cdn.simpleicons.org/<slug>` (e.g. `vuedotjs`, `laravel`, `mysql`)
- Generic / flag icons: `https://api.iconify.design/<set>:<icon>.svg` (e.g. `circle-flags:kh`)

Find slugs at [simpleicons.org](https://simpleicons.org). Icons need an internet connection to display; they degrade gracefully (skill name still shows) if the CDN is unavailable.

### Profile Photo Auto-Swap

Add multiple photo paths to `profile.avatars` in `profile.json`. The Hero section crossfades between them every 4 seconds. Works with any number of images. Automatically disabled for visitors with `prefers-reduced-motion` enabled.

---

## 11. Environment Variables

| Variable                | Required       | Description                                                                   |
| ----------------------- | -------------- | ----------------------------------------------------------------------------- |
| `VITE_DEFAULT_TEMPLATE` | No             | Template slug to load by default. Defaults to `minimal`.                      |
| `VITE_WEB3FORMS_KEY`    | For live email | Your Web3Forms access key. Without it, form submissions are simulated in dev. |

Copy `.env.example` to `.env` and fill in your values. The `.env` file is git-ignored — never commit it.

For Vercel: add these under **Project → Settings → Environment Variables** and redeploy after adding them.

> ⚠️ Vite embeds `VITE_` variables into the client bundle, so they are visible in the built JavaScript. Web3Forms access keys are designed to be public (abuse is handled by their spam filtering). Never put database passwords or private API keys in `VITE_` variables.

---

## 12. Testing Strategy

36 unit/component tests cover the key architectural guarantees. Run them with `npm run test:unit:run` (single-shot, no watch mode).

| Test file                                               | What it covers                                                                                                                                |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/content/__tests__/schema.spec.js`                  | Zod schemas accept real content JSON; reject invalid shapes                                                                                   |
| `src/templates/__tests__/cross-template.spec.js`        | Every registered template renders the shared content fixture — no missing/duplicated sections. Adding a template automatically adds coverage. |
| `src/composables/__tests__/useTemplate.spec.js`         | Template resolution order: query → preference → env → fallback                                                                                |
| `src/composables/__tests__/useContactForm.spec.js`      | Zod validation, honeypot, delivery adapter, error handling                                                                                    |
| `src/components/shared/__tests__/ContactForm.spec.js`   | Render + a11y: labels, honeypot hidden from AT, aria-invalid, role=status on success                                                          |
| `src/templates/minimal/sections/__tests__/Hero.spec.js` | Section landmark, single h1, CTAs are real anchors                                                                                            |

**End-to-end (Playwright):** `npm run test:e2e`. E2e tests need a running dev server. A real browser (not headless Chromium) is required to test Web3Forms submission, as Cloudflare blocks headless requests.

**What still needs a real browser run:**

- Lighthouse scores (Performance, Accessibility, SEO, Best Practices ≥ 90)
- Full WCAG 2.1 AA manual audit with assistive technology

---

## 13. Extended Ideas / Stretch Features

| Category     | Idea                                                                        |
| ------------ | --------------------------------------------------------------------------- |
| Visual/UX    | Animated route transitions (View Transitions API)                           |
| Visual/UX    | Scroll-triggered reveals via `@vueuse/motion`                               |
| Architecture | Second template (proves the abstraction; zero content changes needed)       |
| Architecture | `vite-ssg` for static prerendering (improves SEO and social link previews)  |
| Content      | Blog with markdown articles                                                 |
| Content      | Testimonials section                                                        |
| Content      | Education section                                                           |
| Content      | Print-optimized resume stylesheet (`@media print`)                          |
| Engagement   | Command palette (⌘K) navigation                                             |
| Engagement   | Live GitHub contribution heatmap                                            |
| SEO          | Auto-generated OG images per project (`satori` / `@vercel/og`)              |
| Analytics    | Plausible or Umami (privacy-friendly, no cookie banner)                     |
| Content      | Headless CMS (Sanity, Strapi) behind the existing `useContent()` composable |

---

## 14. Development Roadmap

**Phase 0 — Foundation ✅** Scaffold Vite + Vue 3 + JS; ESLint/Prettier; Zod schemas; Pinia stores; routing; custom agents.

**Phase 1 — MVP ✅** `minimal` template covering all Must-priority FRs; real CV content; avatar auto-swap; skill brand icons; Web3Forms contact form; live on Vercel.

**Phase 2 — Prove the abstraction** Build a second, visually unrelated template against the same content with zero content edits; ship with the existing template switcher.

**Phase 3 — Content & reach** Blog, testimonials, education, project cover images, i18n, SEO structured data, `vite-ssg`.

**Phase 4 — Polish & growth** Analytics, PWA, third template, optional CMS migration, Lighthouse audit and fix pass.

---

## 15. Acceptance Criteria

- [x] Changing the active template changes 100% of the visual presentation with no edits to anything under `src/content/`
- [ ] A second and third template both render the same content fixtures correctly, with no missing or duplicated sections
- [ ] Lighthouse ≥ 90 across Performance, Accessibility, SEO, and Best Practices on the production build
- [x] Every interactive element (nav, forms, switchers) is keyboard operable
- [x] Layout holds with no overlap or horizontal scroll at 360px, 768px, 1024px, 1440px+
- [x] Contact form validates input and shows clear success/error states without a page reload
- [ ] Every color-token pairing in every shipped theme passes WCAG AA contrast (automated check)
- [x] Cross-template test harness in place — adding a template auto-covers it in tests

---

## 16. Deployment & CI/CD

### Hosting — Vercel (free tier)

The project is deployed at **https://my-portfolio-seven-jade.vercel.app/** from the `main` branch of https://github.com/Vibaksanna/My_Portfolio.

`vercel.json` at the project root configures:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

The rewrite rule is required for a Vue Router SPA — without it, refreshing a deep route (e.g. `/projects/my-project`) returns a Vercel 404 instead of loading the app.

### Local Development

```bash
# Windows PowerShell — use ; to chain, never && or &
npm install          # install dependencies
npm run dev          # dev server at http://localhost:5173 (or next free port)
npm run build        # production build → dist/
npm run preview      # preview the production build
npm run lint         # oxlint + eslint --fix
npm run format       # prettier
npm run test:unit:run  # vitest single-shot (use this in automation)
npm run test:e2e     # playwright e2e (needs dev server running)
```

### Pushing to GitHub / Triggering Vercel

```bash
git add -A
git commit -m "your message"
git push   # Vercel auto-deploys from main
```

### Environment Variables on Vercel

Add under **Project → Settings → Environment Variables**:

- `VITE_WEB3FORMS_KEY` — your Web3Forms access key (for the contact form to actually send email)
- `VITE_DEFAULT_TEMPLATE` — `minimal` (or another slug)

---

## 17. Risks & Mitigations

| Risk                                                 | Mitigation                                                                                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Template-specific logic leaks into shared components | Never import a template by name inside `src/components/shared`. The cross-template test catches rendering breakage.                         |
| CORS error on contact form                           | Always send form data as `FormData`, not `Content-Type: application/json`. JSON triggers a preflight that Cloudflare (on Web3Forms) blocks. |
| New theme ships with poor color contrast             | Check every `--color-*` token pair against WCAG AA before shipping                                                                          |
| Content schema drifts from what templates expect     | Zod validates all content at runtime via `useContent()`; errors are thrown early with readable messages                                     |
| SEO/social-preview issues (SPA)                      | Currently SPA only. Add `vite-ssg` in Phase 3 for true prerendered HTML                                                                     |
| CMS migration forces rewrite                         | All content access is behind `useContent()` — swap the data source there; no template changes needed                                        |
| Scope creep delays MVP                               | Phases 2–4 items are strictly deferred. MVP = Must-priority FRs only                                                                        |

---

## 18. Appendix — Installed Packages

```json
"dependencies": {
  "pinia": "^3.0.4",
  "vue": "^3.5.38",
  "vue-router": "^5.1.0",
  "zod": "^...",
  "@unhead/vue": "^...",
  "@vueuse/core": "^..."
},
"devDependencies": {
  "@vitejs/plugin-vue": "^6.x",
  "@vue/test-utils": "^2.x",
  "@playwright/test": "^1.x",
  "vitest": "^4.x",
  "eslint": "^10.x",
  "eslint-plugin-vue": "^10.x",
  "oxlint": "^1.x",
  "prettier": "^3.x",
  "vite": "^8.x"
}
```

**Not installed (deferred or replaced):**

- `typescript` / `vue-tsc` — JS project
- `tailwindcss` — plain CSS used instead
- `vite-ssg` — deferred to Phase 3
- `vee-validate` — Zod alone used for validation
- `vue-i18n` — deferred to Phase 3
- `@iconify/vue` — CDN icons used instead (no library needed)
- `pnpm` — npm used instead

---

_Document status: Updated to reflect as-built implementation (Phase 1 complete)._
_Last updated during active development session._
