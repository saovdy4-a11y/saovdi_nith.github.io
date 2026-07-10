<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProject } from '@/composables/useContent.js'
import { useSeo } from '@/composables/useSeo.js'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const route = useRoute()
const id = computed(() => String(route.params.id))
const project = useProject(id.value)

useSeo({
  title: project.value?.title || 'Project',
  description: project.value?.summary,
  path: `/projects/${id.value}`,
})
</script>

<template>
  <article
    v-if="project"
    class="detail container"
  >
    <RouterLink
      class="back"
      :to="{ path: '/', hash: '#projects' }"
    >
      ← Back to projects
    </RouterLink>

    <header class="detail__header">
      <h1>{{ project.title }}</h1>
      <p class="detail__summary">
        {{ project.summary }}
      </p>
      <ul class="detail__tags">
        <li
          v-for="tag in project.tags"
          :key="tag"
        >
          <BaseBadge>{{ tag }}</BaseBadge>
        </li>
      </ul>
    </header>

    <div
      v-if="project.coverImage"
      class="detail__cover"
      :style="{ backgroundImage: `url(${project.coverImage})` }"
    />
    <div
      v-else
      class="detail__cover detail__cover--placeholder"
      aria-hidden="true"
    />

    <p class="detail__body">
      {{ project.description }}
    </p>

    <div class="detail__links">
      <BaseButton
        v-if="project.liveUrl"
        :href="project.liveUrl"
        variant="primary"
      >
        View live
      </BaseButton>
      <BaseButton
        v-if="project.repoUrl"
        :href="project.repoUrl"
        variant="ghost"
      >
        View source
      </BaseButton>
    </div>
  </article>

  <div
    v-else
    class="missing container"
  >
    <h1>Project not found</h1>
    <p>We couldn't find that project.</p>
    <RouterLink :to="{ path: '/', hash: '#projects' }">
      Back to projects
    </RouterLink>
  </div>
</template>

<style scoped>
.detail {
  padding-block: 3rem;
  max-width: 800px;
}

.back {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 600;
}

.detail__header h1 {
  font-size: clamp(1.8rem, 5vw, 2.6rem);
}

.detail__summary {
  color: var(--color-muted);
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.detail__cover {
  height: 280px;
  border-radius: var(--radius);
  background-size: cover;
  background-position: center;
  margin: 1.5rem 0;
}

.detail__cover--placeholder {
  background: linear-gradient(135deg, var(--color-accent), color-mix(in srgb, var(--color-accent) 40%, #ffffff));
}

.detail__body {
  font-size: 1.05rem;
  line-height: 1.8;
}

.detail__links {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.missing {
  padding-block: 5rem;
  text-align: center;
}
</style>
