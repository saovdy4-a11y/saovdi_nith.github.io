# Product

A personal portfolio website for a developer (Nith Saovdi), built as a Vue 3 single-page application.

## Core Idea

Content and presentation are fully decoupled. The same portfolio content can be rendered through entirely different visual "templates" by changing a single config value, and new templates can be added without touching content, shared components, or business logic.

## Sections

Hero, About, Skills, Experience, Projects (gallery + detail pages), and Contact. A downloadable PDF resume is also served.

## Key Features

- **Template switcher** — live runtime switching between registered visual templates.
- **Theme switcher** — dark/light/system color mode, persisted across visits.
- **Contact form** — client-only delivery via Web3Forms (no backend), with Zod validation and honeypot spam protection.
- **Skill brand icons** — loaded at runtime from Simple Icons / Iconify CDNs.
- **Hero avatar auto-swap** — crossfades between multiple photos, respecting `prefers-reduced-motion`.
- **SEO** — per-route metadata, Open Graph, Twitter cards, and Person JSON-LD.

## Guiding Principles

- One content source, many visual outcomes. Switching templates is never a content rewrite.
- Adding a template = a new folder plus one registry line, with zero edits to shared/core code.
- Fully responsive (360px → 1440px+) and WCAG 2.1 AA accessible on every template.
- Lighthouse Performance, Accessibility, SEO, and Best Practices all ≥ 90.

## Out of Scope

Authentication, e-commerce, a full CMS, blog, analytics, and i18n are deferred to later phases unless explicitly requested.
