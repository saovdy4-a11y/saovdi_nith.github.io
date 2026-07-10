<script setup>
import { computed } from 'vue'

const props = defineProps({
  as: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // 'primary' | 'ghost'
  href: { type: String, default: '' },
})

const tag = computed(() => (props.href ? 'a' : props.as))
</script>

<template>
  <component
    :is="tag"
    :href="href || undefined"
    class="btn"
    :class="`btn--${variant}`"
  >
    <slot />
  </component>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.7rem 1.4rem;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  font-weight: 600;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    background 0.15s ease,
    color 0.15s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn--primary {
  background: var(--color-accent);
  color: var(--color-accent-contrast);
}

.btn--ghost {
  background: transparent;
  color: var(--color-text);
  border-color: var(--color-border);
}

.btn--ghost:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
</style>
