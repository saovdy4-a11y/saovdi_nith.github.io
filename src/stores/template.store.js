import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { templateRegistry, DEFAULT_TEMPLATE } from '@/templates/index.js'

/**
 * Holds the active template slug. Persists the user's explicit choice, but the
 * final resolution order lives in `useTemplate()`.
 */
export const useTemplateStore = defineStore('template', () => {
  const preferred = useStorage('portfolio:template', '')
  const active = ref(DEFAULT_TEMPLATE)

  const available = Object.keys(templateRegistry)

  function isValid(slug) {
    return Object.prototype.hasOwnProperty.call(templateRegistry, slug)
  }

  function setActive(slug) {
    if (isValid(slug)) {
      active.value = slug
    }
  }

  function setPreferred(slug) {
    if (isValid(slug)) {
      preferred.value = slug
      active.value = slug
    }
  }

  return { active, preferred, available, isValid, setActive, setPreferred }
})
