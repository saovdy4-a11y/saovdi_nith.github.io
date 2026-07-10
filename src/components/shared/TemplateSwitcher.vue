<script setup>
import { useTemplateStore } from '@/stores/template.store.js'

const store = useTemplateStore()

function onChange(event) {
  store.setPreferred(event.target.value)
}
</script>

<template>
  <label class="template-switcher">
    <span class="sr-only">Choose a template</span>
    <select
      :value="store.active"
      aria-label="Choose a template"
      @change="onChange"
    >
      <option
        v-for="slug in store.available"
        :key="slug"
        :value="slug"
      >
        {{ slug.charAt(0).toUpperCase() + slug.slice(1) }}
      </option>
    </select>
  </label>
</template>

<style scoped>
.template-switcher select {
  font: inherit;
  padding: 0.45rem 0.7rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
}

.template-switcher select:hover {
  border-color: var(--color-accent);
}
</style>
