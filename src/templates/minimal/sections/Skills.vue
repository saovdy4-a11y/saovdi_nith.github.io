<script setup>
import { computed } from 'vue'
import { useContent } from '@/composables/useContent.js'

const { skills } = useContent()

// Group skills by category, preserving first-seen order.
const grouped = computed(() => {
  const map = new Map()
  for (const skill of skills.value) {
    if (!map.has(skill.category)) map.set(skill.category, [])
    map.get(skill.category).push(skill)
  }
  return Array.from(map, ([category, items]) => ({ category, items }))
})

// Flag icons are multicolor and render fine as-is. Monochrome icons (e.g. mdi)
// are drawn as a mask tinted with the accent color so they stay visible in
// both light and dark themes.
function isColorIcon(url) {
  return url.includes('flags')
}

function onIconError(event) {
  event.target.style.display = 'none'
}
</script>

<template>
  <section
    id="skills"
    class="section skills"
    aria-labelledby="skills-heading"
  >
    <div class="container">
      <h2
        id="skills-heading"
        class="section__title"
      >
        Skills
      </h2>

      <div class="skills__groups">
        <div
          v-for="group in grouped"
          :key="group.category"
          class="skills__group"
        >
          <h3 class="skills__category">
            {{ group.category }}
          </h3>
          <ul class="skills__list">
            <li
              v-for="skill in group.items"
              :key="skill.id"
              class="skill"
            >
              <div class="skill__head">
                <img
                  v-if="skill.icon && isColorIcon(skill.icon)"
                  :src="skill.icon"
                  :alt="''"
                  aria-hidden="true"
                  class="skill__icon"
                  loading="lazy"
                  @error="onIconError"
                >
                <span
                  v-else-if="skill.icon"
                  class="skill__icon skill__icon--mono"
                  :style="{ '--icon-url': `url(${skill.icon})` }"
                  aria-hidden="true"
                />
                <span class="skill__name">{{ skill.name }}</span>
                <span class="skill__pct">{{ skill.proficiency }}%</span>
              </div>
              <div
                class="skill__bar"
                role="progressbar"
                :aria-valuenow="skill.proficiency"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-label="`${skill.name} proficiency`"
              >
                <span
                  class="skill__fill"
                  :style="{ width: `${skill.proficiency}%` }"
                />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills__groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
}

.skills__category {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
  margin-bottom: 1.25rem;
}

.skills__list {
  display: grid;
  gap: 1.1rem;
}

.skill__head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
}

.skill__icon {
  width: 1.2rem;
  height: 1.2rem;
  object-fit: contain;
  flex-shrink: 0;
}

/* Monochrome icons: draw the SVG as a mask tinted with the accent color so
   they stay visible in both light and dark themes. */
.skill__icon--mono {
  background-color: var(--color-accent);
  -webkit-mask-image: var(--icon-url);
  mask-image: var(--icon-url);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: contain;
  mask-size: contain;
}

.skill__name {
  font-weight: 600;
}

.skill__pct {
  margin-left: auto;
  color: var(--color-muted);
  font-size: 0.85rem;
}

.skill__bar {
  height: 8px;
  border-radius: 999px;
  background: var(--color-border);
  overflow: hidden;
}

.skill__fill {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: var(--color-accent);
}
</style>
