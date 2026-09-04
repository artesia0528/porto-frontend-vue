<!-- src/pages/Contact.vue — Contact page with richer portfolio-style content and form. -->
<script setup lang="ts">
import { ref } from 'vue'
import { motion } from 'motion-v'
import { ArrowRight, Clock3, Mail, MapPin, Phone, Send } from '@lucide/vue'
import FormInput from '@/components/FormInput.vue'
import FormTextarea from '@/components/FormTextarea.vue'
import BaseButton from '@/components/BaseButton.vue'
import { sendMessage } from '@/services/messages'
import type { Message } from '@/types'
import { fadeUpSection, staggerContainer, staggerItem } from '@/motion/variants'

const name = ref('')
const email = ref('')
const subject = ref('')
const body = ref('')

const submitting = ref(false)
const success = ref(false)
const error = ref<string | null>(null)

const contactCards = [
  {
    icon: Mail,
    label: 'Email',
    value: 'ditya0518@gmail.com',
    href: 'mailto:ditya0518@gmail.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+62 851-6256-0528',
    href: 'tel:+6285162560528',
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Bali, Indonesia',
    href: 'https://maps.app.goo.gl/DisgmbV1GZZLsMZT7',
  },
] as const

async function onSubmit(): Promise<void> {
  const trimmedName = name.value.trim()
  const trimmedEmail = email.value.trim()
  const trimmedSubject = subject.value.trim()
  const trimmedBody = body.value.trim()

  if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedBody) {
    error.value = 'Please complete all fields before sending your message.'
    success.value = false
    return
  }

  submitting.value = true
  error.value = null
  success.value = false

  try {
    await sendMessage({
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      body: trimmedBody,
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
  <div class="mx-auto max-w-6xl pt-28 pb-20">
    <motion.div v-bind="fadeUpSection">
      <div class="h-1 w-16 rounded bg-sky-600"></div>
      <p class="mt-4 text-sm font-semibold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
        Let’s Talk
      </p>
      <div class="mt-2 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 class="text-3xl font-bold text-neutral-900 sm:text-4xl dark:text-neutral-100">Contact</h1>
          <p class="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-500 sm:text-base dark:text-neutral-400">
            Saya terbuka untuk project freelance, kolaborasi, konsultasi produk, atau sekadar
            diskusi ide dan teknologi.
          </p>
        </div>
      </div>
    </motion.div>

    <div class="mt-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <motion.aside class="space-y-5" v-bind="staggerContainer(0.08)">
        <div class="space-y-4">
          <motion.a
            v-for="item in contactCards"
            :key="item.label"
            v-bind="staggerItem"
            :href="item.href"
            class="group flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-sky-800"
          >
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400"
            >
              <component :is="item.icon" :size="18" />
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500">
                {{ item.label }}
              </p>
              <p class="mt-1 text-sm font-medium text-neutral-700 group-hover:text-sky-700 dark:text-neutral-300 dark:group-hover:text-sky-400">
                {{ item.value }}
              </p>
            </div>
          </motion.a>
        </div>
      </motion.aside>

      <motion.form
        @submit.prevent="onSubmit"
        class="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900"
        v-bind="fadeUpSection"
      >
        <div class="mb-6">
          <p class="text-sm font-semibold tracking-widest text-neutral-400 uppercase dark:text-neutral-500">
            Send message
          </p>
          <h2 class="mt-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100">Tell me about your project</h2>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          <FormInput v-model="name" label="Name" placeholder="Your name" />
          <FormInput v-model="email" label="Email" type="email" placeholder="you@example.com" />
        </div>

        <div class="mt-5">
          <FormInput v-model="subject" label="Subject" placeholder="Project inquiry" />
        </div>

        <div class="mt-5">
          <FormTextarea
            v-model="body"
            label="Message"
            :rows="6"
            placeholder="Tulis detail project, kebutuhan, atau ide yang ingin dibahas..."
          />
        </div>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <BaseButton :loading="submitting" type="submit" class="inline-flex items-center gap-2">
              <Send :size="16" />
              Send Message
            </BaseButton>
          </div>

          <div class="min-h-6 text-sm">
            <p v-if="success" class="text-green-600 dark:text-green-500">Message sent successfully.</p>
            <p v-else-if="error" class="text-red-600 dark:text-red-500">{{ error }}</p>
          </div>
        </div>

        <!-- <div class="mt-6 flex items-center gap-2 text-sm text-neutral-500">
          <span>Prefer email?</span>
          <a
            href="mailto:ditya0518@gmail.com"
            class="inline-flex items-center gap-1 font-medium text-sky-700 hover:underline"
          >
            ditya0518@gmail.com
            <ArrowRight :size="14" />
          </a>
        </div> -->
      </motion.form>
    </div>
  </div>
</template>
