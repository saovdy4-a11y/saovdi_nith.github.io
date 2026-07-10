import { useHead } from '@unhead/vue'
import { useContent } from '@/composables/useContent.js'
import { resolveAsset } from '@/composables/useAssetUrl.js'

/**
 * Sets per-route head/meta via @unhead/vue: title, description, canonical URL,
 * Open Graph, Twitter card, and Person JSON-LD.
 *
 * @param {Object} [overrides]
 * @param {string} [overrides.title]
 * @param {string} [overrides.description]
 * @param {string} [overrides.path]  Route path for the canonical URL.
 */
export function useSeo(overrides = {}) {
  const { seo, profile } = useContent()

  const s = seo.value
  const p = profile.value

  const title = overrides.title ? `${overrides.title} — ${p.name}` : s.title
  const description = overrides.description || s.description
  const url = `${s.siteUrl}${overrides.path || ''}`
  const image = s.ogImage?.startsWith('http') ? s.ogImage : `${s.siteUrl}${resolveAsset(s.ogImage || '')}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    jobTitle: p.role,
    email: p.email,
    address: p.location,
    url: s.siteUrl,
    image,
    sameAs: (p.socials || []).map((soc) => soc.url),
  }

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      ...(s.twitterHandle ? [{ name: 'twitter:creator', content: s.twitterHandle }] : []),
    ],
    link: [{ rel: 'canonical', href: url }],
    script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(jsonLd) }],
  })
}
