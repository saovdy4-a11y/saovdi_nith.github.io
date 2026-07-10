# Project Structure

## Three-Layer Architecture

The codebase is organized into three layers that never reach into each other's concerns:

1. **Content Layer** (`src/content/`) — plain JSON describing the person, work, and history. No styling or layout. Validated against Zod schemas at runtime.
2. **Template Layer** (`src/templates/<slug>/`) — self-contained visual skins (components + design tokens + manifest). Consume the shared content shape; own no data.
3. **Application Shell** (`src/router/`, `src/stores/`, `src/composables/`) — routing, state, SEO head, and the glue that resolves which template is active.

**Rule:** Content and templates never import from each other. The shell hands content to the active template via composables.

## Folder Layout

```text
public/                     ← static assets: profile photos, resume PDF
src/
├── main.js                 ← wires Vue app, Pinia, Router, @unhead/vue
├── App.vue                 ← AppNav + RouterView + footer
├── router/index.js         ← /, /projects/:id, 404
├── stores/                 ← Pinia: content / template / theme stores
├── content/                ← EDIT THESE to update portfolio content
│   ├── profile.json
│   ├── projects.json
│   ├── skills.json
│   ├── experience.json
│   ├── seo.json
│   └── schema.js           ← Zod validation schemas
├── templates/
│   ├── index.js            ← registry: slug → lazy import
│   └── minimal/            ← a template package
│       ├── Template.vue
│       ├── manifest.js     ← slug, name, supportedSections, signatureElement
│       ├── theme.json      ← light/dark design-token sets
│       └── sections/       ← Hero, About, Skills, Experience, Projects, Contact
├── components/
│   ├── shared/             ← template-agnostic (AppNav, ThemeSwitcher, TemplateSwitcher, ContactForm)
│   └── ui/                 ← base atoms (BaseButton, BaseCard, BaseBadge)
├── composables/
│   ├── useContent.js       ← ONLY way to read content in templates/components
│   ├── useTemplate.js      ← resolves active template slug
│   ├── useTheme.js         ← dark/light/system mode
│   ├── useSeo.js           ← per-route head/meta
│   └── useContactForm.js   ← form validation + Web3Forms delivery
├── views/                  ← HomeView, ProjectDetailView, NotFoundView
├── styles/                 ← base.css (reset, focus-visible, .container, .sr-only), tokens.css
└── types/content.js        ← JSDoc typedefs for the PortfolioContent shape
```

## Conventions & Rules

- **Reading content:** Access content ONLY through `useContent()`. Never import JSON directly into templates or components.
- **Adding a template:** Create `src/templates/<slug>/` (Template.vue, manifest.js, theme.json, sections/) and add one line to `src/templates/index.js`. Do not edit shared or core code.
- **Design tokens:** Templates define `light` and `dark` token sets in `theme.json`, applied as inline CSS variables on the template root. Components reference `var(--token)` — never hardcoded colors or font names.
- **Shared components** (`components/shared/`) must stay template-agnostic — never import a template name or slug here.
- **Template resolution order:** URL `?template=<slug>` → persisted user preference → `VITE_DEFAULT_TEMPLATE` → hard fallback `minimal`.
- **Fallback rendering:** If a manifest omits a section, the shell skips it cleanly — content is never lost.
- **Content changes:** To update the portfolio's data, edit files under `src/content/` only. A malformed file throws a readable Zod error naming the failing field.
- **Tests** live in co-located `__tests__/` folders next to the code they cover.
```
