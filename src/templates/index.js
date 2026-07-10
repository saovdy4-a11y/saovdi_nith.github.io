/**
 * Template registry — maps a slug to a lazy-loaded template component so that
 * unused templates are never downloaded.
 *
 * To add a new template: create `src/templates/<slug>/` (Template.vue,
 * manifest.js, theme.json, sections/) and add ONE line here. No other file
 * needs to change.
 */
export const templateRegistry = {
  minimal: () => import('./minimal/Template.vue'),
}

export const manifestRegistry = {
  minimal: () => import('./minimal/manifest.js'),
}

export const DEFAULT_TEMPLATE = import.meta.env.VITE_DEFAULT_TEMPLATE || 'minimal'
