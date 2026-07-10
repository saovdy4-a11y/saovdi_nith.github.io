import { computed, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTemplateStore } from '@/stores/template.store.js'
import { templateRegistry, DEFAULT_TEMPLATE } from '@/templates/index.js'

/**
 * Resolves which template should be active, in this priority order:
 *   1. URL query `?template=<slug>`  (enables live demo links)
 *   2. Persisted user preference     (Pinia + useStorage)
 *   3. Build-time VITE_DEFAULT_TEMPLATE
 *   4. Hard fallback: `minimal`
 *
 * @returns the resolved slug plus a lazily-loaded template component.
 */
export function useTemplate() {
  const store = useTemplateStore()
  const route = useRoute()

  const activeSlug = computed(() => {
    const fromQuery = route?.query?.template
    if (typeof fromQuery === 'string' && store.isValid(fromQuery)) {
      return fromQuery
    }
    if (store.preferred && store.isValid(store.preferred)) {
      return store.preferred
    }
    if (store.isValid(DEFAULT_TEMPLATE)) {
      return DEFAULT_TEMPLATE
    }
    return 'minimal'
  })

  const component = shallowRef(null)

  watch(
    activeSlug,
    async (slug) => {
      store.setActive(slug)
      const loader = templateRegistry[slug] || templateRegistry.minimal
      const mod = await loader()
      component.value = mod.default
    },
    { immediate: true },
  )

  return { activeSlug, component, available: store.available }
}
