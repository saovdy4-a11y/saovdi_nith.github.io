<script setup>
import { useContactForm } from '@/composables/useContactForm.js'
import BaseButton from '@/components/ui/BaseButton.vue'

const { fields, honeypot, errors, status, statusMessage, submit } = useContactForm()
</script>

<template>
  <form
    class="contact-form"
    novalidate
    @submit.prevent="submit"
  >
    <div class="field">
      <label for="cf-name">Name</label>
      <input
        id="cf-name"
        v-model="fields.name"
        type="text"
        autocomplete="name"
        :aria-invalid="!!errors.name"
        :aria-describedby="errors.name ? 'cf-name-err' : undefined"
      >
      <p
        v-if="errors.name"
        id="cf-name-err"
        class="error"
      >
        {{ errors.name }}
      </p>
    </div>

    <div class="field">
      <label for="cf-email">Email</label>
      <input
        id="cf-email"
        v-model="fields.email"
        type="email"
        autocomplete="email"
        :aria-invalid="!!errors.email"
        :aria-describedby="errors.email ? 'cf-email-err' : undefined"
      >
      <p
        v-if="errors.email"
        id="cf-email-err"
        class="error"
      >
        {{ errors.email }}
      </p>
    </div>

    <div class="field">
      <label for="cf-message">Message</label>
      <textarea
        id="cf-message"
        v-model="fields.message"
        rows="5"
        :aria-invalid="!!errors.message"
        :aria-describedby="errors.message ? 'cf-message-err' : undefined"
      />
      <p
        v-if="errors.message"
        id="cf-message-err"
        class="error"
      >
        {{ errors.message }}
      </p>
    </div>

    <!-- Honeypot: hidden from users and assistive tech; bots fill it in. -->
    <div
      class="honeypot"
      aria-hidden="true"
    >
      <label for="cf-website">Leave this field empty</label>
      <input
        id="cf-website"
        v-model="honeypot"
        type="text"
        tabindex="-1"
        autocomplete="off"
      >
    </div>

    <BaseButton
      type="submit"
      :disabled="status === 'submitting'"
    >
      {{ status === 'submitting' ? 'Sending…' : 'Send message' }}
    </BaseButton>

    <p
      v-if="statusMessage"
      class="status"
      :class="status"
      :role="status === 'success' ? 'status' : 'alert'"
    >
      {{ statusMessage }}
    </p>
  </form>
</template>

<style scoped>
.contact-form {
  display: grid;
  gap: 1.1rem;
  max-width: 540px;
}

.field {
  display: grid;
  gap: 0.4rem;
}

label {
  font-weight: 600;
  font-size: 0.9rem;
}

input,
textarea {
  font: inherit;
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-text);
  width: 100%;
}

input:focus,
textarea:focus {
  border-color: var(--color-accent);
  outline: none;
}

input[aria-invalid='true'],
textarea[aria-invalid='true'] {
  border-color: #c0392b;
}

.error {
  color: #c0392b;
  font-size: 0.82rem;
}

.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.status {
  font-weight: 600;
  font-size: 0.9rem;
}

.status.success {
  color: var(--color-accent);
}

.status.error {
  color: #c0392b;
}
</style>
