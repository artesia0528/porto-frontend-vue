<!-- src/pages/Contact.vue — Contact page with form using Message type fields. -->
<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { sendMessage } from '@/services/messages'
import type { Message } from '@/types'

const name = ref('')
const email = ref('')
const subject = ref('')
const body = ref('')

const submitting = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

async function onSubmit(): Promise<void> {
  submitting.value = true
  error.value = null
  success.value = false
  try {
    await sendMessage({
      name: name.value,
      email: email.value,
      subject: subject.value,
      body: body.value,
    } as Pick<Message, 'name' | 'email' | 'subject' | 'body'>)
    success.value = true
    name.value = ''
    email.value = ''
    subject.value = ''
    body.value = ''
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to send message'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section>
    <h1 class="mb-4 text-2xl font-bold">Contact</h1>
    <form class="max-w-lg space-y-4" @submit.prevent="onSubmit">
      <BaseInput v-model="name" label="Name" />
      <BaseInput v-model="email" label="Email" type="email" />
      <BaseInput v-model="subject" label="Subject" />
      <label class="block">
        <span class="text-sm font-medium">Message</span>
        <textarea
          v-model="body"
          rows="4"
          class="mt-1 block w-full rounded border px-3 py-2"
        />
      </label>
      <div class="flex items-center gap-2">
        <BaseButton :loading="submitting" type="submit">Send</BaseButton>
        <p v-if="success" class="text-green-600">Message sent.</p>
        <p v-if="error" class="text-red-600">{{ error }}</p>
      </div>
    </form>
  </section>
</template>
