<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme.js'

const { mode, cycle } = useTheme()

const label = computed(() => `Theme: ${mode.value}. Click to change.`)
const icon = computed(() => {
  if (mode.value === 'light') return '☀️'
  if (mode.value === 'dark') return '🌙'
  return '🖥️'
})
</script>

<template>
  <button
    class="theme-switcher"
    :aria-label="label"
    :title="label"
    @click="cycle"
  >
    <span aria-hidden="true">{{ icon }}</span>
  </button>
</template>

<style scoped>
.theme-switcher {
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  width: 2.4rem;
  height: 2.4rem;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.theme-switcher:hover {
  border-color: var(--color-accent);
}
</style>
