import { defineStore } from 'pinia'
import { ref } from 'vue'
import profile from '@/content/profile.json'
import projects from '@/content/projects.json'
import skills from '@/content/skills.json'
import experience from '@/content/experience.json'
import seo from '@/content/seo.json'
import { validateContent } from '@/content/schema.js'

/**
 * Loads and validates all portfolio content once. Templates and components
 * must never import the JSON directly — they read through `useContent()`,
 * which is backed by this store.
 */
export const useContentStore = defineStore('content', () => {
  const raw = { profile, projects, skills, experience, seo }

  const error = ref(null)
  let content = null
  try {
    content = validateContent(raw)
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
    // Fall back to the raw (unvalidated) content so the site can still render.
    content = raw
  }

  const data = ref(content)

  return { data, error }
})
