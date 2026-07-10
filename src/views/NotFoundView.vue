<script setup>
import { useSeo } from '@/composables/useSeo.js'
import BaseButton from '@/components/ui/BaseButton.vue'

useSeo({ title: 'Page not found', description: 'The page you were looking for does not exist.' })
</script>

<template>
  <section class="notfound container">
    <p class="notfound__code">
      404
    </p>
    <h1>Page not found</h1>
    <p class="notfound__text">
      Looks like this path grew over. Let's get you back to solid ground.
    </p>
    <BaseButton :href="'/'">
      Back home
    </BaseButton>
  </section>
</template>

<style scoped>
.notfound {
  min-height: 70vh;
  display: grid;
  place-content: center;
  text-align: center;
  gap: 0.5rem;
}

.notfound__code {
  font-size: 5rem;
  font-weight: 800;
  color: var(--color-accent);
  line-height: 1;
}

.notfound__text {
  color: var(--color-muted);
  margin-bottom: 1rem;
}
</style>
