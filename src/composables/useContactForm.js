import { reactive, ref } from 'vue'
import { contactFormSchema } from '@/content/schema.js'

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

/**
 * Contact form logic: Zod validation, honeypot spam check, and Web3Forms
 * delivery. Submits as FormData (never JSON — JSON triggers a CORS preflight
 * that Cloudflare blocks). If VITE_WEB3FORMS_KEY is missing, the submission is
 * simulated so the form still works in local dev.
 */
export function useContactForm() {
  const fields = reactive({ name: '', email: '', message: '' })
  const honeypot = ref('') // must stay empty; bots fill it in
  const errors = reactive({ name: '', email: '', message: '' })
  const status = ref('idle') // 'idle' | 'submitting' | 'success' | 'error'
  const statusMessage = ref('')

  function clearErrors() {
    errors.name = ''
    errors.email = ''
    errors.message = ''
  }

  function validate() {
    clearErrors()
    const result = contactFormSchema.safeParse({ ...fields })
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0]
        if (key in errors) errors[key] = issue.message
      }
      return false
    }
    return true
  }

  async function submit() {
    statusMessage.value = ''

    // Honeypot: a filled value means a bot. Pretend success, send nothing.
    if (honeypot.value) {
      status.value = 'success'
      statusMessage.value = 'Thanks! Your message has been sent.'
      return
    }

    if (!validate()) {
      status.value = 'error'
      statusMessage.value = 'Please fix the errors above and try again.'
      return
    }

    status.value = 'submitting'
    const key = import.meta.env.VITE_WEB3FORMS_KEY

    if (!key) {
      // Dev fallback — nothing is actually sent.
       
      console.info('[useContactForm] No VITE_WEB3FORMS_KEY set; simulating success.', {
        ...fields,
      })
      status.value = 'success'
      statusMessage.value = 'Thanks! Your message has been sent. (simulated in dev)'
      resetFields()
      return
    }

    try {
      const body = new FormData()
      body.append('access_key', key)
      body.append('name', fields.name)
      body.append('email', fields.email)
      body.append('message', fields.message)
      body.append('subject', `Portfolio contact from ${fields.name}`)

      const res = await fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body })
      const data = await res.json()

      if (data.success) {
        status.value = 'success'
        statusMessage.value = 'Thanks! Your message has been sent.'
        resetFields()
      } else {
        status.value = 'error'
        statusMessage.value = data.message || 'Something went wrong. Please try again.'
      }
    } catch {
      status.value = 'error'
      statusMessage.value = 'Network error. Please try again later.'
    }
  }

  function resetFields() {
    fields.name = ''
    fields.email = ''
    fields.message = ''
  }

  return { fields, honeypot, errors, status, statusMessage, validate, submit }
}
