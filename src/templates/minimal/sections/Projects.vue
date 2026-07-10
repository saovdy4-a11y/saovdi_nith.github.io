<script setup>
import { computed, ref } from 'vue'
import { useContent } from '@/composables/useContent.js'
import BaseCard from '@/components/ui/BaseCard.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const { projects } = useContent()

const activeTag = ref('All')

const tags = computed(() => {
  const set = new Set()
  projects.value.forEach((p) => p.tags.forEach((t) => set.add(t)))
  return ['All', ...set]
})

// Featured first, then by date descending.
const sorted = computed(() =>
  [...projects.value].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return (b.date || '').localeCompare(a.date || '')
  }),
)

const filtered = computed(() =>
  activeTag.value === 'All'
    ? sorted.value
    : sorted.value.filter((p) => p.tags.includes(activeTag.value)),
)
</script>

<template>
  <section
    id="projects"
    class="section projects"
    aria-labelledby="projects-heading"
  >
    <div class="container">
      <h2
        id="projects-heading"
        class="section__title"
      >
        Projects
      </h2>

      <div
        class="projects__filters"
        role="group"
        aria-label="Filter projects by tag"
      >
        <button
          v-for="tag in tags"
          :key="tag"
          type="button"
          class="filter"
          :aria-pressed="activeTag === tag"
          @click="activeTag = tag"
        >
          <BaseBadge
            :active="activeTag === tag"
            interactive
          >
            {{ tag }}
          </BaseBadge>
        </button>
      </div>

      <ul class="projects__grid">
        <li
          v-for="project in filtered"
          :key="project.id"
        >
          <RouterLink
            class="projects__link"
            :to="`/projects/${project.id}`"
          >
            <BaseCard>
              <div
                class="projects__cover"
                :style="
                  project.coverImage ? { backgroundImage: `url(${project.coverImage})` } : {}
                "
              >
                <span
                  v-if="project.featured"
                  class="projects__featured"
                >Featured</span>
              </div>
              <div class="projects__body">
                <h3>{{ project.title }}</h3>
                <p>{{ project.summary }}</p>
                <ul class="projects__tags">
                  <li
                    v-for="tag in project.tags"
                    :key="tag"
                  >
                    <BaseBadge>{{ tag }}</BaseBadge>
                  </li>
                </ul>
              </div>
            </BaseCard>
          </RouterLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.projects__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.filter {
  background: none;
  border: none;
  padding: 0;
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.projects__link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.projects__cover {
  position: relative;
  height: 160px;
  background-size: cover;
  background-position: center;
  background-color: var(--color-accent);
  background-image: linear-gradient(
    135deg,
    var(--color-accent),
    color-mix(in srgb, var(--color-accent) 45%, #ffffff)
  );
}

.projects__featured {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: var(--color-bg);
  color: var(--color-accent);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.projects__body {
  padding: 1.25rem;
  display: grid;
  gap: 0.6rem;
}

.projects__body h3 {
  font-size: 1.15rem;
}

.projects__body p {
  color: var(--color-muted);
  font-size: 0.95rem;
}

.projects__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.3rem;
}
</style>
