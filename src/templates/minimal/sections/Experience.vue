<script setup>
import { useContent } from '@/composables/useContent.js'

const { experience } = useContent()

function formatRange(start, end) {
  const fmt = (d) => {
    if (!d) return 'Present'
    const date = new Date(d)
    if (Number.isNaN(date.getTime())) return d
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return `${fmt(start)} — ${fmt(end)}`
}
</script>

<template>
  <section
    id="experience"
    class="section experience"
    aria-labelledby="experience-heading"
  >
    <div class="container">
      <h2
        id="experience-heading"
        class="section__title"
      >
        Experience
      </h2>

      <ol class="timeline">
        <li
          v-for="item in experience"
          :key="item.id"
          class="timeline__item"
        >
          <div
            class="timeline__marker"
            aria-hidden="true"
          />
          <div class="timeline__content">
            <div class="timeline__head">
              <h3>{{ item.role }}</h3>
              <span class="timeline__dates">{{ formatRange(item.startDate, item.endDate) }}</span>
            </div>
            <p class="timeline__company">
              {{ item.company }}
            </p>
            <p
              v-if="item.summary"
              class="timeline__summary"
            >
              {{ item.summary }}
            </p>
            <ul
              v-if="item.bullets.length"
              class="timeline__bullets"
            >
              <li
                v-for="(bullet, i) in item.bullets"
                :key="i"
              >
                {{ bullet }}
              </li>
            </ul>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.experience {
  background: var(--color-surface);
}

.timeline {
  display: grid;
  gap: 2rem;
  border-left: 2px solid var(--color-border);
  padding-left: 1.5rem;
}

.timeline__item {
  position: relative;
}

.timeline__marker {
  position: absolute;
  left: calc(-1.5rem - 6px);
  top: 0.4rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 2px solid var(--color-bg);
}

.timeline__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
}

.timeline__head h3 {
  font-size: 1.15rem;
}

.timeline__dates {
  color: var(--color-muted);
  font-size: 0.85rem;
}

.timeline__company {
  color: var(--color-accent);
  font-weight: 600;
  margin-top: 0.15rem;
}

.timeline__summary {
  margin-top: 0.5rem;
  color: var(--color-muted);
}

.timeline__bullets {
  margin-top: 0.75rem;
  display: grid;
  gap: 0.4rem;
  list-style: disc;
  padding-left: 1.2rem;
}
</style>
