import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage, usePreferredDark } from '@vueuse/core'

/**
 * Color-mode state: 'light' | 'dark' | 'system'. The resolved mode combines
 * the user's choice with the OS preference, and is persisted across visits.
 */
export const useThemeStore = defineStore('theme', () => {
  const mode = useStorage('portfolio:theme', 'system')
  const prefersDark = usePreferredDark()

  const resolved = computed(() => {
    if (mode.value === 'system') {
      return prefersDark.value ? 'dark' : 'light'
    }
    return mode.value
  })

  function setMode(next) {
    if (['light', 'dark', 'system'].includes(next)) {
      mode.value = next
    }
  }

  function cycle() {
    const order = ['light', 'dark', 'system']
    const idx = order.indexOf(mode.value)
    setMode(order[(idx + 1) % order.length])
  }

  return { mode, resolved, setMode, cycle }
})
