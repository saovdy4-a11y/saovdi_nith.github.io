<script setup>
import { computed, watchEffect } from 'vue'
import AppNav from '@/components/shared/AppNav.vue'
import { useContent } from '@/composables/useContent.js'
import { useTheme } from '@/composables/useTheme.js'

const { profile, error } = useContent()
const { resolved } = useTheme()

const year = new Date().getFullYear()
const name = computed(() => profile.value.name)

// Reflect the resolved color mode on the root element so global tokens/themes
// can respond to it.
watchEffect(() => {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = resolved.value
  }
})
</script>

<template>
  <a
    class="skip-link"
    href="#main"
  >Skip to content</a>

  <div
    v-if="error"
    class="content-error"
    role="alert"
  >
    <strong>Content failed to load:</strong>
    <pre>{{ error }}</pre>
  </div>

  <AppNav />

  <main id="main">
    <RouterView />
  </main>

  <footer class="site-footer">
    <div class="container">
      <p>© {{ year }} {{ name }}. Grown with care in Phnom Penh.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-muted);
  padding: 2rem 0;
  text-align: center;
  font-size: 0.9rem;
}

.content-error {
  background: #fff3f3;
  color: #8a1f1f;
  padding: 1rem;
  border-bottom: 2px solid #e0a0a0;
  font-size: 0.9rem;
}

.content-error pre {
  white-space: pre-wrap;
  margin-top: 0.5rem;
}
</style>
