<script setup>
import { useContent } from '@/composables/useContent.js'
import ContactForm from '@/components/shared/ContactForm.vue'

const { profile } = useContent()
</script>

<template>
  <section
    id="contact"
    class="section contact"
    aria-labelledby="contact-heading"
  >
    <div class="container contact__grid">
      <div class="contact__intro">
        <h2
          id="contact-heading"
          class="section__title"
        >
          Get in touch
        </h2>
        <p>
          Have a garden project, an event, or a role in mind? Send a message and I'll get back to
          you.
        </p>
        <ul class="contact__details">
          <li>
            <span class="label">Email</span>
            <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
          </li>
          <li>
            <span class="label">Location</span>
            <span>{{ profile.location }}</span>
          </li>
        </ul>
      </div>

      <ContactForm />
    </div>
  </section>
</template>

<style scoped>
.contact__grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: start;
}

.contact__intro p {
  color: var(--color-muted);
  max-width: 40ch;
}

.contact__details {
  display: grid;
  gap: 1rem;
  margin-top: 1.5rem;
}

.contact__details li {
  display: grid;
  gap: 0.15rem;
}

.contact__details .label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
}

.contact__details a {
  color: var(--color-accent);
  text-decoration: none;
}

@media (max-width: 768px) {
  .contact__grid {
    grid-template-columns: 1fr;
  }
}
</style>
