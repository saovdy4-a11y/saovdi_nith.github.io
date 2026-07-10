<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme.js'
import { useContent } from '@/composables/useContent.js'
import manifest from './manifest.js'
import theme from './theme.json'

import Hero from './sections/Hero.vue'
import About from './sections/About.vue'
import Skills from './sections/Skills.vue'
import Experience from './sections/Experience.vue'
import Projects from './sections/Projects.vue'
import Contact from './sections/Contact.vue'

const { resolved } = useTheme()
const { error } = useContent()

// Design tokens are applied as inline CSS variables on the template root.
const tokenStyle = computed(() => theme.tokens[resolved.value] || theme.tokens.light)

const sectionComponents = {
  hero: Hero,
  about: About,
  skills: Skills,
  experience: Experience,
  projects: Projects,
  contact: Contact,
}

// If the manifest omits a section, it is simply skipped — content is never lost.
const sections = computed(() =>
  manifest.supportedSections
    .filter((name) => sectionComponents[name])
    .map((name) => ({ name, component: sectionComponents[name] })),
)
</script>

<template>
  <div
    class="minimal"
    :style="tokenStyle"
  >
    <template v-if="!error">
      <component
        :is="section.component"
        v-for="section in sections"
        :key="section.name"
      />
    </template>
  </div>
</template>

<style scoped>
.minimal {
  background: var(--color-bg);
  color: var(--color-text);
}

.minimal :deep(.section) {
  padding-block: var(--space-section);
}

.minimal :deep(.section__title) {
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  position: relative;
  display: inline-block;
  margin-bottom: 2rem;
}

.minimal :deep(.section__title)::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.4rem;
  height: 3px;
  width: 0;
  background: var(--color-accent);
  animation: underline 0.6s ease forwards;
}

@keyframes underline {
  to {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .minimal :deep(.section__title)::after {
    animation: none;
    width: 100%;
  }
}
</style>
