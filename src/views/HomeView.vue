<script setup>
import { useTemplate } from '@/composables/useTemplate.js'
import { useSeo } from '@/composables/useSeo.js'

const { component: TemplateComponent } = useTemplate()

useSeo({ path: '/' })
</script>

<template>
  <span id="top" />
  <component
    :is="TemplateComponent"
    v-if="TemplateComponent"
  />
  <div
    v-else
    class="loading"
    aria-live="polite"
  >
    Loading…
  </div>
</template>

<style scoped>
.loading {
  min-height: 60vh;
  display: grid;
  place-items: center;
  color: var(--color-muted);
}
</style>
