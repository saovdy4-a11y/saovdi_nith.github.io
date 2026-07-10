<script setup>
import { useTheme } from '@/composables/useTheme.js'

const { mode, setMode } = useTheme()

const options = [
  { value: 'light', icon: '☀️', label: 'Light mode' },
  { value: 'dark', icon: '🌙', label: 'Dark mode' },
  { value: 'system', icon: '💻', label: 'System mode' },
]
</script>

<template>
  <div class="theme-switcher" role="radiogroup" aria-label="Color theme">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="theme-switcher__btn"
      :class="{ 'is-active': mode === opt.value }"
      role="radio"
      :aria-checked="mode === opt.value"
      :aria-label="opt.label"
      :title="opt.label"
      @click="setMode(opt.value)"
    >
      <span aria-hidden="true">{{ opt.icon }}</span>
    </button>
  </div>
</template>

<style scoped>
.theme-switcher {
  display: inline-flex;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.theme-switcher__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  background: transparent;
  border: none;
  font-size: 0.95rem;
  line-height: 1;
  transition:
    background 0.15s ease,
    transform 0.1s ease;
}

.theme-switcher__btn:not(:last-child) {
  border-right: 1px solid var(--color-border);
}

.theme-switcher__btn:hover {
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.theme-switcher__btn.is-active {
  background: var(--color-accent);
}
</style>
