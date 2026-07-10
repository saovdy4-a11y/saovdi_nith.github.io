<script setup>
import { useContent } from '@/composables/useContent.js'

const { profile } = useContent()
</script>

<template>
  <section
    id="about"
    class="section about"
    aria-labelledby="about-heading"
  >
    <div class="container">
      <h2
        id="about-heading"
        class="section__title"
      >
        About
      </h2>
      <div class="about__grid">
        <p class="about__bio">
          {{ profile.bio }}
        </p>
        <ul class="about__facts">
          <li>
            <span class="label">Location</span>
            <span>{{ profile.location }}</span>
          </li>
          <li>
            <span class="label">Email</span>
            <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
          </li>
          <li
            v-for="social in profile.socials"
            :key="social.label"
          >
            <span class="label">{{ social.label }}</span>
            <a
              :href="social.url"
              target="_blank"
              rel="noopener"
            >
              {{ social.handle || social.url }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background: var(--color-surface);
}

.about__grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}

.about__bio {
  font-size: 1.1rem;
  line-height: 1.8;
}

.about__facts {
  display: grid;
  gap: 1rem;
}

.about__facts li {
  display: grid;
  gap: 0.15rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.about__facts .label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
}

.about__facts a {
  color: var(--color-accent);
  text-decoration: none;
  word-break: break-word;
}

@media (max-width: 768px) {
  .about__grid {
    grid-template-columns: 1fr;
  }
}
</style>
