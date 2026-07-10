<script setup>
import { computed, onBeforeUnmount, ref, watchEffect } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import { useContent } from '@/composables/useContent.js'
import { resolveAsset } from '@/composables/useAssetUrl.js'
import BaseButton from '@/components/ui/BaseButton.vue'

const { profile } = useContent()

const photos = computed(() => {
  const list = profile.value.avatars?.length ? profile.value.avatars : [profile.value.avatar]
  return list.filter(Boolean).map(resolveAsset)
})

const resumeUrl = computed(() => resolveAsset(profile.value.resumeUrl))

const activeIndex = ref(0)
const reducedMotion = usePreferredReducedMotion()

let timer = null
watchEffect((onCleanup) => {
  if (timer) clearInterval(timer)
  // Auto-swap between photos with a crossfade, unless reduced motion is on
  // or there is only a single photo.
  if (photos.value.length > 1 && reducedMotion.value !== 'reduce') {
    timer = setInterval(() => {
      activeIndex.value = (activeIndex.value + 1) % photos.value.length
    }, 4000)
    onCleanup(() => clearInterval(timer))
  }
})

onBeforeUnmount(() => timer && clearInterval(timer))
</script>

<template>
  <section
    id="hero"
    class="section hero"
    aria-labelledby="hero-heading"
  >
    <div class="container hero__grid">
      <div class="hero__text">
        <p
          v-if="profile.availability"
          class="hero__availability"
        >
          <span
            class="dot"
            aria-hidden="true"
          /> {{ profile.availability }}
        </p>
        <h1 id="hero-heading">
          {{ profile.name }}
        </h1>
        <p class="hero__role">
          {{ profile.role }}
        </p>
        <p class="hero__tagline">
          {{ profile.tagline }}
        </p>
        <div class="hero__ctas">
          <BaseButton
            :href="'#contact'"
            variant="primary"
          >
            Get in touch
          </BaseButton>
          <BaseButton
            :href="resumeUrl"
            variant="ghost"
          >
            Download CV
          </BaseButton>
        </div>
      </div>

      <div class="hero__photo">
        <img
          v-for="(src, i) in photos"
          :key="src"
          :src="src"
          :alt="i === 0 ? `Portrait of ${profile.name}` : ''"
          class="hero__img"
          :class="{ 'is-active': i === activeIndex }"
          :aria-hidden="i === activeIndex ? undefined : 'true'"
          loading="eager"
        >
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-top: clamp(3rem, 8vw, 5rem);
}

.hero__grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}

.hero__availability {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-muted);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.dot {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 50%;
  background: var(--color-accent);
}

.hero h1 {
  font-size: clamp(2.2rem, 6vw, 3.4rem);
}

.hero__role {
  font-size: clamp(1.1rem, 3vw, 1.4rem);
  color: var(--color-accent);
  font-weight: 600;
  margin-top: 0.5rem;
}

.hero__tagline {
  color: var(--color-muted);
  font-size: 1.1rem;
  margin-top: 1rem;
  max-width: 46ch;
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.hero__photo {
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  background: var(--color-surface);
}

.hero__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease;
}

.hero__img.is-active {
  opacity: 1;
}

/* Show first image immediately even before JS hydrates */
.hero__img:first-child {
  opacity: 1;
}

.hero__img:first-child:not(.is-active) {
  opacity: 0;
}

@media (max-width: 768px) {
  .hero__grid {
    grid-template-columns: 1fr;
  }

  .hero__photo {
    width: 100%;
    max-width: 280px;
    margin-inline: auto;
    order: -1;
    aspect-ratio: 1 / 1;
  }
}
</style>
