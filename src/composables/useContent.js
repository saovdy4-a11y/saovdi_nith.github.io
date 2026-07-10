import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useContentStore } from '@/stores/content.store.js'

/**
 * The ONLY approved way to read portfolio content in templates and components.
 * Never import content JSON directly.
 *
 * @returns {{
 *   content: import('vue').ComputedRef<import('@/types/content.js').PortfolioContent>,
 *   profile: import('vue').ComputedRef<import('@/types/content.js').Profile>,
 *   projects: import('vue').ComputedRef<import('@/types/content.js').Project[]>,
 *   skills: import('vue').ComputedRef<import('@/types/content.js').Skill[]>,
 *   experience: import('vue').ComputedRef<import('@/types/content.js').ExperienceItem[]>,
 *   seo: import('vue').ComputedRef<import('@/types/content.js').SeoData>,
 *   error: import('vue').Ref<string|null>,
 * }}
 */
export function useContent() {
  const store = useContentStore()
  const { data, error } = storeToRefs(store)

  return {
    content: computed(() => data.value),
    profile: computed(() => data.value.profile),
    projects: computed(() => data.value.projects),
    skills: computed(() => data.value.skills),
    experience: computed(() => data.value.experience),
    seo: computed(() => data.value.seo),
    error,
  }
}

/**
 * Find a single project by id.
 * @param {string} id
 */
export function useProject(id) {
  const { projects } = useContent()
  return computed(() => projects.value.find((p) => p.id === id) || null)
}
