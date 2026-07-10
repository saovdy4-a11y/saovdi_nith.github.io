<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useContent } from '@/composables/useContent.js'
import ThemeSwitcher from '@/components/shared/ThemeSwitcher.vue'

const { profile } = useContent()
const router = useRouter()

const open = ref(false)

const links = [
  { label: 'About', hash: '#about' },
  { label: 'Skills', hash: '#skills' },
  { label: 'Experience', hash: '#experience' },
  { label: 'Projects', hash: '#projects' },
  { label: 'Contact', hash: '#contact' },
]

function go(hash) {
  open.value = false
  router.push({ path: '/', hash })
}
</script>

<template>
  <header class="nav">
    <div class="container nav__inner">
      <RouterLink
        class="nav__brand"
        :to="{ path: '/', hash: '#top' }"
      >
        {{ profile.name }}
      </RouterLink>

      <button
        class="nav__toggle"
        :aria-expanded="open"
        aria-controls="nav-menu"
        aria-label="Toggle navigation menu"
        @click="open = !open"
      >
        <span aria-hidden="true">{{ open ? '✕' : '☰' }}</span>
      </button>

      <nav
        id="nav-menu"
        class="nav__menu"
        :class="{ 'nav__menu--open': open }"
      >
        <ul class="nav__links">
          <li
            v-for="link in links"
            :key="link.hash"
          >
            <a
              :href="`/${link.hash}`"
              @click.prevent="go(link.hash)"
            >{{ link.label }}</a>
          </li>
        </ul>
        <div class="nav__actions">
          <ThemeSwitcher />
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in srgb, var(--color-bg) 88%, transparent);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--color-border);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 4rem;
  flex-wrap: wrap;
}

.nav__brand {
  font-weight: 700;
  font-size: 1.1rem;
  text-decoration: none;
  color: var(--color-text);
}

.nav__toggle {
  display: none;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  width: 2.6rem;
  height: 2.6rem;
  font-size: 1.2rem;
}

.nav__menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav__links {
  display: flex;
  gap: 1.25rem;
}

.nav__links a {
  text-decoration: none;
  font-weight: 500;
  color: var(--color-muted);
  transition: color 0.15s ease;
}

.nav__links a:hover {
  color: var(--color-accent);
}

.nav__actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

@media (max-width: 768px) {
  .nav__toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .nav__menu {
    display: none;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 1rem;
    padding-bottom: 1rem;
  }

  .nav__menu--open {
    display: flex;
  }

  .nav__links {
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }
}
</style>
