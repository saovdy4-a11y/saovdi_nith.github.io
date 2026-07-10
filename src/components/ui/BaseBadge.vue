<script setup>
defineProps({
  interactive: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
})
</script>

<template>
  <span
    class="badge"
    :class="{ 'badge--interactive': interactive, 'badge--active': active }"
  >
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: color-mix(in srgb, var(--color-accent) 12%, transparent);
  color: var(--color-accent);
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent);
}

.badge--interactive {
  cursor: pointer;
}

.badge--active {
  background: var(--color-accent);
  color: var(--color-accent-contrast);
}
</style>
