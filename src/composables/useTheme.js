import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme.store.js'

/**
 * Dark / light / system color mode. `resolved` is the concrete mode
 * ('light' | 'dark') after combining the user choice with the OS preference.
 */
export function useTheme() {
  const store = useThemeStore()
  const { mode, resolved } = storeToRefs(store)

  return {
    mode,
    resolved,
    setMode: store.setMode,
    cycle: store.cycle,
  }
}
